# Human Review Decision Register — Chapter 4

## 1. Cách sử dụng

Đây là sổ quyết định tập trung cho các `GIAO DIỆN ĐỀ XUẤT` và `TBD` của
Chapter 4. Mỗi Review ID là ổn định và phải được dùng khi ghi nhận phản hồi,
cập nhật tài liệu hoặc sửa prototype.

Lựa chọn hợp lệ cho mọi mục:

- `Approve proposed UI` — chấp thuận lựa chọn trình bày; không biến nó thành
  business rule.
- `Reject proposed UI` — từ chối lựa chọn trình bày.
- `Request revision` — yêu cầu chỉnh sửa; Review Status tiếp tục là `Pending`.
- `Keep as TBD` — chủ động giữ nội dung chưa quyết định cho giai đoạn sau.

Đối với mục có Classification `TBD`, không dùng `Approve proposed UI` để tự tạo
quy tắc nghiệp vụ. Nếu nhóm chưa có căn cứ để quyết định, lựa chọn phù hợp là
`Keep as TBD`; nếu cần làm rõ trong Chapter 4, dùng `Request revision` và mô tả
thông tin còn thiếu.

## 2. Thông tin phiên review

| Trường | Giá trị |
| --- | --- |
| Branch / commit | `main` / `1fa4d47` |
| AI preparation date | 2026-10-25 |
| Decision recording date | 2026-10-25 |
| Reviewer identity | Chưa ghi nhận; không tạo tên hoặc chữ ký giả |
| Decision provenance | User-provided, AI-assisted delegated design review decisions |
| Verification evidence | Tách riêng theo từng ID; approval không đồng nghĩa QA hoặc production acceptance |
| Overall review status | 15 Approved; 5 Pending; 12 Keep as TBD; Chapter 4 chưa close-out |

## 3. Bảng tóm tắt quyết định

| Review ID | Màn hình / luồng | Quyết định cần đưa ra | Classification | Requested Decision | Decision provenance | Review Status |
| --- | --- | --- | --- | --- | --- | --- |
| C4-HDR-001 | PM — Tổng quan vận hành | Giữ cấu trúc Tổng quan PM | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | User-provided, AI-assisted delegated design review decisions | Approved |
| C4-HDR-002 | PM — Tổng quan vận hành | Không trình bày dự án nổi bật/hoạt động gần đây như dữ liệu thật; quy tắc và nguồn vẫn TBD | GIAO DIỆN ĐỀ XUẤT | Request revision | User-provided, AI-assisted delegated design review decisions | Pending — Awaiting re-review |
| C4-HDR-003 | PM — Dự án / Trung tâm rủi ro | Giữ hai bề mặt riêng biệt | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | User-provided, AI-assisted delegated design review decisions | Approved |
| C4-HDR-004 | PM — Chi tiết rủi ro | Giữ bố cục kết quả và yếu tố giải thích | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | User-provided, AI-assisted delegated design review decisions | Approved |
| C4-HDR-005 | PM — Rủi ro không khả dụng | Làm rõ trạng thái; không mặc định khóa hoặc cho phép CTA | GIAO DIỆN ĐỀ XUẤT | Request revision | User-provided, AI-assisted delegated design review decisions | Pending — Awaiting re-review |
| C4-HDR-006 | PM — Đề xuất nhân sự | Giữ danh sách thứ hạng/giải thích; không tạo công thức matching | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | User-provided, AI-assisted delegated design review decisions | Approved |
| C4-HDR-007 | PM — Không có ứng viên | Giữ trạng thái không có ứng viên phù hợp | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | User-provided, AI-assisted delegated design review decisions | Approved |
| C4-HDR-008 | PM — Đề xuất → Mô phỏng | Phân biệt ứng viên với phương án phân bổ hoàn chỉnh | GIAO DIỆN ĐỀ XUẤT | Request revision | User-provided, AI-assisted delegated design review decisions | Pending — Awaiting re-review |
| C4-HDR-009 | PM — What-if Simulation | Giữ thiết kế một màn hình mở dần | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | User-provided, AI-assisted delegated design review decisions | Approved |
| C4-HDR-010 | PM — Trạng thái mô phỏng | Phân biệt trạng thái prototype và kết quả thật; xác minh năm trạng thái | GIAO DIỆN ĐỀ XUẤT | Request revision | User-provided, AI-assisted delegated design review decisions | Pending — Awaiting re-review |
| C4-HDR-011 | PM — Tác động | Giữ so sánh hai cột; impact metric vẫn TBD | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | User-provided, AI-assisted delegated design review decisions | Approved |
| C4-HDR-012 | PM — Accept / Reject | Giữ hai quyết định; Accept không phải Applied Successfully | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | User-provided, AI-assisted delegated design review decisions | Approved |
| C4-HDR-013 | HR Workspace | Giữ Tổng quan nguồn lực / Nhân sự / Kỹ năng | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | User-provided, AI-assisted delegated design review decisions | Approved |
| C4-HDR-014 | HR Workspace | Thể hiện trung thực trạng thái chưa kết nối dữ liệu | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | User-provided, AI-assisted delegated design review decisions | Approved |
| C4-HDR-015 | DEV Workspace | DEV chỉ xem thông tin và ngữ cảnh của mình | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | User-provided, AI-assisted delegated design review decisions | Approved |
| C4-HDR-016 | DEV Workspace | Không tạo danh tính hoặc nhiệm vụ giả | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | User-provided, AI-assisted delegated design review decisions | Approved |
| C4-HDR-017 | Cross-role — Role Preview | Role Preview không phải Auth hoặc RBAC | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | User-provided, AI-assisted delegated design review decisions | Approved |
| C4-HDR-018 | Cross-role — App Shell | Giữ App Shell và điều hướng phân tách theo role | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | User-provided, AI-assisted delegated design review decisions | Approved |
| C4-HDR-019 | Cross-role — State reset | Reset trạng thái khi đổi role; verification tách riêng | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | User-provided, AI-assisted delegated design review decisions | Approved |
| C4-HDR-020 | Cross-role — Responsive/A11y | Chưa duyệt cho tới khi có visual/keyboard/accessibility evidence | GIAO DIỆN ĐỀ XUẤT | Pending | User-provided, AI-assisted delegated design review decisions | Pending |
| C4-HDR-021 | Toàn luồng — TBD-01 | Dữ liệu tối thiểu/hợp lệ chưa đủ căn cứ | TBD | Keep as TBD | User-provided, AI-assisted delegated design review decisions | Keep as TBD |
| C4-HDR-022 | PM Risk — TBD-02 | Điểm, mức và độ mới risk chưa xác nhận | TBD | Keep as TBD | User-provided, AI-assisted delegated design review decisions | Keep as TBD |
| C4-HDR-023 | Recommendation — TBD-03 | Tiêu chí và trọng số matching chưa chốt | TBD | Keep as TBD | User-provided, AI-assisted delegated design review decisions | Keep as TBD |
| C4-HDR-024 | Simulation — TBD-04 | Cấu trúc/ràng buộc phương án chưa chốt | TBD | Keep as TBD | User-provided, AI-assisted delegated design review decisions | Keep as TBD |
| C4-HDR-025 | Impact — TBD-05 | Impact metrics và baseline chưa chốt | TBD | Keep as TBD | User-provided, AI-assisted delegated design review decisions | Keep as TBD |
| C4-HDR-026 | PM Decision — TBD-06 | Điều kiện/thời điểm áp dụng sau Accept chưa chốt | TBD | Keep as TBD | User-provided, AI-assisted delegated design review decisions | Keep as TBD |
| C4-HDR-027 | Toàn luồng — TBD-07 | Retry, recovery và xử lý lỗi chưa chốt | TBD | Keep as TBD | User-provided, AI-assisted delegated design review decisions | Keep as TBD |
| C4-HDR-028 | Simulation/Decision — TBD-08 | Stale data và duplicate decision chưa chốt | TBD | Keep as TBD | User-provided, AI-assisted delegated design review decisions | Keep as TBD |
| C4-HDR-029 | PM Decision — TBD-09 | Vòng đời lưu/hủy/hết hạn chưa chốt | TBD | Keep as TBD | User-provided, AI-assisted delegated design review decisions | Keep as TBD |
| C4-HDR-030 | AI/Data — TBD-10 | Mô hình AI/ML và dữ liệu chưa chốt | TBD | Keep as TBD | User-provided, AI-assisted delegated design review decisions | Keep as TBD |
| C4-HDR-031 | Cross-role — TBD-11 | Identity, Auth, RBAC và liên kết Employee chưa chốt | TBD | Keep as TBD | User-provided, AI-assisted delegated design review decisions | Keep as TBD |
| C4-HDR-032 | DEV — TBD-12 | Write actions và simulation của DEV chưa xác nhận | TBD | Keep as TBD | User-provided, AI-assisted delegated design review decisions | Keep as TBD |

## 4. Chi tiết quyết định — PM: Tổng quan và Rủi ro

### C4-HDR-001 — Cấu trúc Tổng quan vận hành

- **Nội dung cần quyết định:** Có chấp thuận Tổng quan là điểm vào gồm dự án cần
  chú ý, hoạt động gần đây, dải Risk → Recommendation → Simulation → Decision
  và danh mục dự án hay không.
- **Classification:** GIAO DIỆN ĐỀ XUẤT.
- **Căn cứ PRD:** Tổng quan sản phẩm; Phạm vi MVP; PM là người dùng chính.
- **User Story / AC:** US-01 đến US-04; AC-US-01-01, AC-US-07-02.
- **Artifact liên quan:** `operations-overview-ui-design.md`;
  `frontend/src/operations-overview/OperationsOverview.tsx`.
- **Đề xuất AI:** Approve proposed UI vì bề mặt chỉ định hướng vào luồng đã xác
  nhận và không tạo hành vi production.
- **Ảnh hưởng:** Quyết định cấu trúc trang đầu PM; không xác nhận dashboard/KPI.
- **Requested Decision:** Approve proposed UI. **Review Status:** Approved.
- **Lý do:** Giữ cấu trúc Tổng quan PM.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Verification:** Approval thiết kế; visual QA được theo dõi riêng tại C4-HDR-020.

### C4-HDR-002 — Dự án cần chú ý và Hoạt động gần đây

- **Nội dung cần quyết định:** Có giữ hai vùng này với quy tắc ưu tiên và nguồn
  hoạt động được ghi TBD, hay bỏ/đổi cách trình bày.
- **Classification:** GIAO DIỆN ĐỀ XUẤT.
- **Căn cứ PRD:** Không có yêu cầu dashboard hoặc activity feed trực tiếp.
- **User Story / AC:** US-01; AC-US-01-02, AC-US-01-04 chỉ ràng buộc không trình
  bày thiếu căn cứ như rủi ro thấp.
- **Artifact liên quan:** `operations-overview-ui-design.md`;
  `OperationsOverview.tsx`; `mockProjectRisks.ts`.
- **Đề xuất AI:** Request revision sau visual review; nếu giữ, tiếp tục gắn nhãn
  minh họa/TBD và không suy ra logic ưu tiên.
- **Ảnh hưởng:** Tính dễ hiểu của trang đầu; không tạo quy tắc xếp hạng dự án.
- **Requested Decision:** Request revision. **Review Status:** Pending — Awaiting re-review.
- **Lý do:** Không trình bày dự án nổi bật hoặc hoạt động gần đây như dữ liệu
  vận hành thật. Giữ các quy tắc chọn dự án và nguồn sự kiện là TBD.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Revision evidence:** Microcopy trong `OperationsOverview.tsx` và
  `operations-overview-ui-design.md` đã được làm rõ; chưa tự phê duyệt lại.

### C4-HDR-003 — Danh sách Dự án và Trung tâm rủi ro

- **Nội dung cần quyết định:** Có giữ hai bề mặt danh sách tách biệt và hành
  động mở đúng dự án như prototype hay không.
- **Classification:** GIAO DIỆN ĐỀ XUẤT.
- **Căn cứ PRD:** PM xem/nghiên cứu dự án và đánh giá rủi ro.
- **User Story / AC:** US-01; AC-US-01-01, AC-US-01-04.
- **Artifact liên quan:** `ProjectsView.tsx`, `ProjectRiskOverview.tsx`,
  `pm-risk-ui-design.md`.
- **Đề xuất AI:** Approve proposed UI; tiếp tục để phạm vi/thứ tự dự án là TBD.
- **Ảnh hưởng:** IA của PM; không xác nhận CRUD Project.
- **Requested Decision:** Approve proposed UI. **Review Status:** Approved.
- **Lý do:** Giữ danh sách Dự án và Trung tâm rủi ro riêng biệt.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Verification:** Approval thiết kế; visual QA được theo dõi riêng.

### C4-HDR-004 — Bố cục Chi tiết rủi ro

- **Nội dung cần quyết định:** Có duyệt thứ tự ngữ cảnh dự án → đánh giá → yếu
  tố giải thích → bước đề xuất hay không.
- **Classification:** GIAO DIỆN ĐỀ XUẤT.
- **Căn cứ PRD:** Phạm vi MVP — Dự báo rủi ro và giải thích.
- **User Story / AC:** US-01, US-02; AC-US-01-01, AC-US-02-01.
- **Artifact liên quan:** `pm-risk-ui-design.md`; `ProjectRiskDetail.tsx`.
- **Đề xuất AI:** Approve proposed UI; không thêm điểm, ngưỡng hoặc quan hệ nhân quả.
- **Ảnh hưởng:** Trình tự đọc và bước chuyển sang Recommendation.
- **Requested Decision:** Approve proposed UI. **Review Status:** Approved.
- **Lý do:** Giữ bố cục kết quả rủi ro và các yếu tố giải thích.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Verification:** Approval thiết kế; không xác nhận risk score, ngưỡng hoặc production result.

### C4-HDR-005 — Rủi ro không khả dụng và CTA Recommendation

- **Nội dung cần quyết định:** Khi chưa đủ căn cứ đánh giá rủi ro, UI có tiếp
  tục hiển thị `Yêu cầu đề xuất nhân sự` hay cần ẩn/vô hiệu hóa/giải thích thêm.
- **Classification:** GIAO DIỆN ĐỀ XUẤT.
- **Căn cứ PRD:** Không có quy tắc chuyển bước khi thiếu đánh giá.
- **User Story / AC:** US-01, US-02; AC-US-01-02, AC-US-01-04; TBD-01, TBD-07.
- **Artifact liên quan:** `pm-risk-ui-design.md`; `ProjectRiskDetail.tsx`.
- **Đề xuất AI:** Request revision hoặc ghi quyết định rõ; không tự chọn hành vi
  chặn/cho phép khi requirement còn thiếu.
- **Ảnh hưởng:** Khả năng tiếp tục luồng PM khi dữ liệu không đủ.
- **Requested Decision:** Request revision. **Review Status:** Pending — Awaiting re-review.
- **Lý do:** Làm rõ trạng thái không thể đánh giá, không mặc định khóa hoặc cho
  phép CTA khi yêu cầu chưa xác nhận.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Revision evidence:** `ProjectRiskDetail.tsx` và `pm-risk-ui-design.md` ghi
  rõ CTA chỉ là điều hướng prototype; business eligibility tiếp tục TBD.

## 5. Chi tiết quyết định — PM: Recommendation, Simulation và Decision

### C4-HDR-006 — Danh sách ứng viên có thứ hạng

- **Nội dung cần quyết định:** Có duyệt danh sách đánh số thứ tự, giải thích cơ
  bản và ghi chú TBD thay vì điểm/phần trăm hay không.
- **Classification:** GIAO DIỆN ĐỀ XUẤT.
- **Căn cứ PRD:** Đề xuất nhân sự có thứ hạng và giải thích.
- **User Story / AC:** US-02; AC-US-02-01, AC-US-02-02.
- **Artifact liên quan:** `resource-recommendation-ui-design.md`;
  `ResourceRecommendationView.tsx`.
- **Đề xuất AI:** Approve proposed UI.
- **Ảnh hưởng:** Cách PM so sánh ứng viên; không xác nhận công thức xếp hạng.
- **Requested Decision:** Approve proposed UI. **Review Status:** Approved.
- **Lý do:** Danh sách có thứ hạng và giải thích; không tự tạo công thức matching.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Verification:** Approval thiết kế; dữ liệu hiển thị vẫn là minh họa.

### C4-HDR-007 — Không có ứng viên phù hợp

- **Nội dung cần quyết định:** Có duyệt trạng thái rỗng riêng, không đưa ứng viên
  không phù hợp vào danh sách, với bước tiếp theo vẫn TBD hay không.
- **Classification:** GIAO DIỆN ĐỀ XUẤT.
- **Căn cứ PRD:** Đề xuất nhân sự; constraint không tạo kết quả giả.
- **User Story / AC:** US-02; AC-US-02-03, AC-US-02-05.
- **Artifact liên quan:** `resource-recommendation-ui-design.md`;
  `ResourceRecommendationView.tsx`.
- **Đề xuất AI:** Approve proposed UI.
- **Ảnh hưởng:** Phân biệt empty result với lỗi/thiếu dữ liệu.
- **Requested Decision:** Approve proposed UI. **Review Status:** Approved.
- **Lý do:** Giữ trạng thái không có ứng viên phù hợp.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Verification:** Static verified; không xác nhận tiêu chí matching còn TBD.

### C4-HDR-008 — Ứng viên sang phương án mô phỏng

- **Nội dung cần quyết định:** Có giữ CTA `Thử phương án minh họa` trên từng ứng
  viên trong khi cấu trúc phương án chưa xác định hay không.
- **Classification:** GIAO DIỆN ĐỀ XUẤT.
- **Căn cứ PRD:** PM thử thay đổi phân bổ; ứng viên không được xác nhận là phương
  án hoàn chỉnh.
- **User Story / AC:** US-02, US-03; AC-US-03-01; TBD-04.
- **Artifact liên quan:** `ResourceRecommendationView.tsx`, `App.tsx`,
  `what-if-simulation-ui-design.md`.
- **Đề xuất AI:** Request revision khi có quyết định về cấu trúc phương án; hiện
  tại phải giữ từ “minh họa” và nhãn TBD.
- **Ảnh hưởng:** Ý nghĩa bước chuyển Recommendation → Simulation.
- **Requested Decision:** Request revision. **Review Status:** Pending — Awaiting re-review.
- **Lý do:** Phân biệt ứng viên với phương án phân bổ hoàn chỉnh.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Revision evidence:** Microcopy trong `ResourceRecommendationView.tsx`,
  `WhatIfSimulationView.tsx` và tài liệu Recommendation đã phân biệt candidate
  context với allocation scenario; cấu trúc phương án vẫn TBD.

### C4-HDR-009 — Màn hình mô phỏng mở dần

- **Nội dung cần quyết định:** Có duyệt một màn hình gồm scenario, run,
  impact và decision mở dần theo tiến trình hay không.
- **Classification:** GIAO DIỆN ĐỀ XUẤT.
- **Căn cứ PRD:** Mô phỏng trước quyết định; không yêu cầu route/modal riêng.
- **User Story / AC:** US-03, US-04; AC-US-03-01, AC-US-03-02.
- **Artifact liên quan:** `what-if-simulation-ui-design.md`;
  `WhatIfSimulationView.tsx`.
- **Đề xuất AI:** Approve proposed UI ở mức prototype.
- **Ảnh hưởng:** Số màn hình và cách giữ ngữ cảnh phương án.
- **Requested Decision:** Approve proposed UI. **Review Status:** Approved.
- **Lý do:** Giữ thiết kế một màn hình mô phỏng mở dần.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Verification:** Approval thiết kế; không xác nhận simulation engine.

### C4-HDR-010 — Trạng thái mô phỏng

- **Nội dung cần quyết định:** Duyệt cách biểu diễn ready/loading/success/
  missing/failure và xác định trạng thái nào cần xuất hiện trong prototype.
- **Classification:** GIAO DIỆN ĐỀ XUẤT.
- **Căn cứ PRD:** Mô phỏng không phá hủy dữ liệu; lỗi/retry chưa xác định.
- **User Story / AC:** US-03; AC-US-03-02 đến AC-US-03-04; TBD-07.
- **Artifact liên quan:** `what-if-simulation-ui-design.md`;
  `WhatIfSimulationView.tsx`.
- **Đề xuất AI:** Request revision; tài liệu xem xét đủ trạng thái nhưng prototype
  chỉ chuyển ngay từ not-run sang presented.
- **Ảnh hưởng:** Khả năng review trạng thái biên trong bản mẫu.
- **Requested Decision:** Request revision. **Review Status:** Pending — Awaiting re-review.
- **Lý do:** Phân biệt trạng thái mô phỏng minh họa và kết quả thật; xác minh
  ready/loading/success/missing/failure.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Revision evidence:** Prototype ghi rõ chỉ có chuyển trạng thái cục bộ sang
  placeholder kết quả; tài liệu ghi Ready có thể quan sát, Success chỉ là
  placeholder, còn Loading/Missing/Failure chưa có tương tác.

### C4-HDR-011 — Bố cục tác động hai cột

- **Nội dung cần quyết định:** Có duyệt so sánh `Đánh giá hiện tại` và `Đánh giá
  sau mô phỏng` bằng placeholder trung lập hay không.
- **Classification:** GIAO DIỆN ĐỀ XUẤT.
- **Căn cứ PRD:** PM xem tác động dự kiến của đúng phương án.
- **User Story / AC:** US-03; AC-US-03-01, AC-US-03-02; TBD-05.
- **Artifact liên quan:** `what-if-simulation-ui-design.md`;
  `WhatIfSimulationView.tsx`.
- **Đề xuất AI:** Approve proposed UI; không thêm số liệu giả.
- **Ảnh hưởng:** Cách so sánh tác động, không xác nhận metric/baseline.
- **Requested Decision:** Approve proposed UI. **Review Status:** Approved.
- **Lý do:** Giữ so sánh hai cột ở mức trình bày; chỉ số tác động vẫn TBD.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Verification:** Approval thiết kế; placeholder không phải impact result thật.

### C4-HDR-012 — Điều khiển Accept / Reject

- **Nội dung cần quyết định:** Có duyệt hai hành động ngang hàng và thông điệp
  cục bộ phân biệt Accepted với Applied Successfully hay không.
- **Classification:** GIAO DIỆN ĐỀ XUẤT.
- **Căn cứ PRD:** PM là người quyết định cuối cùng; Accept không mặc định áp dụng
  thành công; Reject không áp dụng.
- **User Story / AC:** US-04; AC-US-04-01 đến AC-US-04-03, AC-US-04-07.
- **Artifact liên quan:** `what-if-simulation-ui-design.md`;
  `WhatIfSimulationView.tsx`.
- **Đề xuất AI:** Approve proposed UI.
- **Ảnh hưởng:** Cách ghi nhận quyết định trong prototype; không thay đổi dữ liệu thật.
- **Requested Decision:** Approve proposed UI. **Review Status:** Approved.
- **Lý do:** Giữ Accept/Reject, nhưng Accept không được hiện thành áp dụng thành công.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Verification:** Static review xác nhận thông điệp chỉ ghi quyết định trong
  prototype, nói rõ phân bổ thật chưa thay đổi; browser interaction được ghi
  riêng trong hồ sơ QA.

## 6. Chi tiết quyết định — HR

### C4-HDR-013 — Kiến trúc thông tin HR

- **Nội dung cần quyết định:** Có duyệt HR gồm Tổng quan nguồn lực, Nhân sự và
  Kỹ năng; đồng thời Nhân sự không còn nằm trong điều hướng PM hay không.
- **Classification:** GIAO DIỆN ĐỀ XUẤT.
- **Căn cứ PRD:** HR duy trì Employee, Skill và Employee ↔ Skill trong phạm vi RMS-AI.
- **User Story / AC:** US-05, US-07; AC-US-05-01 đến AC-US-05-04,
  AC-US-07-01.
- **Artifact liên quan:** `three-role-workspace-ui-design.md`, `App.tsx`,
  `HrWorkspaceViews.tsx`; conflict C4-CONFLICT-02.
- **Đề xuất AI:** Approve proposed UI; sau phê duyệt mới sửa độ lệch trong
  `operations-overview-ui-design.md`.
- **Ảnh hưởng:** Ranh giới PM/HR và kiến trúc điều hướng.
- **Requested Decision:** Approve proposed UI. **Review Status:** Approved.
- **Lý do:** Giữ Tổng quan nguồn lực/Nhân sự/Kỹ năng cho HR.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Verification:** Tài liệu Tổng quan cũ đã được sửa để bỏ Nhân sự khỏi điều
  hướng PM; thay đổi này không xác nhận RBAC production.

### C4-HDR-014 — Trạng thái rỗng/chưa kết nối của HR

- **Nội dung cần quyết định:** Có duyệt việc chỉ trình bày nền tảng dữ liệu và
  trạng thái chưa kết nối, không tạo danh sách/KPI giả hay không.
- **Classification:** GIAO DIỆN ĐỀ XUẤT.
- **Căn cứ PRD:** Phạm vi HR tối thiểu; không mở rộng HRIS.
- **User Story / AC:** US-05; AC-US-05-01 đến AC-US-05-03.
- **Artifact liên quan:** `HrWorkspaceViews.tsx`, `EmployeesView.tsx`,
  `three-role-workspace-ui-design.md`.
- **Đề xuất AI:** Approve proposed UI.
- **Ảnh hưởng:** Tính trung thực của prototype khi chưa tích hợp dữ liệu.
- **Requested Decision:** Approve proposed UI. **Review Status:** Approved.
- **Lý do:** Thể hiện trung thực trạng thái chưa kết nối dữ liệu.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Verification:** Static verified; không có integration hoặc dữ liệu production.

## 7. Chi tiết quyết định — DEV

### C4-HDR-015 — Kiến trúc thông tin DEV

- **Nội dung cần quyết định:** Có duyệt DEV gồm Tổng quan của tôi, Kỹ năng của
  tôi và Công việc của tôi ở chế độ chỉ xem hay không.
- **Classification:** GIAO DIỆN ĐỀ XUẤT.
- **Căn cứ PRD:** DEV xem thông tin, Skill và Project/Sprint/Task của chính mình.
- **User Story / AC:** US-06, US-07; AC-US-06-01, AC-US-06-02,
  AC-US-06-05, AC-US-07-01.
- **Artifact liên quan:** `three-role-workspace-ui-design.md`, `App.tsx`,
  `DevWorkspaceViews.tsx`.
- **Đề xuất AI:** Approve proposed UI.
- **Ảnh hưởng:** Phạm vi trình bày của DEV; không tạo quyền ghi.
- **Requested Decision:** Approve proposed UI. **Review Status:** Approved.
- **Lý do:** DEV chỉ xem thông tin và ngữ cảnh của mình.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Verification:** Static verified; identity-backed data chưa được triển khai.

### C4-HDR-016 — Trạng thái thiếu danh tính/ngữ cảnh DEV

- **Nội dung cần quyết định:** Có duyệt trạng thái không có danh tính, Skill và
  Project/Sprint/Task thay vì tạo dữ liệu cá nhân giả hay không.
- **Classification:** GIAO DIỆN ĐỀ XUẤT.
- **Căn cứ PRD:** Quan hệ User Account ↔ Employee còn TBD; chỉ hiển thị context
  khi dữ liệu tồn tại.
- **User Story / AC:** US-06; AC-US-06-01 đến AC-US-06-04.
- **Artifact liên quan:** `DevWorkspaceViews.tsx`,
  `three-role-workspace-ui-design.md`.
- **Đề xuất AI:** Approve proposed UI.
- **Ảnh hưởng:** Empty state của DEV và ranh giới dữ liệu.
- **Requested Decision:** Approve proposed UI. **Review Status:** Approved.
- **Lý do:** Không tạo danh tính hoặc nhiệm vụ giả.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Verification:** Static verified; trạng thái rỗng không phải dữ liệu production.

## 8. Chi tiết quyết định — Cross-role

### C4-HDR-017 — Role Preview

- **Nội dung cần quyết định:** Có duyệt bộ chọn PM/HR/DEV cho mục đích review,
  kèm guardrail không phải đăng nhập/xác thực/phân quyền hay không.
- **Classification:** GIAO DIỆN ĐỀ XUẤT.
- **Căn cứ PRD:** Workspace theo role sau khi danh tính/role được xác định;
  cơ chế kỹ thuật còn TBD.
- **User Story / AC:** US-07; AC-US-07-01 đến AC-US-07-03.
- **Artifact liên quan:** `RolePreview.tsx`,
  `three-role-workspace-ui-design.md`.
- **Đề xuất AI:** Approve proposed UI.
- **Ảnh hưởng:** Cách người review vào ba workspace; không phải security control.
- **Requested Decision:** Approve proposed UI. **Review Status:** Approved.
- **Lý do:** Role Preview không phải Auth hoặc RBAC.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Verification:** Static text/semantics verified; interaction evidence được ghi riêng.

### C4-HDR-018 — App Shell và điều hướng theo role

- **Nội dung cần quyết định:** Có duyệt sidebar/header theo role, `aria-current`
  và luồng PM theo ngữ cảnh tách khỏi điều hướng toàn cục hay không.
- **Classification:** GIAO DIỆN ĐỀ XUẤT.
- **Căn cứ PRD:** Capability phù hợp role; luồng PM Risk → Decision.
- **User Story / AC:** US-01 đến US-07; AC-US-07-01, AC-US-07-02.
- **Artifact liên quan:** `AppShell.tsx`, `App.tsx`,
  `three-role-workspace-ui-design.md`; conflict C4-CONFLICT-02.
- **Đề xuất AI:** Approve proposed UI.
- **Ảnh hưởng:** Ranh giới global/context navigation và capability theo role.
- **Requested Decision:** Approve proposed UI. **Review Status:** Approved.
- **Lý do:** Giữ App Shell và điều hướng phân tách theo role.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Verification:** Static verified; tài liệu cũ đã được đồng bộ ranh giới PM/HR.

### C4-HDR-019 — Đặt lại state khi đổi vai trò

- **Nội dung cần quyết định:** Có duyệt việc đổi vai trò quay về Role Preview,
  hủy state workspace cũ, trong khi luồng PM giữ project/candidate context nội bộ.
- **Classification:** GIAO DIỆN ĐỀ XUẤT.
- **Căn cứ PRD:** Không có quy tắc persistence cross-role; capability phải phù
  hợp role.
- **User Story / AC:** US-07; AC-US-07-01, AC-US-07-02.
- **Artifact liên quan:** `App.tsx`, `AppShell.tsx`,
  `three-role-workspace-ui-design.md`.
- **Đề xuất AI:** Approve proposed UI ở mức prototype.
- **Ảnh hưởng:** Tránh mang context PM sang HR/DEV.
- **Requested Decision:** Approve proposed UI. **Review Status:** Approved.
- **Lý do:** Reset trạng thái khi đổi role; cần xác minh bằng thao tác.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Verification:** Static review xác nhận `exitRolePreview()` đặt AppState về
  `role-preview` và việc chọn lại PM mở `operations-overview`; browser evidence
  được ghi riêng, không suy ra production session behavior.

### C4-HDR-020 — Responsive và accessibility

- **Nội dung cần quyết định:** Duyệt breakpoint/layout và semantic/focus design
  sau khi review trực quan tại 1440/1280/1024/768 và kiểm thử bàn phím.
- **Classification:** GIAO DIỆN ĐỀ XUẤT.
- **Căn cứ PRD:** Không có yêu cầu kỹ thuật chi tiết; đây là chất lượng thiết kế.
- **User Story / AC:** US-01 đến US-07; không có AC trực tiếp cho breakpoint.
- **Artifact liên quan:** `three-role-workspace-ui-design.md`, `App.css`,
  `index.css`, các component Frontend.
- **Đề xuất AI:** Request revision/verification; code tĩnh có hỗ trợ nhưng chưa
  có bằng chứng visual, keyboard hoặc screen-reader.
- **Ảnh hưởng:** Khả năng review và tiếp cận prototype.
- **Requested Decision:** Pending. **Review Status:** Pending.
- **Lý do:** Chưa duyệt cho tới khi có kết quả visual QA tại
  1440/1280/1024/768px và kiểm thử bàn phím/accessibility.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Verification:** Chỉ cập nhật từ các phép kiểm thực sự chạy; screen-reader
  giữ `NOT RUN` nếu không có công cụ.

## 9. Chi tiết quyết định — Business/Product TBD

### C4-HDR-021 — TBD-01: dữ liệu tối thiểu và hợp lệ

- **Nội dung cần quyết định:** Trường dữ liệu tối thiểu, điều kiện đủ/hợp lệ,
  xử lý dữ liệu thiếu và phần HR chịu trách nhiệm duy trì.
- **Classification:** TBD.
- **Căn cứ PRD:** Các vấn đề chưa quyết định — dữ liệu hỗ trợ tối thiểu.
- **User Story / AC:** US-01, US-02, US-05, US-06; AC-US-01-02,
  AC-US-02-04, AC-US-05-02, AC-US-05-03; TBD-01.
- **Artifact liên quan:** Tất cả tài liệu UI; workspace HR/DEV.
- **Đề xuất AI:** Keep as TBD; Chapter 4 chỉ cần giữ trạng thái thiếu dữ liệu trung thực.
- **Ảnh hưởng:** Điều kiện tạo risk/recommendation và phạm vi UI HR.
- **Requested Decision:** Keep as TBD. **Review Status:** Keep as TBD.
- **Lý do:** Dữ liệu tối thiểu và hợp lệ chưa đủ căn cứ.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Phạm vi sau:** Xử lý trong requirement/data work phù hợp; không chặn UI
  review nếu trạng thái thiếu dữ liệu tiếp tục được trình bày trung thực.

### C4-HDR-022 — TBD-02: biểu diễn và độ mới của rủi ro

- **Nội dung cần quyết định:** Điểm/mức rủi ro nếu có, ngưỡng, thứ tự yếu tố và
  chính sách kết quả lỗi thời.
- **Classification:** TBD.
- **Căn cứ PRD:** Chưa xác định đầu ra chi tiết và độ mới.
- **User Story / AC:** US-01; AC-US-01-01, AC-US-01-03; TBD-02.
- **Artifact liên quan:** `pm-risk-ui-design.md`, `ProjectRiskOverview.tsx`,
  `ProjectRiskDetail.tsx`.
- **Đề xuất AI:** Keep as TBD; giữ placeholder, không tạo số/ngưỡng.
- **Ảnh hưởng:** Cách hiển thị risk và factors.
- **Requested Decision:** Keep as TBD. **Review Status:** Keep as TBD.
- **Lý do:** Điểm, mức và độ mới của risk chưa xác nhận.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Phạm vi sau:** Cần requirement/model-output decision trước khi bỏ placeholder.

### C4-HDR-023 — TBD-03: tiêu chí và dữ liệu Recommendation

- **Nội dung cần quyết định:** Điều kiện phù hợp/loại trừ, số lượng, đồng hạng,
  trường ứng viên, availability/workload thiếu và hành động sau kết quả rỗng.
- **Classification:** TBD.
- **Căn cứ PRD:** Công thức matching, availability, utilization và workload chưa chốt.
- **User Story / AC:** US-02; AC-US-02-01, AC-US-02-03 đến AC-US-02-05; TBD-03.
- **Artifact liên quan:** `resource-recommendation-ui-design.md`,
  `ResourceRecommendationView.tsx`.
- **Đề xuất AI:** Keep as TBD; không ép dữ liệu thiếu thành “available”.
- **Ảnh hưởng:** Nội dung và xếp hạng danh sách ứng viên.
- **Requested Decision:** Keep as TBD. **Review Status:** Keep as TBD.
- **Lý do:** Tiêu chí và trọng số matching chưa chốt.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Phạm vi sau:** Chuyển sang requirement/AI design phù hợp; không tạo công thức trong Chapter 4.

### C4-HDR-024 — TBD-04: cấu trúc phương án và ràng buộc

- **Nội dung cần quyết định:** Một phương án gồm gì, ứng viên có phải phương án
  hoàn chỉnh không, trường chỉnh sửa và xử lý vi phạm ràng buộc.
- **Classification:** TBD.
- **Căn cứ PRD:** Đơn vị/lượng phân bổ và quy tắc workload chưa xác định.
- **User Story / AC:** US-03, US-04; AC-US-03-03, AC-US-04-01; TBD-04.
- **Artifact liên quan:** tài liệu Recommendation/Simulation;
  `WhatIfSimulationView.tsx`.
- **Đề xuất AI:** Keep as TBD; tiếp tục gọi candidate là ngữ cảnh minh họa.
- **Ảnh hưởng:** Handoff Recommendation → Simulation và validation scenario.
- **Requested Decision:** Keep as TBD. **Review Status:** Keep as TBD.
- **Lý do:** Cấu trúc và ràng buộc phương án chưa chốt.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Phạm vi sau:** Xác định scenario/allocation semantics trước khi thiết kế payload hoặc validation.

### C4-HDR-025 — TBD-05: chỉ báo tác động

- **Nội dung cần quyết định:** Baseline, metric, thang đo và tác động tới risk,
  workload, skill coverage, delivery hoặc dự án khác.
- **Classification:** TBD.
- **Căn cứ PRD:** Chỉ xác nhận “tác động dự kiến” ở mức khái quát.
- **User Story / AC:** US-03; AC-US-03-01; TBD-05.
- **Artifact liên quan:** `what-if-simulation-ui-design.md`,
  `WhatIfSimulationView.tsx`.
- **Đề xuất AI:** Keep as TBD; không thêm số liệu minh họa như kết quả thật.
- **Ảnh hưởng:** Nội dung vùng Impact.
- **Requested Decision:** Keep as TBD. **Review Status:** Keep as TBD.
- **Lý do:** Impact metrics và baseline chưa chốt.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Phạm vi sau:** Xác định metric/baseline trước khi thay placeholder bằng kết quả.

### C4-HDR-026 — TBD-06: điều kiện Accept và thời điểm áp dụng

- **Nội dung cần quyết định:** Có bắt buộc simulation hợp lệ trước Accept hay
  không; điều kiện đủ và thời điểm áp dụng sau quyết định.
- **Classification:** TBD.
- **Căn cứ PRD:** Accept là quyết định PM, không mặc định áp dụng thành công.
- **User Story / AC:** US-04; AC-US-04-01, AC-US-04-04; TBD-06.
- **Artifact liên quan:** tài liệu Simulation/Decision;
  `WhatIfSimulationView.tsx`.
- **Đề xuất AI:** Keep as TBD; prototype chỉ ghi quyết định cục bộ.
- **Ảnh hưởng:** Enablement CTA và trạng thái sau Accept.
- **Requested Decision:** Keep as TBD. **Review Status:** Keep as TBD.
- **Lý do:** Điều kiện và thời điểm áp dụng sau Accept chưa chốt.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Phạm vi sau:** Xử lý trong workflow/application design; Chapter 4 tiếp tục phân biệt Accept với Applied Successfully.

### C4-HDR-027 — TBD-07: lỗi và phục hồi

- **Nội dung cần quyết định:** Hành vi khi risk/recommendation/simulation/apply
  thất bại, gồm retry, partial failure và recovery.
- **Classification:** TBD.
- **Căn cứ PRD:** Không định nghĩa quy trình lỗi/rollback.
- **User Story / AC:** US-01 đến US-04; AC-US-01-02, AC-US-02-04,
  AC-US-03-04, AC-US-04-06, AC-US-04-07; TBD-07.
- **Artifact liên quan:** tất cả tài liệu UI PM.
- **Đề xuất AI:** Keep as TBD; giữ bất biến không báo apply thành công khi thất bại.
- **Ảnh hưởng:** Error states và đường phục hồi.
- **Requested Decision:** Keep as TBD. **Review Status:** Keep as TBD.
- **Lý do:** Retry, recovery và xử lý lỗi chưa chốt.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Phạm vi sau:** Chốt error/recovery policy trước implementation; giữ bất biến không báo thành công sai.

### C4-HDR-028 — TBD-08: stale data và quyết định lặp

- **Nội dung cần quyết định:** Cách xử lý phương án/dữ liệu thay đổi sau simulation,
  kết quả cũ và quyết định gửi lặp.
- **Classification:** TBD.
- **Căn cứ PRD:** Chính sách độ mới và quyết định lặp chưa chốt.
- **User Story / AC:** US-03, US-04; AC-US-03-05, AC-US-04-04,
  AC-US-04-05; TBD-08.
- **Artifact liên quan:** tài liệu Simulation/Decision.
- **Đề xuất AI:** Keep as TBD; kết quả cũ chỉ gắn với phương án cũ.
- **Ảnh hưởng:** Validity của kết quả và idempotency quyết định.
- **Requested Decision:** Keep as TBD. **Review Status:** Keep as TBD.
- **Lý do:** Stale data và duplicate decision chưa chốt.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Phạm vi sau:** Xác định freshness/idempotency trước production workflow.

### C4-HDR-029 — TBD-09: không tiếp tục phương án

- **Nội dung cần quyết định:** Lưu, hủy, hết hạn hoặc điều hướng khi PM rời luồng
  mà không Accept/Reject.
- **Classification:** TBD.
- **Căn cứ PRD:** Chỉ xác nhận không có Accept rõ ràng thì không áp dụng.
- **User Story / AC:** US-03, US-04; AC-US-04-03; TBD-09.
- **Artifact liên quan:** tài liệu Recommendation/Simulation/Decision.
- **Đề xuất AI:** Keep as TBD; không tự thêm draft/history/expiry.
- **Ảnh hưởng:** Vòng đời phương án và hành vi quay lại.
- **Requested Decision:** Keep as TBD. **Review Status:** Keep as TBD.
- **Lý do:** Vòng đời lưu/hủy/hết hạn chưa chốt.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Phạm vi sau:** Không thêm draft/history/expiry cho tới khi có requirement.

### C4-HDR-030 — TBD-10: AI/ML và dữ liệu tương lai

- **Nội dung cần quyết định:** Nhãn huấn luyện, metric, mô hình matching, quy mô
  demo và dữ liệu thật/kết hợp trong tương lai.
- **Classification:** TBD.
- **Căn cứ PRD:** Các vấn đề chưa quyết định và ngoài phạm vi Chapter 4.
- **User Story / AC:** Không có AC chốt thuật toán; TBD-10.
- **Artifact liên quan:** Không có artifact UI bắt buộc; chỉ ảnh hưởng dữ liệu
  tương lai.
- **Đề xuất AI:** Keep as TBD và chuyển sang chapter phù hợp; không triển khai.
- **Ảnh hưởng:** Không chặn khả năng review UI nếu được ghi nhận giữ lại.
- **Requested Decision:** Keep as TBD. **Review Status:** Keep as TBD.
- **Lý do:** Mô hình AI/ML và dữ liệu chưa chốt.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Phạm vi sau:** Ngoài Chapter 4; không triển khai model hoặc pipeline trong close-out này.

### C4-HDR-031 — TBD-11: danh tính, Auth và quyền

- **Nội dung cần quyết định:** Quan hệ User Account ↔ Employee, cơ chế Auth,
  xác định role, phân quyền kỹ thuật và quyền xem chi tiết.
- **Classification:** TBD.
- **Căn cứ PRD:** Chỉ xác nhận kết quả workspace theo role; cơ chế kỹ thuật TBD.
- **User Story / AC:** US-05 đến US-07; AC-US-07-01, AC-US-07-03; TBD-11.
- **Artifact liên quan:** `three-role-workspace-ui-design.md`, `RolePreview.tsx`,
  `AppShell.tsx`.
- **Đề xuất AI:** Keep as TBD; tiếp tục ghi Role Preview không phải Auth.
- **Ảnh hưởng:** Identity mapping và security production; không chặn review
  prototype khi guardrail rõ.
- **Requested Decision:** Keep as TBD. **Review Status:** Keep as TBD.
- **Lý do:** Identity, Auth, RBAC và liên kết Employee chưa chốt.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Phạm vi sau:** Xử lý trong security/architecture scope; Role Preview tiếp tục không phải Auth.

### C4-HDR-032 — TBD-12: capability ghi của DEV

- **Nội dung cần quyết định:** DEV có được sửa Skill, gửi tiến độ, thay đổi
  allocation, tự nhận Task hoặc chạy simulation trong tương lai hay không.
- **Classification:** TBD.
- **Căn cứ PRD:** DEV hiện chỉ được xác nhận xem ngữ cảnh của mình.
- **User Story / AC:** US-06; AC-US-06-04, AC-US-06-05; TBD-12.
- **Artifact liên quan:** `three-role-workspace-ui-design.md`,
  `DevWorkspaceViews.tsx`.
- **Đề xuất AI:** Keep as TBD; không hiển thị write/simulation actions cho DEV.
- **Ảnh hưởng:** Phạm vi DEV workspace; không chặn bản mẫu chỉ xem.
- **Requested Decision:** Keep as TBD. **Review Status:** Keep as TBD.
- **Lý do:** Write actions và simulation của DEV chưa xác nhận.
- **Decision provenance:** User-provided, AI-assisted delegated design review decisions.
- **Phạm vi sau:** Tiếp tục không hiển thị các action này cho tới khi có requirement.

## 10. Phản hồi mong đợi

Người review phản hồi theo mẫu:

```text
C4-HDR-XXX
Reviewer choice: Approve proposed UI | Reject proposed UI | Request revision | Keep as TBD
Reason: ...
Human decision evidence: ...
```

Các mục chưa có phản hồi tiếp tục là `Pending`. Không dùng một câu “duyệt hết”
để tự suy ra lý do hoặc bằng chứng còn thiếu cho các quyết định nghiệp vụ.

