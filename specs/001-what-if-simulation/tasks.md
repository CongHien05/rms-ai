# Tasks — What-if Simulation

**Căn cứ** [Spec đã duyệt](spec.md), [plan](plan.md), [mô hình dữ liệu](data-model.md),
[HTTP contract](contracts/what-if-api.md), [quickstart](quickstart.md).

**Trạng thái** Tất cả task chờ phê duyệt Gate 2 và thực thi sau đó.

## Format và đường dẫn

Mỗi task có ID, nhãn story ở pha tương ứng, căn cứ FR/AT/SC và đường dẫn
từ gốc repo. `[P]` đánh dấu task độc lập với task song song được nêu ở cuối.
Các trích dẫn trường dùng đúng tên trong `data-model.md`.

## Phase 1: Setup

- [x] T001 Xác nhận baseline, checklist Gate 1 và chốt credential dev theo quickstart; ghi biến trống `WHAT_IF_CONTEXT_SECRET=` trong `backend/.env.example` theo `data-model.md`, không đặt giá trị bí mật hoặc khiến app cũ thiếu biến bị lỗi khởi động. Hoàn thành khi điều kiện bật proof và cách giữ secret local được ghi rõ (FR-001/003/006, AT-03/06, SC-002).
- [x] T002 [P] Chạy và ghi baseline unit/HTTP đề xuất hiện có từ `backend/test/app.e2e-spec.ts` và test Frontend từ `frontend/package.json` theo `specs/001-what-if-simulation/quickstart.md`. Hoàn thành khi có kết quả so sánh thứ hạng, lọc, ca rỗng và lỗi trước thay đổi (FR-001/009, AT-03, SC-002/004).

## Phase 2: Foundational

- [x] T003 [P] Khai báo DTO request lồng và response ở `backend/src/projects/dto/resource-simulation.dto.ts` theo `contracts/what-if-api.md`; áp dụng định dạng/kiểu của `Scenario.supportHours`, `SimulationRun.id` và `SimulationResult.outcome` trong `data-model.md`. Giữ ValidationPipe cấm trường thừa và không ép chuỗi thành số. Hoàn thành khi request/response đối chiếu được với contract (FR-002/004/008, AT-04/09, SC-002/003).
- [x] T004 [P] Thêm hàm ký/xác minh ở `backend/src/projects/recommendation-context.ts` theo định nghĩa `RecommendationContext.projectId`, `RecommendationContext.employeeId`, `RecommendationContext.skillId`, `RecommendationContext.weekStart`, `RecommendationContext.requiredHours`, `RecommendationContext.proof` trong `data-model.md`. Dùng khóa ổn định, canonical tuple, version và so sánh constant time. Hoàn thành khi proof chỉ hợp lệ cho đúng tuple và nhánh khóa sai không làm vỡ luồng cũ (FR-001/003, AT-03/04/07, SC-002/003).
- [x] T005 [P] Viết ca unit cho tập hồ sơ đúng kỹ năng và đọc Employee theo ID trong `backend/src/employees/employees.service.spec.ts`. Bao phủ liên kết mất, null, 0 và khác tuần, khẳng định chỉ gọi đọc. Hoàn thành khi phân biệt được từng fixture (FR-003/006/009, AT-03/05/07, SC-002/004).
- [x] T006 Cập nhật truy vấn chỉ đọc ở `backend/src/employees/employees.service.ts` cho `EmployeeAvailability.weekStart`, `EmployeeAvailability.availableHours` và `EmployeeAvailability.matchesSkill` theo `data-model.md`. Dùng một lượt đọc cho tập hồ sơ đúng skill và một lượt riêng để đọc ID kèm liên kết skill và availability; giữ API HR hiện có. Hoàn thành khi T005 đạt (FR-001/003/006/009, AT-03/04/05/07, SC-002/004).

## Phase 3: User Story 1 — Xem tác động của phương án đã xác nhận (P1)

**Kiểm chứng độc lập** Chọn người từ đề xuất của đúng dự án, xác nhận 8 giờ
hoặc 4 giờ và đối chiếu ba chỉ báo cùng dữ liệu trước/sau.

### Kiểm thử

- [x] T007 [P] [US1] Viết unit ở `backend/src/projects/project-simulation.service.spec.ts` cho đủ/một phần, giờ hỗ trợ vượt giờ cần, số lẻ, số mũ, proof sai ngữ cảnh, snapshot và read-only; dùng phép thử sát giới hạn có thể biểu diễn (FR-001/002/003/004/005/009, AT-01/02/04/07, SC-001/004).
- [x] T008 [P] [US1] Thêm ca happy path và hồi quy danh sách đề xuất ở `backend/test/app.e2e-spec.ts` với Supertest và repository thay thế. Dùng proof từ response đề xuất thật trong test, bổ sung double cho truy vấn mới, snapshot trước/sau và spy chống ghi. Giữ phép đối chiếu chính xác toàn bộ trường cũ và kiểm tra riêng metadata mới. Bao phủ thứ hạng, đồng hạng, lọc theo skill/tuần, thiếu khóa vẫn xem đề xuất và round-trip DTO (FR-001/002/003/005/009, AT-01/02/03, SC-001/004).

### Triển khai

- [x] T009 [P] [US1] Viết phép so sánh và tính decimal thuần ở `backend/src/projects/project-hours.ts` theo `SimulationImpact.hypotheticalSupportHours`, `SimulationImpact.remainingRequiredHours`, `SimulationImpact.remainingAvailableHours` từ `data-model.md`. Hoàn thành khi ca số lẻ, số mũ, bằng giờ trống và vượt giờ cần trong T007 có kết quả đúng (FR-004/005, AT-01/02/04, SC-001).
- [x] T010 [P] [US1] Giữ phép lọc và comparator cũ, bổ sung phân loại `RecommendationContext.outcome` và cấp `RecommendationContext.proof` theo `data-model.md` trong `backend/src/projects/project-resource-recommendation.service.ts`; phân biệt kết quả rỗng với hồ sơ đúng skill thiếu khai báo. Hoàn thành khi phần hồi quy đề xuất T008 đạt (FR-001/006/009, AT-03, SC-002/004).
- [x] T011 [US1] Xác minh proof và tham chiếu, đọc lại nguồn và tạo `Scenario.reference`, `SimulationSnapshot.context`, `SimulationSnapshot.supportHours`, `SimulationSnapshot.availableHours` và `SimulationResult.outcome` theo `data-model.md` trong `backend/src/projects/project-simulation.service.ts`. Dùng helper giờ T009 và echo runId. Hoàn thành khi T007 đạt, có guard cho giờ vượt và nguồn không hợp lệ (FR-002/003/004/005/008/009, AT-01/02/04/07, SC-001/003/004).
- [x] T012 [US1] Nối `POST /projects/:projectId/simulations` HTTP 200 vào `backend/src/projects/projects.controller.ts` và `backend/src/projects/projects.module.ts`, dùng DTO và service đã có. Hoàn thành khi ca tích hợp T008 đạt theo contract (FR-002/003/005/009, AT-01/02, SC-001/004).
- [x] T013 [P] [US1] Tách phần trình bày phương án/tác động dùng chung vào `frontend/src/resource-recommendation/WhatIfSimulationPanels.tsx`; giữ hành vi và callback của `frontend/src/resource-recommendation/WhatIfSimulationView.tsx` trong đường dẫn mock. Hoàn thành khi component trình bày có thể dùng cho hai đường dẫn và luồng mock vẫn mở bước quyết định như cũ (FR-002/005, AT-01/02, SC-001).
- [x] T014 [US1] Tạo luồng What-if thật trong `frontend/src/projects/ProjectWhatIfSimulation.tsx`: nhận ngữ cảnh và proof, điền số giờ gợi ý, gửi xác nhận tới Backend, đọc snapshot và trình bày ba chỉ báo bằng panel T013. Hoàn thành khi What-if thật dừng ở kết quả, giữ UI còn lại (FR-002/005/009, AT-01/02, SC-001/004).
- [x] T015 [US1] Nối nút chọn ứng viên và luồng What-if thật trong `frontend/src/projects/ProjectResourceRecommendations.tsx`, bảo toàn phân trang và ngữ cảnh dự án/tuần/kỹ năng/nhu cầu. Hoàn thành khi kiểm chứng độc lập AT-01/02 và hồi quy chọn trong danh sách hiện có đạt (FR-001/002, AT-01/02/03, SC-001/002).

## Phase 4: User Story 2 — Xử lý phương án không chạy được (P2)

**Kiểm chứng độc lập** Tái lập đề xuất rỗng, thiếu dữ liệu, phương án sai và
lỗi tạm thời; thử lại từ đầu vào giữ nguyên.

### Kiểm thử

- [x] T016 [P] [US2] Mở rộng `backend/src/projects/project-simulation.service.spec.ts` cho bỏ trống/0/âm/NaN/Infinity, vượt giờ trống, tuần sai, mất project/employee/skill/quan hệ và phân biệt null, 0, khác tuần, lỗi nguồn. Hoàn thành khi lỗi không tạo impact hoặc ghi dữ liệu (FR-003/004/006/007/009, AT-04/05/06/07, SC-002/004).
- [x] T017 [P] [US2] Mở rộng `backend/test/app.e2e-spec.ts` cho null/thiếu/chuỗi/số mũ tràn, malformed DTO và trường giả mạo availability, proof đổi tuple, 400/404/422/503 và lỗi nguồn rồi retry, 8→4 sau khi cấp proof, ba outcome đề xuất. Hoàn thành khi kiểm tra error body, snapshot và không ghi trên từng ca HTTP (FR-001/003/004/006/007/008/009, AT-03/04/05/06/07, SC-002/003/004).
- [x] T018 [US2] Thêm ca test UI thuần giữ đầu vào khi lỗi, phân biệt empty/missing/invalid/error, và tạo run mới khi retry trong `frontend/test/simulation-run.test.mjs`. Đăng ký suite vào `frontend/package.json` theo lệnh Node test hiện có. Hoàn thành khi phân loại error, body sai cấu trúc và retry đều có kỳ vọng rõ (FR-001/006/007, AT-03/04/05/06, SC-002).

### Triển khai

- [x] T019 [US2] Hoàn thiện lỗi contract và retry ở `backend/src/projects/project-simulation.service.ts`, `backend/src/projects/projects.controller.ts` và `backend/src/projects/dto/resource-simulation.dto.ts`. Phân loại giá trị nguồn thiếu và sai ngữ cảnh, giữ 400/404/422/503/500 theo contract, ưu tiên body rút gọn. Hoàn thành khi T016/017 đạt và lượt retry đọc lại nguồn (FR-003/004/006/007/009, AT-04/05/06/07, SC-002/003/004).
- [x] T020 [US2] Thêm ánh xạ trạng thái và giữ bản nháp khi lỗi/thiếu dữ liệu ở `frontend/src/projects/simulationRun.ts`, `frontend/src/projects/ProjectWhatIfSimulation.tsx` và `frontend/src/projects/ProjectResourceRecommendations.tsx`. Giữ danh sách có ứng viên khi thiếu proof, tách missing với empty, cho thử lại thủ công và hướng tải đề xuất mới khi ngữ cảnh hỏng. Hoàn thành khi T018 và kiểm chứng độc lập AT-03–06 đạt ở các lớp tương ứng (FR-001/006/007, AT-03/04/05/06, SC-002).

## Phase 5: User Story 3 — Giữ kết quả đúng đầu vào (P3)

**Kiểm chứng độc lập** Đổi đầu vào rồi chạy lại, trì hoãn success/error/finally
của lượt A đến sau lượt B; chỉ trạng thái B được hiển thị.

### Kiểm thử

- [x] T021 [US3] Dùng deferred promises trong `frontend/test/simulation-run.test.mjs` cho mọi trường thay đổi, đổi rồi quay lại, run ID mới khi retry cùng tuple, A success/error/finally khi B pending/success/error và response không khớp snapshot giao diện. Hoàn thành khi kịch bản có kết quả xác định và chạy lặp được (FR-002/008/009, AT-08/09, SC-003).

### Triển khai

- [x] T022 [US3] Thêm guard lượt hiện hành vào `frontend/src/projects/simulationRun.ts` theo `SimulationRun.inputRevision` và `SimulationRun.id` trong `data-model.md`. Áp dụng guard cho success, catch và finally; hủy request khi có thể. Hoàn thành khi T021 đạt và lỗi/lượt cũ không làm mất loading của lượt mới (FR-008/009, AT-08/09, SC-003).
- [x] T023 [US3] Vô hiệu kết quả và lượt đang chờ khi đổi ngữ cảnh trong `frontend/src/projects/ProjectWhatIfSimulation.tsx` và `frontend/src/projects/ProjectResourceRecommendations.tsx`. Giữ kết quả chỉ thuộc snapshot cũ, hiển thị stale và yêu cầu xác nhận lại. Hoàn thành khi kiểm chứng độc lập AT-08/09 đạt và retry cùng đầu vào có run ID mới (FR-002/008/009, AT-07/08/09, SC-003/004).

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T024 Chạy các lệnh unit, HTTP E2E, build, lint và hồi quy trong `backend/package.json`, `frontend/package.json` theo `specs/001-what-if-simulation/quickstart.md`, ghi riêng từng lớp vào `chapter-08-ai-software-testing/README.md`. Hoàn thành khi AT-01–09 đã có bằng chứng đúng lớp hoặc blocker có căn cứ (FR-001–009, AT-01–09, SC-001–004).
- [x] T025 Chạy các ca Runtime E2E trong `specs/001-what-if-simulation/quickstart.md` trên MariaDB dev; dùng SELECT trước/sau, kiểm tra network và phân biệt can thiệp test nếu có; ghi môi trường, giới hạn và kết quả vào `chapter-08-ai-software-testing/README.md`. Hoàn thành khi có đối chiếu SQL cho ca chạy được, nêu cụ thể ca chưa chạy và giới hạn ProjectAllocation (FR-001/003/005/006/008/009, AT-01/02/03/04/08, SC-001/002/003/004). Thực hiện sau T024 vì cùng nơi ghi bằng chứng.
- [x] T026 [P] Cập nhật kiến trúc thực tế của What-if vào `chapter-05-ai-for-software-design-architecture/README.md`, dẫn contract và ranh giới chỉ đọc; giữ B1 chờ duyệt (FR-003/008/009, AT-07/09, SC-003/004).
- [x] T027 [P] Ghi lát cắt đã triển khai, vai trò AI và quyết định con người vào `chapter-06-ai-coding/README.md`; dẫn kết quả từ Chapter 8 và nêu phần chưa kiểm chứng (FR-001/002/005, AT-01/02, SC-001).
- [x] T028 [P] Ghi review hợp đồng, precision, hồi quy và race trong `chapter-07-ai-code-review-refactoring/README.md`; phân biệt rủi ro đã xử lý và điểm còn mở (FR-004/006/007/008, AT-04/06/09, SC-002/003).
- [x] T029 [P] Cập nhật hướng dẫn chạy/kiểm chứng và giới hạn demo ở `chapter-09-ai-technical-documentation/README.md`, liên kết quickstart và Chapter 8 (FR-005/009, AT-01/02, SC-001/004).
- [x] T030 Cập nhật trạng thái milestone và liên kết theo bằng chứng thực tế trong `COURSE_PROGRESS.md`; rà lại diff, whitespace, đường dẫn đã thêm và các chapter được giao (FR-001–009, AT-01–09, SC-001–004).

## Dependencies & Execution Order

- **Setup → Foundational → US1 → US2 → US3 → Polish.** US2 dùng endpoint và
  luồng PM thật của US1. US3 dùng điều phối trạng thái của US2. Mỗi story
  có ca kiểm chứng độc lập với dữ liệu kiểm soát được, dù tích hợp theo thứ tự.
- Sau T001/T002, T003–T005 có thể thực hiện song song. T006 cần T005.
  T007/T008 thiết lập test sau foundation; T009 và T010 độc lập sau khi
  test tương ứng có sẵn. T011 cần T003/T004/T006/T009; T012 cần T008/T010/T011.
  T013 có thể làm độc lập với phần backend sau khi contract đã có.
  T014 cần T012/T013 và T015 cần T010/T014.
- T016/T017/T018 có thể soạn song song sau US1. T019 cần T016/T017,
  T020 cần T018/T019. T021 → T022 → T023 chạy lần lượt. T024 và kiểm
  chứng Runtime đi sau T023. T026–T029 có thể phân công theo từng README
  khi bằng chứng Chapter 8 đủ. T030 chốt sau các task bằng chứng.
- Ví dụ song song US1: T007 và T008 dùng hai file test khác nhau. Khi đã
  xác định kỳ vọng, T009 (hàm giờ) và T013 (panel giao diện) dùng các file
  độc lập. Ví dụ US2: T016, T017 và T018 dùng ba bộ test khác nhau. US3
  sửa chung guard và màn hình nên làm tuần tự.

## Implementation Strategy

US1 là mốc kiểm chứng kỹ thuật đầu tiên của phép tính qua luồng PM.
Nghiệm thu PROPOSED DEMO yêu cầu thêm US2, US3 và các bước kiểm chứng
tương ứng trước khi đóng milestone.

| Nhóm | Task triển khai và kiểm chứng chính |
| --- | --- |
| FR-001 / AT-03 / SC-002 | T008, T010, T015, T017, T020, T024 |
| FR-002 / AT-01–02 / SC-001 | T007–T009, T011–T015, T024–T025 |
| FR-003–004 / AT-04–05, AT-07 | T003–T007, T011, T016–T017, T019, T024 |
| FR-005 / AT-01–02, AT-07 / SC-001 | T007–T009, T011–T015, T017, T024–T025 |
| FR-006–007 / AT-03–06 / SC-002 | T016–T020, T024 |
| FR-008 / AT-07–09 / SC-003 | T011, T017, T021–T025 |
| FR-009 / SC-004 | T005–T008, T011, T017, T019, T023–T026 |

## Notes

Chỉ thực thi sau khi Gate 2 được duyệt. Báo riêng unit, HTTP test double
và MariaDB runtime. Các task không yêu cầu schema, lịch sử mô phỏng, huấn
luyện AI, PM Decision, Apply, Auth/RBAC hay viết lại các màn hình ngoài lát cắt.
