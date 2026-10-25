# Tổng quan vận hành RMS-AI — Giao diện đề xuất

## 1. Trạng thái và phạm vi

Tài liệu này ghi lại ý tưởng độ trung thực thấp do người giao việc cung cấp cho
màn hình Tổng quan vận hành RMS-AI. Màn hình có trạng thái **GIAO DIỆN ĐỀ XUẤT**,
không phải yêu cầu bảng điều khiển đã được xác nhận và không phải bằng chứng về
hành vi production.

Tổng quan chỉ là bề mặt điều hướng của bản mẫu vào luồng MVP hiện có. Tài liệu
không bổ sung báo cáo, thông báo, CRUD quản lý dự án, theo dõi hoạt động, logic
ưu tiên, hợp đồng API, cấu trúc database hoặc hành vi AI/ML.

## 2. Wireframe

```text
RMS-AI

Tổng quan vận hành
────────────────────────────────────

Dự án minh họa để rà soát       Hoạt động gần đây — chưa kết nối
Dự án Alpha [Dữ liệu minh họa]  [Không có dữ liệu vận hành / TBD]
Chưa thể đánh giá rủi ro
[Xem đánh giá]

────────────────────────────────────

Dự án
Dự án A
Dự án B
Dự án C

────────────────────────────────────

Rủi ro → Đề xuất → Mô phỏng → Quyết định
```

## 3. Truy vết yêu cầu

| Thành phần giao diện | Quan hệ với yêu cầu | Trạng thái |
| --- | --- | --- |
| Dự án và thao tác `Xem đánh giá` | Hỗ trợ đi vào US-01 và luồng Tổng quan/Chi tiết rủi ro dự án đã xác nhận | Cách trình bày là GIAO DIỆN ĐỀ XUẤT; đích đến đã xác nhận |
| Trạng thái không thể đánh giá | Giữ nguyên AC-US-01-02 và AC-US-01-04, không trình bày thiếu căn cứ như rủi ro thấp | Trạng thái ĐÃ XÁC NHẬN; câu chữ và hành vi tiếp theo TBD |
| Danh sách dự án | Hỗ trợ chọn dự án theo tài liệu UI Rủi ro dự án cho PM | Mục đích ĐÃ XÁC NHẬN; cách hiển thị và thứ tự TBD |
| Khu vực hoạt động gần đây | Chưa có yêu cầu xác định dữ liệu hoặc cơ chế theo dõi hoạt động | GIAO DIỆN ĐỀ XUẤT; nguồn và nội dung TBD |
| Rủi ro → Đề xuất → Mô phỏng → Quyết định | Phản ánh US-01 đến US-04 và thứ tự luồng MVP | Thứ tự ĐÃ XÁC NHẬN; cách trình bày ở tổng quan là GIAO DIỆN ĐỀ XUẤT |
| Không gian Dự án | Tái sử dụng cách trình bày dự án để mở ngữ cảnh rủi ro | Nền tảng trình bày là GIAO DIỆN ĐỀ XUẤT; không phải CRUD quản lý dự án |
| Không gian Nhân sự | Dành vị trí cho dữ liệu Employee/Skill khi tích hợp | Nền tảng trình bày là GIAO DIỆN ĐỀ XUẤT; trường dữ liệu và kết nối TBD |

## 4. Quyết định ở mức bản mẫu

- `Dự án Alpha`, `Dự án A`, `Dự án B` và `Dự án C` là nhãn minh họa.
- Trạng thái dự án nổi bật được lấy từ dữ liệu minh họa hiện có chỉ để rà soát
  bố cục; đây không phải dự án được ưu tiên bởi dữ liệu vận hành. Không
  hard-code mức rủi ro hoặc điểm rủi ro.
- Quy tắc chọn dự án cần chú ý và thứ tự danh sách chưa được triển khai thành
  quy tắc nghiệp vụ; các nội dung này vẫn là TBD.
- Hoạt động gần đây chủ động ghi `Chưa kết nối` và `Không có dữ liệu vận hành`
  vì yêu cầu chưa định nghĩa sự kiện hoặc cơ chế theo dõi hoạt động. Bản mẫu
  không tạo activity log giả.
- Dải luồng chỉ có mục đích định hướng. Đề xuất, Mô phỏng và Quyết định phụ
  thuộc ngữ cảnh dự án nên không được đưa thành điều hướng toàn cục.
- Điều hướng toàn cục của PM gồm Tổng quan, Dự án và Trung tâm rủi ro. Dữ liệu
  Employee/Skill thuộc không gian làm việc HR theo US-05 và thiết kế ba vai trò
  hiện tại. Đây là kiến trúc thông tin của bản mẫu, không xác nhận RBAC hoặc
  quyền truy cập production.
- Không suy diễn mức đánh giá, điểm số, ngưỡng, quy tắc phân bổ hoặc mức
  ưu tiên từ màn hình này.

## 5. Rà soát thủ công

Hoạt động rà soát của con người cần kiểm tra lần lượt:

1. Tổng quan vận hành và trạng thái dự án nổi bật.
2. Không gian Dự án và thao tác mở chi tiết rủi ro.
3. Không gian Nhân sự ở trạng thái chưa kết nối dữ liệu.
4. Trung tâm rủi ro, Chi tiết rủi ro và các trạng thái đánh giá.
5. Đề xuất nhân sự, danh sách có thứ hạng và trạng thái không có ứng viên.
6. Mô phỏng, tác động dự kiến và quyết định của PM.
7. Điều hướng đang hoạt động, luồng theo ngữ cảnh, luồng quay lại và bố cục đáp ứng.

Rà soát của con người vẫn bắt buộc trước khi giao diện đề xuất này được xem là
quyết định thiết kế Chapter 4 đã phê duyệt.
