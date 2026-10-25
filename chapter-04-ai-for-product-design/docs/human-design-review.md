# Hồ sơ Human Design Review — Chapter 4

## 1. Mục đích

Tài liệu này chuẩn bị hồ sơ rà soát thiết kế có con người phê duyệt cho
Chapter 4 của RMS-AI. Hồ sơ tổng hợp bằng chứng hiện có, phát hiện của AI,
những lựa chọn giao diện cần con người quyết định và các TBD cần được chủ động
giữ lại hoặc chuyển sang giai đoạn sau.

Việc tạo hồ sơ này **không phải** bằng chứng rằng Human Design Review đã hoàn
tất. AI không đóng vai người phê duyệt và không chuyển một lựa chọn giao diện
hoặc TBD thành yêu cầu sản phẩm đã xác nhận.

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

- Đây là rà soát tài liệu và mã nguồn tĩnh tại phạm vi prototype.
- Không xác nhận hành vi production, tích hợp dữ liệu, API, database, AI/ML,
  xác thực, phân quyền hoặc thay đổi phân bổ thật.
- Không có phiên kiểm thử trực quan trong trình duyệt hoặc bằng chứng kiểm thử
  bàn phím/đọc màn hình được lưu trong repository tại thời điểm chuẩn bị hồ sơ.
- Các nội dung chưa có bằng chứng thực thi được ghi `Not verified`, không được
  suy diễn là `PASS`.

## 3. Baseline được rà soát

| Thuộc tính | Giá trị |
| --- | --- |
| Repository | `https://github.com/CongHien05/rms-ai.git` |
| Nhánh | `main` |
| Commit | `1fa4d47` — `Merge pull request #20 from CongHien05/feat/add-three-role-workspaces` |
| Working tree trước khi chuẩn bị hồ sơ | Sạch |
| Ngày AI chuẩn bị hồ sơ | 2026-10-25 |
| Người review | Chưa ghi nhận |
| Ngày Human Review | Chưa ghi nhận |
| Bằng chứng quyết định của con người | Chưa có |
| Trạng thái Human Review | Pending |

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
| Luồng và wireframe chính của PM | `[x]` | `pm-risk-ui-design.md`, `resource-recommendation-ui-design.md`, `what-if-simulation-ui-design.md` | Có tài liệu cho chuỗi Risk → Recommendation → Simulation → Decision | Human approval chưa có | Có đủ bằng chứng chuẩn bị cho review; chưa phải phê duyệt |
| Loading, empty, invalid và missing data | `[x]` | Các ma trận trạng thái trong tài liệu UI; component có trạng thái rỗng/không khả dụng | Các trạng thái quan trọng đã được xem xét ở mức thiết kế | Prototype không hiện thực đầy đủ loading/error/retry | Có đủ bằng chứng “đã xem xét”; mức thực thi ghi Not verified |
| Traceability PRD/US/AC | `[x]` | Bảng truy vết trong tài liệu UI và ma trận review mới | US-01 đến US-07 và các AC liên quan có thể đối chiếu | Một số lựa chọn UI không có căn cứ trực tiếp và phải giữ đúng nhãn đề xuất | Có đủ bằng chứng chuẩn bị cho review |
| Frontend prototype | `[x]` | `frontend/src/App.tsx` và component PM/HR/DEV | Prototype giới hạn tồn tại trong mã nguồn | Không có bằng chứng visual QA trong repository | Có ở mức prototype; visual QA Not verified |
| Workspace PM, HR, DEV | `[x]` | `three-role-workspace-ui-design.md`, `RolePreview.tsx`, `AppShell.tsx`, component HR/DEV | Ba workspace và Role Preview tồn tại | Auth/RBAC và liên kết dữ liệu vẫn TBD đúng chủ đích | Có ở mức trình bày prototype |
| Human Design Review | `[ ]` | Chưa có reviewer, ngày review hoặc quyết định con người | Chưa thể xác nhận hoàn tất | Toàn bộ 32 Review ID đang Pending | **Không** |

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
   `role="status"`/`role="note"` và `focus-visible`. Tuy nhiên tính đúng khi sử
   dụng bằng bàn phím hoặc công cụ hỗ trợ chưa có bằng chứng kiểm thử thực tế.
7. Prototype hiện chỉ mô phỏng trạng thái thành công cục bộ; loading, failure,
   retry, stale result và apply failure mới được xem xét trong tài liệu, chưa
   được xác minh trong UI chạy thật.

### 7.2 AI recommendations

- Phê duyệt hoặc yêu cầu chỉnh sửa riêng từng lựa chọn UI C4-HDR-001 đến
  C4-HDR-020; không dùng một quyết định chung để ngầm duyệt mọi màn hình.
- Với C4-HDR-021 đến C4-HDR-032, ưu tiên `Keep as TBD` nếu quyết định thuộc
  chapter sau hoặc production. Chỉ mở lại yêu cầu khi nhóm có căn cứ nghiệp vụ.
- Thực hiện một phiên review trực quan có ghi bằng chứng tại 1440px, 1280px,
  1024px và 768px, cùng kiểm tra bàn phím cơ bản, trước khi chuyển Chapter 4
  sang `Ready` hoặc `Ready with retained TBDs`.
- Giải quyết hai độ lệch tài liệu C4-CONFLICT-01 và C4-CONFLICT-02 bằng quyết
  định của con người; không dùng prototype làm nguồn yêu cầu thay thế.

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

- `operations-overview-ui-design.md`, mục **Quyết định ở mức bản mẫu**, còn ghi
  điều hướng toàn cục gồm Tổng quan, Dự án, Nhân sự và Trung tâm rủi ro.
- `three-role-workspace-ui-design.md`, mục **Không gian làm việc PM**, và
  `frontend/src/App.tsx` chỉ có Tổng quan, Dự án và Trung tâm rủi ro cho PM;
  Nhân sự thuộc HR workspace.
- Phân loại: mâu thuẫn thiết kế/kiến trúc thông tin.
- Ảnh hưởng: người review có thể hiểu sai phạm vi điều hướng PM.
- Xử lý trong lượt này: đưa vào C4-HDR-013/C4-HDR-018 để con người quyết định;
  chưa sửa tài liệu nguồn khi chưa có quyết định.

### Khoảng trống xác minh

- Không có ảnh chụp hoặc biên bản review tại các breakpoint được nêu.
- Không có biên bản kiểm thử keyboard, screen reader hoặc accessibility audit.
- Không có bằng chứng con người đã xem xét từng GIAO DIỆN ĐỀ XUẤT/TBD.
- Không có quy tắc nghiệp vụ mới nào được phép suy ra để lấp TBD-01 đến TBD-12.

## 9. Danh mục cần con người phê duyệt

Danh mục đầy đủ nằm trong
[`human-review-decision-register.md`](human-review-decision-register.md).

| Nhóm | Review ID | Số mục | Trạng thái |
| --- | --- | ---: | --- |
| PM — Tổng quan và Rủi ro | C4-HDR-001 đến C4-HDR-005 | 5 | Pending |
| PM — Recommendation, Simulation, Decision | C4-HDR-006 đến C4-HDR-012 | 7 | Pending |
| HR | C4-HDR-013 đến C4-HDR-014 | 2 | Pending |
| DEV | C4-HDR-015 đến C4-HDR-016 | 2 | Pending |
| Cross-role | C4-HDR-017 đến C4-HDR-020 | 4 | Pending |
| Business/Product TBD | C4-HDR-021 đến C4-HDR-032 | 12 | Pending |
| **Tổng** |  | **32** | **32 Pending** |

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
| Review date | Chưa ghi nhận |
| Decision evidence | Chưa có |
| Số mục Approved | 0 |
| Số mục Rejected | 0 |
| Số mục Keep as TBD | 0 |
| Số mục Pending | 32 |

Quyết định phải được ghi theo Review ID trong Decision Register. Im lặng, việc
AI tạo tài liệu hoặc việc prototype đã tồn tại không phải bằng chứng phê duyệt.

## 12. Verification evidence

| Hạng mục | Kết quả | Bằng chứng / giới hạn |
| --- | --- | --- |
| Đối chiếu tài liệu PRD/US/AC/UI | PASS | Rà soát tĩnh các nguồn liệt kê ở mục 4 |
| Đối chiếu component Frontend | PASS | Rà soát tĩnh `App.tsx`, App Shell, PM/HR/DEV và mock data |
| Visual QA tại 1440/1280/1024/768 | NOT RUN | Không có phiên trình duyệt được ghi nhận trong lượt chuẩn bị hồ sơ |
| Kiểm thử bàn phím | NOT RUN | Chỉ xác nhận tĩnh semantic/focus CSS; chưa có bằng chứng thao tác |
| Screen reader/accessibility audit | NOT RUN | Không có bằng chứng trong repository |
| Hành vi production/API/data | NOT APPLICABLE | Ngoài phạm vi Chapter 4 và chưa được triển khai |

## 13. Chapter 4 Readiness Assessment

### Kết luận: **Not ready**

Lý do:

- Chưa có reviewer, ngày review hoặc bằng chứng quyết định của con người.
- Cả 32 Review ID đang `Pending`.
- Hai độ lệch tài liệu chưa có quyết định xử lý.
- Responsive và accessibility mới có bằng chứng thiết kế/mã nguồn tĩnh, chưa có
  bằng chứng review giao diện thực tế.
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

1. Người review phản hồi theo Review ID trong Decision Register.
2. Ghi reviewer, ngày, lựa chọn, lý do và bằng chứng cho từng quyết định.
3. Với `Request revision`, giữ trạng thái `Pending` và mô tả thay đổi mong muốn.
4. Chỉ cập nhật tài liệu thiết kế/prototype sau khi có quyết định cụ thể.
5. Cập nhật ma trận traceability và chạy lại readiness assessment.
6. Chỉ đánh dấu checklist Human Review `[x]` khi Definition of Done có đủ bằng
   chứng; không dùng việc tạo ba hồ sơ làm điều kiện duy nhất.

