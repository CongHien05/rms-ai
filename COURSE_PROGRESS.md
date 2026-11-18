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
| 4 | AI trong Thiết kế Sản phẩm | ĐANG THỰC HIỆN | [Theo dõi Chapter 4](chapter-04-ai-for-product-design/README.md) |
| 5 | AI trong Thiết kế & Kiến trúc Phần mềm | ĐANG THỰC HIỆN | [Theo dõi Chapter 5](chapter-05-ai-for-software-design-architecture/README.md) |
| 6 | AI Lập trình | ĐANG THỰC HIỆN | [Theo dõi Chapter 6](chapter-06-ai-coding/README.md) |
| 7 | Tái cấu trúc & Review Mã nguồn cùng AI | ĐANG THỰC HIỆN | [Theo dõi Chapter 7](chapter-07-ai-code-review-refactoring/README.md) |
| 8 | AI trong Kiểm thử Phần mềm | ĐANG THỰC HIỆN | [Theo dõi Chapter 8](chapter-08-ai-software-testing/README.md) |
| 9 | AI trong việc sinh tài liệu kỹ thuật | ĐANG THỰC HIỆN | [Theo dõi Chapter 9](chapter-09-ai-technical-documentation/README.md) |

Trạng thái Chapter 3 xác nhận cơ sở yêu cầu đã có, không có nghĩa mọi quy tắc
nghiệp vụ `TBD` đã được quyết định. Các chapter còn lại đã có một phần bằng chứng
trong repository nhưng chưa đủ điều kiện để đánh dấu hoàn thành.

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
