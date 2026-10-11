import type { MockProjectRiskViewModel } from '../project-risk/mockProjectRisks'

type ProjectsViewProps = {
  projects: readonly MockProjectRiskViewModel[]
  onSelectProject: (projectId: string) => void
}

export function ProjectsView({
  projects,
  onSelectProject,
}: ProjectsViewProps) {
  return (
    <section className="workspace-view" aria-labelledby="projects-view-title">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Không gian chung</p>
          <h1 id="projects-view-title">Dự án</h1>
          <p className="page-description">
            Xem các dự án minh họa đang cung cấp ngữ cảnh cho luồng đánh giá
            rủi ro.
          </p>
        </div>
        <p className="scope-note">Dữ liệu minh họa</p>
      </header>

      <div className="workspace-list" role="list">
        {projects.map((project) => (
          <article className="workspace-row" role="listitem" key={project.id}>
            <div className="workspace-row__identity">
              <p className="row-label">Dự án</p>
              <h2>{project.name}</h2>
            </div>
            <div className="workspace-row__status">
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
              aria-label={`Xem ${project.name} trong trung tâm rủi ro`}
            >
              Xem dự án
            </button>
          </article>
        ))}
      </div>

      <p className="workspace-footnote">
        Phạm vi dự án và quy tắc sắp xếp chưa được xác định.
      </p>
    </section>
  )
}
