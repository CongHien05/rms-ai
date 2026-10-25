import { useState } from 'react'
import type { MockProjectRiskViewModel } from '../project-risk/mockProjectRisks'
import type { MockRecommendationCandidatePresentation } from './mockResourceRecommendations'

type SimulationStatus = 'not-run' | 'presented'
type DecisionStatus = 'undecided' | 'accepted' | 'rejected'

type WhatIfSimulationViewProps = {
  project: MockProjectRiskViewModel
  candidate: MockRecommendationCandidatePresentation
  onBack: () => void
  onShowDecision: () => void
}

export function WhatIfSimulationView({
  project,
  candidate,
  onBack,
  onShowDecision,
}: WhatIfSimulationViewProps) {
  const [simulationStatus, setSimulationStatus] =
    useState<SimulationStatus>('not-run')
  const [decisionStatus, setDecisionStatus] =
    useState<DecisionStatus>('undecided')

  const hasResult = simulationStatus === 'presented'
  const hasDecision = decisionStatus !== 'undecided'

  function handleRunSimulation() {
    setSimulationStatus('presented')
    onShowDecision()
  }

  return (
    <section className="simulation-view" aria-labelledby="what-if-title">
      <button type="button" className="back-button" onClick={onBack}>
        Quay lại đề xuất nhân sự
      </button>

      <header className="page-heading">
        <div>
          <p className="eyebrow">
            {project.name} · Bản mẫu trạng thái mô phỏng
          </p>
          <h1 id="what-if-title">Mô phỏng và quyết định</h1>
          <p className="page-description">
            Rà soát cách trình bày tác động trước khi PM ghi nhận quyết định;
            đây không phải kết quả từ simulation engine.
          </p>
        </div>
        <p className="scope-note scope-note--guardrail">
          Phân bổ thật chưa thay đổi
        </p>
      </header>

      <section className="scenario-panel" aria-labelledby="scenario-title">
        <p className="section-index">01</p>
        <div>
          <h2 id="scenario-title">Đề xuất / phương án đang xem</h2>
          <p>
            <strong>{candidate.displayLabel}</strong> là ngữ cảnh minh họa cho
            luồng mô phỏng, không phải phương án phân bổ hoàn chỉnh hoặc đã
            được xác thực.
          </p>
          <p className="tbd-note">
            Cấu trúc và cách hình thành phương án: TBD. Đây chưa phải phân bổ
            thật.
          </p>
        </div>
      </section>

      <div className="simulation-runner">
        <div
          id="simulation-prototype-note"
          className="simulation-guardrail"
          role="note"
        >
          Prototype chỉ chuyển trạng thái cục bộ từ sẵn sàng sang kết quả minh
          họa. Loading, thiếu dữ liệu và thất bại chưa có tương tác; mô phỏng
          không thay đổi dữ liệu phân bổ thật.
        </div>
        <button
          type="button"
          className="button button--primary simulation-action"
          onClick={handleRunSimulation}
          disabled={hasResult}
          aria-describedby="simulation-prototype-note"
        >
          {hasResult
            ? 'Đã hiển thị kết quả minh họa'
            : 'Hiển thị kết quả minh họa'}
        </button>
      </div>

      {hasResult && (
        <>
          <section className="impact-section" aria-labelledby="impact-title">
            <p className="section-index">02</p>
            <div>
              <h2 id="impact-title">Khung tác động dự kiến</h2>
              <p className="tbd-note">
                Nội dung dưới đây là placeholder UI, không phải đầu ra AI.
                Chỉ báo tác động và mốc so sánh: TBD.
              </p>
              <div className="impact-layout">
                <div>
                  <h3>Đánh giá hiện tại</h3>
                  <p>[Cách biểu diễn: Chưa xác định]</p>
                </div>
                <div>
                  <h3>Đánh giá sau mô phỏng</h3>
                  <p>[Cách biểu diễn: Chưa xác định]</p>
                </div>
              </div>
              <p className="simulation-guardrail">Phân bổ thật chưa thay đổi.</p>
            </div>
          </section>

          <section className="decision-section" aria-labelledby="decision-title">
            <p className="section-index">03</p>
            <div>
              <h2 id="decision-title">Quyết định của PM</h2>
              <p>
                Ghi nhận lựa chọn sau khi xem tác động dự kiến.
              </p>
              <div className="decision-actions">
                <button
                  type="button"
                  className="button button--primary"
                  onClick={() => setDecisionStatus('accepted')}
                  disabled={hasDecision}
                >
                  Chấp nhận phương án
                </button>
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={() => setDecisionStatus('rejected')}
                  disabled={hasDecision}
                >
                  Từ chối phương án
                </button>
              </div>
              {decisionStatus === 'accepted' && (
                <div className="decision-status" role="status">
                  PM đã ghi nhận quyết định chấp nhận trong bản mẫu. Điều kiện
                  và thời điểm áp dụng thật chưa được xác định; phân bổ thật
                  chưa thay đổi.
                </div>
              )}
              {decisionStatus === 'rejected' && (
                <div className="decision-status" role="status">
                  PM đã ghi nhận quyết định từ chối trong bản mẫu. Phương án
                  không được áp dụng và phân bổ thật không thay đổi.
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </section>
  )
}
