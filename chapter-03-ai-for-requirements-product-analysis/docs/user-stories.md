# User Stories RMS-AI

## 1. Mục đích

Chuyển yêu cầu trong PRD thành nhu cầu, hành vi người dùng và User Stories phục vụ phân tích, kiểm thử và triển khai MVP sau khi các quyết định cần thiết được chốt. Đây không phải tài liệu thiết kế kỹ thuật.

Tài liệu phân tích thuộc Chapter 3, phần việc của Khánh: nhu cầu người dùng, User Stories và Acceptance Criteria. Nguồn phạm vi là [PRD v0.1](PRD.md); tiêu chí tương ứng nằm trong [acceptance-criteria.md](acceptance-criteria.md).

PRD vẫn ghi trạng thái bản nháp; phạm vi v0.1 được người giao việc xác nhận đã được nhóm chốt. Tài liệu này không xác nhận chức năng đã được triển khai và không thay thế PRD. Việc duyệt kế hoạch phân tích không đồng nghĩa duyệt mọi hành vi đề xuất hoặc quyết định còn thiếu.

## 2. Người dùng chính và người dùng hỗ trợ

Quản lý dự án (PM) là người dùng chính và người ra quyết định trong luồng AI của
MVP. HR và DEV là hai vai trò hỗ trợ đã được xác nhận ở mức sản phẩm:

- HR duy trì dữ liệu Employee, Skill và Employee ↔ Skill cần thiết cho RMS-AI.
- DEV xem thông tin, Skills và ngữ cảnh Project/Sprint/Task của chính mình khi
  dữ liệu đó tồn tại.

AI chỉ hỗ trợ PM, không có quyền quyết định cuối cùng. HR và DEV không thay thế
thẩm quyền Chấp nhận/Từ chối của PM. Sau khi danh tính và role được xác định,
sản phẩm phải cung cấp workspace và capability phù hợp với role; cơ chế xác
thực và phân quyền kỹ thuật vẫn là TBD.

User Account và Employee không được mặc định là cùng một khái niệm. DEV đại
diện cho một nhân sự sử dụng hệ thống; quan hệ chính xác giữa User Account và
Employee đối với DEV, PM và HR vẫn là TBD.

## 3. Nhu cầu chính của người dùng

| Mã nhu cầu | Nhu cầu được xác nhận | Giá trị với người dùng / sản phẩm | Nguồn yêu cầu |
| --- | --- | --- | --- |
| N-01 | Biết nguy cơ dự án không đáp ứng kế hoạch/thời hạn bàn giao và hiểu các yếu tố chính | Có cơ sở cân nhắc can thiệp nguồn lực | Mục tiêu sản phẩm; Phạm vi MVP — Dự báo rủi ro dự án |
| N-02 | Xem ứng viên được xếp hạng và lý do phù hợp với nhu cầu dự án | Cân nhắc phương án bù thiếu hụt kỹ năng/nguồn lực hoặc giảm rủi ro | Mục tiêu sản phẩm; Phạm vi MVP — Đề xuất nhân sự |
| N-03 | Xem trước tác động của thay đổi phân bổ mà không thay đổi dữ liệu thật | Đánh giá phương án trước khi quyết định | Phạm vi MVP — Mô phỏng giả định |
| N-04 | Chấp nhận hoặc từ chối thay đổi được đề xuất | Giữ quyền kiểm soát việc áp dụng phân bổ thật | Tổng quan sản phẩm; Phạm vi MVP — PM chấp nhận / từ chối |
| N-05 | HR xem và duy trì dữ liệu Employee, Skill và Employee ↔ Skill trong phạm vi RMS-AI | Cung cấp dữ liệu nguồn lực cho luồng Đề xuất nhân sự về sau | Quyết định sản phẩm ba vai trò; PRD — Người dùng mục tiêu; Phạm vi MVP |
| N-06 | DEV xem thông tin, Skills và ngữ cảnh Project/Sprint/Task của chính mình khi có dữ liệu | Tiêu thụ ngữ cảnh công việc liên quan mà không mở rộng thành bộ quản lý dự án đầy đủ | Quyết định sản phẩm ba vai trò; PRD — Người dùng mục tiêu; Phạm vi MVP |
| N-07 | Người dùng nhận workspace và capability phù hợp sau khi danh tính/role được xác định | Phân biệt phạm vi sản phẩm của DEV, PM và HR, đồng thời bảo toàn quyền quyết định của PM | Quyết định sản phẩm ba vai trò; PRD — Người dùng mục tiêu |

Phân biệt căn cứ:

- Nhu cầu đã xác nhận: N-01 đến N-07; không bảo đảm mọi đề xuất đều giảm rủi ro, trạng thái chờ phân bổ hoặc quá tải.
- Giả định chưa được xác nhận: PM tự nhập toàn bộ dữ liệu; chỉ dự án rủi ro cao mới được đề xuất; thiếu thông tin khối lượng công việc đồng nghĩa nhân sự đang rảnh. Không dùng các giả định này làm yêu cầu.
- Khoảng trống yêu cầu: PRD chưa mô tả đầy đủ trường Employee/Skill, kết quả rỗng, lỗi, dữ liệu lỗi thời, điều kiện phân bổ, thời điểm áp dụng, quan hệ User Account ↔ Employee hoặc cơ chế xác thực/phân quyền.
- TBD: các quyết định còn thiếu được quản lý trong bảng TBD bên dưới; không tự chọn hành vi để lấp khoảng trống.

## 4. User Stories

Không đặt mục tiêu số lượng story. US-01 đến US-04 bao phủ luồng quyết định AI
của PM; US-05 đến US-07 chỉ bao phủ phạm vi hỗ trợ tối thiểu đã được quyết định
cho HR, DEV và truy cập theo role. Không tách năng lực chỉ để tăng số lượng story.

### Quy ước

- Mã story: US-01 đến US-07; mã nhu cầu: N-01 đến N-07.
- Mức ưu tiên: Bắt buộc / Nên có / TBD. Chỉ gán Bắt buộc hoặc Nên có khi có căn cứ từ PRD/phạm vi MVP hoặc quyết định sản phẩm ba vai trò đã xác nhận; thiếu căn cứ thì ghi TBD. Bộ hiện tại chỉ có Bắt buộc vì các kết quả đều thuộc phạm vi sản phẩm đã chốt.
- ĐÃ XÁC NHẬN: mục tiêu nghiệp vụ có căn cứ trong PRD; không hàm ý mọi chi tiết của story đã đầy đủ.
- ĐỀ XUẤT: nội dung đề xuất cần nhóm rà soát, chưa phải cam kết đã duyệt.
- TBD: chưa đủ căn cứ xác định hành vi kỳ vọng; chưa phải tiêu chí nghiệm thu có thể kết luận đạt/trượt.
- AC được phân loại riêng; story ĐÃ XÁC NHẬN vẫn có thể chứa tình huống ĐỀ XUẤT hoặc TBD trong tài liệu AC.

### Luồng được bao phủ

Luồng cốt lõi đã chốt: Dự báo rủi ro dự án → Đề xuất nhân sự → Mô phỏng giả định → PM chấp nhận / từ chối. Áp dụng thành công là kết quả có điều kiện của chấp nhận, không thêm bước nghiệp vụ bắt buộc. Nhánh từ chối không áp dụng phương án. Sự chấp nhận rõ ràng là điều kiện cần; PRD chưa xác định toàn bộ điều kiện đủ để áp dụng.

Luồng hỗ trợ đã chốt: HR duy trì dữ liệu nguồn lực được phép để RMS-AI sử dụng
downstream; DEV là nguồn lực tham gia dự án và xem ngữ cảnh công việc của chính
mình; PM sử dụng ngữ cảnh dự án và nguồn lực trong luồng quyết định AI. Quyết
định của PM không mặc định là việc áp dụng đã thành công hoặc DEV đã nhận
assignment mới.

### US-01 — Xem và hiểu rủi ro bàn giao dự án

**Là một:** Quản lý dự án (PM)

**Tôi muốn:** Xem dự báo rủi ro bàn giao của dự án cùng các yếu tố chính giải thích kết quả.

**Để:** Có cơ sở quyết định có cần xem xét can thiệp nguồn lực hay không.

**Mức ưu tiên:** Bắt buộc

**Liên quan đến bước MVP:** Dự báo rủi ro.

**Nguồn yêu cầu:** PRD — Mục tiêu sản phẩm; Phạm vi MVP — Dự báo rủi ro dự án.

**Trạng thái yêu cầu:** ĐÃ XÁC NHẬN

Bao phủ N-01. Giải thích là một phần của việc hiểu dự báo, không tách thành story khác. Bỏ story này sẽ mất bước nhận diện rủi ro trong luồng đã chốt.

### US-02 — Cân nhắc ứng viên được đề xuất

**Là một:** Quản lý dự án (PM)

**Tôi muốn:** Yêu cầu đề xuất nhân sự cho dự án và xem danh sách ứng viên được xếp hạng kèm giải thích cơ bản về mức độ phù hợp.

**Để:** Cân nhắc phương án nhân sự nhằm giảm rủi ro hoặc bù thiếu hụt kỹ năng/nguồn lực.

**Mức ưu tiên:** Bắt buộc

**Liên quan đến bước MVP:** Đề xuất nhân sự.

**Nguồn yêu cầu:** PRD — Người dùng mục tiêu — PM; Mục tiêu sản phẩm; Phạm vi MVP — Đề xuất nhân sự.

**Trạng thái yêu cầu:** ĐÃ XÁC NHẬN

Bao phủ N-02. Yêu cầu đề xuất, thứ hạng và giải thích phục vụ cùng một quyết định. Thứ hạng không chứng minh ứng viên đầu tiên tối ưu tuyệt đối. Người giao việc đã xác nhận nguyên tắc phải thể hiện không có kết quả phù hợp tại AC-US-02-03 và không ép đưa ứng viên không phù hợp tại AC-US-02-05. Đây là căn cứ bổ sung cho tình huống kết quả rỗng, không phải nội dung vốn có trong PRD. Tiêu chí phù hợp và hành động tiếp theo vẫn TBD-03. Bỏ story này sẽ thiếu bước hỗ trợ tìm phương án nhân sự.

### US-03 — Đánh giá phương án bằng mô phỏng

**Là một:** Quản lý dự án (PM)

**Tôi muốn:** Mô phỏng một thay đổi phân bổ được đề xuất và xem tác động dự kiến của chính phương án đó mà không thay đổi phân bổ thật.

**Để:** Cân nhắc tác động trước khi đưa ra quyết định áp dụng.

**Mức ưu tiên:** Bắt buộc

**Liên quan đến bước MVP:** Mô phỏng thay đổi phân bổ.

**Nguồn yêu cầu:** PRD — Mục tiêu sản phẩm; Phạm vi MVP — Mô phỏng giả định và nguyên tắc không phá hủy dữ liệu.

**Trạng thái yêu cầu:** ĐÃ XÁC NHẬN

Bao phủ N-03. Xác định phương án đang xem xét để mô phỏng, chạy mô phỏng và xem
tác động thuộc cùng kết quả; không thêm story chọn phương án hoặc quản lý nhiều
kịch bản. Cách hình thành/chỉnh phương án còn ở TBD-04. Bỏ story này sẽ mất bước
đánh giá trước thay đổi thật.

### US-04 — Quyết định áp dụng hoặc từ chối phương án

**Là một:** Quản lý dự án (PM)

**Tôi muốn:** Chấp nhận hoặc từ chối phương án đã xem xét; khi được phép và áp dụng thành công, thay đổi thật tương ứng với phương án tôi đã chấp nhận.

**Để:** Giữ quyền quyết định cuối cùng đối với thay đổi phân bổ thật.

**Mức ưu tiên:** Bắt buộc

**Liên quan đến bước MVP:** PM chấp nhận / từ chối; áp dụng khi được phép là kết quả có điều kiện của chấp nhận.

**Nguồn yêu cầu:** PRD — Tổng quan sản phẩm; Phạm vi MVP — PM chấp nhận / từ chối và nguyên tắc chấp nhận rõ ràng trước thay đổi thật.

**Trạng thái yêu cầu:** ĐÃ XÁC NHẬN

Bao phủ N-04. Chấp nhận và từ chối là hai kết quả của cùng quyết định, không tách story. Không mặc định chấp nhận có hiệu lực ngay hoặc luôn áp dụng thành công. Bỏ story này sẽ không khép kín luồng theo quyền quyết định của PM.

### US-05 — HR duy trì dữ liệu nguồn lực cho RMS-AI

**Là một:** HR

**Tôi muốn:** Xem và duy trì dữ liệu Employee, Skill và mối quan hệ Employee ↔ Skill trong phạm vi cần thiết cho RMS-AI.

**Để:** Hệ thống có dữ liệu nguồn lực phục vụ luồng Đề xuất nhân sự về sau.

**Mức ưu tiên:** Bắt buộc

**Liên quan đến bước MVP:** Luồng hỗ trợ dữ liệu nguồn lực.

**Nguồn yêu cầu:** Quyết định sản phẩm ba vai trò; PRD — Người dùng mục tiêu; Phạm vi MVP.

**Trạng thái yêu cầu:** ĐÃ XÁC NHẬN

Bao phủ N-05. Story chỉ xác nhận phạm vi dữ liệu Employee, Skill và Employee ↔
Skill cần cho RMS-AI; không xác nhận availability, utilization, workload,
bench hoặc nghiệp vụ HR khác. Trường dữ liệu, quy tắc kỹ năng và hành vi dữ liệu
thiếu vẫn thuộc TBD-01 và TBD-03.

### US-06 — DEV xem ngữ cảnh công việc của bản thân

**Là một:** DEV

**Tôi muốn:** Xem thông tin cá nhân liên quan tới RMS-AI, bộ kỹ năng của mình và ngữ cảnh Project/Sprint/Task được cung cấp cho mình khi dữ liệu đó tồn tại.

**Để:** Hiểu ngữ cảnh công việc của bản thân trong phạm vi RMS-AI.

**Mức ưu tiên:** Bắt buộc

**Liên quan đến bước MVP:** Luồng hỗ trợ tiêu thụ ngữ cảnh công việc.

**Nguồn yêu cầu:** Quyết định sản phẩm ba vai trò; PRD — Người dùng mục tiêu; Phạm vi MVP.

**Trạng thái yêu cầu:** ĐÃ XÁC NHẬN

Bao phủ N-06. Story chỉ xác nhận quyền xem ngữ cảnh của chính DEV và trạng thái
không có dữ liệu khi ngữ cảnh chưa tồn tại. Việc DEV sửa Skill, gửi tiến độ,
thay đổi allocation, tự nhận task hoặc chạy simulation chưa được xác nhận và
vẫn thuộc TBD-12. Quyền Chấp nhận/Từ chối recommendation không thuộc DEV; PM
giữ quyền quyết định cuối cùng theo AC-US-06-05 và AC-US-07-02.

### US-07 — Truy cập workspace theo role

**Là một:** Người dùng RMS-AI có role DEV, PM hoặc HR đã được xác định

**Tôi muốn:** Được cung cấp workspace, điều hướng và capability phù hợp với role của mình.

**Để:** Sử dụng đúng phạm vi sản phẩm và giữ quyền quyết định AI thuộc về PM.

**Mức ưu tiên:** Bắt buộc

**Liên quan đến bước MVP:** Ranh giới truy cập sản phẩm liên vai trò.

**Nguồn yêu cầu:** Quyết định sản phẩm ba vai trò; PRD — Người dùng mục tiêu.

**Trạng thái yêu cầu:** ĐÃ XÁC NHẬN

Bao phủ N-07. Story xác nhận kết quả ở mức sản phẩm sau khi danh tính/role được
xác định; không chọn công nghệ xác thực, RBAC, lược đồ User hoặc cách ánh xạ
User Account ↔ Employee.

### Giới hạn phạm vi

Không mở rộng thành HRIS, ERP, Payroll System, Attendance System, Recruitment
Platform, Performance Review Platform hoặc bộ quản lý vòng đời nhân sự. Không
thêm vai trò Admin, quản lý dự án đầy đủ, CRUD đầy đủ Project/Sprint/Task,
dashboard, thông báo hoặc xuất báo cáo ngoài yêu cầu. Không thêm AI tự phân bổ,
quyết định thay PM hoặc quy trình phê duyệt nhiều cấp.

Không tạo story về bảng lương, tuyển dụng, chấm công, nghỉ phép, đánh giá hiệu suất, rewards, contracts, finance, lập kế hoạch dự án đầy đủ, biểu đồ Gantt, trò chuyện AI, quản lý quyền quản trị, quản lý task/sprint đầy đủ hoặc công việc kỹ thuật về API, cơ sở dữ liệu, mô hình ML và hạ tầng.

Dữ liệu hỗ trợ tối thiểu là phần phụ thuộc của cả luồng, theo PRD — Phạm vi sản
phẩm. HR được xác nhận duy trì Employee, Skill và Employee ↔ Skill trong phạm vi
RMS-AI, nhưng các trường chính xác và lifecycle vẫn là TBD. Mức độ sẵn sàng,
mức sử dụng, khối lượng công việc, trạng thái chờ phân bổ và ngữ cảnh phân bổ
không phải business rule đã chốt. Dữ liệu tổng hợp là hướng ưu tiên, chưa phải
bằng chứng bộ dữ liệu đã tồn tại.

Không có story Nên có trong bộ này. Không suy ra ngưỡng rủi ro, giới hạn phân bổ, công thức điểm, trọng số xếp hạng, màn hình, API, database hoặc model ML.

### Quyết định chưa xác định / TBD

| Mã | Nội dung cần nhóm quyết định | Ảnh hưởng | Căn cứ / khoảng trống |
| --- | --- | --- | --- |
| TBD-01 | Trường dữ liệu tối thiểu, điều kiện đủ/hợp lệ và xử lý dữ liệu thiếu; HR đã được xác nhận phụ trách dữ liệu Employee/Skill trong phạm vi RMS-AI nhưng các nguồn dữ liệu khác chưa chốt | Cả luồng; US-05, US-06 | PRD — Các vấn đề chưa quyết định; quyết định sản phẩm ba vai trò |
| TBD-02 | Cách biểu diễn rủi ro, ngưỡng phân loại nếu cần và độ cập nhật cần thiết của kết quả | US-01 | PRD chưa xác định đầu ra chi tiết |
| TBD-03 | Điều kiện ứng viên phù hợp/loại trừ, ngưỡng điểm nếu cần, số lượng ứng viên, trọng số; kết quả rỗng, thiếu thông tin sẵn sàng/khối lượng công việc, đồng hạng | US-02 | PRD xác nhận xếp hạng nhưng chưa chốt các quy tắc hoặc con số này |
| TBD-04 | Nội dung một thay đổi phân bổ; các ràng buộc và hành vi khi có khả năng vi phạm | US-03, US-04 | PRD chưa xác định quy tắc phân bổ |
| TBD-05 | Chỉ báo tác động mô phỏng, mốc so sánh và phạm vi ảnh hưởng tới dự án khác | US-03 | PRD chỉ mô tả tác động ở mức khái quát |
| TBD-06 | Điều kiện đủ và thời điểm áp dụng; có bắt buộc kết quả mô phỏng hợp lệ trước chấp nhận không | US-04 | PRD chốt quyền PM nhưng chưa chốt điều kiện chuyển bước |
| TBD-07 | Hành vi khi dự báo/đề xuất/mô phỏng/áp dụng thất bại, kể cả áp dụng không đầy đủ | Cả luồng | PRD chưa mô tả quy trình lỗi và phục hồi |
| TBD-08 | Xử lý dữ liệu hoặc phương án thay đổi sau mô phỏng, quyết định gửi lặp | US-03, US-04 | PRD chưa mô tả các tình huống này |
| TBD-09 | Hành vi khi PM không tiếp tục phương án ngoài việc không được tự áp dụng | US-03, US-04 | Không tự thêm hủy, lưu nháp hoặc hết hạn |
| TBD-10 | Nhãn huấn luyện rủi ro, chỉ số đánh giá, cách tính điểm/mô hình ghép nối, quy mô demo, dữ liệu thật/kết hợp trong tương lai | Đánh giá chất lượng và dữ liệu | Giữ nguyên các TBD tương ứng của PRD; không quyết định trong tài liệu này |
| TBD-11 | Quan hệ User Account ↔ Employee, cơ chế xác thực, kiểm tra role, phân quyền kỹ thuật và quyền xem dữ liệu chi tiết | US-05, US-06, US-07 | PRD chỉ xác nhận kết quả truy cập ở mức sản phẩm |
| TBD-12 | Các capability chưa được xác định của DEV: sửa Skill, gửi tiến độ, thay đổi allocation, tự nhận task và chạy simulation | US-06 | Không có căn cứ xác nhận trong quyết định sản phẩm hiện tại |

Các khoảng trống không làm thay đổi bốn kết quả cốt lõi, nhưng giới hạn mức độ
hoàn chỉnh của AC. Chưa dùng tài liệu này để tuyên bố sẵn sàng triển khai toàn
bộ hoặc đã nghiệm thu MVP.

## 5. Ma trận truy vết

| User Story | Nhu cầu người dùng | Bước MVP | Nguồn PRD | Mức ưu tiên | Trạng thái yêu cầu |
| --- | --- | --- | --- | --- | --- |
| US-01 | N-01 — Hiểu rủi ro và yếu tố chính | Dự báo | Mục tiêu sản phẩm; Phạm vi MVP — Dự báo rủi ro dự án | Bắt buộc | ĐÃ XÁC NHẬN |
| US-02 | N-02 — Cân nhắc ứng viên và lý do phù hợp | Đề xuất | Người dùng mục tiêu — PM; Phạm vi MVP — Đề xuất nhân sự | Bắt buộc | ĐÃ XÁC NHẬN |
| US-03 | N-03 — Đánh giá tác động trước thay đổi thật | Mô phỏng | Phạm vi MVP — Mô phỏng giả định; nguyên tắc không phá hủy dữ liệu | Bắt buộc | ĐÃ XÁC NHẬN |
| US-04 | N-04 — Kiểm soát quyết định phân bổ | Quyết định và áp dụng khi được phép | Tổng quan sản phẩm; Phạm vi MVP — PM chấp nhận / từ chối; chấp nhận rõ ràng | Bắt buộc | ĐÃ XÁC NHẬN |
| US-05 | N-05 — Duy trì dữ liệu nguồn lực cho RMS-AI | Luồng hỗ trợ dữ liệu nguồn lực | Người dùng mục tiêu — HR; Phạm vi MVP | Bắt buộc | ĐÃ XÁC NHẬN |
| US-06 | N-06 — Xem ngữ cảnh công việc của bản thân | Luồng hỗ trợ DEV | Người dùng mục tiêu — DEV; Phạm vi MVP | Bắt buộc | ĐÃ XÁC NHẬN |
| US-07 | N-07 — Truy cập capability phù hợp với role | Ranh giới truy cập sản phẩm | Người dùng mục tiêu; yêu cầu workspace theo role | Bắt buộc | ĐÃ XÁC NHẬN |
