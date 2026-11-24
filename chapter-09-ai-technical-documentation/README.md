# Chapter 9 — AI trong việc sinh tài liệu kỹ thuật

## 1. Mục tiêu theo đề cương

Sử dụng AI để hỗ trợ tài liệu kỹ thuật, README, chuyển giao kiến thức và tài liệu
tổng kết, với bước rà soát tính chính xác của nhóm.

## 2. RMS-AI áp dụng chương này như thế nào

Repository đã có README vận hành, tài liệu yêu cầu, thiết kế, kiến trúc và các
quy tắc làm việc. Dự án chưa kết thúc nên chưa có báo cáo cuối cùng hay bộ tài
liệu bàn giao hoàn chỉnh.

## 3. Tài liệu hiện có

- [README tổng quan repository](../README.md)
- [Tiến độ theo đề cương](../COURSE_PROGRESS.md)
- [Backend README](../backend/README.md)
- [Frontend README](../frontend/README.md)
- [Chapter 3 — Yêu cầu và sản phẩm](../chapter-03-ai-for-requirements-product-analysis/README.md)
- [Chapter 4 — Thiết kế sản phẩm](../chapter-04-ai-for-product-design/README.md)
- [Quy tắc repository](../AGENTS.md)
- [Audit tích hợp Spec Kit và roadmap MVP](docs/spec-kit-adoption-audit.md)
- [RMS-AI Constitution](../.specify/memory/constitution.md)

## 4. Tiến độ

- [x] Có README tổng quan và hướng dẫn cho các thành phần chính.
- [x] Có tài liệu yêu cầu, thiết kế, kiến trúc, API và nền tảng database.
- [x] Có chỉ mục theo dõi tiến độ Chapter 3–9.
- [ ] Đối chiếu toàn bộ tài liệu với phần triển khai ở mốc cuối dự án.
- [ ] Hoàn thiện chuyển giao kiến thức và tài liệu cuối cùng.

## 5. Bằng chứng quy trình có AI hỗ trợ

Repository lưu prompt cho một số tài liệu yêu cầu/thiết kế, hướng dẫn, tài liệu
đã qua nhiều commit và các mốc merge. Chưa tập trung bằng chứng sinh tài liệu và
rà soát của con người vào Chapter 9.

### Milestone Adopt GitHub Spec Kit (2026-11-24)

Người giao việc chốt áp dụng Spec Kit 1.4.4 vào repository đang phát triển
và giới hạn thay đổi ở cấu hình, Constitution và tài liệu. AI hỗ trợ kiểm
kê scaffold, chạy kiểm tra hiện trạng, soạn 14 nguyên tắc và truy vết roadmap
về PRD, User Stories và Acceptance Criteria. Codex đã nhận diện 9 skill.
Frontend đạt 10/10 test, Backend đạt 55/55 unit và 11/11 E2E có test double,
AI service đạt 9/9 unit và 5/5 ca smoke ASGI. MySQL local chưa kết nối lại.

### Hoàn tất hồ sơ tích hợp (2026-11-25)

Người phụ trách phê chuẩn Constitution 1.0.0, Hybrid SDD, giữ LF cho các file
scaffold do manifest quản lý và roadmap MVP. Milestone chức năng đầu tiên
là What-if Simulation. AI ghi lại các quyết định PROPOSED DEMO trong Chapter 3,
đối chiếu baseline sau fetch và cập nhật hướng dẫn chạy. Checkout cách ly giữ
22/22 hash. AI service đạt 9/9 unit và 5/5 smoke HTTP trong `.venv`.
Kiểm tra chỉ đọc MySQL dev đạt. Trạng thái nghiệm thu What-if vẫn mở.
[Kết quả và giới hạn kiểm tra](docs/spec-kit-adoption-audit.md).

### Bàn giao kiểm thử What-if 001 (2026-11-25)

Phạm vi **PROPOSED DEMO** đã chạy trên MariaDB dev. What-if chỉ cần Backend
và Frontend, sử dụng `WHAT_IF_CONTEXT_SECRET` trong `backend/.env` cục bộ
để xác minh ngữ cảnh. Phép tính deterministic dùng giờ trống đọc lại. Khi thiếu khóa,
danh sách đề xuất vẫn khả dụng và What-if không thể chạy.

Người phụ trách duyệt thiết kế ở Gate 2; AI ghi lệnh, fixture dev, số đo và
giới hạn của từng lớp bằng chứng. Gate 3 chờ người phụ trách review.
[Quickstart](../specs/001-what-if-simulation/quickstart.md)
· [Kết quả unit, HTTP E2E và runtime](../chapter-08-ai-software-testing/README.md).

## 6. Việc tiếp theo

Khi dự án đạt mốc cuối, kiểm tra link, thuật ngữ, lệnh vận hành và sự phù hợp
giữa tài liệu với mã nguồn trước khi lập tài liệu bàn giao.
