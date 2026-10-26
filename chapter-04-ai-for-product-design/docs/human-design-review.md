# Hồ sơ Human Design Review — Chapter 4

## 1. Mục đích

Tài liệu này chuẩn bị hồ sơ rà soát thiết kế có con người phê duyệt cho
Chapter 4 của RMS-AI. Hồ sơ tổng hợp bằng chứng hiện có, phát hiện của AI,
những lựa chọn giao diện cần con người quyết định và các TBD cần được chủ động
giữ lại hoặc chuyển sang giai đoạn sau.

Giai đoạn B ghi nhận bộ quyết định được người dùng cung cấp thông qua review
được ủy quyền cho AI. Đây **không phải** bằng chứng rằng người dùng đã trực tiếp
kiểm tra mọi màn hình, chạy accessibility test hoặc ký biên bản nghiệm thu.
AI không chuyển một lựa chọn giao diện hoặc TBD thành yêu cầu sản phẩm đã xác
nhận.

## 2. Phạm vi và giới hạn

Phạm vi rà soát:

- PM: Tổng quan, Dự án, Trung tâm rủi ro, Chi tiết rủi ro, Đề xuất nhân sự,
  Mô phỏng giả định và Quyết định.
- HR: Tổng quan nguồn lực, Nhân sự và Kỹ năng.
- DEV: Tổng quan của tôi, Kỹ năng của tôi và Công việc của tôi.
- Liên vai trò: Role Preview, App Shell, chuyển đổi trạng thái, responsive và
  accessibility.
- Các TBD-01 đến TBD-12 có ảnh hưởng tới khả năng rà soát Chapter 4.

Giới hạn:

- Đây là rà soát tài liệu, mã nguồn tĩnh và prototype chạy cục bộ trong phạm vi
  Chapter 4.
- Không xác nhận hành vi production, tích hợp dữ liệu, API, database, AI/ML,
  xác thực, phân quyền hoặc thay đổi phân bổ thật.
- Giai đoạn B đã thực hiện visual QA và kiểm thử bàn phím bằng trình duyệt thật;
  kết quả và giới hạn được ghi tại mục 12. Không có screen-reader test.
- Các nội dung chưa được thực thi vẫn ghi `NOT RUN` hoặc `NOT VERIFIED`, không
  được suy diễn là `PASS`.

## 3. Baseline được rà soát

| Thuộc tính | Giá trị |
| --- | --- |
| Repository | `https://github.com/CongHien05/rms-ai.git` |
| Nhánh | `main` |
| Baseline commit khi bắt đầu Giai đoạn B | `1fa4d47` — `Merge pull request #20 from CongHien05/feat/add-three-role-workspaces` |
| HEAD khi hoàn tất QA/validation | `43f8c35` — commit bên ngoài đã ghi các revision Giai đoạn B; các cập nhật QA cuối vẫn chưa commit |
| Working tree khi bắt đầu Giai đoạn B | Có thay đổi Giai đoạn A chưa commit: `README.md` và ba hồ sơ Human Review |
| Ngày AI chuẩn bị hồ sơ | 2026-10-25 |
| Ngày ghi nhận quyết định Giai đoạn B | 2026-10-26 |
| Người review | Chưa ghi nhận |
| Decision provenance | User-provided, AI-assisted delegated design review decisions |
| Chữ ký / biên bản review trực tiếp | Không có |
| Trạng thái Human Review | Đang mở: 15 Approved, 5 Pending, 12 Keep as TBD |

## 4. Nguồn tham chiếu

Nguồn yêu cầu có thẩm quyền:

1. [`../../AGENTS.md`](../../AGENTS.md)
2. [`../../README.md`](../../README.md)
3. [`../../chapter-03-ai-for-requirements-product-analysis/docs/PRD.md`](../../chapter-03-ai-for-requirements-product-analysis/docs/PRD.md)
4. [`../../chapter-03-ai-for-requirements-product-analysis/docs/user-stories.md`](../../chapter-03-ai-for-requirements-product-analysis/docs/user-stories.md)
5. [`../../chapter-03-ai-for-requirements-product-analysis/docs/acceptance-criteria.md`](../../chapter-03-ai-for-requirements-product-analysis/docs/acceptance-criteria.md)

Nguồn thiết kế và prototype được đối chiếu:

- [`../README.md`](../README.md) và [`../GUIDELINE.md`](../GUIDELINE.md)
- [`../../chapter-03-ai-for-requirements-product-analysis/docs/pm-risk-ui-design.md`](../../chapter-03-ai-for-requirements-product-analysis/docs/pm-risk-ui-design.md)
- [`../../chapter-03-ai-for-requirements-product-analysis/docs/resource-recommendation-ui-design.md`](../../chapter-03-ai-for-requirements-product-analysis/docs/resource-recommendation-ui-design.md)
- [`what-if-simulation-ui-design.md`](what-if-simulation-ui-design.md)
- [`operations-overview-ui-design.md`](operations-overview-ui-design.md)
- [`three-role-workspace-ui-design.md`](three-role-workspace-ui-design.md)
- [`../../frontend/src/App.tsx`](../../frontend/src/App.tsx) và các component
  Frontend liên quan.
- [`../../COURSE_PROGRESS.md`](../../COURSE_PROGRESS.md) để kiểm tra độ lệch
  trạng thái tài liệu; tài liệu này không được sửa trong lượt chuẩn bị review.

## 5. Quy ước phân loại và trạng thái review

### Classification

- **ĐÃ XÁC NHẬN:** có căn cứ trực tiếp từ PRD, User Stories hoặc Acceptance
  Criteria.
- **GIAO DIỆN ĐỀ XUẤT:** lựa chọn trình bày hoặc tương tác để con người rà soát;
  phê duyệt lựa chọn này không tự tạo business rule mới.
- **TBD:** yêu cầu, dữ liệu, ngữ nghĩa hoặc hành vi chưa có đủ căn cứ.

### Review Status

- **Pending:** chưa có quyết định hoặc đang yêu cầu chỉnh sửa.
- **Approved:** con người chấp thuận lựa chọn thiết kế được nêu.
- **Rejected:** con người từ chối lựa chọn thiết kế được nêu.
- **Keep as TBD:** con người chủ động giữ nội dung chưa quyết định cho giai đoạn
  sau và chấp nhận ảnh hưởng đã ghi.

`Approved` là trạng thái review, không thay đổi Classification. Một
`GIAO DIỆN ĐỀ XUẤT` được duyệt vẫn là quyết định thiết kế; một `TBD` không được
biến thành yêu cầu đã xác nhận nếu chưa cập nhật cơ sở yêu cầu có thẩm quyền.

## 6. Kiểm chứng checklist Chapter 4

| Mục Chapter 4 | Checklist hiện tại | Bằng chứng | Kết quả kiểm chứng | Khoảng trống | Đủ điều kiện hoàn thành |
| --- | --- | --- | --- | --- | --- |
| Luồng và wireframe chính của PM | `[x]` | `pm-risk-ui-design.md`, `resource-recommendation-ui-design.md`, `what-if-simulation-ui-design.md` | Có tài liệu cho chuỗi Risk → Recommendation → Simulation → Decision | C4-HDR-002/005/008/010 chờ tái duyệt | Có bằng chứng thiết kế và revision; chưa đóng review |
| Loading, empty, invalid và missing data | `[x]` | Các ma trận trạng thái trong tài liệu UI; component có trạng thái rỗng/không khả dụng | Các trạng thái quan trọng đã được xem xét ở mức thiết kế | Prototype không hiện thực đầy đủ loading/error/retry | Có đủ bằng chứng “đã xem xét”; mức thực thi ghi Not verified |
| Traceability PRD/US/AC | `[x]` | Bảng truy vết trong tài liệu UI và ma trận review mới | US-01 đến US-07 và các AC liên quan có thể đối chiếu | Một số lựa chọn UI không có căn cứ trực tiếp và phải giữ đúng nhãn đề xuất | Có đủ bằng chứng chuẩn bị cho review |
| Frontend prototype | `[x]` | `frontend/src/App.tsx`, component PM/HR/DEV và QA trình duyệt Giai đoạn B | Prototype giới hạn tồn tại; đã kiểm tra ở 1440/1280/1024/768 px | Screen reader chưa chạy; năm trạng thái simulation chưa hiện thực đầy đủ | Có ở mức prototype; không phải production |
| Workspace PM, HR, DEV | `[x]` | `three-role-workspace-ui-design.md`, `RolePreview.tsx`, `AppShell.tsx`, component HR/DEV | Ba workspace và Role Preview tồn tại | Auth/RBAC và liên kết dữ liệu vẫn TBD đúng chủ đích | Có ở mức trình bày prototype |
| Human Design Review | `[ ]` | Decision Register, Traceability và kết quả QA Giai đoạn B | Đã ghi nhận 15 Approved, 5 Pending, 12 Keep as TBD | Bốn revision chờ tái duyệt; C4-HDR-020 còn Pending | **Không** |

## 7. Tổng quan phát hiện thiết kế

### 7.1 AI findings

1. Luồng cốt lõi của PM được nối nhất quán từ Risk đến Decision và giữ các bất
   biến: AI hỗ trợ, PM quyết định; xem đề xuất/mô phỏng không thay đổi phân bổ
   thật; Accept không đồng nghĩa Applied Successfully.
2. Prototype tách điều hướng toàn cục của PM khỏi luồng theo ngữ cảnh. Đề xuất,
   Mô phỏng và Quyết định không xuất hiện như module toàn cục.
3. Trạng thái không thể đánh giá rủi ro và không có ứng viên phù hợp không bị
   trình bày như kết quả tích cực giả.
4. HR và DEV dùng trạng thái rỗng/chưa kết nối thay vì tạo hồ sơ, kỹ năng, KPI
   hoặc nhiệm vụ giả.
5. Role Preview được ghi rõ không phải Authentication, Authorization hoặc
   Security; đổi vai trò đặt lại state về màn hình đầu hợp lệ.
6. Code có semantic `button`, `nav`, `main`, thứ bậc heading, `aria-current`,
   `role="status"`/`role="note"` và `focus-visible`. Tab, Shift+Tab, Enter,
   Space và focus-visible đã được kiểm tra bằng trình duyệt; screen reader chưa
   được chạy.
7. Prototype hiện chỉ mô phỏng trạng thái thành công cục bộ; loading, failure,
   retry, stale result và apply failure mới được xem xét trong tài liệu, chưa
   được xác minh trong UI chạy thật.

### 7.2 AI recommendations

- Tái duyệt C4-HDR-002, C4-HDR-005, C4-HDR-008 và C4-HDR-010 sau revision;
  không tự chuyển chúng sang Approved.
- Giữ C4-HDR-021 đến C4-HDR-032 là `Keep as TBD` cho tới khi có căn cứ nghiệp
  vụ; không dùng prototype làm nguồn yêu cầu thay thế.
- Hoàn tất bằng chứng accessibility còn thiếu cho C4-HDR-020, đặc biệt là
  screen-reader test nếu đây là điều kiện close-out của nhóm.
- Chỉ đề xuất cập nhật `COURSE_PROGRESS.md` cho C4-CONFLICT-01 trong một phạm
  vi riêng; không sửa tài liệu này ở Giai đoạn B.

## 8. Mâu thuẫn và khoảng trống

### C4-CONFLICT-01 — Trạng thái workspace ba vai trò

- `COURSE_PROGRESS.md`, mục **Mốc cuối tuần hiện tại**, nói workspace DEV/PM/HR
  là định hướng tuần sau và chưa được triển khai trong tác vụ đó.
- `chapter-04-ai-for-product-design/README.md`, mục **Tiến độ**, và commit
  `1fa4d47` cho thấy thiết kế/prototype ba vai trò đã được merge sau đó.
- Frontend hiện có `RolePreview`, `AppShell`, HR workspace và DEV workspace.
- Phân loại: độ lệch trạng thái tài liệu, không phải mâu thuẫn nghiệp vụ.
- Ảnh hưởng: `COURSE_PROGRESS.md` không còn phản ánh baseline mới nhất.
- Xử lý trong lượt này: ghi nhận; không sửa theo ràng buộc nhiệm vụ.

### C4-CONFLICT-02 — “Nhân sự” trong điều hướng PM

- Baseline Giai đoạn A của `operations-overview-ui-design.md`, mục **Quyết định
  ở mức bản mẫu**, từng ghi điều hướng toàn cục gồm Tổng quan, Dự án, Nhân sự
  và Trung tâm rủi ro.
- `three-role-workspace-ui-design.md`, mục **Không gian làm việc PM**, và
  `frontend/src/App.tsx` chỉ có Tổng quan, Dự án và Trung tâm rủi ro cho PM;
  Nhân sự thuộc HR workspace.
- Phân loại: mâu thuẫn thiết kế/kiến trúc thông tin.
- Quyết định liên quan: C4-HDR-013 và C4-HDR-018 được ghi Approved ở cấp thiết
  kế theo nguồn ủy quyền.
- Xử lý Giai đoạn B: đã cập nhật `operations-overview-ui-design.md` để PM chỉ
  có Tổng quan, Dự án và Trung tâm rủi ro; Employee/Skill thuộc HR theo US-05.
  Thay đổi này không suy ra Auth hoặc RBAC production.

### Khoảng trống xác minh

- Không có biên bản người dùng trực tiếp thực hiện visual QA; bằng chứng Giai
  đoạn B là kiểm thử trình duyệt do AI-assisted executor thực hiện.
- Không có screen-reader test hoặc accessibility audit chuyên dụng.
- Không có chữ ký review hoặc reviewer identity; nguồn quyết định được ghi đúng
  là `User-provided, AI-assisted delegated design review decisions`.
- Không có quy tắc nghiệp vụ mới nào được phép suy ra để lấp TBD-01 đến TBD-12.

## 9. Danh mục cần con người phê duyệt

Danh mục đầy đủ nằm trong
[`human-review-decision-register.md`](human-review-decision-register.md).

| Nhóm | Review ID | Số mục | Trạng thái |
| --- | --- | ---: | --- |
| PM — Tổng quan và Rủi ro | C4-HDR-001 đến C4-HDR-005 | 5 | 3 Approved; 2 Pending — Awaiting re-review |
| PM — Recommendation, Simulation, Decision | C4-HDR-006 đến C4-HDR-012 | 7 | 5 Approved; 2 Pending — Awaiting re-review |
| HR | C4-HDR-013 đến C4-HDR-014 | 2 | 2 Approved |
| DEV | C4-HDR-015 đến C4-HDR-016 | 2 | 2 Approved |
| Cross-role | C4-HDR-017 đến C4-HDR-020 | 4 | 3 Approved; 1 Pending |
| Business/Product TBD | C4-HDR-021 đến C4-HDR-032 | 12 | 12 Keep as TBD |
| **Tổng** |  | **32** | **15 Approved; 5 Pending; 12 Keep as TBD; 0 Rejected** |

Phân bố Classification:

- GIAO DIỆN ĐỀ XUẤT: 20.
- TBD: 12.
- ĐÃ XÁC NHẬN cần quyết định mới: 0. Nội dung đã xác nhận chỉ được dùng làm
  guardrail và căn cứ truy vết.

## 10. Traceability

Ma trận đầy đủ nằm trong
[`human-review-traceability.md`](human-review-traceability.md). Ma trận bao phủ:

- US-01: Project Risk.
- US-02: Resource Recommendation.
- US-03: What-if Simulation.
- US-04: PM Decision.
- US-05: HR Workspace.
- US-06: DEV Workspace.
- US-07: Role-based Workspace.

Các lựa chọn thuần trình bày không có căn cứ trực tiếp được giữ nhãn
`GIAO DIỆN ĐỀ XUẤT`; các quy tắc thiếu được ánh xạ về TBD tương ứng thay vì tạo
ID PRD/US/AC giả.

## 11. Bằng chứng Human Review

| Trường | Giá trị |
| --- | --- |
| Reviewer | Chưa ghi nhận |
| Decision recording date | 2026-10-26 |
| Decision provenance | User-provided, AI-assisted delegated design review decisions |
| Direct human visual QA / signature | Không có; không được suy diễn từ bộ quyết định |
| Số mục Approved | 15 |
| Số mục Rejected | 0 |
| Số mục Keep as TBD | 12 |
| Số mục Pending | 5, gồm 4 Request revision và C4-HDR-020 |

Quyết định được ghi theo Review ID trong Decision Register. `Approved` chỉ là
quyết định thiết kế theo nguồn ủy quyền, không phải requirement `ĐÃ XÁC NHẬN`,
kiểm thử production hoặc nghiệm thu của Product Owner.

## 12. Verification evidence

| Hạng mục | Kết quả | Bằng chứng / giới hạn |
| --- | --- | --- |
| Đối chiếu tài liệu PRD/US/AC/UI | PASS | Rà soát tĩnh các nguồn liệt kê ở mục 4 |
| Đối chiếu component Frontend | PASS | Rà soát tĩnh `App.tsx`, App Shell, PM/HR/DEV và mock data |
| Visual QA tại 1440/1280/1024/768 | PASS với giới hạn | Trình duyệt thật, viewport lần lượt 1440, 1280, 1024 và 768 px; kiểm tra Role Preview, PM Overview, Risk Detail và luồng Recommendation → Simulation → Decision. Không thấy tràn ngang ngoài chủ đích, chồng lấp, mất CTA/TBD hoặc biến dạng simulation sau khi sửa thanh bước responsive. Đây không phải review trực tiếp của người dùng. |
| Lỗi responsive phát hiện và sửa | PASS | Ở 1024 px, nhãn cuối của `.context-flow` từng bị cắt; giảm connector width/margin trong `frontend/src/App.css`, sau đó xác minh `scrollWidth === clientWidth` cho context flow tại 1024 và 768 px. |
| Kiểm thử bàn phím | PASS | Thực hiện Tab, Shift+Tab, Enter và Space trên Role Preview/App Shell; focus-visible quan sát được; thứ tự focus chuyển PM → HR và quay lại; không gặp keyboard trap trong luồng đã kiểm tra. |
| Accessibility qua browser/DOM | PASS với giới hạn | AX tree cho thấy semantic button/nav/main, một `h1`, các `h2`, tên điều khiển; `aria-current="page"` ở nav và `aria-current="step"` ở bước quyết định; trạng thái rỗng có text và trạng thái không chỉ truyền đạt bằng màu. Không thay thế screen-reader test. |
| Cross-role PM → HR → DEV → PM | PASS | Thao tác thật cho thấy mỗi role mở đúng workspace; quay lại PM mở `Tổng quan vận hành`, không còn context flow hoặc `Ứng viên A`. Role Preview không được gọi Login/Logout. |
| C4-HDR-012 Accept / Reject | PASS | Cả hai nhánh được thao tác trong trình duyệt. Accept chỉ ghi quyết định trong bản mẫu và nói phân bổ thật chưa thay đổi; Reject nói phương án không được áp dụng; không có `Applied Successfully`. |
| C4-HDR-019 state reset | PASS | Kiểm tra bằng thao tác cross-role và đối chiếu tĩnh state trong `App.tsx`; candidate/project/decision state không được mang sang role khác và PM quay về điểm bắt đầu hợp lệ. |
| Screen reader test | NOT RUN | Môi trường không cung cấp phiên screen reader; không ghi PASS hoặc thay thế bằng AX tree. |
| Hành vi production/API/data | NOT APPLICABLE | Ngoài phạm vi Chapter 4 và chưa được triển khai |

### 12.1 Targeted revision summary

| Review ID | Revision đã thực hiện | File chính | Trạng thái sau sửa |
| --- | --- | --- | --- |
| C4-HDR-002 | Đổi nhãn dự án và hoạt động thành dữ liệu minh họa/chưa kết nối; nói rõ không phải ưu tiên vận hành và quy tắc/nguồn vẫn TBD | `OperationsOverview.tsx`, `operations-overview-ui-design.md` | Pending — Awaiting re-review |
| C4-HDR-005 | Trạng thái không thể đánh giá không bị diễn giải là Low Risk; CTA được gọi là bước prototype và điều kiện cho phép/khóa vẫn TBD | `ProjectRiskDetail.tsx`, `pm-risk-ui-design.md` | Pending — Awaiting re-review |
| C4-HDR-008 | Phân biệt ứng viên với phương án phân bổ hoàn chỉnh; `candidateId` chỉ giữ ngữ cảnh minh họa | `ResourceRecommendationView.tsx`, `WhatIfSimulationView.tsx`, `resource-recommendation-ui-design.md` | Pending — Awaiting re-review |
| C4-HDR-010 | Gọi kết quả là minh họa/placeholder; ghi rõ Ready và Success có prototype, còn Loading/Missing/Failure chỉ có trong thiết kế | `WhatIfSimulationView.tsx`, `what-if-simulation-ui-design.md` | Pending — Awaiting re-review |

Revision không tạo API, simulation engine, matching rule, allocation payload
hoặc dữ liệu production. Bốn mục vẫn Pending theo đúng quy tắc tái duyệt.

## 13. Chapter 4 Readiness Assessment

### Kết luận: **Not ready**

Lý do:

- C4-HDR-002, C4-HDR-005, C4-HDR-008 và C4-HDR-010 đã sửa nhưng vẫn
  `Pending — Awaiting re-review`.
- C4-HDR-020 vẫn `Pending`: visual/keyboard/browser accessibility đã có bằng
  chứng công cụ, nhưng chưa có screen-reader test hoặc quyết định duyệt cuối.
- Không có reviewer identity, chữ ký hoặc bằng chứng người dùng trực tiếp kiểm
  tra toàn bộ màn hình; nguồn quyết định là review ủy quyền có AI hỗ trợ.
- C4-CONFLICT-01 vẫn là độ lệch trạng thái tài liệu và chỉ được đề xuất xử lý ở
  phạm vi riêng; không ảnh hưởng thành production requirement.
- Mục Human Design Review trong Chapter 4 README phải tiếp tục để `[ ]`.

Các TBD-01 đến TBD-12 có thể được giữ lại khi đóng Chapter 4 nếu con người chủ
động chọn `Keep as TBD`, ghi lý do, phạm vi ảnh hưởng và xác nhận chúng không
làm mất khả năng review của thiết kế hiện tại.

Điều kiện để chuyển sang **Ready**:

- Tất cả lựa chọn UI bắt buộc có quyết định và bằng chứng con người.
- Không còn TBD chặn khả năng rà soát hoặc sử dụng câu chuyện demo Chapter 4.
- Mâu thuẫn thiết kế ảnh hưởng tới prototype đã được xử lý.
- Definition of Done và các kiểm tra trực quan cần thiết có bằng chứng.

Điều kiện để chuyển sang **Ready with retained TBDs**:

- Human Review hoàn tất cho toàn bộ lựa chọn UI.
- Mỗi TBD còn lại được con người chọn `Keep as TBD`, có lý do và ảnh hưởng rõ.
- Các TBD được giữ lại không bị trình bày như chức năng đã có hoặc business rule
  đã xác nhận.
- Traceability và bằng chứng review đầy đủ.

## 14. Việc cần làm sau review

1. Người dùng/người review tái duyệt C4-HDR-002, C4-HDR-005, C4-HDR-008 và
   C4-HDR-010 dựa trên revision đã ghi; chỉ họ mới quyết định Approved/Rejected
   hoặc yêu cầu sửa tiếp.
2. Quyết định C4-HDR-020 sau khi xem bằng chứng hiện có; nếu screen reader là
   điều kiện bắt buộc, thực hiện và lưu bằng chứng trước khi duyệt.
3. Giữ C4-HDR-021 đến C4-HDR-032 là TBD với lý do/phạm vi đã ghi; chỉ mở lại
   khi có căn cứ nghiệp vụ cho giai đoạn sau.
4. Cân nhắc cập nhật `COURSE_PROGRESS.md` trong một yêu cầu riêng để xử lý
   C4-CONFLICT-01; không gọi prototype là hành vi production.
5. Chạy lại readiness assessment sau khi không còn mục Pending.
6. Chỉ đánh dấu checklist Human Review `[x]` khi Definition of Done có đủ bằng
   chứng; không dùng việc tạo ba hồ sơ hoặc build PASS làm điều kiện duy nhất.

