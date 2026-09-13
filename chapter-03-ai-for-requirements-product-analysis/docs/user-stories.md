# User Stories RMS-AI

## 1. Mục đích

Chuyển yêu cầu trong PRD thành nhu cầu, hành vi người dùng và User Stories phục vụ phân tích, kiểm thử và triển khai MVP sau khi các quyết định cần thiết được chốt. Đây không phải tài liệu thiết kế kỹ thuật.

Tài liệu phân tích thuộc Chapter 3, phần việc của Khánh: nhu cầu người dùng, User Stories và Acceptance Criteria. Nguồn phạm vi là [PRD v0.1](PRD.md); tiêu chí tương ứng nằm trong [acceptance-criteria.md](acceptance-criteria.md).

PRD vẫn ghi trạng thái bản nháp; phạm vi v0.1 được người giao việc xác nhận đã được nhóm chốt. Tài liệu này không xác nhận chức năng đã được triển khai và không thay thế PRD. Việc duyệt kế hoạch phân tích không đồng nghĩa duyệt mọi hành vi đề xuất hoặc quyết định còn thiếu.

## 2. Người dùng chính

Quản lý dự án (PM) là actor chính của MVP. PRD chưa yêu cầu workflow độc lập của actor phụ để hoàn thành luồng, nên bộ tối thiểu không thêm story cho vai trò khác. AI chỉ hỗ trợ PM, không có quyền quyết định cuối cùng.

## 3. Nhu cầu chính của người dùng

| Mã nhu cầu | Nhu cầu được PRD xác nhận | Giá trị với PM | Nguồn trong PRD |
| --- | --- | --- | --- |
| N-01 | Biết nguy cơ dự án không đáp ứng kế hoạch/thời hạn bàn giao và hiểu các yếu tố chính | Có cơ sở cân nhắc can thiệp nguồn lực | Mục tiêu sản phẩm; Phạm vi MVP — Dự báo rủi ro dự án |
| N-02 | Xem ứng viên được xếp hạng và lý do phù hợp với nhu cầu dự án | Cân nhắc phương án bù thiếu hụt kỹ năng/nguồn lực hoặc giảm rủi ro | Mục tiêu sản phẩm; Phạm vi MVP — Đề xuất nhân sự |
| N-03 | Xem trước tác động của thay đổi phân bổ mà không thay đổi dữ liệu thật | Đánh giá phương án trước khi quyết định | Phạm vi MVP — Mô phỏng giả định |
| N-04 | Chấp nhận hoặc từ chối thay đổi được đề xuất | Giữ quyền kiểm soát việc áp dụng phân bổ thật | Tổng quan sản phẩm; Phạm vi MVP — PM chấp nhận / từ chối |

Phân biệt căn cứ:

- Nhu cầu đã xác nhận: N-01 đến N-04; không bảo đảm mọi đề xuất đều giảm rủi ro, bench hoặc quá tải.
- Giả định chưa được xác nhận: PM tự nhập toàn bộ dữ liệu; chỉ dự án rủi ro cao mới được đề xuất; thiếu thông tin khối lượng công việc đồng nghĩa nhân sự đang rảnh. Không dùng các giả định này làm requirement.
- Khoảng trống yêu cầu: PRD chưa mô tả đầy đủ kết quả rỗng, lỗi, dữ liệu lỗi thời, điều kiện phân bổ và thời điểm áp dụng.
- TBD: các quyết định còn thiếu được quản lý trong bảng TBD bên dưới; không tự chọn hành vi để lấp khoảng trống.

## 4. User Stories

Không đặt mục tiêu số lượng story. Bộ hiện tại là kết quả phân tích các outcome độc lập: hiểu rủi ro, cân nhắc nhân sự, đánh giá tác động và quyết định phân bổ. Không tách capability chỉ để tăng số lượng story.

### Quy ước

- Mã story: US-01 đến US-04; mã nhu cầu: N-01 đến N-04.
- Mức ưu tiên: Bắt buộc / Nên có / TBD. Chỉ gán Bắt buộc hoặc Nên có khi có căn cứ từ PRD/phạm vi MVP đã xác nhận; thiếu căn cứ thì ghi TBD. Bộ hiện tại chỉ có Bắt buộc vì các outcome đều thuộc luồng MVP đã chốt.
- CONFIRMED: mục tiêu nghiệp vụ có căn cứ trong PRD; không hàm ý mọi chi tiết của story đã đầy đủ.
- PROPOSED: nội dung đề xuất cần nhóm review, chưa phải cam kết đã duyệt.
- TBD: chưa đủ căn cứ xác định hành vi kỳ vọng; chưa phải tiêu chí nghiệm thu có thể kết luận đạt/trượt.
- AC được phân loại riêng; story CONFIRMED vẫn có thể chứa tình huống PROPOSED hoặc TBD trong tài liệu AC.

### Luồng được bao phủ

Luồng đã chốt: Dự báo rủi ro dự án → Đề xuất nhân sự → Mô phỏng giả định → PM chấp nhận / từ chối. Áp dụng thành công là kết quả có điều kiện của chấp nhận, không thêm bước nghiệp vụ bắt buộc. Nhánh từ chối không áp dụng phương án. Sự chấp nhận rõ ràng là điều kiện cần; PRD chưa xác định toàn bộ điều kiện đủ để áp dụng.

### US-01 — Xem và hiểu rủi ro bàn giao dự án

**Là một:** Quản lý dự án (PM)

**Tôi muốn:** Xem dự báo rủi ro bàn giao của dự án cùng các yếu tố chính giải thích kết quả.

**Để:** Có cơ sở quyết định có cần xem xét can thiệp nguồn lực hay không.

**Mức ưu tiên:** Bắt buộc

**Liên quan đến bước MVP:** Dự báo rủi ro.

**Nguồn requirement:** PRD — Mục tiêu sản phẩm; Phạm vi MVP — Dự báo rủi ro dự án.

**Trạng thái requirement:** CONFIRMED

Bao phủ N-01. Giải thích là một phần của việc hiểu dự báo, không tách thành story khác. Bỏ story này sẽ mất bước nhận diện rủi ro trong luồng đã chốt.

### US-02 — Cân nhắc ứng viên được đề xuất

**Là một:** Quản lý dự án (PM)

**Tôi muốn:** Yêu cầu đề xuất nhân sự cho dự án và xem danh sách ứng viên được xếp hạng kèm giải thích cơ bản về mức độ phù hợp.

**Để:** Cân nhắc phương án nhân sự nhằm giảm rủi ro hoặc bù thiếu hụt kỹ năng/nguồn lực.

**Mức ưu tiên:** Bắt buộc

**Liên quan đến bước MVP:** Đề xuất nhân sự.

**Nguồn requirement:** PRD — Người dùng mục tiêu — PM; Mục tiêu sản phẩm; Phạm vi MVP — Đề xuất nhân sự.

**Trạng thái requirement:** CONFIRMED

Bao phủ N-02. Yêu cầu đề xuất, thứ hạng và giải thích phục vụ cùng một quyết định. Thứ hạng không chứng minh ứng viên đầu tiên tối ưu tuyệt đối. Người giao việc đã xác nhận nguyên tắc phải thể hiện không có kết quả phù hợp tại AC-US-02-03 và không ép đưa ứng viên không phù hợp tại AC-US-02-05. Đây là căn cứ bổ sung cho tình huống kết quả rỗng, không phải nội dung vốn có trong PRD. Tiêu chí phù hợp và hành động tiếp theo vẫn TBD-03. Bỏ story này sẽ thiếu bước hỗ trợ tìm phương án nhân sự.

### US-03 — Đánh giá phương án bằng mô phỏng

**Là một:** Quản lý dự án (PM)

**Tôi muốn:** Mô phỏng một thay đổi phân bổ được đề xuất và xem tác động dự kiến của chính phương án đó mà không thay đổi phân bổ thật.

**Để:** Cân nhắc tác động trước khi đưa ra quyết định áp dụng.

**Mức ưu tiên:** Bắt buộc

**Liên quan đến bước MVP:** Mô phỏng thay đổi phân bổ.

**Nguồn requirement:** PRD — Mục tiêu sản phẩm; Phạm vi MVP — Mô phỏng giả định và nguyên tắc không phá hủy dữ liệu.

**Trạng thái requirement:** CONFIRMED

Bao phủ N-03. Xác định phương án đang xem xét để mô phỏng, chạy mô phỏng và xem tác động thuộc cùng outcome; không thêm story chọn phương án hoặc quản lý nhiều kịch bản. Cách hình thành/chỉnh phương án còn ở TBD-04. Bỏ story này sẽ mất bước đánh giá trước thay đổi thật.

### US-04 — Quyết định áp dụng hoặc từ chối phương án

**Là một:** Quản lý dự án (PM)

**Tôi muốn:** Chấp nhận hoặc từ chối phương án đã xem xét; khi được phép và áp dụng thành công, thay đổi thật tương ứng với phương án tôi đã chấp nhận.

**Để:** Giữ quyền quyết định cuối cùng đối với thay đổi phân bổ thật.

**Mức ưu tiên:** Bắt buộc

**Liên quan đến bước MVP:** PM chấp nhận / từ chối; áp dụng khi được phép là kết quả có điều kiện của chấp nhận.

**Nguồn requirement:** PRD — Tổng quan sản phẩm; Phạm vi MVP — PM chấp nhận / từ chối và nguyên tắc chấp nhận rõ ràng trước thay đổi thật.

**Trạng thái requirement:** CONFIRMED

Bao phủ N-04. Chấp nhận và từ chối là hai kết quả của cùng quyết định, không tách story. Không mặc định chấp nhận có hiệu lực ngay hoặc luôn áp dụng thành công. Bỏ story này sẽ không khép kín luồng theo quyền quyết định của PM.

### Giới hạn phạm vi

Không thêm hệ thống HR, cổng nhân viên/quản trị viên, quản lý dự án đầy đủ, CRUD đầy đủ project/task/sprint/employee/skill, dashboard, thông báo, xuất báo cáo ngoài requirement. Không thêm AI tự phân bổ, quyết định thay PM hoặc quy trình phê duyệt nhiều cấp.

Không tạo story về bảng lương, tuyển dụng, chấm công, nghỉ phép, đánh giá hiệu suất, lập kế hoạch dự án đầy đủ, biểu đồ Gantt, trò chuyện AI, quản lý quyền quản trị, quản lý task/sprint đầy đủ hoặc công việc kỹ thuật về API, cơ sở dữ liệu, mô hình ML và hạ tầng.

Dữ liệu hỗ trợ tối thiểu là dependency của cả luồng, theo PRD — Phạm vi sản phẩm. Các ví dụ về trạng thái dự án, tiến độ, kỹ năng, mức độ sẵn sàng, khối lượng công việc và ngữ cảnh phân bổ chưa phải danh sách trường bắt buộc. Dữ liệu tổng hợp là hướng ưu tiên, chưa phải bằng chứng bộ dữ liệu đã tồn tại. Không tạo story CRUD chỉ để giải quyết dependency này.

Không có story Nên có trong bộ này. Không suy ra ngưỡng rủi ro, giới hạn phân bổ, công thức điểm, trọng số xếp hạng, màn hình, API, database hoặc model ML.

### Quyết định chưa xác định / TBD

| Mã | Nội dung cần nhóm quyết định | Ảnh hưởng | Căn cứ / khoảng trống |
| --- | --- | --- | --- |
| TBD-01 | Dữ liệu tối thiểu, người cung cấp, điều kiện đủ/hợp lệ và xử lý dữ liệu thiếu | Cả luồng | PRD — Các vấn đề chưa quyết định; chưa có người chịu trách nhiệm dữ liệu |
| TBD-02 | Cách biểu diễn rủi ro, ngưỡng phân loại nếu cần và độ cập nhật cần thiết của kết quả | US-01 | PRD chưa xác định đầu ra chi tiết |
| TBD-03 | Điều kiện ứng viên phù hợp/loại trừ, ngưỡng điểm nếu cần, số lượng ứng viên, trọng số; kết quả rỗng, thiếu thông tin sẵn sàng/khối lượng công việc, đồng hạng | US-02 | PRD xác nhận xếp hạng nhưng chưa chốt các quy tắc hoặc con số này |
| TBD-04 | Nội dung một thay đổi phân bổ; các ràng buộc và hành vi khi có khả năng vi phạm | US-03, US-04 | PRD chưa xác định quy tắc phân bổ |
| TBD-05 | Chỉ báo tác động mô phỏng, mốc so sánh và phạm vi ảnh hưởng tới dự án khác | US-03 | PRD chỉ mô tả tác động ở mức khái quát |
| TBD-06 | Điều kiện đủ và thời điểm áp dụng; có bắt buộc kết quả mô phỏng hợp lệ trước chấp nhận không | US-04 | PRD chốt quyền PM nhưng chưa chốt điều kiện chuyển bước |
| TBD-07 | Hành vi khi dự báo/đề xuất/mô phỏng/áp dụng thất bại, kể cả áp dụng không đầy đủ | Cả luồng | PRD chưa mô tả quy trình lỗi và phục hồi |
| TBD-08 | Xử lý dữ liệu hoặc phương án thay đổi sau mô phỏng, quyết định gửi lặp | US-03, US-04 | PRD chưa mô tả các tình huống này |
| TBD-09 | Hành vi khi PM không tiếp tục phương án ngoài việc không được tự áp dụng | US-03, US-04 | Không tự thêm hủy, lưu nháp hoặc hết hạn |
| TBD-10 | Nhãn huấn luyện rủi ro, chỉ số đánh giá, cách tính điểm/mô hình ghép nối, quy mô demo, dữ liệu thật/kết hợp trong tương lai | Đánh giá chất lượng và dữ liệu | Giữ nguyên các TBD tương ứng của PRD; không quyết định trong tài liệu này |

Các gap không làm thay đổi bốn outcome cốt lõi, nhưng giới hạn mức độ hoàn chỉnh của AC. Chưa dùng tài liệu này để tuyên bố sẵn sàng triển khai toàn bộ hoặc đã nghiệm thu MVP.

## 5. Ma trận truy vết

| User Story | Nhu cầu người dùng | Bước MVP | Nguồn PRD | Mức ưu tiên | Trạng thái requirement |
| --- | --- | --- | --- | --- | --- |
| US-01 | N-01 — Hiểu rủi ro và yếu tố chính | Dự báo | Mục tiêu sản phẩm; Phạm vi MVP — Dự báo rủi ro dự án | Bắt buộc | CONFIRMED |
| US-02 | N-02 — Cân nhắc ứng viên và lý do phù hợp | Đề xuất | Người dùng mục tiêu — PM; Phạm vi MVP — Đề xuất nhân sự | Bắt buộc | CONFIRMED |
| US-03 | N-03 — Đánh giá tác động trước thay đổi thật | Mô phỏng | Phạm vi MVP — Mô phỏng giả định; nguyên tắc không phá hủy dữ liệu | Bắt buộc | CONFIRMED |
| US-04 | N-04 — Kiểm soát quyết định phân bổ | Quyết định và áp dụng khi được phép | Tổng quan sản phẩm; Phạm vi MVP — PM chấp nhận / từ chối; chấp nhận rõ ràng | Bắt buộc | CONFIRMED |
