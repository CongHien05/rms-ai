# Hợp đồng dữ liệu khái niệm cho RMS-AI MVP

## 1. Mục tiêu và phạm vi

Tài liệu này xác định hợp đồng dữ liệu khái niệm cho luồng quyết định RMS-AI
MVP:

```text
Dự án
-> Đánh giá rủi ro
-> Giải thích rủi ro
-> Đề xuất nhân sự
-> Phương án giả định
-> Mô phỏng
-> Tác động dự kiến
-> Quyết định của PM
-> [Hành vi áp dụng]
```

Tài liệu kết nối các sản phẩm phân tích yêu cầu và thiết kế sản phẩm với công
việc kiến trúc mức cao, API, database và thiết kế AI ở giai đoạn sau. Tài liệu
không định nghĩa DTO API production, schema database, ERD, lựa chọn mô hình ML,
công thức xếp hạng, công thức mô phỏng hoặc hành vi triển khai.

Bất biến cốt lõi: AI hỗ trợ PM; PM đưa ra quyết định.

## 2. Nguồn tham chiếu và quy ước trạng thái

Nguồn yêu cầu chính:

1. `PRD.md`
2. `user-stories.md`
3. `acceptance-criteria.md`

Ngữ cảnh thiết kế và bản mẫu:

- `pm-risk-ui-design.md`
- `resource-recommendation-ui-design.md`
- `chapter-04-ai-for-product-design/docs/what-if-simulation-ui-design.md`
- Các file bản mẫu Frontend hiện tại trong `frontend/src/`

Quy ước trạng thái:

| Trạng thái | Ý nghĩa |
|---|---|
| ĐÃ XÁC NHẬN | Có căn cứ trực tiếp từ PRD, User Stories hoặc Acceptance Criteria. |
| TBD | Cần quyết định sản phẩm và các nguồn hiện tại chưa xác định nội dung đó. |
| TÙY CHỌN | Cải tiến UX hoặc sản phẩm có thể cân nhắc, không bắt buộc theo cơ sở MVP hiện tại. |
| CHỈ DÙNG BẢN MẪU | Chỉ tồn tại trong dữ liệu trình bày của bản mẫu/demo. |
| DẪN XUẤT | Được tính từ thông tin khác; công thức phải được đánh dấu TBD nếu chưa được xác nhận. |

Phần triển khai bản mẫu là bằng chứng về tính liên tục của trình bày, không phải
nguồn tạo ra yêu cầu nghiệp vụ mới.

## 3. Luồng dữ liệu sản phẩm

```text
Dữ liệu dự án
    ↓
Năng lực đánh giá rủi ro
    ↓
Đánh giá rủi ro
    +
Giải thích rủi ro
    ↓
Yêu cầu đề xuất
    ↓
Đề xuất có thứ hạng
    ↓
Phương án phân bổ
    ↓
Mô phỏng
    ↓
Kết quả tác động
    ↓
Quyết định của PM
    ↓
[Áp dụng — ngữ nghĩa còn một phần TBD]
```

Ghi chú ranh giới:

| Ranh giới | Thông tin đã xác nhận đi qua ranh giới | Thông tin TBD |
|---|---|---|
| Dữ liệu dự án -> Năng lực đánh giá rủi ro | Một dự án được đánh giá về rủi ro không đáp ứng kế hoạch bàn giao/thời hạn. | Đầu vào tối thiểu, nguồn dữ liệu, độ mới, định nghĩa đặc trưng, nhãn mục tiêu. |
| Năng lực đánh giá rủi ro -> Đánh giá + Giải thích rủi ro | Ước lượng rủi ro và các yếu tố giải thích chính được hiển thị cho dự án. | Cách biểu diễn, thang đo, ngưỡng, ngữ nghĩa yếu tố, thứ tự, mức đóng góp. |
| Rủi ro -> Yêu cầu đề xuất | PM có thể yêu cầu đề xuất nhân sự cho dự án đang xem xét. | Payload yêu cầu, nhu cầu nhân sự, vai trò, kỹ năng, ràng buộc, ngữ cảnh rủi ro bắt buộc. |
| Đề xuất -> Phương án phân bổ | PM xem xét ứng viên có thứ hạng cùng giải thích cơ bản về mức phù hợp. | Trường nhận diện ứng viên, cách ứng viên trở thành phương án phân bổ. |
| Phương án -> Mô phỏng | PM đánh giá giả định một thay đổi phân bổ được đề xuất. | Cấu trúc phương án, ràng buộc, đầu vào có thể chỉnh sửa, một hay nhiều nhân sự. |
| Mô phỏng -> Kết quả tác động | PM xem tác động dự kiến của đúng phương án đã mô phỏng. | Chiều tác động, mốc cơ sở, định dạng so sánh, công thức, trạng thái thất bại. |
| Tác động -> Quyết định của PM | PM chấp nhận hoặc từ chối đề xuất đang xem xét. | Có bắt buộc mô phỏng hợp lệ trước khi chấp nhận hay không; chính sách dữ liệu lỗi thời. |
| Quyết định của PM -> Áp dụng | Nếu được phép áp dụng và áp dụng thành công, thay đổi thật khớp với đề xuất đã chấp nhận. | Thời điểm áp dụng, điều kiện đầy đủ, lưu trữ, thất bại, thử lại, rollback. |

## 4. Truy vết yêu cầu

| Khái niệm | Thông tin / Trường | Mục đích | Nguồn yêu cầu | Trạng thái | Thành phần sử dụng |
|---|---|---|---|---|---|
| Dự án | Dự án hiện tại PM đang xem xét | Gắn đánh giá rủi ro, đề xuất, phương án và quyết định vào đúng ngữ cảnh | Luồng MVP trong PRD; US-01 đến US-04 | ĐÃ XÁC NHẬN | Frontend, Backend, năng lực đánh giá rủi ro, năng lực đề xuất, năng lực mô phỏng |
| Dự án | Định danh/tên dự án | Phân biệt dự án trong UI và luồng | Thiết kế UI rủi ro PM; bản mẫu Frontend | TBD; tên trong bản mẫu là CHỈ DÙNG BẢN MẪU | Frontend, Backend |
| Dự án | Trạng thái dự án, nhóm, sprint, task, timeline | Ngữ cảnh có thể dùng cho rủi ro/nguồn lực | Phạm vi sản phẩm trong PRD | TBD | Năng lực đánh giá rủi ro, năng lực đề xuất, CHƯA XÁC ĐỊNH |
| Dữ liệu nhân sự | Kỹ năng | Ngữ cảnh có thể hỗ trợ đề xuất và đầu vào AI | Ví dụ trong phạm vi sản phẩm của PRD; ranh giới phạm vi User Stories | TBD về việc đây có phải nhóm dữ liệu bắt buộc và tập trường cụ thể hay không | Năng lực đề xuất, năng lực mô phỏng |
| Dữ liệu nhân sự | Mức độ sẵn sàng | Ngữ cảnh có thể hỗ trợ đề xuất và đầu vào AI | Ví dụ trong phạm vi sản phẩm của PRD; ranh giới phạm vi User Stories | TBD về việc đây có phải nhóm dữ liệu bắt buộc và tập trường cụ thể hay không | Năng lực đề xuất, năng lực mô phỏng |
| Dữ liệu nhân sự | Khối lượng công việc | Ngữ cảnh có thể hỗ trợ đề xuất và đầu vào AI | Ví dụ trong phạm vi sản phẩm của PRD; ranh giới phạm vi User Stories | TBD về việc đây có phải nhóm dữ liệu bắt buộc và tập trường cụ thể hay không | Năng lực đề xuất, năng lực mô phỏng |
| Dữ liệu nhân sự | Ngữ cảnh phân bổ | Ngữ cảnh có thể hỗ trợ đề xuất, mô phỏng và đầu vào AI | Ví dụ trong phạm vi sản phẩm của PRD; ranh giới phạm vi User Stories | TBD về việc đây có phải nhóm dữ liệu bắt buộc và tập trường cụ thể hay không | Năng lực đề xuất, năng lực mô phỏng |
| Đánh giá rủi ro | Rủi ro không đáp ứng kế hoạch bàn giao/thời hạn | Giúp PM hiểu rủi ro bàn giao dự án | Mục tiêu sản phẩm trong PRD; US-01; AC-US-01-01 | ĐÃ XÁC NHẬN | Frontend, Backend, năng lực đánh giá rủi ro |
| Đánh giá rủi ro | Điểm, tỷ lệ phần trăm, mức, màu, ngưỡng | Cách biểu diễn có thể dùng | User Stories TBD-02; UI rủi ro PM TBD | TBD | Frontend, năng lực đánh giá rủi ro |
| Giải thích rủi ro | Các yếu tố giải thích chính | Giúp PM hiểu rủi ro ở mức cao | Phạm vi MVP trong PRD; US-01; AC-US-01-01 | ĐÃ XÁC NHẬN | Frontend, năng lực đánh giá rủi ro |
| Giải thích rủi ro | Mức đóng góp của yếu tố, SHAP, trọng số, quan hệ nhân quả | Giải thích nội bộ hoặc toán học của mô hình | UI rủi ro PM TBD | TBD | Năng lực đánh giá rủi ro |
| Yêu cầu đề xuất | PM yêu cầu đề xuất cho dự án | Tiếp tục luồng MVP từ rủi ro sang đề xuất | US-02; AC-US-02-01 | ĐÃ XÁC NHẬN | Frontend, Backend, năng lực đề xuất |
| Đề xuất | Danh sách ứng viên có thứ hạng | Cho phép PM so sánh các ứng viên được đề xuất | Phạm vi MVP trong PRD; US-02; AC-US-02-01 | ĐÃ XÁC NHẬN | Frontend, năng lực đề xuất |
| Đề xuất | Giải thích cơ bản về mức phù hợp | Giải thích lý do ứng viên có thể phù hợp | Mục tiêu sản phẩm trong PRD; US-02; AC-US-02-01 | ĐÃ XÁC NHẬN | Frontend, năng lực đề xuất |
| Đề xuất | Điểm ghép nối, độ tin cậy, công thức xếp hạng | Chi tiết ghép nối định lượng | User Stories TBD-03, TBD-10 | TBD | Năng lực đề xuất |
| Đề xuất | Trạng thái không có ứng viên phù hợp | Tránh buộc ứng viên không phù hợp vào kết quả | AC-US-02-03; AC-US-02-05 | ĐÃ XÁC NHẬN | Frontend, Backend, năng lực đề xuất |
| Phương án | Thay đổi phân bổ được đề xuất | Đối tượng của mô phỏng giả định | Phạm vi MVP trong PRD; US-03; AC-US-03-01 | ĐÃ XÁC NHẬN | Frontend, năng lực mô phỏng |
| Phương án | Ánh xạ ứng viên thành phương án | Chuyển ứng viên/đề xuất thành đầu vào mô phỏng | UI đề xuất nhân sự; thiết kế Chapter 4 | TBD | Frontend, Backend, năng lực mô phỏng |
| Mô phỏng | Lần chạy mô phỏng không phá hủy dữ liệu | Đánh giá mà không thay đổi phân bổ thật | Phạm vi MVP trong PRD; AC-US-03-02 | ĐÃ XÁC NHẬN | Backend, năng lực mô phỏng |
| Tác động | Tác động dự kiến của đúng phương án đã mô phỏng | Hỗ trợ PM quyết định trước khi thay đổi thật | US-03; AC-US-03-01 | ĐÃ XÁC NHẬN | Frontend, năng lực mô phỏng |
| Tác động | Các chiều rủi ro/khối lượng công việc/kỹ năng/bàn giao/liên dự án | Các nhóm tác động có thể dùng | User Stories TBD-05 | TBD | Năng lực mô phỏng |
| Quyết định của PM | Chấp nhận / Từ chối | Giữ quyền quyết định cuối cùng của PM | Tổng quan PRD; US-04 | ĐÃ XÁC NHẬN | Frontend, quyết định/áp dụng |
| Quyết định của PM | Không chấp nhận rõ ràng thì không áp dụng | Ngăn kết quả AI hoặc sự im lặng trở thành phê duyệt | AC-US-04-03 | ĐÃ XÁC NHẬN | Backend, quyết định/áp dụng |
| Áp dụng | Áp dụng thành công phải khớp với đề xuất đã chấp nhận | Bảo vệ thay đổi phân bổ thật | AC-US-04-01 | ĐÃ XÁC NHẬN kèm điều kiện | Backend, quyết định/áp dụng |
| Áp dụng | Thời điểm áp dụng, phục hồi khi thất bại, rollback, thử lại | Hành vi áp dụng production | AC-US-04-06; TBD-07 | TBD | Quyết định/áp dụng |

## 5. Ngữ cảnh dự án

ĐÃ XÁC NHẬN:

- Dự án là ngữ cảnh chính cho đánh giá rủi ro, đề xuất, phương án, mô phỏng,
  tác động và quyết định của PM.
- Đánh giá rủi ro liên quan đến khả năng dự án đáp ứng kế hoạch bàn giao hoặc
  thời hạn dự kiến.

TBD:

- Định dạng định danh dự án, quy tắc hiển thị dự án, hệ thống phân loại trạng
  thái dự án.
- Cấu trúc bắt buộc cho nhóm/thành viên/timeline/sprint/task.
- Đầu vào hợp lệ tối thiểu cho đánh giá rủi ro, đề xuất và mô phỏng.
- Có bắt buộc trạng thái dự án, tiến độ/chu kỳ công việc, kỹ năng, mức độ sẵn
  sàng, khối lượng công việc hoặc ngữ cảnh phân bổ hay không. PRD chỉ nêu đây là
  ví dụ về dữ liệu hỗ trợ tối thiểu có thể dùng; PRD không xác nhận từng nhóm là
  đầu vào hoặc trường bắt buộc.
- Định nghĩa dữ liệu bàn giao lịch sử và bằng chứng rủi ro.

CHỈ DÙNG BẢN MẪU:

- `project-a-mock`, `project-b-mock`, `Dự án A [Minh họa]` và các nhãn hiển thị
  trong bản mẫu Frontend.

Hợp đồng này không chuyển Project, Sprint, Task, Member hoặc Allocation thành
thực thể database.

## 6. Đánh giá rủi ro

ĐÃ XÁC NHẬN:

- Đánh giá rủi ro tồn tại cho một dự án khi có đủ dữ liệu và quá trình đánh giá
  thành công.
- Kết quả ước lượng rủi ro dự án không đáp ứng kế hoạch bàn giao hoặc thời hạn
  dự kiến.
- Kết quả không có căn cứ hoặc không đủ dữ liệu không được trình bày là đáng tin cậy.

TBD:

- Cách biểu diễn rủi ro: điểm, xác suất, nhãn, mức, màu hoặc câu chữ.
- Ngưỡng, thang đo, định nghĩa mục tiêu/nhãn, độ tin cậy và phiên bản mô hình.
- Thời điểm đánh giá và hành vi liên quan đến độ mới.
- Quy tắc đủ dữ liệu và câu chữ cho trạng thái không thể đánh giá.

DẪN XUẤT:

- Kết quả rủi ro nhiều khả năng được dẫn xuất từ dữ liệu dự án/nhân sự, nhưng
  công thức đặc trưng và ngữ nghĩa mục tiêu vẫn là TBD.

## 7. Giải thích rủi ro

ĐÃ XÁC NHẬN:

- PM xem các yếu tố giải thích chính ở mức sản phẩm tổng quát.
- Giải thích giúp PM hiểu ước lượng rủi ro trước khi cân nhắc can thiệp.

TBD:

- Định danh, nhãn, giá trị, thứ tự, mức đóng góp, bằng chứng hỗ trợ của yếu tố và
  việc các yếu tố có hàm ý quan hệ nhân quả hay không.
- Giải thích có sử dụng độ quan trọng đặc trưng, SHAP, trọng số, độ tin cậy hay
  cách giải thích đơn giản ở mức sản phẩm hay không.

CHỈ DÙNG BẢN MẪU:

- Các chuỗi trong bản mẫu như `Yếu tố giải thích A [Minh họa]`.

Giải thích ở mức sản phẩm không đồng nghĩa với giải thích toán học của mô hình.

## 8. Yêu cầu đề xuất

ĐÃ XÁC NHẬN:

- PM có thể yêu cầu đề xuất nhân sự cho dự án đang xem xét.
- Việc xem hoặc nhận đề xuất không thay đổi phân bổ thật.

TBD:

- Payload yêu cầu, cấu trúc tham chiếu dự án, quan hệ phụ thuộc vào đánh giá rủi
  ro, nhu cầu nhân sự, vai trò yêu cầu, kỹ năng bắt buộc, khoảng thời gian, mức
  phân bổ, ràng buộc và hành vi khi không có kết quả rủi ro.

Bước chuyển hiện tại chỉ xác nhận ngữ cảnh dự án ở mức khái niệm; không định
nghĩa tham số API.

## 9. Đề xuất nhân sự

ĐÃ XÁC NHẬN:

- Kết quả đề xuất thành công cung cấp danh sách ứng viên có thứ hạng.
- Mỗi ứng viên có giải thích cơ bản về mức phù hợp.
- Trạng thái không có ứng viên phù hợp phải được thể hiện rõ.
- Hệ thống không được thêm ứng viên không phù hợp chỉ để tránh danh sách rỗng.

TBD:

- Trường nhận diện ứng viên, số lượng ứng viên, quy tắc đủ điều kiện, lý do loại,
  đồng hạng, công thức xếp hạng, điểm ghép nối, độ tin cậy, kỹ năng, mức độ sẵn
  sàng, khối lượng công việc và các trường hiển thị.
- Khác biệt giữa thiếu dữ liệu, lỗi tạo đề xuất, lỗi hệ thống và kết quả thật sự
  không có ứng viên phù hợp.

CHỈ DÙNG BẢN MẪU:

- `candidate-a-mock`, `displayLabel` và `MockRecommendationCandidatePresentation`.

Thứ hạng đã tồn tại; công thức xếp hạng chưa được xác định.

## 10. Ứng viên và phương án phân bổ

Ứng viên:

- ĐÃ XÁC NHẬN là khái niệm được trả về trong danh sách đề xuất có thứ hạng.
- Các trường nhận diện và hiển thị chính xác của ứng viên vẫn là TBD.

Phương án phân bổ:

- ĐÃ XÁC NHẬN là thay đổi phân bổ được đề xuất mà PM có thể mô phỏng.
- Cấu trúc chính xác của phương án vẫn là TBD.

Ranh giới:

- Ứng viên mặc định không đồng nghĩa với phương án phân bổ.
- Frontend hiện tại chuyển `candidateId` vào màn hình mô phỏng giả định, nhưng
  đây là hành vi trình bày của bản mẫu, không phải quan hệ miền nghiệp vụ.
- Cách chuyển ứng viên thành phương án vẫn là TBD.

## 11. Phương án giả định

ĐÃ XÁC NHẬN:

- PM đánh giá một thay đổi phân bổ được đề xuất thông qua mô phỏng giả định.
- Phương án phải luôn là giả định cho đến khi PM chấp nhận rõ ràng, việc áp dụng
  được cho phép và thực hiện thành công.

TBD:

- Tham chiếu phương án, định dạng tham chiếu dự án, tham chiếu ứng viên/nhân sự,
  thay đổi phân bổ, vai trò, effort, tỷ lệ phân bổ, ngày bắt đầu, ngày kết thúc,
  dự án bị ảnh hưởng, ràng buộc, đề xuất nguồn và việc một phương án có thể chứa
  nhiều ứng viên/nhân sự hay không.

CHỈ DÙNG BẢN MẪU:

- Hành động "Thử phương án minh họa" và nội dung dùng ứng viên làm ngữ cảnh
  trong bản mẫu.

## 12. Mô phỏng

ĐÃ XÁC NHẬN:

- Mô phỏng mang tính giả định và không phá hủy dữ liệu.
- Việc chạy, xem hoặc mô phỏng thất bại không thay đổi phân bổ thật.
- Khi thành công, kết quả phải thuộc đúng phương án đã mô phỏng.

TBD:

- Cấu trúc yêu cầu mô phỏng, vòng đời trạng thái, ngữ nghĩa trạng thái đang tải,
  timeout, hủy, thử lại, xử lý thất bại, cache, hành vi job bất đồng bộ và hành
  vi khi dữ liệu phương án thay đổi.

Tài liệu này không định nghĩa queue, chính sách thử lại hoặc kiến trúc bất đồng bộ.

## 13. Kết quả tác động

ĐÃ XÁC NHẬN:

- PM xem tác động dự kiến của đúng phương án đã mô phỏng.
- Tác động dùng để hỗ trợ quyết định, không phải bằng chứng rằng phân bổ đã thay đổi.

TBD:

- Các chiều tác động: rủi ro, khối lượng công việc, độ phủ kỹ năng, bàn giao,
  nguồn lực hoặc ảnh hưởng liên dự án.
- Mốc cơ sở, định dạng trước/sau, chênh lệch, khoảng thời gian so sánh, thang đo,
  giải thích và cách xử lý trường hợp không cải thiện hoặc tác động tiêu cực.

TÙY CHỌN:

- Bố cục mốc cơ sở/mô phỏng hai cột từ các thiết kế UI.

Hợp đồng này không đưa ra chỉ số tác động số giả.

## 14. Quyết định của PM

ĐÃ XÁC NHẬN:

- PM có thể chấp nhận hoặc từ chối một đề xuất.
- Từ chối có nghĩa đề xuất không được áp dụng.
- Không có chấp nhận rõ ràng thì không được xem là chấp nhận.
- Nếu PM chấp nhận, việc áp dụng được cho phép và thành công, thay đổi thật phải
  khớp với đề xuất đã chấp nhận.
- Nếu áp dụng thất bại, hệ thống không được báo áp dụng thành công.

TBD:

- Lưu trữ quyết định, chi tiết nhận diện chủ thể, thời điểm quyết định, lý do từ
  chối, xử lý quyết định lặp và việc có bắt buộc mô phỏng hợp lệ trước khi chấp
  nhận hay không.

TÙY CHỌN:

- Thu thập lý do từ chối như một cải tiến UX.

## 15. Ranh giới giữa quyết định và áp dụng

Quyết định:

- PM chọn Chấp nhận hoặc Từ chối cho đề xuất/phương án đang xem xét.

Áp dụng:

- Hệ thống chỉ thay đổi phân bổ thật nếu việc áp dụng được cho phép và thành
  công sau khi PM chấp nhận rõ ràng.

Các bất biến ĐÃ XÁC NHẬN:

- Chấp nhận không tự động đồng nghĩa với áp dụng thành công.
- Từ chối không áp dụng thay đổi.
- Không chấp nhận rõ ràng thì không áp dụng thay đổi.
- Áp dụng thành công phải tương ứng đúng phương án đã chấp nhận.
- Áp dụng thất bại không được báo là thành công.

TBD:

- Điều kiện đủ để áp dụng, thời điểm, trạng thái, kết quả, thất bại một phần,
  rollback, thử lại, phục hồi, lưu trữ và xác thực dữ liệu lỗi thời.

## 16. Độ mới và dữ liệu lỗi thời

Liên kết khái niệm:

- Yêu cầu gắn kết quả rủi ro với dự án đã được đánh giá, đề xuất với yêu cầu của
  dự án và tác động mô phỏng với đúng phương án đã mô phỏng. Liên kết này không
  định nghĩa ngữ nghĩa phiên bản dữ liệu hoặc độ mới, hay thời điểm kết quả trở
  nên lỗi thời, không hợp lệ hoặc không thể sử dụng.

TBD:

- Toàn bộ ngữ nghĩa về độ mới và lỗi thời, bao gồm việc một kết quả trước đó có
  thể tiếp tục được xem là hiện hành hoặc đáng tin cậy sau khi ngữ cảnh thay đổi
  hay không.
- Độ mới của rủi ro, đề xuất, mô phỏng; dữ liệu dự án/nhân sự/phân bổ thay đổi;
  đề xuất hết hạn; mô phỏng hết hạn; quy tắc tính lại; hành vi quyết định dựa
  trên dữ liệu lỗi thời và mọi TTL.

Không có thời hạn hết hiệu lực nào được xác định.

## 17. Ranh giới Frontend / Backend / AI

Định hướng kỹ thuật hiện tại của dự án, không phải kiến trúc sản phẩm đã xác nhận:

```text
Frontend
   ↓
Backend / Tầng ứng dụng
   ↓
Dịch vụ AI / Năng lực AI
```

Trách nhiệm khái niệm có thể cân nhắc — TBD:

- Frontend có thể trình bày rủi ro dự án, giải thích, đề xuất, ngữ cảnh phương
  án, tác động mô phỏng và điều khiển quyết định của PM, đồng thời ghi nhận tương
  tác rõ ràng của PM. UI bản mẫu phải giữ nhãn TBD và nhãn bản mẫu.
- Backend / Tầng ứng dụng có thể điều phối luồng nghiệp vụ, truy cập dữ liệu, lời
  gọi năng lực AI, quyết định, áp dụng hoặc lưu trữ. Không trách nhiệm nào trong
  số này và không ranh giới tương ứng nào được yêu cầu sản phẩm hiện tại xác nhận.
- Phân quyền, lưu trữ, ranh giới module, điều phối, quyền sở hữu dữ liệu và hành
  vi áp dụng vẫn là TBD.

Trách nhiệm của năng lực AI:

- Về khái niệm gồm Dự báo rủi ro, Đề xuất nhân sự và Mô phỏng/Tác động.
- Đây là các năng lực, không phải các dịch vụ hoặc microservice riêng đã xác nhận.

Ranh giới này chỉ ghi nhận định hướng kỹ thuật hiện tại của repository. Nó không
định nghĩa module dịch vụ, đơn vị triển khai, kiến trúc lưu trữ hoặc cơ chế giao tiếp.

## 18. Ranh giới đầu vào / đầu ra AI

### A. Năng lực đánh giá rủi ro

| Nhóm | Nội dung |
|---|---|
| Đầu vào ĐÃ XÁC NHẬN | Ngữ cảnh dự án đủ để đánh giá rủi ro bàn giao. |
| Đầu vào TBD | Nhãn mục tiêu, trường dự án, dữ liệu sprint/task, khối lượng công việc, phân bổ, lịch sử, độ mới, dữ liệu tối thiểu. |
| Đầu ra ĐÃ XÁC NHẬN | Ước lượng rủi ro cho dự án; các yếu tố giải thích chính. |
| Đầu ra TBD | Điểm/mức/xác suất, ngưỡng, độ tin cậy, phiên bản mô hình, thời điểm, mức đóng góp của yếu tố. |

### B. Năng lực đề xuất

| Nhóm | Nội dung |
|---|---|
| Đầu vào ĐÃ XÁC NHẬN | Ngữ cảnh dự án và yêu cầu đề xuất của PM. |
| Đầu vào TBD | Quan hệ phụ thuộc vào kết quả rủi ro, nhu cầu nhân sự, vai trò, kỹ năng, khoảng thời gian, ràng buộc, mức độ sẵn sàng, khối lượng công việc, ngữ cảnh phân bổ. |
| Đầu ra ĐÃ XÁC NHẬN | Danh sách ứng viên có thứ hạng; giải thích cơ bản về mức phù hợp; trạng thái không có ứng viên phù hợp. |
| Đầu ra TBD | Schema ứng viên, số lượng, công thức xếp hạng, điểm ghép nối, độ tin cậy, lý do loại, trạng thái không thể tạo kết quả/thất bại. |

### C. Năng lực mô phỏng / tác động

| Nhóm | Nội dung |
|---|---|
| Đầu vào ĐÃ XÁC NHẬN | Một thay đổi/phương án phân bổ được đề xuất cho dự án. |
| Đầu vào TBD | Schema phương án, ánh xạ ứng viên/nhân sự, mức phân bổ, ngày tháng, ràng buộc, mốc cơ sở, ngữ cảnh liên dự án. |
| Đầu ra ĐÃ XÁC NHẬN | Tác động dự kiến cho đúng phương án đã mô phỏng; hành vi không phá hủy dữ liệu. |
| Đầu ra TBD | Chiều tác động, định dạng mốc cơ sở/chênh lệch, giải thích, chi tiết thất bại, hành vi với kết quả lỗi thời. |

Không có thuật toán ML, thuật toán tối ưu, LLM hoặc họ mô hình nào được chọn.

## 19. Mô hình trình bày, miền nghiệp vụ, API, DB và AI

Mô hình trình bày != Khái niệm miền nghiệp vụ != DTO API != Thực thể database
!= Đầu vào/đầu ra AI.

Ví dụ:

- `MockRecommendationCandidatePresentation` xác nhận bản mẫu cần dữ liệu hiển
  thị cho danh sách ứng viên.
- Nó không xác nhận phản hồi API production, bảng database, schema đầu ra AI
  hoặc các trường nhận diện ứng viên cuối cùng.

Tương tự, việc định tuyến `candidateId` trong bản mẫu chỉ chứng minh cách quản lý
trạng thái UI hiện tại. Nó không chứng minh một ứng viên là phương án phân bổ
hoàn chỉnh.

## 20. Mức sẵn sàng của API

| Khu vực API | Mức sẵn sàng | Điểm chặn cụ thể |
|---|---|---|
| API rủi ro dự án | SẴN SÀNG MỘT PHẦN | Luồng và kết quả đã xác nhận; cách biểu diễn rủi ro, đầu vào tối thiểu, mức đủ dữ liệu, độ mới và ngữ nghĩa giải thích vẫn là TBD. |
| API đề xuất nhân sự | SẴN SÀNG MỘT PHẦN | Danh sách có thứ hạng và giải thích đã xác nhận; schema ứng viên, điều kiện đủ, quy tắc xếp hạng, trạng thái không có dữ liệu/thất bại và ngữ nghĩa điểm/độ tin cậy vẫn là TBD. |
| API mô phỏng | SẴN SÀNG MỘT PHẦN | Mô phỏng không phá hủy dữ liệu và tác động của đúng phương án đã xác nhận; schema phương án, ràng buộc, vòng đời trạng thái và chiều tác động vẫn là TBD. |
| API quyết định/áp dụng | SẴN SÀNG MỘT PHẦN | Bất biến chấp nhận/từ chối đã xác nhận; thời điểm áp dụng, điều kiện đủ, lưu trữ, phục hồi khi thất bại, quyết định lặp và xử lý dữ liệu lỗi thời vẫn là TBD. |

Không có endpoint production, HTTP method, request body hoặc response body nào
được định nghĩa.

## 21. Mức sẵn sàng của database

Dữ liệu khái niệm có thể được đánh giá để lưu trữ ở giai đoạn sau, không hàm ý
yêu cầu lưu trữ hiện tại:

- Ngữ cảnh dự án.
- Ngữ cảnh nhân sự/hỗ trợ có thể dùng, nếu sau này được xác nhận là bắt buộc.
- Kết quả đánh giá và giải thích rủi ro, nếu cần xem lại lịch sử.
- Kết quả đề xuất, nếu cần truy vết quyết định.
- Kết quả phương án/mô phỏng/tác động, nếu quyết định của PM phụ thuộc lịch sử rà soát.
- Quyết định của PM và kết quả áp dụng, nếu cần khả năng kiểm toán.

Hành vi khái niệm ĐÃ XÁC NHẬN, không phải yêu cầu lưu trữ:

- Phân bổ thật không được thay đổi trước khi PM chấp nhận rõ ràng, việc áp dụng
  được cho phép và thành công.
- Luồng MVP cần dữ liệu hỗ trợ tối thiểu cho đầu vào AI và hoạt động rà soát của
  PM. Yêu cầu hiện tại không xác lập rằng từng nhóm dữ liệu hoặc kết quả đều phải
  được lưu trữ.

TBD:

- Khái niệm nào được lưu trữ, thời hạn lưu, lịch sử, ERD, cấu trúc bảng, định
  danh, quan hệ và ngữ nghĩa transaction.

Không có đề xuất ERD nào được rà soát trong tác vụ này. Không có schema database
nào được định nghĩa.

## 22. Mức sẵn sàng của AI

| Khu vực AI | Mức sẵn sàng | Lý do |
|---|---|---|
| Mức sẵn sàng của mục tiêu/nhãn rủi ro | BỊ CHẶN | PRD để nhãn huấn luyện rủi ro vận hành là TBD. |
| Mức sẵn sàng của đặc trưng rủi ro | SẴN SÀNG MỘT PHẦN | PRD nêu các ví dụ dữ liệu hỗ trợ có thể dùng; nhóm dữ liệu bắt buộc, trường chính xác và dữ liệu tối thiểu vẫn là TBD. |
| Mức sẵn sàng của đầu ra giải thích rủi ro | SẴN SÀNG MỘT PHẦN | Các yếu tố chính đã xác nhận; ngữ nghĩa mức đóng góp và cách biểu diễn vẫn là TBD. |
| Mức sẵn sàng của đầu vào đề xuất | SẴN SÀNG MỘT PHẦN | Yêu cầu theo dự án đã xác nhận; nhu cầu nhân sự, kỹ năng, mức độ sẵn sàng, khối lượng công việc, ngữ cảnh phân bổ và ràng buộc vẫn là TBD. |
| Mức sẵn sàng của đầu ra đề xuất | SẴN SÀNG MỘT PHẦN | Ứng viên có thứ hạng và giải thích đã xác nhận; schema ứng viên, điểm, độ tin cậy và công thức xếp hạng vẫn là TBD. |
| Mức sẵn sàng của đầu vào mô phỏng | SẴN SÀNG MỘT PHẦN | Thay đổi phân bổ được đề xuất đã xác nhận; schema phương án và ràng buộc vẫn là TBD. |
| Mức sẵn sàng của đầu ra tác động | SẴN SÀNG MỘT PHẦN | Tác động dự kiến đã xác nhận; chiều, thang đo, mốc cơ sở và công thức vẫn là TBD. |

## 23. TBD / Câu hỏi mở

### Rủi ro

- Cách biểu diễn rủi ro.
- Mục tiêu / nhãn.
- Ngưỡng.
- Đầu vào tối thiểu.
- Ngữ nghĩa yếu tố.
- Độ mới.

### Đề xuất nhân sự

- Trường nhận diện ứng viên.
- Số lượng ứng viên.
- Điều kiện đủ của ứng viên.
- Quy tắc xếp hạng.
- Đồng hạng.
- Kỹ năng.
- Mức độ sẵn sàng.
- Khối lượng công việc.
- Điểm ghép nối.
- Độ tin cậy.

### Phương án

- Quan hệ giữa ứng viên và phương án phân bổ.
- Đầu vào phân bổ.
- Mức phân bổ.
- Ràng buộc.
- Số lượng nhân sự.
- Ảnh hưởng liên dự án.

### Tác động

- Chiều tác động.
- Mốc cơ sở.
- Định dạng so sánh.
- Thang đo.
- Giải thích.

### Quyết định / Áp dụng

- Điều kiện áp dụng.
- Thời điểm áp dụng.
- Lưu trữ.
- Hành vi với dữ liệu lỗi thời.
- Quyết định lặp.
- Thất bại.
- Thử lại.
- Rollback/phục hồi.
- Hành vi sau khi từ chối.

### Độ mới

- Chính sách hết hạn cho rủi ro, đề xuất, mô phỏng và quyết định.
- Dữ liệu dự án, nhân sự hoặc phân bổ thay đổi có yêu cầu tính lại hay không.
- PM có thể chấp nhận phương án sau khi ngữ cảnh thay đổi hay không.

## 24. Mức sẵn sàng cho giai đoạn tiếp theo

Sẵn sàng cho giai đoạn tiếp theo:

- Kiến trúc hệ thống mức cao có thể đánh giá định hướng Frontend, Backend/tầng
  ứng dụng và năng lực AI hiện tại trong khi vẫn giữ các trách nhiệm có thể cân
  nhắc ở trạng thái TBD.
- Hợp đồng API ban đầu có thể được soạn từ luồng khái niệm đã xác nhận trong khi
  giữ các trường chưa giải quyết là TBD.
- Công việc ERD/database có thể xác định các khái niệm có khả năng cần lưu trữ
  mà không xem tài liệu này là schema.
- Thiết kế AI có thể bắt đầu từ kết quả đã xác nhận và các đầu vào, đầu ra, nhãn,
  chỉ số của mô hình đang bị chặn hoặc còn TBD được ghi rõ.

Chưa sẵn sàng:

- DTO production, schema database, triển khai mô hình AI, công thức xếp hạng,
  công thức mô phỏng hoặc hành vi tự động áp dụng.
