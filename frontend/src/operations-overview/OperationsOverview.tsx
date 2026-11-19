import { PageHeading } from '../layout/PageHeading'
import type { MockProjectRiskViewModel } from '../project-risk/mockProjectRisks'

type OperationsOverviewProps = {
  featuredProject: MockProjectRiskViewModel
  projects: readonly MockProjectRiskViewModel[]
  onOpenProjects: () => void
  onOpenRiskOverview: () => void
  onSelectProject: (projectId: string) => void
}

export function OperationsOverview({
  featuredProject,
  projects,
  onOpenProjects,
  onOpenRiskOverview,
  onSelectProject,
}: OperationsOverviewProps) {
  return (
    <section aria-labelledby="operations-title">
      <PageHeading id="operations-title" title="Tổng quan"
        description="Mở danh sách dự án hoặc rà soát luồng đánh giá và đề xuất nhân sự." />

      <div className="workspace-grid">
        <section className="panel" aria-labelledby="operations-projects-title">
          <h2 id="operations-projects-title">Dự án</h2>
          <p className="muted">Quản lý Sprint, công việc và đánh giá rủi ro theo dự án.</p>
          <div className="action-group">
            <button type="button" className="button button--primary" onClick={onOpenProjects}>
              Xem danh sách dự án
            </button>
          </div>
        </section>
        <section className="panel" aria-labelledby="operations-risk-title">
          <h2 id="operations-risk-title">Trung tâm rủi ro</h2>
          <p className="muted">Xem đánh giá, đề xuất nhân sự, mô phỏng và quyết định.</p>
          <div className="action-group">
            <button type="button" className="button button--secondary" onClick={onOpenRiskOverview}>
              Mở trung tâm rủi ro
            </button>
          </div>
        </section>
      </div>

      <section className="overview-examples" aria-labelledby="operations-examples-title">
        <div className="section-heading">
          <h2 id="operations-examples-title">Đánh giá mẫu</h2>
          <span className="scope-note">Dữ liệu demo</span>
        </div>
        <ul className="workspace-list">
          {[featuredProject, ...projects].map(project => (
            <li className="workspace-row" key={project.id}>
              <strong>{project.name}</strong>
              <button type="button" className="button button--secondary"
                onClick={() => onSelectProject(project.id)} aria-label={`Xem đánh giá của ${project.name}`}>
                Xem đánh giá
              </button>
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}
