import type { MockProjectRiskViewModel } from './mockProjectRisks'

type ProjectRiskDetailProps = {
  project: MockProjectRiskViewModel
  onBack: () => void
  onRequestRecommendation: () => void
}

export function ProjectRiskDetail({
  project,
  onBack,
  onRequestRecommendation,
}: ProjectRiskDetailProps) {
  const hasAssessment = project.assessmentState === 'available'

  return (
    <section className="risk-detail" aria-labelledby="risk-detail-title">
      <button type="button" className="back-button" onClick={onBack}>
        Quay lại tổng quan rủi ro
      </button>

      <header className="page-heading page-heading--detail">
        <div>
          <p className="eyebrow">Chi tiết rủi ro</p>
          <h1 id="risk-detail-title">{project.name}</h1>
          <p className="page-description">
            Đánh giá và các yếu tố giải thích trước khi cân nhắc nguồn lực.
          </p>
        </div>
        <p className="scope-note">Dữ liệu minh họa</p>
      </header>

      <div className="detail-sections">
        <section className="detail-section" aria-labelledby="assessment-title">
          <p className="section-index">01</p>
          <div>
            <h2 id="assessment-title">Đánh giá rủi ro</h2>
            {hasAssessment ? (
              <div className="assessment-result">
                <strong>{project.assessmentText}</strong>
                <p>
                  Thang đo, ngưỡng và cách phân loại: TBD.
                </p>
              </div>
            ) : (
              <div className="unavailable-state" role="status">
                <h3>{project.assessmentText}</h3>
                <p>
                  Chưa đủ căn cứ cho kết quả đáng tin cậy. Trạng thái này không
                  có nghĩa dự án an toàn.
                </p>
                <p className="tbd-note">Dữ liệu tối thiểu và bước tiếp theo: TBD.</p>
              </div>
            )}
          </div>
        </section>

        <section className="detail-section" aria-labelledby="factors-title">
          <p className="section-index">02</p>
          <div>
            <h2 id="factors-title">Các yếu tố giải thích chính</h2>
            {hasAssessment ? (
              <>
                <ul className="factor-list">
                  {project.explanatoryFactors.map((factor) => (
                    <li key={factor}>{factor}</li>
                  ))}
                </ul>
                <p className="tbd-note">
                  Thứ tự, mức đóng góp và ý nghĩa nhân quả: TBD.
                </p>
              </>
            ) : (
              <p className="empty-copy">
                Chưa thể hiển thị các yếu tố giải thích khi chưa có đánh giá
                đáng tin cậy.
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="handoff" aria-labelledby="handoff-title">
        <div>
          <p className="eyebrow">Bước tiếp theo</p>
          <h2 id="handoff-title">Đề xuất nhân sự</h2>
          <p id="recommendation-transition-note">
            {hasAssessment
              ? 'Mở đề xuất trong đúng ngữ cảnh dự án. Điều kiện sử dụng: TBD.'
              : 'Điều hướng này chỉ phục vụ rà soát prototype. Khi không thể đánh giá rủi ro, yêu cầu chưa xác nhận việc cho phép hoặc khóa bước đề xuất.'}
          </p>
        </div>
        <button
          type="button"
          className="button button--primary"
          onClick={onRequestRecommendation}
          aria-describedby="recommendation-transition-note"
        >
          {hasAssessment
            ? 'Yêu cầu đề xuất nhân sự'
            : 'Mở bước đề xuất trong bản mẫu'}
        </button>
      </section>
    </section>
  )
}
