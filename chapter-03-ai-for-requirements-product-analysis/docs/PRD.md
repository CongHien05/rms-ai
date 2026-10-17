# PRD RMS-AI v0.1

## Thông tin tài liệu

- Tên sản phẩm: RMS-AI — Hệ thống dự báo rủi ro dự án và tối ưu hóa nguồn lực có ứng dụng AI
- Phiên bản tài liệu: v0.1
- Trạng thái: Bản nháp
- Giai đoạn môn học hiện tại: Cột mốc 1 — Khởi tạo dự án + PRD v0.1

Tài liệu này xác định định hướng sản phẩm ban đầu cho RMS-AI. Đây chưa phải là đặc tả cuối cùng và không khẳng định rằng các chức năng dự kiến đã tồn tại.

## Tổng quan sản phẩm

RMS-AI là hệ thống hỗ trợ ra quyết định có ứng dụng AI cho quản lý nguồn lực trong dự án phần mềm. Sản phẩm phục vụ ba nhóm người dùng DEV, PM và HR; trong đó quản lý dự án (PM) là người dùng chính của luồng quyết định AI. Hệ thống giúp PM nhận diện rủi ro tiến độ bàn giao dự án, hiểu các thiếu hụt về nguồn lực và kỹ năng, xem xét đề xuất nhân sự, và thử nghiệm thay đổi phân bổ trước khi đưa ra quyết định.

Luồng quyết định MVP đã thống nhất là:

```text
Dự án -> Đánh giá rủi ro -> Giải thích rủi ro
-> Đề xuất nhân sự -> Mô phỏng giả định -> Quyết định của PM
-> Chấp nhận / Từ chối
```

RMS-AI hỗ trợ con người ra quyết định. Hệ thống có thể gợi ý rủi ro, ứng viên và kết quả mô phỏng, nhưng PM vẫn là người quyết định cuối cùng. HR hỗ trợ hình thành dữ liệu nguồn lực và DEV tiêu thụ ngữ cảnh công việc phù hợp với mình; hai vai trò này không thay thế thẩm quyền quyết định của PM.

## Bài toán / Vấn đề cần giải quyết

Dự án phần mềm có thể bị chậm tiến độ vì các tín hiệu rủi ro, thiếu hụt kỹ năng, mất cân bằng khối lượng công việc và năng lực nhân sự đang rảnh thường được xem xét quá muộn hoặc nằm rải rác ở nhiều công cụ. PM có thể thiếu một góc nhìn rõ ràng về dự án nào đang có rủi ro, nhân sự nào có thể hỗ trợ, hoặc liệu một thay đổi phân bổ được đề xuất có cải thiện tình hình hay không.

RMS-AI giải quyết vấn đề này bằng cách tổ chức các tín hiệu quan trọng về dự án và nguồn lực thành một quy trình hỗ trợ ra quyết định có ứng dụng AI. Sản phẩm giúp nhóm đưa ra quyết định phân bổ sớm hơn và có cơ sở hơn, nhưng không trở thành hệ thống quản lý nhân sự đầy đủ hoặc nền tảng quản lý dự án tổng quát.

## Mục tiêu sản phẩm

Trong PRD v0.1, rủi ro tiến độ bàn giao dự án là khả năng một dự án không đáp ứng được kế hoạch bàn giao hoặc thời hạn đã dự kiến.

- Phát hiện rủi ro tiến độ bàn giao dự án sớm hơn dựa trên các tín hiệu sẵn có về dự án và nguồn lực.
- Xác định thiếu hụt kỹ năng và nguồn lực có thể ảnh hưởng đến tiến độ bàn giao.
- Cung cấp danh sách ứng viên được xếp hạng kèm giải thích cơ bản về mức độ phù hợp.
- Hỗ trợ PM làm rõ ngữ cảnh nguồn lực có thể liên quan tới nhu cầu dự án; ngữ nghĩa mức độ sẵn sàng, mức sử dụng, khối lượng công việc và trạng thái chờ phân bổ vẫn là TBD.
- Hỗ trợ giảm quá tải và phân bổ nguồn lực kém hiệu quả.
- Cho phép PM mô phỏng thay đổi phân bổ trước khi áp dụng.
- Giữ các đề xuất của AI đủ giải thích được để PM xem xét, chấp nhận hoặc từ chối.

## Người dùng mục tiêu

- PM — người dùng chính và người ra quyết định: xem/nghiên cứu dự án, xem đánh giá và yếu tố giải thích rủi ro, yêu cầu đề xuất nhân sự, xem ứng viên, thử phương án mô phỏng, xem tác động dự kiến, và chấp nhận hoặc từ chối phương án. AI không tự quyết định hoặc tự áp dụng thay PM.
- HR — người dùng hỗ trợ nguồn lực: xem và duy trì dữ liệu Employee, Skill và mối quan hệ Employee ↔ Skill ở mức cần thiết cho RMS-AI, để cung cấp dữ liệu nguồn lực cho luồng Đề xuất nhân sự về sau. Vai trò này không mở rộng thành quản lý toàn bộ vòng đời nhân sự.
- DEV — nhân sự tham gia dự án: xem thông tin cá nhân liên quan tới RMS-AI, bộ kỹ năng của chính mình, và ngữ cảnh Project/Sprint/Task được cung cấp cho mình khi dữ liệu đó tồn tại. Các hành động ghi dữ liệu của DEV chưa được xác nhận.

Sau khi danh tính và role của người dùng được xác định, sản phẩm phải cung cấp workspace, điều hướng và capability phù hợp với role DEV, PM hoặc HR. Đây là yêu cầu sản phẩm; cơ chế xác thực và phân quyền kỹ thuật vẫn là TBD.

User Account và Employee là hai khái niệm khác nhau. DEV đại diện cho một nhân sự sử dụng hệ thống; PM và HR có thể đồng thời là nhân viên của tổ chức, nhưng quan hệ định danh chính xác giữa tài khoản người dùng và bản ghi Employee vẫn là TBD. PRD không định nghĩa lược đồ dữ liệu cho quan hệ này.

## Phạm vi sản phẩm

Phạm vi sản phẩm đã xác nhận là MVP tập trung vào quyết định về rủi ro dự án và phân bổ nguồn lực. RMS-AI chỉ nên sử dụng lượng dữ liệu tối thiểu cần thiết để cung cấp đầu vào cho AI và hỗ trợ PM xem xét quyết định. Trong phạm vi ba vai trò, HR duy trì dữ liệu Employee, Skill và Employee ↔ Skill cần thiết; DEV xem ngữ cảnh cá nhân và Project/Sprint/Task của mình khi dữ liệu tồn tại. Các trường dữ liệu tối thiểu khác, bao gồm mức độ sẵn sàng, mức sử dụng, khối lượng công việc, trạng thái chờ phân bổ và ngữ cảnh phân bổ, vẫn là TBD nếu sau này cần cho đề xuất nhân sự.

Các khả năng quản lý cơ bản chỉ nên được đưa vào khi cần thiết để cung cấp dữ liệu cho dự báo rủi ro, đề xuất nhân sự hoặc mô phỏng. Các ý tưởng tương lai phải được tách khỏi cam kết của MVP cho đến khi nhóm xác nhận.

Đối với phát triển MVP và khả năng tái lập, dữ liệu tổng hợp là hướng dữ liệu ban đầu được ưu tiên. Dữ liệu thật hoặc dữ liệu kết hợp có thể được xem xét như một mở rộng trong tương lai.

## Phạm vi MVP

MVP bao gồm:

- Dự báo rủi ro dự án: ước lượng khả năng một dự án không đáp ứng được kế hoạch bàn giao hoặc thời hạn đã dự kiến, đồng thời hiển thị các yếu tố chính ở mức khái quát.
- Đề xuất nhân sự: cung cấp danh sách ứng viên được xếp hạng kèm giải thích cơ bản về mức độ phù hợp để giảm rủi ro hoặc bù đắp thiếu hụt kỹ năng/nguồn lực.
- Mô phỏng giả định: xem trước tác động có thể có của một thay đổi phân bổ được đề xuất mà không thay đổi dữ liệu phân bổ thật.
- PM chấp nhận / từ chối: cho phép PM ghi nhận quyết định chấp nhận hoặc từ chối phương án được đề xuất. Chấp nhận là quyết định của PM, không mặc định rằng việc áp dụng đã thành công.
- HR xem và duy trì dữ liệu Employee, Skill và Employee ↔ Skill ở mức tối thiểu cần thiết để cung cấp dữ liệu nguồn lực cho RMS-AI.
- DEV xem thông tin cá nhân, Skills và ngữ cảnh Project/Sprint/Task của chính mình khi dữ liệu đó tồn tại.
- Workspace và capability được trình bày phù hợp với role DEV, PM hoặc HR sau khi danh tính/role được xác định.

Mô phỏng giả định phải có tính không phá hủy dữ liệu. Kết quả mô phỏng không được thay đổi dữ liệu phân bổ thật. Quyết định Chấp nhận của PM và việc áp dụng thành công là hai ranh giới khác nhau; điều kiện, thời điểm và hành vi áp dụng vẫn là TBD.

Luồng liên vai trò ở mức sản phẩm:

```text
HR -> duy trì dữ liệu nguồn lực được phép -> đầu vào downstream cho RMS-AI
DEV -> là nguồn lực tham gia dự án -> xem ngữ cảnh công việc của chính mình
PM -> dùng ngữ cảnh dự án và nguồn lực -> Risk -> Recommendation
   -> Simulation -> Decision
```

Luồng này không khẳng định rằng PM Chấp nhận sẽ tự động thay đổi phân bổ hoặc DEV lập tức nhận assignment mới.

## Ngoài phạm vi

Các nội dung sau chưa được quyết định trong PRD v0.1. Chúng có thể được phân tích hoặc thiết kế ở các cột mốc sau nếu nhóm phê duyệt và nếu thật sự cần cho MVP:

- HRIS, ERP hoặc chức năng quản lý toàn bộ vòng đời nhân sự.
- Payroll, attendance, leave, recruitment, performance review, rewards, contracts hoặc finance.
- Nền tảng quản lý dự án tổng quát. Project/Sprint/Task chỉ tồn tại ở mức cần thiết cho rủi ro, ngữ cảnh nguồn lực và luồng sản phẩm/demo.
- Quản lý dữ liệu Employee/Skill ngoài phạm vi cần cho dữ liệu nguồn lực, đề xuất nhân sự và demo liên vai trò.
- Lược đồ cơ sở dữ liệu chi tiết, ERD hoặc mô hình dữ liệu cuối cùng.
- Điểm cuối API chính xác hoặc kiến trúc mô-đun NestJS.
- Màn hình giao diện chi tiết, khung màn hình hoặc thiết kế hình ảnh.
- Lựa chọn thuật toán ML cuối cùng, bao gồm việc xem XGBoost hoặc Random Forest là quyết định đã chốt.
- Công thức tối ưu hóa hoặc trọng số ghép nối cuối cùng.
- Thiết kế chi tiết về xác thực và phân quyền, bao gồm ma trận RBAC.
- Cơ chế xác thực cụ thể, lược đồ User Account hoặc cách ánh xạ User Account ↔ Employee.
- Docker, CI/CD, kiến trúc triển khai, nhà cung cấp đám mây hoặc hạ tầng vận hành thực tế.
- Triển khai mô hình AI/ML, quy trình huấn luyện hoặc mã chức năng nghiệp vụ.

## Các vấn đề chưa quyết định / TBD

- Định nghĩa vận hành chính xác của nhãn huấn luyện cho rủi ro dự án.
- Chỉ số đánh giá cuối cùng cho mô hình rủi ro.
- Cách tính điểm hoặc mô hình ghép nối nhân sự cuối cùng.
- Các trường dữ liệu hỗ trợ tối thiểu cần thiết cho đầu vào AI và việc PM xem xét quyết định.
- Ngữ nghĩa mức độ sẵn sàng, mức sử dụng, khối lượng công việc và trạng thái chờ phân bổ.
- Thang mức kỹ năng và ý nghĩa của từng mức.
- Quan hệ định danh chính xác giữa User Account và Employee đối với DEV, PM và HR.
- Cơ chế xác thực, kiểm tra role và phân quyền kỹ thuật.
- Đơn vị/lượng phân bổ, điều kiện và thời điểm áp dụng; rollback, thử lại và phục hồi khi áp dụng thất bại.
- Chính sách độ mới và dữ liệu lỗi thời cho đánh giá, đề xuất, mô phỏng và quyết định.
- Quy mô bộ dữ liệu demo chính xác.
- Việc các phiên bản tương lai có sử dụng dữ liệu tổ chức thật hoặc dữ liệu kết hợp hay không.
