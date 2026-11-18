# Chapter 8 — AI trong Kiểm thử Phần mềm

## 1. Mục tiêu theo đề cương

Sử dụng AI để hỗ trợ thiết kế ca kiểm thử, kiểm thử đơn vị, kiểm thử tích hợp,
kiểm thử hệ thống và tự động hóa kiểm thử, đồng thời kiểm tra lại test do AI đề xuất.

## 2. RMS-AI áp dụng chương này như thế nào

Backend có hạ tầng Vitest, unit test và e2e. Frontend có regression cho Task.
Dịch vụ AI có unittest cho baseline dự báo trễ hạn.

## 3. Tài liệu hiện có

- [Các tập lệnh kiểm thử Backend](../backend/package.json)
- [Cấu hình unit test Vitest](../backend/vitest.config.ts)
- [Cấu hình e2e test Vitest](../backend/vitest.config.e2e.ts)
- [E2e test của ứng dụng](../backend/test/app.e2e-spec.ts)
- [Unit test của project service](../backend/src/projects/projects.service.spec.ts)
- [Unit test của employee skill service](../backend/src/employee-skills/employee-skills.service.spec.ts)
- [Các tập lệnh Frontend hiện tại](../frontend/package.json)
- [Các dependency hiện tại của dịch vụ AI](../ai-service/requirements.txt)

## 4. Tiến độ

- [x] Có lệnh chạy unit test, coverage và e2e test cho Backend.
- [x] Có unit test cho database config và các service nền tảng hiện tại.
- [x] Có e2e smoke test cho Backend.
- [ ] Bổ sung hạ tầng kiểm thử cho Frontend.
- [x] Bổ sung bộ kiểm thử cho baseline của dịch vụ AI.
- [ ] Mở rộng kiểm thử tích hợp, kiểm thử hệ thống và tự động hóa kiểm thử toàn luồng.

## 5. Bằng chứng quy trình có AI hỗ trợ

Repository có mã nguồn test, cấu hình và tập lệnh để kiểm tra xác nhận. Chưa tập
trung prompt sinh test, hoạt động rà soát ca kiểm thử của con người hoặc báo cáo
chạy test vào chapter này; tài liệu này không tuyên bố kết quả PASS lịch sử.

## 6. Việc tiếp theo

### Kiểm chứng thực tế luồng PM tạo dự án (2026-11-17)

AI chạy kiểm tra và sửa cấu hình local theo yêu cầu; database kiểm thử riêng
`rms_ai_pm_dev` trên MySQL có sẵn, hai migration thực thi thành công.
Không dùng kết quả mock-e2e làm bằng chứng persistence.

| Kiểm tra đã chạy | Kết quả / bằng chứng |
| --- | --- |
| Frontend build/lint; Backend build/lint | PASS |
| Backend unit | PASS: 36/36, `npm test -- --maxWorkers=1`; lần đầu chạy song song timeout một hook, chạy lại tuần tự đạt |
| Backend e2e dùng mock | PASS: 5/5; kiểm tra lại sau thay đổi cấu hình |
| UI danh sách rỗng | PASS: hiện “Chưa có dự án” trước khi tạo |
| UI tạo và tải lại trang | PASS: `PM-E2E-20261117-1938` vẫn hiện sau reload |
| GET API đối chiếu MySQL | PASS: cùng ID `5cab765c-fcce-4577-a5a8-e861ae69ca85`; HTTP 200 và đúng một bản ghi |
| Tên trống | PASS: UI chặn; POST tên chỉ gồm khoảng trắng trả HTTP 400 |
| Submit lặp | PASS: double-click tạo `PM-DOUBLE-20261117-1940`; form disabled khi gửi; MySQL có đúng một bản ghi |
| API ngừng hoạt động | PASS: tạm dừng Backend; GET và POST đều hiện lỗi, giữ tên nhập, không báo tạo thành công |
| Retry khi API hồi phục | PASS: khởi động lại Backend, bấm “Thử lại”, danh sách thật xuất hiện |
| Ranh giới risk | PASS: danh sách dự án thật chỉ ghi chưa có đánh giá, không có nút dẫn vào risk mock |

Đã quan sát giao diện bằng trình duyệt tích hợp và screenshot; đây là kiểm thử
thủ công có công cụ hỗ trợ, chưa có bộ regression tự động cho Frontend.
Dữ liệu kiểm thử được giữ lại. Backend/Frontend được để chạy local để người dùng
review; Auth/RBAC, tải lớn và triển khai production chưa kiểm thử trong tác vụ này.

### Kiểm chứng thực tế luồng PM mở dự án → Sprint → Task (2026-11-17)

Kiểm thử tự động trên trình duyệt thật (browser subagent) kết hợp đối chiếu
trực tiếp API NestJS và database MySQL `rms_ai_pm_dev`.

| Kiểm tra đã chạy | Kết quả / bằng chứng |
| --- | --- |
| Frontend build/lint | PASS: `oxlint` 0 lỗi 0 cảnh báo; `tsc -b && vite build` 33 modules thành công |
| Backend build/lint/test | PASS: 36/36 unit test, 5/5 e2e test, NestJS build sạch |
| Mở dự án thật bằng ID | PASS: Click "Mở dự án" chuyển URL `#project/685511c0-2ede-48c0-976e-54dac5040b5e`, tiêu đề h1 hiển thị đúng "Dự án Thử Nghiệm PM 20261117" |
| Validation tên Sprint trống | PASS: Bấm "Tạo sprint" khi ô trống hiển thị lỗi `Tên Sprint không được để trống.` |
| Tạo Sprint 1 | PASS: Tạo `Sprint 1 - Khởi động` (ID: `1b903123-6b45-4e21-8199-17f130aa0777`), hiện form task và trạng thái `Chưa có task trong sprint này.` |
| Validation tiêu đề Task trống | PASS: Bấm "Thêm task" khi ô trống hiển thị lỗi `Tiêu đề Task không được để trống.` |
| Tạo Task vào Sprint 1 | PASS: Thêm `Task 1.1 - Thiết lập môi trường` (ID: `894e38d6-624e-4e4a-a549-25e0748bd9a7`) hiển thị đúng trong Sprint 1 |
| Tạo Sprint 2 & Task 2.1 | PASS: Tạo `Sprint 2 - Phát triển` và thêm `Task 2.1 - Lập trình giao diện` (ID: `abfc6cb7-c8bd-4f04-83de-f7d3c4e77834`) |
| Không lẫn lộn giữa Sprint | PASS: Sprint 1 chỉ chứa Task 1.1; Sprint 2 chỉ chứa Task 2.1 |
| Tải lại trang (Reload URL) | PASS: Tải lại URL `#project/685511c0-2ede-48c0-976e-54dac5040b5e` vẫn mở đúng dự án, giữ nguyên 2 sprint và 2 task |
| Điều hướng quay lại | PASS: Nút "← Quay lại" đưa về danh sách `#projects` chính xác |
| Đối chiếu API & MySQL | PASS: Query MySQL và gọi GET API trả về khớp chính xác các ID, projectId, sprintId và title |

### Kiểm chứng thực tế cập nhật trạng thái Task (2026-11-17)

Kiểm thử trên database `rms_ai_pm_dev`, API NestJS và trình duyệt thật (browser subagent):

| Kiểm tra đã chạy | Kết quả / bằng chứng |
| --- | --- |
| Migration database | PASS: Migration `AddStatusToTasks1791130000000` chạy thành công; các task cũ được gán `TODO` |
| Backend unit & e2e test | PASS: 41/41 unit test (`tasks.service.spec.ts` 9 tests), 5/5 e2e test |
| Backend validation lỗi status | PASS: `PATCH` với `{ status: "INVALID" }` trả về HTTP 400 Bad Request |
| Backend validation lỗi UUID | PASS: `PATCH` với task ID không phải UUID trả về HTTP 400 Bad Request |
| Backend validation task không tồn tại | PASS: `PATCH` với UUID ngẫu nhiên không tồn tại trả về HTTP 404 Not Found |
| Đổi trạng thái trên UI | PASS: Task 1.1 đổi sang "Đang làm" (IN_PROGRESS) và "Hoàn thành" (DONE); hiển thị tiếng Việt chính xác |
| Chống thao tác lặp | PASS: Dropdown chuyển `disabled` kèm trạng thái "Đang lưu..." khi đang gửi request |
| Độc lập giữa các task | PASS: Task 1.1 đổi trạng thái nhưng Task 2.1 ở Sprint 2 vẫn giữ nguyên "Chưa làm" |
| Bền vững sau reload | PASS: Reload URL `#project/:id` giữ nguyên Task 1.1 là "Hoàn thành" và Task 2.1 là "Bị chặn" |
| Đối chiếu MySQL & API | PASS: Query MySQL và GET API trả về đúng `status`: Task 1.1 là `DONE`, Task 2.1 là `BLOCKED` |
| Mục chưa kiểm chứng | Chưa có bộ regression tự động riêng cho Frontend; chưa kiểm thử Auth/RBAC thật |

### Regression race GET/PATCH và ràng buộc Sprint–Task (2026-11-17)

- Frontend có test cô lập cố ý trì hoãn GET đến sau khi PATCH thành công, xác nhận
  response cũ không đổi trạng thái mới; test riêng xác nhận GET bị chặn khi PATCH
  đang chạy. Đây là regression test cho guard, chưa thay thế kiểm thử component/UI.
- Backend có unit test và e2e test xác nhận task thuộc sprint khác trả HTTP 404,
  không gọi lưu và dữ liệu task gốc giữ nguyên. E2e dùng repository in-memory,
  không sửa dữ liệu MySQL dev.
- PASS: Frontend race test 2/2, build và lint; Backend unit 40/40, e2e 6/6,
  build và lint; `git diff --check` không có lỗi whitespace.
- PASS trên trình duyệt thật: proxy tạm giữ response PATCH 5 giây; select và nút
  `Tải lại task` đều bị khóa, hiện `Đang lưu...`, sau response thì mở lại.
  Task dev được trả về trạng thái ban đầu `IN_PROGRESS`; không tạo/xóa dữ liệu.
- Chưa có component test tự động cho toàn bộ `ProjectDetailView`; test GET trả
  muộn hiện kiểm chứng trực tiếp guard dùng trong component, còn browser test
  kiểm chứng trạng thái khóa reload khi PATCH bị trì hoãn.

### Regression tổng hợp tiến độ Sprint (2026-11-17)

- Test Frontend kiểm tra phép đếm `DONE`/`BLOCKED`, tỷ lệ phần trăm làm tròn,
  Sprint rỗng và tính lại ngay sau khi áp dụng trạng thái PATCH đã xác nhận.
- Test riêng xác nhận khi cập nhật lỗi và mảng task xác nhận không đổi thì số liệu
  tiến độ cũng không đổi. Hàm tổng hợp dùng đúng state `tasks` của component,
  không mock thêm API đếm.
- PASS: `npm test` 6/6 (gồm race 2/2 và tiến độ 4/4), Frontend build/lint sạch,
  `git diff --check` sạch.
- PASS browser/MySQL: số tổng/`DONE`/`BLOCKED` khớp task hiển thị; đổi Task 1.1
  `IN_PROGRESS → BLOCKED → DONE` cập nhật lần lượt 0% và 100%, reload vẫn giữ
  `DONE`. Sau kiểm tra task được trả về `IN_PROGRESS`; sprint rỗng
  `Sprint Browser Empty 20261117-2119` hiển thị `Chưa có công việc` cả sau reload.

### Kiểm chứng milestone kế hoạch Task (2026-11-18)

- PASS migration `AddTaskPlanningFields1791220000000` trên MySQL dev
  `rms_ai_pm_dev`: schema có `DATE NULL`/`DOUBLE NULL`; 2 Task cũ vẫn null.
- PASS tự động: Backend 42/42 unit, 6/6 e2e, build/lint; Frontend 10/10 test,
  build 36 modules và lint. Test bao phủ tạo/đọc/sửa/xóa optional, PATCH giữ
  field bỏ qua, validation, status null và sai Sprint.
- PASS API thật: ngày không tồn tại, giờ 0/vô hạn và status null trả 400; sai
  Sprint trả 404. PATCH riêng `estimatedHours` giữ `dueDate`/status; gửi null xóa
  rồi khôi phục thành công.
- PASS browser tại `http://127.0.0.1:5180/#project/685511c0-2ede-48c0-976e-54dac5040b5e`:
  double-click chỉ tạo 1 Task, sửa thành hạn `2026-12-20`, `8.25` giờ, đổi DONE
  cập nhật tiến độ 100%; reload giữ nguyên. UI vẫn đọc được 2 Task cũ với placeholder
  nullable và status trước đó.
- PASS đối chiếu API/MySQL cùng ID `e6079e74-fb4a-4d83-92c0-bfd10361cd65`,
  `DONE`, `2026-12-20`, `8.25`. Đây là PROPOSED DEMO; `estimatedHours` chỉ là
  khối lượng Task, chưa phải workload nhân viên do chưa có assignee/allocation.

### Kiểm chứng HR đọc nguồn lực theo tuần (2026-11-18)

- PASS Backend 44/44 unit, 8/8 e2e với repository in-memory, build và lint.
  Test kiểm tra mốc đổi tuần theo giờ Việt Nam, tuần qua năm mới, danh sách
  rỗng và API trả riêng 0 giờ, chưa khai báo, khác tuần. PASS Frontend 10/10
  regression, build và lint.
- PASS MySQL dev `rms_ai_pm_dev`. Migration
  `AddEmployeeAvailability1791230000000` đã áp dụng. Seed lần một chèn 5 nhân sự,
  3 kỹ năng và 7 liên kết. Lần hai chèn 0 ở cả ba nhóm.
- PASS browser tại `http://127.0.0.1:5181/` → HR → Nhân sự. Khi Backend chưa chạy,
  UI hiện lỗi. Sau khi khởi động Backend, nút “Thử lại” tải được tuần 16–22/11/2026.
  Màn Kỹ năng hiển thị danh mục từ API.
- PASS đối chiếu browser, API và MySQL. An Mây (ID
  `2e0f7db7-c2cb-412c-8acf-000000000001`) có MySQL, TypeScript và 12,5 giờ.
  Bình Sương cùng kỹ năng TypeScript có 4 giờ, Chi Nắng có 0 giờ, Dương Gió
  chưa khai báo, Giang Mưa có dữ liệu tuần bắt đầu 09/11/2026.

### Kiểm chứng baseline AI dự báo trễ hạn Task (2026-11-18)

- PASS training seed 42. Sinh 600 dự án và 2.400 snapshot, còn 1.734 mẫu có thể
  chấm điểm từ 579 dự án (61,25% nhãn dương). Train 434 dự án/1.310 mẫu, test
  145 dự án/424 mẫu (62,03% dương), các `projectId` tách biệt.
- Logistic Regression đạt precision/recall/F1 lớp dương 0,815/0,787/0,801,
  ma trận `[[114,47],[56,207]]`. Baseline luôn đoán lớp phổ biến (1) đạt
  0,620/1,000/0,766, ma trận `[[0,161],[0,263]]`. Kết quả chỉ phản ánh dữ liệu
  giả lập. [Báo cáo metric đầy đủ](../ai-service/artifacts/metrics.json)
- PASS 9/9 unittest, compileall và HTTP thật. Với D=2026-11-18, ca biên chỉ nhận
  Task mở đến hạn 25/11 trong nhóm D−1/D/D+7/D+8, trả xác suất 0,263722 và phiên bản
  `synthetic-logreg-v1`. Ca thiếu deadline và ca không Task trong cửa sổ trả
  trạng thái riêng. Trường kết quả tương lai bị từ chối với HTTP 422.
  [Lệnh tái lập](../ai-service/README.md)

Lập chiến lược kiểm thử dựa trên Acceptance Criteria, xác định ưu tiên cho
Frontend, Backend và dịch vụ AI trước khi bổ sung test mới trong tác vụ riêng.
