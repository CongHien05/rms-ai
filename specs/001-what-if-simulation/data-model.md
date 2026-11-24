# Data Model — What-if Simulation

Phương án, proof và kết quả là dữ liệu theo lần đề xuất/lần chạy. Schema
MariaDB hiện tại tiếp tục là nguồn cho dự án, nhân sự, kỹ năng và giờ trống.

## Ngữ cảnh đề xuất

| Trường chuẩn | Nguồn và ràng buộc |
| --- | --- |
| `RecommendationContext.projectId` | UUID của Project đang xem và ID trong path đề xuất. Chuẩn hóa UUID về chữ thường khi ký/kiểm tra. |
| `RecommendationContext.employeeId` | UUID của Employee có trong danh sách ứng viên được server trả. |
| `RecommendationContext.skillId` | UUID của Skill dùng để đề xuất. Ứng viên phải có liên kết EmployeeSkill lúc phát proof. |
| `RecommendationContext.weekStart` | Chuỗi YYYY-MM-DD của ngày thứ Hai hợp lệ, theo helper `isAvailabilityWeekStart`. Tuần là ngày lịch, không chuyển múi giờ. |
| `RecommendationContext.requiredHours` | JSON number hữu hạn dương từ DTO đề xuất hiện có. Giá trị chuẩn hóa được ký, không sửa ở bước What-if. |
| `RecommendationContext.proof` | Giá trị response `candidate.recommendationContext` có dạng `v1.<chữ ký base64url>`. Chữ ký HMAC SHA-256 dài 43 ký tự, ký bộ trường trên theo thứ tự cố định, có tiền tố ngữ cảnh và phiên bản. Kiểm tra chữ ký bằng so sánh constant time với độ dài đã xác thực. Metadata này chỉ có khi khóa dev khả dụng. |
| `RecommendationContext.outcome` | Trạng thái bổ sung của toàn bộ response đề xuất. `candidates_available` khi có người đủ điều kiện, `unavailable` khi danh sách rỗng và có hồ sơ đúng kỹ năng bị thiếu khai báo cho tuần, `no_suitable_candidate` cho các kết quả rỗng còn lại. Lỗi hệ thống dùng HTTP error. |

Proof ghi nhận ngữ cảnh do server phát. Nó không chứa dữ liệu availability,
kết quả tác động hoặc thông tin xác thực PM. Tuple đã ký phải khớp path và
body; khóa không xuất hiện trong DTO hoặc log.

## Phương án và lượt chạy

| Trường chuẩn | Nguồn và ràng buộc |
| --- | --- |
| `Scenario.supportHours` | JSON number hữu hạn lớn hơn 0, do PM xác nhận. Phải <= giờ trống server đọc lại đúng tuần. Không có điều kiện <= giờ cần và không làm tròn trước khi kiểm tra. |
| `Scenario.reference` | SHA-256 hex chữ thường của bộ ngữ cảnh chuẩn hóa và số giờ hỗ trợ, có phiên bản riêng. Ổn định cho cùng phương án; khác khi bất kỳ đầu vào nào đổi. Ánh xạ response thành `scenarioReference`. Đây là định danh liên kết, không phải proof, và không chứa giờ trống. |
| `SimulationRun.id` | UUID mới do client tạo khi PM xác nhận hoặc thử lại. Echo thành `runId` ở response tính thành công. Hai lần chạy cùng phương án vẫn có run ID khác nhau. |
| `SimulationRun.inputRevision` | Revision tăng trong phạm vi màn hiện tại mỗi khi đổi dự án, ứng viên, kỹ năng, tuần, giờ cần hoặc giờ hỗ trợ. Client dùng cùng run ID hiện hành để quyết định có áp dụng phản hồi hay không. Không gửi hoặc lưu revision vào Backend. |

Dùng khóa dev ổn định `WHAT_IF_CONTEXT_SECRET`: chuỗi base64url không
đệm biểu diễn đúng 32 byte ngẫu nhiên. Khi biến vắng hoặc sai, đề xuất
tiếp tục trả danh sách và outcome, bỏ proof. Mô phỏng trả lỗi cấu hình
503. Đổi khóa làm proof cũ không còn hợp lệ.

## Availability, snapshot và tác động

| Trường chuẩn | Nguồn và ràng buộc |
| --- | --- |
| `EmployeeAvailability.weekStart` | `Employee.availabilityWeekStart`, DATE nullable. Chỉ dùng khi trùng tuần yêu cầu. Giá trị null hoặc khác tuần được phân loại `MISSING_AVAILABILITY`. |
| `EmployeeAvailability.availableHours` | `Employee.availableHours`, DOUBLE nullable. Null ở tuần hợp lệ là thiếu. 0 ở đúng tuần là số đã khai báo và mọi hỗ trợ dương đều vượt giới hạn. Giờ nguồn âm hoặc không hữu hạn là lỗi dữ liệu nguồn, không sản sinh tác động. |
| `EmployeeAvailability.matchesSkill` | Sự tồn tại của liên kết EmployeeSkill cho kỹ năng yêu cầu. Đọc cùng tuần và giờ theo ID Employee. Liên kết đã mất là phương án không hợp lệ. |
| `SimulationSnapshot.context` | Bản sao của `projectId`, `employeeId`, `skillId`, `weekStart` và `requiredHours` đã xác minh; dùng đúng ràng buộc từng trường của `RecommendationContext`. Không gồm proof. |
| `SimulationSnapshot.supportHours` | Giữ đúng số giờ đã xác nhận theo `Scenario.supportHours`. |
| `SimulationSnapshot.availableHours` | Giá trị giờ trống hợp lệ dùng để tính trong chính lượt đọc đó. Giữ kiểu JSON number và ràng buộc của `EmployeeAvailability.availableHours` ở ca thành công. |
| `SimulationResult.outcome` | Literal `available` cho HTTP 200. Khi thiếu dữ liệu hoặc xảy ra lỗi, dùng HTTP error theo contract, không trả impact. |
| `SimulationImpact.hypotheticalSupportHours` | Chính xác số giờ hỗ trợ đã xác nhận. |
| `SimulationImpact.remainingRequiredHours` | `max(0, requiredHours − supportHours)`. |
| `SimulationImpact.remainingAvailableHours` | `availableHours − supportHours`, không âm theo kiểm tra trước khi tính. |

Tách trạng thái kết quả dùng ở giao diện. Idle chờ PM xác nhận; loading gắn
với run hiện hành; success có snapshot và impact. Empty thuộc đề xuất.
Missing, invalid và error giữ bản nháp. Stale xuất hiện khi đầu vào đã đổi
sau lượt đang chờ hoặc sau kết quả; chỉ hiện thông báo cần xác nhận lại.
Mọi đường cập nhật success/error/finally của lượt đã bị thay thế đều bỏ qua.
Đề xuất mới hoặc ngữ cảnh không còn hợp lệ có thể yêu cầu chọn lại.
