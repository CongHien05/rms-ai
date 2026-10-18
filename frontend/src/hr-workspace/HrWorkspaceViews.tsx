export function HrOverview() {
  return (
    <section className="workspace-view" aria-labelledby="hr-overview-title">
      <header className="page-heading">
        <div>
          <p className="eyebrow">HR · Nền tảng dữ liệu</p>
          <h1 id="hr-overview-title">Tổng quan nguồn lực</h1>
          <p className="page-description">
            Phạm vi dữ liệu tối thiểu phục vụ RMS-AI.
          </p>
        </div>
        <p className="scope-note">Chưa kết nối dữ liệu vận hành</p>
      </header>

      <div className="foundation-layout">
        <section className="foundation-primary" aria-labelledby="hr-foundation-title">
          <div className="section-heading">
            <div>
              <p className="section-index">Phạm vi đã xác nhận</p>
              <h2 id="hr-foundation-title">Nền tảng nguồn lực</h2>
            </div>
          </div>
          <div className="foundation-sections">
            <FoundationSection
              index="01"
              title="Dữ liệu nhân sự"
              description="Nền tảng Employee có ở Backend; Frontend chưa kết nối."
            />
            <FoundationSection
              index="02"
              title="Dữ liệu kỹ năng"
              description="Nền tảng Skill có ở Backend; Frontend chưa kết nối."
            />
            <FoundationSection
              index="03"
              title="Liên kết nhân sự — kỹ năng"
              description="Nền tảng EmployeeSkill đã có; cách duy trì trên UI là GIAO DIỆN ĐỀ XUẤT."
            />
          </div>
        </section>

        <aside className="integration-note" aria-labelledby="integration-title">
          <p className="panel-label">Trạng thái tích hợp</p>
          <h2 id="integration-title">Chưa kết nối dữ liệu vận hành</h2>
          <p>Không hiển thị KPI hoặc dữ liệu nguồn lực giả.</p>
        </aside>
      </div>
    </section>
  )
}

export function HrSkillsView() {
  return (
    <section className="workspace-view" aria-labelledby="hr-skills-title">
      <header className="page-heading">
        <div>
          <p className="eyebrow">HR · Nền tảng dữ liệu</p>
          <h1 id="hr-skills-title">Kỹ năng</h1>
          <p className="page-description">
            Skill và liên kết Employee ↔ Skill cần thiết cho RMS-AI.
          </p>
        </div>
        <p className="scope-note">Chưa kết nối dữ liệu</p>
      </header>

      <section className="empty-workspace" aria-labelledby="hr-skills-empty-title">
        <p className="empty-workspace__mark" aria-hidden="true">—</p>
        <div>
          <h2 id="hr-skills-empty-title">
            Dữ liệu kỹ năng chưa được kết nối vào giao diện
          </h2>
          <p>
            Frontend chưa đọc hoặc duy trì Skill và EmployeeSkill.
          </p>
          <p className="tbd-note">
            Trường dữ liệu, thang mức kỹ năng, vòng đời và kiểm tra dữ liệu: TBD.
          </p>
        </div>
      </section>
    </section>
  )
}

type FoundationSectionProps = {
  index: string
  title: string
  description: string
}

function FoundationSection({
  index,
  title,
  description,
}: FoundationSectionProps) {
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
