# Hướng dẫn Chương 3

## Mục tiêu chương

Xác định yêu cầu sản phẩm RMS-AI ở mức PRD ban đầu mà chưa chốt các quyết định chi tiết về kiến trúc hoặc triển khai.

## Mục đích PRD

PRD cần mô tả bài toán sản phẩm, mục tiêu, người dùng, phạm vi đã xác nhận, phạm vi MVP, nội dung ngoài phạm vi và các vấn đề chưa được quyết định. Tài liệu này dùng để định hướng cho thiết kế, kiến trúc và triển khai ở các cột mốc sau.

## Tài liệu cần có

- `docs/PRD.md`
- `prompts/generate-prd.prompt.md`

## Quy trình phân tích yêu cầu có hỗ trợ AI

Sử dụng AI để soạn nháp và tinh chỉnh cách diễn đạt yêu cầu, xác định câu hỏi còn thiếu và kiểm tra rủi ro mở rộng phạm vi. Kết quả do AI tạo ra cần ngắn gọn, và các chi tiết chưa được quyết định phải được đánh dấu là TBD.

## Trách nhiệm rà soát của con người

Nhóm phải xác nhận rằng PRD phản ánh đúng MVP đã thống nhất, không hứa hẹn quá mức về chức năng và vẫn phù hợp với dự án môn học gồm 2 thành viên.

## Tiêu chí hoàn thành

- PRD v0.1 tồn tại trong thư mục tài liệu của Chương 3
- các mục của PRD khớp với phạm vi sản phẩm được giao
- tài liệu prompt tồn tại
- tài liệu hướng dẫn tồn tại
- các quyết định tương lai được đánh dấu là TBD
- không đưa vào quá sớm các quyết định về cơ sở dữ liệu, API, giao diện, học máy, triển khai, Docker hoặc CI/CD
