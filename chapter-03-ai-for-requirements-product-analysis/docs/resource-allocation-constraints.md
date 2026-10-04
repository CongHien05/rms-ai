# Ràng buộc phân bổ nguồn lực RMS-AI MVP

## 1. Mục tiêu và phạm vi

Tài liệu này phân loại các ràng buộc liên quan tới nhân sự, kỹ năng, đề xuất,
phương án phân bổ, mô phỏng, quyết định và việc áp dụng trong RMS-AI MVP.

Mục tiêu là giúp Milestone 4 triển khai dữ liệu nền mà không tự tạo công thức
hoặc quy tắc nghiệp vụ còn thiếu. Tài liệu không định nghĩa thuật toán ghép nối,
bộ tối ưu, giới hạn phân bổ, công thức mức sử dụng, quy tắc nhân sự chờ phân bổ,
giao dịch áp dụng hoặc tệp chuyển đổi lược đồ.

## 2. Nguồn và quy ước

Nguồn yêu cầu theo thứ tự thẩm quyền:

1. `PRD.md`.
2. `user-stories.md`.
3. `acceptance-criteria.md`.

Nguồn bổ trợ:

- `mvp-data-contract.md`.
- `system-architecture.md`.
- `initial-api-contracts.md`.
- `database-design.md`.
- `pm-risk-ui-design.md`.
- `resource-recommendation-ui-design.md`.
- `chapter-04-ai-for-product-design/docs/what-if-simulation-ui-design.md`.

| Trạng thái | Ý nghĩa |
| --- | --- |
| YÊU CẦU ĐÃ XÁC NHẬN | Có căn cứ trực tiếp từ bộ yêu cầu nền. |
| ĐỀ XUẤT KỸ THUẬT | Toàn vẹn dữ liệu hoặc ranh giới triển khai được đề xuất; cần con người phê duyệt. |
| TBD | Chưa có đủ căn cứ để chọn quy tắc hoặc kết quả kỳ vọng. |
| DẪN XUẤT | Giá trị có thể tính từ dữ liệu khác; công thức chưa được tự động xác nhận. |
| CHỈ DÙNG BẢN MẪU | Chỉ phục vụ trình bày, không phải ràng buộc vận hành. |

## 3. Căn cứ yêu cầu

| Nội dung | Nguồn | Kết luận |
| --- | --- | --- |
| AI hỗ trợ, PM quyết định | PRD Tổng quan; User Stories mục Người dùng chính | Hệ thống không tự chấp nhận hoặc tự áp dụng thay PM |
| Đề xuất không tự thay đổi phân bổ thật | AC-US-02-02 | Nhận/xem ứng viên không tạo ProjectAllocation |
| Không ép đưa ứng viên không phù hợp | AC-US-02-03, AC-US-02-05 | Kết quả rỗng hợp lệ hơn việc nới điều kiện không được duyệt |
| Thiếu mức độ sẵn sàng/khối lượng công việc không đồng nghĩa đang rảnh | AC-US-02-04 | Không tự gán giá trị còn thiếu |
| Mô phỏng không phá hủy dữ liệu | PRD; AC-US-03-02 | Chạy, xem hoặc thất bại mô phỏng không sửa ProjectAllocation |
| Tác động thuộc đúng phương án | AC-US-03-01 | `SimulationResult` phải liên kết đúng với `AllocationScenario` tương ứng |
| Vi phạm ràng buộc phân bổ | AC-US-03-03 | Quy tắc và hành vi cảnh báo/chặn vẫn TBD |
| Từ chối thì không áp dụng | AC-US-04-02 | Từ chối không tạo thay đổi phân bổ thật |
| Không có Chấp nhận rõ ràng thì không áp dụng | AC-US-04-03 | Sự im lặng, thứ hạng hoặc đầu ra AI không phải phê duyệt |
| Chấp nhận không bảo đảm áp dụng thành công | AC-US-04-01, AC-US-04-06 | `PMDecision` và `ApplicationResult` phải tách nhau |
| Áp dụng thất bại không được báo thành công | AC-US-04-07 | Trạng thái thất bại không được ánh xạ thành thành công |

## 4. Ràng buộc đã xác nhận

### 4.1. Quyền quyết định

- PM là người quyết định cuối cùng cho Chấp nhận hoặc Từ chối.
- Kết quả AI, vị trí xếp hạng, việc PM xem một ứng viên hoặc việc PM không phản
  hồi không được xem là Chấp nhận.
- Chưa có yêu cầu cho phê duyệt nhiều cấp hoặc quyết định tự động.

### 4.2. Đề xuất nhân sự

- Kết quả thành công có danh sách ứng viên được xếp hạng và giải thích cơ bản.
- Danh sách xếp hạng hỗ trợ PM cân nhắc; hạng đầu không được mô tả là tối ưu
  tuyệt đối.
- Việc tạo hoặc xem đề xuất không thay đổi phân bổ thật.
- Khi không có ứng viên đáp ứng tiêu chí phù hợp sẽ được chốt, hệ thống phải
  biểu diễn kết quả không có ứng viên phù hợp.
- Không thêm ứng viên không phù hợp chỉ để tránh danh sách rỗng.

### 4.3. Phương án và mô phỏng

- Ứng viên không mặc định là một phương án phân bổ hoàn chỉnh.
- Phương án là thay đổi phân bổ giả định cần được xác định trước khi mô phỏng;
  cấu trúc cụ thể còn TBD.
- Mô phỏng, xem kết quả hoặc mô phỏng thất bại không được sửa dữ liệu phân bổ
  thật.
- Kết quả tác động phải thuộc đúng phương án đã mô phỏng.
- Kết quả mô phỏng là hỗ trợ quyết định, không phải bằng chứng thay đổi đã được
  áp dụng.

### 4.4. Quyết định và áp dụng

- Từ chối không dẫn tới áp dụng.
- Không có hành động chấp nhận rõ ràng thì không áp dụng.
- Chấp nhận không đồng nghĩa áp dụng thành công.
- Nếu áp dụng được phép và thành công, thay đổi thật phải tương ứng đúng phương án
  PM đã chấp nhận.
- Nếu áp dụng thất bại, hệ thống không được báo thành công.
- Điều kiện đủ, thời điểm, giao dịch, lỗi một phần, thử lại và khôi phục vẫn
  TBD.

## 5. Ràng buộc toàn vẹn dữ liệu được đề xuất

Các ràng buộc trong mục này là **ĐỀ XUẤT KỸ THUẬT**, không phải yêu cầu mới.

| Ràng buộc | Mục đích | Không được suy diễn thành |
| --- | --- | --- |
| Mọi khóa ngoại phải tham chiếu bản ghi tồn tại | Tránh dữ liệu mồ côi | Quyền truy cập hoặc điều kiện phù hợp |
| `Sprint.projectId` và `Task.sprintId` phải giữ đúng chuỗi Project -> Sprint -> Task | Bảo toàn ngữ cảnh | Sprint/Task bắt buộc cho mọi dự án |
| Cặp `EmployeeSkill.employeeId` + `skillId` là duy nhất | Tránh lặp cùng quan hệ kỹ năng | Mức kỹ năng hoặc bằng chứng kỹ năng |
| Quan hệ Employee <-> Project được biểu diễn như một khái niệm riêng | Tách ranh giới phân bổ khỏi đề xuất và phương án | Không được suy diễn rằng bảng `ProjectAllocation` production đã sẵn sàng triển khai |
| `RecommendationCandidate` tham chiếu Employee nhưng không dùng chung khóa với ProjectAllocation | Tách ứng viên khỏi phân bổ thật | Ứng viên đủ điều kiện để áp dụng |
| `ScenarioChange` thuộc đúng `AllocationScenario` | Giữ các thay đổi giả định theo phương án | Cấu trúc phương án đã chốt |
| `SimulationResult` tham chiếu đúng `AllocationScenario` | Bảo toàn liên kết | Kết quả còn mới hoặc đáng tin cậy sau khi dữ liệu đổi |
| `PMDecision` tham chiếu đúng `AllocationScenario` | Giữ quyết định đúng ngữ cảnh | Việc áp dụng được phép hoặc đã thành công |
| `ApplicationResult` tách khỏi `PMDecision` | Phân biệt quyết định và kết quả vận hành | Giao dịch hoặc cơ chế khôi phục đã được định nghĩa |
| Nếu có khoảng thời gian, điểm bắt đầu không sau điểm kết thúc | Toàn vẹn thời gian cơ bản | Giới hạn thời lượng hay quy tắc chồng lấn |

Không tạo ràng buộc duy nhất để ngăn mọi phân bổ chồng lấn. Một nhân sự có thể có
nhiều phân bổ hợp lệ hay không phụ thuộc đơn vị, năng lực và quy tắc tổng vẫn
TBD.

Quan hệ Employee <-> Project **SẴN SÀNG** ở mức mô hình khái niệm, nhưng
`ProjectAllocation` vận hành **BỊ CHẶN**. Không tạo một phân bổ thật chỉ gồm
`id`, `projectId` và `employeeId`, vì cấu trúc đó có thể ngụ ý nhân sự đã được
phân bổ khi lượng, đơn vị và phạm vi phân bổ chưa được xác định.

## 6. Ràng buộc còn TBD

| Khu vực | Điểm chưa được chốt |
| --- | --- |
| Phân bổ | Lượng, đơn vị, giới hạn tổng, chồng lấn, khoảng hiệu lực và quá tải |
| Mức độ sẵn sàng/khối lượng công việc | Nguồn dữ liệu, khoảng tính, đơn vị và hành vi khi thiếu dữ liệu |
| Mức sử dụng/nhân sự chờ phân bổ | Công thức, ngưỡng, khoảng quan sát và tác động tới xếp hạng |
| Kỹ năng | Thang mức, nguồn xác nhận, kỹ năng bắt buộc/ưu tiên và kỹ năng tương đương |
| Ứng viên | Điều kiện bao gồm/loại trừ, số lượng, điểm, độ tin cậy và quy tắc đồng hạng |
| Phương án/mô phỏng | Trường tối thiểu, chỉ số tác động, độ mới và xử lý vi phạm ràng buộc |
| Quyết định/áp dụng | Chủ thể, tính lặp an toàn, điều kiện áp dụng, giao dịch, lỗi một phần và phục hồi |
| Lưu trữ/bảo mật | Lịch sử, thời hạn lưu, lược đồ xác thực, RBAC và quyền xem dự án |

Các điểm trên không được suy diễn từ dữ liệu bản mẫu hoặc tính hợp lý kỹ thuật.

## 7. Mức độ sẵn sàng, khối lượng công việc và mức sử dụng

### 7.1. Mức độ sẵn sàng

Yêu cầu chỉ nêu mức độ sẵn sàng như dữ liệu hỗ trợ có thể liên quan.

- Có lưu mức độ sẵn sàng trực tiếp hay dẫn xuất từ phân bổ/lịch làm việc: TBD.
- Đơn vị thời gian và khoảng tính: TBD.
- Công thức xác định sẵn sàng/không sẵn sàng: TBD.
- Thiếu mức độ sẵn sàng không được mặc định là đang sẵn sàng.
- Một giá trị Boolean `isAvailable` không được tự thêm như nguồn sự thật nếu chưa có
  định nghĩa thời điểm và phạm vi.

### 7.2. Khối lượng công việc

- Nguồn khối lượng công việc: TBD.
- Đơn vị giờ, phần trăm, điểm công sức hoặc đơn vị khác: TBD.
- Khối lượng công việc từ `Task` có được cộng với phân bổ hay không: TBD.
- Thiếu khối lượng công việc không được mặc định là không có việc.

### 7.3. Mức sử dụng

Mức sử dụng là **DẪN XUẤT** nếu sau này được duyệt. Chưa có công thức tử số,
mẫu số, khoảng thời gian hoặc cách xử lý nghỉ/không đủ dữ liệu. Không lưu một
giá trị mức sử dụng như sự thật vận hành cho tới khi nguồn và công thức được
phê duyệt.

## 8. Trạng thái nhân sự chờ phân bổ

PRD nêu mục tiêu hỗ trợ giảm thời gian nhân sự chờ phân bổ, nhưng không định
nghĩa quy tắc phát hiện nhân sự chờ phân bổ.

| Câu hỏi | Trạng thái |
| --- | --- |
| Không có phân bổ có đồng nghĩa đang chờ phân bổ không? | TBD |
| Phân bổ dưới một ngưỡng có đồng nghĩa đang chờ phân bổ không? | TBD; không có ngưỡng |
| Khoảng thời gian quan sát là bao lâu? | TBD |
| Thiếu dữ liệu phân bổ xử lý thế nào? | TBD; không được mặc định là đang chờ phân bổ |
| Trạng thái chờ phân bổ có làm tăng ưu tiên đề xuất không? | TBD; không tự thêm trọng số |

`benchStatus` không nên là trường bắt buộc ở nền tảng đầu tiên. Nếu được duyệt,
nó nên có nguồn/công thức rõ hoặc được đánh dấu là giá trị dẫn xuất theo thời
điểm.

## 9. Mô hình yêu cầu kỹ năng

### 9.1. Phần có thể thiết kế

- `Employee` và `Skill` là hai khái niệm riêng.
- EmployeeSkill là quan hệ nhiều-nhiều được đề xuất.
- `ProjectSkillRequirement` là khái niệm đề xuất để mô tả nhu cầu kỹ năng của dự án.
- Mỗi quan hệ phải giữ tham chiếu tới đúng `Employee`, `Skill` và `Project`.

### 9.2. Phần còn TBD

- Thang đo `skillLevel` và ý nghĩa từng mức.
- Ai cung cấp hoặc xác nhận kỹ năng.
- Cách biểu diễn kỹ năng bắt buộc/ưu tiên.
- `requiredLevel`, số lượng nhân sự cần, vai trò và khoảng thời gian.
- Kỹ năng thay thế hoặc tương đương.
- Độ mới, bằng chứng và thời hạn hiệu lực của kỹ năng.
- Hành vi khi thiếu dữ liệu kỹ năng.

Không được coi việc có cùng `skillId` là đủ phù hợp nếu yêu cầu sau này cần
mức kỹ năng, mức độ sẵn sàng, khối lượng công việc hoặc ràng buộc khác.

## 10. Điều kiện ứng viên và xếp hạng

### 10.1. Đã xác nhận

- Kết quả đề xuất có thứ hạng.
- Mỗi ứng viên có giải thích cơ bản về mức độ phù hợp.
- Có thể có kết quả không có ứng viên phù hợp.
- Không ép ứng viên không phù hợp vào danh sách.

### 10.2. TBD

- Điều kiện bao gồm/loại trừ ứng viên.
- Trường nhận diện ứng viên và thông tin hiển thị.
- Kỹ năng bắt buộc, mức kỹ năng, mức độ sẵn sàng, khối lượng công việc và ngữ cảnh phân bổ.
- Số lượng ứng viên, đồng hạng và thứ tự ổn định.
- Điểm phù hợp, độ tin cậy, công thức xếp hạng và trọng số.
- Lý do loại trừ và hành vi khi dữ liệu thiếu.
- Có ưu tiên nhân sự chờ phân bổ hay không.

Thiếu một trường TBD không cho phép tự giữ hoặc tự loại ứng viên. Hành vi khi dữ
liệu thiếu phải được nhóm chốt riêng với trường hợp thật sự không có ứng viên
phù hợp.

## 11. Ứng viên khác phương án phân bổ

| Ứng viên / `RecommendationCandidate` | Phương án phân bổ / `ScenarioChange` |
| --- | --- |
| Là một mục trong danh sách đề xuất có thứ hạng | Là phương án thay đổi phân bổ để mô phỏng |
| Tham chiếu một `Employee` được đề xuất | Có thể gồm một hoặc nhiều thay đổi; số lượng còn TBD |
| Có giải thích mức độ phù hợp | Có nội dung thay đổi phân bổ; trường còn TBD |
| Không thay đổi `ProjectAllocation` | Không thay đổi `ProjectAllocation` khi chỉ được tạo/mô phỏng |
| Không mặc định chứa đủ lượng phân bổ, thời gian hoặc vai trò | Cần cấu trúc đủ cho mô phỏng; mức tối thiểu còn TBD |

Không dùng `candidateId` của bản mẫu như `scenarioReference` trong hợp đồng vận
hành. Ứng viên có thể là nguồn ngữ cảnh cho phương án, nhưng phép chuyển đổi là
TBD và phải tạo ranh giới khái niệm riêng.

## 12. Phương án, mô phỏng và áp dụng

### 12.1. Phương án

Các trường tiềm năng như nhân sự, dự án đích, lượng phân bổ, đơn vị, vai trò,
ngày bắt đầu/kết thúc và nguồn đề xuất đều TBD. Không trường nào trong danh sách
này được xem là đã xác nhận chỉ vì nó hợp lý về kỹ thuật.

### 12.2. Mô phỏng

- Phải đọc phương án như dữ liệu giả định hoặc bản chụp logic riêng.
- Không được ghi `ProjectAllocation` trong thao tác chạy mô phỏng.
- Thành công hay thất bại đều không thay đổi phân bổ thật.
- Kết quả phải giữ liên kết tới đúng phương án.
- Khi phương án hoặc dữ liệu thật đổi, độ hợp lệ của kết quả cũ là TBD.

### 12.3. Áp dụng

Áp dụng vẫn **BỊ CHẶN**. Trước khi triển khai phải chốt tối thiểu:

- điều kiện đủ và thời điểm áp dụng;
- có bắt buộc mô phỏng hợp lệ hay không;
- kiểm tra dữ liệu đã thay đổi;
- đơn vị và ràng buộc phân bổ;
- giao dịch, lỗi một phần, khôi phục/phục hồi và thử lại;
- hành vi quyết định lặp;
- kết quả PM nhìn thấy khi thất bại.

Không thiết kế giao dịch hoặc thuật toán áp dụng trong artifact này.

## 13. Quyết định khác kết quả áp dụng

| `PMDecision` | `ApplicationResult` |
| --- | --- |
| Ghi nhận chấp nhận hoặc từ chối | Ghi nhận kết quả thực thi thay đổi thật nếu có |
| Thể hiện quyết định của PM | Thể hiện thành công/thất bại vận hành |
| Chấp nhận là điều kiện cần, chưa chắc đủ | Chỉ xuất hiện khi áp dụng được phép và được thực thi |
| Từ chối không được dẫn tới áp dụng | Không được tạo trạng thái thành công cho quyết định từ chối |
| Cách lưu trữ và chủ thể thực hiện vẫn TBD | Cách lưu trữ, giao dịch và phục hồi vẫn TBD |

API phản hồi quyết định không được chứa ngầm kết quả áp dụng thành công trước
khi hợp đồng áp dụng riêng được phê duyệt.

## 14. Trường hợp biên cần giữ khi triển khai sau này

| Trường hợp biên | Hành vi đã xác nhận | Phần còn TBD |
| --- | --- | --- |
| Thiếu mức độ sẵn sàng/khối lượng công việc | Không suy ra nhân sự đang rảnh | Giữ/loại ứng viên và thông báo |
| Không có ứng viên phù hợp | Trả kết quả rỗng rõ ràng; không ép ứng viên | Tiêu chí phù hợp và bước tiếp theo |
| Ứng viên đồng hạng | Không có quy tắc tự chọn | Thứ tự ổn định và quy tắc phân hạng ngang nhau |
| Phân bổ chồng lấn | Không có giới hạn được xác nhận | Đơn vị, năng lực, cảnh báo/chặn |
| Phương án thiếu trường | Không bịa giá trị | Dữ liệu tối thiểu và hành vi tiếp tục |
| Phương án có khả năng vi phạm ràng buộc | Chưa được phép tự chặn hoặc tự nới | Cảnh báo/chặn/vẫn mô phỏng |
| Mô phỏng thất bại | `ProjectAllocation` giữ nguyên | Thử lại và chuyển bước |
| Kết quả không cải thiện hoặc xấu hơn | Không bịa lợi ích hoặc che kết quả | Chỉ số và cách trình bày |
| Dữ liệu thật đổi sau mô phỏng | Kết quả cũ vẫn chỉ thuộc ngữ cảnh cũ | Chính sách kết quả cũ và mô phỏng lại |
| PM từ chối | Không áp dụng | Lưu, hủy, quay lại hay hết hạn |
| Không có hành động chấp nhận rõ ràng | Không áp dụng | Lưu nháp/hết hạn |
| Quyết định gửi lặp | Không có quy tắc mới | Tính lặp an toàn và phản hồi |
| Áp dụng thất bại/một phần | Không báo thành công | Trạng thái thật, khôi phục và thử lại |

## 15. Quy tắc không được triển khai cho tới khi chốt

- Không đặt tổng phân bổ tối đa hoặc ngưỡng quá tải.
- Không tự chọn phần trăm, giờ, FTE hoặc đơn vị phân bổ.
- Không tính mức độ sẵn sàng từ dữ liệu thiếu.
- Không định nghĩa công thức mức sử dụng.
- Không định nghĩa quy tắc hoặc ngưỡng nhân sự chờ phân bổ.
- Không chọn thang mức kỹ năng hoặc quy tắc so sánh mức.
- Không đặt điều kiện đủ chuẩn, loại trừ hoặc Top N.
- Không tạo điểm phù hợp, độ tin cậy hoặc trọng số xếp hạng.
- Không ưu tiên nhân sự chờ phân bổ trong xếp hạng nếu chưa có quyết định nghiệp vụ.
- Không biến ứng viên thành `AllocationScenario`.
- Không cho mô phỏng ghi `ProjectAllocation`.
- Không tạo chỉ số tác động, đường cơ sở hoặc công thức lợi ích.
- Không mặc định mô phỏng thành công là điều kiện đủ để áp dụng.
- Không coi chấp nhận là áp dụng thành công.
- Không tạo giao dịch áp dụng, cơ chế khôi phục hoặc chính sách thử lại.
- Không tự lưu toàn bộ lịch sử hoặc đặt thời gian lưu giữ/TTL.
- Không tự tạo lược đồ người dùng xác thực, ma trận vai trò hoặc quy tắc hiển thị dự án.

## 16. Mức sẵn sàng cho Milestone 4

| Khu vực | Mức sẵn sàng | Kết luận |
| --- | --- | --- |
| Nền tảng `Employee` và `Skill` | SẴN SÀNG | Có thể bắt đầu sau khi nền tảng Project/Sprint/Task merge; không mở rộng hồ sơ HR |
| `EmployeeSkill` tối thiểu | SẴN SÀNG MỘT PHẦN | Có thể triển khai quan hệ; mức kỹ năng và bằng chứng còn TBD |
| `ProjectSkillRequirement` | BỊ CHẶN | Ngữ nghĩa yêu cầu, mức, số lượng và thời gian chưa chốt |
| Quan hệ Employee <-> Project | SẴN SÀNG | Đã có mô hình khái niệm; không đồng nghĩa có phân bổ thật |
| `ProjectAllocation` vận hành | BỊ CHẶN | Lượng, đơn vị, thời gian, năng lực, chồng lấn và giới hạn tổng chưa chốt |
| Mức độ sẵn sàng/khối lượng công việc | BỊ CHẶN | Nguồn, đơn vị và hành vi thiếu dữ liệu chưa chốt |
| Mức sử dụng/nhân sự chờ phân bổ | BỊ CHẶN | Công thức và quy tắc chưa chốt |
| Kết quả ứng viên | SẴN SÀNG MỘT PHẦN | Kết quả xếp hạng và giải thích rõ; điều kiện/lược đồ còn TBD |
| `AllocationScenario` | SẴN SÀNG MỘT PHẦN | Ranh giới khái niệm rõ; trường tối thiểu TBD |
| Bất biến mô phỏng | SẴN SÀNG | Không phá hủy và liên kết đúng phương án đã xác nhận |
| Bất biến `PMDecision` | SẴN SÀNG | Chấp nhận/từ chối và quyền PM đã xác nhận |
| Áp dụng | BỊ CHẶN | Điều kiện, ràng buộc, giao dịch và phục hồi khi lỗi còn TBD |

## 17. Checklist tự rà soát

- [x] Không biến bản mẫu thành lược đồ hoặc ràng buộc.
- [x] Không tạo risk score/threshold.
- [x] Không tạo công thức/trọng số ghép nối.
- [x] Không tạo chỉ số tác động.
- [x] Ứng viên tách khỏi phương án.
- [x] Quyết định tách khỏi `ApplicationResult`.
- [x] Không mặc định mọi kết quả AI phải được lưu lâu dài.
- [x] Không mở rộng HR hoặc quản lý dự án ngoài MVP.
- [x] Không cài ORM/trình điều khiển và không tạo tệp chuyển đổi lược đồ/mã nguồn.
- [x] Quan hệ Employee <-> Project không bị nhầm với `ProjectAllocation` production sẵn sàng triển khai.
- [x] `ProjectAllocation` vận hành vẫn BỊ CHẶN; semantics phân bổ vẫn TBD.
- [x] Mức độ sẵn sàng, mức sử dụng, trạng thái chờ phân bổ, mức kỹ năng và việc áp dụng vẫn giữ TBD.
