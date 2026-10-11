# Thiết kế UI Rủi ro dự án cho PM — MVP

## 1. Phạm vi

Tài liệu này mô tả thiết kế giao diện độ trung thực thấp cho phần đầu của luồng
MVP: PM chọn dự án, xem ước lượng rủi ro và các yếu tố giải thích chính, sau đó
cân nhắc chuyển sang đề xuất nhân sự.

Phạm vi của Hiền gồm Luồng người dùng của PM, Tổng quan rủi ro dự án và Chi tiết
rủi ro dự án. Điểm kết thúc là hành động **Yêu cầu đề xuất nhân sự**. Kết quả đề
xuất nhân sự, mô phỏng giả định và quyết định chấp nhận/từ chối thuộc phạm vi
tiếp nối của Khánh.

Đây là tài liệu yêu cầu và wireframe độ trung thực thấp, không phải đặc tả UI
production. Tài liệu không xác nhận AI hoặc chức năng nghiệp vụ đã được triển
khai, không định nghĩa API, cơ sở dữ liệu, mô hình AI hay quy tắc phân quyền.

Quy ước:

- **ĐÃ XÁC NHẬN:** có căn cứ trực tiếp từ PRD, User Stories hoặc Acceptance Criteria.
- **TBD:** đã nhận diện nhưng chưa được yêu cầu quyết định.
- **BẢN MẪU:** dữ liệu hoặc nhãn minh họa vị trí UI, không phải quy tắc nghiệp vụ.
- **TÙY CHỌN:** tiện ích giao diện đề xuất, không phải yêu cầu bắt buộc.

## 2. Truy vết yêu cầu

| Yêu cầu | Nguồn | Hàm ý UI | Trạng thái |
| --- | --- | --- | --- |
| PM là người dùng chính của MVP | PRD — Người dùng mục tiêu; User Stories — Người dùng chính | Luồng và nội dung được tổ chức quanh việc PM xem xét rủi ro | ĐÃ XÁC NHẬN |
| PM xem ước lượng rủi ro bàn giao của dự án | PRD — Phạm vi MVP; US-01; AC-US-01-01 | Tổng quan và Chi tiết dành vị trí cho đánh giá rủi ro; cách biểu diễn chưa được chốt | ĐÃ XÁC NHẬN |
| PM xem các yếu tố chính giải thích kết quả | PRD — Phạm vi MVP; US-01; AC-US-01-01 | Chi tiết có khu vực “Các yếu tố giải thích chính” | ĐÃ XÁC NHẬN |
| Thông tin rủi ro giúp PM cân nhắc can thiệp nguồn lực | US-01 | Chi tiết dẫn tới quyết định có tiếp tục sang đề xuất nhân sự hay không | ĐÃ XÁC NHẬN |
| Kết quả thiếu căn cứ không được trình bày như kết quả chính xác | AC-US-01-02; AC-US-01-04 | Tổng quan và Chi tiết có trạng thái không thể đánh giá; không thay bằng mức rủi ro thấp | ĐÃ XÁC NHẬN |
| AI hỗ trợ, PM giữ quyền quyết định cuối cùng | PRD — Tổng quan sản phẩm; User Stories — Người dùng chính | UI không tự quyết định hoặc tự thay đổi phân bổ | ĐÃ XÁC NHẬN |
| PM có thể yêu cầu đề xuất nhân sự cho dự án | PRD — Phạm vi MVP; US-02; AC-US-02-01 | Chi tiết kết thúc tại hành động yêu cầu đề xuất nhân sự | ĐÃ XÁC NHẬN |

## 3. Luồng người dùng của PM

```text
Bắt đầu
  -> Tổng quan rủi ro dự án
  -> Chọn dự án
  -> Chi tiết rủi ro dự án
  -> Xem đánh giá rủi ro
  -> Xem các yếu tố giải thích chính
  -> Quyết định có tiếp tục hay không
  -> Yêu cầu đề xuất nhân sự
  -> Chuyển sang phạm vi của Khánh
```

| Bước | PM nhìn thấy | PM thực hiện | Hệ thống phản hồi | Bước tiếp theo |
| --- | --- | --- | --- | --- |
| 1. Bắt đầu | Khu vực Rủi ro dự án và tập dự án được cung cấp; phạm vi dự án là TBD | Mở khu vực Rủi ro dự án | Hiển thị Tổng quan hoặc trạng thái chưa thể đánh giá | Xem Tổng quan |
| 2. Tổng quan | Ngữ cảnh dự án và đánh giá rủi ro của từng dự án; cách biểu diễn rủi ro là TBD | Quét danh sách và chọn dự án cần điều tra | Ghi nhận dự án được chọn | Mở Chi tiết |
| 3. Chi tiết | Ngữ cảnh dự án, đánh giá rủi ro và các yếu tố giải thích chính | Xem và hiểu kết quả ở mức sản phẩm | Giữ nguyên dữ liệu phân bổ, không tự quyết định thay PM | Cân nhắc tiếp tục |
| 4. Chuyển tiếp | Hành động yêu cầu đề xuất nhân sự cho dự án hiện tại | Chọn **Yêu cầu đề xuất nhân sự** | Chuyển tiếp dự án đang được xem xét; không định nghĩa hợp đồng dữ liệu | Phạm vi của Khánh |

## 4. Tổng quan rủi ro dự án

Màn hình giúp PM nhận biết khu vực Rủi ro dự án, xem tập dự án được cung cấp,
nhận biết đánh giá của từng dự án và mở trang chi tiết. Quy tắc xác định dự án
nào PM được nhìn thấy là **TBD**.

### Wireframe

```text
+--------------------------------------------------------------------------------+
| TỔNG QUAN RỦI RO DỰ ÁN                                                        |
| Dự án trong phạm vi: [TBD — quy tắc hiển thị dự án]                           |
+----------------------+--------------------------+---------------------+---------+
| Dự án               | Đánh giá rủi ro          | Tóm tắt giải thích  | Thao tác|
+----------------------+--------------------------+---------------------+---------+
| Dự án A [Bản mẫu]   | [Cách biểu diễn TBD]     | [Tùy chọn/Bản mẫu] | Chi tiết|
| Dự án B [Bản mẫu]   | Không thể đánh giá       | Không đủ bằng chứng| Chi tiết|
|                      | [Câu chữ TBD]            | [TBD]               |         |
+----------------------+--------------------------+---------------------+---------+
| [Tùy chọn: Tìm kiếm] [Tùy chọn: Lọc] [Tùy chọn: Sắp xếp]                     |
+--------------------------------------------------------------------------------+
```

| Thành phần | Mục đích | Thông tin / hành động | Trạng thái |
| --- | --- | --- | --- |
| Tiêu đề và ngữ cảnh | Cho PM biết đang ở khu vực Rủi ro dự án | Tên màn hình | ĐÃ XÁC NHẬN |
| Tập dự án | Cho PM thấy các dự án được cung cấp để xem xét | Định danh/tên dự án; trường cụ thể và quy tắc hiển thị là TBD | ĐÃ XÁC NHẬN / TBD |
| Đánh giá rủi ro | Cho phép PM quét kết quả đánh giá giữa các dự án | Giá trị trình bày là `[Cách biểu diễn TBD]`; không dùng ngưỡng, phần trăm hoặc màu đã ngầm chốt | ĐÃ XÁC NHẬN / TBD |
| Tóm tắt giải thích | Cung cấp ngữ cảnh ngắn trước khi mở Chi tiết | Nội dung, số lượng và thứ tự là TBD | TÙY CHỌN |
| Hành động Chi tiết | Mở đúng dự án để xem giải thích | PM chọn `Chi tiết` | ĐÃ XÁC NHẬN |
| Trạng thái không thể đánh giá | Tránh trình bày kết quả thiếu căn cứ như chính xác | Hiển thị đánh giá không khả dụng; câu chữ và hành động tiếp theo là TBD | ĐÃ XÁC NHẬN / TBD |
| Tìm kiếm/lọc/sắp xếp | Hỗ trợ quét khi danh sách lớn | Không có quy tắc lọc hoặc xếp hạng được chốt | TÙY CHỌN |

Màn hình Tổng quan không hiển thị ứng viên, điểm ghép nối, mô phỏng hoặc hành
động chấp nhận/từ chối.

## 5. Chi tiết rủi ro dự án

Màn hình hiển thị một dự án đã được chọn, ước lượng rủi ro và các yếu tố chính
giải thích kết quả ở mức khái quát.

### Wireframe — có kết quả đánh giá

```text
+--------------------------------------------------------------------------+
| < Quay lại Tổng quan rủi ro dự án                                        |
| Dự án A [Bản mẫu]                                                        |
+--------------------------------------------------------------------------+
| ĐÁNH GIÁ RỦI RO                                                         |
| [TBD — cách biểu diễn, thang đo, ngưỡng và ánh xạ mức]                  |
+--------------------------------------------------------------------------+
| CÁC YẾU TỐ GIẢI THÍCH CHÍNH                                             |
| - Yếu tố rủi ro A [Bản mẫu]                                              |
| - Yếu tố rủi ro B [Bản mẫu]                                              |
| - Yếu tố rủi ro C [Bản mẫu]                                              |
|                                                                          |
| Định nghĩa, thứ tự, mức đóng góp và quan hệ nhân quả: [TBD]              |
+--------------------------------------------------------------------------+
| [Yêu cầu đề xuất nhân sự]                                                |
| Chỉ chuyển tiếp — kết quả đề xuất nằm ngoài tài liệu này                 |
+--------------------------------------------------------------------------+
```

| Thành phần | Mục đích | Trạng thái |
| --- | --- | --- |
| Ngữ cảnh dự án | Xác nhận PM đang xem đúng dự án | ĐÃ XÁC NHẬN; trường hiển thị cụ thể là TBD |
| Đánh giá rủi ro | Thể hiện ước lượng nguy cơ không đáp ứng kế hoạch/thời hạn bàn giao | ĐÃ XÁC NHẬN; cách biểu diễn là TBD |
| Các yếu tố giải thích chính | Giúp PM hiểu kết quả ở mức khái quát, không khẳng định quan hệ nhân quả | ĐÃ XÁC NHẬN; yếu tố cụ thể và mức đóng góp là TBD |
| Quay lại Tổng quan | Cho phép PM quay lại tập dự án | TÙY CHỌN |
| Yêu cầu đề xuất nhân sự | Chuyển sang bước tiếp theo của MVP | ĐÃ XÁC NHẬN; điều kiện khả dụng là TBD |

Phần giải thích không mô tả thuật toán độ quan trọng đặc trưng, SHAP, nội bộ mô
hình, công thức mức đóng góp hoặc trọng số. Các yếu tố trong wireframe chỉ là
**BẢN MẪU**.

## 6. Trạng thái rỗng / không hợp lệ / thiếu dữ liệu

### Wireframe

```text
+--------------------------------------------------------------------------+
| Dự án A [Bản mẫu]                                                        |
+--------------------------------------------------------------------------+
| KHÔNG THỂ ĐÁNH GIÁ RỦI RO                                               |
| Không đủ bằng chứng để trình bày kết quả đáng tin cậy [Câu chữ TBD]      |
|                                                                          |
| Dữ liệu bắt buộc, lý do cụ thể và trạng thái độ mới: [TBD]               |
| Hành vi thử lại hoặc tiếp tục: [TBD]                                     |
+--------------------------------------------------------------------------+
| Khả năng dùng hành động Yêu cầu đề xuất nhân sự: [TBD]                   |
+--------------------------------------------------------------------------+
```

Trạng thái này chỉ xác nhận rằng hệ thống không được hiển thị kết quả thiếu căn
cứ như một kết quả chính xác. Dữ liệu tối thiểu, lý do cụ thể, cách xử lý dữ
liệu lỗi thời, hành vi thử lại và hành vi Backend đều là **TBD**. Thiếu dữ liệu
không được ngầm hiểu là rủi ro thấp.

## 7. Chuyển sang Đề xuất nhân sự

Điểm kết thúc phần Hiền là hành động **Yêu cầu đề xuất nhân sự** trên màn hình
Chi tiết rủi ro dự án.

Ngữ cảnh tối thiểu ở góc nhìn luồng là **dự án hiện đang được PM xem xét**. Tài
liệu không định nghĩa payload JSON, tham số API, hợp đồng dữ liệu hoặc điều kiện
kỹ thuật để chuyển màn hình.

Phần tiếp theo — Đề xuất nhân sự, Mô phỏng giả định, xem tác động và Chấp
nhận/Từ chối — thuộc phạm vi của Khánh.

## 8. TBD / Câu hỏi mở

- Cách biểu diễn đánh giá rủi ro và định nghĩa điểm rủi ro, nếu sử dụng điểm.
- Thang đo, ngưỡng và cách ánh xạ Thấp / Trung bình / Cao, nếu sử dụng mức rủi ro.
- Quy tắc sắp xếp hoặc xếp hạng dự án theo rủi ro.
- Định nghĩa các yếu tố rủi ro, số lượng, thứ tự và cách trình bày.
- Mức đóng góp, trọng số và việc yếu tố có mang ý nghĩa nhân quả hay không.
- Độ mới của kết quả và cách xử lý kết quả lỗi thời.
- Dữ liệu tối thiểu, điều kiện dữ liệu hợp lệ và hành vi khi không đủ căn cứ.
- Quy tắc xác định dự án nào PM được nhìn thấy.
- Điều kiện để PM được yêu cầu đề xuất nhân sự từ màn hình Chi tiết rủi ro.
- Đầu vào/đầu ra mô hình, hợp đồng API và schema database; các nội dung này
  không được thiết kế trong tài liệu hiện tại.

## 9. Kiểm tra tính nhất quán của câu chuyện demo MVP

Tài liệu hiện tại hỗ trợ phần đầu của câu chuyện demo:

```text
PM chọn dự án
-> xem đánh giá rủi ro
-> hiểu các yếu tố giải thích chính
-> cân nhắc có cần can thiệp nguồn lực
-> yêu cầu đề xuất nhân sự
```

Điểm tiếp nối, không thuộc phần triển khai của tài liệu này:

```text
Đề xuất nhân sự
-> Mô phỏng giả định
-> Tác động
-> Chấp nhận / Từ chối
```
