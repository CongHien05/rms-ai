# Chapter 5 — AI trong Thiết kế & Kiến trúc Phần mềm

## 1. Mục tiêu theo đề cương

Sử dụng AI để hỗ trợ thiết kế kiến trúc, mẫu kiến trúc, mô hình hóa hệ thống/UML,
thiết kế database, thiết kế API và mẫu thiết kế; mọi đề xuất vẫn phải được nhóm
kiểm tra với yêu cầu sản phẩm.

## 2. RMS-AI áp dụng chương này như thế nào

RMS-AI đã mô tả ranh giới Frontend, Backend, dịch vụ AI, dữ liệu khái niệm, API
ban đầu và nền tảng database. Các tài liệu này có trước cấu trúc theo dõi Chapter
5 nên tiếp tục được giữ tại Chapter 3 và chỉ được liên kết từ đây.

## 3. Tài liệu hiện có

- [Milestone B1 — Kiến trúc hiện trạng và UML tối thiểu](docs/current-state-architecture-b1.md)
- [Phase A — Architecture Baseline Audit](docs/architecture-baseline-audit.md)
- [Phase A — Architecture Gap Analysis](docs/architecture-gap-analysis.md)
- [Phase A — Chapter 5 Traceability Matrix](docs/chapter-05-traceability-matrix.md)
- [Proposed Phase B Plan](docs/chapter-05-phase-b-plan.md)
- [Kiến trúc hệ thống mức cao](../chapter-03-ai-for-requirements-product-analysis/docs/system-architecture.md)
- [Hợp đồng API ban đầu](../chapter-03-ai-for-requirements-product-analysis/docs/initial-api-contracts.md)
- [Thiết kế dữ liệu và database](../chapter-03-ai-for-requirements-product-analysis/docs/database-design.md)
- [Ràng buộc phân bổ nguồn lực](../chapter-03-ai-for-requirements-product-analysis/docs/resource-allocation-constraints.md)
- [Hợp đồng dữ liệu khái niệm MVP](../chapter-03-ai-for-requirements-product-analysis/docs/mvp-data-contract.md)

## 4. Tiến độ

- [x] Mô tả kiến trúc mức cao và ranh giới thành phần.
- [x] Mô tả hợp đồng API ban đầu.
- [x] Mô tả mô hình dữ liệu, nền tảng database và ràng buộc dữ liệu.
- [x] Hoàn tất Phase A: kiểm kê baseline, gap/conflict register, retained TBD
  assessment, traceability và kế hoạch Phase B.
- [x] Soạn Milestone B1: baseline kiến trúc hiện trạng, sơ đồ thành phần/runtime
  local, bằng chứng pattern và disposition conflict. **B1 chờ human review.**
- [ ] Hoàn thiện mô hình hóa hệ thống/UML theo phạm vi được duyệt.
- [ ] Ghi nhận mẫu kiến trúc và mẫu thiết kế có bằng chứng rà soát.

Trạng thái hiện tại: **B1 chờ review**. Tài liệu B1 đã đối chiếu code hiện có
nhưng chưa được con người phê duyệt; Chapter 5 vẫn đang thực hiện và không có
capability production mới nào được xác minh.

## 5. Bằng chứng quy trình có AI hỗ trợ

AI đã hỗ trợ tổng hợp baseline B1, tạo sơ đồ Mermaid và đối chiếu Frontend,
Backend, AI Service, TypeORM/entity/migration với audit Phase A. Bằng chứng được
truy về source path; MySQL runtime, migration applied và hai integration HTTP
vẫn ghi `CHƯA XÁC MINH KHI CHẠY`. Con người cần review cách dùng addendum, tên
pattern, hai sơ đồ và disposition conflict trước khi duyệt B1.

## 6. Việc tiếp theo

Human reviewer xử lý các mục `B1-DEC-01` đến `B1-DEC-04` và `B1-VIEW-01/02`
trong tài liệu B1. Sau khi B1 được duyệt, nhóm mới chọn một phạm vi tiếp theo;
không tự mở endpoint, schema, Auth/RBAC hoặc AI/model work.

### Addendum What-if 001 (2026-11-25)

What-if **PROPOSED DEMO** chạy từ màn đề xuất trên dự án thật qua Vite tới
`POST /projects/:projectId/simulations` của NestJS. Server xác minh HMAC
cho ngữ cảnh đã đề xuất, đọc Project, Skill và một Employee với liên kết
kỹ năng cùng giờ trống, rồi tính ba chỉ báo theo giờ. Phép tính deterministic
chỉ đọc MariaDB và luồng này kết thúc ở kết quả mô phỏng. Gate 2 đã duyệt
cách xử lý dữ liệu hiện có, proof không lưu và snapshot theo lượt chạy.
Chapter 5 B1 tiếp tục **chờ duyệt**.
[Hợp đồng HTTP](../specs/001-what-if-simulation/contracts/what-if-api.md)
· [Bằng chứng Chapter 8](../chapter-08-ai-software-testing/README.md).

### Gate 2 Authentication & RBAC 002 (2026-11-26)

Người phụ trách chốt D1–D3 cho tài khoản nội bộ, quyền Project và dữ liệu
DEV. AI đối chiếu baseline `75404caf`, lập thiết kế phiên opaque và di trú
MariaDB cộng thêm, cùng ma trận quyền cho 21 route cũ và 4 route mới.
Minh chứng Gate 2 dựa trên mã nguồn baseline, truy vết giữa artifact và kiểm
tra diff/liên kết. Nghiệm thu migration, browser và hồi quy 126 ca thuộc lượt
triển khai riêng. Trạng thái B1 tiếp tục chờ review.
[Plan](../specs/002-auth-rbac/plan.md) · [Tasks](../specs/002-auth-rbac/tasks.md).

### Gate 3 Authentication & RBAC 002 (2026-11-26)

Đã hiện thực phiên opaque trong MariaDB, kiểm role tường minh trên mỗi
handler và kiểm PM phụ trách qua quan hệ Project → Sprint → Task.
FastAPI yêu cầu khóa nội bộ trước inference. AI đối chiếu thay đổi với
thiết kế D1–D3 đã duyệt và kiểm migration trên schema clone. So sánh sáu
bảng nghiệp vụ trước/sau khớp, kể cả khi chạy lại sau gián đoạn DDL.
Đánh giá trên clone không thay trạng thái **B1 chờ review**.
[Minh chứng](../chapter-08-ai-software-testing/README.md#kiểm-chứng-authentication--rbac-002-2026-11-26).

### Gate 2 PM Decision Workflow 003 (2026-11-26)

Người phụ trách duyệt kiểm freshness theo dữ liệu hiện hành, quyết định bất
biến với retry theo lượt và quyền xem lịch sử của PM hiện phụ trách. AI đối
chiếu baseline, thiết kế bằng chứng ký cho What-if thành công và bảng quyết
định với unique constraint. Minh chứng Gate 2 là truy vết tài liệu và kiểm
diff, liên kết. Test và migration trên clone thuộc lượt triển khai. B1 vẫn
chờ review. [Đặc tả](../specs/003-pm-decision-workflow/spec.md) ·
[Thiết kế](../specs/003-pm-decision-workflow/plan.md).

### Gate 3 PM Decision Workflow 003 (2026-11-26)

Backend ký bằng chứng riêng sau What-if thành công. TypeORM dùng một
transaction `READ COMMITTED` để giữ thứ tự Account → Project → Employee
→ EmployeeSkill. Trên MariaDB 10.4, hai truy vấn khóa chia sẻ dùng
`LOCK IN SHARE MODE` tường minh vì driver baseline khai báo `mysql`.
Một bảng `pm_decisions` có unique theo lượt và lịch sử theo Project.
Hai lần nghiệm thu di trú cộng thêm và phục hồi DDL giữ nguyên 8 bảng cũ.
[Data Model](../specs/003-pm-decision-workflow/data-model.md) ·
[API contract](../specs/003-pm-decision-workflow/contracts/pm-decision-api.md).

### Gate 2 Apply Allocation 006 (2026-11-26)

Người phụ trách duyệt D1–D4 về quỹ giờ, điều kiện Apply, phục hồi và
quyền xem. AI đối chiếu 001–003 và lập thiết kế quỹ giờ dùng chung, khóa
Employee giữa Project và provenance cho snapshot 006. Kế hoạch chỉ bổ
sung ba bảng. Kiểm tĩnh truy vết và diff ở Gate 2. Thử khóa và di trú
MariaDB clone thuộc lượt triển khai. [Plan](../specs/006-apply-allocation/plan.md) ·
[Data Model](../specs/006-apply-allocation/data-model.md).

### Apply Allocation 006 — Gate 3 (2026-11-27)

Theo D1–D4, quỹ giờ còn lại dùng chung theo Employee/tuần. Apply và
PM Decision khóa cùng hàng Employee sau Account và Project. Evidence v2
và provenance tách snapshot mới khỏi lịch sử 003. Ba bảng thêm vào giữ
nguyên chín bảng baseline. B1 tiếp tục chờ duyệt.
[Nghiệm thu](../chapter-08-ai-software-testing/README.md#kiểm-chứng-apply-allocation-006-2026-11-27).
