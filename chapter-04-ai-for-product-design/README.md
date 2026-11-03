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
- [Hồ sơ Human Design Review](docs/human-design-review.md)
- [Sổ quyết định Human Review](docs/human-review-decision-register.md)
- [Ma trận truy vết Human Review](docs/human-review-traceability.md)
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
- [x] Hoàn tất rà soát của con người: 20 `GIAO DIỆN ĐỀ XUẤT` được Approved và
  12 câu hỏi `TBD` được chủ động giữ lại với lý do/phạm vi đã ghi.

Trạng thái Chapter 4: **Ready with retained TBDs**. Close-out này xác nhận sản
phẩm thiết kế và bằng chứng review, không xác nhận AI/ML, API, database,
Auth/RBAC, matching, simulation hoặc allocation production đã hoàn thành.

## 5. Bằng chứng quy trình có AI hỗ trợ

Prompt thiết kế có thể tái sử dụng, tài liệu thiết kế, vòng thiết kế lại để hiệu
chỉnh Frontend, lịch sử Git và ba hồ sơ Human Review là bằng chứng hiện có.
Final human approval cho năm lựa chọn cuối được ghi ngày 2026-11-03 dựa trên
báo cáo kỹ thuật. Screen-reader test chưa chạy và không được ghi PASS.

## 6. Việc tiếp theo

Chapter 5. Các TBD được giữ lại chỉ mở lại khi có căn cứ ở giai đoạn phù hợp;
không dùng close-out Chapter 4 để suy ra quy tắc nghiệp vụ hoặc chức năng
production.
