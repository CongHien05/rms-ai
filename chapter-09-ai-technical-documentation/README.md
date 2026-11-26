# Chapter 9 — AI trong việc sinh tài liệu kỹ thuật

## 1. Mục tiêu theo đề cương

Sử dụng AI để hỗ trợ tài liệu kỹ thuật, README, chuyển giao kiến thức và tài liệu
tổng kết, với bước rà soát tính chính xác của nhóm.

## 2. RMS-AI áp dụng chương này như thế nào

Repository đã có README vận hành, tài liệu yêu cầu, thiết kế, kiến trúc và các
quy tắc làm việc. Dự án chưa kết thúc nên chưa có báo cáo cuối cùng hay bộ tài
liệu bàn giao hoàn chỉnh.

## 3. Tài liệu hiện có

- [README tổng quan repository](../README.md)
- [Tiến độ theo đề cương](../COURSE_PROGRESS.md)
- [Backend README](../backend/README.md)
- [Frontend README](../frontend/README.md)
- [Chapter 3 — Yêu cầu và sản phẩm](../chapter-03-ai-for-requirements-product-analysis/README.md)
- [Chapter 4 — Thiết kế sản phẩm](../chapter-04-ai-for-product-design/README.md)
- [Quy tắc repository](../AGENTS.md)
- [Audit tích hợp Spec Kit và roadmap MVP](docs/spec-kit-adoption-audit.md)
- [RMS-AI Constitution](../.specify/memory/constitution.md)

## 4. Tiến độ

- [x] Có README tổng quan và hướng dẫn cho các thành phần chính.
- [x] Có tài liệu yêu cầu, thiết kế, kiến trúc, API và nền tảng database.
- [x] Có chỉ mục theo dõi tiến độ Chapter 3–9.
- [ ] Đối chiếu toàn bộ tài liệu với phần triển khai ở mốc cuối dự án.
- [ ] Hoàn thiện chuyển giao kiến thức và tài liệu cuối cùng.

## 5. Bằng chứng quy trình có AI hỗ trợ

Repository lưu prompt cho một số tài liệu yêu cầu/thiết kế, hướng dẫn, tài liệu
đã qua nhiều commit và các mốc merge. Chưa tập trung bằng chứng sinh tài liệu và
rà soát của con người vào Chapter 9.

### Milestone Adopt GitHub Spec Kit (2026-11-24)

Người giao việc chốt áp dụng Spec Kit 1.4.4 vào repository đang phát triển
và giới hạn thay đổi ở cấu hình, Constitution và tài liệu. AI hỗ trợ kiểm
kê scaffold, chạy kiểm tra hiện trạng, soạn 14 nguyên tắc và truy vết roadmap
về PRD, User Stories và Acceptance Criteria. Codex đã nhận diện 9 skill.
Frontend đạt 10/10 test, Backend đạt 55/55 unit và 11/11 E2E có test double,
AI service đạt 9/9 unit và 5/5 ca smoke ASGI. MySQL local chưa kết nối lại.

### Hoàn tất hồ sơ tích hợp (2026-11-25)

Người phụ trách phê chuẩn Constitution 1.0.0, Hybrid SDD, giữ LF cho các file
scaffold do manifest quản lý và roadmap MVP. Milestone chức năng đầu tiên
là What-if Simulation. AI ghi lại các quyết định PROPOSED DEMO trong Chapter 3,
đối chiếu baseline sau fetch và cập nhật hướng dẫn chạy. Checkout cách ly giữ
22/22 hash. AI service đạt 9/9 unit và 5/5 smoke HTTP trong `.venv`.
Kiểm tra chỉ đọc MySQL dev đạt. Trạng thái nghiệm thu What-if vẫn mở.
[Kết quả và giới hạn kiểm tra](docs/spec-kit-adoption-audit.md).

### Bàn giao kiểm thử What-if 001 (2026-11-25)

Phạm vi **PROPOSED DEMO** đã chạy trên MariaDB dev. What-if chỉ cần Backend
và Frontend, sử dụng `WHAT_IF_CONTEXT_SECRET` trong `backend/.env` cục bộ
để xác minh ngữ cảnh. Phép tính deterministic dùng giờ trống đọc lại. Khi thiếu khóa,
danh sách đề xuất vẫn khả dụng và What-if không thể chạy.

Người phụ trách duyệt thiết kế ở Gate 2; AI ghi lệnh, fixture dev, số đo và
giới hạn của từng lớp bằng chứng. Gate 3 chờ người phụ trách review.
[Quickstart](../specs/001-what-if-simulation/quickstart.md)
· [Kết quả unit, HTTP E2E và runtime](../chapter-08-ai-software-testing/README.md).

## 6. Việc tiếp theo

Khi dự án đạt mốc cuối, kiểm tra link, thuật ngữ, lệnh vận hành và sự phù hợp
giữa tài liệu với mã nguồn trước khi lập tài liệu bàn giao.

### Bàn giao Gate 3 Authentication & RBAC 002 (2026-11-26)

Người phụ trách đã phê duyệt D1–D3 và Gate 2. AI triển khai T001–T034,
đối chiếu diff, test và tài liệu vận hành. Hồ sơ Gate 3 dẫn về
[ma trận quyền](../specs/002-auth-rbac/contracts/auth-rbac-api.md),
[kiểm thử](../chapter-08-ai-software-testing/README.md#kiểm-chứng-authentication--rbac-002-2026-11-26)
và [review diff](../chapter-07-ai-code-review-refactoring/README.md#review-authentication--rbac-002-2026-11-26).
Môi trường HTTPS được đối chiếu bằng HTTP E2E test double ở mức thuộc
tính cookie, runtime dùng loopback. Gate 3 chờ người phụ trách review.

Commit message đề xuất là `feat(auth): triển khai phiên và phân quyền RMS-AI`.

### Danh sách dự kiến commit

94 tệp trong diff Gate 3, gồm đủ tám artifact Spec Kit.

```text
COURSE_PROGRESS.md
ai-service/README.md
ai-service/main.py
ai-service/test_risk.py
backend/.env.example
backend/README.md
backend/package.json
backend/src/app-config.ts
backend/src/app.controller.ts
backend/src/app.module.ts
backend/src/auth/account-operations.service.ts
backend/src/auth/auth-admin.ts
backend/src/auth/auth-origin.guard.ts
backend/src/auth/auth-policy.ts
backend/src/auth/auth-session.entity.ts
backend/src/auth/auth-session.repository.ts
backend/src/auth/auth-session.service.spec.ts
backend/src/auth/auth-session.service.ts
backend/src/auth/auth.config.ts
backend/src/auth/auth.controller.ts
backend/src/auth/auth.module.ts
backend/src/auth/authentication.guard.ts
backend/src/auth/authorization.guard.ts
backend/src/auth/dev-profile.service.ts
backend/src/auth/dto/login.dto.ts
backend/src/auth/login-rate-limiter.spec.ts
backend/src/auth/login-rate-limiter.ts
backend/src/auth/password.spec.ts
backend/src/auth/password.ts
backend/src/auth/project-mapping.service.ts
backend/src/auth/project-mapping.spec.ts
backend/src/auth/user-account.entity.ts
backend/src/database/database.config.spec.ts
backend/src/database/database.config.ts
backend/src/database/migrations/1791240000000-add-auth-and-project-owner.ts
backend/src/employee-skills/employee-skills.controller.ts
backend/src/employee-skills/employee-skills.module.ts
backend/src/employees/employees.controller.ts
backend/src/main.ts
backend/src/projects/project-simulation.service.ts
backend/src/projects/project.entity.ts
backend/src/projects/projects.controller.ts
backend/src/projects/projects.service.spec.ts
backend/src/projects/projects.service.ts
backend/src/projects/risk-client.spec.ts
backend/src/projects/risk-client.ts
backend/src/skills/skills.controller.ts
backend/src/sprints/sprints.controller.ts
backend/src/sprints/sprints.service.spec.ts
backend/src/sprints/sprints.service.ts
backend/src/tasks/tasks.controller.ts
backend/src/tasks/tasks.service.spec.ts
backend/src/tasks/tasks.service.ts
backend/test/app.e2e-spec.ts
backend/test/auth-http-fixture.ts
backend/test/auth-test-fixtures.ts
backend/test/auth.e2e-spec.ts
backend/test/dev-profile.e2e-spec.ts
backend/test/hr-authorization.e2e-spec.ts
backend/test/project-authorization.e2e-spec.ts
chapter-03-ai-for-requirements-product-analysis/README.md
chapter-03-ai-for-requirements-product-analysis/docs/PRD.md
chapter-03-ai-for-requirements-product-analysis/docs/acceptance-criteria.md
chapter-03-ai-for-requirements-product-analysis/docs/user-stories.md
chapter-05-ai-for-software-design-architecture/README.md
chapter-06-ai-coding/README.md
chapter-07-ai-code-review-refactoring/README.md
chapter-08-ai-software-testing/README.md
chapter-09-ai-technical-documentation/README.md
frontend/package.json
frontend/src/App.tsx
frontend/src/auth/LoginView.tsx
frontend/src/auth/api-client.ts
frontend/src/auth/login.css
frontend/src/auth/session.ts
frontend/src/dev-workspace/DevWorkspaceViews.tsx
frontend/src/dev-workspace/dev-profile.ts
frontend/src/hr-workspace/useHrData.ts
frontend/src/layout/AppShell.tsx
frontend/src/projects/ProjectDetailView.tsx
frontend/src/projects/ProjectResourceRecommendations.tsx
frontend/src/projects/ProjectRiskAssessment.tsx
frontend/src/projects/ProjectsView.tsx
frontend/src/projects/simulationRun.ts
frontend/test/auth-session.test.mjs
frontend/test/dev-workspace.test.mjs
specs/002-auth-rbac/checklists/requirements.md
specs/002-auth-rbac/contracts/auth-rbac-api.md
specs/002-auth-rbac/data-model.md
specs/002-auth-rbac/plan.md
specs/002-auth-rbac/quickstart.md
specs/002-auth-rbac/research.md
specs/002-auth-rbac/spec.md
specs/002-auth-rbac/tasks.md
```

### Bàn giao Gate 3 PM Decision Workflow 003 (2026-11-26)

Gate 2 do người phụ trách phê duyệt. AI triển khai và đối chiếu yêu cầu
Accept/Reject, độ mới, retry, lịch sử và quyền Project. Hồ sơ Gate 3 chờ
người phụ trách review. Database dev gốc giữ nguyên.

[Spec](../specs/003-pm-decision-workflow/spec.md) ·
[Tasks](../specs/003-pm-decision-workflow/tasks.md) ·
[Ma trận 27 endpoint](../specs/002-auth-rbac/contracts/auth-rbac-api.md#ma-trận-endpoint) ·
[Kiểm chứng](../chapter-08-ai-software-testing/README.md#kiểm-chứng-pm-decision-workflow-003-2026-11-26).
