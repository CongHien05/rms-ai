# Chapter 8 — AI trong Kiểm thử Phần mềm

## 1. Mục tiêu theo đề cương

Sử dụng AI để hỗ trợ Test Case Design, Unit Testing, Integration Testing, System
Testing và Test Automation, đồng thời kiểm tra lại test do AI đề xuất.

## 2. RMS-AI áp dụng chương này như thế nào

Backend đã có hạ tầng Vitest, unit test cho các service nền tảng và một e2e test
cho ứng dụng. Frontend và AI service chưa có test suite thuộc source của dự án.

## 3. Artifact hiện có

- [Backend test scripts](../backend/package.json)
- [Vitest unit configuration](../backend/vitest.config.ts)
- [Vitest e2e configuration](../backend/vitest.config.e2e.ts)
- [App e2e test](../backend/test/app.e2e-spec.ts)
- [Project service unit test](../backend/src/projects/projects.service.spec.ts)
- [Employee skill service unit test](../backend/src/employee-skills/employee-skills.service.spec.ts)
- [Frontend scripts hiện tại](../frontend/package.json)
- [AI service dependencies hiện tại](../ai-service/requirements.txt)

## 4. Tiến độ

- [x] Có lệnh chạy unit test, coverage và e2e test cho Backend.
- [x] Có unit test cho database config và các service nền tảng hiện tại.
- [x] Có e2e smoke test cho Backend.
- [ ] Bổ sung test infrastructure cho Frontend.
- [ ] Bổ sung test suite cho AI service.
- [ ] Mở rộng Integration Testing, System Testing và Test Automation toàn luồng.

## 5. Bằng chứng AI-assisted workflow

Repository có test source, cấu hình và scripts để validation. Chưa tập trung
prompt sinh test, human review của test case hoặc báo cáo chạy test vào chapter
này; tài liệu này không tuyên bố kết quả PASS lịch sử.

## 6. Việc tiếp theo

Lập test strategy dựa trên Acceptance Criteria, xác định ưu tiên cho Frontend,
Backend và AI service trước khi bổ sung test mới trong task riêng.
