# Prompt: Tạo PRD RMS-AI v0.1

Prompt này tóm tắt yêu cầu tạo PRD đã được dùng trong quy trình làm việc với Codex để có thể tái lập quá trình phân tích yêu cầu. Đây không phải là bản ghi lịch sử riêng biệt.

## Mục tiêu

Tạo PRD v0.1 ban đầu cho RMS-AI, hệ thống dự báo rủi ro dự án và tối ưu hóa nguồn lực có ứng dụng AI. Xem PRD là bản nháp sớm và nguồn tham chiếu chính cho phạm vi sản phẩm.

## Nội dung prompt

Hãy viết PRD v0.1 ngắn gọn và chuyên nghiệp cho RMS-AI.

Mục đích sản phẩm là hỗ trợ quản lý nguồn lực trong dự án phần mềm bằng cách giúp nhóm phát hiện rủi ro tiến độ sớm hơn, xác định thiếu hụt kỹ năng và nguồn lực, đề xuất nhân sự phù hợp, giảm thời gian chờ phân bổ, giảm quá tải và mô phỏng thay đổi phân bổ trước khi PM áp dụng.

Sử dụng luồng quyết định MVP sau:

```text
Dự báo rủi ro dự án
→ Đề xuất nhân sự
→ Mô phỏng giả định
→ PM chấp nhận / từ chối
```

Chỉ bao gồm các mục sau:

- Thông tin tài liệu
- Tổng quan sản phẩm
- Bài toán / Vấn đề cần giải quyết
- Mục tiêu sản phẩm
- Người dùng mục tiêu
- Phạm vi sản phẩm
- Phạm vi MVP
- Ngoài phạm vi
- Các vấn đề chưa quyết định / TBD

Phân biệt rõ phạm vi đã xác nhận với ý tưởng tương lai. Không khẳng định rằng chức năng dự kiến đã tồn tại. Giữ MVP tập trung vào hỗ trợ ra quyết định có ứng dụng AI, trong đó PM là người quyết định cuối cùng. Mô phỏng giả định phải không phá hủy dữ liệu và không được thay đổi dữ liệu phân bổ thật trừ khi PM chấp nhận thay đổi.

Không nêu lược đồ cơ sở dữ liệu chi tiết, ERD, API cụ thể, kiến trúc mô-đun NestJS, giao diện chi tiết, khung màn hình, mô hình học máy cuối cùng, công thức tối ưu hóa, kiến trúc triển khai, Docker, CI/CD, nhà cung cấp đám mây hoặc RBAC chi tiết.
