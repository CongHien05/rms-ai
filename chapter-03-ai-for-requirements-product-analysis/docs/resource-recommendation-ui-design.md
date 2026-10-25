# Thiết kế UI Đề xuất nhân sự và Mô phỏng giả định — MVP

## 1. Phạm vi

Tài liệu này mô tả thiết kế giao diện độ trung thực thấp cho phần tiếp nối từ
**Chi tiết rủi ro dự án**: PM yêu cầu đề xuất nhân sự, xem đề xuất, thử một
phương án phân bổ, xem tác động dự kiến và đưa ra quyết định.

Phạm vi gồm:

- Đề xuất nhân sự và giải thích cơ bản về mức độ phù hợp.
- Mô phỏng giả định không làm thay đổi phân bổ thật.
- Tác động dự kiến của đúng phương án đã mô phỏng.
- Quyết định chấp nhận hoặc từ chối của PM.

Đây là tài liệu thiết kế độ trung thực thấp, không phải đặc tả UI production.
Tài liệu không định nghĩa API, lược đồ cơ sở dữ liệu, thuật toán xếp hạng, mô
hình AI, công thức tính điểm hoặc cơ chế áp dụng thay đổi.

Quy ước trạng thái:

- **ĐÃ XÁC NHẬN:** có căn cứ trực tiếp từ PRD, User Stories hoặc Acceptance Criteria.
- **TBD:** yêu cầu liên quan chưa được tài liệu chốt.
- **TÙY CHỌN:** cải tiến UX, không phải yêu cầu bắt buộc.
- **BẢN MẪU:** dữ liệu hoặc nhãn chỉ phục vụ minh họa wireframe.

## 2. Truy vết yêu cầu

| Yêu cầu | Nguồn | Hàm ý UI | Trạng thái |
| --- | --- | --- | --- |
| PM là người dùng chính và là người quyết định cuối cùng | PRD — Người dùng mục tiêu, Tổng quan sản phẩm; User Stories — Người dùng chính | Toàn bộ luồng hướng tới việc PM xem xét rồi quyết định; AI không tự quyết định | ĐÃ XÁC NHẬN |
| PM yêu cầu đề xuất cho dự án đang xem xét | US-02; AC-US-02-01 | Màn hình đề xuất phải giữ ngữ cảnh dự án từ Chi tiết rủi ro | ĐÃ XÁC NHẬN |
| Kết quả là danh sách ứng viên có thứ hạng | PRD — Phạm vi MVP; US-02; AC-US-02-01 | Hiển thị danh sách có thứ tự; không khẳng định ứng viên đầu tiên tối ưu tuyệt đối | ĐÃ XÁC NHẬN |
| Mỗi ứng viên có giải thích cơ bản về mức độ phù hợp | PRD — Mục tiêu sản phẩm; US-02; AC-US-02-01 | Dành vùng giải thích ở mức sản phẩm/UI, không dùng công thức điểm | ĐÃ XÁC NHẬN |
| Xem đề xuất không tự thay đổi phân bổ thật | AC-US-02-02 | Không hiển thị trạng thái đã phân bổ chỉ vì PM xem danh sách | ĐÃ XÁC NHẬN |
| Không có ứng viên phù hợp phải được thể hiện rõ | AC-US-02-03, AC-US-02-05 | Có trạng thái kết quả rỗng; không tự nới tiêu chí hoặc chèn ứng viên không phù hợp | ĐÃ XÁC NHẬN |
| PM mô phỏng một thay đổi phân bổ được đề xuất | PRD — Phạm vi MVP; US-03 | Màn hình mô phỏng phải chỉ rõ phương án đang được thử; nội dung phương án vẫn TBD | ĐÃ XÁC NHẬN / TBD |
| Mô phỏng không làm thay đổi phân bổ thật | PRD — Phạm vi MVP; AC-US-03-02 | Hiển thị thông báo rõ đây là giả định và dữ liệu thật chưa thay đổi | ĐÃ XÁC NHẬN |
| PM xem tác động dự kiến của đúng phương án đã mô phỏng | US-03; AC-US-03-01 | Kết quả gắn với phương án hiện tại; chỉ báo và cách so sánh là TBD | ĐÃ XÁC NHẬN / TBD |
| PM chấp nhận hoặc từ chối phương án | PRD — Phạm vi MVP; US-04 | Cung cấp hai hành động quyết định, nhưng không ngầm cam kết áp dụng ngay | ĐÃ XÁC NHẬN |
| Chỉ chấp nhận rõ ràng mới có thể dẫn tới thay đổi thật | AC-US-04-01, AC-US-04-03 | Trước khi có chấp nhận rõ ràng, UI luôn coi phân bổ thật là chưa thay đổi | ĐÃ XÁC NHẬN |
| Phương án bị từ chối không được áp dụng | AC-US-04-02 | Nhánh từ chối không thay đổi phân bổ thật; bước tiếp theo vẫn TBD | ĐÃ XÁC NHẬN / TBD |

### 2.1. Kết luận về dữ liệu đề xuất

| Nội dung | Nguồn yêu cầu | Diễn giải | Trạng thái |
| --- | --- | --- | --- |
| Một hay nhiều ứng viên | PRD — Phạm vi MVP; US-02; AC-US-02-01 | Kết quả thành công là một danh sách có thứ hạng; số lượng cụ thể chưa được chốt | ĐÃ XÁC NHẬN / TBD |
| Nhận diện ứng viên | US-02; AC-US-02-01 chỉ xác nhận danh sách ứng viên | Yêu cầu chưa xác nhận trường hoặc cách trình bày thông tin nhận diện | TBD |
| Kỹ năng | PRD — Phạm vi sản phẩm; US-02 | Kỹ năng là ngữ cảnh có thể liên quan, chưa được xác nhận là trường hiển thị bắt buộc | TBD |
| Mức độ sẵn sàng | PRD — Phạm vi sản phẩm; AC-US-02-04 | Cách biểu diễn và xử lý thông tin thiếu chưa được chốt | TBD |
| Khối lượng công việc | PRD — Phạm vi sản phẩm; AC-US-02-04 | Chưa được xác nhận là trường UI bắt buộc; thiếu thông tin không đồng nghĩa đang rảnh | TBD |
| Lý do/giải thích đề xuất | PRD — Mục tiêu sản phẩm; US-02; AC-US-02-01 | Mỗi ứng viên cần giải thích cơ bản về mức độ phù hợp | ĐÃ XÁC NHẬN |
| Mức độ phù hợp | US-02; AC-US-02-01 | Được giải thích ở mức cơ bản; cách đo hoặc biểu diễn định lượng chưa được chốt | ĐÃ XÁC NHẬN / TBD |
| Thứ hạng | PRD — Phạm vi MVP; US-02; AC-US-02-01 | Danh sách phải có thứ hạng; quy tắc, đồng hạng và trọng số chưa được chốt | ĐÃ XÁC NHẬN / TBD |
| Số lượng ứng viên | User Stories — TBD-03 | Không có số lượng tối thiểu hoặc tối đa đã được xác nhận | TBD |
| Điểm ghép nối hoặc phần trăm | PRD — Các vấn đề chưa quyết định; User Stories — TBD-03, TBD-10 | Không có căn cứ để bắt buộc điểm số, thang đo hoặc phần trăm | TBD |
| Độ tin cậy của AI | Không có yêu cầu xác nhận | Không được đưa thành trường bắt buộc | TBD |
| Không có ứng viên phù hợp | AC-US-02-03, AC-US-02-05 | Phải thể hiện kết quả rỗng và không tự đưa ứng viên không phù hợp vào danh sách | ĐÃ XÁC NHẬN |
| Không tạo được đề xuất | AC-US-02-04; User Stories — TBD-01, TBD-07 | Cách phân biệt lỗi, thiếu dữ liệu và hành động tiếp theo chưa được chốt | TBD |

Giải thích mức độ phù hợp khác với công thức tính điểm. Wireframe chỉ dành chỗ
cho giải thích bằng ngôn ngữ ở mức sản phẩm; không mô tả độ quan trọng đặc trưng,
SHAP, độ tin cậy mô hình, trọng số hoặc mức đóng góp toán học.

## 3. Luồng người dùng của PM

```text
Chi tiết rủi ro dự án
  -> Yêu cầu đề xuất nhân sự
  -> Xem danh sách ứng viên có thứ hạng và giải thích
  -> Xác định phương án muốn thử [cách hình thành: TBD]
  -> Chạy mô phỏng giả định
  -> Xem tác động dự kiến của đúng phương án
  -> PM chấp nhận hoặc từ chối
```

| Bước | PM nhìn thấy gì | PM làm gì | Hệ thống phản hồi gì | Bước tiếp theo | Nguồn | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Chuyển từ Chi tiết rủi ro | Dự án hiện tại, đánh giá rủi ro và các yếu tố giải thích | Chọn **Yêu cầu đề xuất nhân sự** | Chuyển sang ngữ cảnh đề xuất của chính dự án đó; không tự thay đổi phân bổ | Đề xuất nhân sự | US-01; US-02; AC-US-02-01, AC-US-02-02 | ĐÃ XÁC NHẬN |
| 2. Xem đề xuất | Danh sách ứng viên có thứ hạng và giải thích cơ bản | Xem xét ứng viên; quan hệ giữa ứng viên và phương án chưa được chốt | Giữ nguyên phân bổ thật; thể hiện rõ nếu không có ứng viên phù hợp | Xác định phương án muốn thử [TBD] | AC-US-02-01 đến AC-US-02-03; TBD-04 | ĐÃ XÁC NHẬN / TBD |
| 3. Xác định phương án | Phương án thay đổi phân bổ đang được xem xét | Chọn **Thử phương án** | Ghi nhận phương án cho mô phỏng ở mức UI; nội dung và cách hình thành phương án chưa được chốt | Mô phỏng giả định | US-03; TBD-04 | ĐÃ XÁC NHẬN / TBD |
| 4. Chạy mô phỏng | Dự án và phương án đang xem xét; thông báo không phá hủy dữ liệu | Kích hoạt mô phỏng | Không thay đổi phân bổ thật, kể cả khi mô phỏng thất bại | Xem tác động | AC-US-03-02 | ĐÃ XÁC NHẬN |
| 5. Xem tác động | Tác động dự kiến của đúng phương án đã mô phỏng | So sánh thông tin được cung cấp | Hiển thị kết quả gắn với phương án; chỉ báo và mốc so sánh còn TBD | Quyết định | AC-US-03-01; TBD-05 | ĐÃ XÁC NHẬN / TBD |
| 6. Quyết định | Phương án và kết quả mô phỏng đang được xem xét | Chấp nhận hoặc từ chối | Không suy diễn kết quả AI hoặc sự im lặng thành chấp nhận | Kết quả quyết định | US-04; AC-US-04-01 đến AC-US-04-03 | ĐÃ XÁC NHẬN / TBD |

## 4. Đề xuất nhân sự — Wireframe

Đề xuất dùng một màn hình riêng sau Chi tiết rủi ro. Màn hình này tập trung vào
việc PM hiểu danh sách và chọn một phương án để tiếp tục, không trộn kết quả mô
phỏng chưa tồn tại vào màn hình.

```text
+----------------------------------------------------------------------------+
| < Quay lại Chi tiết rủi ro [TÙY CHỌN]                                      |
| ĐỀ XUẤT NHÂN SỰ                                                            |
| Dự án: [Ngữ cảnh dự án hiện tại — trường hiển thị: Chưa xác định]          |
| Tóm tắt rủi ro: [TÙY CHỌN — cách biểu diễn chưa xác định]                  |
+----------------------------------------------------------------------------+
| DANH SÁCH ỨNG VIÊN CÓ THỨ HẠNG                                             |
|                                                                            |
| 1. Ứng viên A [Minh họa — chưa phải phương án phân bổ hoàn chỉnh]          |
|    Thông tin nhận diện: [Chưa xác định]                                    |
|    Giải thích mức độ phù hợp: [Nội dung minh họa]                          |
|    [Dùng làm ngữ cảnh mô phỏng — cấu trúc phương án: Chưa xác định]         |
|                                                                            |
| 2. Ứng viên B [Minh họa — chưa phải phương án phân bổ hoàn chỉnh]          |
|    Thông tin nhận diện: [Chưa xác định]                                    |
|    Giải thích mức độ phù hợp: [Nội dung minh họa]                          |
|    [Dùng làm ngữ cảnh mô phỏng — cấu trúc phương án: Chưa xác định]         |
+----------------------------------------------------------------------------+
| Không hiển thị phần trăm phù hợp, điểm số hoặc độ tin cậy của AI khi chưa   |
| được xác nhận.                                                             |
+----------------------------------------------------------------------------+
```

| Thành phần | Mục đích | Trạng thái |
| --- | --- | --- |
| Ngữ cảnh dự án | Xác nhận đề xuất thuộc đúng dự án được chuyển từ Chi tiết rủi ro | ĐÃ XÁC NHẬN; trường cụ thể TBD |
| Tóm tắt rủi ro | Giữ ngữ cảnh lý do PM mở đề xuất | TÙY CHỌN; cách biểu diễn TBD |
| Danh sách có thứ hạng | Cho PM so sánh ứng viên theo thứ tự hệ thống cung cấp | ĐÃ XÁC NHẬN; số lượng và quy tắc xếp hạng TBD |
| Nhận diện ứng viên | Cách phân biệt và các trường hiển thị chưa được yêu cầu xác nhận | TBD |
| Giải thích mức độ phù hợp | Trả lời vì sao ứng viên được đề xuất ở mức cơ bản | ĐÃ XÁC NHẬN; nội dung/định dạng TBD |
| Kỹ năng, mức độ sẵn sàng, khối lượng công việc | Có thể hỗ trợ giải thích nhưng chưa được xác nhận là trường độc lập | TBD |
| Dùng làm ngữ cảnh mô phỏng | Chuyển candidate ID làm ngữ cảnh minh họa cho prototype; ứng viên không phải phương án phân bổ hoàn chỉnh hoặc đã được xác thực | GIAO DIỆN ĐỀ XUẤT / TBD |

### Trạng thái không có ứng viên phù hợp

```text
+----------------------------------------------------------------------------+
| KHÔNG CÓ ỨNG VIÊN PHÙ HỢP                                                  |
| Hệ thống không đưa ứng viên không phù hợp vào danh sách chỉ để có kết quả.  |
| Hành động tiếp theo của PM: [Chưa xác định]                                |
+----------------------------------------------------------------------------+
```

Trạng thái rỗng là **ĐÃ XÁC NHẬN**. Tiêu chí phù hợp, cách trình bày chi tiết
và hành động tiếp theo là **TBD**.

## 5. Mô phỏng giả định — Wireframe

Mô phỏng được đề xuất là màn hình/trạng thái thứ hai. Phương án phải được xác
định trước khi chạy, nhưng nội dung một phương án và cách PM chỉnh phương án vẫn
là TBD.

```text
+----------------------------------------------------------------------------+
| < Quay lại Đề xuất nhân sự [TÙY CHỌN]                                      |
| MÔ PHỎNG GIẢ ĐỊNH                                                         |
| Dự án: [Ngữ cảnh dự án hiện tại]                                          |
+----------------------------------------------------------------------------+
| PHƯƠNG ÁN ĐANG XEM XÉT                                                    |
| Ứng viên/phương án: [Minh họa — cấu trúc chính xác chưa xác định]          |
| Thay đổi phân bổ giả định: [Chưa xác định]                                |
| Ràng buộc cần kiểm tra: [Chưa xác định]                                   |
+----------------------------------------------------------------------------+
| Đây là mô phỏng. Phân bổ thật chưa thay đổi.                               |
|                                                                            |
| [Chạy mô phỏng]                                                           |
+----------------------------------------------------------------------------+
```

| Câu hỏi | Kết luận | Trạng thái |
| --- | --- | --- |
| PM thử thay đổi gì? | Một thay đổi phân bổ được đề xuất; nội dung cụ thể chưa được chốt | ĐÃ XÁC NHẬN / TBD |
| PM chọn ứng viên hay phương án? | Yêu cầu nói về phương án thay đổi phân bổ, không xác nhận ứng viên đơn lẻ đã là phương án hoàn chỉnh | TBD |
| Có thể thử nhiều ứng viên/phương án không? | Chưa được xác nhận | TBD |
| PM chỉnh phân bổ giả định như thế nào? | Chưa được xác nhận | TBD |
| Mô phỏng có thay đổi dữ liệu thật không? | Không, kể cả khi mô phỏng thất bại | ĐÃ XÁC NHẬN |
| Có thể chạy nhiều lần, đổi phương án hoặc đặt lại không? | Chưa được xác nhận | TBD |
| Hệ thống phản hồi gì? | Tác động dự kiến của đúng phương án đã mô phỏng | ĐÃ XÁC NHẬN; định dạng TBD |

## 6. Tác động — Wireframe

Kết quả tác động nằm trong cùng màn hình với mô phỏng và quyết định để PM không
mất ngữ cảnh phương án. Yêu cầu chưa xác nhận tác động phải là chỉ báo cụ thể về
rủi ro, khối lượng công việc, độ phủ kỹ năng hay bàn giao.

```text
+----------------------------------------------------------------------------+
| TÁC ĐỘNG DỰ KIẾN                                                          |
| Kết quả áp dụng cho: [Phương án vừa mô phỏng]                              |
+-------------------------------------+--------------------------------------+
| Đánh giá hiện tại                  | Đánh giá sau mô phỏng                |
| [Cách biểu diễn: Chưa xác định]    | [Cách biểu diễn: Chưa xác định]      |
+-------------------------------------+--------------------------------------+
| Chỉ báo tác động và mốc so sánh: [Chưa xác định]                          |
| Phạm vi ảnh hưởng tới dự án khác: [Chưa xác định]                         |
+----------------------------------------------------------------------------+
| Kết quả mô phỏng chưa thay đổi phân bổ thật.                               |
+----------------------------------------------------------------------------+
```

Các nội dung sau đều là **TBD** và không được biểu diễn bằng số giả:

- Rủi ro trước/sau hoặc mức thay đổi rủi ro.
- Tác động tới khối lượng công việc, độ phủ kỹ năng, bàn giao hoặc nguồn lực.
- Yếu tố nào thay đổi và cách giải thích thay đổi.
- Mốc so sánh, thang đo, ngưỡng và màu theo ngữ nghĩa.

| Nhận định về tác động | Nguồn yêu cầu | Trạng thái |
| --- | --- | --- |
| PM xem tác động dự kiến của đúng phương án đã mô phỏng | US-03; AC-US-03-01 | ĐÃ XÁC NHẬN |
| Tác động bao gồm rủi ro | User Stories — TBD-05 | TBD |
| Tác động bao gồm khối lượng công việc | User Stories — TBD-05 | TBD |
| Tác động bao gồm độ phủ kỹ năng | User Stories — TBD-05 | TBD |
| Tác động bao gồm bàn giao | User Stories — TBD-05 | TBD |
| Tác động phải dùng bố cục Trước/Sau | User Stories — TBD-05 | TBD |

Bố cục hai cột trong wireframe là **TÙY CHỌN**. Đây không phải định dạng so
sánh đã được yêu cầu xác nhận.

## 7. Quyết định — Chấp nhận / Từ chối

```text
+----------------------------------------------------------------------------+
| QUYẾT ĐỊNH CỦA PM                                                         |
| Phương án: [Phương án đã xem xét]                                         |
|                                                                            |
| [Chấp nhận phương án]              [Từ chối phương án]                    |
|                                                                            |
| Điều kiện và thời điểm áp dụng thay đổi thật: [Chưa xác định]              |
+----------------------------------------------------------------------------+
```

| Nhận định | Nguồn yêu cầu | Kết luận rà soát | Trạng thái |
| --- | --- | --- | --- |
| PM có hành động chấp nhận | PRD — Phạm vi MVP; US-04 | PM có thể chấp nhận phương án đang xem xét | ĐÃ XÁC NHẬN |
| Ảnh hưởng của chấp nhận lên phân bổ thật | AC-US-04-01 | Nếu việc áp dụng được phép và thành công, thay đổi thật phải tương ứng đúng phương án PM đã chấp nhận | ĐÃ XÁC NHẬN |
| Điều kiện và thời điểm áp dụng | User Stories — TBD-06; AC-US-04-01 | Chưa xác định điều kiện đủ, thời điểm áp dụng hoặc yêu cầu mô phỏng hợp lệ | TBD |
| Hành vi khi áp dụng thất bại | AC-US-04-06, AC-US-04-07; User Stories — TBD-07 | Không được báo áp dụng thành công; trạng thái phân bổ, phục hồi và thử lại chưa được chốt | ĐÃ XÁC NHẬN / TBD |
| PM có hành động từ chối | PRD — Phạm vi MVP; US-04; AC-US-04-02 | PM có thể từ chối phương án | ĐÃ XÁC NHẬN |
| Ảnh hưởng của từ chối | AC-US-04-02 | Phương án bị từ chối không được áp dụng vào phân bổ thật | ĐÃ XÁC NHẬN |
| Hành vi sau từ chối | User Stories — TBD-09 | Lưu quyết định, quay lại đề xuất, chọn ứng viên khác hoặc đặt lại mô phỏng chưa được chốt | TBD |
| Lý do từ chối bắt buộc | AC-US-04-02 | Yêu cầu không bắt buộc PM cung cấp lý do | ĐÃ XÁC NHẬN |
| Thu thập lý do từ chối tùy chọn | Không có yêu cầu xác nhận | Có thêm UX này hay không chưa được chốt | TÙY CHỌN / TBD |
| Không đưa ra quyết định | AC-US-04-03 | Không được suy diễn thành chấp nhận; phương án không được áp dụng | ĐÃ XÁC NHẬN |
| Lưu, hủy hoặc hết hạn khi không quyết định | User Stories — TBD-09 | Chưa được chốt | TBD |

Nhãn nút chỉ thể hiện quyết định của PM. Wireframe không khẳng định rằng nhấn
**Chấp nhận phương án** đồng nghĩa thay đổi đã được áp dụng ngay hoặc chắc chắn
thành công.

## 8. Trạng thái không khả dụng

### Không tạo được đề xuất — TBD

```text
+----------------------------------------------------------------------------+
| CHƯA THỂ ĐƯA RA ĐỀ XUẤT                                                   |
| Hiện chưa đủ căn cứ để trình bày một kết quả đáng tin cậy.                 |
| Lý do cụ thể, dữ liệu còn thiếu và hành động tiếp theo: [Chưa xác định]    |
+----------------------------------------------------------------------------+
```

Câu chữ trên là **BẢN MẪU/TBD**. Không mặc định thiếu dữ liệu mức độ sẵn sàng
có nghĩa là có thể phân bổ hoặc thiếu dữ liệu khối lượng công việc có nghĩa là
đang rảnh. Trạng thái này phải được phân biệt với trạng thái **không có ứng viên
phù hợp** đã được xác nhận.

### Không mô phỏng hoặc tính được tác động — TBD

```text
+----------------------------------------------------------------------------+
| CHƯA THỂ MÔ PHỎNG PHƯƠNG ÁN                                               |
| Không hiển thị tác động giả định như một kết quả đáng tin cậy.             |
| Thử lại, đổi phương án hoặc tiếp tục tới quyết định: [Chưa xác định]       |
| Phân bổ thật không thay đổi.                                               |
+----------------------------------------------------------------------------+
```

Nếu việc áp dụng sau chấp nhận thất bại, hệ thống không được báo đã áp dụng
thành công (**ĐÃ XÁC NHẬN**, AC-US-04-07). Trạng thái phân bổ, cách phục hồi và
thử lại vẫn là **TBD**.

## 9. Chuyển tiếp / Điều hướng quay lại

| Chuyển tiếp | Ngữ cảnh tối thiểu | Hành vi | Nguồn yêu cầu | Trạng thái |
| --- | --- | --- | --- | --- |
| Chi tiết rủi ro -> Đề xuất nhân sự | Dự án hiện đang được PM xem xét | Mở màn hình đề xuất cho cùng dự án; không định nghĩa payload hoặc API | US-02; AC-US-02-01 | ĐÃ XÁC NHẬN |
| Đề xuất nhân sự -> Chi tiết rủi ro | Dự án hiện tại | Quay lại để xem rủi ro và yếu tố giải thích; không thay đổi phân bổ | Không có yêu cầu bắt buộc | TÙY CHỌN |
| Đề xuất nhân sự -> Mô phỏng | Dự án và phương án đang xem xét | Mô phỏng giả định là bước tiếp theo đã xác nhận; cách ứng viên trở thành phương án còn TBD | US-03; TBD-04 | ĐÃ XÁC NHẬN / TBD |
| Mô phỏng -> Đề xuất nhân sự | Dự án hiện tại | Quay lại/đổi phương án là UX hợp lý, nhưng xử lý kết quả mô phỏng cũ chưa được chốt | TBD-08 | TÙY CHỌN / TBD |
| Sau quyết định | Phương án và quyết định của PM | Trạng thái tiếp theo, lưu trữ và thông báo kết quả chưa được chốt | TBD-07 đến TBD-09 | TBD |

Thiết kế không yêu cầu router. Hai màn hình có thể là các trạng thái liên tiếp
trong khung ứng dụng hiện tại; lựa chọn kỹ thuật thuộc lượt triển khai sau.

Trong prototype hiện tại, `candidateId` chỉ giúp giữ đúng ngữ cảnh minh họa khi
chuyển màn hình. Nó không phải allocation payload, không chứng minh phương án
đã đầy đủ và không xác nhận availability, workload, duration hoặc utilization.

## 10. TBD / Câu hỏi mở

### Đề xuất nhân sự

- Trường nhận diện ứng viên tối thiểu và các trường được phép hiển thị.
- Số lượng ứng viên, quy tắc xếp hạng, đồng hạng và thứ tự ổn định.
- Có sử dụng điểm ghép nối hay không; nếu có, thang đo, ngưỡng và cách giải thích.
- Cách biểu diễn kỹ năng, mức độ sẵn sàng và khối lượng công việc.
- Nội dung/độ chi tiết của giải thích và quan hệ giữa giải thích với thứ hạng.
- Tiêu chí ứng viên phù hợp/loại trừ và hành động khi không có kết quả.
- Cách phân biệt dữ liệu thiếu, lỗi tạo đề xuất và kết quả rỗng.

### Mô phỏng giả định

- Nội dung chính xác của một phương án thay đổi phân bổ.
- Ứng viên được chọn là phương án hoàn chỉnh hay chỉ là đầu vào để tạo phương án.
- Đầu vào PM được phép thay đổi và các ràng buộc phân bổ.
- Số phương án có thể thử; có hỗ trợ chạy lặp, đổi phương án hoặc đặt lại không.
- Hành vi khi phương án vi phạm ràng buộc hoặc mô phỏng thất bại.
- Xử lý kết quả khi phương án hoặc dữ liệu thật thay đổi sau mô phỏng.

### Tác động

- Chỉ báo tác động, mốc so sánh và cách biểu diễn trước/sau.
- Tác động nào về rủi ro, khối lượng công việc, độ phủ kỹ năng, bàn giao hoặc
  nguồn lực thật sự cần cho MVP.
- Phạm vi ảnh hưởng tới dự án khác và cách giải thích yếu tố thay đổi.

### Quyết định

- Điều kiện đủ và thời điểm áp dụng sau khi PM chấp nhận.
- Có bắt buộc kết quả mô phỏng hợp lệ trước khi chấp nhận hay không.
- Trạng thái tiếp theo sau chấp nhận/từ chối; lưu trữ, lịch sử hoặc hết hạn.
- Có thu thập lý do từ chối như UX tùy chọn hay không.
- Xử lý quyết định lặp, dữ liệu lỗi thời, áp dụng thất bại hoặc áp dụng không đầy đủ.

## 11. Kiểm tra câu chuyện MVP đầy đủ

| Bước demo | Tài liệu hỗ trợ | Khoảng trống còn lại |
| --- | --- | --- |
| PM chọn dự án | Đã có trong `pm-risk-ui-design.md` và UI rủi ro cơ bản | Quy tắc hiển thị dự án vẫn TBD |
| PM thấy rủi ro và hiểu yếu tố giải thích | Đã có trong Tổng quan/Chi tiết rủi ro | Cách biểu diễn rủi ro và mức đóng góp của yếu tố vẫn TBD |
| PM yêu cầu đề xuất nhân sự | Bước chuyển hiện có nối vào màn hình đề xuất | Điều kiện cho phép yêu cầu vẫn TBD |
| PM xem đề xuất | Wireframe có danh sách thứ hạng, giải thích và trạng thái rỗng | Trường ứng viên, số lượng, điểm và quy tắc xếp hạng vẫn TBD |
| PM thử phương án | Wireframe xác định phương án và hành động mô phỏng | Cách ứng viên trở thành phương án và đầu vào mô phỏng vẫn TBD |
| PM xem tác động | Wireframe giữ so sánh trung lập, không dùng số giả | Chỉ báo tác động và cách biểu diễn trước/sau vẫn TBD |
| PM đưa ra quyết định | Wireframe có chấp nhận/từ chối và giới hạn không tự áp dụng | Điều kiện/thời điểm áp dụng và hành vi sau quyết định vẫn TBD |

Câu chuyện UI MVP đầy đủ đã được nối ở mức luồng và thiết kế độ trung thực thấp:

```text
PM chọn dự án
-> thấy rủi ro
-> hiểu yếu tố giải thích
-> yêu cầu đề xuất nhân sự
-> xem đề xuất
-> thử phương án
-> xem tác động dự kiến
-> chấp nhận hoặc từ chối
```

Các khoảng trống còn lại là quyết định yêu cầu được ghi rõ ở mục TBD, không phải
quy tắc nghiệp vụ được tài liệu tự bổ sung.
