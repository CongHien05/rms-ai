import { PageHeading } from '../layout/PageHeading'
import type { MockProjectRiskViewModel } from './mockProjectRisks'

type ProjectRiskDetailProps = {
  project: MockProjectRiskViewModel
  onBack: () => void
  onRequestRecommendation: () => void
}

export function ProjectRiskDetail({ project, onBack, onRequestRecommendation }: ProjectRiskDetailProps) {
  const hasAssessment = project.assessmentState === 'available'

  return (
    <section aria-labelledby="risk-detail-title">
      <button type="button" className="back-button" onClick={onBack}>Trung tâm rủi ro</button>
      <PageHeading id="risk-detail-title" title="Chi tiết rủi ro" description={project.name} label="Dữ liệu demo" />

      <div className="detail-sections">
        <section className="detail-section" aria-labelledby="assessment-title">
          <h2 id="assessment-title">Đánh giá rủi ro</h2>
          <div className="assessment-result" role="status">
            <strong>{project.assessmentText}</strong>
            <p className="tbd-note">
              {hasAssessment
                ? 'Thang đo và ngưỡng phân loại vẫn là TBD.'
                : 'Chưa đủ dữ liệu để kết luận mức rủi ro. Điều kiện đánh giá vẫn là TBD.'}
            </p>
          </div>
        </section>

        <section className="detail-section" aria-labelledby="factors-title">
          <h2 id="factors-title">Yếu tố giải thích</h2>
          {hasAssessment ? (
            <ul className="factor-list">
              {project.explanatoryFactors.map(factor => <li key={factor}>{factor}</li>)}
            </ul>
          ) : (
            <p className="empty-copy">Yếu tố giải thích sẽ xuất hiện khi có đánh giá.</p>
          )}
        </section>
      </div>

      <section className="handoff" aria-labelledby="handoff-title">
        <div>
          <h2 id="handoff-title">Đề xuất nhân sự</h2>
          <p className="muted">
            {hasAssessment
              ? 'Xem ứng viên được đề xuất cho dự án này.'
              : 'Bản mẫu vẫn cho phép mở bước này. Điều kiện chuyển bước khi thiếu đánh giá là TBD.'}
          </p>
        </div>
        <button type="button" className="button button--primary" onClick={onRequestRecommendation}>
          Xem đề xuất nhân sự
        </button>
      </section>
    </section>
  )
}
