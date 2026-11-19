import { PageHeading } from '../layout/PageHeading'
import type { MockProjectRiskViewModel } from './mockProjectRisks'

type ProjectRiskOverviewProps = {
  projects: readonly MockProjectRiskViewModel[]
  onSelectProject: (projectId: string) => void
}

export function ProjectRiskOverview({ projects, onSelectProject }: ProjectRiskOverviewProps) {
  return (
    <section aria-labelledby="risk-overview-title">
      <PageHeading id="risk-overview-title" title="Trung tâm rủi ro"
        description="Chọn một dự án mẫu để xem đánh giá và các yếu tố liên quan." label="Dữ liệu demo" />

      <ul className="risk-register">
        {projects.map(project => (
          <li className="risk-row" key={project.id}>
            <h2>{project.name}</h2>
            <div className="risk-row__assessment">
              <span className="status-badge">{project.assessmentText}</span>
            </div>
            <button type="button" className="button button--secondary"
              onClick={() => onSelectProject(project.id)} aria-label={`Xem đánh giá của ${project.name}`}>
              Xem đánh giá
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
