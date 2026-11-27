# Tasks — Apply Allocation 006

[Spec](spec.md) · [Plan và AT](plan.md#ma-trận-kiểm-thử) · [Data Model](data-model.md) · [API](contracts/apply-allocation-api.md)

## Phase 1 — Setup

- [X] T001 Đối chiếu baseline test và chuẩn bị hướng dẫn cấu hình clone ngoài Git trong `backend/README.md`. SC-004, AT-14, AT-15.

## Phase 2 — Foundational

- [X] T002 Tạo entity trong `backend/src/projects/decisions/decision-availability-evidence.entity.ts` theo [data-model.md](data-model.md#decisionavailabilityevidence) cho `DecisionAvailabilityEvidence.decisionId`, `DecisionAvailabilityEvidence.semantics`, `DecisionAvailabilityEvidence.availableHoursExact`, `DecisionAvailabilityEvidence.supportHoursExact`. FR-001, FR-008, AT-12.
- [X] T003 Tạo entity trong `backend/src/projects/allocations/project-allocation.entity.ts` theo [data-model.md](data-model.md#projectallocation) cho `ProjectAllocation.id`, `ProjectAllocation.decisionId`, `ProjectAllocation.projectId`, `ProjectAllocation.employeeId`, `ProjectAllocation.skillId`, `ProjectAllocation.weekStart`, `ProjectAllocation.hoursExact`, `ProjectAllocation.appliedByAccountId`, `ProjectAllocation.appliedAt`. FR-001, FR-004, FR-005, AT-04, AT-05, AT-14.
- [X] T004 Tạo entity trong `backend/src/projects/allocations/application-result.entity.ts` theo [data-model.md](data-model.md#applicationresult) cho `ApplicationResult.id`, `ApplicationResult.decisionId`, `ApplicationResult.actorAccountId`, `ApplicationResult.outcome`, `ApplicationResult.code`, `ApplicationResult.allocationId`, `ApplicationResult.occurredAt`. FR-005, FR-007, AT-07, AT-08.
- [X] T005 Thêm migration `backend/src/database/migrations/1791260000000-add-apply-allocation.ts`, đăng ký `backend/src/database/database.config.ts` và `backend/src/projects/projects.module.ts`, giữ assertion cũ và mở rộng `backend/src/database/database.config.spec.ts`. FR-004, FR-005, SC-004, AT-14, AT-15.
- [X] T006 Viết unit biên exact, DOUBLE, dấu và giá trị thiếu trong `backend/src/employees/remaining-availability.service.spec.ts`. FR-003, FR-008, AT-10.
- [X] T007 Chia sẻ toán giờ và triển khai đọc quỹ trong `backend/src/employees/decimal-hours.ts`, `backend/src/employees/remaining-availability.service.ts`, `backend/src/employees/employees.module.ts`, `backend/src/projects/project-hours.ts`. Bao phủ đọc batch nhất quán và đọc sau khóa qua manager. FR-003, FR-004, FR-008, AT-03, AT-04, AT-10.

## Phase 3 — US1: Apply phương án đã chấp nhận (P1)

**Kiểm độc lập** What-if → ACCEPT → Apply trả 201 và duy trì lịch sử gốc. REJECT/legacy/sai quyền/sai quỹ không ghi.

- [X] T008 [P] [US1] Viết unit v1/v2, tamper, binding và parity exact trong `backend/src/projects/decision-context.spec.ts`, `backend/src/projects/project-simulation.service.spec.ts`. FR-001, FR-008, AT-10, AT-12, AT-15.
- [X] T009 [P] [US1] Viết HTTP với guard thật cho legacy, PM trước, trái quyền, Skill/tuần/quỹ và ngữ nghĩa phản hồi 001/003 tại `backend/test/apply-allocation.e2e-spec.ts` và `backend/test/app.e2e-spec.ts`. FR-001, FR-002, FR-003, AT-01, AT-02, AT-03, AT-11, AT-12.
- [X] T010 [US1] Thêm quỹ exact, proof ứng viên tương thích và evidence v2 tại `backend/src/projects/decision-context.ts`, `backend/src/projects/recommendation-context.ts`, `backend/src/projects/project-resource-recommendation.service.ts`, `backend/src/projects/project-simulation.service.ts`, `backend/src/projects/dto/resource-simulation.dto.ts`. FR-001, FR-003, FR-008, AT-10, AT-12, AT-15.
- [X] T011 [US1] Ghi provenance v2 cùng PMDecision và dùng exact freshness tại `backend/src/projects/decisions/project-decisions.service.ts`. Kiểm replay v1/v2 trước freshness và rollback cả hai khi ghi provenance lỗi. FR-001, FR-003, FR-008, AT-06, AT-10, AT-12.
- [X] T012 [US1] Ghi mới với thứ tự Account → Project → Employee → EmployeeSkill, INSERT nguyên tử và giữ scope trong `backend/src/projects/allocations/project-allocations.service.ts`. FR-001, FR-002, FR-003, FR-004, FR-005, AT-01, AT-02, AT-03, AT-04, AT-11.
- [X] T013 [US1] Nối POST và validate tại `backend/src/projects/allocations/project-allocations.controller.ts`, `backend/src/projects/allocations/dto/apply-allocation.dto.ts`, `backend/src/projects/projects.module.ts`. FR-001, FR-002, FR-006, AT-01, AT-02, AT-11.

## Phase 4 — US2: Đồng thời, đối chiếu và retry (P1)

**Kiểm độc lập** Hai Project cạnh tranh cùng quỹ và hai yêu cầu cùng quyết định. Sau lỗi hoặc mất phản hồi, số hàng và quỹ vẫn nhất quán.

- [X] T014 [P] [US2] Viết HTTP test double cho 200 replay, 1062, rollback/unknown và đọc đối chiếu tại `backend/test/apply-allocation-replay.e2e-spec.ts`. FR-002, FR-005, FR-007, AT-05, AT-06, AT-07, SC-003.
- [X] T015 [P] [US2] Viết unit cho input exact/runId, pending, timeout và scope phiên/Project tại `frontend/test/allocation-request.test.mjs`, `frontend/test/simulation-run.test.mjs`. FR-006, FR-008, AT-12, AT-13, AT-15.
- [X] T016 [US2] Bổ sung đọc replay trước freshness, hòa giải duplicate, audit lỗi và phân loại commit tại `backend/src/projects/allocations/project-allocations.service.ts`. Nối GET đối chiếu trong `backend/src/projects/allocations/project-allocations.controller.ts`. FR-002, FR-005, FR-006, FR-007, AT-05, AT-06, AT-07, SC-003.
- [X] T017 [US2] Nối giờ exact và xử lý version vào `frontend/src/projects/simulationRun.ts`, `frontend/src/projects/ProjectWhatIfSimulation.tsx` và `frontend/src/projects/ProjectResourceRecommendations.tsx`. FR-003, FR-008, AT-10, AT-12, AT-15.
- [X] T018 [US2] Nối Apply và đối chiếu từ quyết định đã lưu trong `frontend/src/projects/ProjectAllocationControls.tsx`, `frontend/src/projects/ProjectDecisionHistory.tsx`, `frontend/src/projects/allocationRequest.ts`, `frontend/package.json`. Đọc metadata từ `backend/src/projects/decisions/project-decisions.service.ts`. FR-002, FR-005, FR-006, AT-06, AT-11, AT-13.

## Phase 5 — US3: Lịch sử và thông tin đúng quyền (P2)

**Kiểm độc lập** PM xem đúng lịch sử sở hữu, HR xem tổng hợp Employee/tuần, DEV giữ quyền 002.

- [X] T019 [P] [US3] Viết HTTP cho lịch sử, pagination, đổi owner, tách hai actor tại `backend/test/allocation-history.e2e-spec.ts`. FR-002, FR-007, AT-08, AT-11.
- [X] T020 [P] [US3] Viết HTTP quyền và trạng thái HR/DEV tại `backend/test/hr-authorization.e2e-spec.ts`, `backend/test/dev-profile.e2e-spec.ts`. FR-002, FR-008, AT-09, AT-10.
- [X] T021 [US3] Nối lịch sử Project từ `backend/src/projects/allocations/dto/allocation-history.dto.ts`, `backend/src/projects/allocations/project-allocations.controller.ts`, `backend/src/projects/allocations/project-allocations.service.ts` tới `frontend/src/projects/ProjectAllocationHistory.tsx` và `frontend/src/projects/ProjectDetailView.tsx`. FR-002, FR-006, FR-007, AT-08.
- [X] T022 [US3] Nối capacity HR theo quyền hiện hành ở `backend/src/employees/employees.service.ts`, `frontend/src/employees/EmployeesView.tsx`. FR-002, FR-008, AT-09, AT-10.

## Phase 6 — Polish & Cross-Cutting

- [X] T023 Chạy hồi quy 188 baseline, test mới, build/lint qua `backend/package.json`, `frontend/package.json`, `ai-service/test_risk.py`. AT-15, SC-004.
- [X] T024 Chạy clone/Chrome và recovery theo `specs/006-apply-allocation/quickstart.md`. Tạo kịch bản `backend/test/runtime/apply-allocation.mariadb.mjs`, ghi minh chứng ở `chapter-08-ai-software-testing/README.md`. FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, AT-01, AT-02, AT-03, AT-04, AT-05, AT-06, AT-07, AT-08, AT-09, AT-10, AT-11, AT-12, AT-13, AT-14, AT-15, SC-001, SC-002, SC-003, SC-004.

## Dependencies & Execution Order

T001 → T002–T007 → US1 → US2 → US3 → T023/T024. T008 và T009 soạn
song song sau nền tảng. T014/T015 và T019/T020 độc lập theo cặp. Trong
mỗi phase, test trước phần triển khai tương ứng. T018 và T021 nối các
bề mặt đã ổn định. Luồng MVP chốt từ US1, nghiệm thu đủ US2/US3 trước khi
công bố Gate 3. Gate 2 chỉ lập kế hoạch.
