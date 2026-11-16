# Chapter 8 — AI trong Kiểm thử Phần mềm

## 1. Mục tiêu theo đề cương

Sử dụng AI để hỗ trợ thiết kế ca kiểm thử, kiểm thử đơn vị, kiểm thử tích hợp,
kiểm thử hệ thống và tự động hóa kiểm thử, đồng thời kiểm tra lại test do AI đề xuất.

## 2. RMS-AI áp dụng chương này như thế nào

Backend đã có hạ tầng Vitest, unit test cho các service nền tảng và một e2e test
cho ứng dụng. Frontend và dịch vụ AI chưa có bộ kiểm thử thuộc mã nguồn dự án.

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
- [ ] Bổ sung bộ kiểm thử cho dịch vụ AI.
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

Lập chiến lược kiểm thử dựa trên Acceptance Criteria, xác định ưu tiên cho
Frontend, Backend và dịch vụ AI trước khi bổ sung test mới trong tác vụ riêng.
