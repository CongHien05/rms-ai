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
    <section aria-labelledby="risk-overview-title">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Rủi ro dự án</p>
          <h1 id="risk-overview-title">Tổng quan rủi ro dự án</h1>
          <p className="page-description">
            Xem các đánh giá rủi ro hiện có trước khi mở thông tin chi tiết của
            một dự án.
          </p>
        </div>
        <p className="scope-note">
          Quy tắc hiển thị dự án: Chưa xác định
        </p>
      </header>

      <div className="table-frame">
        <table>
          <caption className="visually-hidden">
            Các dự án minh họa và cách trình bày đánh giá rủi ro hiện tại
          </caption>
          <thead>
            <tr>
              <th scope="col">Dự án</th>
              <th scope="col">Đánh giá rủi ro</th>
              <th scope="col" className="action-column">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>
                  <strong className="project-name">{project.name}</strong>
                </td>
                <td>
                  <span
                    className={`assessment-text assessment-text--${project.assessmentState}`}
                  >
                    {project.assessmentText}
                  </span>
                </td>
                <td className="action-cell">
                  <button
                    type="button"
                    className="button button--secondary"
                    onClick={() => onSelectProject(project.id)}
                    aria-label={`Xem chi tiết rủi ro của ${project.name}`}
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="table-note">
        Cách trình bày đánh giá, thứ tự dự án và phạm vi hiển thị chưa được xác
        định.
      </p>
    </section>
  )
}
