import { HrReadStatus } from '../hr-workspace/HrReadStatus'
import { useHrData } from '../hr-workspace/useHrData'
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

export function EmployeesView() {
  const { state, retry } = useHrData<EmployeeDirectory>('/api/employees/availability')
  const directory = state.status === 'ready' ? state.data : null

  return (
    <section className="workspace-view" aria-labelledby="employees-view-title">
      <header className="page-heading">
        <div>
          <p className="eyebrow">HR · Nền tảng dữ liệu</p>
          <h1 id="employees-view-title">Nhân sự</h1>
          <p className="page-description">Kỹ năng và số giờ còn có thể nhận thêm trong tuần.</p>
        </div>
        <p className="scope-note">PROPOSED DEMO</p>
      </header>

      {state.status === 'loading' && <HrReadStatus status="loading" message="Đang tải nhân sự…" />}
      {state.status === 'error' && (
        <HrReadStatus status="error" message="Không tải được dữ liệu nhân sự." retry={retry} />
      )}
      {directory && (
        <>
          <p className="page-description" id="hr-availability-week">
            Tuần áp dụng từ <time dateTime={directory.weekStart}>{directory.weekStart}</time>
            {' đến '}<time dateTime={directory.weekEnd}>{directory.weekEnd}</time> (giờ Việt Nam).
          </p>
          {directory.employees.length === 0 ? (
            <HrReadStatus status="empty" message="Chưa có nhân sự để hiển thị." />
          ) : (
            <div className="foundation-primary employee-directory">
              <table aria-describedby="hr-availability-week">
                <thead>
                  <tr>
                    <th scope="col">Nhân sự</th>
                    <th scope="col">Kỹ năng</th>
                    <th scope="col">Giờ trống tuần này</th>
                  </tr>
                </thead>
                <tbody>
                  {directory.employees.map(({ id, displayName, skills, availability }) => (
                    <tr key={id}>
                      <th scope="row">{displayName}</th>
                      <td>{skills.length ? skills.map(skill => skill.name).join(', ') : 'Chưa có kỹ năng'}</td>
                      <td>
                        {availability === null
                          ? 'Chưa khai báo'
                          : availability.weekStart === directory.weekStart
                            ? `${hoursFormat.format(availability.hours)} giờ`
                            : `Dữ liệu khác tuần (tuần bắt đầu ${availability.weekStart})`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  )
}
