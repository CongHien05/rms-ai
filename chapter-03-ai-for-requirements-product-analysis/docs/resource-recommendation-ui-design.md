# Resource Recommendation & What-if UI Design — MVP

## 1. Scope

Tài liệu này mô tả thiết kế giao diện mức độ trung thực thấp cho phần tiếp nối từ **Chi tiết rủi ro dự án**: PM yêu cầu đề xuất nhân sự, xem đề xuất, thử một phương án phân bổ, xem tác động dự kiến và đưa ra quyết định.

Phạm vi gồm:

- Đề xuất nhân sự và giải thích cơ bản về mức độ phù hợp.
- Mô phỏng giả định không làm thay đổi phân bổ thật.
- Tác động dự kiến của đúng phương án đã mô phỏng.
- Quyết định chấp nhận hoặc từ chối của PM.

Đây là artifact thiết kế low-fidelity, không phải đặc tả production UI. Tài liệu không định nghĩa API, lược đồ cơ sở dữ liệu, thuật toán xếp hạng, mô hình AI, công thức tính điểm hoặc cơ chế áp dụng thay đổi.

Quy ước trạng thái:

- **Confirmed:** có căn cứ trực tiếp từ PRD, User Stories hoặc Acceptance Criteria.
- **TBD:** requirement liên quan chưa được tài liệu chốt.
- **Optional:** cải tiến UX, không phải requirement bắt buộc.
- **Mock:** dữ liệu hoặc nhãn chỉ phục vụ minh họa wireframe.

## 2. Requirement Traceability

| Requirement | Source | UI implication | Status |
| --- | --- | --- | --- |
| PM là người dùng chính và là người quyết định cuối cùng | PRD — Người dùng mục tiêu, Tổng quan sản phẩm; User Stories — Người dùng chính | Toàn bộ flow hướng tới việc PM xem xét rồi quyết định; AI không tự quyết định | Confirmed |
| PM yêu cầu đề xuất cho dự án đang xem xét | US-02; AC-US-02-01 | View đề xuất phải giữ ngữ cảnh dự án từ Risk Detail | Confirmed |
| Kết quả là danh sách ứng viên có thứ hạng | PRD — Phạm vi MVP; US-02; AC-US-02-01 | Hiển thị danh sách có thứ tự; không khẳng định ứng viên đầu tiên tối ưu tuyệt đối | Confirmed |
| Mỗi ứng viên có giải thích cơ bản về mức độ phù hợp | PRD — Mục tiêu sản phẩm; US-02; AC-US-02-01 | Dành vùng giải thích ở mức product/UI, không dùng công thức điểm | Confirmed |
| Xem đề xuất không tự thay đổi phân bổ thật | AC-US-02-02 | Không hiển thị trạng thái đã phân bổ chỉ vì PM xem danh sách | Confirmed |
| Không có ứng viên phù hợp phải được thể hiện rõ | AC-US-02-03, AC-US-02-05 | Có trạng thái kết quả rỗng; không tự nới tiêu chí hoặc chèn ứng viên không phù hợp | Confirmed |
| PM mô phỏng một thay đổi phân bổ được đề xuất | PRD — Phạm vi MVP; US-03 | View mô phỏng phải chỉ rõ phương án đang được thử; nội dung phương án vẫn TBD | Confirmed / TBD |
| Mô phỏng không làm thay đổi phân bổ thật | PRD — Phạm vi MVP; AC-US-03-02 | Hiển thị thông báo rõ đây là giả định và dữ liệu thật chưa thay đổi | Confirmed |
| PM xem tác động dự kiến của đúng phương án đã mô phỏng | US-03; AC-US-03-01 | Kết quả gắn với phương án hiện tại; chỉ báo và cách so sánh là TBD | Confirmed / TBD |
| PM chấp nhận hoặc từ chối phương án | PRD — Phạm vi MVP; US-04 | Cung cấp hai hành động quyết định, nhưng không ngầm cam kết áp dụng ngay | Confirmed |
| Chỉ chấp nhận rõ ràng mới có thể dẫn tới thay đổi thật | AC-US-04-01, AC-US-04-03 | Trước khi có chấp nhận rõ ràng, UI luôn coi phân bổ thật là chưa thay đổi | Confirmed |
| Phương án bị từ chối không được áp dụng | AC-US-04-02 | Nhánh từ chối không thay đổi phân bổ thật; bước tiếp theo vẫn TBD | Confirmed / TBD |

### 2.1. Kết luận về dữ liệu đề xuất

| Nội dung | Requirement source | Diễn giải | Status |
| --- | --- | --- | --- |
| Một hay nhiều ứng viên | PRD — Phạm vi MVP; US-02; AC-US-02-01 | Kết quả thành công là một danh sách có thứ hạng; số lượng cụ thể chưa được chốt | Confirmed / TBD |
| Nhận diện ứng viên | US-02; AC-US-02-01 chỉ xác nhận danh sách ứng viên | Requirement chưa xác nhận trường hoặc cách trình bày thông tin nhận diện | TBD |
| Kỹ năng | PRD — Phạm vi sản phẩm; US-02 | Kỹ năng là ngữ cảnh có thể liên quan, chưa được xác nhận là field hiển thị bắt buộc | TBD |
| Mức độ sẵn sàng | PRD — Phạm vi sản phẩm; AC-US-02-04 | Cách biểu diễn và xử lý thông tin thiếu chưa được chốt | TBD |
| Khối lượng công việc | PRD — Phạm vi sản phẩm; AC-US-02-04 | Chưa được xác nhận là field UI bắt buộc; thiếu thông tin không đồng nghĩa đang rảnh | TBD |
| Lý do/giải thích đề xuất | PRD — Mục tiêu sản phẩm; US-02; AC-US-02-01 | Mỗi ứng viên cần giải thích cơ bản về mức độ phù hợp | Confirmed |
| Mức độ phù hợp | US-02; AC-US-02-01 | Được giải thích ở mức cơ bản; cách đo hoặc biểu diễn định lượng chưa được chốt | Confirmed / TBD |
| Thứ hạng | PRD — Phạm vi MVP; US-02; AC-US-02-01 | Danh sách phải có thứ hạng; quy tắc, đồng hạng và trọng số chưa được chốt | Confirmed / TBD |
| Số lượng ứng viên | User Stories — TBD-03 | Không có số lượng tối thiểu hoặc tối đa đã được xác nhận | TBD |
| Matching score hoặc phần trăm | PRD — Các vấn đề chưa quyết định; User Stories — TBD-03, TBD-10 | Không có căn cứ để bắt buộc điểm số, scale hoặc phần trăm | TBD |
| AI confidence | Không có requirement xác nhận | Không được đưa thành field bắt buộc | TBD |
| Không có ứng viên phù hợp | AC-US-02-03, AC-US-02-05 | Phải thể hiện kết quả rỗng và không tự đưa ứng viên không phù hợp vào danh sách | Confirmed |
| Không tạo được đề xuất | AC-US-02-04; User Stories — TBD-01, TBD-07 | Cách phân biệt lỗi, thiếu dữ liệu và hành động tiếp theo chưa được chốt | TBD |

Giải thích mức độ phù hợp khác với công thức tính điểm. Wireframe chỉ dành chỗ cho giải thích bằng ngôn ngữ ở mức sản phẩm; không mô tả feature importance, SHAP, model confidence, trọng số hoặc đóng góp toán học.

## 3. PM User Flow

```text
Chi tiết rủi ro dự án
  -> Yêu cầu đề xuất nhân sự
  -> Xem danh sách ứng viên có thứ hạng và giải thích
  -> Xác định phương án muốn thử [cách hình thành: TBD]
  -> Chạy mô phỏng giả định
  -> Xem tác động dự kiến của đúng phương án
  -> PM chấp nhận hoặc từ chối
```

| Bước | PM nhìn thấy gì | PM làm gì | Hệ thống phản hồi gì | Bước tiếp theo | Source | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Handoff từ Risk Detail | Dự án hiện tại, đánh giá rủi ro và các yếu tố giải thích | Chọn **Yêu cầu đề xuất nhân sự** | Chuyển sang ngữ cảnh đề xuất của chính dự án đó; không tự thay đổi phân bổ | Đề xuất nhân sự | US-01; US-02; AC-US-02-01, AC-US-02-02 | Confirmed |
| 2. Xem đề xuất | Danh sách ứng viên có thứ hạng và giải thích cơ bản | Xem xét ứng viên; quan hệ giữa candidate và phương án chưa được chốt | Giữ nguyên phân bổ thật; thể hiện rõ nếu không có ứng viên phù hợp | Xác định phương án muốn thử [TBD] | AC-US-02-01 đến AC-US-02-03; TBD-04 | Confirmed / TBD |
| 3. Xác định phương án | Phương án thay đổi phân bổ đang được xem xét | Chọn **Thử phương án** | Ghi nhận phương án cho mô phỏng ở mức UI; nội dung và cách hình thành phương án chưa được chốt | Mô phỏng giả định | US-03; TBD-04 | Confirmed / TBD |
| 4. Chạy mô phỏng | Dự án và phương án đang xem xét; thông báo không phá hủy dữ liệu | Kích hoạt mô phỏng | Không thay đổi phân bổ thật, kể cả khi mô phỏng thất bại | Xem tác động | AC-US-03-02 | Confirmed |
| 5. Xem tác động | Tác động dự kiến của đúng phương án đã mô phỏng | So sánh thông tin được cung cấp | Hiển thị kết quả gắn với phương án; chỉ báo và mốc so sánh còn TBD | Quyết định | AC-US-03-01; TBD-05 | Confirmed / TBD |
| 6. Quyết định | Phương án và kết quả mô phỏng đang được xem xét | Chấp nhận hoặc từ chối | Không suy diễn kết quả AI hoặc sự im lặng thành chấp nhận | Kết quả quyết định | US-04; AC-US-04-01 đến AC-US-04-03 | Confirmed / TBD |

## 4. Resource Recommendation — Wireframe

Đề xuất dùng một view riêng sau Risk Detail. View này tập trung vào việc PM hiểu danh sách và chọn một phương án để tiếp tục, không trộn kết quả mô phỏng chưa tồn tại vào màn hình.

```text
+----------------------------------------------------------------------------+
| < Quay lại Chi tiết rủi ro [Optional]                                       |
| ĐỀ XUẤT NHÂN SỰ                                                            |
| Dự án: [Ngữ cảnh dự án hiện tại — trường hiển thị: Chưa xác định]          |
| Tóm tắt rủi ro: [Optional — cách biểu diễn chưa xác định]                   |
+----------------------------------------------------------------------------+
| DANH SÁCH ỨNG VIÊN CÓ THỨ HẠNG                                             |
|                                                                            |
| 1. Ứng viên A [Minh họa]                                                   |
|    Thông tin nhận diện: [Chưa xác định]                                    |
|    Giải thích mức độ phù hợp: [Nội dung minh họa]                          |
|    [Thử phương án — cách hình thành phương án: Chưa xác định]              |
|                                                                            |
| 2. Ứng viên B [Minh họa]                                                   |
|    Thông tin nhận diện: [Chưa xác định]                                    |
|    Giải thích mức độ phù hợp: [Nội dung minh họa]                          |
|    [Thử phương án — cách hình thành phương án: Chưa xác định]              |
+----------------------------------------------------------------------------+
| Không hiển thị phần trăm phù hợp, điểm số hoặc độ tin cậy của AI khi chưa   |
| được xác nhận.                                                             |
+----------------------------------------------------------------------------+
```

| Thành phần | Mục đích | Status |
| --- | --- | --- |
| Project context | Xác nhận đề xuất thuộc đúng dự án được chuyển từ Risk Detail | Confirmed; field cụ thể TBD |
| Risk summary | Giữ ngữ cảnh lý do PM mở đề xuất | Optional; representation TBD |
| Danh sách có thứ hạng | Cho PM so sánh các ứng viên theo thứ tự do hệ thống cung cấp | Confirmed; số lượng và ranking rule TBD |
| Nhận diện ứng viên | Cách phân biệt và các trường hiển thị chưa được requirement xác nhận | TBD |
| Giải thích mức độ phù hợp | Trả lời vì sao ứng viên được đề xuất ở mức cơ bản | Confirmed; nội dung/format TBD |
| Kỹ năng, availability, workload | Có thể hỗ trợ giải thích nhưng chưa được xác nhận là field độc lập | TBD |
| Thử phương án | Nối candidate/phương án sang mô phỏng; vị trí action và cách candidate trở thành phương án chưa được chốt | TBD |

### Trạng thái không có ứng viên phù hợp

```text
+----------------------------------------------------------------------------+
| KHÔNG CÓ ỨNG VIÊN PHÙ HỢP                                                  |
| Hệ thống không đưa ứng viên không phù hợp vào danh sách chỉ để có kết quả.  |
| Hành động tiếp theo của PM: [Chưa xác định]                                |
+----------------------------------------------------------------------------+
```

Trạng thái rỗng là **Confirmed**. Tiêu chí phù hợp, cách trình bày chi tiết và hành động tiếp theo là **TBD**.

## 5. What-if Simulation — Wireframe

Mô phỏng được đề xuất là view/state thứ hai. Phương án phải được xác định trước khi chạy, nhưng nội dung một phương án và cách PM chỉnh phương án vẫn là TBD.

```text
+----------------------------------------------------------------------------+
| < Quay lại Đề xuất nhân sự [Optional]                                      |
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

| Câu hỏi | Kết luận | Status |
| --- | --- | --- |
| PM thử thay đổi gì? | Một thay đổi phân bổ được đề xuất; nội dung cụ thể chưa được chốt | Confirmed / TBD |
| PM chọn candidate hay phương án? | Requirement nói về phương án thay đổi phân bổ, không xác nhận candidate đơn lẻ đã là phương án hoàn chỉnh | TBD |
| Có thể thử nhiều candidate/phương án không? | Chưa được xác nhận | TBD |
| PM chỉnh allocation giả định như thế nào? | Chưa được xác nhận | TBD |
| Mô phỏng có thay đổi dữ liệu thật không? | Không, kể cả khi mô phỏng thất bại | Confirmed |
| Có thể chạy nhiều lần, đổi phương án hoặc reset không? | Chưa được xác nhận | TBD |
| Hệ thống phản hồi gì? | Tác động dự kiến của đúng phương án đã mô phỏng | Confirmed; format TBD |

## 6. Impact — Wireframe

Kết quả tác động nằm trong cùng view với mô phỏng và quyết định để PM không mất ngữ cảnh phương án. Requirement chưa xác nhận tác động phải là risk, workload, skill coverage hay delivery indicator cụ thể.

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

- Risk trước/sau hoặc mức thay đổi risk.
- Tác động tới workload, skill coverage, delivery hoặc nguồn lực.
- Yếu tố nào thay đổi và cách giải thích thay đổi.
- Mốc so sánh, scale, threshold và semantic color.

| Claim về impact | Requirement source | Status |
| --- | --- | --- |
| PM xem tác động dự kiến của đúng phương án đã mô phỏng | US-03; AC-US-03-01 | Confirmed |
| Impact bao gồm risk | User Stories — TBD-05 | TBD |
| Impact bao gồm workload | User Stories — TBD-05 | TBD |
| Impact bao gồm skill coverage | User Stories — TBD-05 | TBD |
| Impact bao gồm delivery | User Stories — TBD-05 | TBD |
| Impact phải dùng bố cục Before/After | User Stories — TBD-05 | TBD |

Bố cục hai cột trong wireframe là **Optional**. Đây không phải định dạng comparison đã được requirement xác nhận.

## 7. Decision — Accept / Reject

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

| Claim | Requirement source | Kết luận audit | Status |
| --- | --- | --- | --- |
| PM có hành động chấp nhận | PRD — Phạm vi MVP; US-04 | PM có thể chấp nhận phương án đang xem xét | Confirmed |
| Effect của chấp nhận lên phân bổ thật | AC-US-04-01 | Nếu việc áp dụng được phép và thành công, thay đổi thật phải tương ứng đúng phương án PM đã chấp nhận | Confirmed |
| Điều kiện và thời điểm áp dụng | User Stories — TBD-06; AC-US-04-01 | Chưa xác định điều kiện đủ, thời điểm áp dụng hoặc yêu cầu mô phỏng hợp lệ | TBD |
| Hành vi khi áp dụng thất bại | AC-US-04-06, AC-US-04-07; User Stories — TBD-07 | Không được báo áp dụng thành công; trạng thái phân bổ, phục hồi và thử lại chưa được chốt | Confirmed / TBD |
| PM có hành động từ chối | PRD — Phạm vi MVP; US-04; AC-US-04-02 | PM có thể từ chối phương án | Confirmed |
| Effect của từ chối | AC-US-04-02 | Phương án bị từ chối không được áp dụng vào phân bổ thật | Confirmed |
| Hành vi sau từ chối | User Stories — TBD-09 | Lưu quyết định, quay lại đề xuất, chọn candidate khác hoặc reset mô phỏng chưa được chốt | TBD |
| Lý do từ chối bắt buộc | AC-US-04-02 | Requirement không bắt buộc PM cung cấp lý do | Confirmed |
| Thu thập lý do từ chối tùy chọn | Không có requirement xác nhận | Có thêm UX này hay không chưa được chốt | Optional / TBD |
| Không đưa ra quyết định | AC-US-04-03 | Không được suy diễn thành chấp nhận; phương án không được áp dụng | Confirmed |
| Lưu, hủy hoặc hết hạn khi không quyết định | User Stories — TBD-09 | Chưa được chốt | TBD |

Nhãn nút chỉ thể hiện quyết định của PM. Wireframe không khẳng định rằng nhấn **Chấp nhận phương án** đồng nghĩa thay đổi đã được áp dụng ngay hoặc chắc chắn thành công.

## 8. Unavailable State

### Không tạo được đề xuất — TBD

```text
+----------------------------------------------------------------------------+
| CHƯA THỂ ĐƯA RA ĐỀ XUẤT                                                   |
| Hiện chưa đủ căn cứ để trình bày một kết quả đáng tin cậy.                 |
| Lý do cụ thể, dữ liệu còn thiếu và hành động tiếp theo: [Chưa xác định]    |
+----------------------------------------------------------------------------+
```

Wording trên là **Mock/TBD**. Không mặc định thiếu availability nghĩa là có thể phân bổ hoặc thiếu workload nghĩa là đang rảnh. Trạng thái này phải được phân biệt với trạng thái **không có ứng viên phù hợp** đã được xác nhận.

### Không mô phỏng hoặc tính được tác động — TBD

```text
+----------------------------------------------------------------------------+
| CHƯA THỂ MÔ PHỎNG PHƯƠNG ÁN                                               |
| Không hiển thị tác động giả định như một kết quả đáng tin cậy.             |
| Thử lại, đổi phương án hoặc tiếp tục tới quyết định: [Chưa xác định]       |
| Phân bổ thật không thay đổi.                                               |
+----------------------------------------------------------------------------+
```

Nếu việc áp dụng sau chấp nhận thất bại, hệ thống không được báo đã áp dụng thành công (**Confirmed**, AC-US-04-07). Trạng thái phân bổ, cách phục hồi và thử lại vẫn **TBD**.

## 9. Handoff / Back Navigation

| Chuyển tiếp | Context tối thiểu | Behavior | Requirement source | Status |
| --- | --- | --- | --- | --- |
| Risk Detail -> Đề xuất nhân sự | Dự án hiện đang được PM xem xét | Mở view đề xuất cho cùng dự án; không định nghĩa payload hoặc API | US-02; AC-US-02-01 | Confirmed |
| Đề xuất nhân sự -> Risk Detail | Dự án hiện tại | Quay lại để xem risk và yếu tố giải thích; không thay đổi phân bổ | Không có requirement bắt buộc | Optional |
| Đề xuất nhân sự -> Mô phỏng | Dự án và phương án đang xem xét | What-if là bước tiếp theo đã xác nhận; cách candidate trở thành phương án còn TBD | US-03; TBD-04 | Confirmed / TBD |
| Mô phỏng -> Đề xuất nhân sự | Dự án hiện tại | Quay lại/đổi phương án là UX hợp lý, nhưng xử lý kết quả mô phỏng cũ chưa được chốt | TBD-08 | Optional / TBD |
| Sau quyết định | Phương án và quyết định của PM | Trạng thái tiếp theo, persistence và thông báo kết quả chưa được chốt | TBD-07 đến TBD-09 | TBD |

Thiết kế không yêu cầu router. Hai view có thể là các trạng thái liên tiếp trong app shell hiện tại; lựa chọn kỹ thuật thuộc lượt implementation sau.

## 10. TBD / Open Questions

### Recommendation

- Trường nhận diện ứng viên tối thiểu và các field được phép hiển thị.
- Số lượng ứng viên, quy tắc xếp hạng, đồng hạng và thứ tự ổn định.
- Có sử dụng matching score hay không; nếu có, scale, ngưỡng và cách giải thích.
- Cách biểu diễn kỹ năng, mức độ sẵn sàng và khối lượng công việc.
- Nội dung/độ chi tiết của explanation và quan hệ giữa explanation với ranking.
- Tiêu chí ứng viên phù hợp/loại trừ và hành động khi không có kết quả.
- Cách phân biệt dữ liệu thiếu, lỗi tạo đề xuất và kết quả rỗng.

### What-if Simulation

- Nội dung chính xác của một phương án thay đổi phân bổ.
- Candidate được chọn có phải là phương án hoàn chỉnh hay chỉ là đầu vào để tạo phương án.
- Input PM được phép thay đổi và các ràng buộc phân bổ.
- Số phương án có thể thử; có hỗ trợ chạy lặp, đổi phương án hoặc reset không.
- Hành vi khi phương án vi phạm ràng buộc hoặc mô phỏng thất bại.
- Xử lý kết quả khi phương án hoặc dữ liệu thật thay đổi sau mô phỏng.

### Impact

- Chỉ báo tác động, mốc so sánh và cách biểu diễn trước/sau.
- Risk, workload, skill coverage, delivery hoặc resource impact nào thực sự cần cho MVP.
- Phạm vi ảnh hưởng tới dự án khác và cách giải thích yếu tố thay đổi.

### Decision

- Điều kiện đủ và thời điểm áp dụng sau khi PM chấp nhận.
- Có bắt buộc kết quả mô phỏng hợp lệ trước khi chấp nhận hay không.
- Trạng thái tiếp theo sau chấp nhận/từ chối; persistence, lịch sử hoặc hết hạn.
- Có thu thập lý do từ chối như UX tùy chọn hay không.
- Xử lý quyết định lặp, dữ liệu lỗi thời, áp dụng thất bại hoặc áp dụng không đầy đủ.

## 11. Full MVP Story Check

| Demo step | Artifact support | Remaining gap |
| --- | --- | --- |
| PM chọn dự án | Đã có trong `pm-risk-ui-design.md` và Basic Risk UI | Project visibility rule vẫn TBD |
| PM thấy rủi ro và hiểu yếu tố giải thích | Đã có trong Risk Overview/Detail | Risk representation và factor contribution vẫn TBD |
| PM yêu cầu đề xuất nhân sự | Handoff hiện có nối vào view đề xuất | Điều kiện cho phép yêu cầu vẫn TBD |
| PM xem đề xuất | Wireframe có danh sách thứ hạng, giải thích và trạng thái rỗng | Candidate fields, count, score và ranking rule vẫn TBD |
| PM thử phương án | Wireframe xác định phương án và hành động mô phỏng | Cách candidate trở thành phương án và simulation input vẫn TBD |
| PM xem tác động | Wireframe giữ comparison trung lập, không dùng số giả | Impact indicators và before/after representation vẫn TBD |
| PM đưa ra quyết định | Wireframe có chấp nhận/từ chối và guardrail không tự áp dụng | Điều kiện/thời điểm áp dụng và behavior sau quyết định vẫn TBD |

Full MVP UI story đã được nối ở mức flow và low-fidelity design:

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

Các gap còn lại là quyết định requirement được ghi rõ ở mục TBD, không phải business rule được artifact tự bổ sung.
