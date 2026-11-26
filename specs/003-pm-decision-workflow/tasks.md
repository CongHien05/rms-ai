# Tasks — PM Decision Workflow

**Nguồn** [Spec](spec.md) · [Plan và AT](plan.md#ma-trận-kiểm-thử) ·
[Data Model](data-model.md) · [API](contracts/pm-decision-api.md) · [Quickstart](quickstart.md).
Tất cả mục dành cho lượt triển khai sau Gate 2.

## Phase 1 — Setup

- [X] T001 Thêm cấu hình mẫu trống và mô tả khóa ký riêng, kiểm môi trường/nạp khóa ngoài Git ở `backend/.env.example` và `backend/README.md`. FR-002, FR-009, AT-07, AT-16, SC-004.

## Phase 2 — Foundational

- [X] T002 Tạo entity và hai cấu trúc JSON trong `backend/src/projects/decisions/pm-decision.entity.ts` theo [data-model.md](data-model.md) cho `PMDecision.id`, `PMDecision.simulationId`, `PMDecision.projectId`, `PMDecision.pmAccountId`, `PMDecision.decision`, `PMDecision.decidedAt`, `PMDecision.snapshot`, `PMDecision.expectedImpact` và `PMDecision.referenceDigest`. FR-004, FR-005, FR-007, AT-01, AT-10, AT-12.
- [X] T003 Tạo DDL cộng thêm, unique, FK và index theo Data Model tại `backend/src/database/migrations/1791250000000-add-pm-decisions.ts`, đăng ký `backend/src/database/database.config.ts` và `backend/src/projects/projects.module.ts`. Kiểm FK trên clone, migration phục hồi và tám bảng baseline. FR-004, FR-005, FR-008, AT-03, AT-10, AT-16, SC-004.
- [X] T004 Mở rộng quyền Project có transaction manager và hỗ trợ khóa ghi/chia sẻ tại `backend/src/projects/projects.service.ts`, giữ các caller 001/002 hiện hành. FR-001, FR-009, AT-06, AT-14.

## Phase 3 — US2 · Xác minh và ghi có bảo vệ (P1)

**Kiểm độc lập** Dùng HTTP với guard thật để kiểm hai PM, phiên hết hạn,
evidence hợp lệ/giả, Project ngoài quyền, và các nhánh stale/replay/conflict.

- [X] T005 [P] [US2] Viết unit test ký/xác minh, tamper, scope, UUID v4 mới cho mỗi lượt, khóa thiếu/thay và restart tại `backend/src/projects/decision-context.spec.ts`. FR-002, FR-009, AT-07, AT-08, AT-16.
- [X] T006 [P] [US2] Viết HTTP test double cho policy, Origin, body tamper, What-if proof thiếu kết quả, snapshot stale, quyết định đã lưu trước freshness, duplicate và lỗi transaction tại `backend/test/pm-decisions.e2e-spec.ts`. Giữ guard thật. FR-001, FR-002, FR-003, FR-004, FR-005, FR-009, AT-06, AT-07, AT-08, AT-09, AT-10, AT-15, AT-16, SC-002, SC-003.
- [X] T007 [P] [US2] Viết hồi quy What-if giữ kết quả và các status baseline với hoặc thiếu khóa tại `backend/test/app.e2e-spec.ts` và `backend/src/projects/project-simulation.service.spec.ts`. FR-002, FR-008, FR-009, AT-03, AT-07, AT-16, SC-004.
- [X] T008 [US2] Cài chứng từ ký/phân tích và xác minh schema trong `backend/src/projects/decision-context.ts`. Đối chiếu [data-model.md](data-model.md) cho `DecisionSnapshot.projectId`, `DecisionSnapshot.employeeId`, `DecisionSnapshot.skillId`, `DecisionSnapshot.weekStart`, `DecisionSnapshot.requiredHours`, `DecisionSnapshot.supportHours`, `DecisionSnapshot.availableHours`, `DecisionImpact.hypotheticalSupportHours`, `DecisionImpact.remainingRequiredHours`, `DecisionImpact.remainingAvailableHours`. FR-002, FR-004, AT-07, AT-08, AT-16.
- [X] T009 [US2] Cấp evidence sau tính thành công từ principal và snapshot đã xác minh trong `backend/src/projects/project-simulation.service.ts`, `backend/src/projects/projects.controller.ts` và `backend/src/projects/dto/resource-simulation.dto.ts`. Giữ 001 chỉ đọc và tương thích khi thiếu evidence. FR-002, FR-008, FR-009, AT-05, AT-07, AT-16.
- [X] T010 [US2] Thực thi ghi trong `backend/src/projects/decisions/project-decisions.service.ts`: Account → Project, lookup/so digest trước freshness, xác minh và lock nguồn cho lần mới, INSERT, rollback toàn bộ và hòa giải duplicate bằng giao dịch được kiểm quyền mới. FR-001, FR-003, FR-004, FR-005, FR-008, AT-01, AT-08, AT-09, AT-10, AT-15, AT-16, SC-002, SC-003.
- [X] T011 [US2] Nối POST theo contract vào `backend/src/projects/decisions/project-decisions.controller.ts`, `backend/src/projects/decisions/dto/project-decision.dto.ts` và `backend/src/projects/projects.module.ts`. Trả đúng 201/200 sau commit, giữ chính sách guard/no-store, không trả digest. FR-001, FR-004, FR-005, FR-009, AT-01, AT-02, AT-06, AT-08, AT-10.

## Phase 4 — US1 · PM quyết định sau What-if (P1)

**Kiểm độc lập** PM chạy hai lượt thành công, chọn ACCEPT và REJECT,
đối chiếu kết quả trả về và dữ liệu Clone giữ nguyên.

- [X] T012 [P] [US1] Viết ca HTTP ACCEPT/REJECT có bản ghi đúng và giữ nguồn lực, từ chối reason/client fields ở `backend/test/pm-decisions.e2e-spec.ts`. FR-004, FR-008, AT-01, AT-02, AT-03, SC-001.
- [X] T013 [P] [US1] Viết unit cho pending, mất response, retry cùng body, stale, 401 và phản hồi cũ trong `frontend/test/decision-request.test.mjs` và giữ ca What-if ở `frontend/test/simulation-run.test.mjs`. FR-002, FR-003, FR-005, FR-006, FR-009, AT-04, AT-05, AT-11, AT-16, SC-003, SC-004.
- [X] T014 [US1] Giữ evidence chỉ ở kết quả What-if hợp lệ, bỏ khi revision/scope đổi trong `frontend/src/projects/simulationRun.ts` và `frontend/src/projects/ProjectWhatIfSimulation.tsx`. FR-002, FR-003, FR-006, FR-009, AT-05, AT-07, AT-11.
- [X] T015 [US1] Cài client ghi, thông báo và nút trong `frontend/src/projects/decisionRequest.ts`, `frontend/src/projects/ProjectDecisionControls.tsx`, `frontend/src/projects/ProjectWhatIfSimulation.tsx` và `frontend/package.json`. Giữ lựa chọn trên retry, chặn lặp UI, xử lý lỗi theo contract và bỏ phản hồi khác phiên/Project. FR-003, FR-005, FR-006, FR-008, AT-01, AT-02, AT-03, AT-04, AT-05, AT-11, AT-16, SC-001, SC-003.

## Phase 5 — US3 · Xem lại theo Project (P2)

**Kiểm độc lập** Fixture có bản ghi của PM hiện tại và PM trước. PM đang phụ
trách xem được cả hai. PM ngoài scope không đọc được.

- [X] T016 [P] [US3] Viết ca HTTP lịch sử, thứ tự, rỗng/lỗi, chuyển ownership và PM/Project/role ngoài quyền tại `backend/test/pm-decision-history.e2e-spec.ts`. FR-001, FR-004, FR-007, AT-12, AT-13, AT-14, SC-001, SC-002.
- [X] T017 [US3] Thêm DTO query và GET dùng khóa chia sẻ, scope Project, phân trang và response giữ PM gốc tại `backend/src/projects/decisions/dto/project-decision-history.dto.ts`, `backend/src/projects/decisions/project-decisions.controller.ts` và `backend/src/projects/decisions/project-decisions.service.ts`. FR-001, FR-004, FR-007, AT-12, AT-13, AT-14.
- [X] T018 [US3] Nối lịch sử và các trạng thái reload/rỗng/lỗi tại `frontend/src/projects/ProjectDecisionHistory.tsx`, `frontend/src/projects/ProjectDetailView.tsx`; đối chiếu 409 conflict qua lịch sử. FR-005, FR-006, FR-007, AT-12, AT-13, AT-14.

## Phase 6 — Polish và kiểm chứng

- [X] T019 Chạy unit, HTTP E2E test double, build/lint qua `backend/package.json`, `frontend/package.json` và FastAPI unit qua `ai-service/test_risk.py`. Đối chiếu toàn bộ 167 regression và ghi phân lớp. FR-008, FR-009, AT-03, AT-16, SC-004.
- [X] T020 Diễn tập additive migration/backup phục hồi và runtime Chrome/MariaDB clone. Thêm kịch bản có giới hạn clone trong `backend/test/runtime/pm-decisions.mariadb.mjs`, chạy các ca concurrency, rollback, stale, mất response, restart và kiểm nguồn không đổi theo `specs/003-pm-decision-workflow/quickstart.md`. Ghi minh chứng tại `chapter-08-ai-software-testing/README.md`. FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, AT-01, AT-02, AT-03, AT-04, AT-06, AT-08, AT-09, AT-10, AT-11, AT-12, AT-14, AT-15, AT-16, SC-001, SC-002, SC-003, SC-004.

## Dependencies & Execution Order

T001–T004 là nền tảng. US2 và US1 cùng P1, đi US2 trước để US1 gọi API
thật. Có thể soạn T005–T007 song song sau nền tảng, T012/T013 song song ở
US1 sau khóa API. T016 tách file với US1, T017 nối vào service sau T011.
T019/T020 sau cả ba story. T020 cần bản sao MariaDB đã được xác nhận.
