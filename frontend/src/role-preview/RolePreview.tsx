import type { PrototypeRole } from '../layout/AppShell'

type RolePreviewProps = {
  onSelectRole: (role: PrototypeRole) => void
}

const roleOptions: readonly {
  role: PrototypeRole
  title: string
  description: string
}[] = [
  {
    role: 'PM',
    title: 'Quản lý dự án',
    description:
      'Xem dự án và đi qua luồng Rủi ro → Đề xuất → Mô phỏng → Quyết định.',
  },
  {
    role: 'HR',
    title: 'Nguồn lực',
    description:
      'Xem nền tảng dữ liệu Nhân sự, Kỹ năng và liên kết nhân sự — kỹ năng.',
  },
  {
    role: 'DEV',
    title: 'Công việc cá nhân',
    description:
      'Xem kỹ năng và ngữ cảnh Project, Sprint, Task của chính mình khi có dữ liệu.',
  },
]

export function RolePreview({ onSelectRole }: RolePreviewProps) {
  return (
    <main className="role-preview">
      <div className="role-preview__topbar">
        <p className="role-preview__brand">RMS-AI</p>
        <p className="prototype-label"><span aria-hidden="true" />Bản mẫu nội bộ</p>
      </div>

      <div className="role-preview__layout">
        <header className="role-preview__heading">
          <p className="eyebrow">Chọn vai trò</p>
          <h1>Bản mẫu giao diện theo vai trò</h1>
          <p>
            Mở không gian làm việc phù hợp để rà soát luồng và phạm vi trình
            bày.
          </p>
          <p className="role-preview__guardrail" role="note">
            Chế độ xem theo vai trò không phải là đăng nhập, xác thực hoặc phân
            quyền bảo mật.
          </p>
        </header>

        <section className="role-preview__options" aria-labelledby="role-options-title">
          <h2 id="role-options-title" className="visually-hidden">
            Chọn vai trò bản mẫu
          </h2>
          {roleOptions.map((option, index) => (
            <button
              type="button"
              className={`role-option${option.role === 'PM' ? ' role-option--primary' : ''}`}
              onClick={() => onSelectRole(option.role)}
              key={option.role}
            >
              <span className="role-option__index">0{index + 1}</span>
              <span className="role-option__content">
                <span className="role-option__role">{option.role}</span>
                <strong>{option.title}</strong>
                <span>{option.description}</span>
              </span>
              <span className="role-option__action" aria-hidden="true">
                Mở không gian làm việc <span>→</span>
              </span>
            </button>
          ))}
        </section>
      </div>
    </main>
  )
}
