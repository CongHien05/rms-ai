# Chapter 7 — Tái cấu trúc & Review Mã nguồn cùng AI

## 1. Mục tiêu theo đề cương

Sử dụng AI để hỗ trợ phát hiện vấn đề chất lượng, dấu hiệu bất thường trong mã,
rà soát mã nguồn và tái cấu trúc có kiểm soát; con người xác nhận phát hiện trước
khi sửa.

## 2. RMS-AI áp dụng chương này như thế nào

Repository đã có quy tắc yêu cầu rà soát diff, kiểm tra xác nhận và chỉ sửa trong
phạm vi được giao. Lịch sử Git có các vòng triển khai rồi merge và một đợt thiết
kế lại Frontend, nhưng chưa có bộ tài liệu rà soát/tái cấu trúc mã nguồn riêng.

## 3. Tài liệu hiện có

- [Quy tắc repository](../AGENTS.md)
- [Backend có unit test hỗ trợ thay đổi hiệu chỉnh](../backend/src/app.controller.spec.ts)
- [Nền tảng sản phẩm Frontend hiện tại](../frontend/src/App.tsx)

## 4. Tiến độ

- [x] Thiết lập quy tắc rà soát, kiểm soát phạm vi và kiểm tra xác nhận.
- [x] Có lịch sử thay đổi và merge để truy vết các vòng triển khai.
- [ ] Lưu phát hiện rà soát mã nguồn theo mức độ ưu tiên.
- [ ] Lưu bằng chứng phân tích dấu hiệu bất thường và tái cấu trúc đã được xác nhận.
- [ ] Thực hiện rà soát tổng kết cho Chapter 7.

## 5. Bằng chứng quy trình có AI hỗ trợ

Hiện có quy tắc rà soát và lịch sử Git của các lần triển khai/merge. Chưa tập
trung bằng chứng rà soát mã nguồn, vòng hiệu chỉnh và tái cấu trúc vào chapter
này, vì vậy Chapter 7 chưa được xem là hoàn thành.

## 6. Việc tiếp theo

Ở lần rà soát mã nguồn kế tiếp, lưu phát hiện, quyết định của người rà soát, diff
sửa lỗi và kết quả kiểm tra xác nhận; không tái cấu trúc ngoài phát hiện đã được
xác nhận.
