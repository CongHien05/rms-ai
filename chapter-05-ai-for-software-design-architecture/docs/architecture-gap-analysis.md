# Chapter 5 Phase A — Architecture Gap Analysis

## 1. Mục đích

Tài liệu này so sánh baseline đã kiểm chứng trong
[Architecture Baseline Audit](architecture-baseline-audit.md) với yêu cầu của
Chapter 5 (5.1–5.6), requirement baseline và Chapter 4 close-out. Mục tiêu là
phân biệt rõ:

- khoảng trống tài liệu và mô hình;
- khoảng trống triển khai;
- mâu thuẫn do tài liệu cũ;
- quyết định con người cần đưa ra;
- nội dung có thể tiếp tục giữ ở mức abstract/TBD.

Phase A không giải quyết các gap bằng cách sửa code hoặc tự chốt nghiệp vụ.

## 2. Thang đánh giá

| Mức | Ý nghĩa trong tài liệu này |
| --- | --- |
| Critical | Không thể hoàn tất thiết kế bắt buộc hoặc giữ đúng bất biến nếu chưa có quyết định. |
| High | Dễ làm sai baseline/contract; nên xử lý ở milestone Chapter 5 gần nhất. |
| Medium | Cần cho tính đầy đủ hoặc khả năng bảo trì, nhưng không chặn Phase B ưu tiên. |
| Low | Documentation hygiene hoặc cải thiện có thể trì hoãn có kiểm soát. |

`Critical` không có nghĩa phải lập tức triển khai. Một gap có thể critical đối
với việc **finalize design** nhưng vẫn cho phép tiếp tục current-state modeling
với nhãn `TBD`.

## 3. Gap register

| Gap ID | Khu vực | Khoảng trống | Bằng chứng / tác động | Mức | Dependency | Hành động được khuyến nghị |
| --- | --- | --- | --- | --- | --- | --- |
| C5-GAP-001 | 5.1 Architecture | `system-architecture.md` phản ánh snapshot Backend health-only | Source hiện có 6 module, TypeORM, entity và migration; người đọc có thể dùng sai baseline | High | Không | Reconcile current-state architecture, giữ target/core flow là proposed |
| C5-GAP-002 | 5.1 Architecture | Chưa có component ownership/model hiện trạng đã duyệt | Ranh giới FE/BE/AI có mô tả văn bản nhưng chưa phản ánh module và trạng thái integration | High | C5-GAP-001 | Tạo component diagram nhỏ có nhãn implemented/proposed/TBD |
| C5-GAP-003 | 5.2 Patterns | Chưa có quyết định pattern và rationale | Source có feature module, DI, controller/service/repository nhưng chưa có pattern record | Medium | C5-GAP-001 | Ghi source-evidenced pattern catalog/ADR; không gán pattern không có bằng chứng |
| C5-GAP-004 | 5.3 UML | Chưa có UML đầy đủ theo phạm vi học phần | Chỉ có 1 Mermaid flowchart và 2 Mermaid ERD; không có component/sequence/activity/class/deployment diagram | High | C5-GAP-002 | Ưu tiên component + một sequence được gắn trạng thái; không làm diagram thừa |
| C5-GAP-005 | 5.4 Database | Database docs không phản ánh 6 entity và 2 migration hiện tại | Dễ nhầm conceptual ERD với physical schema hoặc cho rằng ORM chưa tồn tại | High | Không | Thêm current-state physical overlay và mapping conceptual -> implemented/TBD |
| C5-GAP-006 | 5.4 Database | Persistence runtime/migration applied chưa được xác minh | Mock-e2e không dùng MySQL; không có migration log | Medium | Môi trường DB được cho phép ở giai đoạn sau | Giữ `NOT VERIFIED`; không chạy migration trong Phase A |
| C5-GAP-007 | 5.5 API | Initial API contract bỏ qua foundation routes hiện có | 16 method/route combinations được xác minh trong controllers; contract cũ nói mọi business endpoint chưa tồn tại | High | C5-GAP-001 | Reconcile actual foundation inventory riêng với proposed core contracts |
| C5-GAP-008 | 5.5 API | Prefix/version/error/security contract chưa thống nhất | Proposed core routes dùng `/api`; source không có global prefix/Auth | Medium | C4-HDR-027/031 | Đưa ra quyết định kỹ thuật sau human review; không tự đổi route |
| C5-GAP-009 | MVP integration | Frontend không gọi Backend; Backend không gọi AI | Core flow chỉ hiện diện trong UI/docs | High cho implementation; non-blocking Phase B docs | C4-HDR-021–028/030/031 | Duy trì ranh giới proposed; không triển khai sớm |
| C5-GAP-010 | AI capability | AI service chỉ có health | Không risk/recommendation/simulation/model/data/test | High cho MVP implementation | C4-HDR-021–025/030 | Chuyển sang AI design/Chapter 6 khi input/output/metric được duyệt |
| C5-GAP-011 | Security | Chưa có identity/Auth/RBAC architecture | Role Preview có thể bị hiểu sai là access control | Critical cho final security design | C4-HDR-031 | Giữ boundary rõ; cần human decision trước security design/implementation |
| C5-GAP-012 | Core data/API | Scenario, impact, decision/apply, freshness/idempotency chưa chốt | Không thể final schema/contract cho nửa sau của core flow | Critical cho detailed design | C4-HDR-024–028 | Chỉ giữ abstract interface và bất biến đã xác nhận |
| C5-GAP-013 | Documentation | `COURSE_PROGRESS.md` và root README có drift | Chapter 4/roles/env requirements bị mô tả cũ | Low–Medium | Phạm vi cập nhật riêng | Đăng ký conflict; không sửa ngoài Chapter 5 trong Phase A |

## 4. Bao phủ Chapter 5 (5.1–5.6)

| Mục | Bằng chứng đã có | Mức bao phủ | Gap chính | Kết luận Phase A |
| --- | --- | --- | --- | --- |
| 5.1 Architecture Design | `system-architecture.md`; source ba phần FE/BE/AI | Một phần; tài liệu mức cao có nhưng snapshot cũ | Current-state component model, ownership và runtime topology | `PARTIAL` |
| 5.2 Architecture Patterns | Nest feature modules, DI, controller/service/repository | Có bằng chứng source nhưng chưa được review/ghi rationale | Pattern record/ADR; không có AI integration pattern | `PARTIAL` |
| 5.3 System Modeling & UML | 1 Mermaid `flowchart LR`; 2 Mermaid `erDiagram` | Chưa đủ UML; syntax Mermaid không tự biến sơ đồ thành UML | Component/sequence/deployment view phù hợp phạm vi | `GAP` |
| 5.4 Database Design | Conceptual entity catalog + 2 ERD; 6 entity + 2 migration | Conceptual tốt, current physical baseline bị drift | Overlay physical; persistence runtime chưa verified; nhiều entity còn TBD | `PARTIAL` |
| 5.5 API Design | Proposed core contracts; actual foundation controllers/DTO | Hai baseline chưa reconcile | Actual vs proposed contract, prefix, errors, security | `PARTIAL` |
| 5.6 Design Patterns | Controller–Service, DI, TypeORM Repository evidence | Source evidence có; chưa có review artifact | Xác nhận intent, trade-off và giới hạn; tránh pattern phức tạp | `PARTIAL` |

Chapter 5 chưa hoàn thành. Phase A chỉ đưa trạng thái về:
**Architecture baseline verified; design gaps and required decisions documented.**

## 5. UML và modeling inventory

### 5.1. Sơ đồ thực sự tồn tại

| Artifact | Syntax/loại | Vị trí | Đánh giá |
| --- | --- | --- | --- |
| System context mức cao | Mermaid `flowchart LR` | `chapter-03-ai-for-requirements-product-analysis/docs/system-architecture.md` mục 5 | Hữu ích như context flow; không phải UML component diagram; role/backend state bị cũ |
| Foundation data ERD | Mermaid `erDiagram` | `database-design.md` mục 7 | Conceptual ERD; không phản ánh migration hiện tại như physical-as-built model |
| AI/decision conceptual ERD | Mermaid `erDiagram` | `database-design.md` mục 10 | Design proposal; nhiều khái niệm/persistence là TBD |

Tìm kiếm toàn bộ Markdown không thấy `sequenceDiagram`, `classDiagram`,
`stateDiagram` hoặc deployment diagram. Không tuyên bố UML đã hoàn chỉnh.

### 5.2. Sơ đồ cần thiết và mức ưu tiên

| Sơ đồ | Cần cho MVP/học phần? | Lý do | Điều kiện |
| --- | --- | --- | --- |
| Current-state component diagram | Có — ưu tiên 1 | Làm rõ Frontend prototype, Backend modules, AI health-only, DB not verified | Không cần mở TBD nghiệp vụ |
| Sequence diagram cho một luồng | Có — sau component baseline | Phân biệt actual foundation call và proposed core flow | Mỗi message phải gắn actual/proposed; core payload còn TBD |
| Current physical ERD/overlay | Có | Reconcile 6 entity/migration với conceptual ERD | Không thêm ProjectAllocation/Auth tables |
| Deployment/runtime view tối giản | Có ích | Phân biệt source component với runtime đã xác minh | Ghi DB/AI integration `NOT VERIFIED` |
| Activity diagram | Tùy chọn | Core flow đã có văn bản; chỉ thêm nếu hỗ trợ review decision states | Không tự tạo recovery/apply behavior |
| Class diagram | Không ưu tiên | Entity nhỏ và ERD/source đã thể hiện cấu trúc; dễ trùng lặp | Chỉ làm nếu rubric yêu cầu rõ |

## 6. Architecture pattern assessment

| Pattern | Có bằng chứng? | Evidence | Trạng thái đúng |
| --- | --- | --- | --- |
| Modular monolith | Có cấu trúc hỗ trợ | Một Nest application, sáu feature module trong `AppModule` | `SOURCE-EVIDENCED STRUCTURE`; tên/rationale chưa được phê duyệt |
| Layered architecture | Có cho foundation | Controller -> Service -> Repository | `VERIFIED FROM SOURCE` trong backend foundation |
| Dependency Injection | Có | Nest constructor injection và `@InjectRepository` | `VERIFIED FROM SOURCE` |
| Controller–Service separation | Có | Controller mỏng, service xử lý normalize/existence/data access | `VERIFIED FROM SOURCE` |
| Repository pattern | Có qua TypeORM abstraction | `Repository<T>` được inject | `VERIFIED FROM SOURCE`; không phải custom domain repository |
| Adapter/Gateway cho AI | Không | Không có Backend -> AI client | `NOT IMPLEMENTED` |
| Strategy/Factory/Observer khác | Không có bằng chứng cần thiết | Không thấy use case tương ứng | Không đề xuất chỉ để đủ checklist |

## 7. Conflict register

| Conflict ID | Source A | Source B | Khác biệt | Loại | Ảnh hưởng | Mức | Hành động đề xuất | Decision owner | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C5-CONFLICT-001 | `system-architecture.md` mục 4: Backend chỉ health, không module/ORM/migration | `backend/src/app.module.ts`, feature modules, database config/migrations | Snapshot kiến trúc cũ hơn source | Documentation drift | Baseline component/backend sai | High | Reconcile current-state doc; không biến foundation thành core capability | Software Architect + team | Open; registered |
| C5-CONFLICT-002 | `database-design.md` mục 4, 14.1, 18: không ORM/driver/config/migration | `backend/package.json`; `backend/src/database/`; entity files | Technology direction đã được hiện thực một phần | Documentation drift | Người đọc có thể thiết kế lại hoặc hiểu sai schema | High | Thêm as-built overlay và ghi migration applied `NOT VERIFIED` | Software Architect/DB reviewer | Open; registered |
| C5-CONFLICT-003 | `initial-api-contracts.md` dòng trạng thái: mọi business endpoint chưa tồn tại | Controllers cho Project/Sprint/Task/Employee/Skill/EmployeeSkill | Foundation endpoints đã có; core AI-flow endpoints vẫn chưa có | Documentation drift + scope ambiguity | API inventory không đầy đủ | High | Tách actual foundation API khỏi proposed core contracts | API owner/Architect | Open; registered |
| C5-CONFLICT-004 | `system-architecture.md` mục 5: PM chính; Resource Manager/Team Lead phụ, chưa có flow riêng | PRD/User Stories US-05–US-07; Chapter 4 PM/HR/DEV workspace | Role model hiện hành là PM/HR/DEV | Design/document drift | Context diagram và access boundary sai/nghèo | Medium | Cập nhật role context nhưng không suy ra Auth/RBAC | Product Owner + Architect | Open; registered |
| C5-CONFLICT-005 | `COURSE_PROGRESS.md`: Chapter 4 đang làm, review còn tiếp tục, role workspace chưa triển khai | Chapter 4 README/close-out; frontend role workspace; commit `45edcfe` | Trạng thái tiến độ lịch sử chưa cập nhật | Documentation drift | Báo cáo học phần gây hiểu nhầm | Low | Sửa trong yêu cầu progress hygiene riêng | Course/project owner | Known; deferred outside Phase A |
| C5-CONFLICT-006 | Proposed core routes dùng `/api/...` | `backend/src/main.ts` không set global prefix; actual foundation routes ở root | Convention API chưa thống nhất | Design inconsistency | Future integration có thể dùng hai convention | Medium | Human-review prefix/versioning trước khi mở core endpoints | API owner | Open; no code change |
| C5-CONFLICT-007 | Root `README.md`: “Các ứng dụng nền tảng không yêu cầu biến môi trường” | `database.config.ts` bắt buộc 5 biến DB khi AppModule khởi tạo | Hướng dẫn chạy Backend đã cũ | Documentation drift | Backend có thể không start theo README | Medium | Cập nhật runbook trong task riêng sau khi xác minh runtime | Maintainer | Open; deferred |

Không conflict nào được “giải quyết” bằng việc tự chọn business rule trong Phase A.

## 8. Đánh giá C4-HDR-021 đến C4-HDR-032

### 8.1. Nguyên tắc phân loại

- `BLOCKING CHAPTER 5 DESIGN`: không thể **finalize** một artifact database/API/
  security bắt buộc nếu chưa có quyết định; vẫn có thể làm current-state model
  và giữ abstract interface.
- `BLOCKING FUTURE IMPLEMENTATION`: Chapter 5 có thể ghi boundary/contract ở mức
  abstract, nhưng implementation production không an toàn nếu chưa chốt.
- `NON-BLOCKING / RETAINED`: không chặn milestone kiến trúc ưu tiên hoặc MVP scope
  đang xác nhận; tiếp tục giữ TBD cho tới khi scope thay đổi.

Không TBD nào chặn việc hoàn thành Phase A. Các mục `BLOCKING CHAPTER 5 DESIGN`
chỉ chặn **final detailed design/close-out**, không chặn Phase B milestone về
current-state architecture.

### 8.2. Assessment matrix

| ID | Nội dung chưa xác nhận / căn cứ | Ảnh hưởng Chapter 5 và artifact bị chặn | Có thể giữ abstract? | Phân loại | Có thể trì hoãn? |
| --- | --- | --- | --- | --- | --- |
| C4-HDR-021 | Dữ liệu tối thiểu/hợp lệ; US-01/02/05/06, AC thiếu dữ liệu | Chặn final input DTO, data contract và điều kiện gọi risk/recommendation | Có: dùng `projectContext/resourceContext` opaque + insufficient-data outcome | **BLOCKING CHAPTER 5 DESIGN** | Không qua detailed API/DB design; không chặn B1 |
| C4-HDR-022 | Biểu diễn risk, ngưỡng, freshness; US-01 | Chặn final risk response schema, persistence/freshness policy | Có: `riskEstimate` và `explanations` ở mức khái niệm | **BLOCKING CHAPTER 5 DESIGN** | Cần quyết định trước final risk contract/model |
| C4-HDR-023 | Eligibility/ranking/candidate fields/missing availability; US-02 | Chặn final recommendation input/output và validation | Có: ranked candidates + explanations + empty outcome | **BLOCKING CHAPTER 5 DESIGN** | Cần trước detailed recommendation design; thuật toán có thể sang Chapter 6 |
| C4-HDR-024 | Scenario/change structure và allocation constraints; US-03/04 | Chặn `AllocationScenario`, `ScenarioChange`, simulation request và validation | Có: scenario reference + invariant non-destructive | **BLOCKING CHAPTER 5 DESIGN** | Không qua detailed simulation DB/API design |
| C4-HDR-025 | Impact metrics/baseline/scope; US-03 | Chặn `SimulationImpact` fields và response semantics | Có: expected impact attached to exact scenario | **BLOCKING CHAPTER 5 DESIGN** | Cần trước final simulation output; formula sang Chapter 6 |
| C4-HDR-026 | Accept precondition/apply timing; US-04 | Chặn decision/apply boundary, state model và apply contract | Có: Accept/Reject command tách khỏi apply result | **BLOCKING CHAPTER 5 DESIGN** | Apply endpoint tiếp tục bị chặn |
| C4-HDR-027 | Failure/retry/partial failure/recovery; US-01–04 | Chi tiết error model/recovery chưa thể finalize | Có: generic failure boundary + invariant không báo success sai | **BLOCKING FUTURE IMPLEMENTATION** | Có; phải chốt trước retry/rollback/apply code |
| C4-HDR-028 | Stale scenario/result và duplicate decision; US-03/04 | Chặn freshness/version/idempotency contract của simulation/decision | Có một phần: result luôn gắn scenario; không đoán validity | **BLOCKING CHAPTER 5 DESIGN** | Không qua final decision API/state design |
| C4-HDR-029 | PM rời flow: save/cancel/expiry/navigation; US-03/04 | Không chặn baseline nếu giữ nguyên “không Accept thì không apply” | Có; không thêm lifecycle state | **NON-BLOCKING / RETAINED** | Có, tới khi có requirement/history scope |
| C4-HDR-030 | Label/model/metric/matching/dataset; không AC thuật toán | Không chặn component boundary; chặn AI/model implementation/evaluation | Có: replaceable AI capability interface | **BLOCKING FUTURE IMPLEMENTATION** | Có, sang AI design/Chapter 6 trước khi model work |
| C4-HDR-031 | User Account ↔ Employee, Auth, role, RBAC; US-05–07 | Chặn final security/identity/data-access architecture | Có cho current state: “absent”; không thể giả access control | **BLOCKING CHAPTER 5 DESIGN** | Không qua security close-out/implementation; không chặn B1 |
| C4-HDR-032 | DEV write/simulation actions; US-06 | Không chặn vì scope hiện hành chỉ xác nhận DEV xem | Có: read-only boundary, không có write endpoints | **NON-BLOCKING / RETAINED** | Có; chỉ mở lại khi Product Owner mở rộng scope |

### 8.3. Quyết định con người cần đưa ra và rủi ro nếu tự giả định

| ID | Quyết định thuộc về con người | Decision owner đề xuất | Rủi ro nếu AI/nhóm tự giả định |
| --- | --- | --- | --- |
| 021 | Dataset/trường tối thiểu, validity, owner dữ liệu | Product Owner + BA + data owner | Dữ liệu thiếu bị coi hợp lệ; API/schema khóa sai phạm vi |
| 022 | Risk representation, threshold nếu có, freshness | Product Owner + AI/data reviewer | Điểm/mức rủi ro giả tạo, kết quả cũ bị trình bày như mới |
| 023 | Eligibility, exclusions, ranking semantics, empty/missing-data behavior | Product Owner + HR/domain reviewer + AI reviewer | Xếp hạng thiên lệch; coi thiếu availability là available |
| 024 | Scenario content, allocation unit/time/constraints | Product Owner + PM/HR domain reviewer | Candidate bị biến thành allocation; simulation ghi sai dữ liệu thật |
| 025 | Impact dimensions, baseline, scale | Product Owner + PM/domain reviewer + AI reviewer | Chỉ số lợi ích không có căn cứ, so sánh sai baseline |
| 026 | Accept precondition và apply trigger/timing | Product Owner + PM representative + Architect | Accept bị báo như apply thành công; phá bất biến quyết định |
| 027 | Retry, timeout, partial failure, recovery/rollback | Product Owner + Architect | Double action, partial apply, thông báo thành công sai |
| 028 | Version/freshness/idempotency policy | Product Owner + Architect | Quyết định lặp, dùng kết quả stale hoặc sai scenario |
| 029 | Save/cancel/expiry/no-decision lifecycle | Product Owner/PM representative | Tự thêm trạng thái/history không được yêu cầu |
| 030 | Labels, metrics, model family, dataset policy | Product Owner + AI lead/data owner | Model không đánh giá được, leakage/bias, demo bị gọi là thật |
| 031 | Identity source, mapping, auth mechanism, permissions | Product Owner + Architect/security reviewer | Lộ dữ liệu, role spoofing, đồng nhất Employee với account |
| 032 | DEV write/simulation capability | Product Owner + DEV representative | Mở quyền ghi ngoài phạm vi, xung đột quyền PM/HR |

## 9. Blocking và non-blocking summary

### Chặn việc finalize Chapter 5 design

- C4-HDR-021–026, C4-HDR-028 và C4-HDR-031.
- C5-GAP-011 và C5-GAP-012.
- Các mục này không cần được đoán để làm current-state component/UML baseline.

### Chặn future implementation, không chặn architecture baseline

- C4-HDR-027 và C4-HDR-030.
- Frontend -> Backend, Backend -> AI và persistence runtime chưa được xác minh.

### Có thể tiếp tục giữ lại

- C4-HDR-029 và C4-HDR-032.
- Screen-reader testing của Chapter 4 vẫn `NOT RUN` và không thuộc Phase A.

## 10. Khuyến nghị

1. Ưu tiên reconcile current-state architecture trước khi thiết kế thêm contract.
2. Giữ một view rõ cho **implemented now** và một view riêng cho
   **target/proposed**; không trộn nét liền và capability chưa tồn tại.
3. Bổ sung minimal UML có ích: component diagram trước, sau đó sequence/physical
   ERD theo quyết định được duyệt.
4. Ghi pattern dựa trên source và trade-off; không thêm pattern/infrastructure
   chỉ để hoàn thành checklist.
5. Mở retained TBD theo nhóm quyết định có owner; không mở tất cả cùng lúc.
6. Không bắt đầu core endpoint, migration mới, Auth/RBAC hoặc AI model trong
   Phase B milestone ưu tiên được đề xuất.

