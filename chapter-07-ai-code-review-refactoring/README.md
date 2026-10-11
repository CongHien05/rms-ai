# Chapter 7 — Tái cấu trúc & Review Mã nguồn cùng AI

## 1. Mục tiêu theo đề cương

Sử dụng AI để hỗ trợ phát hiện vấn đề chất lượng, code smell, review mã nguồn và
refactoring có kiểm soát; con người xác nhận finding trước khi sửa.

## 2. RMS-AI áp dụng chương này như thế nào

Repository đã có quy tắc yêu cầu review diff, validation và chỉ sửa trong phạm
vi được giao. Lịch sử Git có các vòng implementation rồi merge và một đợt
redesign frontend, nhưng chưa có bộ artifact code review/refactoring riêng.

## 3. Artifact hiện có

- [Quy tắc repository](../AGENTS.md)
- [Backend có unit test hỗ trợ corrective change](../backend/src/app.controller.spec.ts)
- [Frontend product foundation hiện tại](../frontend/src/App.tsx)

## 4. Tiến độ

- [x] Thiết lập quy tắc review, kiểm soát scope và validation.
- [x] Có lịch sử thay đổi và merge để truy vết các vòng implementation.
- [ ] Lưu finding code review theo mức độ ưu tiên.
- [ ] Lưu bằng chứng code smell analysis và refactoring được xác nhận.
- [ ] Thực hiện review tổng kết cho Chapter 7.

## 5. Bằng chứng AI-assisted workflow

Hiện có quy tắc review và lịch sử Git của các lần triển khai/merge. Chưa tập
trung bằng chứng code review, corrective pass và refactoring vào chapter này,
vì vậy Chapter 7 chưa được xem là hoàn thành.

## 6. Việc tiếp theo

Ở lần review mã nguồn kế tiếp, lưu finding, quyết định của reviewer, diff sửa
lỗi và kết quả validation; không refactor ngoài finding đã được xác nhận.
