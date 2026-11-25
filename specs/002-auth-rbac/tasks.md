# Tasks — Authentication & RBAC

**Đầu vào** [Spec](spec.md), [plan](plan.md), [research](research.md), [data model](data-model.md), [API contract](contracts/auth-rbac-api.md), [quickstart](quickstart.md). Gate 2 chỉ tạo danh sách này. Các file ứng dụng dưới đây là đích của lượt triển khai sau.

**Định dạng** Mỗi mục có mã T, `[P]` nếu độc lập với các mục song song cùng pha, và `[USn]` nếu thuộc một user story. Chuẩn FR và AC lấy từ spec, AT lấy từ [ma trận](plan.md#ma-trận-kiểm-thử).

## Phase 1 — Setup

- [X] T001 Định nghĩa mode local/HTTPS, origin chính xác, nguồn IP tin cậy và ranh giới cấu hình không chứa secret trong `backend/src/auth/auth.config.ts` và `backend/.env.example`. FR-001, FR-003, AT-02, AT-16.
- [X] T002 Tách cấu hình Nest dùng chung cho bootstrap thật và Supertest để giữ ValidationPipe và policy nhất quán trong `backend/src/app-config.ts`, `backend/src/main.ts` và `backend/test/app.e2e-spec.ts`. FR-002, FR-003, AT-03, AT-07.
- [X] T003 Chuẩn bị fixture Auth và Origin cho HTTP tương thích Supertest trong `backend/test/auth-test-fixtures.ts`. Chỉ thay repository/DataSource/clock/transport. Ghi mốc 83/16/27 và giữ toàn bộ assertion nghiệp vụ. FR-003, FR-008, AT-01, AT-15, SC-003.

## Phase 2 — Foundational

- [X] T004 Khai báo entity trong `backend/src/auth/user-account.entity.ts` và `backend/src/auth/auth-session.entity.ts` theo [data-model.md](data-model.md) cho `UserAccount.id`, `UserAccount.email`, `UserAccount.passwordHash`, `UserAccount.role`, `UserAccount.employeeId`, `UserAccount.disabledAt`, `AuthSession.tokenDigest`, `AuthSession.accountId` và `AuthSession.expiresAt`. FR-001, FR-002, FR-007, AT-01, AT-14.
- [X] T005 Tạo DDL cộng thêm trong `backend/src/database/migrations/1791240000000-add-auth-and-project-owner.ts`, đăng ký trong `backend/src/database/database.config.ts`, cập nhật `backend/src/projects/project.entity.ts` theo [data-model.md](data-model.md) cho `Project.pmAccountId`. Mọi hàng cũ giữ nguyên, index/FK và chế độ DDL `each` theo plan, không backfill tự động. FR-005, FR-008, AT-15, SC-003.
- [X] T006 Viết lookup phiên một truy vấn và principal trong `backend/src/auth/auth-session.repository.ts` và `backend/src/auth/auth-policy.ts`, kiểm account active, expiry và định dạng cookie, khai báo role/per-route policy rõ ràng. FR-002, FR-003, AT-03, AT-07.
- [X] T007 Đăng ký `AuthenticationGuard`, `AuthorizationGuard` và `AuthOriginGuard` theo thứ tự trong `backend/src/auth/auth.module.ts`, `backend/src/auth/authentication.guard.ts`, `backend/src/auth/authorization.guard.ts`, `backend/src/auth/auth-origin.guard.ts` và `backend/src/app.module.ts`. Áp dụng deny by default và ngoại lệ health tường minh ở `backend/src/app.controller.ts`. FR-002, FR-003, FR-009, AT-03, AT-13, AT-16.
- [X] T008 Thêm API client cùng origin có nhận biết `401`/`403` và thế hệ phiên, giữ khả năng truyền `AbortSignal` và xử lý body trong `frontend/src/auth/api-client.ts`. FR-002, FR-004, AT-03, AT-08.

## Phase 3 — US1 · Đăng nhập và quản lý phiên (P1)

**Kiểm độc lập** Supertest với tài khoản cả ba role thấy đúng principal, và ca mật khẩu sai, disabled, hết hạn, reset, logout, Origin sai đều thất bại đúng status. Frontend kiểm loading/reload/late response.

### Kiểm thử

- [X] T009 [P] [US1] Viết unit test hash/dummy, quota/slot/clock, session và khóa Account khi reset hoặc disable trong `backend/src/auth/password.spec.ts`, `backend/src/auth/login-rate-limiter.spec.ts` và `backend/src/auth/auth-session.service.spec.ts`. FR-001, FR-002, AT-02, AT-03, AT-04, AT-14.
- [X] T010 [P] [US1] Viết contract test login/me/logout, nhiều cookie/phiên, expiry/disable/reset, kho phiên trả lỗi, unknown role và Origin trong `backend/test/auth.e2e-spec.ts`. FR-001, FR-002, FR-003, AT-01, AT-02, AT-03, AT-04, AT-14, AT-16, SC-001.
- [X] T011 [P] [US1] Thêm test trạng thái phiên, `401` delay của phiên cũ, `403`, logout lỗi/timeout và reload trong `frontend/test/auth-session.test.mjs`. FR-002, FR-004, AT-01, AT-03, AT-04, AT-08, SC-004.

### Thực hiện

- [X] T012 [US1] Thực thi scrypt và rate limiter có giới hạn bộ nhớ/counter/concurrency trong `backend/src/auth/password.ts` và `backend/src/auth/login-rate-limiter.ts`. Origin và DTO phải qua trước KDF; dùng thông báo đồng nhất và Retry-After. FR-001, AT-02.
- [X] T013 [US1] Thực thi login/rotate cookie, lưu digest, kiểm hạn, logout xóa đúng phiên và transaction phối hợp reset/disable trong `backend/src/auth/auth-session.service.ts` và `backend/src/auth/auth-session.repository.ts`. FR-001, FR-002, AT-01, AT-03, AT-04, AT-14.
- [X] T014 [US1] Thực thi cấp account/reset-password/disable/prune-expired, kiểm Employee cho DEV, prompt TTY ẩn và ghi log an toàn ở `backend/src/auth/account-operations.service.ts`, `backend/src/auth/auth-admin.ts` và `backend/package.json`. FR-001, FR-002, FR-007, AT-02, AT-14.
- [X] T015 [US1] Kết nối login/me/logout theo contract và đăng ký DTO/cookie lẫn policy route trong `backend/src/auth/auth.controller.ts`, `backend/src/auth/auth.module.ts` và `backend/src/auth/dto/login.dto.ts`. FR-001, FR-002, FR-003, AT-01, AT-02, AT-04, AT-16.
- [X] T016 [US1] Dựng Login và bộ điều phối phiên tại `frontend/src/auth/LoginView.tsx`, `frontend/src/auth/session.ts`, `frontend/src/App.tsx` và `frontend/src/layout/AppShell.tsx`. Chờ /me, phục hồi deep link được phép, nhánh Logout đóng workspace và bỏ Role Preview khỏi entrypoint; chạy test mới qua `frontend/package.json`. FR-002, FR-004, AT-01, AT-03, AT-04, AT-08, SC-001, SC-004.

## Phase 4 — US2 · PM theo phạm vi Project (P1)

**Kiểm độc lập** Hai PM và Project chưa ánh xạ. PM tạo và truy cập Project của mình, scope kế thừa qua Sprint/Task; proof hợp lệ của PM khác vẫn bị từ chối.

### Kiểm thử

- [X] T017 [P] [US2] Viết ca 401/403/404, cả Project/Sprint/Task ngoài phạm vi, sai cặp Task–Sprint, Project NULL, hai PM, HR/DEV sai role và proof thật trong `backend/test/project-authorization.e2e-spec.ts`. FR-003, FR-005, FR-008, AT-05, AT-06, AT-07, AT-15, SC-002.
- [X] T018 [P] [US2] Kiểm khóa dịch vụ Risk thiếu/sai, mô hình không bị gọi, chặn redirect và giữ lỗi/timeout upstream trong `backend/src/projects/risk-client.spec.ts` và `ai-service/test_risk.py`. FR-009, AT-13, SC-002.
- [X] T019 [P] [US2] Viết ca CLI cho mapping đã duyệt, duplicate cả lô, chạy lại cùng mapping, xung đột và bảo toàn Project chưa gán trong `backend/src/auth/project-mapping.spec.ts`. FR-005, FR-008, AT-15, SC-003.

### Thực hiện

- [X] T020 [US2] Thực thi `map-projects` có preflight, lock nhất quán và atomic batch ở `backend/src/auth/project-mapping.service.ts`, `backend/src/auth/auth-admin.ts`. Kiểm DB theo [data-model.md](data-model.md) cho `Project.pmAccountId` khi ghi mapping. FR-005, FR-008, AT-15.
- [X] T021 [US2] Lọc Project và ghi owner lúc tạo trong `backend/src/projects/projects.controller.ts`, `backend/src/projects/projects.service.ts` và kiểm quyền trước Risk/Recommendation/What-if; giữ response thiếu Project của What-if `404 INVALID_SCENARIO`. FR-003, FR-005, FR-008, AT-05, AT-06, AT-07.
- [X] T022 [US2] Đăng ký role PM và truy quyền cha Project qua `backend/src/sprints/sprints.controller.ts`, `backend/src/sprints/sprints.service.ts`, `backend/src/tasks/tasks.controller.ts`, `backend/src/tasks/tasks.service.ts`. Dùng đúng cặp Task/Sprint và giữ lỗi baseline. FR-003, FR-005, FR-008, AT-05, AT-07, AT-15.
- [X] T023 [US2] Thêm xác minh khóa dịch vụ trước inference, giới hạn transport và không theo redirect tại `backend/src/projects/risk-client.ts`, `ai-service/main.py`; cấu hình nội bộ qua `backend/.env.example` và cập nhật lệnh kiểm chứng ở `ai-service/README.md`. FR-009, AT-06, AT-13.
- [X] T024 [US2] Chuyển các caller PM sang API client trong `frontend/src/projects/ProjectsView.tsx`, `frontend/src/projects/ProjectDetailView.tsx`, `frontend/src/projects/ProjectRiskAssessment.tsx`, `frontend/src/projects/ProjectResourceRecommendations.tsx`, `frontend/src/projects/simulationRun.ts` và hook chung `frontend/src/hr-workspace/useHrData.ts`. Giữ contract client, abort, stale result, retry và timeout qua `frontend/test/simulation-run.test.mjs`. FR-002, FR-004, FR-005, FR-008, AT-03, AT-05, AT-06, AT-08.

## Phase 5 — US3 · HR theo phạm vi dữ liệu nguồn lực (P2)

**Kiểm độc lập** HR đọc đúng dữ liệu theo tuần và gọi được API tạo/gán hiện có. PM chỉ được đọc danh mục Skill. DEV không gọi được API danh bạ.

- [X] T025 [P] [US3] Viết ma trận ca HTTP cho Employee/Skill/EmployeeSkill trong `backend/test/hr-authorization.e2e-spec.ts` và đối chiếu các assertion availability/duplicate gán ở `backend/test/app.e2e-spec.ts`. FR-003, FR-006, FR-008, AT-09, AT-10, SC-002, SC-003.
- [X] T026 [US3] Khai báo policy HR và ngoại lệ Skill list cho PM trong `backend/src/employees/employees.controller.ts`, `backend/src/skills/skills.controller.ts`, `backend/src/employee-skills/employee-skills.controller.ts`. Bảo toàn payload, trạng thái và capability HR baseline. FR-003, FR-006, FR-008, AT-09, AT-10.
- [X] T027 [US3] Gắn các màn HR với transport phiên và trạng thái lỗi/trống trong `frontend/src/hr-workspace/HrWorkspaceViews.tsx` và `frontend/src/employees/EmployeesView.tsx`, giữ UI tuần và kỹ năng hiện có. FR-004, FR-006, AT-08, AT-09.

## Phase 6 — US4 · DEV xem dữ liệu của mình (P2)

**Kiểm độc lập** Hai DEV có hai Employee riêng. Endpoint bản thân và workspace khớp đúng, ca ID tự khai/role giả không đổi dữ liệu và công việc hiển thị thiếu ngữ cảnh.

- [X] T028 [P] [US4] Kiểm API DEV tự thân, hai Employee, body/query/header tự khai identity, truy cập API HR hoặc Project ngoài quyền trong `backend/test/dev-profile.e2e-spec.ts`. FR-003, FR-007, AT-11, AT-12, SC-002, SC-004.
- [X] T029 [P] [US4] Kiểm điều hướng, kết quả hồ sơ và trạng thái chưa có dữ liệu công việc trong `frontend/test/dev-workspace.test.mjs`. FR-004, FR-007, AT-08, AT-11.
- [X] T030 [US4] Thêm endpoint Auth đọc bản thân và chiếu Employee + Skill trong `backend/src/auth/auth.controller.ts`, `backend/src/auth/auth.module.ts` và `backend/src/auth/dev-profile.service.ts`. Lấy `UserAccount.employeeId` từ principal, không dùng ID ngoài. FR-003, FR-007, AT-11, AT-12.
- [X] T031 [US4] Nối API vào `frontend/src/dev-workspace/DevWorkspaceViews.tsx` và `frontend/src/App.tsx`, thêm test vào `frontend/package.json`. Hiển thị hồ sơ/Skills và Công việc thiếu ngữ cảnh từ response server. FR-004, FR-007, AT-11, SC-004.

## Phase 7 — Polish và nghiệm thu

- [X] T032 Chạy toàn bộ bộ test qua `backend/package.json`, `frontend/package.json` và `ai-service/test_risk.py`; xác nhận đủ 126 ca baseline giữ assertion, số ca mới riêng, lint/build hai phía và kiểm ma trận toàn bộ 25 route. FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, AT-03, AT-07, AT-09, AT-12, AT-13, AT-15, AT-16, SC-001, SC-002, SC-003, SC-004.
- [X] T033 Diễn tập migration, rollback bảo vệ ingress, rồi kiểm runtime Chrome + NestJS + FastAPI + MariaDB dev clone theo `specs/002-auth-rbac/quickstart.md`; ghi số liệu và điều kiện chứng minh trong `chapter-08-ai-software-testing/README.md`. FR-002, FR-003, FR-005, FR-006, FR-007, FR-008, FR-009, AT-01, AT-03, AT-04, AT-05, AT-06, AT-07, AT-08, AT-09, AT-10, AT-11, AT-12, AT-13, AT-14, AT-15, AT-16, SC-001, SC-002, SC-003, SC-004.
- [X] T034 Ghi quy trình cấp/thu hồi/reset/mapping, hạn một tiến trình, cookie/origin và dấu hiệu chẩn đoán không chứa secret trong `backend/README.md`; cập nhật trạng thái minh chứng sau triển khai trong `chapter-06-ai-coding/README.md` và `COURSE_PROGRESS.md`. FR-001, FR-002, FR-003, FR-005, FR-008, AT-14, AT-15, AT-16, SC-003.

## Dependencies & Execution Order

- Setup T001–T003 → Foundational T004–T008. T004 trước T005/T006, T006 trước T007, T007 trước hookup guard của mọi story.
- US1 T009–T016 chuẩn bị login và frontend session; T012 → T013 → T014/T015 → T016. Các test đầu pha có thể soạn song song trên ba bộ file khác nhau. Các test có thể được chạy khi thành phần được triển khai.
- US2 T017–T024 sau US1; T020 cần T014, T021/T022 cần scope Project, T024 cần client chung T008 và luật phiên T016. T018 và T019 độc lập Test HTTP T017.
- US3 T025–T027 dùng T024 cho hook chung, policy trong T026 rồi mới nghiệm thu workspace. US4 T028–T031 dùng T014 để có DEV liên kết và T016 để mount workspace. Triển khai T030/T031 tuần tự với US1 ở file AuthController/App. US3 và US4 có thể làm song song sau US2 nếu giữ các file thay đổi tách biệt.
- T032 sau US1–US4. T033 sau test và triển khai trên clone được phép. T034 ghi trạng thái có bằng chứng sau bước đó.

## Ví dụ song song

| Story | Việc độc lập |
| --- | --- |
| US1 | T009 unit Backend, T010 contract HTTP, T011 unit Frontend. |
| US2 | T017 HTTP quyền Project, T018 Risk, T019 unit mapping. |
| US3 | T025 tách file test với luồng DEV T028 khi nền đã sẵn; không song song T003 và T025 trên file regression chung. |
| US4 | T028 test HTTP và T029 test Frontend; T030 viết API trước khi nối workspace ở T031. |

## Implementation Strategy

US1 là lát cắt kỹ thuật phiên có thể thử riêng trong môi trường cô lập. Chỉ mở ingress khi US1–US4 cùng đạt vì Backend deny-by-default trong lúc policy từng nghiệp vụ đang được bổ sung. Cắt chuyển theo plan sau khi ma trận, regression và runtime trên bản sao đạt. Dừng tại Gate 2 theo yêu cầu hiện tại.
