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

### Review race condition và API trạng thái Task (2026-11-17)

- Phát hiện GET task trả muộn có thể ghi đè trạng thái PATCH vừa thành công.
  Quyết định sửa: vô hiệu hóa response GET cũ và chặn GET mới trong lúc PATCH;
  vẫn giữ hủy request đang chạy để giảm công việc thừa.
- Tìm caller trong `frontend/` và `backend/` xác nhận chỉ có
  `PATCH /sprints/:sprintId/tasks/:taskId` được dùng. Quyết định bỏ ba alias,
  `TasksDirectController` và `updateStatusDirect` để tránh hai đường cập nhật
  không kiểm tra quan hệ Task thuộc Sprint.
- Bằng chứng xác nhận nằm ở test race Frontend, unit/e2e Backend và kết quả
  build/lint được ghi tại Chapter 8. Chờ human review; Chapter 7 vẫn đang thực hiện.

## 6. Việc tiếp theo

Ở lần rà soát mã nguồn kế tiếp, lưu phát hiện, quyết định của người rà soát, diff
sửa lỗi và kết quả kiểm tra xác nhận; không tái cấu trúc ngoài phát hiện đã được
xác nhận.

### Review What-if 001 (2026-11-25)

Rà soát HMAC với tuple chuẩn hóa, phiên bản, độ dài và so sánh constant time.
Proof xác nhận ngữ cảnh ứng viên do server phát, còn trạng thái kỹ năng và
availability được đọc lại trong lượt chạy. Kiểm tra số giờ trước khi tính
tác động, gồm số thập phân, số mũ, giới hạn sát giờ trống và giờ hỗ trợ
vượt nhu cầu.

Rà soát guard revision/run ID trong component thật. Test deferred promise
bao phủ success, error và finally cũ khi lượt mới đang chờ hoặc đã xong.
Kiểm tra trình duyệt có trì hoãn phản hồi và chuyển dự án. Trạng thái tải
lại đề xuất khi proof cũ hết hiệu lực và độ chính xác biểu diễn JSON number
được ghi trong contract. Hồi quy luồng mock mở Quyết định đạt.
[Chiến lược kiểm thử](../specs/001-what-if-simulation/plan.md#ma-trận-kiểm-thử)
· [Bằng chứng Chapter 8](../chapter-08-ai-software-testing/README.md).

Final code review đối chiếu với baseline `e45d4c6` và phát hiện lượt
What-if có thể giữ trạng thái chờ nếu request hoặc body không trả xong.
Đặt giới hạn 10 giây cho từng lượt, hủy request khi hết hạn và giữ guard
cho phản hồi đến muộn. Hai regression mới bao phủ cả request treo trước
header và body treo sau header, cùng khả năng thử lại với run ID mới.
