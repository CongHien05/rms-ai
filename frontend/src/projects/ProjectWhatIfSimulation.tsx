import { useEffect, useId, useState, type FormEvent } from 'react'
import { formatCalendarDate } from '../layout/formatCalendarDate'
import { WhatIfSimulationPanels } from '../resource-recommendation/WhatIfSimulationPanels'
import { SimulationRun, type SimulationInput, type SimulationState } from './simulationRun'
import { ProjectDecisionControls } from './ProjectDecisionControls'
import { displayExactHours, exactHoursInput, parseHoursInput } from '../layout/exactHours'

type Props = {
  scenario: Omit<SimulationInput, 'supportHours' | 'supportHoursExact'>
  suggestedHours: number
  suggestedHoursExact?: string
  employeeName: string
  skillName: string
  initiallyStale: boolean
  onDecisionSaved: () => void
  onShowHistory: () => void
}

const hours = new Intl.NumberFormat('vi-VN', { maximumSignificantDigits: 17 })

export function ProjectWhatIfSimulation({
  scenario, suggestedHours, suggestedHoursExact, employeeName, skillName, initiallyStale, onDecisionSaved, onShowHistory,
}: Props) {
  const heading = useId()
  const [run] = useState(() => new SimulationRun())
  const [input, setInput] = useState(suggestedHoursExact ? exactHoursInput(suggestedHoursExact) : String(suggestedHours))
  const [state, setState] = useState<SimulationState>({ status: initiallyStale ? 'stale' : 'idle' })
  useEffect(() => () => run.invalidate(), [run])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const supportHours = Number(input)
    const supportHoursExact = parseHoursInput(input)
    if (!Number.isFinite(supportHours) || !supportHoursExact) {
      run.invalidate()
      setState({ status: 'invalid', message: 'Số giờ hỗ trợ phải là số hữu hạn lớn hơn 0.' })
      return
    }
    void run.execute({ ...scenario, supportHours, supportHoursExact }, setState)
  }

  const impact = state.status === 'success' ? (
    <div className="impact-layout" style={{ overflowWrap: 'anywhere' }}>
      <div><h3>Giờ hỗ trợ giả định</h3><p>{state.impactExact ? displayExactHours(state.impactExact.hypotheticalSupportHours) : hours.format(state.impact.hypotheticalSupportHours)} giờ</p></div>
      <div><h3>Giờ cần còn thiếu</h3><p>{state.impactExact ? displayExactHours(state.impactExact.remainingRequiredHours) : hours.format(state.impact.remainingRequiredHours)} giờ</p></div>
      <div><h3>Giờ trống giả định còn lại</h3><p>{state.impactExact ? displayExactHours(state.impactExact.remainingAvailableHours) : hours.format(state.impact.remainingAvailableHours)} giờ</p></div>
    </div>
  ) : null

  return (
    <section aria-labelledby={heading}>
      <div className="section-heading">
        <h2 id={heading}>Mô phỏng What-if</h2>
        <span className="scope-note">Mô phỏng giả định</span>
      </div>
      <WhatIfSimulationPanels scenario={<>
        <p><strong>{employeeName}</strong></p>
        <p className="muted">{skillName} · Tuần {formatCalendarDate(scenario.weekStart)} · Cần {hours.format(scenario.requiredHours)} giờ</p>
        <form onSubmit={submit} noValidate>
          <label>
            Số giờ hỗ trợ giả định
            <input type="number" required step="any" value={input} onChange={(event) => {
              run.invalidate()
              setInput(event.target.value)
              setState({ status: 'stale' })
            }} />
          </label>
          <button type="submit" className="button button--primary" disabled={state.status === 'loading'}>
            {state.status === 'error' || state.status === 'missing' ? 'Thử lại mô phỏng' : 'Xác nhận và mô phỏng'}
          </button>
        </form>
      </>} impact={<>
        {state.status === 'idle' && <p className="empty-copy">Xác nhận số giờ để xem tác động giả định.</p>}
        {state.status === 'loading' && <p role="status">Đang tính tác động…</p>}
        {state.status === 'stale' && <p role="status">Phương án đã thay đổi. Xác nhận lại để xem kết quả mới.</p>}
        {(state.status === 'invalid' || state.status === 'missing' || state.status === 'error') &&
          <p className="field-error" role="alert">{state.message}</p>}
        {impact}
        {state.status === 'success' && (state.evidence
          ? <ProjectDecisionControls key={state.evidence.simulationId} projectId={scenario.projectId}
              evidence={state.evidence} onDecisionSaved={onDecisionSaved} onShowHistory={onShowHistory} />
          : <p className="empty-copy" role="status">Chưa thể ghi quyết định cho lượt này. Bạn có thể mô phỏng lại.</p>)}
      </>} />
    </section>
  )
}
