# Implementation Plan — Apply Allocation 006

**Feature** `specs/006-apply-allocation` · **Baseline** `b5c5dde5c4f5f3996467bed23409c96fd9799f9d` · **Ngày** 2026-11-26

[Spec](spec.md) · [Research](research.md) · [Data Model](data-model.md) · [API](contracts/apply-allocation-api.md) · [Quickstart](quickstart.md)

## Summary

Áp dụng một ACCEPT hợp lệ bằng thao tác riêng của PM hiện phụ trách. Dùng
một nguồn giờ còn lại và khóa Employee cho các Project cạnh tranh. Xác nhận
ngữ nghĩa snapshot bằng evidence v2 ký ở Backend và provenance lưu nguyên
tử với quyết định. Ba bảng mới, giữ nguyên chín bảng 003.

## Technical Context

NestJS, TypeORM/mysql2, MariaDB InnoDB, Node crypto/BigInt, React/Vite theo
baseline. Không thêm dependency. Dùng ngày và tuần thứ Hai theo
`getAvailabilityWeek` (Asia/Ho_Chi_Minh), lấy giờ Backend tại lần kiểm ghi.
Hồi quy giữ ý nghĩa 188 test, thêm unit, HTTP E2E và runtime Chrome/MariaDB clone.

## Constitution Check

| Nguyên tắc | Trước và sau thiết kế |
| --- | --- |
| I–II, X | D1–D4 duyệt. Apply riêng sau ACCEPT. 004, 005, sửa/hủy phân bổ và giao Task ngoài phạm vi. |
| III–V, IX | Tương thích JSON numbers, proof, replay và ba chỉ báo 001/003. Bổ sung schema, giữ bảng cũ và stack hiện có. |
| VI–VIII, XI | Có ma trận nghiệm thu, rollback, cạnh tranh liên Project, sai scope, exact hours và hồi quy. Quỹ dùng dữ liệu thật, Auth 002 trước mọi đọc/ghi Project. |
| XII–XIV | Cập nhật nguồn và tiến độ. Giai đoạn này chỉ kiểm tài liệu. Di trú/nghiệm thu trên clone khi triển khai được duyệt. |

## Project Structure

- `backend/src/employees/remaining-availability.service.ts`, `backend/src/employees/decimal-hours.ts`, `employees.service.ts`, `employees.module.ts` cho quỹ giờ, truy vấn và HR.
- `backend/src/projects/project-hours.ts`, `decision-context.ts`, `recommendation-context.ts`, `project-simulation.service.ts`, `project-resource-recommendation.service.ts` và DTO hiện tại cho tương thích 001/006. `backend/src/projects/decisions/project-decisions.service.ts` và `decision-availability-evidence.entity.ts` cho provenance, freshness và metadata lịch sử.
- `backend/src/projects/allocations/` gồm `project-allocation.entity.ts`, `application-result.entity.ts`, `project-allocations.service.ts`, `project-allocations.controller.ts`, `dto/apply-allocation.dto.ts`, `dto/allocation-history.dto.ts`. Đăng ký trong `projects.module.ts`, `database.config.ts` và migration mới.
- `frontend/src/projects/` dùng `simulationRun.ts`, `ProjectWhatIfSimulation.tsx`, `ProjectResourceRecommendations.tsx`, `ProjectDecisionHistory.tsx`, `ProjectAllocationControls.tsx`, `ProjectAllocationHistory.tsx`, `allocationRequest.ts`. `frontend/src/employees/EmployeesView.tsx` dùng capacity mới.

## Phase 0 — Research

[Research](research.md) đối chiếu khóa, miền giờ, tương thích provenance và phục hồi. Không còn quyết định nghiệp vụ mở.

## Phase 1 — Design & Contracts

### Nguồn giờ dùng chung

`RemainingAvailabilityService` tính theo Employee/tuần trên mọi Project.
Reader dùng một statement nhất quán cho khai báo và allocation, batch theo
Employee cho HR và Recommendation. Caller đang giữ khóa Employee truyền
transaction manager, lấy tổng sau khi có khóa. Chỉ lấy hàng đã commit hoặc
các thay đổi của chính transaction. Không trả hàng đóng góp ngoài scope.

Chuẩn hóa DOUBLE qua decimal round-trip. Giữ số nguyên BigInt có scale, với
số mũ từ −324 đến 308 và độ dài input exact tối đa 672 ký tự. Check support
dương và không lớn hơn miền giá trị hữu hạn baseline. Lưu amount dương
canonical. Phép chiếu số 001 giữ dạng cũ, dùng exact cho phép tính, sắp xếp,
HMAC, hiển thị và kiểm freshness. Tổng âm hiển thị riêng, không ép về 0.
Thiếu/sai tuần thì remaining null, có thể vẫn có tổng đã áp dụng tuần đó.
Kiểm ca phân số, số mũ, ranh 0 và chênh lệch nhỏ hơn một ULP. Không đổi
cách chặn số giờ hỗ trợ vượt quỹ và vẫn giữ công thức ba chỉ báo 001.

### Snapshot và tương thích

Phát v2 sau successful What-if. Chữ ký gắn PM, Project, simulationId, các
giờ chính xác và ngữ nghĩa quỹ. Ghi provenance 1:1 cùng quyết định mới
từ v2. Không phân loại theo timestamp. Duy trì đọc lịch sử và replay 003
bằng digest có sẵn, nhận v1 theo [contract](contracts/apply-allocation-api.md).
Freshness 006 so giá trị còn lại exact thực sự dùng trong snapshot, kiểm
lại Employee/Skill/tuần, và giữ quy tắc giá trị hiện hành của 003. Snapshot
hậu 006 không tái sử dụng v1 cho Apply. Frontend đọc cả v1/v2, giữ kiểm
snapshot/runId, ràng exact với số chiếu và hiển thị ba chỉ báo exact khi có.

### Biên giao dịch và khóa

1. Guard Auth/role/Origin. Transaction InnoDB READ COMMITTED với một manager.
   Account chia sẻ qua MariaDB `LOCK IN SHARE MODE` → Project khóa ghi theo
   PK → kiểm Account active và quyền Project. Giữ thứ tự 002/003. Các GET
   dùng khóa chia sẻ Account → Project, kiểm scope và đọc trên primary.
2. Đọc decisionId trong Project. Tra phân bổ đã lưu trước provenance, tuần,
   quỹ giờ và freshness. Trả kết quả cũ, kể cả sau đổi PM hoặc hết tuần.
   Ghi mới chỉ với ACCEPT và provenance `remaining-v1`.
3. Khóa Employee theo PK `FOR UPDATE`, rồi hàng EmployeeSkill theo PK ghép.
   Khóa Employee là tín hiệu tuần tự hóa chung dù Project khác hoặc chưa
   có ledger. Giữ tới commit, không khóa Project cạnh tranh. Đọc lại
   quỹ của Employee/tuần **sau** khóa. Dùng cùng khóa Employee cho Apply,
   PM Decision mới và mọi writer quỹ giờ được phép. Chặn tuần qua, Skill
   mất, thiếu khai báo, âm, thiếu giờ và sai exact snapshot theo contract.
4. Thành công INSERT ProjectAllocation + ApplicationResult APPLIED và commit
   chung. UNIQUE(decisionId) là chốt DB độc lập. Với 409 đã xác định trong
   Project hợp lệ, không INSERT allocation, commit riêng nhánh FAILED với
   mã nghiệp vụ đã chốt rồi trả lỗi. Nếu chỉ việc ghi audit thất bại, rollback
   audit và giữ lỗi nghiệp vụ đã xác định.
5. Với duplicate 1062, rollback rồi mở giao dịch kiểm lại Account/Project
   và tra đúng scope trên primary. Trả 200 nếu thấy phân bổ. Không đoán lỗi
   duplicate là thành công nếu thiếu bản ghi. Với deadlock hoặc 1205 yêu cầu
   rollback cả giao dịch, 503 retryable khi xác nhận rollback. Nếu có thể đã
   commit, trả 503 unconfirmed, không ghi FAILED. GET đối chiếu và POST retry
   lấy lại khóa Project trước đọc. Phân bổ đã commit không có thao tác sửa,
   hủy hoặc hoàn tác trong 006.

### Migration và UI

Migration cộng thêm `1791260000000-add-apply-allocation.ts`, sau 003, ba bảng
theo Data Model. Xác minh engine, kiểu và collation FK, tên đích, index,
unique và check. Giữ `synchronize=false`, `migrationsRun=false`. Chạy migration
`each` trên clone, không bọc transaction DDL. Thử tiếp tục nếu DDL đã ghi
một phần, xác minh cấu trúc trước ghi lịch sử. Sau khi đã có phân bổ, recovery
theo hướng bảo toàn dữ liệu. So fingerprint theo PK của chín bảng, thực tập
restore clone. Lượt planning không chạy migration.

UI giữ ACCEPT gốc và thêm Apply, pending, APPLIED, lỗi đã xác nhận,
chưa xác nhận và đối chiếu/retry thủ công. Chỉ xác nhận APPLIED sau response
được kiểm phạm vi hoặc GET đối chiếu. Chặn gửi lặp khi pending, không tự gửi
lại sau login, bỏ phản hồi cũ sau đổi Project/phiên. HR hiển thị exact và
tình trạng, không thêm truy cập Project. Không mở rộng DEV.

## Ma trận kiểm thử

| AT | AC | FR/SC | Bằng chứng dự kiến |
| --- | --- | --- | --- |
| AT-01 | AC-001/002 | FR-001, FR-006, SC-001 | HTTP và clone: REJECT/thiếu ACCEPT không ghi. ACCEPT chỉ tiêu hao khi Apply commit, snapshot giữ nguyên. |
| AT-02 | AC-003 | FR-002, SC-001 | HTTP: Auth, Origin, PM khác Project, ID chéo, HR/DEV bị từ chối. |
| AT-03 | AC-004 | FR-003, FR-004, FR-008, SC-002 | Unit/HTTP/clone: Skill mất, tuần sai/tuần qua, giờ đổi, thiếu hoặc không đủ. Kiểm lịch Việt Nam. |
| AT-04 | AC-005 | FR-003, FR-004, SC-002 | Clone hai PM và hai Project, cùng Employee/tuần. Tổng yêu cầu vượt quỹ, một 201, một 409, tổng giữ giới hạn. |
| AT-05 | AC-006 | FR-002, FR-005, SC-002 | HTTP và clone: cùng decisionId đồng thời, 201/200 cùng ID, một allocation và một APPLIED. |
| AT-06 | AC-006/007 | FR-005, FR-006, SC-003 | Clone: mất response sau commit, đổi quỹ/tuần, restart, GET đối chiếu và POST replay đúng ID. |
| AT-07 | AC-007 | FR-005, FR-006, FR-007, SC-003 | HTTP và clone: lỗi giữa hai insert rollback. Mất kết nối ở commit không ghi FAILED giả. |
| AT-08 | AC-008 | FR-002, FR-006, FR-007, SC-003 | HTTP/Chrome: lịch sử phân trang, lỗi xác nhận, chủ thể gốc và PM Apply, không lộ qua đổi owner. |
| AT-09 | AC-009 | FR-002, FR-007, FR-008, SC-001 | HTTP/Chrome: HR chỉ tổng và trạng thái, DEV giữ 002, quyền Project không đổi. |
| AT-10 | AC-010 | FR-003, FR-004, FR-008, SC-002 | Unit/HTTP/clone: thiếu/0/âm, 0.3−0.1−0.2=0, số mũ, chênh lệch dưới ULP, mọi luồng cùng quỹ. |
| AT-11 | AC-011 | FR-001, FR-002, SC-001 | HTTP/clone: PM hiện tại Apply quyết định hợp lệ của PM trước, giữ hai danh tính. |
| AT-12 | AC-011 | FR-001, FR-008, SC-001, SC-004 | Unit/HTTP: legacy row và v1 trình sau rollout không Apply. v2 bị sửa bị từ chối, replay 003 giữ nguyên, provenance lỗi rollback quyết định. |
| AT-13 | AC-001/006/007 | FR-005, FR-006, SC-003 | Frontend unit và Chrome: pending, stale, thất bại, timeout, chưa xác nhận, đối chiếu, đổi Project/logout. |
| AT-14 | AC-005/007/010 | FR-004, FR-005, FR-008, SC-002, SC-004 | Clone: chín fingerprint không đổi khi migrate, DDL recovery, unique/FK/check, rollback và dữ liệu exact round-trip. |
| AT-15 | AC-002/006/010/011 | FR-001, FR-005, FR-008, SC-004 | 188 regression, build/lint, parity fields/HTTP 001/003. What-if và ACCEPT không tiêu hao giờ. |

## Phase 2 — Tasks

Phân rã theo US1–US3, truy vết AT và kiểm tài liệu chỉ đọc. Dừng Gate 2.

## Complexity Tracking

Không có ngoại lệ Constitution. Khóa Employee tuần tự hóa cả các tuần của
cùng nhân sự để tránh thêm bảng khóa. Theo dõi độ chờ khóa trên clone.
