# Implementation Plan — PM Decision Workflow

**Nhánh** `codex/003-pm-decision-workflow` · **Baseline** `cd9d810838dee350d862a0d2c324f30dedeabef1`

**Ngày** 2026-11-26 · [Spec](spec.md) · [Research](research.md) · [Data Model](data-model.md) · [API](contracts/pm-decision-api.md) · [Quickstart](quickstart.md)

## Summary

Giữ What-if chỉ đọc. Backend cấp token ký chứa kết quả sau mô phỏng thành công.
Một bảng PMDecision lưu snapshot/impact đã xác minh và giới hạn một quyết
định mỗi lượt. Retry hợp lệ lấy bản ghi cũ sau kiểm quyền, trước kiểm dữ liệu
nguồn. PM đang phụ trách đọc lịch sử theo Project. Không thay đổi phân bổ.

## Technical Context

Node 24 `node:crypto`, NestJS, TypeORM/mysql2, MariaDB InnoDB và React/Vite
như baseline. Tái dùng Auth 002 và phép tính What-if 001, không thêm dependency.
MVP dùng một ghi giao dịch ngắn theo Project và phân trang lịch sử. Không đổi
FastAPI hay ba chỉ báo What-if. Kiểm 167 test baseline, unit mới, HTTP E2E với
test double và Chrome/NestJS/MariaDB clone.

## Constitution Check

| Nguyên tắc | Đối chiếu trước research và sau thiết kế |
| --- | --- |
| I–II, X | D1–D3 đã được duyệt trong nguồn. Giữ mốc ở ghi quyết định, phạm vi Project và lịch sử. Apply Allocation ở mốc riêng. |
| III–V, IX | Response What-if tương thích theo trường bổ sung tùy chọn. Auth giữ nguyên guard và policy. Snapshot giữ chỉ báo demo, schema bổ sung bảo toàn tám bảng, không thêm dependency. |
| VI–VIII, XI | FR/AC/AT/SC truy vết trong ma trận. Có ca Auth/ownership, sửa bằng chứng, khóa đồng thời, rollback, mất phản hồi, lỗi guard và dữ liệu nguồn giữ nguyên. Giữ assertion hồi quy. |
| XII–XIV | Chapter theo dõi hồ sơ Gate 2. Bằng chứng lượt này chỉ gồm thiết kế/kiểm tài liệu, dừng trước triển khai và thao tác Git ghi lịch sử. |

## Project Structure

- `backend/src/projects/decision-context.ts` phát/xác minh token. `project-simulation.service.ts`, `dto/resource-simulation.dto.ts` và `projects.controller.ts` nối kết quả với principal hiện có.
- `backend/src/projects/decisions/` gồm `pm-decision.entity.ts`, `project-decisions.service.ts`, `project-decisions.controller.ts` và DTO. Đăng ký trong `projects.module.ts` và database config/migration. Mở rộng `projects.service.ts` cho ownership với transaction manager. Đọc Employee/EmployeeSkill qua repository của transaction hiện hành.
- `frontend/src/projects/` giữ `simulationRun.ts` và `ProjectWhatIfSimulation.tsx`, nối `ProjectDecisionControls.tsx`, `decisionRequest.ts` và `ProjectDecisionHistory.tsx` vào `ProjectDetailView.tsx`. Mượn bố cục Accept/Reject của mock. Dùng API client/session 002.
- Test trong `backend/src/projects/`, `backend/test/`, `frontend/test/`. Minh chứng runtime ở Chapter 8.

## Xác minh và vòng đời

Backend cấp bằng chứng sau khi guard, ownership, proof ứng viên và phép tính
001 đều đạt. Dùng một UUID v4 server mới, token HMAC có miền và khóa riêng.
Giữ `runId` để đối chiếu phản hồi Frontend. `scenarioReference` là định danh
tham số giữ tương thích 001. Không dùng hai giá trị đó để xác thực kết quả.
Nếu thiếu khóa, What-if 001 vẫn trả kết quả, UI 003 không mở quyết định mới.

Khóa ngoài Git giữ ổn định qua restart. Chỉ lưu digest của nguyên token
tại lần ghi đầu tiên. Sau guard và kiểm PM/Project, token trùng digest chứng
minh đúng bằng chứng đã được Backend chấp nhận, kể cả khi khóa đã thay.
Lịch sử không xuất chứng từ này. Đổi khóa làm lượt chưa ghi dùng khóa cũ
cần mô phỏng lại. [Hợp đồng kỹ thuật](contracts/pm-decision-api.md#what-if-thành-công)

## Biên transaction và concurrent request

**POST, sau guard Auth 002, Origin và DTO.** Một transaction InnoDB
`READ COMMITTED`, dùng riêng manager của giao dịch. Thứ tự lấy khóa không
thay đổi cho đường ghi và hòa giải duplicate.

1. Khóa chia sẻ Account theo PK, kiểm PM active, sau đó khóa Project theo PK bằng `FOR UPDATE`. Kiểm `pmAccountId` hiện tại. Khóa Account trước Project để tương thích thứ tự map Project của Auth 002 và tránh nghịch thứ tự khi kiểm FK lúc INSERT. Account đã thu hồi trả 401. Project ngoài quyền trả 403.
2. Đọc PMDecision theo Project và simulationId trước freshness. Nếu có, kiểm PM gốc và so digest token, cùng lựa chọn trả 200, đối nghịch trả 409. Mọi lookup theo scope, không trả thông tin về bản ghi hoặc chủ thể ngoài quyền.
3. Nếu chưa có, xác minh token và khớp principal, Project, simulationId. Khóa Employee theo PK, rồi EmployeeSkill theo PK ghép bằng `FOR UPDATE`. So sánh availability đúng tuần và giờ trống với snapshot, kỹ năng còn liên kết, ứng viên còn đủ điều kiện theo 001. FK của liên kết bảo vệ Skill trong lúc giữ khóa. Dữ liệu thiếu, khác hoặc không đủ trả 409 và rollback. Không cần khóa khoảng trống khi hàng thiếu vì lần ghi bị từ chối.
4. INSERT một PMDecision với snapshot và impact gốc, mã quyết định rõ và giờ Backend xác định. Giữ khóa đến commit. `UNIQUE(simulationId)` độc lập với khóa dự án. Chỉ trả 201 sau commit. Không upsert.
5. Nếu MariaDB báo duplicate `1062`, để transaction rollback hoàn toàn trước. Mở transaction mới, kiểm lại Account/Project rồi tra bản ghi đúng scope để phân loại 200/409 như bước 2. Thiếu bản ghi đủ điều kiện trả lỗi chung 503, không tra toàn cục. Lỗi ghi khác, deadlock hoặc lock timeout rollback toàn giao dịch trước khi trả 503. Retry chỉ theo hành động người dùng.

**GET.** Trong transaction `READ COMMITTED`, giữ khóa chia sẻ Account rồi
Project trong lúc kiểm owner và đọc trang lịch sử. Dùng `LOCK IN SHARE MODE`
trên MariaDB qua TypeORM. Giao dịch không ghi và vẫn dùng chế độ truy cập
mặc định để hỗ trợ khóa hàng. Trả sau khi kết thúc giao dịch. Scope đọc
theo PM hiện hành, bản ghi giữ PM gốc. [Căn cứ về lock](research.md)

## Frontend và chuyển tiếp

Giữ timeout What-if, scope phiên, abort và revision khi đổi input/Project.
Chỉ cho gửi Accept/Reject nếu kết quả thành công hiện hành có bằng chứng.
Khi pending khóa hai lựa chọn. Giữ bộ request khi timeout/mất response để
retry đúng lựa chọn, chưa đổi thành công trước xác nhận Backend. 409 stale
yêu cầu mô phỏng lại. 409 conflict cho xem lịch sử. 401 theo Auth 002 và
không tự gửi lại ghi. 403 giữ phiên và báo quyền. Bỏ dữ liệu đến muộn sau
đổi Project/logout. Reload đọc lại lịch sử Project.

Migration cộng thêm sau `1791240000000`, dự kiến
`1791250000000-add-pm-decisions.ts`. Trước khi chạy trong lượt triển khai,
xác minh SELECT DATABASE(), backup/restore, InnoDB và kiểu/collation của
Project và UserAccount trên clone. Tạo bảng/FK/index, giữ nguyên tám bảng,
`synchronize=false` và `migrationsRun=false`. Chạy DDL ở chế độ `each`
với migration không bọc transaction, kiểm schema trước ghi lịch sử migration.
Nếu gián đoạn, giữ ingress có liên quan đóng rồi kiểm và hoàn tất DDL. Sau
khi có dữ liệu quyết định, ưu tiên sửa tiến và giữ bản ghi. Phục hồi backup
thử trên clone; database dev gốc không thuộc thao tác.

## Ma trận kiểm thử

| AT | AC | FR / SC | Bằng chứng dự kiến |
| --- | --- | --- | --- |
| AT-01 | AC-001 | FR-004, SC-001 | HTTP + Chrome/DB: ACCEPT trả 201, đúng dữ liệu ký và giờ server, lưu một bản ghi. |
| AT-02 | AC-002 | FR-004, SC-001 | HTTP + Chrome/DB: REJECT không lý do; DTO từ chối reason và field ngoài contract. |
| AT-03 | AC-003 | FR-008, SC-001 | HTTP + clone: không chọn thì không ghi, ACCEPT/REJECT giữ availability, liên kết Skill và phân bổ. |
| AT-04 | AC-004 | FR-005, FR-006, SC-003 | Unit Frontend + Chrome: pending, timeout, giữ lựa chọn, retry thủ công, success chỉ sau server xác nhận. |
| AT-05 | AC-005 | FR-002, FR-003, FR-006, FR-009, SC-004 | Unit Frontend: thay input/Project, stale, giữ runId/revision, bỏ kết quả đến muộn. |
| AT-06 | AC-006 | FR-001, FR-009, SC-002 | HTTP guard thật + runtime: 401 hết hạn, 403 HR/DEV/PM ngoài scope/Project chưa ánh xạ và reject Origin. |
| AT-07 | AC-007 | FR-002, FR-009, SC-002 | Unit + HTTP: proof ứng viên, runId client, hash phương án hay What-if thất bại không cấp quyền. |
| AT-08 | AC-008 | FR-001, FR-002, FR-004, SC-002 | Unit + HTTP: tamper payload/MAC/UUID, snapshot/impact tự khai, PM khác hoặc Project khác; không insert. |
| AT-09 | AC-009 | FR-003, SC-002 | HTTP + clone: giờ, tuần hoặc liên kết Skill đổi bị chặn; giá trị đổi rồi khôi phục vẫn khớp D1. |
| AT-10 | AC-010 | FR-005, SC-003 | HTTP + clone: hai request cùng lựa chọn và hai request đối nghịch; một hàng 201, còn lại 200/409. Kiểm duplicate fallback. |
| AT-11 | AC-011 | FR-006, FR-009, SC-002 | Unit Frontend + Chrome: hết phiên, logout và đổi Project khi đang gửi, bỏ phản hồi cũ, không tự gửi lại ghi. |
| AT-12 | AC-012 | FR-004, FR-007, SC-001 | Chrome + DB: reload lịch sử, PM hiện tại xem quyết định cũ; giá trị hàng đã lưu giữ nguyên. |
| AT-13 | AC-013 | FR-007, SC-003 | HTTP + Frontend: phân trang/thứ tự, rỗng, lỗi truy xuất và retry. |
| AT-14 | AC-014 | FR-001, FR-007, SC-002 | HTTP + clone: đọc ID/Project ngoài quyền bị từ chối, một PM khác không thấy dữ liệu; test chuyển owner trên clone để chứng minh quyền hiện tại. |
| AT-15 | AC-010 | FR-005, FR-008, SC-003 | HTTP + clone: lỗi sau INSERT trước commit, rollback, nguồn lực giữ nguyên, retry cùng yêu cầu. |
| AT-16 | AC-004/007/010 | FR-002, FR-005, FR-006, FR-009, SC-003, SC-004 | Clone: mất response sau commit, đổi availability, restart và retry chính xác. Lượt mới vẫn xác minh sau restart cùng khóa; kiểm khóa thiếu và khóa thay. Chạy 167 regression và đối chiếu dữ liệu tám bảng khi nâng cấp. |

## Phases

Phase 0 [Research](research.md). Phase 1 [Data Model](data-model.md),
[API](contracts/pm-decision-api.md) và [Quickstart](quickstart.md).
Phase 2 tạo Tasks và phân tích chỉ đọc. Dừng tại Gate 2.

## Complexity Tracking

Không có ngoại lệ Constitution. Khóa phạm vi Project chọn để đơn giản hóa
tính nhất quán trong MVP. Chi phí/thứ tự lock cần đo trên MariaDB clone.
