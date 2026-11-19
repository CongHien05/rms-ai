import { PageHeading } from '../layout/PageHeading'

export function DevOverview() {
  return (
    <section aria-labelledby="dev-overview-title">
      <PageHeading id="dev-overview-title" title="Tổng quan của tôi" label="Chỉ xem" />

      <div className="panel" role="status">
        <h2>Chưa xác định được hồ sơ cá nhân</h2>
        <p className="muted">Bản mẫu chưa liên kết tài khoản với hồ sơ nhân sự.</p>
      </div>
    </section>
  )
}

export function DevSkillsView() {
  return (
    <section aria-labelledby="dev-skills-title">
      <PageHeading id="dev-skills-title" title="Kỹ năng của tôi" label="Chỉ xem" />

      <div className="empty-state" role="status">
        <h2>Chưa có dữ liệu kỹ năng</h2>
        <p className="muted">Kỹ năng sẽ hiển thị khi xác định được hồ sơ nhân sự của bạn.</p>
      </div>
    </section>
  )
}

export function DevWorkView() {
  return (
    <section aria-labelledby="dev-work-title">
      <PageHeading id="dev-work-title" title="Công việc của tôi" label="Chỉ xem" />

      <div className="empty-state" role="status">
        <h2>Chưa có công việc để hiển thị</h2>
        <p className="muted">Dự án, Sprint và công việc sẽ xuất hiện khi có dữ liệu gắn với hồ sơ của bạn.</p>
      </div>
    </section>
  )
}
