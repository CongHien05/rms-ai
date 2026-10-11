# Hướng dẫn Chapter 4

## Mục tiêu của chapter

Tạo các tài liệu thiết kế sản phẩm có thể rà soát cho RMS-AI MVP thông qua:

- Luồng người dùng.
- Wireframe và UI độ trung thực thấp.
- Bản mẫu có phạm vi giới hạn.
- Rà soát thiết kế có AI hỗ trợ và con người phê duyệt.

Chapter 4 mô tả cách trình bày và rà soát các yêu cầu đã xác nhận. Chapter này
không định nghĩa kiến trúc production hoặc ngầm hoàn thiện các quy tắc nghiệp vụ
còn thiếu.

## Nguồn tham chiếu có thẩm quyền

Sử dụng các tài liệu hiện tại theo thứ tự sau để truy vết yêu cầu:

1. PRD.
2. User Stories.
3. Acceptance Criteria.

Luồng người dùng, wireframe và bản mẫu hiện có cung cấp tính liên tục cho thiết
kế nhưng không thay thế cơ sở yêu cầu.

## Quy ước trạng thái

### ĐÃ XÁC NHẬN

Nội dung có căn cứ trực tiếp từ PRD, User Stories hoặc Acceptance Criteria hiện tại.

### GIAO DIỆN ĐỀ XUẤT

Nội dung là lựa chọn trình bày hoặc tương tác được đề xuất để hiện thực hóa một
yêu cầu. Đây vẫn là lựa chọn thiết kế và không trở thành quy tắc nghiệp vụ.

### TBD

Yêu cầu hoặc quy tắc nghiệp vụ chưa có đủ thông tin để đưa ra quyết định chính
xác. Giữ rõ khoảng trống này để nhóm rà soát.

## Nguyên tắc thiết kế

- Lựa chọn UI không trở thành quy tắc nghiệp vụ.
- Không tự tạo ngưỡng, điểm, công thức, quy tắc phân bổ hoặc quy tắc phê duyệt.
- Không thiết kế database, API hoặc mô hình ML trong một tài liệu UI.
- Mô tả bản mẫu đúng là bản mẫu, không phải hành vi production.
- AI hỗ trợ phân tích và soạn thảo thiết kế; con người rà soát và quyết định.
- Truy vết mọi màn hình hoặc bước quan trọng về yêu cầu, hoặc đánh dấu là
  GIAO DIỆN ĐỀ XUẤT.
- Giữ các quy tắc nghiệp vụ chưa giải quyết là TBD thay vì điền bằng hành vi giả lập.
- Giữ MVP tập trung vào hỗ trợ quyết định của PM thay vì nền tảng HR hoặc quản lý
  dự án đầy đủ.

## Quy trình thiết kế có AI hỗ trợ

1. Đọc PRD, User Stories và Acceptance Criteria.
2. Đọc các tài liệu UI ở bước trước và xác định ngữ cảnh chuyển tiếp.
3. Tách yêu cầu ĐÃ XÁC NHẬN, lựa chọn GIAO DIỆN ĐỀ XUẤT và khoảng trống TBD.
4. Soạn luồng, wireframe, trạng thái và ánh xạ truy vết.
5. Rà soát quy tắc nghiệp vụ không có căn cứ, trạng thái còn thiếu và việc mở
   rộng phạm vi ngoài dự kiến.
6. Ghi nhận quyết định rà soát của con người trước khi coi một đề xuất là được duyệt.

Tài liệu prompt hỗ trợ khả năng tái lập của quy trình này. Chúng không phải bản
ghi lịch sử trừ khi repository có bằng chứng xác nhận điều đó.

## Định nghĩa hoàn thành

Chapter 4 hoàn thành khi:

- Luồng chính liên quan được lập tài liệu.
- Wireframe hoặc UI độ trung thực thấp đủ để nhóm rà soát.
- Các trạng thái quan trọng như đang tải, rỗng, thiếu dữ liệu, lỗi và quyết định
  được xem xét khi phù hợp.
- User Stories và Acceptance Criteria được truy vết đến các bước UI quan trọng.
- Nội dung ĐÃ XÁC NHẬN, GIAO DIỆN ĐỀ XUẤT và TBD được phân biệt rõ.
- Quy tắc nghiệp vụ chưa giải quyết vẫn là TBD.
- Đề xuất do AI tạo đã được con người rà soát.
- Tài liệu không đưa ra quyết định triển khai API, database hoặc ML chưa được phê duyệt.
