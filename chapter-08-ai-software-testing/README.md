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

Lập chiến lược kiểm thử dựa trên Acceptance Criteria, xác định ưu tiên cho
Frontend, Backend và dịch vụ AI trước khi bổ sung test mới trong tác vụ riêng.
