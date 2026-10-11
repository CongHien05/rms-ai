# Hướng dẫn Chapter 3

## Mục tiêu của chapter

Xác định yêu cầu sản phẩm RMS-AI ở mức PRD ban đầu mà không cam kết các quyết
định chi tiết về kiến trúc hoặc triển khai.

## Mục đích của PRD

PRD phải mô tả bài toán sản phẩm, mục tiêu, người dùng, phạm vi đã xác nhận, phạm
vi MVP, nội dung ngoài phạm vi và các câu hỏi chưa được giải quyết. PRD định
hướng cho công việc thiết kế, kiến trúc và triển khai sau này.

## Tài liệu dự kiến

- `docs/PRD.md`
- `prompts/generate-prd.prompt.md`

## Quy trình yêu cầu có AI hỗ trợ

Sử dụng AI để soạn thảo và hiệu chỉnh cách diễn đạt yêu cầu, xác định câu hỏi còn
thiếu và kiểm tra việc mở rộng phạm vi ngoài dự kiến. Giữ đầu ra AI ngắn gọn và
đánh dấu chi tiết chưa được quyết định là `TBD`.

## Trách nhiệm rà soát của con người

Nhóm phải xác nhận PRD phản ánh đúng MVP đã thống nhất, không cam kết quá mức về
chức năng và vẫn phù hợp với dự án đại học gồm hai thành viên.

## Định nghĩa hoàn thành

- PRD v0.1 tồn tại trong thư mục `docs` của Chapter 3.
- Các phần của PRD phù hợp với phạm vi sản phẩm được giao.
- Tài liệu prompt tồn tại.
- Tài liệu hướng dẫn tồn tại.
- Các quyết định tương lai được đánh dấu là `TBD`.
- Không đưa ra sớm quyết định về database, API, UI, ML, triển khai, Docker hoặc
  CI/CD.
