import type { PrototypeRole } from '../layout/AppShell'
import { PageHeading } from '../layout/PageHeading'

type RolePreviewProps = {
  onSelectRole: (role: PrototypeRole) => void
}

const roleOptions: readonly { role: PrototypeRole; title: string; description: string }[] = [
  { role: 'PM', title: 'Quản lý dự án', description: 'Theo dõi dự án, xem rủi ro và cân nhắc phương án nhân sự.' },
  { role: 'HR', title: 'Nhân sự', description: 'Xem kỹ năng và số giờ còn trống theo tuần của từng người.' },
  { role: 'DEV', title: 'Nhà phát triển', description: 'Xem kỹ năng và công việc của mình khi có dữ liệu.' },
]

export function RolePreview({ onSelectRole }: RolePreviewProps) {
  return (
    <div className="role-preview">
      <header className="role-preview__topbar">
        <div className="role-preview__bar-content">
          <p className="brand"><span className="brand__mark" aria-hidden="true">R</span>RMS-AI</p>
          <span className="scope-note">Bản mẫu nội bộ</span>
        </div>
      </header>

      <main className="role-preview__layout">
        <PageHeading id="role-options-title" title="Chọn vai trò"
          description="Mở chế độ xem theo vai trò để trải nghiệm RMS-AI." />

        <section className="role-preview__options" aria-labelledby="role-options-title">
          {roleOptions.map(option => (
            <button type="button" className="role-option" onClick={() => onSelectRole(option.role)} key={option.role}>
              <span className="role-code">{option.role}</span>
              <strong>{option.title}</strong>
              <span className="role-option__description">{option.description}</span>
              <span className="role-option__action" aria-hidden="true">Mở không gian làm việc →</span>
            </button>
          ))}
        </section>
        <p className="workspace-footnote">Chế độ xem theo vai trò dành cho việc rà soát giao diện.</p>
      </main>
    </div>
  )
}
