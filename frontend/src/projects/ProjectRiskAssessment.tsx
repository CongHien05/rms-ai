import { apiFetch } from '../auth/session.ts'
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

export function ProjectRiskAssessment({ projectId }: { readonly projectId: string }) {
  const [state, setState] = useState<State>({ status: 'idle' })
  const [showPanel, setShowPanel] = useState(false)
  const active = useRef<AbortController | null>(null)

  useEffect(() => () => active.current?.abort(), [])

  async function assess() {
    if (active.current) return
    const request = new AbortController()
    active.current = request
    setState({ status: 'loading' })
    setShowPanel(true)

    try {
      const response = await apiFetch(`/api/projects/${projectId}/risk-assessments`, {
        method: 'POST',
        signal: request.signal,
      })
      if (!response.ok) throw new Error('Risk assessment failed.')
      const assessment: RiskAssessment = await response.json()
      if (assessment.projectId !== projectId) throw new Error('Project mismatch.')
      if (!request.signal.aborted) {
        setState({ status: 'ready', assessment })
      }
    } catch {
      if (!request.signal.aborted) {
        setState({ status: 'error' })
      }
    } finally {
      active.current = null
    }
  }

  const assessment = state.status === 'ready' ? state.assessment : null

  return (
    <div className="project-risk-widget">
      <button
        className="button button--primary"
        type="button"
        disabled={state.status === 'loading'}
        aria-expanded={showPanel}
        aria-controls={showPanel ? 'project-risk-panel' : undefined}
        onClick={() => void assess()}
      >
        {state.status === 'loading' ? 'Đang đánh giá…' : 'Đánh giá rủi ro'}
      </button>

      {/* Kết quả rủi ro mở trong panel có thể đóng */}
      {showPanel && (
        <section
          className="panel project-risk-panel"
          id="project-risk-panel"
          aria-labelledby="project-risk-title"
        >
          <div className="project-risk-panel__header">
            <h2 id="project-risk-title" className="project-risk-panel__title">
              Nguy cơ có công việc quá hạn trong 7 ngày tới
            </h2>
            <button
              type="button"
              className="button button--secondary button--sm"
              onClick={() => setShowPanel(false)}
              aria-label="Đóng bảng kết quả rủi ro"
              title="Đóng bảng kết quả"
            >
              Đóng
            </button>
          </div>

          <p className="muted">
            Mô hình demo được huấn luyện bằng dữ liệu giả lập.
          </p>

          {state.status === 'loading' && (
            <p role="status">
              Đang đánh giá rủi ro…
            </p>
          )}

          {state.status === 'error' && (
            <div className="project-risk-panel__error" role="alert">
              <p className="field-error">
                Dịch vụ đánh giá rủi ro chưa trả kết quả. Vui lòng thử lại.
              </p>
              <button
                className="button button--secondary button--sm"
                type="button"
                onClick={() => void assess()}
              >
                Thử lại
              </button>
            </div>
          )}

          {assessment && (
            <div role="status" className="project-risk-panel__content">
              <div className="project-risk-grid">
                <div className="project-risk-item">
                  <span className="project-risk-item__label">Thời điểm đánh giá (giờ Việt Nam)</span>
                  <span className="project-risk-item__value">
                    <time dateTime={assessment.assessmentDate}>{assessment.assessmentDate}</time>
                  </span>
                </div>

                {assessment.status === 'scored' && (
                  <>
                    <div className="project-risk-item">
                      <span className="project-risk-item__label">Xác suất có công việc quá hạn</span>
                      <span className="project-risk-item__value">
                        <strong>{percent.format(assessment.probability)}</strong>
                      </span>
                    </div>
                    <div className="project-risk-item">
                      <span className="project-risk-item__label">Phiên bản mô hình</span>
                      <span className="project-risk-item__value">
                        <code>{assessment.modelVersion}</code>
                      </span>
                    </div>
                  </>
                )}

                {assessment.status === 'missing_deadlines' && (
                  <div className="project-risk-item project-risk-item--warning">
                    <span className="project-risk-item__label">Dữ liệu đầu vào</span>
                    <span className="project-risk-item__value">
                      Chưa đủ dữ liệu. Có {assessment.openTasksMissingDeadline} công việc đang mở thiếu hạn hoàn thành.
                    </span>
                  </div>
                )}

                {assessment.status === 'no_tasks_due_in_window' && (
                  <div className="project-risk-item">
                    <span className="project-risk-item__label">Dữ liệu đầu vào</span>
                    <span className="project-risk-item__value">
                      Không có công việc đang mở đến hạn trong 7 ngày tới.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
