import type { MockProjectRiskViewModel } from '../project-risk/mockProjectRisks'

type OperationsOverviewProps = {
  featuredProject: MockProjectRiskViewModel
  projects: readonly MockProjectRiskViewModel[]
  onOpenRiskOverview: () => void
  onSelectProject: (projectId: string) => void
}

const workflowStages = ['Rủi ro', 'Đề xuất', 'Mô phỏng', 'Quyết định']

export function OperationsOverview({
  featuredProject,
  projects,
  onOpenRiskOverview,
  onSelectProject,
}: OperationsOverviewProps) {
  return (
    <section className="operations-overview" aria-labelledby="operations-title">
      <header className="page-heading operations-heading">
        <div>
          <p className="eyebrow">PM · Bản mẫu giao diện · Dữ liệu minh họa</p>
          <h1 id="operations-title">Tổng quan vận hành</h1>
          <p className="page-description">
            Điểm vào cho dự án, rủi ro và luồng hỗ trợ quyết định.
          </p>
        </div>
        <button
          type="button"
          className="button button--secondary"
          onClick={onOpenRiskOverview}
        >
          Mở trung tâm rủi ro
        </button>
      </header>

      <div className="operations-summary">
        <section
          className="operations-panel operations-panel--attention"
          aria-labelledby="attention-title"
        >
          <p className="panel-label">Dự án minh họa để rà soát</p>
          <h2 id="attention-title">{featuredProject.name}</h2>
          <p
            className={`attention-status attention-status--${featuredProject.assessmentState}`}
          >
            {featuredProject.assessmentText}
          </p>
          <p className="tbd-note">
            Đây không phải ưu tiên vận hành. Quy tắc chọn dự án cần chú ý: TBD.
          </p>
          <button
            type="button"
            className="button button--primary"
            onClick={() => onSelectProject(featuredProject.id)}
          >
            Xem đánh giá
          </button>
        </section>

        <section className="operations-panel operations-panel--status" aria-labelledby="activity-title">
          <p className="panel-label">Hoạt động gần đây · Chưa kết nối</p>
          <h2 id="activity-title">Không có dữ liệu vận hành</h2>
          <p className="activity-empty">
            Bản mẫu không ghi nhận sự kiện thật. Nguồn và phạm vi hoạt động: TBD.
          </p>
        </section>
      </div>

      <section className="workflow-overview" aria-labelledby="workflow-title">
        <div className="workflow-overview__heading">
          <p className="section-index">Luồng hỗ trợ quyết định</p>
          <h2 id="workflow-title">Từ tín hiệu rủi ro đến quyết định của PM</h2>
        </div>
        <ol className="workflow-overview__stages">
          {workflowStages.map((stage, index) => (
            <li key={stage}>
              <span className="workflow-overview__number">0{index + 1}</span>
              <strong>{stage}</strong>
            </li>
          ))}
        </ol>
      </section>

      <section className="project-directory" aria-labelledby="projects-title">
        <div className="section-heading project-directory__heading">
          <div>
            <p className="section-index">Danh mục</p>
            <h2 id="projects-title">Dự án</h2>
          </div>
          <p className="tbd-note">Thứ tự hiển thị: TBD.</p>
        </div>

        <ul className="project-directory__list">
          {projects.map((project) => (
            <li key={project.id}>
              <button
                type="button"
                className="project-directory__button"
                onClick={() => onSelectProject(project.id)}
              >
                <span>{project.name}</span>
                <span className="project-directory__action">Xem dự án <span aria-hidden="true">→</span></span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}
