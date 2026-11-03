# Chapter 5 Phase A — Architecture Baseline Audit

## 1. Mục đích và phạm vi

Tài liệu này ghi nhận kiến trúc **đang có** của RMS-AI tại commit được kiểm tra,
đối chiếu mã nguồn với cơ sở yêu cầu và các tài liệu kiến trúc cũ. Đây là audit
đọc/kiểm chứng; không phải phê duyệt kiến trúc production, không bổ sung quy tắc
nghiệp vụ và không xác nhận các capability AI đã hoạt động.

Phạm vi kiểm kê gồm `frontend/`, `backend/`, `ai-service/`, thiết kế dữ liệu,
hợp đồng API ban đầu và các tài liệu Chapter 3–4 có liên quan. Các khoảng trống,
mâu thuẫn và TBD được phân tích chi tiết tại
[Architecture Gap Analysis](architecture-gap-analysis.md).

## 2. Quy ước bằng chứng

| Trạng thái | Cách dùng trong audit |
| --- | --- |
| `VERIFIED FROM SOURCE` | Có bằng chứng trực tiếp trong mã nguồn hoặc cấu hình hiện tại. |
| `VERIFIED BY EXECUTION` | Đã chạy lệnh kiểm chứng an toàn trong Phase A và có kết quả. |
| `DOCUMENTED ONLY` | Chỉ có trong tài liệu; không có bằng chứng triển khai tương ứng. |
| `PROPOSED` | Đề xuất kỹ thuật, chưa phải cam kết triển khai. |
| `TBD` | Cần quyết định của con người hoặc yêu cầu chưa đủ căn cứ. |
| `NOT VERIFIED` | Có code/cấu hình nhưng chưa có bằng chứng runtime phù hợp. |

Các quan hệ sau được giữ xuyên suốt tài liệu:

```text
DOCUMENTED ONLY != IMPLEMENTED
CODE EXISTS != ENDPOINT OPERATIONAL
MIGRATION EXISTS != MIGRATION APPLIED
PROTOTYPE != PRODUCTION
ROLE PREVIEW != AUTHENTICATION / AUTHORIZATION
```

## 3. Repository baseline

Ngày audit: **2026-11-03**.

| Hạng mục | Kết quả | Trạng thái |
| --- | --- | --- |
| Working directory | `C:\Users\ADMIN\Documents\CD2\rms-ai` | `VERIFIED BY EXECUTION` |
| Branch | `main` | `VERIFIED BY EXECUTION` |
| HEAD | `45edcfe docs(chapter-04): finalize human design review and close out chapter` | `VERIFIED BY EXECUTION` |
| Working tree trước khi sửa | Sạch; `git status --short` không có output | `VERIFIED BY EXECUTION` |
| Diff check trước khi sửa | Không có lỗi | `VERIFIED BY EXECUTION` |
| Chapter 5 artifact trước Phase A | Chỉ có `chapter-05-ai-for-software-design-architecture/README.md` | `VERIFIED FROM SOURCE` |

Nguồn có thẩm quyền được đọc theo thứ tự: `AGENTS.md`, `README.md`, PRD,
User Stories, Acceptance Criteria, hồ sơ close-out Chapter 4, README Chapter 5,
tài liệu kiến trúc/database/API và cuối cùng là source/configuration hiện tại.
Khi tài liệu mô tả snapshot cũ khác với source, source được dùng để ghi nhận
trạng thái triển khai; source không được dùng để tự tạo business rule mới.

## 4. Kiến trúc hiện trạng

| Ranh giới | Trách nhiệm đang có | Trạng thái thực tế | Điều chưa được chứng minh |
| --- | --- | --- | --- |
| Frontend | Trình bày prototype ba workspace PM/HR/DEV; điều hướng và trạng thái demo trong browser | React/Vite chạy độc lập với mock/local state | Không có gọi Backend, Auth/RBAC hoặc dữ liệu production |
| Backend | Health check và API dữ liệu nền Project/Sprint/Task/Employee/Skill/EmployeeSkill | NestJS feature modules + TypeORM repository code + validation | Chưa chứng minh kết nối MySQL/migration/runtime endpoint với DB thật |
| AI Service | Health check | FastAPI có `GET /health` | Không có risk, explanation, recommendation, scoring hoặc simulation |
| Database | Cấu hình MySQL, 6 entity, 2 migration trong source | Schema foundation đã được mô tả bằng code | Không có bằng chứng migration đã chạy hoặc dữ liệu thật tồn tại |
| Tích hợp | Chưa có | Không tìm thấy HTTP call ở Frontend và không có client gọi AI ở Backend | Toàn bộ luồng Frontend -> Backend -> AI vẫn là thiết kế/đề xuất |

Không phát hiện bằng chứng cho microservices, message broker, cache phân tán,
container orchestration hoặc cloud deployment; Phase A không đề xuất thêm các
thành phần này.

## 5. Frontend audit

### 5.1. Nền tảng và cấu trúc

`frontend/package.json` khai báo React `^19.2.8`, React DOM `^19.2.8`,
TypeScript `~6.0.2` và Vite `^8.2.2`. `frontend/src/main.tsx` mount một `App`
duy nhất. Không có dependency router, HTTP client hoặc state-management library
riêng. Trạng thái điều hướng được quản lý bằng `useState` trong
`frontend/src/App.tsx`.

| Khu vực | Bằng chứng source | Dữ liệu/trạng thái | Kết luận |
| --- | --- | --- | --- |
| App shell | `frontend/src/layout/AppShell.tsx` | Props và state từ `App.tsx` | Prototype shell; `VERIFIED FROM SOURCE` |
| Role selection | `frontend/src/role-preview/RolePreview.tsx` | Chọn PM/HR/DEV cục bộ | Demo control, không phải Auth/RBAC |
| Operations overview | `frontend/src/operations-overview/OperationsOverview.tsx` | `mockProjectRisks` | Mock/prototype |
| Project list | `frontend/src/projects/ProjectsView.tsx` | `mockProjectRisks` | Không gọi API Project thật |
| Risk overview/detail | `frontend/src/project-risk/ProjectRiskOverview.tsx`, `ProjectRiskDetail.tsx` | `mockProjectRisks.ts` | UI của capability được thiết kế; risk inference không tồn tại |
| Recommendation | `frontend/src/resource-recommendation/ResourceRecommendationView.tsx` | `mockResourceRecommendations.ts` | Ranking/fit chỉ là dữ liệu trình bày |
| What-if/decision | `frontend/src/resource-recommendation/WhatIfSimulationView.tsx` | `useState` cho simulation/decision | Mô phỏng trạng thái cục bộ; không có engine/apply |
| HR workspace | `frontend/src/hr-workspace/HrWorkspaceViews.tsx`, `employees/EmployeesView.tsx` | Nội dung presentation | Không tích hợp API Employee/Skill |
| DEV workspace | `frontend/src/dev-workspace/DevWorkspaceViews.tsx` | Nội dung presentation | Read-only prototype; không có identity mapping |

### 5.2. Điều hướng, state và tích hợp

- `AppState` trong `App.tsx` điều khiển Role Preview và workspace; không có URL
  router hoặc deep-link state.
- PM flow giữ `projectId`, `candidateId` và stage trong browser state. Các ID có
  hậu tố `-mock` là presentation data, không phải khóa miền nghiệp vụ.
- `WhatIfSimulationView` giữ `SimulationStatus` và `DecisionStatus` trong local
  component state; reload/unmount không có cam kết persistence.
- Tìm kiếm source không thấy `fetch`, `axios`, `XMLHttpRequest`, `/api/`,
  `VITE_*` endpoint hoặc HTTP client dependency.
- Không có authentication package, token/session handling, authorization guard
  hoặc permission check. PM/HR/DEV là lựa chọn trình diễn, không phải security.

Kết luận Frontend: bản mẫu Chapter 4 là **reviewable UI prototype**. Nó không
chứng minh API, AI, database, matching, simulation, quyết định lưu bền vững hoặc
áp dụng phân bổ thật.

## 6. Backend audit

### 6.1. Nền tảng và module

`backend/package.json` khai báo NestJS `^12.0.1`, TypeScript `^6.0.2`,
`@nestjs/typeorm` `12.0.2`, TypeORM `1.1.1` và `mysql2` `3.24.5`.
`backend/src/app.module.ts` đăng ký TypeORM và sáu feature module:

1. `ProjectsModule`.
2. `SprintsModule`.
3. `TasksModule`.
4. `EmployeesModule`.
5. `SkillsModule`.
6. `EmployeeSkillsModule`.

`backend/src/main.ts` bật `ValidationPipe` toàn cục với `transform`, `whitelist`
và `forbidNonWhitelisted`. Không có global prefix `/api`, CORS policy, Auth
guard hoặc API versioning trong bootstrap hiện tại.

### 6.2. Route và DTO thực tế

| HTTP | Route thực tế | DTO/input được xác minh | Service behavior chính | Trạng thái |
| --- | --- | --- | --- | --- |
| GET | `/health` | Không | Trả `{ status: "ok" }` | `VERIFIED FROM SOURCE` |
| POST | `/projects` | `CreateProjectDto.name`: string, trim, non-empty | Tạo Project | `VERIFIED FROM SOURCE` |
| GET | `/projects` | Không | Liệt kê Project | `VERIFIED FROM SOURCE` |
| GET | `/projects/:projectId` | UUID path | Tìm Project hoặc 404 | `VERIFIED FROM SOURCE` |
| POST | `/projects/:projectId/sprints` | UUID path; `CreateSprintDto.name` | Kiểm tra Project rồi tạo Sprint | `VERIFIED FROM SOURCE` |
| GET | `/projects/:projectId/sprints` | UUID path | Kiểm tra Project rồi liệt kê Sprint | `VERIFIED FROM SOURCE` |
| POST | `/sprints/:sprintId/tasks` | UUID path; `CreateTaskDto.title` | Kiểm tra Sprint rồi tạo Task | `VERIFIED FROM SOURCE` |
| GET | `/sprints/:sprintId/tasks` | UUID path | Kiểm tra Sprint rồi liệt kê Task | `VERIFIED FROM SOURCE` |
| POST | `/employees` | `CreateEmployeeDto.displayName` | Tạo Employee | `VERIFIED FROM SOURCE` |
| GET | `/employees` | Không | Liệt kê Employee | `VERIFIED FROM SOURCE` |
| GET | `/employees/:employeeId` | UUID path | Tìm Employee hoặc 404 | `VERIFIED FROM SOURCE` |
| POST | `/skills` | `CreateSkillDto.name` | Tạo Skill | `VERIFIED FROM SOURCE` |
| GET | `/skills` | Không | Liệt kê Skill | `VERIFIED FROM SOURCE` |
| GET | `/skills/:skillId` | UUID path | Tìm Skill hoặc 404 | `VERIFIED FROM SOURCE` |
| POST | `/employees/:employeeId/skills` | UUID path; `AssignEmployeeSkillDto.skillId` UUID | Kiểm tra hai đầu, chặn duplicate bằng 409 | `VERIFIED FROM SOURCE` |
| GET | `/employees/:employeeId/skills` | UUID path | Liệt kê Skill của Employee | `VERIFIED FROM SOURCE` |

Các controller không có PUT/PATCH/DELETE. Chúng cũng không triển khai risk,
recommendation, simulation, PM decision, apply hoặc role access.

### 6.3. Entity, quan hệ và data access

| Entity | Bảng | Trường vật lý chính | Quan hệ | Bằng chứng |
| --- | --- | --- | --- | --- |
| `Project` | `projects` | UUID `id`, text `name` | 1-n Sprint | `backend/src/projects/project.entity.ts` |
| `Sprint` | `sprints` | UUID `id`, `projectId`, text `name` | n-1 Project; 1-n Task | `backend/src/sprints/sprint.entity.ts` |
| `Task` | `tasks` | UUID `id`, `sprintId`, text `title` | n-1 Sprint | `backend/src/tasks/task.entity.ts` |
| `Employee` | `employees` | UUID `id`, text `displayName` | 1-n EmployeeSkill | `backend/src/employees/employee.entity.ts` |
| `Skill` | `skills` | UUID `id`, text `name` | 1-n EmployeeSkill | `backend/src/skills/skill.entity.ts` |
| `EmployeeSkill` | `employee_skills` | composite key `employeeId`, `skillId` | n-1 hai phía | `backend/src/employee-skills/employee-skill.entity.ts` |

Services dùng TypeORM `Repository<T>` qua dependency injection. Logic đang có
chỉ gồm normalize chuỗi, kiểm tra parent tồn tại, ánh xạ response, 404 và chặn
trùng EmployeeSkill. Không có risk formula, matching score, availability,
workload, allocation, optimization, simulation hoặc apply logic.

### 6.4. Database configuration và migration

`backend/src/database/database.config.ts` yêu cầu `DB_HOST`, `DB_PORT`,
`DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`; cấu hình MySQL với danh sách entity
và migration tường minh. `synchronize: false` và `migrationsRun: false` giữ đúng
nguyên tắc không tự sửa schema.

Hai migration tồn tại:

- `1791120736172-create-project-sprint-task-foundation.ts` tạo `projects`,
  `sprints`, `tasks` và hai foreign key `RESTRICT`.
- `1791123398274-create-employee-skill-foundation.ts` tạo `employees`, `skills`,
  `employee_skills` và hai foreign key `RESTRICT`.

Đây là bằng chứng **migration code exists**. Repository không chứa log, trạng
thái migration table, test kết nối MySQL thật hoặc bằng chứng deployment để kết
luận migration đã chạy. Vì vậy persistence runtime là `NOT VERIFIED`.

### 6.5. Tests

- Unit tests có cho health, database config và service của sáu vùng foundation.
- `backend/test/app.e2e-spec.ts` dựng Nest application nhưng override DataSource
  và repository bằng in-memory mocks; test này xác minh routing/validation/service
  wiring, không xác minh MySQL hoặc migration thật.
- Kết quả chạy trong Phase A được ghi tại mục 13; không chạy migration.

Kết luận Backend: source đã vượt snapshot “health-only”, nhưng chỉ là foundation
API. Endpoint operational với MySQL, persistence thật và production readiness
không được suy ra chỉ từ code/tests mock.

## 7. AI Service audit

| Hạng mục | Bằng chứng | Kết luận |
| --- | --- | --- |
| Framework | `ai-service/main.py`; `requirements.txt` có `fastapi`, `uvicorn` | FastAPI foundation; version không pin |
| Route | `GET /health` | Health check duy nhất |
| Model loading | Không có | Không triển khai |
| Inference/preprocessing | Không có | Không triển khai |
| Risk prediction/explanation | Không có | Capability chỉ nằm trong requirement/design |
| Recommendation/matching/scoring | Không có | Không triển khai |
| Simulation/optimization | Không có | Không triển khai |
| Model artifact/dataset/metric | Không có | Không huấn luyện hoặc đánh giá |
| Tests | Không tìm thấy test AI service | `NOT VERIFIED` ngoài syntax/import checks an toàn |

Kết luận: AI service là health-check foundation, không phải implemented AI
capability, trained model hoặc validated prediction.

## 8. Database baseline audit

### 8.1. Quy ước phân loại

Các mã có thể xuất hiện cùng nhau vì “khái niệm sản phẩm đã xác nhận” và “bảng
đã triển khai” là hai chiều khác nhau.

| Mã | Ý nghĩa |
| --- | --- |
| A | Đã triển khai trong source hiện tại. |
| B | Được đề xuất trong tài liệu data/database. |
| C | Khái niệm/kết quả được sản phẩm xác nhận, nhưng physical persistence chưa được duyệt. |
| D | Trường, vòng đời, quy tắc hoặc quyết định lưu trữ còn TBD/bị chặn. |
| E | Không thuộc MVP hiện tại. |

### 8.2. Đối chiếu khái niệm và source

| Khái niệm | Phân loại | Source hiện tại | Nhận định |
| --- | --- | --- | --- |
| Project | A, C | Entity + module + route + migration | Foundation tối thiểu; không có status/timeline/risk fields |
| Sprint | A, C | Entity + module + nested route + migration | Chỉ `id/projectId/name` |
| Task | A, C | Entity + module + nested route + migration | Chỉ `id/sprintId/title` |
| Employee | A, C | Entity + module + route + migration | Hồ sơ HR rộng ngoài phạm vi |
| Skill | A, C | Entity + module + route + migration | Chưa có level/evidence/taxonomy |
| EmployeeSkill | A, C, D | Entity + composite key + route + migration | Quan hệ tối thiểu có; level/evidence TBD |
| ProjectSkillRequirement | B, D | Không có source | Ngữ nghĩa/mức/số lượng/thời gian bị chặn |
| ProjectAllocation | B, C, D | Không có source | Khái niệm phân bổ thật có guardrail; schema vận hành bị chặn |
| RiskAssessment | B, C, D | Không có source | Kết quả risk được xác nhận; biểu diễn/lưu trữ/freshness TBD |
| RiskExplanation | B, C, D | Không có source | Yếu tố giải thích được xác nhận; cấu trúc chi tiết TBD |
| RecommendationRun | B, D | Không có source | Run/history/persistence không được yêu cầu xác nhận |
| RecommendationCandidate | B, C, D | Không có source | Danh sách xếp hạng được xác nhận; schema/ranking TBD |
| AllocationScenario | B, C, D | Không có source | Scenario concept được xác nhận; cấu trúc tối thiểu TBD |
| ScenarioChange | B, D | Không có source | Quan hệ đề xuất; unit/time/constraint TBD |
| SimulationResult | B, C, D | Không có source | Kết quả đúng scenario được xác nhận; persistence/freshness TBD |
| SimulationImpact | B, C, D | Không có source | Expected impact được xác nhận; metrics/baseline TBD |
| PMDecision | B, C, D | Không có source | Accept/Reject được xác nhận; actor/history/idempotency TBD |
| ApplicationResult | B, C, D | Không có source | Chỉ có khi apply được phép; contract/transaction/recovery bị chặn |

Không có mục nào trong danh sách trên tự động phải trở thành bảng. Đặc biệt,
`ProjectAllocation` không sẵn sàng làm bảng production khi lượng, đơn vị, phạm
vi, thời điểm và quy tắc chồng lấn chưa được quyết định. `User Account` không
đồng nhất với `Employee`; không có bảng `User`, `Role` hoặc `Permission` trong
source và Phase A không đề xuất tự tạo các bảng này.

## 9. API contract audit

`initial-api-contracts.md` mô tả bốn hợp đồng Frontend -> Backend và ba hợp đồng
Backend -> AI ở trạng thái `PROPOSED`. Source hiện tại không triển khai các hợp
đồng core-flow đó. Ngược lại, source đã có foundation endpoints không được phản
ánh trong snapshot API cũ.

| API / use case | Nguồn yêu cầu | Contract đề xuất | Endpoint/DTO thực tế | Trạng thái | Gap / dependency / khuyến nghị |
| --- | --- | --- | --- | --- | --- |
| Project foundation | Context US-01–US-04 | Không mô tả trong initial contract | `/projects`; `CreateProjectDto` | Code + mock-e2e exists | Bổ sung inventory contract sau audit; runtime DB chưa xác minh |
| Sprint foundation | US-06 context khi tồn tại | Không mô tả | `/projects/:projectId/sprints`; `CreateSprintDto` | Code + mock-e2e exists | Chưa tích hợp Frontend; fields tối thiểu |
| Task foundation | US-06 context khi tồn tại | Không mô tả | `/sprints/:sprintId/tasks`; `CreateTaskDto` | Code + mock-e2e exists | Chưa có Employee/Task identity relation |
| Employee foundation | US-05 | Không mô tả | `/employees`; `CreateEmployeeDto` | Code + mock-e2e exists | Chưa có update/delete dù “duy trì” ở sản phẩm; không tự mở rộng trong Phase A |
| Skill foundation | US-05 | Không mô tả | `/skills`; `CreateSkillDto` | Code + mock-e2e exists | Skill details TBD |
| EmployeeSkill | US-05 | Không mô tả | `/employees/:employeeId/skills`; `AssignEmployeeSkillDto` | Code + mock-e2e exists | Chỉ assign/list; level/evidence TBD |
| Risk assessment | US-01 | `POST /api/projects/{projectId}/risk-assessments` | Không có | `PROPOSED` only | C4-HDR-021/022/027; AI capability chưa có |
| Resource recommendation | US-02 | `POST /api/projects/{projectId}/resource-recommendations` | Không có | `PROPOSED` only | C4-HDR-021/023/027; schema/ranking TBD |
| What-if simulation | US-03 | `POST /api/projects/{projectId}/simulations` | Không có | `PROPOSED` only | C4-HDR-024/025/027/028; engine chưa có |
| PM decision | US-04 | `POST /api/projects/{projectId}/decisions` | Không có | `PROPOSED` only | C4-HDR-026–029; persistence/idempotency TBD |
| Apply | AC-US-04-01/06/07 | Không chốt route | Không có | `TBD` / blocked | Không thiết kế trước condition/transaction/recovery |
| Backend -> AI risk | US-01 | `POST /internal/ai/risk-assessments` | Không có | `PROPOSED` only | Model input/output TBD |
| Backend -> AI recommendation | US-02 | `POST /internal/ai/resource-recommendations` | Không có | `PROPOSED` only | Matching/data rules TBD |
| Backend -> AI simulation | US-03 | `POST /internal/ai/simulations` | Không có | `PROPOSED` only | Scenario/impact semantics TBD |
| Role-related access | US-05–US-07 | Chưa có Auth contract | Không có guard/middleware | `TBD` | C4-HDR-031; Role Preview không phải access control |

Lưu ý contract prefix: các hợp đồng core-flow được đề xuất dùng `/api`, nhưng
foundation routes hiện tại không có prefix vì `main.ts` không gọi
`setGlobalPrefix`. Đây là điểm cần quyết định/reconcile, không phải lý do để tự
đổi route trong Phase A.

## 10. Pattern và separation-of-concerns quan sát được

| Pattern/cấu trúc | Bằng chứng | Mức kết luận |
| --- | --- | --- |
| Feature modules trong một Nest application | `AppModule` import sáu module | Cấu trúc phù hợp modular monolith; chưa có ADR phê duyệt tên pattern |
| Controller–Service separation | Controller gọi service trong từng feature | `VERIFIED FROM SOURCE` |
| Dependency Injection | Constructor injection cho service/repository | `VERIFIED FROM SOURCE` |
| Repository abstraction của TypeORM | `@InjectRepository` + `Repository<T>` | `VERIFIED FROM SOURCE`; không phải domain repository riêng |
| Layered request path | Controller -> Service -> TypeORM Repository | `VERIFIED FROM SOURCE` cho foundation |
| AI adapter/gateway | Không có | Chưa implemented; không đánh dấu pattern đã có |

Không phát hiện vi phạm separation-of-concerns rõ ràng trong phần foundation nhỏ.
Rủi ro chính là hiểu nhầm mock/local state thành business behavior và hiểu nhầm
TypeORM/migration code thành persistence đã vận hành. `App.tsx` đang gom điều
hướng nhiều workspace trong một file, nhưng ở phạm vi prototype điều này là
maintainability concern, không phải bằng chứng architecture failure.

## 11. Tổng kết baseline và rủi ro

### Đã có

- Prototype reviewable cho PM/HR/DEV, nhưng dùng mock/local state.
- NestJS foundation cho sáu vùng dữ liệu với DTO validation, entity, repository,
  migration code và tests dùng mock repository.
- FastAPI health foundation.
- Tài liệu conceptual cho architecture, data/ERD và proposed API contracts.

### Chưa có hoặc chưa xác minh

- Frontend -> Backend và Backend -> AI integration.
- AI inference/model/data pipeline/evaluation.
- Core risk/recommendation/simulation/decision/apply endpoints.
- Auth/RBAC và User Account ↔ Employee mapping.
- MySQL runtime, migration applied state và end-to-end persistence.
- Final API/data semantics cho retained TBDs.
- Current-state UML/component/deployment model đã reconcile với source.

### Ảnh hưởng MVP

RMS-AI hiện review được trải nghiệm và foundation dữ liệu, nhưng chưa thực hiện
luồng nghiệp vụ cốt lõi end-to-end. Phase A đủ bằng chứng để chuyển sang một
milestone thiết kế kiến trúc nhỏ, nhưng không đủ căn cứ để gọi Chapter 5 hoàn
thành hoặc bắt đầu triển khai core AI workflow.

## 12. Evidence index

| Kết luận | Path / symbol | Loại | Trạng thái |
| --- | --- | --- | --- |
| Frontend dùng mock/local state | `frontend/src/App.tsx`; `mockProjectRisks.ts`; `mockResourceRecommendations.ts`; `WhatIfSimulationView.tsx` | Source | `VERIFIED FROM SOURCE` |
| Không có HTTP client/call Frontend | `frontend/src/`; `frontend/package.json` | Source search | `VERIFIED FROM SOURCE` |
| Sáu Backend module được đăng ký | `backend/src/app.module.ts` / `AppModule` | Source | `VERIFIED FROM SOURCE` |
| Route foundation | `backend/src/**/*controller.ts` | Source | `VERIFIED FROM SOURCE` |
| DTO validation | `backend/src/**/dto/*.ts`; `backend/src/main.ts` | Source | `VERIFIED FROM SOURCE` |
| Entity/repository | `backend/src/**/*entity.ts`; services | Source | `VERIFIED FROM SOURCE` |
| MySQL config an toàn | `backend/src/database/database.config.ts` | Source | `VERIFIED FROM SOURCE` |
| Hai migration tồn tại | `backend/src/database/migrations/` | Source | `VERIFIED FROM SOURCE` |
| Migration đã chạy | Không có artifact chứng minh | Runtime | `NOT VERIFIED` |
| AI chỉ có health | `ai-service/main.py` | Source | `VERIFIED FROM SOURCE` |
| Core contracts chỉ đề xuất | `chapter-03-ai-for-requirements-product-analysis/docs/initial-api-contracts.md` | Document | `PROPOSED` |
| Business/data TBD | User Stories TBD-01–TBD-12; Chapter 4 C4-HDR-021–032 | Requirement/review | `TBD` |

## 13. Phase A validation record

| Kiểm tra | Kết quả | Bằng chứng / giới hạn |
| --- | --- | --- |
| Frontend build | PASS | `npm run build`; TypeScript + Vite build, 30 modules transformed |
| Frontend lint | PASS | `npm run lint`; oxlint exit 0 |
| Backend build | PASS | `npm run build`; Nest build exit 0 |
| Backend lint | PASS | `npm run lint`; oxlint exit 0 |
| Backend unit tests | PASS | `npm test`; 8 files, 35 tests passed |
| Backend e2e tests | PASS | `npm run test:e2e`; 1 file, 5 tests passed; repositories/DataSource được mock, không phải DB e2e |
| AI syntax | PASS | `python -m py_compile main.py`; không chứng minh dependency/runtime/model capability |
| Markdown relative links | PASS | 5 file Chapter 5 được kiểm tra; không có link tương đối hỏng |
| Gap/conflict/TBD integrity | PASS | 13 gap definitions, 7 conflict definitions, 12 retained-TBD assessment rows |
| Markdown table structure | PASS | Cấu trúc cột nhất quán trong 5 file Chapter 5 |
| Evidence paths | PASS | 31 source/document paths tiêu biểu tồn tại trong repository |
| Git diff check | PASS | Không có whitespace error sau thay đổi tài liệu |
| Change scope | PASS | Chỉ `chapter-05-ai-for-software-design-architecture/README.md` và thư mục `docs/` thay đổi |
| Migration execution | NOT RUN | Bị loại khỏi phạm vi Phase A; không truy cập/sửa database |
| MySQL persistence | NOT VERIFIED | Không có database-runtime evidence; mock-e2e không thay thế kiểm chứng này |
| Frontend -> Backend / Backend -> AI | NOT VERIFIED | Không có integration source để chạy |

Vitest phát cảnh báo không chặn rằng `vite-tsconfig-paths` có thể được thay bằng
khả năng native của Vite. Phase A không sửa cấu hình/dependency vì đây không phải
failure và nằm ngoài phạm vi audit-only.

