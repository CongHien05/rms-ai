# Feature Specification: Mô phỏng phân bổ nguồn lực What-if

**Feature Branch** `codex/001-what-if-simulation`

**Created** 2026-11-25

**Status** Draft

**Baseline** `main` tại `e45d4c6c5532dc578787f40127be21f0351de512`

**Input** Nối kết quả đề xuất nhân sự hiện có của dự án với mô phỏng What-if
cho một phương án hỗ trợ giả định. Phạm vi **PROPOSED DEMO** theo quyết định
TBD-01/03/04/05/07/08 đã được duyệt.

## User Scenarios & Testing *(mandatory)*

### Hiện trạng và mục tiêu

Từ chi tiết dự án, PM đã có thể xem ứng viên được xếp hạng theo kỹ năng, tuần
và số giờ cần. Giờ hỗ trợ gợi ý giới hạn bởi số giờ cần và giờ trống khai
báo cho tuần đó. Màn What-if hiện lấy một ứng viên mock và hiển thị nội dung
minh họa khi PM bấm chạy. Bằng chứng hiện trạng từ mã nguồn nằm ở
[màn đề xuất](../../frontend/src/projects/ProjectResourceRecommendations.tsx),
[quy tắc đề xuất](../../backend/src/projects/project-resource-recommendation.service.ts)
và [màn What-if hiện tại](../../frontend/src/resource-recommendation/WhatIfSimulationView.tsx).

Trong lát cắt này, PM chọn ứng viên thật từ kết quả đề xuất của đúng dự án,
xác nhận một phương án và xem ba chỉ báo tính bằng giờ cho tuần đã chọn.
Kết quả What-if trong luồng đó được tính ở phía máy chủ từ dữ liệu nguồn lực
đọc lại. Phạm vi kết thúc ở việc xem tác động giả định.

### User Story 1 — Xem tác động của phương án đã xác nhận (P1)

PM muốn biết ứng viên đã chọn có thể bù bao nhiêu giờ thiếu trong tuần và
còn bao nhiêu giờ trống giả định nếu hỗ trợ dự án theo phương án đang xem.
Đây là giá trị chính của lát cắt.

**Kiểm thử độc lập** Dùng một dự án và một kết quả đề xuất có ứng viên. Chạy
hai phương án với dữ liệu giờ trống đã biết để kiểm tra hỗ trợ đủ và hỗ trợ
một phần. Đối chiếu dữ liệu nguồn lực trước và sau mỗi lần chạy.

| Mã | Given | When | Then |
| --- | --- | --- | --- |
| AT-01 | Dự án cần 8 giờ. Ứng viên trong kết quả đúng dự án, kỹ năng và tuần có 12,5 giờ trống. | PM chọn ứng viên, xem số giờ gợi ý 8 và xác nhận chạy phương án 8 giờ. | Kết quả gắn với đúng phương án và tuần. Hỗ trợ giả định là 8 giờ, còn thiếu 0 giờ và còn trống giả định 4,5 giờ. Dữ liệu nguồn lực giữ nguyên. |
| AT-02 | Dự án cần 8 giờ và ứng viên có 4 giờ trống ở tuần đã chọn. | PM xác nhận phương án hỗ trợ 4 giờ. | Phương án được mô phỏng thành công. PM thấy 4 giờ hỗ trợ giả định, 4 giờ còn thiếu và 0 giờ trống giả định còn lại. Dữ liệu nguồn lực giữ nguyên. |

### User Story 2 — Xử lý phương án không chạy được (P2)

PM muốn biết vì sao chưa có kết quả để sửa được đầu vào hoặc thử lại khi
nguồn dữ liệu phục hồi. Các trạng thái cần phân biệt để PM có thể chọn bước
xử lý phù hợp.

**Kiểm thử độc lập** Tạo lần lượt kết quả đề xuất rỗng, phương án sai dữ
liệu, giờ trống chưa khai báo và lỗi hệ thống. Quan sát từng trạng thái và
xác nhận đầu vào vẫn còn sau lỗi.

| Mã | Given | When | Then |
| --- | --- | --- | --- |
| AT-03 | Đề xuất hoàn tất với danh sách rỗng, không khả dụng vì thiếu dữ liệu, hoặc thất bại. | PM xem kết quả đề xuất. | Ba trạng thái được phân biệt. PM chỉ có thể chọn ứng viên từ kết quả thành công có ứng viên của đúng dự án và tuần. |
| AT-04 | PM có một phương án từ ứng viên đã chọn. | PM xác nhận khi bỏ trống số giờ hỗ trợ, nhập 0, số âm, số không hữu hạn hoặc số vượt giờ trống đọc lại, hoặc gửi ngữ cảnh sai dự án, nhân sự, kỹ năng hay tuần. | Hệ thống báo phương án không hợp lệ, giữ đầu vào để PM sửa, và không tạo kết quả tác động hoặc thay đổi dữ liệu nguồn lực. |
| AT-05 | Ứng viên từng có giờ trống, nhưng nguồn hiện tại thiếu giá trị cho tuần đang xét. | PM xác nhận mô phỏng hoặc thử lại. | Hệ thống báo thiếu dữ liệu, giữ đầu vào và không tạo kết quả tác động. Ca này được phân biệt với nguồn khai báo 0 giờ, danh sách đề xuất rỗng và lỗi hệ thống. |
| AT-06 | Sau khi PM xác nhận phương án hợp lệ, lần chạy gặp lỗi hệ thống. | PM xem trạng thái lỗi rồi thử lại thủ công khi nguồn hoạt động trở lại. | PM thấy lỗi hệ thống, giữ được đầu vào và có thể thử lại. Lần thử lại đọc dữ liệu nguồn lần nữa. Kết quả mới chỉ xuất hiện khi chạy thành công. Dữ liệu nguồn lực giữ nguyên. |

### User Story 3 — Giữ kết quả đúng với đầu vào đang xem (P3)

PM muốn biết kết quả thuộc lần chạy nào khi sửa phương án hoặc khi các lần
chạy trả về không đúng thứ tự. Điều này tránh việc xem tác động cũ như tác
động của phương án đang cân nhắc.

**Kiểm thử độc lập** Thay đổi đầu vào sau khi có kết quả, làm nguồn giờ trống
thay đổi giữa đề xuất và mô phỏng, rồi cho các lần chạy hoàn tất ngược thứ tự.

| Mã | Given | When | Then |
| --- | --- | --- | --- |
| AT-07 | Danh sách đề xuất từng cho thấy ứng viên có 8 giờ trống, nhưng nguồn đã đổi còn 4 giờ. | PM chạy phương án 6 giờ dựa trên thông tin đã xem. | Hệ thống đối chiếu với 4 giờ hiện có và báo vượt giới hạn. Khi PM xác nhận chạy lại với 4 giờ, kết quả dùng số giờ trống mới. Giờ trống do giao diện cung cấp không thay thế dữ liệu nguồn. |
| AT-08 | PM đã có kết quả hoặc một lần chạy đang chờ cho phương án A. | PM đổi ứng viên, dự án, tuần, kỹ năng, số giờ cần hoặc số giờ giả định. | Trạng thái đang xem chuyển sang đầu vào mới. Kết quả hay lỗi đến sau của A chỉ thuộc A và không xuất hiện như trạng thái của phương án mới. Đầu vào mới phải được xác nhận để có kết quả mới. |
| AT-09 | Lần chạy A còn chờ và PM đã xác nhận lần chạy B cho phương án đang xem. | B trả trước, sau đó A trả thành công hoặc trả lỗi. | Kết quả hoặc trạng thái lỗi của B giữ nguyên. Phản hồi muộn của A không thay thế trạng thái đang xem. |

### Edge Cases

- Số giờ giả định bằng đúng giờ trống vẫn hợp lệ. Khi nguồn ghi 0 giờ,
  mọi phương án có số giờ dương đều vượt giới hạn.
- Giờ trống chỉ có ở tuần khác được coi là thiếu dữ liệu cho tuần đang xét.
  Trường hợp nguồn ghi 0 giờ đúng tuần là giá trị đã biết.
- Nếu sự thay đổi của nguồn vẫn để phương án trong giới hạn, kết quả dùng
  giờ trống vừa đọc. Nếu giờ trống giảm xuống dưới số giờ giả định, áp dụng
  ca phương án không hợp lệ ở AT-07.
- Nếu giờ giả định bằng hoặc vượt giờ cần và vẫn trong giới hạn giờ trống,
  số giờ cần còn thiếu là 0. Việc này chỉ mô tả cách tính phần thiếu.

## Requirements *(mandatory)*

### Functional Requirements

| Mã | Yêu cầu | Kịch bản | Truy vết nguồn |
| --- | --- | --- | --- |
| FR-001 | Giữ quy tắc lọc, thứ hạng và giải thích của đề xuất hiện có. PM chỉ chọn được ứng viên từ kết quả đề xuất thành công của đúng dự án, kỹ năng và tuần. | AT-01, AT-03, AT-04 | US-02 · AC-US-02-01/03/04/05 · TBD-03 |
| FR-002 | Hình thành phương án giả định riêng cho một nhân sự, một dự án, một tuần và số giờ hỗ trợ giả định. Giữ ngữ cảnh kỹ năng và số giờ cần từ đề xuất. Điền sẵn số giờ hỗ trợ gợi ý và chỉ chạy sau khi PM xác nhận đầu vào. | AT-01, AT-02, AT-08 | US-02/03 · AC-US-03-01 · TBD-04 |
| FR-003 | Mỗi lần chạy hoặc thử lại, hệ thống phải xác minh ở phía máy chủ dự án, nhân sự, kỹ năng và tuần trong ngữ cảnh đề xuất. Hệ thống đọc lại số giờ trống đúng tuần từ nguồn hiện có và dùng giá trị đó để kiểm tra, tính toán. | AT-04, AT-05, AT-06, AT-07 | US-02/03 · AC-US-02-04, AC-US-03-01/03 · TBD-01/03/08 |
| FR-004 | Chỉ mô phỏng số giờ hỗ trợ giả định hữu hạn, lớn hơn 0 và không vượt giờ trống đã xác minh cho tuần đó. Phương án hợp lệ có thể đáp ứng một phần nhu cầu. | AT-01, AT-02, AT-04, AT-07 | US-03 · AC-US-03-01/03 · TBD-04 |
| FR-005 | Kết quả thành công chỉ hiển thị ba chỉ báo theo giờ cho tuần đã chọn. Giờ hỗ trợ giả định là số giờ đã xác nhận. Giờ cần còn thiếu là phần dương còn lại sau khi trừ giờ hỗ trợ khỏi giờ cần. Giờ trống giả định còn lại là giờ trống đọc lại trừ giờ hỗ trợ. | AT-01, AT-02, AT-07 | US-03 · AC-US-03-01 · TBD-05 |
| FR-006 | Hiển thị trạng thái riêng cho đề xuất rỗng, thiếu dữ liệu, phương án không hợp lệ và lỗi hệ thống. Giờ trống chưa khai báo hoặc thiếu ở tuần đang xét không được suy ra bằng 0. Ca thiếu dữ liệu, không hợp lệ hoặc lỗi không tạo kết quả tác động. | AT-03, AT-04, AT-05, AT-06 | US-02/03 · AC-US-02-03/04, AC-US-03-03/04 · TBD-01/03/07 |
| FR-007 | Giữ đầu vào khi mô phỏng thất bại để PM sửa hoặc thử lại thủ công khi phù hợp. Chỉ trình bày kết quả mới khi lần chạy tương ứng thành công. | AT-04, AT-05, AT-06 | US-03 · AC-US-03-04 · TBD-07 |
| FR-008 | Gắn kết quả với snapshot của đúng phương án và dữ liệu dùng để tính. Khi đầu vào đổi, kết quả cũ chỉ thuộc phương án cũ. Phản hồi đến muộn của lần chạy đã bị thay thế không được ghi đè kết quả, trạng thái chờ hoặc lỗi của phương án/lần chạy đang xem. | AT-07, AT-08, AT-09 | US-03 · AC-US-03-01/05 · TBD-08 |
| FR-009 | Việc chọn, xác nhận, chạy, xem kết quả và thử lại chỉ đọc dữ liệu nguồn lực hiện có trong mọi trường hợp. Trình bày kết quả là tác động dự kiến tính theo giờ trong **PROPOSED DEMO**. | AT-01, AT-02, AT-04, AT-05, AT-06, AT-07, AT-09 | US-02/03 · AC-US-02-02, AC-US-03-01/02 · TBD-05/07 |

### Key Entities

- **Kết quả đề xuất** chứa dự án, kỹ năng, tuần, số giờ cần và danh sách ứng
  viên đã xếp hạng cùng dữ liệu hỗ trợ gợi ý.
- **Phương án giả định** gồm nhân sự, dự án, kỹ năng, tuần, nhu cầu theo giờ
  và số giờ hỗ trợ PM đã xác nhận. Ứng viên là nguồn ngữ cảnh để hình thành
  phương án.
- **Snapshot mô phỏng** là bộ đầu vào đã xác nhận và dữ liệu nguồn thực tế
  được dùng cho một lần chạy, gồm số giờ trống đọc lại. Kết quả hoặc trạng
  thái của lần chạy chỉ áp dụng cho snapshot tương ứng trong phiên đang xem.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001** Trong cả hai ca hỗ trợ đủ và hỗ trợ một phần (AT-01/02), PM hoàn
  thành luồng chọn → xác nhận → xem kết quả. Cả ba chỉ báo khớp giá trị kỳ vọng
  và thuộc đúng người, dự án, tuần đã xác nhận.
- **SC-002** Toàn bộ ca đề xuất rỗng, thiếu dữ liệu, phương án không hợp lệ và
  lỗi hệ thống (AT-03–06) hiện đúng trạng thái. Có 0 kết quả tác động giả
  cho ca thất bại. PM giữ được đầu vào khi lỗi và thử lại được trong AT-06.
- **SC-003** Trong toàn bộ ca giờ trống thay đổi, đầu vào thay đổi và phản hồi
  đến sai thứ tự (AT-07–09), có 0 kết quả hoặc lỗi cũ bị hiển thị như trạng
  thái của lần chạy hiện hành. Ca AT-07 dùng giờ trống ở thời điểm chạy lại.
- **SC-004** Trong các ca kiểm thử có thể đối chiếu trước và sau, số thay đổi
  đối với bản ghi nguồn lực hiện có do thao tác đề xuất hoặc mô phỏng là 0.
  Kiểm tra cả ca thành công, đầu vào không hợp lệ, thiếu dữ liệu, lỗi và thử lại.

## Assumptions

- Dùng Project, Employee, Skill và giờ trống khai báo theo tuần hiện có.
  Dữ liệu kiểm thử có thể dùng môi trường dev. Giờ trống là giá trị khai báo
  dùng cho demo, còn workload và phân bổ thực tế liên dự án nằm ngoài phép tính.
- Chọn và xác nhận phương án là hành động để chạy mô phỏng của PM. Luồng
  What-if ở milestone này kết thúc khi PM xem kết quả. Mốc kiểm chứng chỉ đọc
  áp dụng cho nguồn lực đang tồn tại. Nghiệm thu toàn bộ bất biến trên
  `ProjectAllocation` cần một mô hình phân bổ vận hành.
- Auth/RBAC, PM Decision Workflow, Apply Allocation, `ProjectAllocation`,
  lưu lịch sử, tối ưu nhiều nhân sự/dự án, dự báo giảm xác suất trễ hạn,
  suy luận hoặc huấn luyện AI và mở rộng UI ngoài lát cắt What-if đều ngoài phạm vi.

### Nguồn và các quyết định áp dụng

- US-02, US-03 và quyết định PROPOSED DEMO đã duyệt ngày 2026-11-25 là căn cứ
  cho các quy tắc người dùng và dữ liệu trong spec.
  [User Stories và quyết định PR #22](../../chapter-03-ai-for-requirements-product-analysis/docs/user-stories.md#quyết-định-cho-what-if-đầu-tiên-2026-11-25)
- Bảng nghiệm thu demo bổ sung phạm vi kiểm chứng cụ thể. Các AC tổng quát
  và TBD ngoài demo tiếp tục có hiệu lực.
  [Acceptance Criteria](../../chapter-03-ai-for-requirements-product-analysis/docs/acceptance-criteria.md#kiểm-chứng-what-if-đầu-tiên--proposed-demo)
- Thiết kế UI và Initial API Contracts tài liệu hóa prototype cùng các TBD ở
  phạm vi toàn sản phẩm. Phần giờ, snapshot và lỗi trong spec theo quyết định
  demo mới hơn. Chi tiết contract và cách lưu hoặc truyền ngữ cảnh thuộc bước plan.
  [What-if Simulation UI Design](../../chapter-04-ai-for-product-design/docs/what-if-simulation-ui-design.md)
  · [Initial API Contracts](../../chapter-03-ai-for-requirements-product-analysis/docs/initial-api-contracts.md)
  · [Resource Allocation Constraints](../../chapter-03-ai-for-requirements-product-analysis/docs/resource-allocation-constraints.md)
  · [Spec Kit Adoption Audit](../../chapter-09-ai-technical-documentation/docs/spec-kit-adoption-audit.md)

Không có quyết định nghiệp vụ mở cần chốt thêm trong phạm vi Specify. Các
TBD của nghiệp vụ phân bổ hoàn chỉnh tiếp tục được quản lý tại tài liệu nguồn.
