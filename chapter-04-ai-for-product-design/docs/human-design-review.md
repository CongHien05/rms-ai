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

Ngày 2026-11-03, người dùng phê duyệt trực tiếp qua hội thoại năm đề xuất còn
Pending dựa trên báo cáo kỹ thuật. Phê duyệt này hoàn tất quyết định thiết kế,
nhưng không được diễn giải là người dùng đã trực tiếp chạy QA hoặc nghiệm thu
production; screen-reader test vẫn `NOT RUN`.

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
- Giai đoạn B và final re-review ngày 2026-10-31 đã thực hiện visual QA và kiểm
  thử bàn phím bằng trình duyệt thật; kết quả và giới hạn được ghi tại mục 12.
  Không có screen-reader test.
- Các nội dung chưa được thực thi vẫn ghi `NOT RUN` hoặc `NOT VERIFIED`, không
  được suy diễn là `PASS`.

## 3. Baseline được rà soát

| Thuộc tính | Giá trị |
| --- | --- |
| Repository | `https://github.com/CongHien05/rms-ai.git` |
| Nhánh | `main` |
| Baseline commit khi bắt đầu Giai đoạn B | `1fa4d47` — `Merge pull request #20 from CongHien05/feat/add-three-role-workspaces` |
| HEAD tại final re-review | `3d9ae40` — `end day`; đã chứa các revision Giai đoạn B và bản sửa responsive |
| Working tree khi bắt đầu final re-review | Clean; `git status --short`, `git diff --check` và `git diff --stat` không có output |
| Ngày AI chuẩn bị hồ sơ | 2026-10-25 |
| Ngày ghi nhận quyết định Giai đoạn B | 2026-10-26 |
| Ngày final technical re-review | 2026-10-31 |
| Ngày final human approval | 2026-11-03 |
| Ngày close-out validation | 2026-11-03 |
| Người review | Người dùng xác nhận qua hội thoại; danh tính định danh chưa ghi nhận |
| Provenance của 27 quyết định trước | User-provided, AI-assisted delegated design review decisions |
| Provenance của 5 phê duyệt cuối | Explicit user approval of AI-assisted design recommendations, based on reported technical review; screen-reader testing not performed. |
| Chữ ký / biên bản review trực tiếp | Không có |
| Trạng thái Human Review | Hoàn tất ở mức thiết kế: 20 Approved, 0 Pending, 12 Keep as TBD |

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
| Luồng và wireframe chính của PM | `[x]` | `pm-risk-ui-design.md`, `resource-recommendation-ui-design.md`, `what-if-simulation-ui-design.md` | Có tài liệu cho chuỗi Risk → Recommendation → Simulation → Decision | Bốn revision đã được người dùng phê duyệt | Có |
| Loading, empty, invalid và missing data | `[x]` | Các ma trận trạng thái trong tài liệu UI; component có trạng thái rỗng/không khả dụng | Các trạng thái quan trọng đã được xem xét ở mức thiết kế | Prototype không hiện thực đầy đủ loading/error/retry | Có đủ bằng chứng “đã xem xét”; mức thực thi ghi Not verified |
| Traceability PRD/US/AC | `[x]` | Bảng truy vết trong tài liệu UI và ma trận review mới | US-01 đến US-07 và các AC liên quan có thể đối chiếu | Một số lựa chọn UI không có căn cứ trực tiếp và phải giữ đúng nhãn đề xuất | Có đủ bằng chứng chuẩn bị cho review |
| Frontend prototype | `[x]` | `frontend/src/App.tsx`, component PM/HR/DEV và QA trình duyệt Giai đoạn B | Prototype giới hạn tồn tại; đã kiểm tra ở 1440/1280/1024/768 px | Screen reader chưa chạy; năm trạng thái simulation chưa hiện thực đầy đủ | Có ở mức prototype; không phải production |
| Workspace PM, HR, DEV | `[x]` | `three-role-workspace-ui-design.md`, `RolePreview.tsx`, `AppShell.tsx`, component HR/DEV | Ba workspace và Role Preview tồn tại | Auth/RBAC và liên kết dữ liệu vẫn TBD đúng chủ đích | Có ở mức trình bày prototype |
| Human Design Review | `[x]` | Decision Register, Traceability, final human approval và kết quả QA | Đã ghi nhận 20 Approved, 0 Pending, 12 Keep as TBD | Screen reader `NOT RUN`; 12 TBD được giữ có chủ đích | **Có — Ready with retained TBDs** |

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

- C4-HDR-002, C4-HDR-005, C4-HDR-008, C4-HDR-010 và C4-HDR-020 đã được người
  dùng phê duyệt ngày 2026-11-03 dựa trên báo cáo kỹ thuật.
- Giữ C4-HDR-021 đến C4-HDR-032 là `Keep as TBD` cho tới khi có căn cứ nghiệp
  vụ; không dùng prototype làm nguồn yêu cầu thay thế.
- Quyết định C4-HDR-020 dựa trên bằng chứng visual/keyboard/DOM hiện có. AGENTS
  và GUIDELINE không yêu cầu screen-reader test như điều kiện bắt buộc; tiếp tục
  ghi `NOT RUN` và khuyến nghị thực hiện ở Chapter 8 hoặc phạm vi accessibility.
- Có thể cập nhật `COURSE_PROGRESS.md` trong phạm vi riêng; độ lệch lịch sử này
  không chặn close-out vì artifact hiện hành và baseline đã được xác minh.

## 8. Mâu thuẫn và khoảng trống

### C4-CONFLICT-01 — Trạng thái workspace ba vai trò

- `COURSE_PROGRESS.md`, mục **Mốc cuối tuần hiện tại**, nói workspace DEV/PM/HR
  là định hướng tuần sau và chưa được triển khai trong tác vụ đó.
- `chapter-04-ai-for-product-design/README.md`, mục **Tiến độ**, và commit
  `1fa4d47` cho thấy thiết kế/prototype ba vai trò đã được merge sau đó.
- Frontend hiện có `RolePreview`, `AppShell`, HR workspace và DEV workspace.
- Phân loại: độ lệch trạng thái tài liệu, không phải mâu thuẫn nghiệp vụ.
- Ảnh hưởng: `COURSE_PROGRESS.md` không còn phản ánh baseline mới nhất.
- Xử lý close-out: ghi nhận là độ lệch lịch sử không chặn thiết kế; không sửa
  ngoài bốn file close-out.

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
- Không có chữ ký hoặc reviewer identity định danh. Người dùng xác nhận năm phê
  duyệt cuối qua hội thoại; không suy diễn thành trực tiếp thực hiện QA.
- Không có quy tắc nghiệp vụ mới nào được phép suy ra để lấp TBD-01 đến TBD-12.

## 9. Danh mục quyết định Human Review

Danh mục đầy đủ nằm trong
[`human-review-decision-register.md`](human-review-decision-register.md).

| Nhóm | Review ID | Số mục | Trạng thái |
| --- | --- | ---: | --- |
| PM — Tổng quan và Rủi ro | C4-HDR-001 đến C4-HDR-005 | 5 | 5 Approved |
| PM — Recommendation, Simulation, Decision | C4-HDR-006 đến C4-HDR-012 | 7 | 7 Approved |
| HR | C4-HDR-013 đến C4-HDR-014 | 2 | 2 Approved |
| DEV | C4-HDR-015 đến C4-HDR-016 | 2 | 2 Approved |
| Cross-role | C4-HDR-017 đến C4-HDR-020 | 4 | 4 Approved |
| Business/Product TBD | C4-HDR-021 đến C4-HDR-032 | 12 | 12 Keep as TBD |
| **Tổng** |  | **32** | **20 Approved; 0 Pending; 12 Keep as TBD; 0 Rejected** |

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
| Reviewer | Người dùng xác nhận qua hội thoại; danh tính định danh chưa ghi nhận |
| Initial decision recording date | 2026-10-26 |
| Final human approval date | 2026-11-03 |
| Close-out validation date | 2026-11-03 |
| Prior 27 decisions provenance | User-provided, AI-assisted delegated design review decisions |
| Final five approvals provenance | Explicit user approval of AI-assisted design recommendations, based on reported technical review; screen-reader testing not performed. |
| Direct human visual QA / signature | Không có; không được suy diễn từ bộ quyết định |
| Số mục Approved | 20 |
| Số mục Rejected | 0 |
| Số mục Keep as TBD | 12 |
| Số mục Pending | 0 |

Quyết định được ghi theo Review ID trong Decision Register. `Approved` chỉ là
quyết định thiết kế, không phải requirement `ĐÃ XÁC NHẬN`,
kiểm thử production hoặc nghiệm thu của Product Owner.

## 12. Verification evidence

| Hạng mục | Kết quả | Bằng chứng / giới hạn |
| --- | --- | --- |
| Đối chiếu tài liệu PRD/US/AC/UI | PASS | Rà soát tĩnh các nguồn liệt kê ở mục 4 |
| Đối chiếu component Frontend | PASS | Rà soát tĩnh `App.tsx`, App Shell, PM/HR/DEV và mock data |
| Visual QA tại 1440/1280/1024/768 | PASS với giới hạn | Chạy lại bằng trình duyệt thật ngày 2026-10-31 trên Role Preview, PM Overview, Risk Detail và luồng Recommendation → Simulation → Decision. Không thấy tràn ngang, chồng lấp, mất CTA/TBD hoặc nhãn bước PM. Đây không phải review trực tiếp của người dùng. |
| Lỗi responsive phát hiện và sửa | PASS | Ở 1024 px, nhãn cuối của `.context-flow` từng bị cắt; giảm connector width/margin trong `frontend/src/App.css`, sau đó xác minh `scrollWidth === clientWidth` cho context flow tại 1024 và 768 px. |
| Kiểm thử bàn phím | PASS | Chạy lại Tab, Shift+Tab, Enter và Space; focus-visible quan sát được, thứ tự focus tiến/lùi hợp lý và không gặp keyboard trap trong luồng đã kiểm tra. |
| Accessibility qua browser/DOM | PASS với giới hạn | AX tree và DOM cho thấy semantic button/nav/main, một `h1`, các heading có thứ bậc và tên điều khiển; `aria-current="page"` ở nav và `aria-current="step"` ở bước hiện tại; trạng thái không chỉ truyền đạt bằng màu. Không thay thế screen-reader test. |
| Cross-role PM → HR → DEV → PM | PASS | Thao tác thật cho thấy mỗi role mở đúng workspace; quay lại PM mở `Tổng quan vận hành`, không còn context flow hoặc `Ứng viên A`. Role Preview không được gọi Login/Logout. |
| C4-HDR-012 Accept / Reject | PASS | Cả hai nhánh được thao tác trong trình duyệt. Accept chỉ ghi quyết định trong bản mẫu và nói phân bổ thật chưa thay đổi; Reject nói phương án không được áp dụng; không có `Applied Successfully`. |
| C4-HDR-019 state reset | PASS | Kiểm tra bằng thao tác cross-role và đối chiếu tĩnh state trong `App.tsx`; candidate/project/decision state không được mang sang role khác và PM quay về điểm bắt đầu hợp lệ. |
| Screen reader test | NOT RUN | Môi trường không cung cấp phiên screen reader; không ghi PASS hoặc thay thế bằng AX tree. |
| Hành vi production/API/data | NOT APPLICABLE | Ngoài phạm vi Chapter 4 và chưa được triển khai |

### 12.1 Targeted revision summary

| Review ID | Revision đã thực hiện | File chính | Trạng thái sau sửa |
| --- | --- | --- | --- |
| C4-HDR-002 | Đổi nhãn dự án và hoạt động thành dữ liệu minh họa/chưa kết nối; nói rõ không phải ưu tiên vận hành và quy tắc/nguồn vẫn TBD | `OperationsOverview.tsx`, `operations-overview-ui-design.md` | Approved 2026-11-03 |
| C4-HDR-005 | Trạng thái không thể đánh giá không bị diễn giải là Low Risk; CTA được gọi là bước prototype và điều kiện cho phép/khóa vẫn TBD | `ProjectRiskDetail.tsx`, `pm-risk-ui-design.md` | Approved 2026-11-03 |
| C4-HDR-008 | Phân biệt ứng viên với phương án phân bổ hoàn chỉnh; `candidateId` chỉ giữ ngữ cảnh minh họa | `ResourceRecommendationView.tsx`, `WhatIfSimulationView.tsx`, `resource-recommendation-ui-design.md` | Approved 2026-11-03 |
| C4-HDR-010 | Gọi kết quả là minh họa/placeholder; ghi rõ Ready và Success có prototype, còn Loading/Missing/Failure chỉ có trong thiết kế | `WhatIfSimulationView.tsx`, `what-if-simulation-ui-design.md` | Approved 2026-11-03 |

Revision không tạo API, simulation engine, matching rule, allocation payload
hoặc dữ liệu production. Bốn revision đã được người dùng phê duyệt ở phạm vi
lựa chọn thiết kế; các TBD liên quan vẫn được giữ nguyên.

### 12.2 Final re-review summary

| Review ID | Evidence | Findings | Recommendation | Human Decision | Status |
| --- | --- | --- | --- | --- | --- |
| C4-HDR-002 | Microcopy tài liệu/prototype; browser QA 1440/1280/1024/768 | Dữ liệu được gọi là minh họa; activity không phải sự kiện thật; quy tắc chọn và nguồn vẫn TBD | Approve proposed UI | Approve proposed UI | Approved |
| C4-HDR-005 | Risk unavailable screen và CTA trong browser | Không diễn giải thành Low Risk/an toàn; CTA chỉ điều hướng prototype; cho phép/khóa vẫn TBD | Approve proposed UI | Approve proposed UI | Approved |
| C4-HDR-008 | Candidate list và Simulation Ready trong browser | Candidate chỉ là ngữ cảnh; không phải allocation scenario hợp lệ; cấu trúc/ràng buộc vẫn TBD | Approve proposed UI | Approve proposed UI | Approved |
| C4-HDR-010 | Ma trận trạng thái thiết kế; Ready/Success quan sát bằng browser | Ready/Success có prototype; Loading/Missing/Failure là design-only; không có simulation engine | Approve proposed UI | Approve proposed UI | Approved |
| C4-HDR-020 | Responsive, keyboard, DOM/AX và state-reset QA | QA công cụ đạt trong phạm vi đã nêu; screen reader `NOT RUN`, không phải điều kiện bắt buộc trong AGENTS/GUIDELINE | Approve proposed UI và giữ giới hạn kiểm thử | Approve proposed UI | Approved |

## 13. Chapter 4 Readiness Assessment

### Kết luận: **Ready with retained TBDs**

Lý do:

- 32/32 Review ID có quyết định hợp lệ: 20 `Approved`, 12 `Keep as TBD`, không
  còn `Pending` hoặc `Rejected`.
- Người dùng phê duyệt năm lựa chọn cuối ngày 2026-11-03 dựa trên báo cáo kỹ
  thuật; approval không được trình bày như trực tiếp chạy QA.
- Visual, keyboard và browser/DOM accessibility có bằng chứng phù hợp phạm vi;
  screen reader vẫn `NOT RUN` và được giữ như giới hạn kiểm chứng.
- Traceability PRD/User Story/Acceptance Criteria đầy đủ; các trạng thái quan
  trọng đã được xem xét ở mức thiết kế/prototype.
- C4-CONFLICT-01 là độ lệch báo cáo tiến độ lịch sử, không phải mâu thuẫn thiết
  kế hoặc nghiệp vụ chặn close-out.
- Checklist Human Design Review trong Chapter 4 README đủ điều kiện chuyển `[x]`.

TBD-01 đến TBD-12 được chủ động giữ lại với lý do và phạm vi ảnh hưởng đã ghi.
Chúng không chặn khả năng rà soát thiết kế hiện tại, nhưng phải được xử lý trước
khi triển khai các chức năng phụ thuộc.

Điều kiện để chuyển sang **Ready**:

- Tất cả lựa chọn UI bắt buộc có quyết định và bằng chứng con người.
- Không còn TBD chặn khả năng rà soát hoặc sử dụng câu chuyện demo Chapter 4.
- Mâu thuẫn thiết kế ảnh hưởng tới prototype đã được xử lý.
- Definition of Done và các kiểm tra trực quan cần thiết có bằng chứng.

Các điều kiện **Ready with retained TBDs** đã được đáp ứng:

- Human Review hoàn tất cho toàn bộ lựa chọn UI.
- Mỗi TBD còn lại được con người chọn `Keep as TBD`, có lý do và ảnh hưởng rõ.
- Các TBD được giữ lại không bị trình bày như chức năng đã có hoặc business rule
  đã xác nhận.
- Traceability và bằng chứng review đầy đủ.

## 14. Việc chuyển sang giai đoạn sau

1. Giữ C4-HDR-021 đến C4-HDR-032 là TBD với lý do/phạm vi đã ghi; chỉ mở lại
   khi có căn cứ nghiệp vụ ở giai đoạn phù hợp.
2. Giữ screen-reader test là `NOT RUN`; khuyến nghị kiểm thử chuyên sâu ở
   Chapter 8 hoặc phạm vi accessibility riêng.
3. Có thể cập nhật `COURSE_PROGRESS.md` trong một yêu cầu riêng để xử lý độ lệch
   lịch sử; không gọi prototype là hành vi production.
4. Chapter 4 close-out chỉ xác nhận sản phẩm thiết kế; không xác nhận AI/ML,
   API, database, Auth/RBAC, matching, simulation hoặc allocation production.

