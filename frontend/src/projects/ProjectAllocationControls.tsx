import { useLayoutEffect, useState } from 'react'
import { displayExactHours } from '../layout/exactHours'
import { AllocationRequest, type ApplyState } from './allocationRequest'

type Props = { projectId: string; decisionId: string; applied: boolean; onApplied: () => void }

export function ProjectAllocationControls({ projectId, decisionId, applied, onApplied }: Props) {
  const [request] = useState(() => new AllocationRequest(projectId, decisionId))
  const [state, setState] = useState<ApplyState>({ status: 'available' })
  useLayoutEffect(() => () => request.invalidate(), [request])

  function run(method: 'POST' | 'GET') {
    void request.run(method, next => {
      setState(next)
      if (next.status === 'applied') onApplied()
    })
  }

  if (state.status === 'applied') return <p role="status" style={{ overflowWrap: 'anywhere' }}>
    Đã áp dụng {displayExactHours(state.allocation.hoursExact)} giờ.
  </p>
  if (applied) return <p>Đã áp dụng</p>
  return <div className="feedback-panel">
    {state.status === 'available' && <button type="button" className="button button--primary" onClick={() => run('POST')}>Áp dụng phân bổ</button>}
    {state.status === 'pending' && <p role="status">Đang xử lý phân bổ…</p>}
    {'message' in state && <p role="status">{state.message}</p>}
    {state.status === 'unconfirmed' && <button type="button" className="button button--secondary" onClick={() => run('GET')}>Đối chiếu phân bổ</button>}
    {state.status === 'retryable' && <button type="button" className="button button--secondary" onClick={() => run('POST')}>Thử lại phân bổ</button>}
  </div>
}
