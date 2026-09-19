import type { MockProjectRiskViewModel } from './mockProjectRisks'

type ProjectRiskDetailProps = {
  project: MockProjectRiskViewModel
  showHandoffNotice: boolean
  onBack: () => void
  onRequestRecommendation: () => void
}

export function ProjectRiskDetail({
  project,
  showHandoffNotice,
  onBack,
  onRequestRecommendation,
}: ProjectRiskDetailProps) {
  const hasAssessment = project.assessmentState === 'available'

  return (
    <section aria-labelledby="risk-detail-title">
      <button type="button" className="back-button" onClick={onBack}>
        Quay lại tổng quan rủi ro
      </button>

      <header className="page-heading page-heading--detail">
        <div>
          <p className="eyebrow">Chi tiết rủi ro dự án</p>
          <h1 id="risk-detail-title">{project.name}</h1>
          <p className="page-description">
            Xem đánh giá hiện tại và các yếu tố giải thích trước khi cân nhắc
            can thiệp nguồn lực.
          </p>
        </div>
        <p className="scope-note">Dữ liệu [Minh họa]</p>
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
                  Cách biểu diễn cuối cùng, thang đo, ngưỡng và cách phân loại
                  chưa được xác định.
                </p>
              </div>
            ) : (
              <div className="unavailable-state" role="status">
                <h3>Chưa thể đánh giá rủi ro</h3>
                <p>
                  Hiện chưa đủ căn cứ để trình bày một kết quả đánh giá đáng tin
                  cậy. Không được diễn giải trạng thái này là dự án đang an
                  toàn.
                </p>
                <p className="tbd-note">
                  Dữ liệu tối thiểu và hành vi tiếp theo: Chưa xác định.
                </p>
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
                  Định nghĩa, thứ tự, mức đóng góp và ý nghĩa nhân quả của các
                  yếu tố: Chưa xác định.
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
          <p className="eyebrow">Bước tiếp theo trong MVP</p>
          <h2 id="handoff-title">Đề xuất nhân sự</h2>
          <p>
            Bản mẫu hiện tại dừng tại điểm chuyển tiếp này. Điều kiện sử dụng
            thao tác chưa được xác định.
          </p>
        </div>
        <button
          type="button"
          className="button button--primary"
          onClick={onRequestRecommendation}
        >
          Yêu cầu đề xuất nhân sự
        </button>
      </section>

      {showHandoffNotice && (
        <div className="handoff-notice" role="status">
          Đề xuất nhân sự là bước tiếp theo trong luồng MVP và chưa được triển
          khai trong phần bản mẫu hiện tại. Không có yêu cầu nào được gửi và dữ
          liệu phân bổ không thay đổi.
        </div>
      )}
    </section>
  )
}
