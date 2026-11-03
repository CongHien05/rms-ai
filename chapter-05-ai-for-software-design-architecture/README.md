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
- [ ] Hoàn thiện mô hình hóa hệ thống/UML theo phạm vi được duyệt.
- [ ] Ghi nhận mẫu kiến trúc và mẫu thiết kế có bằng chứng rà soát.

Trạng thái sau Phase A: **Architecture baseline verified; design gaps and
required decisions documented.** Trạng thái này cho phép đề xuất Phase B, không
có nghĩa Chapter 5 đã hoàn thành hoặc các capability production đã được xác minh.

## 5. Bằng chứng quy trình có AI hỗ trợ

Phase A tập trung bằng chứng vào chapter này và phân biệt `VERIFIED FROM SOURCE`,
`VERIFIED BY EXECUTION`, `DOCUMENTED ONLY`, `PROPOSED`, `TBD` và `NOT VERIFIED`.
Tài liệu audit giữ riêng code tồn tại, runtime được xác minh và production
readiness; không dùng prototype hoặc migration source làm bằng chứng production.

## 6. Việc tiếp theo

Human-review milestone B1 được đề xuất trong Phase B Plan: reconcile current-state
architecture và tạo minimal UML baseline. Chưa thực hiện B1 trong Phase A; không
mở endpoint, schema, Auth/RBAC hoặc AI/model work từ đề xuất này.
