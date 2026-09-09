# PRD RMS-AI v0.1

## Thông tin tài liệu

- Tên sản phẩm: RMS-AI — Hệ thống dự báo rủi ro dự án và tối ưu hóa nguồn lực có ứng dụng AI
- Phiên bản tài liệu: v0.1
- Trạng thái: Bản nháp
- Giai đoạn môn học hiện tại: Cột mốc 1 — Khởi tạo dự án + PRD v0.1

Tài liệu này xác định định hướng sản phẩm ban đầu cho RMS-AI. Đây chưa phải là đặc tả cuối cùng và không khẳng định rằng các chức năng dự kiến đã tồn tại.

## Tổng quan sản phẩm

RMS-AI là hệ thống hỗ trợ ra quyết định có ứng dụng AI cho quản lý nguồn lực trong dự án phần mềm. Hệ thống giúp quản lý dự án (PM) nhận diện rủi ro tiến độ bàn giao dự án, hiểu các thiếu hụt về nguồn lực và kỹ năng, xem xét đề xuất nhân sự, và thử nghiệm thay đổi phân bổ trước khi đưa ra quyết định thật.

Luồng quyết định MVP đã thống nhất là:

```text
Dự báo rủi ro dự án -> Đề xuất nhân sự -> Mô phỏng giả định
-> PM chấp nhận / từ chối
```

RMS-AI hỗ trợ con người ra quyết định. Hệ thống có thể gợi ý rủi ro, ứng viên và kết quả mô phỏng, nhưng PM vẫn là người quyết định cuối cùng.

## Bài toán / Vấn đề cần giải quyết

Dự án phần mềm có thể bị chậm tiến độ vì các tín hiệu rủi ro, thiếu hụt kỹ năng, mất cân bằng khối lượng công việc và năng lực nhân sự đang rảnh thường được xem xét quá muộn hoặc nằm rải rác ở nhiều công cụ. PM có thể thiếu một góc nhìn rõ ràng về dự án nào đang có rủi ro, nhân sự nào có thể hỗ trợ, hoặc liệu một thay đổi phân bổ được đề xuất có cải thiện tình hình hay không.

RMS-AI giải quyết vấn đề này bằng cách tổ chức các tín hiệu quan trọng về dự án và nguồn lực thành một quy trình hỗ trợ ra quyết định có ứng dụng AI. Sản phẩm giúp nhóm đưa ra quyết định phân bổ sớm hơn và có cơ sở hơn, nhưng không trở thành hệ thống quản lý nhân sự đầy đủ hoặc nền tảng quản lý dự án tổng quát.

## Mục tiêu sản phẩm

Trong PRD v0.1, rủi ro tiến độ bàn giao dự án là khả năng một dự án không đáp ứng được kế hoạch bàn giao hoặc thời hạn đã dự kiến.

- Phát hiện rủi ro tiến độ bàn giao dự án sớm hơn dựa trên các tín hiệu sẵn có về dự án và nguồn lực.
- Xác định thiếu hụt kỹ năng và nguồn lực có thể ảnh hưởng đến tiến độ bàn giao.
- Cung cấp danh sách ứng viên được xếp hạng kèm giải thích cơ bản về mức độ phù hợp.
- Hỗ trợ giảm thời gian nhân sự ở trạng thái chờ phân bổ bằng cách làm rõ năng lực nhân sự đang sẵn sàng.
- Hỗ trợ giảm quá tải và phân bổ nguồn lực kém hiệu quả.
- Cho phép PM mô phỏng thay đổi phân bổ trước khi áp dụng.
- Giữ các đề xuất của AI đủ giải thích được để PM xem xét, chấp nhận hoặc từ chối.

## Người dùng mục tiêu

- Quản lý dự án (PM): người dùng chính của MVP, chịu trách nhiệm xem xét rủi ro, yêu cầu đề xuất nhân sự, chạy mô phỏng, và chấp nhận hoặc từ chối thay đổi phân bổ.
- Quản lý nguồn lực: người dùng phụ trợ, có thể hỗ trợ xem xét năng lực, trạng thái chờ phân bổ và mức độ phù hợp của phân bổ khi cần.
- Trưởng nhóm hoặc người phụ trách bàn giao: người dùng phụ trợ, có thể cung cấp ngữ cảnh về trạng thái dự án, kỹ năng hoặc rủi ro tiến độ.
- Nhân sự, nhân viên và quản trị viên: chỉ là người dùng tiềm năng trong tương lai hoặc vai trò hỗ trợ; PRD v0.1 không định nghĩa quy trình MVP riêng cho các vai trò này.

## Phạm vi sản phẩm

Phạm vi sản phẩm đã xác nhận là MVP tập trung vào quyết định về rủi ro dự án và phân bổ nguồn lực. RMS-AI chỉ nên sử dụng lượng dữ liệu tối thiểu cần thiết để cung cấp đầu vào cho AI và hỗ trợ PM xem xét quyết định, chẳng hạn như trạng thái dự án, tiến độ công việc hoặc chu kỳ phát triển, kỹ năng nhân sự, mức độ sẵn sàng, khối lượng công việc và ngữ cảnh phân bổ.

Các khả năng quản lý cơ bản chỉ nên được đưa vào khi cần thiết để cung cấp dữ liệu cho dự báo rủi ro, đề xuất nhân sự hoặc mô phỏng. Các ý tưởng tương lai phải được tách khỏi cam kết của MVP cho đến khi nhóm xác nhận.

Đối với phát triển MVP và khả năng tái lập, dữ liệu tổng hợp là hướng dữ liệu ban đầu được ưu tiên. Dữ liệu thật hoặc dữ liệu kết hợp có thể được xem xét như một mở rộng trong tương lai.

## Phạm vi MVP

MVP bao gồm:

- Dự báo rủi ro dự án: ước lượng khả năng một dự án không đáp ứng được kế hoạch bàn giao hoặc thời hạn đã dự kiến, đồng thời hiển thị các yếu tố chính ở mức khái quát.
- Đề xuất nhân sự: cung cấp danh sách ứng viên được xếp hạng kèm giải thích cơ bản về mức độ phù hợp để giảm rủi ro hoặc bù đắp thiếu hụt kỹ năng/nguồn lực.
- Mô phỏng giả định: xem trước tác động có thể có của một thay đổi phân bổ được đề xuất mà không thay đổi dữ liệu phân bổ thật.
- PM chấp nhận / từ chối: cho phép PM quyết định áp dụng hoặc từ chối thay đổi được đề xuất.
- Quản lý dữ liệu hỗ trợ ở mức tối thiểu cần thiết để cung cấp đầu vào cho AI và hỗ trợ PM xem xét quyết định.

Mô phỏng giả định phải có tính không phá hủy dữ liệu. Kết quả mô phỏng không được thay đổi dữ liệu phân bổ thật trừ khi PM chấp nhận thay đổi một cách rõ ràng.

## Ngoài phạm vi

Các nội dung sau chưa được quyết định trong PRD v0.1. Chúng có thể được phân tích hoặc thiết kế ở các cột mốc sau nếu nhóm phê duyệt và nếu thật sự cần cho MVP:

- Chức năng của một nền tảng quản lý nhân sự đầy đủ.
- Chức năng của một nền tảng quản lý dự án đầy đủ.
- Lược đồ cơ sở dữ liệu chi tiết, ERD hoặc mô hình dữ liệu cuối cùng.
- Điểm cuối API chính xác hoặc kiến trúc mô-đun NestJS.
- Màn hình giao diện chi tiết, khung màn hình hoặc thiết kế hình ảnh.
- Lựa chọn thuật toán ML cuối cùng, bao gồm việc xem XGBoost hoặc Random Forest là quyết định đã chốt.
- Công thức tối ưu hóa hoặc trọng số ghép nối cuối cùng.
- Thiết kế chi tiết về xác thực và phân quyền, bao gồm ma trận RBAC.
- Docker, CI/CD, kiến trúc triển khai, nhà cung cấp đám mây hoặc hạ tầng vận hành thực tế.
- Triển khai mô hình AI/ML, quy trình huấn luyện hoặc mã chức năng nghiệp vụ.

## Các vấn đề chưa quyết định / TBD

- Định nghĩa vận hành chính xác của nhãn huấn luyện cho rủi ro dự án.
- Chỉ số đánh giá cuối cùng cho mô hình rủi ro.
- Cách tính điểm hoặc mô hình ghép nối nhân sự cuối cùng.
- Các trường dữ liệu hỗ trợ tối thiểu cần thiết cho đầu vào AI và việc PM xem xét quyết định.
- Quy mô bộ dữ liệu demo chính xác.
- Việc các phiên bản tương lai có sử dụng dữ liệu tổ chức thật hoặc dữ liệu kết hợp hay không.
