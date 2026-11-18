import { useEffect, useRef, useState } from 'react'

type RiskAssessment = {
  projectId: string
  assessmentDate: string
  eligibleTaskCount: number
  openTasksMissingDeadline: number
} & (
  | { status: 'scored'; probability: number; modelVersion: string }
  | { status: 'missing_deadlines' | 'no_tasks_due_in_window'; probability: null; modelVersion: null }
)

type State =
  | { status: 'idle' | 'loading' | 'error' }
  | { status: 'ready'; assessment: RiskAssessment }

const percent = new Intl.NumberFormat('vi-VN', { style: 'percent', maximumFractionDigits: 2 })

export function ProjectRiskAssessment({ projectId }: { projectId: string }) {
  const [state, setState] = useState<State>({ status: 'idle' })
  const active = useRef<AbortController | null>(null)

  useEffect(() => () => active.current?.abort(), [])

  async function assess() {
    if (active.current) return
    const request = new AbortController()
    active.current = request
    setState({ status: 'loading' })

    try {
      const response = await fetch(`/api/projects/${projectId}/risk-assessments`, {
        method: 'POST',
        signal: request.signal,
      })
      if (!response.ok) throw new Error('Risk assessment failed.')
      const assessment: RiskAssessment = await response.json()
      if (assessment.projectId !== projectId) throw new Error('Project mismatch.')
      if (!request.signal.aborted) setState({ status: 'ready', assessment })
    } catch {
      if (!request.signal.aborted) setState({ status: 'error' })
    } finally {
      active.current = null
    }
  }

  const assessment = state.status === 'ready' ? state.assessment : null
  return (
    <section className="project-risk-panel" aria-labelledby="project-risk-title">
      <h2 id="project-risk-title">Nguy cơ phát sinh Task quá hạn trong 7 ngày tới</h2>
      <p>Mô hình demo được huấn luyện bằng dữ liệu giả lập.</p>
      {state.status === 'error' && (
        <p role="alert" className="field-error">Dịch vụ đánh giá rủi ro chưa trả kết quả. Vui lòng thử lại.</p>
      )}
      <button
        className="button button--secondary"
        type="button"
        disabled={state.status === 'loading'}
        onClick={() => void assess()}
      >
        {state.status === 'error' ? 'Thử lại đánh giá rủi ro' : 'Đánh giá rủi ro'}
      </button>
      {state.status === 'loading' && <p role="status">Đang đánh giá rủi ro…</p>}
      {assessment && (
        <div role="status">
          <p>Ngày đánh giá (giờ Việt Nam) <time dateTime={assessment.assessmentDate}>{assessment.assessmentDate}</time></p>
          {assessment.status === 'scored' && (
            <>
              <p>Xác suất <strong>{percent.format(assessment.probability)}</strong></p>
              <p>Phiên bản model <code>{assessment.modelVersion}</code></p>
            </>
          )}
          {assessment.status === 'missing_deadlines' && (
            <p>Chưa đủ dữ liệu. Có {assessment.openTasksMissingDeadline} Task đang mở thiếu hạn hoàn thành.</p>
          )}
          {assessment.status === 'no_tasks_due_in_window' && (
            <p>Không có Task đang mở đến hạn trong 7 ngày tới.</p>
          )}
        </div>
      )}
    </section>
  )
}
