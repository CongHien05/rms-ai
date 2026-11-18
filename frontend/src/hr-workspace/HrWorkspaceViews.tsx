import { HrReadStatus } from './HrReadStatus'
import { useHrData } from './useHrData'

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
        <p className="scope-note">Chỉ xem</p>
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
              description="Mục Nhân sự hiển thị danh sách và số giờ còn có thể nhận thêm trong tuần."
            />
            <FoundationSection
              index="02"
              title="Dữ liệu kỹ năng"
              description="Mục Kỹ năng hiển thị danh mục kỹ năng từ RMS-AI."
            />
            <FoundationSection
              index="03"
              title="Liên kết nhân sự — kỹ năng"
              description="Mục Nhân sự hiển thị kỹ năng đã liên kết với từng nhân sự."
            />
          </div>
        </section>

        <aside className="integration-note" aria-labelledby="integration-title">
          <p className="panel-label">Trạng thái tích hợp</p>
          <h2 id="integration-title">Đọc dữ liệu nguồn lực</h2>
          <p>Giờ trống theo tuần là PROPOSED DEMO.</p>
        </aside>
      </div>
    </section>
  )
}

export function HrSkillsView() {
  const { state, retry } = useHrData<{ id: string; name: string }[]>('/api/skills')

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
        <p className="scope-note">Chỉ xem</p>
      </header>

      {state.status === 'loading' && <HrReadStatus status="loading" message="Đang tải kỹ năng…" />}
      {state.status === 'error' && (
        <HrReadStatus status="error" message="Không tải được dữ liệu kỹ năng." retry={retry} />
      )}
      {state.status === 'ready' && (
        state.data.length === 0
          ? <HrReadStatus status="empty" message="Chưa có kỹ năng để hiển thị." />
          : <ul className="foundation-primary">{state.data.map(skill => <li key={skill.id}>{skill.name}</li>)}</ul>
      )}
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
