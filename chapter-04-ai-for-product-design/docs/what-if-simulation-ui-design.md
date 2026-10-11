# Thiết kế UI Mô phỏng giả định và Quyết định của PM — MVP

## 1. Mục tiêu và phạm vi

Tài liệu này xác định thiết kế UI độ trung thực thấp có thể rà soát cho phần
luồng PM của RMS-AI bắt đầu sau bước Đề xuất nhân sự:

```text
Đề xuất nhân sự
-> chọn một phương án để đánh giá
-> Mô phỏng giả định
-> Rà soát tác động
-> PM chấp nhận / từ chối
```

Tài liệu bao phủ ngữ cảnh phương án, trạng thái mô phỏng, cách trình bày tác
động, trạng thái quyết định của PM và các trường hợp biên liên quan trực tiếp.
Tài liệu không định nghĩa API, database, mô hình ML, công thức mô phỏng, quy tắc
phân bổ hoặc quy trình production.

Frontend hiện có là bản mẫu giới hạn và nguồn tham chiếu để giữ tính liên tục.
Nó không phải nguồn của yêu cầu nghiệp vụ mới.

## 2. Nguồn yêu cầu và quy ước trạng thái

Nguồn tham chiếu có thẩm quyền:

1. `chapter-03-ai-for-requirements-product-analysis/docs/PRD.md`
2. `chapter-03-ai-for-requirements-product-analysis/docs/user-stories.md`
3. `chapter-03-ai-for-requirements-product-analysis/docs/acceptance-criteria.md`
4. `chapter-03-ai-for-requirements-product-analysis/docs/pm-risk-ui-design.md`
5. `chapter-03-ai-for-requirements-product-analysis/docs/resource-recommendation-ui-design.md`

Quy ước trạng thái:

- **ĐÃ XÁC NHẬN:** có căn cứ trực tiếp từ cơ sở yêu cầu.
- **GIAO DIỆN ĐỀ XUẤT:** lựa chọn trình bày hoặc tương tác; không phải quy tắc nghiệp vụ.
- **TBD:** yêu cầu hoặc quy tắc nghiệp vụ chưa được xác định đầy đủ.

## 3. Bước chuyển từ luồng trước và quyền sở hữu

Tổng quan rủi ro dự án và Chi tiết rủi ro dự án thuộc luồng trước. Tài liệu Đề
xuất nhân sự tiếp tục luồng đó và cung cấp ngữ cảnh đầu vào cho thiết kế này.

Bước chuyển khái niệm tối thiểu gồm:

- Dự án đang được xem xét.
- Đề xuất/phương án PM muốn đánh giá.

Các trường ứng viên chính xác, payload phương án, hợp đồng dữ liệu và API là
**TBD**. Ứng viên có thể cung cấp ngữ cảnh để tạo phương án, nhưng yêu cầu không
xác nhận một ứng viên là phương án phân bổ hoàn chỉnh.

## 4. Luồng khái niệm và phân tách màn hình

Thiết lập phương án, Chạy mô phỏng, Rà soát tác động và Quyết định của PM là các
bước khái niệm. Chúng chưa được xác nhận là các trang, route hoặc modal riêng.

**GIAO DIỆN ĐỀ XUẤT:** sử dụng một màn hình Mô phỏng giả định với các phần mở
dần theo tiến trình:

1. Ngữ cảnh phương án.
2. Hành động Chạy mô phỏng và trạng thái.
3. Rà soát tác động sau khi có kết quả.
4. Quyết định của PM sau khi kết quả được trình bày.

Cách này giữ dự án và phương án luôn hiển thị trong khi tránh điều hướng bổ
sung. Việc có bắt buộc kết quả mô phỏng hợp lệ trước khi cho phép Chấp nhận hay
không vẫn là **TBD**; cách mở dần nội dung là đề xuất UI cho luồng rà soát, không
phải quy tắc phê duyệt đã xác nhận.

## 5. Điểm bắt đầu

### Mục tiêu của PM

Đánh giá một thay đổi phân bổ được đề xuất trước khi đưa ra quyết định thật.

### Điều kiện bắt đầu

PM đã đến bước Đề xuất nhân sự cho một dự án và chỉ ra phương án muốn đánh giá.
Cách một ứng viên trở thành đề xuất hoàn chỉnh là **TBD**.

### Ngữ cảnh cần giữ

| Thông tin | Mục đích | Trạng thái |
| --- | --- | --- |
| Dự án hiện tại | Ngăn đánh giá phương án trong sai ngữ cảnh dự án | ĐÃ XÁC NHẬN ở mức luồng; trường hiển thị TBD |
| Đề xuất/phương án hiện tại | Xác định nội dung PM muốn mô phỏng | ĐÃ XÁC NHẬN ở mức luồng; cấu trúc phương án TBD |
| Giải thích đề xuất | Giữ lý do phương án được cân nhắc | GIAO DIỆN ĐỀ XUẤT; nội dung chính xác phụ thuộc US-02 |
| Trạng thái mô phỏng trước | Quyết định kết quả cũ còn sử dụng được hay không | TBD |

Không thêm điểm, ngưỡng, công thức xếp hạng hoặc trường ứng viên chưa được xác
nhận vào bước chuyển.

## 6. Thiết lập phương án

### Mục tiêu của PM

Hiểu thay đổi giả định nào sẽ được mô phỏng.

### Cấu trúc độ trung thực thấp

```text
+--------------------------------------------------------------------------+
| < Quay lại Đề xuất nhân sự [GIAO DIỆN ĐỀ XUẤT]                           |
| MÔ PHỎNG GIẢ ĐỊNH                                                        |
| Dự án: [Ngữ cảnh dự án hiện tại — trường chính xác TBD]                 |
+--------------------------------------------------------------------------+
| PHƯƠNG ÁN ĐANG XEM XÉT                                                   |
| Đề xuất/phương án: [Ngữ cảnh minh họa]                                  |
| Thay đổi phân bổ giả định: [TBD]                                        |
| Ràng buộc và xác thực: [TBD]                                             |
+--------------------------------------------------------------------------+
| Đây là mô phỏng. Phân bổ thật chưa thay đổi.                             |
| [Chạy mô phỏng]                                                          |
+--------------------------------------------------------------------------+
```

### Thông tin và xác thực

| Hạng mục | Cách xử lý trong thiết kế | Trạng thái |
| --- | --- | --- |
| Ngữ cảnh dự án | Giữ hiển thị trong màn hình Mô phỏng giả định | ĐÃ XÁC NHẬN ở mức luồng |
| Phương án đang đánh giá | Xác định phương án xuyên suốt bước mô phỏng và rà soát tác động | ĐÃ XÁC NHẬN; nội dung TBD |
| Ứng viên làm ngữ cảnh phương án | Có thể hiển thị như ngữ cảnh minh họa | GIAO DIỆN ĐỀ XUẤT |
| Trường thay đổi phân bổ | Không tự tạo trường hoặc giá trị số | TBD |
| Ràng buộc về mức độ sẵn sàng/khối lượng công việc | Không giả định dữ liệu thiếu có nghĩa là sẵn sàng hoặc chưa được phân bổ | TBD |
| Giới hạn phân bổ, thời lượng, quy tắc khối lượng công việc | Không định nghĩa | TBD |
| Kết quả xác thực phương án | Có thể dành vị trí hiển thị, nhưng quy tắc và hành vi chặn chưa được quyết định | GIAO DIỆN ĐỀ XUẤT / TBD |

### Trạng thái thiếu dữ liệu

UI không được trình bày phương án chưa đầy đủ là đã sẵn sàng dựa trên các giá
trị tự tạo. Dữ liệu tối thiểu, thông báo và hành động tiếp theo là **TBD**. Việc
PM có thể chỉnh sửa, quay lại hay thử lại không phải hành vi nghiệp vụ đã xác nhận.

## 7. Chạy mô phỏng

### Hành động của PM

PM chủ động bắt đầu mô phỏng cho phương án đang xem xét.

### Bất biến

Việc chạy, xem hoặc mô phỏng thất bại không thay đổi phân bổ thật. Nội dung này
được **ĐÃ XÁC NHẬN** bởi PRD và AC-US-03-02.

### Mô hình trạng thái

| Trạng thái | Hành vi UI | Trạng thái yêu cầu |
| --- | --- | --- |
| Sẵn sàng | Hiển thị ngữ cảnh phương án và hành động Chạy mô phỏng | GIAO DIỆN ĐỀ XUẤT; quy tắc sẵn sàng TBD |
| Đang tải | Thể hiện mô phỏng đang chạy; không trình bày tác động như kết quả đã hoàn tất | GIAO DIỆN ĐỀ XUẤT |
| Thành công | Trình bày tác động cho đúng phương án đã mô phỏng | ĐÃ XÁC NHẬN; cách trình bày TBD |
| Thiếu dữ liệu | Không tạo kết quả giả; giải thích rằng chưa có kết quả đáng tin cậy | GIAO DIỆN ĐỀ XUẤT / TBD |
| Thất bại | Không hiển thị kết quả tác động thành công; phân bổ thật giữ nguyên | Bất biến ĐÃ XÁC NHẬN / cách phục hồi TBD |

Timeout, hủy, chính sách thử lại và việc PM có thể tiếp tục đến bước quyết định
sau khi mô phỏng thất bại hay không đều là **TBD**.

## 8. Rà soát tác động

### Mục tiêu của PM

Hiểu tác động dự kiến của đúng phương án đã mô phỏng trước khi đưa ra quyết định.

### Cấu trúc độ trung thực thấp

```text
+--------------------------------------------------------------------------+
| TÁC ĐỘNG DỰ KIẾN                                                        |
| Áp dụng cho: [Phương án vừa mô phỏng]                                   |
+------------------------------------+-------------------------------------+
| Mốc cơ sở                         | Phương án đã mô phỏng               |
| [Cách biểu diễn TBD]               | [Cách biểu diễn TBD]               |
+------------------------------------+-------------------------------------+
| Chỉ báo tác động và mốc so sánh: [TBD]                                  |
| Kết quả này chưa thay đổi phân bổ thật.                                  |
+--------------------------------------------------------------------------+
```

Cách so sánh hai cột là **GIAO DIỆN ĐỀ XUẤT**. Đây không phải định dạng đầu ra
đã xác nhận.

### Thông tin tác động

| Hạng mục | Trạng thái |
| --- | --- |
| Kết quả thuộc đúng phương án đã mô phỏng | ĐÃ XÁC NHẬN — AC-US-03-01 |
| Kết quả là tác động dự kiến, không phải thay đổi phân bổ thật | ĐÃ XÁC NHẬN |
| Cách biểu diễn mốc cơ sở | TBD |
| Chỉ số, thang đo, ngưỡng hoặc công thức tác động | TBD |
| Tác động đến rủi ro, khối lượng công việc, độ phủ kỹ năng, bàn giao hoặc liên dự án | TBD |
| Giải thích lý do tác động thay đổi | TBD |

### Mẫu kết quả

Thiết kế không được giả định mọi mô phỏng đều cải thiện tình hình.

| Kết quả | Cách xử lý trong thiết kế | Trạng thái |
| --- | --- | --- |
| Tác động tích cực | Chỉ trình bày khi kết quả thật hỗ trợ; chỉ số và câu chữ TBD | GIAO DIỆN ĐỀ XUẤT / TBD |
| Không cải thiện | Giữ so sánh trung lập; không tạo ra lợi ích giả | GIAO DIỆN ĐỀ XUẤT / TBD |
| Tác động tiêu cực | Hiển thị chiều tác động được trả về mà không che giấu; cách biểu diễn TBD | GIAO DIỆN ĐỀ XUẤT / TBD |
| Kết quả không đầy đủ | Không trình bày nội dung giữ chỗ như tác động thật | GIAO DIỆN ĐỀ XUẤT / TBD |
| Lỗi | Giữ nguyên phân bổ thật và không hiển thị thành công | Bất biến ĐÃ XÁC NHẬN / cách phục hồi TBD |

Tài liệu này không đưa ra tỷ lệ phần trăm, xác suất, mức giảm rủi ro, phép tính
khối lượng công việc, điểm hoặc công thức lợi ích.

## 9. Quyết định của PM — Chấp nhận / Từ chối

### Mục tiêu của PM

Đưa ra quyết định cuối cùng của con người cho phương án đang được xem xét.

### Ngữ cảnh trước quyết định

- Dự án hiện tại.
- Đúng phương án đang xem xét.
- Kết quả tác động gắn với phương án đó, khi có.
- Tuyên bố rõ rằng phân bổ thật chưa thay đổi trước một thao tác áp dụng được
  cho phép và thành công.

Việc có bắt buộc kết quả mô phỏng hợp lệ trước khi Chấp nhận hay không là **TBD-06**.

### Cấu trúc độ trung thực thấp

```text
+--------------------------------------------------------------------------+
| QUYẾT ĐỊNH CỦA PM                                                       |
| Phương án: [Phương án đang xem xét]                                     |
| [Chấp nhận phương án]                    [Từ chối phương án]             |
| Thời điểm áp dụng và điều kiện đầy đủ: [TBD]                            |
+--------------------------------------------------------------------------+
```

### Kết quả quyết định

| Sự kiện | Kết quả bắt buộc | Trạng thái |
| --- | --- | --- |
| PM chấp nhận, việc áp dụng được cho phép và thành công | Thay đổi thật tương ứng đúng phương án đã chấp nhận | ĐÃ XÁC NHẬN — AC-US-04-01 |
| PM từ chối | Phương án không được áp dụng | ĐÃ XÁC NHẬN — AC-US-04-02 |
| PM không chấp nhận rõ ràng | Phương án không được áp dụng; sự im lặng và đầu ra AI không phải chấp nhận | ĐÃ XÁC NHẬN — AC-US-04-03 |
| Áp dụng thất bại | Không báo phương án đã được áp dụng thành công | ĐÃ XÁC NHẬN — AC-US-04-07 |
| Trạng thái sau khi áp dụng thất bại | Trạng thái phân bổ, phục hồi và hành vi thử lại | TBD — AC-US-04-06 |
| Dữ liệu thay đổi sau mô phỏng | Kiểm tra tính hợp lệ và hành động tiếp theo | TBD — AC-US-04-04 |
| Quyết định lặp | Phát hiện và phản hồi | TBD — AC-US-04-05 |

Chấp nhận không nhất thiết đồng nghĩa với áp dụng ngay. Thời điểm áp dụng, điều
kiện đầy đủ, cách xử lý thất bại một phần và lưu trữ là **TBD**.

**GIAO DIỆN ĐỀ XUẤT:** khi bản mẫu cục bộ ghi nhận lựa chọn Chấp nhận hoặc Từ
chối, phải gắn nhãn đây là quyết định trong bản mẫu và không tuyên bố phân bổ
production đã được cập nhật.

## 10. Quay lại, hủy và giữ ngữ cảnh

| Tương tác | Cách xử lý | Trạng thái |
| --- | --- | --- |
| Quay lại Đề xuất nhân sự | Giữ ngữ cảnh dự án; cách xử lý trạng thái mô phỏng cũ chưa được quyết định | GIAO DIỆN ĐỀ XUẤT / TBD |
| Quay lại sau khi có kết quả | Không hàm ý kết quả áp dụng cho phương án khác | Bất biến ĐÃ XÁC NHẬN / GIAO DIỆN ĐỀ XUẤT |
| Hủy mô phỏng | Không định nghĩa đây là hành động nghiệp vụ riêng khi chưa có yêu cầu | TBD |
| Rời màn hình mà không quyết định | Không áp dụng phương án | ĐÃ XÁC NHẬN; lưu/hủy/hết hạn TBD |

Hành vi quay lại và điều hướng không được làm thay đổi phân bổ thật.

## 11. Ma trận trạng thái và trường hợp biên

| Khu vực | Trạng thái hoặc trường hợp biên | Hành vi đã xác nhận | Nội dung còn TBD |
| --- | --- | --- | --- |
| Luồng trước | Không có ứng viên phù hợp | Không buộc ứng viên không phù hợp vào danh sách | Tiêu chí phù hợp và hành động tiếp theo |
| Điểm bắt đầu | Thiếu ngữ cảnh dự án/phương án | Không tự tạo ngữ cảnh | Thông báo và đường phục hồi |
| Phương án | Thiếu mức độ sẵn sàng/khối lượng công việc | Không suy diễn mức độ sẵn sàng | Hành vi xác thực và tiếp tục |
| Phương án | Có thể vi phạm ràng buộc | Không dùng giới hạn hoặc ngưỡng chưa xác nhận | Cảnh báo, chặn hoặc mô phỏng |
| Mô phỏng | Đang tải | Phân bổ thật giữ nguyên | Timeout và hành vi hủy |
| Mô phỏng | Thất bại | Phân bổ thật giữ nguyên | Thử lại và hành vi chuyển tiếp |
| Tác động | Không cải thiện | Không tạo ra cải thiện giả | Chỉ số và câu chữ |
| Tác động | Kết quả tiêu cực | Không che giấu kết quả bất lợi | Chỉ số và cách trình bày |
| Tác động | Thiếu dữ liệu | Không hiển thị kết quả không đáng tin cậy như sự thật | Hành vi phục hồi |
| Độ mới | Dữ liệu thay đổi sau mô phỏng | Kết quả cũ vẫn gắn với ngữ cảnh cũ | Chính sách lỗi thời và quy tắc mô phỏng lại |
| Quyết định | Từ chối | Không áp dụng | Điều hướng/lưu trữ sau đó |
| Quyết định | Không Chấp nhận rõ ràng | Không áp dụng | Lưu, hủy và hết hạn |
| Quyết định | Gửi lặp | Không định nghĩa quy tắc mới | Tính lũy đẳng và chính sách phản hồi |
| Áp dụng | Thất bại hoặc thất bại một phần | Không báo áp dụng thành công | Trạng thái phân bổ, rollback và thử lại |

## 12. Bất biến yêu cầu

- AI hỗ trợ PM và không đưa ra quyết định cuối cùng.
- Đề xuất không tự động phân bổ ứng viên.
- Đề xuất bao gồm giải thích cơ bản về mức phù hợp.
- Khi không có ứng viên phù hợp, UI không buộc đưa ra kết quả không phù hợp.
- Mô phỏng và mô phỏng thất bại không thay đổi phân bổ thật.
- Từ chối không áp dụng phương án.
- Nếu PM không chấp nhận rõ ràng, phân bổ thật không thay đổi.
- Nếu một thao tác áp dụng được cho phép và thành công, thay đổi phải tương ứng
  với phương án đã chấp nhận.
- Nếu áp dụng thất bại, UI không báo thành công.

## 13. Truy vết yêu cầu

| Bước hoặc trạng thái UI | User Story | Acceptance Criteria | Nguồn yêu cầu | Trạng thái |
| --- | --- | --- | --- | --- |
| Bước chuyển đề xuất và ngữ cảnh phương án | US-02 — PM xem xét ứng viên có thứ hạng và giải thích | AC-US-02-01, AC-US-02-02 | PRD — Đề xuất nhân sự | ĐÃ XÁC NHẬN; ánh xạ phương án TBD |
| Không có ứng viên phù hợp ở luồng trước | US-02 | AC-US-02-03, AC-US-02-05 | Yêu cầu bổ sung đã xác nhận | ĐÃ XÁC NHẬN |
| Không thể tạo đề xuất hoặc thiếu dữ liệu | US-02 | AC-US-02-04 | TBD-01, TBD-03, TBD-07 | TBD |
| Phương án đang xem xét | US-03 — PM đánh giá thay đổi phân bổ được đề xuất | AC-US-03-01 | PRD — Mô phỏng giả định | ĐÃ XÁC NHẬN; cấu trúc TBD |
| Chạy mô phỏng | US-03 | AC-US-03-02 | Quy tắc mô phỏng không phá hủy dữ liệu trong PRD | ĐÃ XÁC NHẬN |
| Vấn đề ràng buộc | US-03 | AC-US-03-03 | TBD-04 | TBD |
| Mô phỏng thất bại | US-03 | AC-US-03-04 | TBD-07 | Bất biến ĐÃ XÁC NHẬN / cách phục hồi TBD |
| Phương án hoặc dữ liệu thay đổi | US-03, US-04 | AC-US-03-05, AC-US-04-04 | TBD-08 | TBD |
| Rà soát tác động | US-03 | AC-US-03-01 | Yêu cầu tác động dự kiến trong PRD | ĐÃ XÁC NHẬN; chỉ số TBD |
| Chấp nhận | US-04 — PM kiểm soát quyết định phân bổ thật | AC-US-04-01, AC-US-04-03 | PRD — PM chấp nhận / từ chối | ĐÃ XÁC NHẬN kèm điều kiện; thời điểm TBD |
| Từ chối | US-04 | AC-US-04-02, AC-US-04-03 | PRD — PM chấp nhận / từ chối | ĐÃ XÁC NHẬN |
| Quyết định lặp | US-04 | AC-US-04-05 | TBD-08 | TBD |
| Áp dụng thất bại | US-04 | AC-US-04-06, AC-US-04-07 | TBD-07 và ràng buộc thất bại đã xác nhận | Ràng buộc ĐÃ XÁC NHẬN / cách phục hồi TBD |

## 14. Câu hỏi mở / TBD

### Phương án

- Nội dung chính xác của một đề xuất phân bổ.
- Ứng viên là đề xuất hoàn chỉnh hay là đầu vào để tạo đề xuất.
- Đầu vào có thể chỉnh sửa và ràng buộc phân bổ.
- Dữ liệu tối thiểu và quy tắc xác thực.
- Có yêu cầu nhiều phương án, chạy lại hoặc đặt lại hay không.

### Mô phỏng và tác động

- Công thức mô phỏng và tiêu chí thành công.
- Chỉ báo tác động, mốc cơ sở, mốc so sánh và cách biểu diễn.
- Phạm vi rủi ro, khối lượng công việc, độ phủ kỹ năng, bàn giao và liên dự án.
- Timeout khi tải, thử lại và phục hồi khi thất bại.
- Chính sách kết quả lỗi thời và mô phỏng lại.

### Quyết định

- Có bắt buộc mô phỏng hợp lệ trước khi Chấp nhận hay không.
- Điều kiện đầy đủ và thời điểm áp dụng.
- Trạng thái sau khi Chấp nhận hoặc Từ chối.
- Lưu trữ, lịch sử, hết hạn và lý do từ chối tùy chọn.
- Quyết định lặp và hành vi áp dụng một phần.
- Phục hồi và thử lại sau khi áp dụng thất bại.

## 15. Giới hạn phạm vi

Thiết kế này không bổ sung:

- Điểm ứng viên, ngưỡng, trọng số xếp hạng hoặc Top N.
- Trường ứng viên chưa được cơ sở yêu cầu xác nhận.
- Giới hạn phân bổ, quy tắc khối lượng công việc hoặc quy tắc thời lượng.
- Công thức mô phỏng, dự báo hoặc lợi ích.
- Tối ưu tự động hoặc AI phê duyệt.
- Lưu trữ production hoặc thay đổi phân bổ thật.
- Quy trình HR, quản lý nhân sự hoặc quản lý dự án đầy đủ.
- Thiết kế API, database, ML, xác thực, thông báo hoặc hạ tầng.

## 16. Kiểm tra rà soát thiết kế

Phần tiếp nối khái niệm của MVP đã được bao phủ:

```text
Đề xuất nhân sự
-> ngữ cảnh phương án
-> Chạy mô phỏng
-> Rà soát tác động
-> PM chấp nhận / từ chối
```

Tài liệu giữ toàn bộ bất biến đã xác nhận và để lộ các quy tắc chưa giải quyết
dưới dạng TBD. Cách phân tách một màn hình và mở dần nội dung vẫn là GIAO DIỆN
ĐỀ XUẤT, cần con người rà soát trước khi được xem là thiết kế đã phê duyệt.
