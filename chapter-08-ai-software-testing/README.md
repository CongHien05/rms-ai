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

### Kiểm chứng luồng đánh giá rủi ro PM (2026-11-18)

- PASS Backend 55/55 unit, 9/9 e2e, build/lint. Test xác nhận Task từ nhiều
  Sprint của đúng dự án, dự án không tồn tại, ngày Việt Nam tại giờ chuyển ngày,
  deadline thiếu, cửa sổ rỗng, timeout và lỗi schema/phản hồi FastAPI.
- PASS Frontend 10/10 regression, build/lint. Browser kiểm thử PM mở dự án →
  “Đánh giá rủi ro”, rồi đổi dự án. Kết quả cũ biến mất khi chuyển dự án.
- PASS browser → Vite :5182 → NestJS :3102 → `rms_ai_pm_dev`/FastAPI :8002.
  Dự án dev `954af1bc-c37c-44cf-8082-53e344c479e5` có Task `TODO` hạn
  2026-11-21. Ngày đánh giá 2026-11-18. UI 55,84% khớp với FastAPI
  0,5584309749011264 trên cùng input MySQL, model `synthetic-logreg-v1`.
- PASS hai dự án dev riêng cho deadline null và hạn 2026-11-26 (D+8).
  Dừng FastAPI, UI hiện lỗi và nút thử lại. Khởi động lại rồi bấm thử lại
  trên cùng màn hình cho kết quả 55,84%.

### Kiểm chứng đề xuất nhân sự PM (2026-11-19)

- PASS Backend 55 unit và 11 e2e, Frontend 10 test. Build và lint hai phía đạt.
  E2e kiểm tra đủ/thiếu giờ, loại 0 giờ, chưa khai báo, sai tuần, sai kỹ năng,
  hòa theo tên rồi ID, danh sách rỗng, tiêu chí không hợp lệ và tài nguyên 404.
- PASS trình duyệt → Vite :5173 → NestJS :3000 → MariaDB/MySQL
  `rms_ai_pm_dev`. PM mở dự án `685511c0-2ede-48c0-976e-54dac5040b5e` rồi
  chọn TypeScript, tuần `2026-11-16`, 8 giờ. An Mây (còn 12,5 giờ) đứng đầu
  với 8/8 giờ và Bình Sương (còn 4 giờ) đứng thứ hai với 4/8 giờ.
- PASS xóa kết quả khi đổi tiêu chí hoặc dự án, hiển thị danh sách rỗng và
  phục hồi qua **Thử lại** sau khi khởi động lại NestJS. Đã thử thêm ở 390×844.
- PASS phản hồi đến muộn. Giữ phản hồi của yêu cầu 8 giờ, đổi tiêu chí sang
  6 giờ và nhận kết quả mới. Sau khi thả phản hồi cũ, UI vẫn hiển thị kết quả
  6/6 của An Mây và 4/6 của Bình Sương.
- Truy vấn SQL trước/sau cho cả 5 hồ sơ seed trả cùng tuần và số giờ trống.
  Đề xuất chỉ đọc theo quy tắc PROPOSED DEMO.

Lập chiến lược kiểm thử dựa trên Acceptance Criteria, xác định ưu tiên cho
Frontend, Backend và dịch vụ AI trước khi bổ sung test mới trong tác vụ riêng.

### Kiểm chứng What-if 001 (2026-11-25)

Gate 2 phê duyệt lát cắt **PROPOSED DEMO**. AI thực hiện kiểm thử theo
[ma trận FR/AT/SC](../specs/001-what-if-simulation/plan.md#ma-trận-kiểm-thử)
và đối chiếu bằng [quickstart](../specs/001-what-if-simulation/quickstart.md).

| Lớp bằng chứng | Kết quả |
| --- | --- |
| Backend unit | `npm test` **83/83 đạt**, gồm HMAC, phân loại lỗi nguồn, tính BigInt với số thập phân/số mũ và giới hạn giờ. |
| Backend HTTP E2E với test double | `npm run test:e2e` **16/16 đạt**. Luồng đề xuất cũ có 11 test ở baseline. Suite mới lấy proof thật từ response đề xuất, kiểm tra DTO, thay đổi nguồn 8/12,5 → 4, null/0/khác tuần, retry và không gọi save. |
| Frontend unit | `npm test` **25/25 đạt**. Suite mới có 15 test, dùng deferred promises cho chuyển ngữ cảnh, sửa rồi quay lại, retry, success/error/finally đến muộn và snapshot không khớp. |
| Build/lint | `npm run build` và `npm run lint` đều đạt cho cả Backend lẫn Frontend. |
| Browser runtime và HTTP thật | Vite :5191 → NestJS :3191 → `rms_ai_pm_dev`. TypeScript, tuần `2026-11-16`, nhu cầu 8 giờ. An Mây cho kết quả hỗ trợ/thiếu/trống **8/0/4,5**, **9/0/3,5** và **0,1/7,9/12,4**. Bình Sương cho **4/4/0**. Ca nhập 13 giờ bị chặn và giữ đầu vào. Đổi đầu vào ẩn tác động cũ. Luồng PM thật kết thúc ở ba chỉ báo. Luồng mock vẫn mở được Quyết định. Kiểm tra desktop 1280×900 và viewport đặt 390×844. Chiều rộng nội dung và viewport trên màn hẹp đều là 375 px, không cuộn ngang. HTTP qua proxy trả 200 và echo run ID đúng. |
| Browser có can thiệp network | Vite :5192 → proxy kiểm thử :3192 → NestJS :3191. Chèn một HTTP 503, UI giữ 2,25 giờ và cho thử lại. Lượt retry trả **2,25/5,75/10,25**. Trì hoãn phản hồi 3,25 giờ, đổi thành 4 giờ và chạy B; B giữ **4/4/8,5**. Rời dự án trong một lượt đang chờ rồi mở dự án khác; màn mới không có kết quả cũ. Các ca success/error/finally đảo thứ tự đầy đủ nằm ở unit Frontend. |
| SQL before/after | SELECT cùng 1 Project, 5 Employee, 7 EmployeeSkill và 3 Skill đã sắp xếp theo khóa. SHA-256 của tập kết quả trước/sau đều là `186548f417e67d7cda0faeffc6daf6c4adf03e1d7a4c4a0bb02b9b326c648621`. Không reset, seed, migration hoặc sửa fixture dev. |

AT-01/02 và một ca AT-04 chạy trên browser với MariaDB dev. AT-03 có trạng
thái thiếu giờ đúng tuần trên browser và cả ba outcome trong HTTP test double.
AT-06 và AT-08/09 có kiểm tra trình duyệt, với can thiệp riêng nêu trên.
Các ca null/0/khác tuần sau khi đã phát proof (AT-05) và thay đổi giờ thật
giữa hai lượt (AT-07) được kiểm chứng bằng test double. Tạo lại các ca đó
trên MariaDB dev cần ghi vào fixture, nên không chạy trên nguồn dev hiện có.
SC-004 áp dụng cho dữ liệu được đối chiếu trước/sau. Chưa nghiệm thu
`ProjectAllocation` vận hành.

Final code review bổ sung hai ca timeout cho Frontend, đưa kết quả
`npm test` lên **27/27 đạt**. Hai ca dùng đồng hồ giả để kiểm tra request
treo, body treo và retry sau timeout. Minh chứng trình duyệt/MariaDB ở trên
được ghi trước thay đổi giới hạn chờ.

### Smoke browser sau Gate 3 (2026-11-25)

- Chrome → Vite :5191 → proxy kiểm thử :3192 → NestJS :3191 → MariaDB
  dev `rms_ai_pm_dev`. Dùng TypeScript, tuần `2026-11-16`, nhu cầu 8 giờ
  và ứng viên [Demo HR] An Mây. HTTP 200 trả **8/0/4,5** giờ
  hỗ trợ/thiếu/trống giả định.
- Proxy giữ phản hồi HTTP 200 của lượt 2,25 giờ trong 19 giây. UI báo lỗi sau khi hết
  thời gian chờ (**10,033 giây**), giữ 2,25 giờ và bật **Thử lại mô
  phỏng**. Lượt thử lại có run ID mới, nhận HTTP 200 và hiện
  **2,25/5,75/10,25**. Lượt kế tiếp với 4 giờ hiện **4/4/8,5**. Khi
  proxy thả phản hồi cũ, kết nối của lượt cũ đã đóng và kết quả mới vẫn
  hiển thị. Chỉ lượt kiểm tra timeout có độ trễ chèn ở proxy.
- Chỉ dùng SELECT để chụp toàn bộ 8 Project, 5 Employee, 7 EmployeeSkill
  và 3 Skill, sắp xếp theo khóa. SHA-256 trước và sau trùng nhau
  (`3610d8f77c9fcdbf8f263ec5970a35ad81d3988960c6e7ac710ca13003bb6f29`).
  Không chạy migration, seed hoặc chỉnh dữ liệu dev.

### Kiểm chứng Authentication & RBAC 002 (2026-11-26)

Baseline `75404caf` chạy trước triển khai: 83 Backend unit, 16 HTTP E2E
với test double, 27 Frontend unit. Sau deploy thử 002 theo thiết kế Gate 2
đã duyệt, AI đối chiếu lại cùng các ca và chạy thêm nhóm Auth. Cách chạy và
truy vết FR/AC/AT/SC nằm trong [quickstart](../specs/002-auth-rbac/quickstart.md)
và [ma trận kiểm thử](../specs/002-auth-rbac/plan.md#ma-trận-kiểm-thử).

| Lớp | Kết quả thực tế |
| --- | --- |
| Backend unit | `npm test` **96/96**, gồm 83 baseline. Dùng KDF thật trong unit hash, clock/test double cho limiter và điều phối race. |
| Backend HTTP E2E | `npm run test:e2e` **27/27**, gồm 16 baseline. NestJS chạy guard và ValidationPipe thật với repository/DataSource double. |
| Frontend unit | `npm test` **34/34**, gồm 27 baseline. What-if giữ timeout/abort, retry và trạng thái phản hồi cũ. |
| FastAPI unit | `.venv/Scripts/python.exe -m unittest discover -v` **10/10**, gồm 9 baseline. Dùng model đã lưu, kiểm khóa thiếu/sai/lặp, không huấn luyện. |
| Build và lint | `npm run build`, `npm run lint` đạt ở Backend và Frontend. |
| HTTP runtime | Vite `:5192` → NestJS `:3192` → MariaDB `:33306`, Risk qua FastAPI `:8009`. **73 lượt**, đủ **25/25** route NestJS với ca được phép và ca âm theo phạm vi. Hai PM, HR, hai DEV và các tài khoản vận hành là fixture riêng. |
| Chrome runtime | Chrome 158, desktop 1280×900 và viewport 390×844. PM reload deep link rồi chạy Risk → Recommendation → What-if. HR đọc Employee/Skill thật trên clone. Hai DEV thấy đúng hồ sơ của mình và trạng thái thiếu ngữ cảnh. Logout về Login, lỗi mạng che workspace và retry thành công. Phiên thử hết hạn trong DB bị từ chối khi reload. Không cuộn ngang ở các viewport đã đo. |

| AT, tương ứng AC cùng số | Bằng chứng |
| --- | --- |
| AT-01 | HTTP và Chrome đăng nhập/reload cả ba role, danh tính lấy từ Backend. |
| AT-02 | Unit và HTTP kiểm sai thông tin, email chưa có/Account disable cùng 401. Runtime kiểm hoa/thường chung quota và 429 có `Retry-After`. Unit kiểm quota địa chỉ, trần KDF và cửa sổ thời gian. |
| AT-03 | HTTP test double kiểm cookie thiếu, trùng, hết hạn và kho phiên lỗi 503. Runtime HTTP và Chrome xác nhận phiên thử hết hạn trước khi reload. Frontend unit kiểm phản hồi phiên cũ. |
| AT-04 | HTTP kiểm logout chỉ thu hồi một phiên và cookie `Max-Age=0`. Chrome kiểm logout, mất mạng, workspace ẩn và thử lại. |
| AT-05 | Runtime hai PM thấy Project được cấp. PM tạo Project được gán quyền, tạo/đọc Sprint và tạo/đọc/sửa Task trên Project của mình. |
| AT-06 | Runtime Risk trả `scored`. Recommendation và What-if trả giờ hỗ trợ/thiếu/trống **4/4/8,5** với fixture 8 giờ. HTTP baseline giữ lỗi `404 INVALID_SCENARIO` đúng contract. |
| AT-07 | HTTP runtime từ chối Project/Sprint/Task của PM B và Project chưa gán khi PM A truy cập. Proof thật cấp cho B vẫn bị từ chối với A. HTTP test double kiểm không đọc/ghi Task sau khi từ chối. |
| AT-08 | Chrome xác thực trước khi mount, reload đúng workspace và deep link PM. 403 giữ phiên. HR/DEV mở hash PM vẫn vào workspace của mình. |
| AT-09 | HR đọc danh bạ, kỹ năng và availability trên clone. Các API tạo Employee/Skill và gán hoạt động. HTTP baseline giữ 0 giờ, thiếu dữ liệu và khác tuần. |
| AT-10 | HTTP role khác bị từ chối ở dữ liệu HR ngoài quyền, HR bị từ chối nghiệp vụ PM. Danh mục Skill của PM vẫn tải được. |
| AT-11 | Hai DEV có hai hồ sơ/Skills riêng. Chrome hiển thị thiếu Công việc vì chưa có nguồn giao việc. |
| AT-12 | Runtime từ chối ID Employee khác, query tự khai và yêu cầu Project từ DEV. Header role/Employee tự khai không thay đổi danh tính. |
| AT-13 | FastAPI trực tiếp thiếu khóa trả 401, Risk qua Backend thành công. Backend unit kiểm không theo redirect và giữ phân loại lỗi upstream. |
| AT-14 | Unit kiểm cạnh tranh login/reset và login/disable. MariaDB clone xác nhận cả hai race khi tạm dừng login sau KDF, hai phiên trước reset bị thu hồi, Account disable không tạo phiên mới. Clone từ chối trùng Employee. |
| AT-15 | Diễn tập backup/restore, DDL cộng thêm, gián đoạn và retry, mapping đúng/lặp/xung đột, đối chiếu sáu bảng và bảo toàn 126 hồi quy. |
| AT-16 | Runtime Origin sai/thiếu không tạo phiên, không logout và không ghi Project. HTTP E2E kiểm serialize cookie HTTPS `Secure`, host-only và `HttpOnly`. Chrome runtime dùng mode loopback. |

**Migration.** MariaDB 10.4.32 chạy trên instance cô lập `127.0.0.1:33306`.
Restore cùng backup từ bản sao của schema dev vào `rms_ai_auth002_clone`
và `rms_ai_auth002_recovery`. `SELECT DATABASE()` trước từng lượt. FK
được đối chiếu với ID `varchar(36)`, `utf8mb4_general_ci`, InnoDB.
Migration `1791240000000` chạy sau `1791230000000` với `--transaction each`.
Ca phục hồi ngắt sau DDL `user_accounts` rồi chạy lại, xác minh index/FK và
không có Project tự gán. Snapshot các cột cũ khớp 6/6 trên cả hai clone
với số hàng Project/Sprint/Task/Employee/Skill/EmployeeSkill lần lượt
**8/8/10/5/3/7**. SHA-256 tổng hợp
`6eaf410580b8ea021c78712d7f8af99f3085f22147d13ceeef4e2e7d593c6783`.
Snapshot Employee/Skill/EmployeeSkill trước/sau What-if đều là
`d70306e41a01c57e0679dfb1ade1dbd20452bf1a230790d9f7332a331036e5c6`.
Database dev gốc không khởi động, không migrate và không seed.

**Chi phí scrypt.** Node v24.14.1 trên máy Windows hiện tại, lấy RSS mỗi
5 ms, dùng `N=2^17,r=8,p=1`. Một lượt **587 ms**, RSS tăng khoảng **128 MiB**.
Hai lượt đồng thời **619 ms**, RSS tăng khoảng **256 MiB**. Đây là số đo
cục bộ, chưa phải benchmark dung lượng triển khai.

### Kiểm chứng PM Decision Workflow 003 (2026-11-26)

Baseline `cd9d810`. Trên Windows và Node 24.14.1, **188 test đạt**
gồm 100 Backend unit, 39 HTTP E2E dùng test double, 39 Frontend unit và
10 FastAPI unit. Bảo toàn toàn bộ 167 test baseline. Backend và Frontend
đạt build và lint. Các lần chạy sau chỉ chọn nhóm có thay đổi.
[Quickstart](../specs/003-pm-decision-workflow/quickstart.md).

| Tiêu chí | Bằng chứng đã chạy |
| --- | --- |
| AT-01–03, AT-12 | HTTP và MariaDB lưu hai lựa chọn, đúng PM và snapshot thập phân. Chrome xác nhận cả hai quyết định còn trong lịch sử sau reload. Sáu bảng nghiệp vụ giữ nguyên sau ghi. |
| AT-04, AT-11, AT-13 | Chrome giữ phản hồi sau commit để kiểm pending, timeout, retry và báo thành công sau xác nhận. Phản hồi đến muộn sau đổi Project hoặc logout bị bỏ. Hết phiên khi gửi quyết định trở về Login. Kịch bản kiểm lịch sử rỗng, lỗi và thử lại. HTTP E2E còn kiểm phân trang và thứ tự ổn định. |
| AT-05, AT-07, AT-08 | Unit và HTTP kiểm revision/runId, proof ứng viên, tham chiếu giả, UUID và snapshot/impact client. Chrome kiểm đổi số giờ làm mất nút quyết định cũ. |
| AT-06, AT-09, AT-14 | HTTP trên clone kiểm phiên hết hạn, role, ownership, Project chưa gán, Origin, giờ/tuần/Skill và lịch sử sau đổi PM. |
| AT-10, AT-15, AT-16 | HTTP trên clone kiểm hai request cùng lựa chọn (201/200) và đối nghịch (201/409). Unique MariaDB trả 1062 cho INSERT lặp. Trigger chỉ dùng trên clone tạo lỗi trước commit, rollback và retry đạt. Proxy cắt phản hồi sau commit. Sau restart và thay đổi availability, gửi lại vẫn nhận đúng ID. Đã kiểm cả khóa ký thiếu và khóa thay. |

**HTTP runtime** đạt 53 lượt trên NestJS và MariaDB 10.4.32 riêng cổng
33307. Hai clone khôi phục từ bản sao lưu dev có sẵn, nâng tới baseline 002
và thêm fixture Account/Session trước khi chụp dữ liệu. Di trú bình thường
và chạy lại khi DDL đã hoàn thành trước lúc ghi lịch sử di trú đều giữ
nguyên 8/8 bảng. Database dev gốc không được dùng trong lượt chạy này.

**AT-01–16 và SC-001–004 đạt** theo các lớp kiểm chứng trên. Chrome 158 chạy
qua Vite và Backend trên clone ở chế độ Auth local. Kịch bản mô phỏng mất
phản hồi và lỗi lịch sử ở lớp test. Backend vận hành dùng nguyên handler.
