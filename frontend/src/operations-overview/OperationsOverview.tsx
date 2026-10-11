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
          <p className="eyebrow">Giao diện đề xuất · Dữ liệu minh họa</p>
          <h1 id="operations-title">Tổng quan vận hành</h1>
        </div>
        <button
          type="button"
          className="button button--secondary"
          onClick={onOpenRiskOverview}
        >
          Xem tất cả đánh giá
        </button>
      </header>

      <div className="operations-summary">
        <section
          className="operations-panel operations-panel--attention"
          aria-labelledby="attention-title"
        >
          <p className="panel-label">Dự án cần chú ý</p>
          <h2 id="attention-title">{featuredProject.name}</h2>
          <p
            className={`attention-status attention-status--${featuredProject.assessmentState}`}
          >
            {featuredProject.assessmentText}
          </p>
          <p className="tbd-note">
            Lý do, mức độ ưu tiên và quy tắc chọn dự án: Chưa xác định.
          </p>
          <button
            type="button"
            className="button button--primary"
            onClick={() => onSelectProject(featuredProject.id)}
          >
            Xem đánh giá
          </button>
        </section>

        <section className="operations-panel" aria-labelledby="activity-title">
          <p className="panel-label">Hoạt động gần đây</p>
          <h2 id="activity-title">Chưa có hoạt động minh họa</h2>
          <p className="activity-empty">
            Nguồn dữ liệu và phạm vi hoạt động cần hiển thị đang để TBD.
          </p>
        </section>
      </div>

      <section className="project-directory" aria-labelledby="projects-title">
        <div className="section-heading project-directory__heading">
          <div>
            <p className="section-index">Danh mục</p>
            <h2 id="projects-title">Dự án</h2>
          </div>
          <p className="tbd-note">Quy tắc hiển thị và thứ tự: Chưa xác định.</p>
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
                <span className="project-directory__action">Xem dự án</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="workflow-overview" aria-labelledby="workflow-title">
        <div className="workflow-overview__heading">
          <p className="section-index">Luồng MVP</p>
          <h2 id="workflow-title" className="visually-hidden">
            Luồng hỗ trợ quyết định RMS-AI
          </h2>
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
    </section>
  )
}
