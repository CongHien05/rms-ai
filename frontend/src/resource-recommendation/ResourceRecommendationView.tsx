import type { MockProjectRiskViewModel } from '../project-risk/mockProjectRisks'
import type {
  MockRecommendationCandidatePresentation,
  MockResourceRecommendationPresentation,
} from './mockResourceRecommendations'

type ResourceRecommendationViewProps = {
  project: MockProjectRiskViewModel
  recommendation: MockResourceRecommendationPresentation
  onBack: () => void
  onTryCandidate: (candidateId: string) => void
}

export function ResourceRecommendationView({
  project,
  recommendation,
  onBack,
  onTryCandidate,
}: ResourceRecommendationViewProps) {
  return (
    <section aria-labelledby="recommendation-title">
      <button type="button" className="back-button" onClick={onBack}>
        Quay lại chi tiết rủi ro
      </button>

      <header className="page-heading">
        <div>
          <p className="eyebrow">Bước tiếp theo trong MVP</p>
          <h1 id="recommendation-title">Đề xuất nhân sự</h1>
          <p className="page-description">
            Xem các ứng viên được đề xuất cho {project.name} và lý do phù hợp ở
            mức cơ bản.
          </p>
        </div>
        <p className="scope-note">Dữ liệu [Minh họa]</p>
      </header>

      {recommendation.state === 'available' ? (
        <RecommendationList
          candidates={recommendation.candidates}
          onTryCandidate={onTryCandidate}
        />
      ) : (
        <div className="unavailable-state" role="status">
          <h2>Không có ứng viên phù hợp</h2>
          <p>
            Hệ thống không đưa ứng viên không phù hợp vào danh sách chỉ để có
            kết quả.
          </p>
          <p className="tbd-note">
            Tiêu chí phù hợp và hành động tiếp theo: Chưa xác định.
          </p>
        </div>
      )}
    </section>
  )
}

type RecommendationListProps = {
  candidates: readonly MockRecommendationCandidatePresentation[]
  onTryCandidate: (candidateId: string) => void
}

function RecommendationList({
  candidates,
  onTryCandidate,
}: RecommendationListProps) {
  return (
    <section aria-labelledby="candidate-list-title">
      <div className="section-heading">
        <div>
          <p className="section-index">01</p>
          <h2 id="candidate-list-title">Danh sách ứng viên có thứ hạng</h2>
        </div>
        <p className="tbd-note">
          Quy tắc xếp hạng và số lượng ứng viên: Chưa xác định.
        </p>
      </div>

      <ol className="recommendation-list">
        {candidates.map((candidate, index) => (
          <li className="recommendation-card" key={candidate.id}>
            <span className="recommendation-rank" aria-label={`Hạng ${index + 1}`}>
              {index + 1}
            </span>
            <div className="recommendation-card__content">
              <h3>{candidate.displayLabel}</h3>
              <p className="recommendation-explanation">
                {candidate.explanation}
              </p>
              <p className="tbd-note">
                Thông tin nhận diện ứng viên và cấu trúc phương án phân bổ:
                Chưa xác định.
              </p>
            </div>
            <button
              type="button"
              className="button button--secondary"
              onClick={() => onTryCandidate(candidate.id)}
            >
              Thử phương án minh họa
            </button>
          </li>
        ))}
      </ol>
    </section>
  )
}
