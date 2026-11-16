# Chapter 5 — AI trong Thiết kế & Kiến trúc Phần mềm

## 1. Mục tiêu theo đề cương

Sử dụng AI để hỗ trợ thiết kế kiến trúc, mẫu kiến trúc, mô hình hóa hệ thống/UML,
thiết kế database, thiết kế API và mẫu thiết kế; mọi đề xuất vẫn phải được nhóm
kiểm tra với yêu cầu sản phẩm.

## 2. RMS-AI áp dụng chương này như thế nào

RMS-AI đã mô tả ranh giới Frontend, Backend, dịch vụ AI, dữ liệu khái niệm, API
ban đầu và nền tảng database. Các tài liệu này có trước cấu trúc theo dõi Chapter
5 nên tiếp tục được giữ tại Chapter 3 và chỉ được liên kết từ đây.

## 3. Tài liệu hiện có

- [Milestone B1 — Kiến trúc hiện trạng và UML tối thiểu](docs/current-state-architecture-b1.md)
- [Phase A — Architecture Baseline Audit](docs/architecture-baseline-audit.md)
- [Phase A — Architecture Gap Analysis](docs/architecture-gap-analysis.md)
- [Phase A — Chapter 5 Traceability Matrix](docs/chapter-05-traceability-matrix.md)
- [Proposed Phase B Plan](docs/chapter-05-phase-b-plan.md)
- [Kiến trúc hệ thống mức cao](../chapter-03-ai-for-requirements-product-analysis/docs/system-architecture.md)
- [Hợp đồng API ban đầu](../chapter-03-ai-for-requirements-product-analysis/docs/initial-api-contracts.md)
- [Thiết kế dữ liệu và database](../chapter-03-ai-for-requirements-product-analysis/docs/database-design.md)
- [Ràng buộc phân bổ nguồn lực](../chapter-03-ai-for-requirements-product-analysis/docs/resource-allocation-constraints.md)
- [Hợp đồng dữ liệu khái niệm MVP](../chapter-03-ai-for-requirements-product-analysis/docs/mvp-data-contract.md)

## 4. Tiến độ

- [x] Mô tả kiến trúc mức cao và ranh giới thành phần.
- [x] Mô tả hợp đồng API ban đầu.
- [x] Mô tả mô hình dữ liệu, nền tảng database và ràng buộc dữ liệu.
- [x] Hoàn tất Phase A: kiểm kê baseline, gap/conflict register, retained TBD
  assessment, traceability và kế hoạch Phase B.
- [x] Soạn Milestone B1: baseline kiến trúc hiện trạng, sơ đồ thành phần/runtime
  local, bằng chứng pattern và disposition conflict. **B1 chờ human review.**
- [ ] Hoàn thiện mô hình hóa hệ thống/UML theo phạm vi được duyệt.
- [ ] Ghi nhận mẫu kiến trúc và mẫu thiết kế có bằng chứng rà soát.

Trạng thái hiện tại: **B1 chờ review**. Tài liệu B1 đã đối chiếu code hiện có
nhưng chưa được con người phê duyệt; Chapter 5 vẫn đang thực hiện và không có
capability production mới nào được xác minh.

## 5. Bằng chứng quy trình có AI hỗ trợ

AI đã hỗ trợ tổng hợp baseline B1, tạo sơ đồ Mermaid và đối chiếu Frontend,
Backend, AI Service, TypeORM/entity/migration với audit Phase A. Bằng chứng được
truy về source path; MySQL runtime, migration applied và hai integration HTTP
vẫn ghi `CHƯA XÁC MINH KHI CHẠY`. Con người cần review cách dùng addendum, tên
pattern, hai sơ đồ và disposition conflict trước khi duyệt B1.

## 6. Việc tiếp theo

Human reviewer xử lý các mục `B1-DEC-01` đến `B1-DEC-04` và `B1-VIEW-01/02`
trong tài liệu B1. Sau khi B1 được duyệt, nhóm mới chọn một phạm vi tiếp theo;
không tự mở endpoint, schema, Auth/RBAC hoặc AI/model work.
