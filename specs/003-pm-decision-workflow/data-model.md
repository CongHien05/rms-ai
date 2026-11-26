# Data Model — PM Decision Workflow

## PMDecision

Một bảng mới `pm_decisions` dùng InnoDB. Mọi trường dưới đây bắt buộc và
bất biến sau INSERT. Khớp chính xác kiểu/charset/collation FK của MariaDB clone.
Timestamps UTC. Tên field ứng dụng cũng dùng trong hợp đồng, trừ trường nội bộ digest.

| Trường | Ràng buộc |
| --- | --- |
| `PMDecision.id` | UUID v4 Backend sinh, PK, `varchar(36)` ASCII nhị phân. |
| `PMDecision.simulationId` | UUID v4 do Backend cấp sau lượt thành công, `varchar(36)` ASCII nhị phân, `UNIQUE` toàn bảng. |
| `PMDecision.projectId` | UUID, FK → `Project.id`, DELETE/UPDATE RESTRICT. |
| `PMDecision.pmAccountId` | UUID, FK → `UserAccount.id`, DELETE/UPDATE RESTRICT. ID của PM gốc, không đổi khi đổi người phụ trách Project. |
| `PMDecision.decision` | Enum `ACCEPT` hoặc `REJECT`, bảo đảm tập giá trị ở DB và service. |
| `PMDecision.decidedAt` | `datetime(3)` UTC, Backend đặt khi INSERT. |
| `PMDecision.snapshot` | JSON với đủ trường DecisionSnapshot bên dưới. Snapshot chính xác từ kết quả được ký, Project trùng FK. |
| `PMDecision.expectedImpact` | JSON với đủ trường DecisionImpact bên dưới, giữ đúng giá trị của kết quả được ký. |
| `PMDecision.referenceDigest` | SHA-256 của nguyên văn token đã xác minh, 64 ký tự hex lowercase, `char(64)` ASCII nhị phân. Chỉ phục vụ xác minh retry và không trả qua API. |

Index lịch sử `(projectId, decidedAt, id)`. Không lưu token, lý do, cờ áp dụng
hay bản ghi `Simulation`. Quyết định không có update/delete/upsert. Việc INSERT
dùng cùng giao dịch với xác minh quyền và freshness. Hai cột JSON dùng
`JSON` của MariaDB, đồng bộ mapping TypeORM và test số thập phân qua round-trip.

## DecisionSnapshot

Cấu trúc giá trị bất biến, lấy nguyên nghĩa của `snapshot` What-if 001.

| Trường | Ràng buộc |
| --- | --- |
| `DecisionSnapshot.projectId` | UUID, trùng Project của token và quyết định. |
| `DecisionSnapshot.employeeId` | UUID của ứng viên đã mô phỏng. |
| `DecisionSnapshot.skillId` | UUID kỹ năng của phương án. |
| `DecisionSnapshot.weekStart` | Ngày thứ Hai ISO `YYYY-MM-DD` theo kiểm tra 001. |
| `DecisionSnapshot.requiredHours` | JSON number hữu hạn, dương. |
| `DecisionSnapshot.supportHours` | JSON number hữu hạn, dương và không vượt `availableHours`. |
| `DecisionSnapshot.availableHours` | JSON number hữu hạn, không âm, đúng số giờ dùng để tính. |

## DecisionImpact

Giữ ba chỉ báo JSON number của What-if 001, mọi giá trị hữu hạn và không âm.

| Trường | Ràng buộc |
| --- | --- |
| `DecisionImpact.hypotheticalSupportHours` | Bằng số giờ hỗ trợ đã xác nhận trong snapshot. |
| `DecisionImpact.remainingRequiredHours` | Giờ cần còn thiếu từ kết quả 001. |
| `DecisionImpact.remainingAvailableHours` | Giờ trống giả định còn lại từ kết quả 001. |

Hai cấu trúc JSON chỉ chứa các trường liệt kê. ID ứng viên/kỹ năng bên trong
là dữ liệu lịch sử của lượt, quyền đọc lấy từ Project và không dựa vào
việc các bản ghi nguồn còn tồn tại. D1 khóa và kiểm đúng dữ liệu nguồn cho
lần ghi **mới**. D2 giữ nguyên JSON của quyết định đã lưu.
