# Đặc tả — PM Decision Workflow

**Nhánh** `codex/003-pm-decision-workflow` · **Ngày** 2026-11-26

**Baseline** `cd9d810838dee350d862a0d2c324f30dedeabef1` · PR #22, #23, #24 · Constitution 1.0.0

**Trạng thái** D1–D3 đã phê duyệt · Đặc tả Gate 2

## Mục tiêu và căn cứ

PM có thể Chấp nhận (Accept) hoặc Từ chối (Reject) đúng phương án sau một lượt What-if thành công, lưu quyết định và xem lại bằng danh tính xác thực. Accept ghi nhận lựa chọn của PM để có thể xem xét áp dụng ở mốc khác. Cả Accept lẫn Reject đều giữ nguyên availability và phân bổ thật.

| Nguồn | Quy tắc và hiện trạng |
| --- | --- |
| [PRD](../../chapter-03-ai-for-requirements-product-analysis/docs/PRD.md#phạm-vi-mvp), [US-04](../../chapter-03-ai-for-requirements-product-analysis/docs/user-stories.md#us-04--quyết-định-áp-dụng-hoặc-từ-chối-phương-án), [AC-US-04](../../chapter-03-ai-for-requirements-product-analysis/docs/acceptance-criteria.md#ac-us-04--quyết-định-áp-dụng-hoặc-từ-chối-phương-án) | **CONFIRMED** PM chủ động chọn một trong hai kết quả. AC-US-04-02 xác nhận lý do Reject không bắt buộc. D1–D3 chốt độ mới, gửi lặp, vòng đời quyết định và quyền xem cho 003. Phần áp dụng của AC-US-04-01 thuộc mốc riêng. |
| [Initial API Contracts §9](../../chapter-03-ai-for-requirements-product-analysis/docs/initial-api-contracts.md#9-hợp-đồng-quyết-định-và-áp-dụng-của-pm), [Database Design §10.5](../../chapter-03-ai-for-requirements-product-analysis/docs/database-design.md#105-pmdecision-và-applicationresult), [Constitution](../../.specify/memory/constitution.md) | Thiết kế cũ tách PMDecision khỏi ApplicationResult và để mở việc lưu. Đầu bài 003 chốt lưu và truy vết quyết định, lấy danh tính từ Auth 002 và yêu cầu What-if thành công trước cả hai lựa chọn. Điều kiện áp dụng của TBD-06 và lỗi áp dụng thuộc TBD-07 ở mốc sau. |
| [Thiết kế UI](../../chapter-04-ai-for-product-design/docs/what-if-simulation-ui-design.md#9-quyết-định-của-pm--chấp-nhận--từ-chối), [C4-HDR-012](../../chapter-04-ai-for-product-design/docs/human-review-decision-register.md#c4-hdr-012--điều-khiển-accept--reject), [Chapter 5](../../chapter-05-ai-for-software-design-architecture/README.md) | **PROPOSED UI** đã duyệt hai hành động và thông điệp tách khỏi kết quả áp dụng. [WhatIfSimulationView](../../frontend/src/resource-recommendation/WhatIfSimulationView.tsx) giữ quyết định trong state React của prototype. [What-if thật](../../frontend/src/projects/ProjectWhatIfSimulation.tsx) kết thúc ở tác động giả định. |
| [What-if 001 spec](../001-what-if-simulation/spec.md), [contract](../001-what-if-simulation/contracts/what-if-api.md), [mã nguồn mô phỏng](../../backend/src/projects/project-simulation.service.ts), [proof và tham chiếu](../../backend/src/projects/recommendation-context.ts) | **PROPOSED DEMO** chỉ đọc. `recommendationContext` xác minh ngữ cảnh ứng viên, `runId` do client cấp để đối chiếu lượt, `scenarioReference` là hash của các tham số phương án. Backend trả snapshot và impact đã tính. Ba tham chiếu hiện có không xác thực được một kết quả mô phỏng thành công để quyết định. |
| [Auth 002 spec](../002-auth-rbac/spec.md), [ma trận route](../002-auth-rbac/contracts/auth-rbac-api.md#ma-trận-endpoint), [controller](../../backend/src/projects/projects.controller.ts), [ownership](../../backend/src/projects/projects.service.ts), [session Frontend](../../frontend/src/auth/session.ts) | **Theo mã nguồn** Backend xác minh phiên, role PM và PM phụ trách Project trước What-if. 003 dùng cùng phạm vi cho ghi và đọc quyết định. Project cũ chưa ánh xạ tiếp tục bị từ chối. |

**Ngoài phạm vi** Apply Allocation, ProjectAllocation vận hành, giao việc, huấn luyện AI, tối ưu nguồn lực, email, thiết kế lại dashboard và mở rộng Auth/RBAC.

## Clarifications

### Session 2026-11-26

Nguồn phê duyệt tại [quyết định 003 trong User Stories](../../chapter-03-ai-for-requirements-product-analysis/docs/user-stories.md#quyết-định-pm-decision-workflow-cho-milestone-003-2026-11-26).

- Q: Kết quả What-if còn hiệu lực khi nào? → A: D1 APPROVED. Kiểm quyền Project hiện tại. Với quyết định mới, đối chiếu availability đúng tuần và liên kết Skill theo giá trị hiện hành. Khi dữ liệu khác hoặc không còn đủ điều kiện, yêu cầu mô phỏng lại và giữ nguyên snapshot cũ.
- Q: Một quyết định có thể sửa hoặc gửi lại thế nào? → A: D2 APPROVED. Tối đa một bản ghi bất biến ACCEPT hoặc REJECT cho mỗi lượt. Không sửa, xóa, đảo ngược hoặc thay thế. Sau Auth/ownership, xử lý bản ghi đã tồn tại trước bước freshness của lần ghi mới. Lựa chọn trùng trả bản ghi cũ, lựa chọn đối nghịch báo xung đột. Đồng thời không tạo bản ghi thứ hai.
- Q: Ai xem được lịch sử và dữ liệu được lưu gồm những gì? → A: D3 APPROVED. PM hiện phụ trách xem toàn bộ quyết định trong Project, giữ định danh người quyết định ban đầu. HR, DEV và PM ngoài phạm vi bị từ chối. 003 không thu thập lý do cho ACCEPT hoặc REJECT theo phê duyệt riêng, giữ căn cứ AC-US-04-02.

## User Scenarios & Testing

### US1 — PM quyết định sau What-if thành công (P1)

Từ kết quả thật của Project mình phụ trách, PM xem phương án, tác động, chọn Accept hoặc Reject, rồi thấy kết quả đã lưu sau khi Backend xác nhận. Truy vết US-03/04, AC-US-03-01/02 và AC-US-04-01/02/03, C4-HDR-012. Nghiệm thu riêng bằng hai lượt thành công trên Project hợp lệ, một lượt cho mỗi lựa chọn.

| AC | Điều kiện → thao tác → kết quả |
| --- | --- |
| AC-001 | PM có kết quả hợp lệ của mình → chọn Accept → lưu và trả đúng lựa chọn, PM, thời điểm, Project, phương án, snapshot và tác động gốc. |
| AC-002 | PM có kết quả hợp lệ của mình → chọn Reject mà không nhập lý do → lưu và trả Reject cho đúng kết quả. |
| AC-003 | What-if thành công nhưng PM rời luồng → tải lại Project → không có quyết định phát sinh. Với Accept và Reject, đối chiếu trước/sau cho thấy availability và phân bổ thật giữ nguyên. |
| AC-004 | Đang gửi quyết định → Backend lưu thành công hoặc trả lỗi → UI hiện tiến trình rồi hiện kết quả đã lưu hoặc lỗi. Mất phản hồi thì giữ lượt và lựa chọn để thử lại thủ công. |
| AC-005 | PM đổi đầu vào, mở Project khác hoặc nhận phản hồi của lượt đã bị thay → UI vô hiệu hóa kết quả cũ cho quyết định mới và không hiển thị phản hồi đó trong ngữ cảnh mới. |

### US2 — Backend kiểm quyền, nguồn gốc và độ mới của kết quả (P1)

PM chỉ có thể quyết định kết quả hợp lệ do hệ thống tạo cho mình. Truy vết US-03/04/07, AC-US-03-01/05, AC-US-04-04/05 và Auth 002 D2. Nghiệm thu riêng bằng hai PM, HR, DEV và một lượt What-if với dữ liệu nguồn thay đổi.

| AC | Điều kiện → thao tác → kết quả |
| --- | --- |
| AC-006 | Thiếu phiên, phiên hết hạn, sai role, sai Project hoặc Project chưa ánh xạ → gọi thẳng bề mặt đọc/ghi → nhận `401` khi phiên sai hoặc `403` khi thiếu quyền trên Project đã xác định. Không đọc hoặc ghi quyết định ngoài phạm vi. |
| AC-007 | PM có proof ứng viên hợp lệ nhưng chưa chạy What-if thành công, hoặc đưa `runId`/`scenarioReference` hiện có thay cho xác nhận thành công → gửi quyết định → Backend từ chối, không tạo bản ghi. |
| AC-008 | Client sửa snapshot/impact, tự khai accountId/role hoặc đổi tham chiếu sang kết quả của PM hay Project khác → gửi quyết định → từ chối tham chiếu không hợp lệ hoặc ngoài quyền. Bản ghi chỉ dùng danh tính, thời điểm, snapshot và tác động từ Backend. |
| AC-009 | Availability đúng tuần hoặc liên kết Skill không còn khớp hay không đủ điều kiện → gửi quyết định mới → Backend từ chối, giữ snapshot gốc và UI hướng dẫn mô phỏng lại. Nếu dữ liệu từng đổi nhưng giá trị hiện hành vẫn khớp và đủ điều kiện, lượt vẫn được xét. |
| AC-010 | PM đã qua Auth/ownership → gửi lại hoặc gửi đồng thời cho cùng lượt → tối đa một bản ghi. Lựa chọn trùng trả bản ghi đã lưu kể cả sau mất phản hồi và availability thay đổi. Lựa chọn đối nghịch báo xung đột. Lỗi trước commit không để bản ghi một phần. |
| AC-011 | Phiên hết hạn khi gửi hoặc phản hồi đến sau logout/đổi Project → UI xử lý `401` theo Auth 002, bỏ phản hồi ngoài ngữ cảnh và không tự gửi lại thao tác ghi. |

### US3 — PM xem lại quyết định đã lưu (P2)

PM mở Project được cấp quyền để xem lại quyết định và phương án gốc. Nghiệm thu riêng bằng hai Project độc lập, một quyết định đã lưu và một Project chưa có quyết định.

| AC | Điều kiện → thao tác → kết quả |
| --- | --- |
| AC-012 | Project có quyết định đã lưu, kể cả của PM trước → PM hiện phụ trách tải lại và mở lịch sử → hiển thị kết quả, người quyết định ban đầu, thời điểm và đúng snapshot. Availability thay đổi sau đó không viết lại lịch sử. |
| AC-013 | Project được phép chưa có quyết định hoặc truy xuất lỗi → mở vùng quyết định → hiển thị trạng thái rỗng hoặc lỗi kèm thử lại tương ứng. |
| AC-014 | PM đổi ID quyết định hoặc Project trên request, hoặc HR/DEV gọi API đọc → phạm vi Auth 002 được kiểm ở Backend. Phiên hợp lệ ngoài quyền không thấy bản ghi hoặc snapshot. |

### Edge Cases

- Quyết định đã lưu và thông tin hiện hành có thể khác nhau. Lịch sử hiển thị tác động tại thời điểm mô phỏng.
- Nếu request ghi timeout sau khi Backend có thể đã commit, UI không xác nhận thành công hoặc thất bại vĩnh viễn chỉ dựa trên timeout. Đọc lại hoặc thử lại theo D2.
- Thiếu dữ liệu, What-if lỗi, tác động chưa đến hoặc kết quả cũ không mở hành động quyết định. Giữ nguyên timeout, retry và kiểm revision/runId của 001 cùng session guard của 002.

## Requirements

### Functional Requirements

| ID | Yêu cầu | Nghiệm thu |
| --- | --- | --- |
| FR-001 | Chỉ PM đã xác thực và được giao Project mới có quyền ghi hoặc xem theo D3. Kiểm cả quyền Project, định danh bản ghi và nguồn của kết quả ở Backend. | AC-006/008/014 |
| FR-002 | Chỉ xét Accept/Reject sau lượt What-if thành công do Backend xác minh, gắn đúng PM, Project, phương án và snapshot/impact. Proof ứng viên, định danh lượt và hash phương án hiện có không đủ điều kiện. | AC-005/007/008 |
| FR-003 | Kiểm độ mới tại Backend trước khi ghi quyết định mới theo D1. Kết quả không hợp lệ bị từ chối, không tự chạy lại hoặc thay snapshot cho PM. | AC-005/009 |
| FR-004 | Lưu bền vững ACCEPT hoặc REJECT, người quyết định, thời điểm và snapshot/impact có thể truy vết. 003 không thu thập lý do. | AC-001/002/008/012 |
| FR-005 | Mỗi lượt có tối đa một quyết định bất biến. Sau Auth/ownership, xử lý bản ghi đã tồn tại trước kiểm freshness. Lặp cùng lựa chọn trả bản ghi, lựa chọn đối nghịch báo xung đột và lỗi ghi không để dữ liệu một phần. | AC-004/010 |
| FR-006 | Giao diện nối từ What-if thật, có Accept/Reject và trạng thái đang lưu, đã lưu, lỗi, thử lại, không hợp lệ cùng xử lý phiên/ngữ cảnh cũ. | AC-004/005/011 |
| FR-007 | Xem lại quyết định đã lưu sau reload theo D3, kèm trạng thái rỗng/lỗi và kiểm truy cập trực tiếp. | AC-012/013/014 |
| FR-008 | Quyết định và What-if chỉ phục vụ xem xét. Accept, Reject và không quyết định đều giữ nguyên availability và phân bổ thật. | AC-003 |
| FR-009 | Duy trì nghiệp vụ What-if 001 và Auth 002, bao gồm timeout/retry, kiểm revision/runId, session guard và phạm vi Project. | AC-005/006/007/011 |

### Key Entities

- **Kết quả What-if đủ điều kiện** — bằng chứng do Backend xác nhận đã tính thành công, liên kết PM đã chạy, Project, phương án, dữ liệu đầu vào, giờ trống và tác động đã trả về.
- **PMDecision** — bản ghi bất biến gồm Project, PM ban đầu, thời điểm, ACCEPT hoặc REJECT và liên kết tới đúng snapshot đã xem, duy nhất theo lượt. Lịch sử theo Project và quyền hiện hành.
- **Project và Account** — dùng quan hệ PM phụ trách của Auth 002. Quyền hiện tại được kiểm lại khi ghi và đọc.

## Success Criteria

### Measurable Outcomes

- **SC-001** — Cả hai lựa chọn được lưu và xem lại đúng giá trị sau reload. Toàn bộ ca Accept, Reject và thiếu quyết định giữ nguyên dữ liệu nguồn lực.
- **SC-002** — Toàn bộ ca thiếu phiên, sai role, sai Project, sai PM, dữ liệu giả mạo, proof chưa mô phỏng và kết quả không đủ điều kiện bị từ chối, không ghi quyết định ngoài quyền.
- **SC-003** — Toàn bộ ca lỗi lưu, retry, gửi lặp và gửi đồng thời cho kết quả theo D2. Không có kết quả giả thành công trên UI hoặc dữ liệu một phần.
- **SC-004** — Bảo toàn 167 ca hồi quy baseline. Khi triển khai, ghi riêng kết quả unit, HTTP E2E với test double và Chrome/MariaDB clone. Đối chiếu tám bảng nghiệp vụ/Auth có sẵn khi nghiệm thu migration.

## Assumptions

Luồng dùng màn What-if hiện có. Backend phải xác minh nguồn kết quả,
danh tính và quyền khi nhận quyết định. Plan chốt cách chứng minh kết quả,
lược đồ, API và biên giao dịch. Migration cộng thêm và nghiệm thu trên clone
là ràng buộc của mốc triển khai.

Bằng chứng hiện trạng lấy từ tài liệu và mã nguồn trên baseline. Số 167 là
kết quả lịch sử ghi tại [Chapter 8](../../chapter-08-ai-software-testing/README.md#kiểm-chứng-authentication--rbac-002-2026-11-26). Lượt đặc tả chỉ kiểm tài liệu; chưa chạy test, ứng dụng hay migration.
