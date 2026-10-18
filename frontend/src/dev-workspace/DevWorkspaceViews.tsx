export function DevOverview() {
  return (
    <section className="workspace-view" aria-labelledby="dev-overview-title">
      <header className="page-heading">
        <div>
          <p className="eyebrow">DEV · Chỉ xem</p>
          <h1 id="dev-overview-title">Tổng quan của tôi</h1>
          <p className="page-description">
            Hồ sơ, kỹ năng và công việc khi danh tính được xác định.
          </p>
        </div>
        <p className="scope-note">Chưa có danh tính người dùng</p>
      </header>

      <div className="personal-context">
        <div className="personal-context__intro">
          <p className="section-index">Ngữ cảnh cá nhân</p>
          <h2>Chưa thể xác định dữ liệu của người dùng hiện tại</h2>
          <p>Quan hệ User Account ↔ Employee vẫn là TBD.</p>
        </div>
        <div className="foundation-sections">
          <UnavailableSection
            index="01"
            title="Hồ sơ của tôi"
            description="Cần Employee tương ứng."
          />
          <UnavailableSection
            index="02"
            title="Kỹ năng của tôi"
            description="Cần Employee ↔ Skill tương ứng."
          />
          <UnavailableSection
            index="03"
            title="Ngữ cảnh công việc"
            description="Cần Project, Sprint hoặc Task được cung cấp."
          />
        </div>
      </div>
    </section>
  )
}

export function DevSkillsView() {
  return (
    <section className="workspace-view" aria-labelledby="dev-skills-title">
      <header className="page-heading">
        <div>
          <p className="eyebrow">DEV · Chỉ xem</p>
          <h1 id="dev-skills-title">Kỹ năng của tôi</h1>
          <p className="page-description">
            Chỉ hiển thị kỹ năng khi xác định được Employee tương ứng.
          </p>
        </div>
        <p className="scope-note">Không có dữ liệu để hiển thị</p>
      </header>

      <UnavailableWorkspace
        title="Chưa thể xác định kỹ năng"
        description="Bản mẫu chưa có danh tính người dùng. Thao tác ghi của DEV vẫn là TBD nên không được hiển thị."
      />
    </section>
  )
}

export function DevWorkView() {
  return (
    <section className="workspace-view" aria-labelledby="dev-work-title">
      <header className="page-heading">
        <div>
          <p className="eyebrow">DEV · Chỉ xem</p>
          <h1 id="dev-work-title">Công việc của tôi</h1>
          <p className="page-description">
            Project, Sprint và Task sẽ xuất hiện khi có ánh xạ phù hợp.
          </p>
        </div>
        <p className="scope-note">Không có ngữ cảnh công việc</p>
      </header>

      <div className="work-context" aria-label="Ngữ cảnh công việc chưa khả dụng">
        {['Dự án', 'Sprint', 'Task'].map((label, index) => (
          <section className="work-context__section" key={label}>
            <p className="section-index">0{index + 1}</p>
            <div>
              <h2>{label}</h2>
              <p>Chưa có dữ liệu được cung cấp.</p>
            </div>
          </section>
        ))}
      </div>
      <p className="workspace-footnote">
        Bản mẫu hiện chỉ hỗ trợ xem. Các thao tác nhận/hoàn thành Task, cập nhật
        tiến độ hoặc thay đổi phân bổ vẫn TBD và chưa được hiển thị.
      </p>
    </section>
  )
}

type UnavailableSectionProps = {
  index: string
  title: string
  description: string
}

function UnavailableSection({
  index,
  title,
  description,
}: UnavailableSectionProps) {
  return (
    <section className="foundation-section">
      <p className="section-index">{index}</p>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </section>
  )
}

function UnavailableWorkspace({
  title,
  description,
}: Omit<UnavailableSectionProps, 'index'>) {
  return (
    <section className="empty-workspace" aria-labelledby="dev-empty-title">
      <p className="empty-workspace__mark" aria-hidden="true">—</p>
      <div>
        <h2 id="dev-empty-title">{title}</h2>
        <p>{description}</p>
      </div>
    </section>
  )
}
