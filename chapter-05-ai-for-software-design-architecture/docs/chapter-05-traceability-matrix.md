# Chapter 5 Phase A — Traceability Matrix

## 1. Mục đích

Ma trận này nối yêu cầu Chapter 5 với PRD, US-01–US-07, Acceptance Criteria,
artifact kiến trúc và bằng chứng source hiện tại. Ma trận không nâng trạng thái
của một đề xuất kỹ thuật thành requirement hoặc implementation.

Tài liệu đồng hành:

- [Architecture Baseline Audit](architecture-baseline-audit.md).
- [Architecture Gap Analysis](architecture-gap-analysis.md).
- [Chapter 5 Phase B Plan](chapter-05-phase-b-plan.md).

## 2. Quy ước trạng thái

| Trạng thái | Ý nghĩa |
| --- | --- |
| `COVERED — VERIFIED FROM SOURCE` | Artifact và source cùng có bằng chứng phù hợp. |
| `PARTIAL` | Có một phần artifact/source, nhưng còn gap hoặc runtime chưa xác minh. |
| `DOCUMENTED ONLY` | Có yêu cầu/thiết kế nhưng chưa có source tương ứng. |
| `PROPOSED` | Lựa chọn kỹ thuật/hợp đồng đang chờ review. |
| `TBD` | Cần quyết định con người; không tự suy diễn. |
| `NOT VERIFIED` | Có code nhưng chưa có bằng chứng runtime/persistence phù hợp. |
| `OUT OF SCOPE` | Không thuộc milestone hiện tại. |

## 3. Traceability theo Chapter 5

| Chapter 5 | Kỳ vọng | PRD/US/AC liên quan | Artifact hiện có | Source evidence | Gap | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- |
| 5.1 Architecture Design | Ranh giới, trách nhiệm, current/target state | PRD Tổng quan, Mục tiêu, Người dùng, Phạm vi MVP; US-01–07 | `system-architecture.md`; baseline audit mục 4–7 | FE/BE/AI source; `AppModule` | C5-GAP-001/002/009/010/011 | `PARTIAL` |
| 5.2 Architecture Patterns | Pattern phù hợp, rationale/trade-off | NFR/guardrail từ PRD/AGENTS; không có AC bắt buộc pattern cụ thể | Gap analysis mục 6 | Feature modules, DI, Controller–Service, TypeORM Repository | C5-GAP-003 | `PARTIAL` |
| 5.3 System Modeling & UML | Sơ đồ có ích cho component/interaction/data/runtime | Core flow US-01–04; role scope US-05–07 | 1 flowchart + 2 ERD; UML inventory | Không có UML artifact trong source | C5-GAP-004 | `PARTIAL / GAP` |
| 5.4 Database Design | Conceptual + as-built model, persistence boundary | US-01–06; AC về invariants/data missing; TBD-01/04/05/08/11 | `database-design.md`; `mvp-data-contract.md`; allocation constraints | 6 entity, TypeORM config, 2 migration | C5-GAP-005/006/011/012 | `PARTIAL`; runtime `NOT VERIFIED` |
| 5.5 API Design | Actual/proposed API, DTO/error/security states | US-01–07 và toàn bộ AC theo use case | `initial-api-contracts.md`; baseline audit mục 9 | 16 actual route/method combinations + DTOs | C5-GAP-007/008/009/011/012 | `PARTIAL` |
| 5.6 Design Patterns | Pattern implementation evidence và giới hạn | Không có business AC yêu cầu pattern cụ thể | Gap analysis mục 6 | DI, Controller–Service, Repository abstraction | C5-GAP-003; AI gateway absent | `PARTIAL` |

## 4. Traceability theo PRD

| PRD section | Nội dung có thẩm quyền | Architecture concern | Artifact/bằng chứng | Gap/TBD | Trạng thái |
| --- | --- | --- | --- | --- | --- |
| Tổng quan sản phẩm | AI hỗ trợ quyết định quản lý nguồn lực; PM quyết định | Human-in-the-loop boundary | System architecture; core-flow UI prototype | Core workflow chưa implemented | `DOCUMENTED ONLY` cho behavior end-to-end |
| Mục tiêu sản phẩm | Risk, explanation, recommendation, what-if, decision | Capability decomposition và AI boundary | System architecture + proposed API | AI service health-only | `PARTIAL` |
| Người dùng mục tiêu | PM, HR, DEV | Role/workspace/data-access boundary | Chapter 4 three-role design; `App.tsx` | Auth/RBAC/User↔Employee TBD | `PARTIAL`; security `TBD` |
| Phạm vi MVP | Project -> Risk -> Recommendation -> Simulation -> PM decision | Component/API/data sequence | UI prototype; conceptual contracts | Core Backend/AI endpoints absent | `DOCUMENTED ONLY` ngoài UI |
| Ngoài phạm vi | Không HRIS/Jira/ERP/full automation | Scope guardrail | AGENTS, design docs, minimal entities | Không có gap yêu cầu mở rộng | `COVERED` |
| Các vấn đề chưa quyết định | Data/model/ranking/allocation/impact/apply/auth | Blocker/dependency register | C4-HDR-021–032 assessment | C5-GAP-011/012 | `TBD` có owner/risk |

## 5. Traceability US/AC -> architecture/source

| User Story | Acceptance Criteria | Requirement outcome | Architecture/data/API artifact | Implemented evidence | Gap / retained TBD | Coverage |
| --- | --- | --- | --- | --- | --- | --- |
| US-01 — Xem và hiểu rủi ro | AC-US-01-01, 01-04 confirmed; 01-02/03 TBD | Risk estimate + main explanations; không nói quá khi thiếu/stale | `system-architecture.md` mục risk; proposed risk API; `RiskAssessment/RiskExplanation` conceptual | Risk UI dùng `mockProjectRisks`; không có risk endpoint/model | C4-HDR-021/022/027; C5-GAP-009/010/012 | UI `PARTIAL`; behavior `DOCUMENTED ONLY` |
| US-02 — Cân nhắc ứng viên | AC-US-02-01/02/03/05 confirmed; 02-04 TBD | Ranked candidates + explanation; không tự allocate/ép candidate | Proposed recommendation API; conceptual Candidate; allocation constraints | Recommendation UI dùng mock; Employee/Skill foundation source | C4-HDR-021/023/027; C5-GAP-009/010/012 | Foundation `PARTIAL`; capability `DOCUMENTED ONLY` |
| US-03 — Đánh giá phương án | AC-US-03-01/02 confirmed; 03-03/04/05 TBD | Non-destructive simulation; result thuộc đúng scenario | Proposed simulation API; conceptual Scenario/Result/Impact | Local UI state; không có engine/endpoint/entity | C4-HDR-024/025/027/028/029 | UI `PARTIAL`; capability `DOCUMENTED ONLY` |
| US-04 — PM quyết định | AC-US-04-01/02/03/07 confirmed; 04-04/05/06 TBD | PM Accept/Reject; Reject/no Accept không apply; không báo success sai | Proposed decision API; conceptual PMDecision/ApplicationResult | Local decision state; không persistence/apply | C4-HDR-024/026–029; C5-GAP-012 | UI `PARTIAL`; behavior `DOCUMENTED ONLY` |
| US-05 — HR duy trì dữ liệu | AC-US-05-01–04 confirmed | HR xem/duy trì Employee/Skill trong RMS-AI; không thay PM | Employee/Skill/EmployeeSkill data design | Entity/module/routes/migration + mock-e2e; HR UI presentation | C4-HDR-021/031; chưa có update/delete/Auth; DB runtime not verified | `PARTIAL`; source foundation có |
| US-06 — DEV xem ngữ cảnh cá nhân | AC-US-06-01/02/03/05 confirmed; 06-04 TBD | DEV xem own skills/project/sprint/task khi tồn tại; không quyết định recommendation | Role/workspace design; Project/Sprint/Task + Employee/Skill foundations | DEV read-only UI; separate foundation routes/entities | C4-HDR-021/031/032; không identity mapping hoặc Employee↔work context | `PARTIAL` |
| US-07 — Workspace theo role | AC-US-07-01/02 confirmed; 07-03 TBD | Capability đúng role; PM giữ quyết định | Chapter 4 Role Preview/AppShell; security section documented | `App.tsx` chuyển PM/HR/DEV | C4-HDR-031; không Auth/RBAC/authorization | Prototype `VERIFIED`; security `TBD` |

## 6. Traceability các bất biến chính

| Invariant | Requirement source | Artifact bảo toàn | Source hiện tại | Gap/status |
| --- | --- | --- | --- | --- |
| AI hỗ trợ; PM quyết định | PRD; US-04; AC-US-07-02 | Architecture/data/API docs | UI ghi decision cục bộ; AI absent | Behavior production `DOCUMENTED ONLY` |
| Recommendation không tự phân bổ | AC-US-02-02 | Allocation constraints; proposed API | Không có ProjectAllocation hoặc recommendation endpoint | Bất biến không bị vi phạm; capability absent |
| Simulation không sửa allocation thật | AC-US-03-02 | Data/API contracts | Không có engine/ProjectAllocation | Bất biến documented; runtime chưa có |
| Result thuộc đúng scenario | AC-US-03-01 | Conceptual ERD/API | Không có entities/endpoints | `DOCUMENTED ONLY`; C4-HDR-024/028 |
| Candidate khác scenario hoàn chỉnh | Data contract + allocation constraints | Conceptual model | Mock truyền `candidateId` chỉ presentation | Guardrail được ghi; mapping `TBD` |
| Accept khác apply success | AC-US-04-01/06/07 | PMDecision tách ApplicationResult | Không có persistence/apply | `DOCUMENTED ONLY`; C4-HDR-026/027 |
| Reject/no explicit Accept không apply | AC-US-04-02/03 | Decision contract | Local prototype không có apply | Guardrail preserved; runtime absent |
| Thiếu data không suy ra Low Risk/Available | AC-US-01-04, 02-04 | Data contract/constraints/UI states | Mock không chứng minh production behavior | C4-HDR-021/023/027 |
| Role Preview không phải Auth | C4-HDR-017/031; AC-US-07-03 TBD | Chapter 4 close-out; gap analysis | Không auth package/guard | Ranh giới `VERIFIED`; security `TBD` |

## 7. Traceability database concepts

| Concept group | Product source | Design artifact | Source state | Gap/TBD | Status |
| --- | --- | --- | --- | --- | --- |
| Project/Sprint/Task | Project context US-01–04; context US-06 | Foundation ERD | Entity/module/routes/migration | Fields nghiệp vụ rộng hơn TBD; DB runtime not verified | `PARTIAL / SOURCE EXISTS` |
| Employee/Skill/EmployeeSkill | US-05/06; AC-US-05-01/02, 06-01 | Foundation ERD, allocation constraints | Entity/module/routes/migration | Skill level/evidence; identity mapping TBD | `PARTIAL / SOURCE EXISTS` |
| ProjectSkillRequirement | Không yêu cầu entity cụ thể | Technical proposal | Không có | Semantics/quantity/time blocked | `PROPOSED / TBD` |
| ProjectAllocation | Allocation guardrails US-02–04 | Technical proposal | Không có | Unit/time/capacity/overlap blocked | `PROPOSED / TBD` |
| Risk/Explanation | US-01 | Conceptual ERD | Không có | Representation/freshness/persistence | `DOCUMENTED ONLY / TBD` |
| Recommendation/Candidate | US-02 | Conceptual ERD | Không có | Candidate schema/ranking/persistence | `DOCUMENTED ONLY / TBD` |
| Scenario/Change | US-03/04 | Conceptual ERD | Không có | Structure/constraints | `DOCUMENTED ONLY / TBD` |
| Simulation/Impact | US-03 | Conceptual ERD | Không có | Metric/baseline/freshness/persistence | `DOCUMENTED ONLY / TBD` |
| PMDecision/ApplicationResult | US-04 | Conceptual ERD | Không có | Actor/history/apply/recovery/idempotency | `DOCUMENTED ONLY / TBD` |

## 8. Traceability actual API evidence

| Actual API group | Controller | DTO | Test evidence | Runtime/persistence status |
| --- | --- | --- | --- | --- |
| Health | `AppController` | Không | Unit + mock-e2e | Nest application test `VERIFIED BY EXECUTION` khi validation hoàn tất |
| Projects | `ProjectsController` | `CreateProjectDto` | Service + mock-e2e | Route/wiring testable; MySQL `NOT VERIFIED` |
| Sprints | `SprintsController` | `CreateSprintDto` | Service + mock-e2e | Route/wiring testable; MySQL `NOT VERIFIED` |
| Tasks | `TasksController` | `CreateTaskDto` | Service + mock-e2e | Route/wiring testable; MySQL `NOT VERIFIED` |
| Employees | `EmployeesController` | `CreateEmployeeDto` | Service + mock-e2e | Route/wiring testable; MySQL `NOT VERIFIED` |
| Skills | `SkillsController` | `CreateSkillDto` | Service + mock-e2e | Route/wiring testable; MySQL `NOT VERIFIED` |
| EmployeeSkills | `EmployeeSkillsController` | `AssignEmployeeSkillDto` | Service + mock-e2e | Duplicate/error wiring covered; MySQL `NOT VERIFIED` |

Không có actual API evidence cho risk, recommendation, simulation, decision,
apply hoặc role authorization.

## 9. Retained TBD traceability

| C4 Review ID | Requirement TBD | US/AC | Chapter 5 concern | Classification |
| --- | --- | --- | --- | --- |
| C4-HDR-021 | TBD-01 minimum valid data | US-01/02/05/06; AC-US-01-02, 02-04, 05-02/03 | DB/API input validity | BLOCKING CHAPTER 5 DESIGN |
| C4-HDR-022 | TBD-02 risk representation/freshness | US-01; AC-US-01-01/03 | API/data/freshness | BLOCKING CHAPTER 5 DESIGN |
| C4-HDR-023 | TBD-03 recommendation criteria/data | US-02; AC-US-02-01/03/04/05 | Candidate contract/ranking | BLOCKING CHAPTER 5 DESIGN |
| C4-HDR-024 | TBD-04 scenario/constraints | US-03/04; AC-US-03-03, 04-01 | Scenario DB/API | BLOCKING CHAPTER 5 DESIGN |
| C4-HDR-025 | TBD-05 impact metrics | US-03; AC-US-03-01 | Result/impact DB/API | BLOCKING CHAPTER 5 DESIGN |
| C4-HDR-026 | TBD-06 decision/apply timing | US-04; AC-US-04-01/04 | Workflow/API boundary | BLOCKING CHAPTER 5 DESIGN |
| C4-HDR-027 | TBD-07 failure/recovery | US-01–04; failure ACs | Error/recovery design | BLOCKING FUTURE IMPLEMENTATION |
| C4-HDR-028 | TBD-08 stale/repeat | US-03/04; AC-US-03-05, 04-04/05 | Freshness/idempotency | BLOCKING CHAPTER 5 DESIGN |
| C4-HDR-029 | TBD-09 no-decision lifecycle | US-03/04; AC-US-04-03 | Optional state/history | NON-BLOCKING / RETAINED |
| C4-HDR-030 | TBD-10 AI/model/data | Không có algorithm AC | AI design/Chapter 6 | BLOCKING FUTURE IMPLEMENTATION |
| C4-HDR-031 | TBD-11 identity/Auth/RBAC | US-05–07; AC-US-07-01/03 | Security/data access | BLOCKING CHAPTER 5 DESIGN |
| C4-HDR-032 | TBD-12 DEV write capability | US-06; AC-US-06-04/05 | Role/API scope | NON-BLOCKING / RETAINED |

Lý do, owner và rủi ro chi tiết nằm tại
[Architecture Gap Analysis — mục 8](architecture-gap-analysis.md#8-đánh-giá-c4-hdr-021-đến-c4-hdr-032).

## 10. Kết luận bao phủ

- US-01–US-07 và các AC liên quan đều có đường truy vết tới artifact, source
  hoặc gap/TBD; không có story bị bỏ khỏi audit.
- 5.1–5.6 đều đã được kiểm kê, nhưng chỉ ở trạng thái `PARTIAL` hoặc `GAP`.
- Source foundation không được dùng làm bằng chứng cho core AI workflow.
- Phase A traceability đã hoàn tất; Chapter 5 close-out chưa đạt.

