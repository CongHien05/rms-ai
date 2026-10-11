# Tổng quan vận hành RMS-AI — Giao diện đề xuất

## 1. Trạng thái và phạm vi

Tài liệu này ghi lại ý tưởng low-fidelity do người giao việc cung cấp cho màn
hình Tổng quan vận hành RMS-AI. Màn hình có trạng thái **PROPOSED UI**, không
phải yêu cầu dashboard đã được xác nhận và không phải bằng chứng về hành vi
production.

Tổng quan chỉ là bề mặt điều hướng prototype vào luồng MVP hiện có. Artifact
không bổ sung báo cáo, thông báo, CRUD quản lý dự án, theo dõi hoạt động, logic
ưu tiên, API contract, cấu trúc database hoặc hành vi AI/ML.

## 2. Wireframe

```text
RMS-AI

Tổng quan vận hành
────────────────────────────────────

Dự án cần chú ý                 Hoạt động gần đây
Dự án Alpha                     [Trạng thái rỗng / TBD]
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
| Dự án và thao tác `Xem đánh giá` | Hỗ trợ đi vào US-01 và luồng Project Risk Overview/Detail đã xác nhận | Cách trình bày PROPOSED UI; đích đến đã xác nhận |
| Trạng thái không thể đánh giá | Giữ nguyên AC-US-01-02 và AC-US-01-04, không trình bày thiếu căn cứ như rủi ro thấp | Trạng thái CONFIRMED; wording và hành vi tiếp theo TBD |
| Danh sách dự án | Hỗ trợ chọn dự án theo artifact PM Risk UI | Mục đích CONFIRMED; visibility và thứ tự TBD |
| Khu vực hoạt động gần đây | Chưa có requirement xác định dữ liệu hoặc cơ chế theo dõi hoạt động | PROPOSED UI; nguồn và nội dung TBD |
| Rủi ro → Đề xuất → Mô phỏng → Quyết định | Phản ánh US-01 đến US-04 và thứ tự luồng MVP | Thứ tự CONFIRMED; cách trình bày ở tổng quan là PROPOSED UI |
| Không gian Dự án | Tái sử dụng project presentation để mở ngữ cảnh rủi ro | Presentation foundation PROPOSED UI; không phải project-management CRUD |
| Không gian Nhân sự | Dành vị trí cho dữ liệu Employee/Skill khi tích hợp | Presentation foundation PROPOSED UI; trường dữ liệu và kết nối TBD |

## 4. Quyết định ở mức prototype

- `Dự án Alpha`, `Dự án A`, `Dự án B` và `Dự án C` là nhãn minh họa.
- Trạng thái featured project được lấy từ presentation data hiện có; không
  hard-code một risk level hoặc risk score.
- Quy tắc chọn dự án cần chú ý và thứ tự danh sách chưa được triển khai thành
  business rule; các nội dung này vẫn là TBD.
- Hoạt động gần đây chủ động dùng trạng thái rỗng vì requirement chưa định
  nghĩa event hoặc activity tracking.
- Dải luồng chỉ có mục đích định hướng. Đề xuất, Mô phỏng và Quyết định phụ
  thuộc ngữ cảnh dự án nên không được đưa thành global navigation.
- Global navigation gồm Tổng quan, Dự án, Nhân sự và Trung tâm rủi ro. Đây là
  information architecture cho prototype, không xác nhận role, RBAC hoặc
  quyền truy cập production.
- Không suy diễn assessment level, điểm số, ngưỡng, quy tắc phân bổ hoặc mức
  ưu tiên từ màn hình này.

## 5. Rà soát thủ công

Human review cần kiểm tra lần lượt:

1. Tổng quan vận hành và trạng thái featured project.
2. Không gian Dự án và thao tác mở chi tiết rủi ro.
3. Không gian Nhân sự ở trạng thái chưa kết nối dữ liệu.
4. Trung tâm rủi ro, Chi tiết rủi ro và các trạng thái assessment.
5. Đề xuất nhân sự, danh sách có thứ hạng và trạng thái không có ứng viên.
6. Mô phỏng, tác động dự kiến và quyết định của PM.
7. Active navigation, contextual flow, back flow và responsive layout.

Human review vẫn bắt buộc trước khi giao diện đề xuất này được xem là quyết
định thiết kế Chapter 4 đã phê duyệt.
