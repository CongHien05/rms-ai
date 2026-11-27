# Data Model — Apply Allocation 006

Ba bảng InnoDB mới, append-only. FK khớp kiểu/charset/collation của đích, ON DELETE/UPDATE RESTRICT. Chín bảng baseline giữ nguyên. Toàn bộ giờ ghi ở 006 theo [contract](contracts/apply-allocation-api.md#giờ-chính-xác).

## DecisionAvailabilityEvidence

Provenance nội bộ cho quyết định từ evidence v2, ghi nguyên tử cùng quyết định. Thiếu hàng là legacy. Lấy Employee/Skill/tuần/Project từ PMDecision bất biến.

| Field | Ràng buộc |
| --- | --- |
| `DecisionAvailabilityEvidence.decisionId` | UUID, PK/FK PMDecision.id. |
| `DecisionAvailabilityEvidence.semantics` | `remaining-v1`, từ claim HMAC v2 đã xác minh. |
| `DecisionAvailabilityEvidence.availableHoursExact` | Chuỗi canonical không âm, tối đa 672 ký tự, giờ còn lại tại What-if. |
| `DecisionAvailabilityEvidence.supportHoursExact` | Chuỗi canonical dương, tối đa 672 ký tự, không vượt availableHoursExact. |

## ProjectAllocation

Ghi khi Apply thành công, có hiệu lực cho Employee/tuần từ commit, bất biến trong 006. Index `(employeeId, weekStart)` tính quỹ liên Project.

| Field | Ràng buộc |
| --- | --- |
| `ProjectAllocation.id` | UUID v4, PK. |
| `ProjectAllocation.decisionId` | UUID, FK PMDecision.id, UNIQUE. Chỉ ghi với ACCEPT có provenance. |
| `ProjectAllocation.projectId` | UUID, FK Project.id, khớp quyết định. |
| `ProjectAllocation.employeeId` | UUID, FK Employee.id, từ snapshot. |
| `ProjectAllocation.skillId` | UUID, FK Skill.id, từ snapshot. |
| `ProjectAllocation.weekStart` | DATE, thứ Hai lịch Việt Nam, bằng tuần trong snapshot. |
| `ProjectAllocation.hoursExact` | Chuỗi canonical dương, tối đa 672 ký tự, bằng supportHoursExact đã xác minh. |
| `ProjectAllocation.appliedByAccountId` | UUID, FK UserAccount.id, principal PM đang phụ trách. |
| `ProjectAllocation.appliedAt` | DATETIME(3) UTC, giờ Backend. |

## ApplicationResult

Lịch sử Apply đã xác nhận, đọc theo quyết định thuộc Project được phép. Index `(decisionId, occurredAt, id)`. Không có hàng cho yêu cầu ngoài quyền hoặc kết quả chưa xác nhận. Danh tính người quyết định lấy từ PMDecision.

| Field | Ràng buộc |
| --- | --- |
| `ApplicationResult.id` | UUID v4, PK. |
| `ApplicationResult.decisionId` | UUID, FK PMDecision.id. |
| `ApplicationResult.actorAccountId` | UUID, FK UserAccount.id, principal của lần Apply. |
| `ApplicationResult.outcome` | `APPLIED` hoặc `FAILED`. |
| `ApplicationResult.code` | Null cho APPLIED, mã lỗi nghiệp vụ trong contract cho FAILED. |
| `ApplicationResult.allocationId` | UUID, nullable FK ProjectAllocation.id, UNIQUE khi khác null. Bắt buộc cho APPLIED, null cho FAILED. |
| `ApplicationResult.occurredAt` | DATETIME(3) UTC, giờ Backend. |

CHECK bảo vệ quan hệ outcome/code/allocationId. Service kiểm cùng decisionId, Project và actor của hàng thành công. Không lưu payload client hay chi tiết Project khác trong lỗi. Giờ khai báo vẫn ở Employee. Tổng đã phân bổ và giờ còn lại được dẫn xuất khi đọc.
