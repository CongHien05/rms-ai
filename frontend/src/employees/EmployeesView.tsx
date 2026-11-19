import { HrReadStatus } from '../hr-workspace/HrReadStatus'
import { useHrData } from '../hr-workspace/useHrData'
import { formatCalendarDate } from '../layout/formatCalendarDate'
import { PageHeading } from '../layout/PageHeading'
import { Pagination } from '../layout/Pagination'
import { usePagination } from '../layout/usePagination'
import './employees.css'

type EmployeeDirectory = {
  weekStart: string
  weekEnd: string
  employees: {
    id: string
    displayName: string
    skills: { id: string; name: string }[]
    availability: { weekStart: string; hours: number } | null
  }[]
}

const hoursFormat = new Intl.NumberFormat('vi-VN', { maximumSignificantDigits: 15 })
function WeekDate({ value }: { value: string }) {
  return <time dateTime={value}>{formatCalendarDate(value)}</time>
}

export function EmployeesView() {
  const { state, retry } = useHrData<EmployeeDirectory>('/api/employees/availability')
  const directory = state.status === 'ready' ? state.data : null
  const { items, page, pageCount, setPage } = usePagination(directory?.employees ?? [], 8)

  return (
    <section aria-labelledby="employees-view-title">
      <PageHeading id="employees-view-title" title="Nhân sự"
        description="Kỹ năng và số giờ còn có thể nhận thêm của từng người." label="Dữ liệu minh họa" />

      {state.status === 'loading' && <HrReadStatus status="loading" message="Đang tải nhân sự…" />}
      {state.status === 'error' && (
        <HrReadStatus status="error" message="Không tải được dữ liệu nhân sự." retry={retry} />
      )}
      {directory && (
        <>
          <p className="employee-week" id="hr-availability-week">
            Tuần hiện tại: <strong><WeekDate value={directory.weekStart} /> – <WeekDate value={directory.weekEnd} /></strong>
            <span className="muted"> · Giờ Việt Nam</span>
          </p>
          {directory.employees.length === 0 ? (
            <HrReadStatus status="empty" message="Chưa có nhân sự để hiển thị." />
          ) : (
            <div className="data-panel employee-directory">
              <table className="table" role="table" aria-describedby="hr-availability-week">
                <thead role="rowgroup">
                  <tr role="row">
                    <th scope="col" role="columnheader">Tên nhân sự</th>
                    <th scope="col" role="columnheader">Kỹ năng</th>
                    <th scope="col" role="columnheader">Tuần khai báo</th>
                    <th scope="col" role="columnheader">Giờ trống tuần này</th>
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {items.map(({ id, displayName, skills, availability }) => (
                    <tr key={id} role="row">
                      <th scope="row" role="rowheader">{displayName}</th>
                      <td role="cell">
                        <span className="employee-cell-label" aria-hidden="true">Kỹ năng</span>
                        {skills.length ? skills.map(skill => skill.name).join(', ') : <span className="muted">Chưa có kỹ năng</span>}
                      </td>
                      <td role="cell">
                        <span className="employee-cell-label" aria-hidden="true">Tuần khai báo</span>
                        {availability ? <WeekDate value={availability.weekStart} /> : <span className="muted">Chưa khai báo</span>}
                      </td>
                      <td role="cell">
                        <span className="employee-cell-label" aria-hidden="true">Giờ trống</span>
                        {availability === null ? (
                          <span className="status-badge">Chưa khai báo</span>
                        ) : availability.weekStart !== directory.weekStart ? (
                          <span className="status-badge status-badge--warning">Dữ liệu khác tuần</span>
                        ) : (
                          <strong className="employee-hours">{hoursFormat.format(availability.hours)} giờ</strong>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination label="Phân trang nhân sự" page={page} pageCount={pageCount} setPage={setPage} />
            </div>
          )}
        </>
      )}
    </section>
  )
}
