export function EmployeesView() {
  return (
    <section className="workspace-view" aria-labelledby="employees-view-title">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Nền tảng trình bày</p>
          <h1 id="employees-view-title">Nhân sự</h1>
          <p className="page-description">
            Khu vực chung cho dữ liệu nhân sự và kỹ năng phục vụ luồng hỗ trợ
            quyết định.
          </p>
        </div>
        <p className="scope-note">Chưa kết nối dữ liệu</p>
      </header>

      <section className="empty-workspace" aria-labelledby="employees-empty-title">
        <p className="section-index">01</p>
        <div>
          <h2 id="employees-empty-title">
            Chưa có dữ liệu nhân sự để hiển thị
          </h2>
          <p>
            Employee và Skill đã có foundation ở backend; kết nối dữ liệu
            frontend sẽ được thực hiện ở bước tích hợp.
          </p>
          <p className="tbd-note">
            Trường dữ liệu và cách trình bày nhân sự trong sản phẩm vẫn cần
            được xác nhận.
          </p>
        </div>
      </section>
    </section>
  )
}
