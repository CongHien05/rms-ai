# Chapter 4 — AI trong Thiết kế Sản phẩm

## 1. Mục tiêu theo đề cương

Sử dụng AI để hỗ trợ xây dựng luồng người dùng, UI độ trung thực thấp, các trạng
thái giao diện và vòng lặp rà soát thiết kế có truy vết yêu cầu.

## 2. RMS-AI áp dụng chương này như thế nào

RMS-AI mô hình hóa trải nghiệm PM theo chuỗi Đánh giá rủi ro → Đề xuất nhân sự →
Mô phỏng giả định → Quyết định của PM. UI hiện tại là bản mẫu phục vụ rà soát,
không phải bằng chứng của công cụ dự báo AI, ghép nối nhân sự hay mô phỏng thật.

## 3. Tài liệu hiện có

- [Thiết kế không gian làm việc cho 3 vai trò RMS-AI](docs/three-role-workspace-ui-design.md)
- [Thiết kế UI mô phỏng giả định và quyết định của PM](docs/what-if-simulation-ui-design.md)
- [Thiết kế UI tổng quan vận hành](docs/operations-overview-ui-design.md)
- [Thiết kế UI đánh giá rủi ro dự án](../chapter-03-ai-for-requirements-product-analysis/docs/pm-risk-ui-design.md)
- [Thiết kế UI đề xuất nhân sự](../chapter-03-ai-for-requirements-product-analysis/docs/resource-recommendation-ui-design.md)
- [Prompt thiết kế mô phỏng giả định](prompts/generate-simulation-ui.prompt.md)
- [Hướng dẫn Chapter 4](GUIDELINE.md)
- [Bản mẫu Frontend](../frontend/README.md)

Hai tài liệu UI đầu tiên đã được tạo trước khi cấu trúc theo dõi theo chapter
được bổ sung và được giữ nguyên tại vị trí hiện có.

## 4. Tiến độ

- [x] Mô tả luồng và wireframe cho các bước chính của PM.
- [x] Ghi nhận các trạng thái rỗng, không hợp lệ, đang tải và thiếu dữ liệu quan trọng.
- [x] Truy vết các quyết định UI về PRD, User Stories và Acceptance Criteria.
- [x] Xây dựng bản mẫu Frontend theo phạm vi thiết kế hiện tại.
- [x] Bổ sung thiết kế và bản mẫu không gian làm việc PM, HR, DEV ở mức trình bày; xác
  thực và phân quyền kỹ thuật vẫn là TBD.
- [ ] Hoàn tất rà soát của con người cho toàn bộ `GIAO DIỆN ĐỀ XUẤT` và câu hỏi `TBD`.

## 5. Bằng chứng quy trình có AI hỗ trợ

Prompt thiết kế có thể tái sử dụng, tài liệu thiết kế, vòng thiết kế lại để hiệu
chỉnh Frontend và lịch sử Git của các Pull Request thiết kế/bản mẫu là bằng
chứng hiện có. Quyết định rà soát của con người chưa được tập trung đầy đủ vào
chapter này.

## 6. Việc tiếp theo

Ghi nhận kết quả rà soát của con người, chốt hoặc giữ `TBD` cho từng quyết định
còn mở và đối chiếu bản mẫu với định nghĩa hoàn thành của Chapter 4.
