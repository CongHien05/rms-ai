# Chapter 6 — AI Lập trình

## 1. Mục tiêu theo đề cương

Áp dụng AI vào sinh mã, hoàn thiện mã, gỡ lỗi, lập trình cặp với AI và quy trình
lập trình có kiểm chứng.

## 2. RMS-AI áp dụng chương này như thế nào

Nhóm sử dụng Codex để hỗ trợ triển khai theo phạm vi nhỏ, sau đó thực hiện rà
soát của con người, vòng hiệu chỉnh, kiểm tra xác nhận và merge. Mã nguồn vẫn
nằm tại các thư mục kỹ thuật của repository, không được sao chép vào chapter này.

## 3. Tài liệu hiện có

- [Frontend React/TypeScript](../frontend/README.md)
- [Backend NestJS/TypeScript](../backend/README.md)
- [Khung dịch vụ AI FastAPI](../ai-service/main.py)
- [Quy tắc làm việc và kiểm tra xác nhận](../AGENTS.md)

Lịch sử Git xác nhận các commit triển khai `711a1cc`, `96f4e55` và `6383233`,
sau đó được đưa vào `main` qua các merge commit tương ứng. Đây là bằng chứng về
mốc triển khai và merge, không thay thế biên bản rà soát chi tiết của con người.

## 4. Tiến độ

- [x] Khởi tạo mã nguồn cho Frontend, Backend và dịch vụ AI.
- [x] Triển khai nền tảng Backend cho Project/Sprint/Task và Employee/Skill.
- [x] Triển khai bản mẫu Frontend và khung sản phẩm theo phạm vi hiện tại.
- [x] Lưu lịch sử triển khai và merge trong Git.
- [ ] Tập trung prompt, ghi chú gỡ lỗi và kết quả rà soát của con người theo chapter.

## 5. Bằng chứng quy trình có AI hỗ trợ

Quy trình nhóm đang sử dụng là: AI triển khai → con người rà soát → hiệu chỉnh
→ kiểm tra xác nhận → merge. Repository hiện có mã nguồn, quy tắc kiểm tra xác
nhận và lịch sử commit/merge; prompt lập trình và biên bản rà soát chưa được tập
trung vào chapter này.

## 6. Việc tiếp theo

### Minh chứng luồng dự án PM (2026-11-17)

Theo yêu cầu trực tiếp của người dùng, AI triển khai màn Dự án gọi
`GET /projects`, `POST /projects` qua proxy Vite `/api`, tận dụng DTO hiện có.
Form có validation, khóa submit lặp, loading/error/empty/retry; URL `#projects`
giữ màn hình sau tải lại. Dự án thật không liên kết đến risk mock.
Đây là phạm vi được giao cho luồng này; Role Preview vẫn chưa phải Auth/RBAC.
Các lựa chọn form/điều hướng là PROPOSED UI chờ con người rà soát; không xác nhận
thêm nghiệp vụ risk hoặc quyền truy cập ngoài cơ sở yêu cầu.

Đã dùng MySQL local, database riêng `rms_ai_pm_dev`, áp dụng hai migration hiện có.
Cấu hình local lưu trong `backend/.env` được Git bỏ qua. Không xóa dữ liệu.
Backend hỗ trợ mật khẩu rỗng được cấu hình rõ, vẫn từ chối biến mật khẩu bị thiếu.
Chạy lại: tại Backend, `npm run build`, `npm run migration:local`,
`npm run start:local`; tại Frontend, `npm run dev -- --host 127.0.0.1`.
Proxy mặc định đến `127.0.0.1:3000`, có thể đặt `BACKEND_URL` khi chạy Vite.
Mở `http://127.0.0.1:5173/#projects`. Proxy này dành cho Vite dev server;
việc triển khai production chưa được kiểm chứng.

### Minh chứng luồng PM mở dự án thật → tạo/xem sprint → tạo/xem task (2026-11-17)

Theo yêu cầu mở rộng luồng PM, AI triển khai màn chi tiết dự án tại
`frontend/src/projects/ProjectDetailView.tsx` và `project-detail.css`, cập nhật
`frontend/src/projects/ProjectsView.tsx` và `frontend/src/App.tsx`.
- Mở dự án thật bằng ID qua URL `#project/:id`; tải lại trình duyệt vẫn mở đúng
  dự án thật. Điều hướng quay lại bằng nút "← Quay lại" về danh sách `#projects`.
- Tận dụng toàn bộ API, DTO (`CreateSprintDto`, `CreateTaskDto`), Controller
  (`SprintsController`, `TasksController`), Entity (`Sprint`, `Task`) và TypeORM
  MySQL hiện có: `GET /projects/:id`, `GET /projects/:projectId/sprints`,
  `POST /projects/:projectId/sprints`, `GET /sprints/:sprintId/tasks`,
  `POST /sprints/:sprintId/tasks`.
- Giao diện có đầy đủ validation (chặn tên Sprint trống, tiêu đề Task trống),
  chống submit lặp (`submitting.current`, disabled buttons), trạng thái loading,
  empty, error và nút thử lại (retry). Giữ đúng quan hệ Project → Sprint → Task.
- Mã nguồn nằm tại thư mục kỹ thuật `frontend/`, không copy vào chapter này.

### Minh chứng cập nhật trạng thái Task từ UI (2026-11-17)

Theo quy ước demo được duyệt, AI bổ sung trường `status` cho Task với 4 giá trị:
`TODO` (Chưa làm), `IN_PROGRESS` (Đang làm), `BLOCKED` (Bị chặn), `DONE` (Hoàn thành).
- Database & Migration: Migration `1791130000000-add-status-to-tasks.ts` thêm cột
  `status` (varchar 20, default `'TODO'`) và cập nhật toàn bộ task cũ về `TODO`.
- Backend: `TaskStatus` enum, `UpdateTaskStatusDto` có validation enum, `TasksService`
  cập nhật trạng thái kèm kiểm tra Sprint/Task tồn tại, trả về 404 nếu không tìm thấy.
  `TasksController` mở endpoint duy nhất
  `PATCH /sprints/:sprintId/tasks/:taskId`; các alias không có caller đã được bỏ
  sau vòng review mã nguồn.
- Frontend: Tại `ProjectDetailView.tsx`, mỗi task hiển thị select trạng thái tiếng Việt,
  chống thao tác lặp khi đang lưu (`isUpdating` / `disabled`), hiển thị lỗi và phục hồi
  trạng thái cũ nếu cập nhật thất bại, đảm bảo các task khác không bị ảnh hưởng.

### Minh chứng tổng hợp tiến độ Sprint theo số lượng task (2026-11-17)

- PROPOSED UI: mỗi Sprint tổng hợp trực tiếp danh sách task đã tải để hiển thị
  tổng task, số `DONE`, số `BLOCKED` và tỷ lệ `DONE / tổng task × 100`, làm tròn
  số nguyên; Sprint rỗng hiển thị `Chưa có công việc`.
- Không thêm API hoặc request đếm. Số liệu chỉ đổi sau PATCH thành công; PATCH lỗi
  giữ số liệu từ trạng thái cuối đã được server xác nhận. Đây không phải trường
  `progressValue` hay tín hiệu rủi ro mới; các ngữ nghĩa đó vẫn `TBD`.

Minh chứng trình duyệt/API/MySQL và kết quả kiểm thử nằm tại
[Chapter 8](../chapter-08-ai-software-testing/README.md).
Chờ human review giao diện và phạm vi demo; chưa đóng Chapter 6.

Với các phạm vi lập trình được phê duyệt tiếp theo, lưu prompt, quyết định rà
soát, vòng hiệu chỉnh và kết quả kiểm tra xác nhận thành bằng chứng có truy vết.
