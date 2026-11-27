# RMS-AI — Tiến độ theo đề cương học phần

## Mục đích

Tài liệu này là chỉ mục theo dõi tiến độ RMS-AI từ Chapter 3 đến Chapter 9.
Mã nguồn thật được giữ tại `frontend/`, `backend/` và `ai-service/`; các thư mục
chapter chỉ lưu tài liệu, bằng chứng và trạng thái học tập. Mã nguồn không được
sao chép vào các thư mục chapter.

## Tiến độ

| Chương | Nội dung | Trạng thái | Tài liệu chính |
| --- | --- | --- | --- |
| 3 | AI trong Phân tích Yêu cầu & Sản phẩm | HOÀN THÀNH | [Theo dõi Chapter 3](chapter-03-ai-for-requirements-product-analysis/README.md) |
| 4 | AI trong Thiết kế Sản phẩm | HOÀN TẤT REVIEW THIẾT KẾ · 12 TBD GIỮ LẠI | [Theo dõi Chapter 4](chapter-04-ai-for-product-design/README.md) |
| 5 | AI trong Thiết kế & Kiến trúc Phần mềm | ĐANG THỰC HIỆN | [Theo dõi Chapter 5](chapter-05-ai-for-software-design-architecture/README.md) |
| 6 | AI Lập trình | ĐANG THỰC HIỆN | [Theo dõi Chapter 6](chapter-06-ai-coding/README.md) |
| 7 | Tái cấu trúc & Review Mã nguồn cùng AI | ĐANG THỰC HIỆN | [Theo dõi Chapter 7](chapter-07-ai-code-review-refactoring/README.md) |
| 8 | AI trong Kiểm thử Phần mềm | ĐANG THỰC HIỆN | [Theo dõi Chapter 8](chapter-08-ai-software-testing/README.md) |
| 9 | AI trong việc sinh tài liệu kỹ thuật | ĐANG THỰC HIỆN | [Theo dõi Chapter 9](chapter-09-ai-technical-documentation/README.md) |

Chapter 3 hoàn thành cơ sở yêu cầu. Chapter 4 đã đóng phạm vi review thiết kế
với 20 mục UI được duyệt và 12 câu hỏi `TBD` được giữ lại. Chapter 5 B1 vẫn
chờ duyệt. Trạng thái các chapter phản ánh tiến độ học phần và phạm vi bằng
chứng đã ghi nhận.

## Tiến độ ngày 2026-11-17

- Đã kiểm chứng luồng PM tạo/xem dự án qua UI → NestJS → MySQL local,
  dùng `GET /projects` và `POST /projects`. Tải lại trang vẫn thấy dữ liệu;
  GET API và bản ghi MySQL khớp ID. Hai migration đã áp dụng trên database
  dev riêng `rms_ai_pm_dev`; dự án thật không dẫn vào risk mock.
- Đã hoàn thành luồng PM mở dự án thật bằng ID → tạo/xem Sprint → tạo/xem Task
  trong sprint, lưu MySQL và tải lại vẫn còn dữ liệu. URL hash `#project/:id`
  giữ đúng dự án khi reload; có validation tên/tiêu đề trống, chống submit lặp,
  loading/empty/error/retry và điều hướng quay lại `#projects`.
- Đã hoàn thành tính năng PM cập nhật trạng thái Task từ UI với 4 trạng thái
  TODO, IN_PROGRESS, BLOCKED, DONE (hiển thị: Chưa làm, Đang làm, Bị chặn, Hoàn thành).
  Migration `AddStatusToTasks1791130000000` áp dụng thành công trên MySQL; API
  `PATCH /sprints/:sprintId/tasks/:taskId` kiểm tra trạng thái hợp lệ, UUID và tồn tại.
- Màn chi tiết dự án đã có PROPOSED UI tổng hợp tiến độ từng Sprint theo số lượng
  task: tổng, hoàn thành, bị chặn và tỷ lệ `DONE / tổng task`; dùng dữ liệu đã tải,
  không thêm request. Quy tắc `progressValue` và việc dùng tiến độ cho AI/rủi ro vẫn TBD.
- PASS gần nhất: Frontend 6/6 test (race và tổng hợp tiến độ), build/lint sạch;
  Backend 40/40 unit test, 6/6 e2e test và build/lint sạch. Kiểm thử trình duyệt
  với MySQL dev PASS tổng/DONE/BLOCKED, cập nhật tỷ lệ sau đổi trạng thái, reload
  giữ đúng và trạng thái sprint rỗng; task kiểm thử đã được trả về trạng thái cũ.
  Chi tiết: [triển khai Chapter 6](chapter-06-ai-coding/README.md) và
  [minh chứng Chapter 8](chapter-08-ai-software-testing/README.md).
- Chapter 5 B1 đã chỉnh theo review và vẫn chờ phê duyệt. B1 là snapshot
  trước tích hợp PM; bằng chứng runtime mới được ghi tại Chapter 6/8.
- Việc tiếp theo: cải thiện UI/UX và làm rõ luồng thao tác PM. Các chapter
  đang thực hiện tiếp tục giữ nguyên trạng thái; chưa xác minh Auth/RBAC,
  AI thật hoặc triển khai production.

## Tiến độ ngày 2026-11-18

- Hoàn thành milestone PROPOSED DEMO `dueDate` và `estimatedHours` nullable của
  Task xuyên suốt UI → API → MySQL. Task cũ giữ null; PATCH duy nhất theo Sprint
  hỗ trợ sửa riêng, xóa bằng null và giữ nguyên field bị bỏ qua.
- Migration đã chạy trên `rms_ai_pm_dev`; browser tạo → sửa → đổi status → reload
  khớp API/MySQL, không làm hỏng placeholder Task cũ hoặc tiến độ Sprint.
- PASS gần nhất: Frontend 10/10 test, Backend 42/42 unit và 6/6 e2e; build/lint
  hai phía sạch. Chi tiết ở [Chapter 6](chapter-06-ai-coding/README.md) và
  [Chapter 8](chapter-08-ai-software-testing/README.md).
- Giới hạn: `estimatedHours` là khối lượng ước tính của Task, chưa phải workload
  nhân viên vì chưa có assignee/allocation; không phải dự báo rủi ro AI.
- Màn HR đọc Employee, Skill và EmployeeSkill từ NestJS/MySQL. PROPOSED DEMO
  hiển thị số giờ còn nhận thêm theo tuần, phân biệt 0 giờ, chưa khai báo và
  khác tuần. Giờ trống do khai báo riêng.
- PASS migration và seed hai lần trên MySQL dev (5 hồ sơ mới, lần hai chèn 0).
  Browser đã đối chiếu với API/MySQL và xác nhận lỗi → thử lại. Backend đạt
  44/44 unit và 8/8 e2e, Frontend đạt 10/10 regression, build/lint hai phía PASS.
  Milestone HR chỉ đọc và chờ review. Bằng chứng tại Chapter 6/8.
- AI service có baseline Logistic Regression PROPOSED DEMO cho trễ hạn Task
  D+1…D+7, chạy trên dữ liệu giả lập. Test 424 mẫu từ 145 dự án có F1 lớp dương
  0,801 so với 0,766 của baseline đoán lớp phổ biến. PASS 9/9 unittest và HTTP
  local. Chờ review và xác minh với dữ liệu thật.
  [Lệnh tái lập và hợp đồng inference](ai-service/README.md)
- PM đã đánh giá từ chi tiết dự án qua NestJS/MySQL/FastAPI. Ngày đánh giá
  lấy theo giờ Việt Nam và UI hiển thị đúng các trạng thái của model demo.
  PASS smoke browser và đối chiếu cùng input, gồm dừng FastAPI rồi thử lại
  sau khi dịch vụ hồi phục. Chi tiết và lệnh chạy tại Chapter 6/8. Tích hợp
  chờ review, độ tin cậy trên dữ liệu thật vẫn chưa được xác minh.

## Tiến độ ngày 2026-11-19

- PM có thể yêu cầu đề xuất nhân sự từ dự án thật theo kỹ năng, tuần và số
  giờ cần. API dùng dữ liệu HR hiện có và xếp từng người theo giờ hỗ trợ.
  Đây là PROPOSED DEMO, chỉ đọc và đang chờ review.
- PASS smoke browser → NestJS → MySQL dev. TypeScript, tuần `2026-11-16`,
  8 giờ trả An Mây 8/8 rồi Bình Sương 4/8. Giờ trống của 5 hồ sơ seed giữ
  nguyên trước/sau. Test, build và lint hai phía đạt.
  [Triển khai Chapter 6](chapter-06-ai-coding/README.md) ·
  [Minh chứng Chapter 8](chapter-08-ai-software-testing/README.md).

## Tiến độ ngày 2026-11-24

- Đã audit GitHub Spec Kit 1.4.4 với Codex và soạn Constitution 1.0.0.
  Báo cáo, Constitution và đề xuất milestone What-if từ ứng viên của API
  đang chờ người phụ trách review.
  [Audit và roadmap MVP](chapter-09-ai-technical-documentation/docs/spec-kit-adoption-audit.md).

## Tiến độ ngày 2026-11-25

- Người phụ trách phê chuẩn Constitution 1.0.0, cách làm Hybrid SDD,
  cấu hình LF cho scaffold Spec Kit và roadmap MVP.
- What-if Simulation là milestone chức năng đầu tiên. Quyết định về đầu vào,
  tác động, lỗi và độ mới đã chốt ở phạm vi PROPOSED DEMO. Milestone chưa triển khai.
  [Quyết định What-if](chapter-03-ai-for-requirements-product-analysis/docs/user-stories.md#quyết-định-cho-what-if-đầu-tiên-2026-11-25).
- `origin/main` đã chứa PR #21 tại `616f417`. Cây nội dung của commit đó
  khớp với HEAD `83e13b0`. [Báo cáo tích hợp](chapter-09-ai-technical-documentation/docs/spec-kit-adoption-audit.md).
- What-if 001 đã triển khai ở phạm vi **PROPOSED DEMO**, chờ review Gate 3.
  Phép tính deterministic trong NestJS dùng giờ trống đọc lại và kết thúc
  ở kết quả giả định. Backend đạt 83 unit và 16 HTTP E2E với test double;
  Frontend đạt 25 unit. Browser dev và SQL trước/sau xác nhận lát cắt
  chỉ đọc trên dữ liệu hiện có. Chapter 5 B1 tiếp tục chờ duyệt.
  [Bằng chứng và giới hạn](chapter-08-ai-software-testing/README.md#kiểm-chứng-what-if-001-2026-11-25).

## Tiến độ ngày 2026-11-26

- Milestone 002 hoàn thành hồ sơ Gate 2 cho Authentication & RBAC.
  D1–D3 đã được người phụ trách phê duyệt; đặc tả, thiết kế và danh sách tác vụ
  phục vụ lượt triển khai riêng. [Theo dõi Chapter 5](chapter-05-ai-for-software-design-architecture/README.md#gate-2-authentication--rbac-002-2026-11-26).
- Milestone 002 đã triển khai và đạt kiểm chứng Gate 3 trên MariaDB clone.
  Baseline 126 ca được bảo toàn. HTTP runtime bao phủ 25 route, có Chrome
  cho PM/HR/DEV và snapshot trước/sau migration. Hồ sơ chờ người phụ trách
  review. [Bàn giao Gate 3](chapter-09-ai-technical-documentation/README.md#bàn-giao-gate-3-authentication--rbac-002-2026-11-26).
- Milestone 003 hoàn thành hồ sơ thiết kế Gate 2 cho PM Decision Workflow
  theo D1–D3 đã duyệt. Nghiệm thu test và MariaDB clone thuộc lượt triển khai.
  [Theo dõi Chapter 5](chapter-05-ai-for-software-design-architecture/README.md#gate-2-pm-decision-workflow-003-2026-11-26).
- Milestone 003 có luồng ACCEPT/REJECT và lịch sử theo Project. Kết quả
  kiểm thử và trạng thái review Gate 3 được ghi riêng tại
  [Chapter 9](chapter-09-ai-technical-documentation/README.md#bàn-giao-gate-3-pm-decision-workflow-003-2026-11-26).

## Thứ tự triển khai milestone kế tiếp

- Ưu tiên Apply Allocation 006 sau 003 theo quyết định người phụ trách.
  006 dùng phương án đã chấp nhận từ 003, dữ liệu giờ trống theo tuần từ
  luồng 001 và quyền Project từ 002. Hai mốc 004 và 005 không chặn 006.
- Giữ mã 004 cho AI Risk Prediction Enhancement. Tạm hoãn để người phụ trách
  trực tiếp chọn dataset và huấn luyện. Giữ mã 005 cho Resource Optimization
  và xếp sau 006. Thứ tự giữa 004 và 005 sẽ được xác nhận sau.
- 006 hoàn tất hồ sơ Gate 2 theo D1–D4 đã duyệt. Kiểm thử triển khai và
  nghiệm thu MariaDB clone thuộc lượt sau.
  [Đặc tả 006](specs/006-apply-allocation/spec.md) · [Kế hoạch](specs/006-apply-allocation/plan.md).
- 006 đã triển khai Apply Allocation và kiểm chứng trên MariaDB clone.
  [Bàn giao Gate 3](chapter-09-ai-technical-documentation/README.md#bàn-giao-gate-3-apply-allocation-006-2026-11-27)
  chờ người phụ trách duyệt.

## Mốc trước tích hợp PM (lịch sử)

- Cơ sở phân tích yêu cầu và sản phẩm đã có PRD, User Stories, Acceptance
  Criteria và hợp đồng dữ liệu khái niệm.
- Thiết kế UI và bản mẫu cho luồng Đánh giá rủi ro → Đề xuất nhân sự → Mô phỏng
  giả định → Quyết định của PM đã được triển khai ở phạm vi hiện tại; các quyết
  định `GIAO DIỆN ĐỀ XUẤT` và `TBD` vẫn cần tiếp tục rà soát.
- Nền tảng kiến trúc, API và database đã có tài liệu; UML hoàn chỉnh và các mẫu
  thiết kế chưa có bằng chứng hoàn tất.
- Nền tảng Backend và bản mẫu Frontend đã bắt đầu được hiện thực hóa và đã được
  merge vào `main`.
- Mô hình AI thật không thuộc mốc của tuần này và chưa được triển khai.
- Không gian làm việc theo ba vai trò DEV/PM/HR là định hướng tuần sau, chưa được
  triển khai trong tác vụ này.
