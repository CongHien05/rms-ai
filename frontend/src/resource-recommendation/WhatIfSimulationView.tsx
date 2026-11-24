import { useState } from 'react'
import { PageHeading } from '../layout/PageHeading'
import type { MockProjectRiskViewModel } from '../project-risk/mockProjectRisks'
import type { MockRecommendationCandidatePresentation } from './mockResourceRecommendations'
import { WhatIfSimulationPanels } from './WhatIfSimulationPanels'

type DecisionStatus = 'undecided' | 'accepted' | 'rejected'

type WhatIfSimulationViewProps = {
  project: MockProjectRiskViewModel
  candidate: MockRecommendationCandidatePresentation
  onBack: () => void
  onShowDecision: () => void
}

export function WhatIfSimulationView({ project, candidate, onBack, onShowDecision }: WhatIfSimulationViewProps) {
  const [hasResult, setHasResult] = useState(false)
  const [decisionStatus, setDecisionStatus] = useState<DecisionStatus>('undecided')
  const hasDecision = decisionStatus !== 'undecided'

  function handleRunSimulation() {
    setHasResult(true)
    onShowDecision()
  }

  return (
    <section aria-labelledby="what-if-title">
      <button type="button" className="back-button" onClick={onBack}>Đề xuất nhân sự</button>
      <PageHeading id="what-if-title" title={hasResult ? 'Quyết định' : 'Mô phỏng'}
        description={project.name} label="Dữ liệu demo" />

      <WhatIfSimulationPanels scenario={<>
          <p><strong>{candidate.displayLabel}</strong></p>
          <p className="muted">{candidate.explanation}</p>
          <p className="tbd-note">Cấu trúc phân bổ của phương án vẫn là TBD.</p>
          {!hasResult && (
            <button type="button" className="button button--primary" onClick={handleRunSimulation}>
              Hiển thị kết quả demo
            </button>
          )}
        </>} impact={hasResult ? (
            <>
              <div className="impact-layout">
                <div>
                  <h3>Đánh giá hiện tại</h3>
                  <p className="muted">{project.assessmentText}</p>
                </div>
                <div>
                  <h3>Đánh giá sau mô phỏng</h3>
                  <p className="muted">Chỉ báo tác động vẫn là TBD.</p>
                </div>
              </div>
              <p className="tbd-note">Mô phỏng chỉ hiển thị trạng thái minh họa. Phân bổ thật chưa thay đổi.</p>
            </>
          ) : (
            <p className="empty-copy">Hiển thị kết quả demo để xem phần so sánh và mở bước quyết định.</p>
          )} />

      {hasResult && (
        <section className="decision-section" aria-labelledby="decision-title">
          <h2 id="decision-title">Quyết định của PM</h2>
          <p className="muted">Lựa chọn chỉ được ghi nhận trong phiên demo. Điều kiện áp dụng phân bổ vẫn là TBD.</p>
          {!hasDecision ? (
            <div className="action-group decision-actions">
              <button type="button" className="button button--primary" onClick={() => setDecisionStatus('accepted')}>
                Chấp nhận phương án
              </button>
              <button type="button" className="button button--secondary" onClick={() => setDecisionStatus('rejected')}>
                Từ chối phương án
              </button>
            </div>
          ) : (
            <p className={`decision-status status-badge${decisionStatus === 'accepted' ? ' status-badge--success' : ''}`} role="status">
              {decisionStatus === 'accepted' ? 'Đã chấp nhận trong bản mẫu' : 'Đã từ chối trong bản mẫu'}
            </p>
          )}
        </section>
      )}
    </section>
  )
}
