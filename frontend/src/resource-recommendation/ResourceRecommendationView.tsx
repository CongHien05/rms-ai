import { PageHeading } from '../layout/PageHeading'
import { Pagination } from '../layout/Pagination'
import { usePagination } from '../layout/usePagination'
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

const pageSize = 6

export function ResourceRecommendationView({
  project,
  recommendation,
  onBack,
  onTryCandidate,
}: ResourceRecommendationViewProps) {
  return (
    <section aria-labelledby="recommendation-title">
      <button type="button" className="back-button" onClick={onBack}>Chi tiết rủi ro</button>
      <PageHeading id="recommendation-title" title="Đề xuất nhân sự" description={project.name} label="Dữ liệu demo" />

      {recommendation.state === 'available' ? (
        <RecommendationList candidates={recommendation.candidates} onTryCandidate={onTryCandidate} />
      ) : (
        <div className="empty-state" role="status">
          <h2>Không có ứng viên phù hợp</h2>
          <p className="tbd-note">Tiêu chí phù hợp và bước tiếp theo vẫn là TBD.</p>
        </div>
      )}
    </section>
  )
}

function RecommendationList({ candidates, onTryCandidate }: {
  candidates: readonly MockRecommendationCandidatePresentation[]
  onTryCandidate: (candidateId: string) => void
}) {
  const { items, page, pageCount, setPage } = usePagination(candidates, pageSize)

  return (
    <section aria-labelledby="candidate-list-title">
      <div className="section-heading">
        <h2 id="candidate-list-title">Ứng viên theo thứ hạng</h2>
        <p className="tbd-note">Quy tắc xếp hạng vẫn là TBD.</p>
      </div>
      <div className="data-panel">
        <ol className="data-list" start={(page - 1) * pageSize + 1}>
          {items.map((candidate, index) => (
            <li className="recommendation-row" key={candidate.id}>
              <span className="recommendation-rank" aria-label={`Hạng ${(page - 1) * pageSize + index + 1}`}>
                {(page - 1) * pageSize + index + 1}
              </span>
              <div>
                <h3>{candidate.displayLabel}</h3>
                <p className="recommendation-explanation muted">{candidate.explanation}</p>
              </div>
              <button type="button" className="button button--secondary" onClick={() => onTryCandidate(candidate.id)}
                aria-label={`Mở mô phỏng cho ${candidate.displayLabel}`}>
                Mở mô phỏng
              </button>
            </li>
          ))}
        </ol>
        <Pagination label="Phân trang ứng viên" page={page} pageCount={pageCount} setPage={setPage} />
      </div>
    </section>
  )
}
