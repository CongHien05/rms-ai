import { PageHeading } from '../layout/PageHeading'
import { Pagination } from '../layout/Pagination'
import { usePagination } from '../layout/usePagination'
import { HrReadStatus } from './HrReadStatus'
import { useHrData } from './useHrData'

export function HrOverview({ onOpenEmployees, onOpenSkills }: {
  onOpenEmployees: () => void
  onOpenSkills: () => void
}) {
  return (
    <section aria-labelledby="hr-overview-title">
      <PageHeading id="hr-overview-title" title="Tổng quan nguồn lực" label="Chỉ xem" />

      <div className="workspace-grid">
        <section className="panel" aria-labelledby="hr-people-title">
          <h2 id="hr-people-title">Nhân sự</h2>
          <p className="muted">Xem từng người, kỹ năng đã khai báo và số giờ còn trống theo tuần.</p>
          <div className="action-group">
            <button className="button button--primary" type="button" onClick={onOpenEmployees}>Xem nhân sự</button>
          </div>
        </section>
        <section className="panel" aria-labelledby="hr-skill-directory-title">
          <h2 id="hr-skill-directory-title">Kỹ năng</h2>
          <p className="muted">Tra cứu danh mục kỹ năng dùng trong RMS-AI.</p>
          <div className="action-group">
            <button className="button button--secondary" type="button" onClick={onOpenSkills}>Xem kỹ năng</button>
          </div>
        </section>
      </div>
    </section>
  )
}

export function HrSkillsView() {
  const { state, retry } = useHrData<{ id: string; name: string }[]>('/api/skills')
  const { items, page, pageCount, setPage } = usePagination(state.status === 'ready' ? state.data : [], 10)

  return (
    <section aria-labelledby="hr-skills-title">
      <PageHeading id="hr-skills-title" title="Kỹ năng" label="Chỉ xem" />

      {state.status === 'loading' && <HrReadStatus status="loading" message="Đang tải kỹ năng…" />}
      {state.status === 'error' && (
        <HrReadStatus status="error" message="Không tải được dữ liệu kỹ năng." retry={retry} />
      )}
      {state.status === 'ready' && (
        state.data.length === 0
          ? <HrReadStatus status="empty" message="Chưa có kỹ năng để hiển thị." />
          : (
            <div className="data-panel">
              <ul className="data-list">
                {items.map(skill => <li key={skill.id}>{skill.name}</li>)}
              </ul>
              <Pagination label="Phân trang kỹ năng" page={page} pageCount={pageCount} setPage={setPage} />
            </div>
          )
      )}
    </section>
  )
}
