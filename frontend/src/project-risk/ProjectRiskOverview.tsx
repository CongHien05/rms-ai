import type { MockProjectRiskViewModel } from './mockProjectRisks'

type ProjectRiskOverviewProps = {
  projects: readonly MockProjectRiskViewModel[]
  onSelectProject: (projectId: string) => void
}

export function ProjectRiskOverview({
  projects,
  onSelectProject,
}: ProjectRiskOverviewProps) {
  return (
    <section className="risk-overview" aria-labelledby="risk-overview-title">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Không gian quyết định</p>
          <h1 id="risk-overview-title">Trung tâm rủi ro</h1>
          <p className="page-description">
            Rà soát đánh giá hiện có và mở đúng dự án cần xem xét.
          </p>
        </div>
        <p className="scope-note">Dữ liệu minh họa</p>
      </header>

      <div className="risk-register" role="list">
        {projects.map((project) => (
          <article className="risk-row" role="listitem" key={project.id}>
            <div className="risk-row__project">
              <p className="row-label">Dự án</p>
              <h2>{project.name}</h2>
            </div>
            <div className="risk-row__assessment">
              <p className="row-label">Đánh giá rủi ro</p>
              <p
                className={`assessment-status assessment-status--${project.assessmentState}`}
              >
                {project.assessmentText}
              </p>
            </div>
            <button
              type="button"
              className="row-action"
              onClick={() => onSelectProject(project.id)}
              aria-label={`Xem chi tiết rủi ro của ${project.name}`}
            >
              Xem đánh giá
            </button>
          </article>
        ))}
      </div>

      <p className="workspace-footnote">
        Cách trình bày đánh giá, thứ tự dự án và phạm vi hiển thị chưa được xác
        định.
      </p>
    </section>
  )
}
