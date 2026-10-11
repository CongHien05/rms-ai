# Chapter 4 — AI trong Thiết kế Sản phẩm

## 1. Mục tiêu theo đề cương

Sử dụng AI để hỗ trợ xây dựng user flow, low-fidelity UI, các trạng thái giao
diện và vòng lặp review thiết kế có truy vết yêu cầu.

## 2. RMS-AI áp dụng chương này như thế nào

RMS-AI mô hình hóa trải nghiệm PM theo chuỗi Project Risk → Resource
Recommendation → What-if Simulation → PM Decision. UI hiện tại là prototype
phục vụ review, không phải bằng chứng của AI prediction, matching hay simulation
engine thật.

## 3. Artifact hiện có

- [What-if Simulation và PM Decision UI Design](docs/what-if-simulation-ui-design.md)
- [Operations Overview UI Design](docs/operations-overview-ui-design.md)
- [Project Risk UI Design](../chapter-03-ai-for-requirements-product-analysis/docs/pm-risk-ui-design.md)
- [Resource Recommendation UI Design](../chapter-03-ai-for-requirements-product-analysis/docs/resource-recommendation-ui-design.md)
- [Prompt thiết kế What-if Simulation](prompts/generate-simulation-ui.prompt.md)
- [Guideline Chapter 4](GUIDELINE.md)
- [Frontend prototype](../frontend/README.md)

Hai tài liệu UI đầu tiên đã được tạo trước khi cấu trúc tracking theo chapter
được bổ sung và được giữ nguyên tại vị trí hiện có.

## 4. Tiến độ

- [x] Mô tả flow và wireframe cho các bước chính của PM.
- [x] Ghi nhận empty, invalid, loading và insufficient-data states quan trọng.
- [x] Truy vết các quyết định UI về PRD, User Stories và Acceptance Criteria.
- [x] Xây dựng frontend prototype theo phạm vi thiết kế hiện tại.
- [ ] Hoàn tất human review cho toàn bộ `PROPOSED UI` và câu hỏi `TBD`.

## 5. Bằng chứng AI-assisted workflow

Prompt thiết kế có thể tái sử dụng, các design document, corrective redesign ở
frontend và lịch sử Git của các Pull Request thiết kế/prototype là bằng chứng
hiện có. Quyết định human review chưa được tập trung đầy đủ vào chapter này.

## 6. Việc tiếp theo

Ghi nhận kết quả human review, chốt hoặc giữ `TBD` cho từng quyết định còn mở và
đối chiếu prototype với Definition of Done của Chapter 4.
