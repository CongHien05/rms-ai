export function EmployeesView() {
  return (
    <section className="workspace-view" aria-labelledby="employees-view-title">
      <header className="page-heading">
        <div>
          <p className="eyebrow">HR · Nền tảng dữ liệu</p>
          <h1 id="employees-view-title">Nhân sự</h1>
          <p className="page-description">
            Nền tảng Employee tối thiểu phục vụ RMS-AI.
          </p>
        </div>
        <p className="scope-note">Chưa kết nối dữ liệu</p>
      </header>

      <section className="empty-workspace" aria-labelledby="employees-empty-title">
        <p className="empty-workspace__mark" aria-hidden="true">—</p>
        <div>
          <h2 id="employees-empty-title">
            Chưa có dữ liệu nhân sự để hiển thị
          </h2>
          <p>
            Nền tảng Employee có ở Backend nhưng chưa kết nối vào giao diện.
            Bản mẫu không tạo danh sách thay thế.
          </p>
          <p className="tbd-note">
            Trường dữ liệu, vòng đời và cách duy trì Employee: TBD.
          </p>
        </div>
      </section>
    </section>
  )
}
