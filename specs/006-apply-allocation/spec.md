# Feature Specification — Apply Allocation 006

**Mốc** 006 · **Ngày** 2026-11-26 · **Trạng thái** D1–D4 APPROVED

**Baseline** `b5c5dde5c4f5f3996467bed23409c96fd9799f9d`

## Clarifications

### Session 2026-11-26

- Q: Sau khi áp dụng phân bổ, RMS-AI tính giờ trống còn lại của nhân sự trong tuần thế nào? → A: D1 **APPROVED**. Giữ giờ khai báo của Employee. Giờ còn lại bằng giờ khai báo trừ tổng giờ của ProjectAllocation có hiệu lực cho cùng Employee và tuần trên mọi Project. ACCEPT chưa Apply không tính vào tổng. Kiểm và ghi trong cùng giao dịch, chặn vượt quỹ giờ. Không làm tròn hay ép 0 để che vượt mức. [Quyết định nguồn 006](../../chapter-03-ai-for-requirements-product-analysis/docs/user-stories.md#quyết-định-apply-allocation-cho-milestone-006-2026-11-26).

- Q: Ai có quyền Apply và khi nào quyết định đủ điều kiện? → A: D2 **APPROVED**. PM hiện phụ trách chủ động Apply ACCEPT, kể cả của PM trước. Chỉ dùng tuần hiện tại hoặc tương lai có khai báo đúng tuần. Backend kiểm Employee, Skill, Project, quỹ giờ và độ mới. Quyết định hoặc snapshot trước 006, dữ liệu đổi hoặc không đủ điều kiện đều cần What-if và ACCEPT lượt mới. Giữ nguyên lịch sử.
- Q: Retry và kết quả khi áp dụng lỗi được xử lý thế nào? → A: D3 **APPROVED**. Mỗi ACCEPT có tối đa một phân bổ. Yêu cầu đồng thời cùng quyết định chỉ ghi một lần. Sau Auth/ownership, xét phân bổ đã lưu trước freshness và quỹ giờ. Phản hồi đã mất được đối chiếu với bản ghi thành công. Giao dịch thất bại rollback toàn bộ. Lưu lỗi nghiệp vụ xác định được khi DB khả dụng. Khi chưa biết đã commit, báo chưa xác nhận và không ghi lỗi giả. Phân bổ đã commit là bất biến.
- Q: Ai xem thông tin gì sau khi áp dụng? → A: D4 **APPROVED**. PM hiện phụ trách xem lịch sử Project, giữ riêng người quyết định và người Apply. HR xem giờ khai báo, tổng phân bổ, giờ còn lại và trạng thái theo Employee/tuần. DEV giữ quyền Auth 002. Phân bổ cấp Project không cấp quyền chi tiết Project hoặc tạo giao việc Task.

## User Scenarios & Testing

### US1 — PM áp dụng phương án đã chấp nhận (P1)

PM muốn dùng đúng phương án đã chấp nhận để phân bổ giờ hỗ trợ vào Project mình phụ trách. Quyết định và kết quả ghi phân bổ vẫn có thể được xem riêng.

| AC | Điều kiện và kết quả |
| --- | --- |
| AC-001 | Nếu một phương án đủ điều kiện được áp dụng thành công, ghi đúng Project, Employee, Skill, tuần và số giờ của quyết định ACCEPT đã lưu. PM thấy APPLIED sau khi thay đổi thật hoàn tất. |
| AC-002 | Phương án bị REJECT, chưa có ACCEPT, hoặc chỉ có đề xuất hay What-if thì không phát sinh phân bổ. |
| AC-003 | PM có phiên nhưng không phụ trách Project, HR và DEV thử áp dụng thì bị từ chối. Phiên không hợp lệ phải xác thực lại. Quyết định thuộc Project khác không cấp quyền áp dụng. |
| AC-004 | Giờ khai báo thiếu hoặc khác tuần, giờ còn lại không đủ, hoặc quỹ giờ đã vượt mức thì không ghi phân bổ. Dữ liệu khác snapshot, liên kết Skill mất hoặc tuần đã qua thì từ chối và yêu cầu What-if và ACCEPT lượt mới. |
| AC-011 | Quyết định hoặc bằng chứng mô phỏng trước 006 bị loại khỏi Apply dù thời điểm ghi quyết định hoặc cờ client có vẻ mới. PM hiện phụ trách được Apply ACCEPT hợp lệ của PM trước, giữ riêng hai danh tính. |

### US2 — Áp dụng đồng thời và phục hồi sau lỗi (P1)

PM cần biết yêu cầu đã tạo phân bổ hay chưa khi nhiều Project dùng cùng một nguồn giờ, request bị gửi lặp hoặc bị mất phản hồi.

| AC | Điều kiện và kết quả |
| --- | --- |
| AC-005 | Employee khai báo 8 giờ, đã phân bổ có hiệu lực 3 giờ ở Project khác. Hai Project đồng thời xin 4 giờ mỗi bên. Chỉ tối đa một yêu cầu được ghi. Giờ khai báo vẫn là 8, tổng phân bổ tối đa 7 và giờ còn lại tối thiểu 1. ACCEPT chưa Apply không tiêu hao thêm giờ. |
| AC-006 | Gửi lặp cùng yêu cầu, kể cả đồng thời hoặc sau mất phản hồi, không tiêu hao giờ thêm cho cùng lần áp dụng. Phải kiểm quyền trên mọi lượt gửi. |
| AC-007 | Nếu áp dụng thất bại, PM thấy kết quả thất bại và quyết định ACCEPT gốc còn truy vết. Rollback toàn bộ. Lỗi nghiệp vụ xác nhận được lưu khi DB khả dụng. Lượt chưa biết commit hay rollback hiển thị chưa xác nhận và không có bản ghi lỗi giả. |

### US3 — Xem lịch sử và ngữ cảnh đúng quyền (P2)

Người được cấp quyền cần phân biệt quyết định và kết quả áp dụng, đối chiếu thay đổi thật với phương án đã duyệt.

| AC | Điều kiện và kết quả |
| --- | --- |
| AC-008 | PM hiện phụ trách xem được lịch sử quyết định của Project theo 003. Lịch sử áp dụng phải phân biệt lần thành công và thất bại theo quy tắc D3, giữ danh tính người quyết định và người áp dụng nếu họ khác nhau. |
| AC-009 | HR xem giờ khai báo, tổng đã phân bổ, giờ còn lại và trạng thái Employee/tuần. DEV giữ quyền Auth 002. Phân bổ không cấp thêm quyền Project, Sprint, Task hoặc tạo giao Task. |
| AC-010 | Employee khai báo 8 giờ, có 3 giờ phân bổ hiệu lực cùng tuần ở Project khác và 2 giờ ACCEPT chưa Apply. Các luồng tính quỹ còn lại là 5 giờ. Khi tổng thực là 9 giờ, giá trị chênh lệch là −1 giờ và trạng thái vượt mức phải phân biệt được với 0 giờ hợp lệ. |

### Edge Cases

- Tuần đã qua không đủ điều kiện. Tuần hiện tại hoặc tương lai cần dữ liệu khai báo đúng tuần.
- Hai quyết định khác nhau có cùng Employee và tuần cạnh tranh cùng quỹ giờ trên mọi Project. Thiếu dữ liệu, hết giờ và vượt mức là ba trường hợp riêng.
- Khi mất kết nối, UI phân biệt kết quả chưa xác nhận với thất bại đã xác nhận. Retry kiểm quyền rồi tra phân bổ cũ trước. Phân bổ đã commit bất biến.
- Đổi PM phụ trách, đổi dữ liệu nguồn và retry sau lần đã ghi phải kiểm quyền hiện tại. Giữ quyết định 003 bất biến.

## Requirements

### Functional Requirements

| ID | Yêu cầu | Nghiệm thu |
| --- | --- | --- |
| FR-001 | Chỉ xét áp dụng trên quyết định ACCEPT đã lưu. Dùng đúng phương án ở bản ghi đã xác minh. Quyết định dùng snapshot đã được Backend xác nhận theo ngữ nghĩa 006. Không thay ứng viên, tuần hoặc số giờ bằng dữ liệu mới do client khai. | AC-001/002/011 |
| FR-002 | Kiểm phiên, role PM và quyền Project tại mọi thao tác áp dụng, truy xuất và retry. Bảo toàn quyền chi tiết Project, Sprint, Task của HR/DEV theo 002. | AC-003/006/008/009 |
| FR-003 | Đọc lại Employee, Skill và tuần trước khi áp dụng mới. Giữ nguyên giờ khai báo. Giờ còn lại bằng giờ khai báo trừ tổng giờ ProjectAllocation có hiệu lực của Employee trong tuần trên mọi Project. Chặn vượt quỹ và chặn dùng giờ thiếu hoặc sai tuần. | AC-004/005/010 |
| FR-004 | Kiểm quỹ giờ và ghi phân bổ trong cùng giao dịch. Các lượt áp dụng đồng thời của nhiều Project phải tuân thủ giới hạn chung cho cùng Employee và tuần. | AC-005 |
| FR-005 | Bảo đảm cùng một lần áp dụng chỉ tiêu hao giờ một lần. Sau kiểm quyền, trả đúng bản ghi đã lưu trước khi kiểm độ mới và quỹ giờ. Giao dịch thất bại hoàn tác toàn bộ. Phân bổ đã commit bất biến. | AC-006/007 |
| FR-006 | Hiển thị ACCEPTED từ quyết định ACCEPT đã lưu, APPLIED từ kết quả áp dụng thật đã xác nhận. Phân biệt đang xử lý, chưa biết kết quả, lỗi và lần áp dụng đã thành công. | AC-001/007/008 |
| FR-007 | Cho chủ thể được phép đối chiếu lịch sử áp dụng thành công hoặc thất bại với quyết định gốc, theo D3 và D4. Lưu kết quả nghiệp vụ đã xác nhận khi DB khả dụng, giữ riêng danh tính người quyết định và người Apply. | AC-007/008/009 |
| FR-008 | HR Availability, Recommendation, What-if, freshness cho quyết định PM mới và Apply phải dùng cùng định nghĩa giờ còn lại. ACCEPT chưa Apply không tiêu hao giờ. Không dùng phép làm tròn hay ép 0 để che vượt mức. 005 dùng cùng quỹ giờ khi được mở lại. | AC-004/005/010 |

### Key Entities

- **PMDecision** là quyết định ACCEPT hoặc REJECT bất biến của 003, chứa phương án đã xác minh. ACCEPTED là trạng thái hiển thị cho ACCEPT đã lưu.
- **ProjectAllocation** biểu diễn phân bổ thật gắn với quyết định, Project và Employee. Đơn vị là giờ hỗ trợ của phương án và kỳ tính là tuần tương ứng. Bản ghi áp dụng thành công có hiệu lực cho tuần của phương án từ khi commit. Việc ghi phân bổ không tự tạo giao việc Sprint/Task.
- **Availability theo tuần** gồm giờ Employee đã khai báo, tổng giờ ProjectAllocation có hiệu lực cùng tuần trên mọi Project và số giờ còn lại dẫn xuất. HR xem tổng hợp, quyền Project giữ theo 002.
- **ApplicationResult** tách khỏi PMDecision, dùng để phân biệt kết quả áp dụng thành công hoặc thất bại. Lịch sử có kết quả thành công hoặc lỗi nghiệp vụ đã xác nhận. Trạng thái chưa xác nhận không được lưu như lỗi.

## Success Criteria

### Measurable Outcomes

- **SC-001** — 100% ca áp dụng thành công làm thay đổi nguồn lực đúng phương án ACCEPT. Mọi ca REJECT, thiếu ACCEPT hoặc ngoài quyền giữ nguyên phân bổ.
- **SC-002** — Mọi ca đồng thời giữ tổng phân bổ trong giới hạn và giờ khai báo giữ nguyên. Gửi lặp cùng lần áp dụng chỉ tiêu hao giờ một lần. Các luồng tính cùng một giá trị giờ còn lại trên cùng dữ liệu, phân biệt vượt mức với hết giờ.
- **SC-003** — Mọi ca đã xác nhận thất bại không hiển thị APPLIED. Ca mất phản hồi sau thành công đối chiếu được với kết quả đã ghi.
- **SC-004** — Bảo toàn 188 test baseline và hành vi What-if chỉ đọc. Nghiệm thu quyền, lỗi, đồng thời và đối chiếu lịch sử ở lượt triển khai.

## Assumptions

**Dependency.** 006 có thể dùng kết quả của 001, phạm vi PM của 002 và quyết định có snapshot đã xác minh của 003. 004 thay chất lượng mô hình Risk Prediction. 005 thay cách tạo hoặc tối ưu phương án. 006 dùng phương án đã được chấp nhận và dữ liệu nguồn lực hiện hành. Việc áp dụng không cần gọi model hoặc chạy tối ưu. Quan hệ dữ liệu vận hành giữa 005 và 006 sẽ được xem lại khi mở 005.

**Phạm vi.** 006 chỉ áp dụng phương án đã chấp nhận. Hoãn nâng cấp mô hình và tối ưu nguồn lực. Giao Task, cấp quyền Project từ phân bổ, thay đổi quyết định gốc, hủy hoặc sửa phân bổ thuộc quyết định khác.

**Nguồn.** [PRD](../../chapter-03-ai-for-requirements-product-analysis/docs/PRD.md) · [TBD-06/07](../../chapter-03-ai-for-requirements-product-analysis/docs/user-stories.md#quyết-định-chưa-xác-định--tbd) · [AC-US-04](../../chapter-03-ai-for-requirements-product-analysis/docs/acceptance-criteria.md#ac-us-04--quyết-định-áp-dụng-hoặc-từ-chối-phương-án) · [Database Design](../../chapter-03-ai-for-requirements-product-analysis/docs/database-design.md#94-projectallocation) · [What-if 001](../001-what-if-simulation/contracts/what-if-api.md) · [Auth 002](../002-auth-rbac/contracts/auth-rbac-api.md) · [PM Decision 003](../003-pm-decision-workflow/contracts/pm-decision-api.md).

**Ảnh hưởng của D1**

| Luồng | Ảnh hưởng |
| --- | --- |
| HR Availability | Dữ liệu hiện tại hiển thị giờ khai báo. HR xem giờ khai báo, tổng phân bổ liên Project, giờ còn lại và trạng thái của Employee/tuần. |
| Resource Recommendation | Lọc và giới hạn giờ hỗ trợ theo giờ còn lại cho Employee/tuần. Phân biệt thiếu dữ liệu, 0 giờ và vượt mức. Tổng giờ không tiết lộ chi tiết Project ngoài quyền. |
| What-if | Đọc lại giờ còn lại để tính ba chỉ báo giả định và chụp đúng giá trị dùng để tính. Mô phỏng không giữ chỗ và vẫn chỉ đọc. |
| PM Decision | Kiểm freshness của quyết định mới bằng giờ còn lại và Skill. Giữ snapshot/lịch sử 003 bất biến. Retry 003 vẫn xét quyết định đã lưu sau kiểm quyền, trước freshness. |
| Resource Optimization 005 | Dùng giờ còn lại làm giới hạn tổng cho Employee/tuần trên mọi Project. Đầu ra là phương án, quỹ giờ chỉ tiêu hao khi Apply thành công. 005 vẫn hoãn. |
