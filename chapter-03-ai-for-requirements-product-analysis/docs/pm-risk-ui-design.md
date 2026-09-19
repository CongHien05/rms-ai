# PM Risk UI Design — MVP

## 1. Scope

Tài liệu này mô tả thiết kế giao diện mức độ trung thực thấp cho phần đầu của luồng MVP: PM chọn dự án, xem ước lượng rủi ro và các yếu tố giải thích chính, sau đó cân nhắc chuyển sang đề xuất nhân sự.

Phạm vi của Hiền gồm PM User Flow, Project Risk Overview và Project Risk Detail. Điểm kết thúc là hành động **Yêu cầu đề xuất nhân sự (Request Resource Recommendation)**. Kết quả đề xuất nhân sự, mô phỏng giả định và quyết định chấp nhận/từ chối thuộc phạm vi tiếp nối của Khánh.

Đây là artifact yêu cầu và wireframe low-fidelity, không phải đặc tả production UI. Tài liệu không xác nhận AI hoặc chức năng nghiệp vụ đã được triển khai, không định nghĩa API, cơ sở dữ liệu, mô hình AI hay quy tắc phân quyền.

Quy ước:

- **Confirmed:** có căn cứ trực tiếp từ PRD, User Stories hoặc Acceptance Criteria.
- **TBD:** đã nhận diện nhưng chưa được requirement quyết định.
- **Mock:** dữ liệu hoặc nhãn minh họa vị trí UI, không phải business rule.
- **Optional:** tiện ích giao diện đề xuất, không phải requirement bắt buộc.

## 2. Requirement Traceability

| Requirement | Source | UI implication | Status |
| --- | --- | --- | --- |
| PM là người dùng chính của MVP | PRD — Người dùng mục tiêu; User Stories — Người dùng chính | Flow và nội dung được tổ chức quanh việc PM xem xét rủi ro | Confirmed |
| PM xem ước lượng rủi ro bàn giao của dự án | PRD — Phạm vi MVP; US-01; AC-US-01-01 | Overview và Detail dành vị trí cho risk assessment; cách biểu diễn chưa được chốt | Confirmed |
| PM xem các yếu tố chính giải thích kết quả | PRD — Phạm vi MVP; US-01; AC-US-01-01 | Detail có khu vực “Các yếu tố giải thích chính” | Confirmed |
| Thông tin rủi ro giúp PM cân nhắc can thiệp nguồn lực | US-01 | Detail dẫn tới quyết định có tiếp tục sang đề xuất nhân sự hay không | Confirmed |
| Kết quả thiếu căn cứ không được trình bày như kết quả chính xác | AC-US-01-02; AC-US-01-04 | Overview và Detail có trạng thái không thể đánh giá; không thay bằng mức rủi ro thấp | Confirmed |
| AI hỗ trợ, PM giữ quyền quyết định cuối cùng | PRD — Tổng quan sản phẩm; User Stories — Người dùng chính | UI không tự quyết định hoặc tự thay đổi phân bổ | Confirmed |
| PM có thể yêu cầu đề xuất nhân sự cho dự án | PRD — Phạm vi MVP; US-02; AC-US-02-01 | Detail kết thúc tại hành động yêu cầu đề xuất nhân sự | Confirmed |

## 3. PM User Flow

```text
Entry
  -> Project Risk Overview
  -> Select Project
  -> Project Risk Detail
  -> Review Risk Assessment
  -> Review Key Explanatory Factors
  -> Decide Whether to Continue
  -> Request Resource Recommendation
  -> Handoff to Khánh's scope
```

| Bước | PM nhìn thấy | PM thực hiện | Hệ thống phản hồi | Bước tiếp theo |
| --- | --- | --- | --- | --- |
| 1. Entry | Khu vực Project Risk và tập dự án được cung cấp; phạm vi project là TBD | Mở khu vực Project Risk | Hiển thị Overview hoặc trạng thái chưa thể đánh giá | Xem Overview |
| 2. Overview | Project context và risk assessment của từng dự án; cách biểu diễn risk là TBD | Quét danh sách và chọn dự án cần điều tra | Ghi nhận project được chọn | Mở Detail |
| 3. Detail | Project context, risk assessment và các yếu tố giải thích chính | Xem và hiểu kết quả ở mức sản phẩm | Giữ nguyên dữ liệu phân bổ, không tự quyết định thay PM | Cân nhắc tiếp tục |
| 4. Handoff | Hành động yêu cầu đề xuất nhân sự cho project hiện tại | Chọn **Yêu cầu đề xuất nhân sự** | Chuyển tiếp project đang được xem xét; không định nghĩa data contract | Phạm vi của Khánh |

## 4. Project Risk Overview

Màn hình giúp PM nhận biết khu vực Project Risk, xem tập project được cung cấp, nhận biết assessment của từng project và mở trang chi tiết. Quy tắc xác định project nào PM được nhìn thấy là **TBD**.

### Wireframe

```text
+--------------------------------------------------------------------------------+
| PROJECT RISK OVERVIEW                                                          |
| Projects in scope: [TBD — project visibility rule]                             |
+----------------------+--------------------------+---------------------+---------+
| Project              | Risk assessment          | Explanation summary | Action  |
+----------------------+--------------------------+---------------------+---------+
| Project A [Mock]     | [TBD representation]     | [Optional / Mock]   | Detail  |
| Project B [Mock]     | Assessment unavailable   | Insufficient        | Detail  |
|                      | [TBD wording]            | evidence [TBD]      |         |
+----------------------+--------------------------+---------------------+---------+
| [Optional: Search]  [Optional: Filter]  [Optional: Sort]                       |
+--------------------------------------------------------------------------------+
```

| Thành phần | Mục đích | Thông tin / hành động | Trạng thái |
| --- | --- | --- | --- |
| Tiêu đề và ngữ cảnh | Cho PM biết đang ở khu vực Project Risk | Tên màn hình | Confirmed |
| Tập project | Cho PM thấy các dự án được cung cấp để xem xét | Project identifier/name; trường cụ thể và visibility rule là TBD | Confirmed / TBD |
| Risk assessment | Cho phép PM quét assessment giữa các project | Giá trị trình bày là `[TBD representation]`; không dùng ngưỡng, phần trăm hoặc màu đã ngầm chốt | Confirmed / TBD |
| Explanation summary | Cung cấp ngữ cảnh ngắn trước khi mở Detail | Nội dung, số lượng và thứ tự là TBD | Optional |
| Detail action | Mở đúng project để xem giải thích | PM chọn `Detail` | Confirmed |
| Unavailable state | Tránh trình bày kết quả thiếu căn cứ như chính xác | Hiển thị assessment không khả dụng; wording và hành động tiếp theo là TBD | Confirmed / TBD |
| Search/filter/sort | Hỗ trợ quét khi danh sách lớn | Không có quy tắc lọc hoặc xếp hạng được chốt | Optional |

Overview không hiển thị ứng viên, matching score, mô phỏng hoặc hành động chấp nhận/từ chối.

## 5. Project Risk Detail

Màn hình hiển thị một project đã được chọn, ước lượng rủi ro và các yếu tố chính giải thích kết quả ở mức khái quát.

### Wireframe — có kết quả đánh giá

```text
+--------------------------------------------------------------------------+
| < Back to Project Risk Overview                                          |
| Project A [Mock]                                                         |
+--------------------------------------------------------------------------+
| RISK ASSESSMENT                                                         |
| [TBD — representation, scale, threshold and level mapping]               |
+--------------------------------------------------------------------------+
| KEY EXPLANATORY FACTORS                                                  |
| - Risk factor A [Mock]                                                   |
| - Risk factor B [Mock]                                                   |
| - Risk factor C [Mock]                                                   |
|                                                                          |
| Factor definitions, order, contribution and causality: [TBD]             |
+--------------------------------------------------------------------------+
| [Request Resource Recommendation]                                        |
| Handoff only — recommendation results are outside this artifact          |
+--------------------------------------------------------------------------+
```

| Thành phần | Mục đích | Trạng thái |
| --- | --- | --- |
| Project context | Xác nhận PM đang xem đúng project | Confirmed; trường hiển thị cụ thể là TBD |
| Risk assessment | Thể hiện ước lượng nguy cơ không đáp ứng kế hoạch/thời hạn bàn giao | Confirmed; cách biểu diễn là TBD |
| Các yếu tố giải thích chính | Giúp PM hiểu kết quả ở mức khái quát, không khẳng định quan hệ nhân quả | Confirmed; factor cụ thể và contribution là TBD |
| Back to Overview | Cho phép PM quay lại tập project | Optional |
| Request Resource Recommendation | Handoff sang bước tiếp theo của MVP | Confirmed; điều kiện khả dụng là TBD |

Phần giải thích không mô tả feature importance algorithm, SHAP, model internals, contribution formula hoặc trọng số. Các factor trong wireframe chỉ là **Mock**.

## 6. Empty / Invalid / Insufficient-data State

### Wireframe

```text
+--------------------------------------------------------------------------+
| Project A [Mock]                                                         |
+--------------------------------------------------------------------------+
| RISK ASSESSMENT UNAVAILABLE                                              |
| Insufficient evidence to present a reliable result [TBD wording]         |
|                                                                          |
| Required data, specific reason and freshness status: [TBD]               |
| Retry or continuation behavior: [TBD]                                    |
+--------------------------------------------------------------------------+
| Request Resource Recommendation availability: [TBD]                      |
+--------------------------------------------------------------------------+
```

Trạng thái này chỉ xác nhận rằng hệ thống không được hiển thị kết quả thiếu căn cứ như một kết quả chính xác. Minimum data, lý do cụ thể, cách xử lý dữ liệu lỗi thời, hành vi thử lại và backend behavior đều là **TBD**. Thiếu dữ liệu không được ngầm hiểu là rủi ro thấp.

## 7. Handoff Sang Resource Recommendation

Điểm kết thúc phần Hiền là hành động **Yêu cầu đề xuất nhân sự (Request Resource Recommendation)** trên Project Risk Detail.

Context tối thiểu ở góc nhìn flow là **project hiện đang được PM xem xét**. Tài liệu không định nghĩa JSON payload, API parameter, data contract hoặc điều kiện kỹ thuật chuyển màn hình.

Phần tiếp theo — Resource Recommendation, What-if Simulation, xem tác động và Accept/Reject — thuộc scope của Khánh.

## 8. TBD / Open Questions

- Cách biểu diễn risk assessment và định nghĩa risk score, nếu sử dụng score.
- Scale, threshold và cách ánh xạ Low / Medium / High, nếu sử dụng risk level.
- Quy tắc sắp xếp hoặc xếp hạng project theo risk.
- Định nghĩa các risk factor, số lượng, thứ tự và cách trình bày.
- Factor contribution, trọng số và việc factor có mang ý nghĩa nhân quả hay không.
- Độ mới của kết quả và cách xử lý stale result.
- Minimum data, điều kiện dữ liệu hợp lệ và hành vi khi không đủ căn cứ.
- Quy tắc xác định project nào PM được nhìn thấy.
- Điều kiện để PM được yêu cầu đề xuất nhân sự từ Risk Detail.
- Model input/output, API contract và database schema; các nội dung này không được thiết kế trong artifact hiện tại.

## 9. MVP Demo Story Consistency Check

Artifact hiện tại hỗ trợ phần đầu của demo story:

```text
PM chọn dự án
-> thấy risk assessment
-> hiểu các yếu tố giải thích chính
-> cân nhắc có cần can thiệp nguồn lực
-> yêu cầu đề xuất nhân sự
```

Continuation point, không thuộc phần triển khai của artifact này:

```text
Resource Recommendation
-> What-if Simulation
-> Impact
-> Accept / Reject
```
