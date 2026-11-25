# Đặc tả tính năng — Authentication & RBAC

**Feature Branch** `codex/002-auth-rbac`

**Ngày tạo** 2026-11-26

**Trạng thái** D1–D3 APPROVED · Đặc tả dùng cho Gate 2

**Đầu vào** Milestone 002 chuyển Role Preview sang xác thực và phân quyền thực cho PM, HR và DEV. Baseline `75404caf5de104dd0e1fb15e232e9bd4f2101776`, gồm PR #22, PR #23 và Constitution 1.0.0.

## Mục tiêu, phạm vi và căn cứ

Bảo vệ thao tác và dữ liệu hiện có bằng danh tính đã xác minh và quyền do Backend thực thi. Giữ luồng PM Project → Sprint → Task và Risk → Resource Recommendation → What-if, quyền HR đối với dữ liệu nguồn lực, cùng workspace DEV chỉ xem dữ liệu của mình khi dữ liệu đó có căn cứ. Phạm vi What-if giữ mức **PROPOSED DEMO**. Các quyết định nghiệp vụ bên dưới có nguồn tại [User Stories](../../chapter-03-ai-for-requirements-product-analysis/docs/user-stories.md#quyết-định-authentication--rbac-cho-milestone-002-2026-11-26).

| Nguồn | Kết quả đối chiếu |
| --- | --- |
| [PRD](../../chapter-03-ai-for-requirements-product-analysis/docs/PRD.md#người-dùng-mục-tiêu), [User Stories](../../chapter-03-ai-for-requirements-product-analysis/docs/user-stories.md#quyết-định-chưa-xác-định--tbd), [Acceptance Criteria](../../chapter-03-ai-for-requirements-product-analysis/docs/acceptance-criteria.md), [Initial API Contracts §16](../../chapter-03-ai-for-requirements-product-analysis/docs/initial-api-contracts.md#16-trạng-thái-phân-quyền) | **CONFIRMED** về ba workspace. D1–D3 chốt phần nghiệp vụ của `TBD-11` trong 002, cập nhật so với Initial API Contracts. `TBD-12` về thao tác ghi và simulation của DEV nằm ngoài mốc. PM Create Project/Sprint/Task và sửa Task là nghiệp vụ có trong baseline; D2 giới hạn theo người phụ trách. |
| [Thiết kế Login và workspace](../../chapter-04-ai-for-product-design/docs/three-role-workspace-ui-design.md#6-giao-diện-đăng-nhập-đề-xuất), [quyết định review Chapter 4](../../chapter-04-ai-for-product-design/docs/human-review-decision-register.md#8-chi-tiết-quyết-định--cross-role) | Login email/mật khẩu là **PROPOSED UI**. C4-HDR-017–019 duyệt bộ chọn, App Shell và đặt lại state ở phạm vi prototype. D1–D3 cập nhật phần nghiệp vụ danh tính và quyền đã để mở ở C4-HDR-031. Quyền ghi DEV ở C4-HDR-032 nằm ngoài 002. |
| [Kiến trúc B1](../../chapter-05-ai-for-software-design-architecture/docs/current-state-architecture-b1.md), [Phase B](../../chapter-05-ai-for-software-design-architecture/docs/chapter-05-phase-b-plan.md), [mô hình dữ liệu](../../chapter-03-ai-for-requirements-product-analysis/docs/database-design.md#91-employee), [roadmap đã duyệt](../../chapter-09-ai-technical-documentation/docs/spec-kit-adoption-audit.md#4-roadmap-mvp-đã-được-phê-chuẩn), [Constitution](../../.specify/memory/constitution.md) | B1 là snapshot chờ review. Quan hệ Employee–Project ở mức khái niệm, `authUserReference` là `TBD`. Mốc 2 yêu cầu phê duyệt danh tính và quyền theo đối tượng trước khi thiết kế kỹ thuật. |
| Mã nguồn tại baseline | [App.tsx](../../frontend/src/App.tsx) chọn role phía trình duyệt, kể cả khi mở `#projects` hoặc `#project/:id`. [DEV workspace](../../frontend/src/dev-workspace/DevWorkspaceViews.tsx) hiển thị trạng thái tĩnh. [AppModule](../../backend/src/app.module.ts), [bootstrap](../../backend/src/main.ts) và controller trong ma trận chưa có Auth/RBAC. [Project](../../backend/src/projects/project.entity.ts), [Task](../../backend/src/tasks/task.entity.ts) và [Employee](../../backend/src/employees/employee.entity.ts) chưa có quan hệ xác nhận PM quản lý Project, DEV có Task hay Account liên kết Employee. [Vite](../../frontend/vite.config.ts) bỏ prefix `/api` trước khi chuyển tiếp. |
| [What-if 001](../001-what-if-simulation/contracts/what-if-api.md), [minh chứng Chapter 8](../../chapter-08-ai-software-testing/README.md#kiểm-chứng-what-if-001-2026-11-25) | Contract và bằng chứng lịch sử ngày 2026-11-25 xác nhận lát cắt chỉ đọc. `recommendationContext` xác minh ngữ cảnh của phương án. FastAPI hiện có inference qua [RiskClient](../../backend/src/projects/risk-client.ts), cập nhật so với snapshot health-only cũ. |

**Ngoài phạm vi** OAuth/SSO, MFA, đăng ký công khai, Forgot Password qua email, quản trị tài khoản nâng cao, CRUD bổ sung, giao việc thật, ProjectAllocation, PM Decision Workflow, Apply Allocation, huấn luyện AI và thiết kế lại dashboard.

## Clarifications

### Session 2026-11-26

- Q: Ai cấp tài khoản, mỗi tài khoản có bao nhiêu role và quản trị tối thiểu gồm gì? → A: D1 APPROVED. Người vận hành cấp, thu hồi và cấp lại thông tin đăng nhập qua quy trình nội bộ. Mỗi tài khoản có đúng một role PM, HR hoặc DEV. Không tự đăng ký, tự chọn role hay mở quản trị nâng cao.
- Q: PM quản lý Project nào và ai cấp quyền đối với Project mới hoặc đã có? → A: D2 APPROVED. Mỗi Project có một PM phụ trách, một PM có thể phụ trách nhiều Project. Backend gán người tạo cho Project mới. Người vận hành ánh xạ Project cũ theo danh sách đã duyệt. Project chưa ánh xạ bị từ chối mặc định. Áp dụng ở route trực tiếp và qua tài nguyên con.
- Q: User Account liên kết Employee thế nào và DEV xem ngữ cảnh công việc nào? → A: D3 APPROVED. Mỗi tài khoản DEV liên kết duy nhất với một Employee đã xác minh, được Backend xác định từ phiên. DEV xem hồ sơ, kỹ năng của mình và ngữ cảnh được cấp. Khi chưa có nguồn giao việc thật, hiển thị thiếu ngữ cảnh. Recommendation và What-if không cấp quyền Project.

## User Scenarios & Testing

### US1 — Đăng nhập và quản lý phiên (P1)

**Truy vết** US-07, AC-US-07-01, Constitution XI và thiết kế Login Chapter 4. Ưu tiên P1 vì mọi workspace cần danh tính do Backend xác minh. Có thể nghiệm thu độc lập với tài khoản thử đã cấp quyền cho cả ba vai trò.

| AC | Điều kiện → thao tác → kết quả |
| --- | --- |
| 002-AC-01 | Tài khoản hợp lệ theo D1 → đăng nhập và tải lại trang khi phiên còn hiệu lực → Backend trả danh tính và vai trò hiện hành, giao diện hiển thị đúng workspace. Trong lúc chờ xác minh, dữ liệu bảo vệ chưa xuất hiện. |
| 002-AC-02 | Thông tin đăng nhập sai hoặc tài khoản không đủ điều kiện đăng nhập → gửi yêu cầu trong ngưỡng cho phép → nhận phản hồi chung `401`, không tiết lộ tài khoản có tồn tại, không tạo phiên sử dụng được. Khi chạm ngưỡng giới hạn thử, Backend từ chối tạm thời và thông báo thời gian chờ. |
| 002-AC-03 | Phiên thiếu, sai, hết hạn hoặc đã kết thúc → gọi API bảo vệ → `401`, không trả dữ liệu. Giao diện xóa dữ liệu workspace khỏi trạng thái hiện hành, đưa người dùng về Login và bỏ phản hồi chậm từ phiên cũ. |
| 002-AC-04 | Phiên hợp lệ → đăng xuất → Backend xác nhận kết thúc phiên, giao diện về Login và phiên cũ bị từ chối khi gọi API. Nếu chưa nhận được xác nhận do lỗi kết nối, giao diện che dữ liệu, báo chưa xác nhận và cho thử lại. |
| 002-AC-14 | Người vận hành có thông tin đã xác minh → cấp tài khoản, cấp lại thông tin đăng nhập hoặc thu hồi tài khoản → tài khoản có đúng một role và đáp ứng D3 nếu là DEV. Cấp lại hoặc thu hồi vô hiệu hóa mọi phiên trước đó. Sau cấp lại, thông tin cũ bị từ chối. Sau thu hồi, lần đăng nhập mới cũng nhận `401`. |
| 002-AC-16 | Trang ngoài origin tin cậy gửi yêu cầu đăng nhập, đăng xuất hoặc ghi dữ liệu bằng trình duyệt → Backend từ chối yêu cầu, không tạo/hủy phiên hoặc ghi dữ liệu. |

### US2 — PM sử dụng nghiệp vụ trong phạm vi dự án được cấp (P1)

**Truy vết** US-01/02/03/07, AC-US-01-01, AC-US-02-01/02, AC-US-03-01/02, AC-US-07-01/02, baseline PM và What-if 001. Ưu tiên P1 để bảo toàn luồng chính. Có thể nghiệm thu độc lập với hai tập dự án có phạm vi khác nhau theo D2 và tài khoản HR/DEV đối chứng.

| AC | Điều kiện → thao tác → kết quả |
| --- | --- |
| 002-AC-05 | PM đã xác thực → tạo/xem Project, tạo/xem Sprint, tạo/xem/sửa Task trong phạm vi → Backend gán người tạo khi tạo Project và chỉ liệt kê Project PM phụ trách. Các thao tác được cấp vẫn hoạt động. |
| 002-AC-06 | PM có quyền trên Project → dùng danh mục Skill, đánh giá Risk, yêu cầu Recommendation, chạy What-if với ứng viên hợp lệ → giữ hành vi, định danh, lỗi nghiệp vụ và kết quả hiện có. What-if chỉ tính giả định, đọc lại giờ trống và không thay đổi phân bổ hoặc dữ liệu nguồn. |
| 002-AC-07 | Phiên hợp lệ nhưng role sai hoặc đối tượng rõ ràng nằm ngoài phạm vi → gọi thẳng API trong ma trận, kể cả qua Sprint/Task lồng nhau hoặc cùng proof What-if hợp lệ → `403` với phản hồi chung và dừng trước khi trả dữ liệu đích, ghi thay đổi hoặc gọi downstream. |
| 002-AC-08 | Người dùng mở deep link hoặc đổi hash → Backend xác minh lại phiên và phạm vi qua yêu cầu dữ liệu → nếu được cấp, mở đúng màn hình; nếu nhận `401`, về Login; nếu nhận `403`, báo không có quyền, giữ phiên và cho quay về workspace được phép. Role Preview không cấp phiên hay quyền. |
| 002-AC-13 | Môi trường nghiệm thu có kiểm soát → kiểm tra health và luồng Risk từ bề mặt người dùng → health chỉ trả trạng thái, PM được cấp vẫn đánh giá Risk qua Backend, các vai trò người dùng không truy cập được bề mặt dự báo nội bộ. |
| 002-AC-15 | Bản sao dev có Project/Sprint/Task và dữ liệu HR từ baseline → nâng cấp và áp dụng một phần danh sách đã duyệt → mọi cột nghiệp vụ và ID ban đầu giữ nguyên, Project đã ánh xạ chỉ mở cho PM được gán, Project còn lại bị từ chối cả qua tài nguyên con. |

### US3 — HR sử dụng dữ liệu nguồn lực đã có (P2)

**Truy vết** US-05/07, AC-US-05-01/02/03/04 và AC-US-07-01. Có thể nghiệm thu độc lập với HR và một tài khoản PM hoặc DEV đối chứng.

| AC | Điều kiện → thao tác → kết quả |
| --- | --- |
| 002-AC-09 | HR đã xác thực → mở Nhân sự hoặc Kỹ năng → đọc danh sách và giờ trống theo tuần như baseline, phân biệt 0 giờ, thiếu dữ liệu và khác tuần. Các API tạo Employee, tạo Skill và gán Skill hiện có vẫn phục vụ HR với dữ liệu hợp lệ. |
| 002-AC-10 | Người dùng khác role → gọi trực tiếp nhóm API HR → chỉ nhận dữ liệu theo các quyền hẹp trong ma trận. Thao tác ngoài quyền bị `403` và dữ liệu nguồn lực giữ nguyên. |

### US4 — DEV xem dữ liệu của mình khi có (P2)

**Truy vết** US-06/07, AC-US-06-01 đến AC-US-06-05 và AC-US-07-01. Có thể nghiệm thu độc lập bằng hai DEV và dữ liệu đối chứng theo D3.

| AC | Điều kiện → thao tác → kết quả |
| --- | --- |
| 002-AC-11 | DEV có tài khoản liên kết theo D3 → mở workspace hoặc gọi bề mặt đọc cá nhân → Backend lấy Employee từ danh tính đăng nhập, chỉ trả hồ sơ và Skills của mình. Khi chưa có nguồn giao việc thật, workspace hiển thị thiếu ngữ cảnh và bề mặt đọc không trả Project/Sprint/Task. |
| 002-AC-12 | DEV có phiên hợp lệ → yêu cầu hồ sơ Employee khác, danh mục riêng của HR, dữ liệu công việc ngoài phạm vi hoặc hành động ghi/What-if → Backend từ chối bằng `403` trên route bảo vệ hiện có. Workspace DEV giữ các hành động chỉ xem; không sinh assignment hoặc dữ liệu mẫu để hiển thị như dữ liệu thực. |

### Edge Cases

- Phân biệt phiên bị từ chối (`401`), người dùng có phiên nhưng thiếu quyền (`403`) và lỗi nghiệp vụ cho yêu cầu đã qua kiểm tra quyền. `403` dùng phản hồi chung; `404` nghiệp vụ giữ nguyên khi caller đã được phép vào phạm vi mà đối tượng không tồn tại, ví dụ Task thiếu trong Sprint được cấp quyền.
- Nếu quyền hoặc phiên thay đổi giữa lúc mở màn và lúc gọi API, Backend kiểm tra quyền khi xử lý yêu cầu. Lần từ chối không tự gửi lại thao tác ghi sau đăng nhập. Dữ liệu hoặc phản hồi đang chờ của phiên cũ không hiển thị trong phiên tiếp theo.
- Nếu Task ID thuộc Sprint khác, áp dụng kiểm tra quan hệ cha–con và phạm vi Project tương ứng. ID do người dùng đưa vào không cấp quyền. Một proof qua được kiểm tra chữ ký vẫn cần phiên hợp lệ và đúng quyền Project.
- Tài khoản thiếu role hợp lệ hoặc tài khoản DEV thiếu liên kết đã xác minh không đủ điều kiện đăng nhập. Trạng thái thiếu ngữ cảnh chỉ áp dụng cho công việc của DEV đã xác thực.
- Project cũ chưa có quy tắc gán được duyệt hoặc Project/Sprint/Task chưa có quan hệ cung cấp cho DEV thì để ngoài phạm vi truy cập cho đến khi có căn cứ. Không dùng tên, email trùng nhau, tạo proposal hay mã proof để suy ra ownership hoặc assignment.

## Requirements

### Functional Requirements

| ID | Yêu cầu | Nghiệm thu |
| --- | --- | --- |
| FR-001 | Backend xác minh thông tin đăng nhập của User Account theo D1, giới hạn lượt đăng nhập và cung cấp danh tính/role hiện hành cho Frontend. Người vận hành cấp, cấp lại và thu hồi qua quy trình nội bộ. | 002-AC-01/02/14 |
| FR-002 | Backend xác minh phiên trên mọi route bảo vệ, quản lý hết hạn và kết thúc phiên khi đăng xuất. Cấp lại thông tin đăng nhập hoặc thu hồi tài khoản vô hiệu hóa mọi phiên của tài khoản. Giao diện xử lý `401` trên mọi luồng và loại state phiên cũ. | 002-AC-01/03/04/14 |
| FR-003 | Backend từ chối theo mặc định, đánh giá role và phạm vi trước khi trả dữ liệu đích hoặc chạy nghiệp vụ. Role phía client, hash và HMAC What-if không cấp quyền. Chặn yêu cầu ghi từ origin không tin cậy. | 002-AC-06/07/08/10/12/16 |
| FR-004 | Giao diện chờ Backend xác nhận danh tính rồi hiển thị workspace, điều hướng và capability theo quyền, xử lý `401` và `403` riêng khi dùng liên kết trực tiếp. Đăng nhập thật thay điểm vào Role Preview của ứng dụng dùng dữ liệu thật. | 002-AC-01/03/04/08 |
| FR-005 | Bảo toàn Project/Sprint/Task, Risk/Recommendation/What-if trong quyền PM được duyệt. Danh sách và truy cập qua ID đều áp dụng D2. | 002-AC-05/06/07/15 |
| FR-006 | Giữ các capability HR hiện có ở UI/API cho Employee, Skill, EmployeeSkill và báo cáo availability theo tuần đã có ở phạm vi demo. Không cấp quyền quản trị User Account theo role HR. | 002-AC-09/10 |
| FR-007 | DEV có quyền đọc dữ liệu tự thân đã xác minh, giới hạn dữ liệu công việc theo D3 và hiển thị trạng thái thiếu khi chưa có dữ liệu. Giữ mọi quyền ghi DEV thuộc TBD-12 ngoài milestone. | 002-AC-11/12 |
| FR-008 | Dữ liệu dev, cấu trúc response thành công và quy tắc nghiệp vụ hiện có được bảo toàn trong ranh giới quyền. What-if giữ chế độ chỉ đọc và xử lý proof/lỗi theo contract 001 sau bước phân quyền. | 002-AC-05/06/09/10/15 |
| FR-009 | Backend là điểm vào của người dùng cho Risk và giữ dự báo trực tiếp trong ranh giới nội bộ. Health check chỉ trả trạng thái dịch vụ. | 002-AC-06/07/13 |

### Ma trận Actor × Permission × Endpoint

Đường dẫn ghi theo NestJS; phía trình duyệt thêm `/api`. Ký hiệu `✓` là quyền theo role của mốc này, `—` là từ chối với phiên hợp lệ. D2 giới hạn dữ liệu Project theo PM phụ trách. Route bảo vệ trả `401` khi thiếu phiên hợp lệ.

| Endpoint | Quyền | PM | HR | DEV | Căn cứ |
| --- | --- | --- | --- | --- | --- |
| Đăng nhập, danh tính hiện hành, đăng xuất — bề mặt mới, tên route chốt ở plan | Tạo phiên trước khi có role; đọc danh tính hoặc kết thúc phiên của mình khi có phiên | D1 | D1 | D1 | US-07/AC-US-07-01 |
| Đọc hồ sơ và kỹ năng cá nhân — bề mặt mới | Backend xác định Employee từ phiên | — | — | D3 | AC-US-06-01, AC-US-07-03 |
| `GET /health` | Kiểm tra trạng thái dịch vụ, ngoài dữ liệu bảo vệ | Công khai | Công khai | Công khai | [AppController](../../backend/src/app.controller.ts) |
| `POST /projects` | Tạo Project, quyền trên Project mới theo D2 | D2 | — | — | [ProjectsController](../../backend/src/projects/projects.controller.ts), baseline PM |
| `GET /projects`, `GET /projects/:projectId` | Liệt kê/đọc Project theo người phụ trách | D2 | — | — | ProjectsController, D2 |
| `GET /projects/:projectId/sprints` | Đọc Sprint theo phạm vi Project | D2 | — | — | [SprintsController](../../backend/src/sprints/sprints.controller.ts), D2 |
| `POST /projects/:projectId/sprints` | Tạo Sprint trong Project được cấp | D2 | — | — | SprintsController |
| `GET /sprints/:sprintId/tasks` | Đọc Task theo Sprint → Project và phạm vi của Task | D2 | — | — | [TasksController](../../backend/src/tasks/tasks.controller.ts), D2 |
| `POST /sprints/:sprintId/tasks`, `PATCH /sprints/:sprintId/tasks/:taskId` | Tạo/sửa Task trong chuỗi Project → Sprint → Task được cấp | D2 | — | — | TasksController, TBD-12 |
| `POST /projects/:projectId/risk-assessments` | Đánh giá rủi ro trong Project được cấp | D2 | — | — | ProjectsController, US-01 |
| `POST /projects/:projectId/resource-recommendations` | Yêu cầu đề xuất trong Project được cấp | D2 | — | — | ProjectsController, US-02 |
| `POST /projects/:projectId/simulations` | Mô phỏng chỉ đọc trong Project được cấp | D2 | — | — | ProjectsController, US-03, What-if 001 |
| `GET /employees`, `GET /employees/availability` | Đọc danh bạ nguồn lực và availability theo tuần | — | ✓ | — | [EmployeesController](../../backend/src/employees/employees.controller.ts), US-05 |
| `POST /employees` | Tạo hồ sơ Employee | — | ✓ | — | EmployeesController, AC-US-05-02 |
| `GET /employees/:employeeId` | Đọc hồ sơ Employee | — | ✓ | — | EmployeesController, AC-US-05-01 |
| `GET /skills` | Đọc danh mục Skill cho HR và bộ chọn tiêu chí Recommendation của PM | ✓ | ✓ | — | [SkillsController](../../backend/src/skills/skills.controller.ts), [ProjectResourceRecommendations](../../frontend/src/projects/ProjectResourceRecommendations.tsx#L51) |
| `GET /skills/:skillId`, `POST /skills` | Đọc chi tiết/tạo Skill qua API hiện có | — | ✓ | — | SkillsController, US-05 |
| `GET /employees/:employeeId/skills` | Đọc Skills của Employee | — | ✓ | — | [EmployeeSkillsController](../../backend/src/employee-skills/employee-skills.controller.ts), AC-US-05-01 |
| `POST /employees/:employeeId/skills` | Gán Skill cho Employee | — | ✓ | — | EmployeeSkillsController, AC-US-05-02 |

DEV dùng bề mặt đọc cá nhân riêng, với Employee lấy từ danh tính đã xác minh.
Ma trận giữ
`GET /skills` cho PM vì màn Recommendation gọi trực tiếp; việc đọc
availability phục vụ Recommendation/What-if chạy trong nghiệp vụ Backend sau
khi kiểm tra quyền Project và không cấp quyền gọi API danh bạ HR cho PM. Với
FastAPI, [`POST /risk/predict`](../../ai-service/main.py#L35) là bề mặt tích
hợp nội bộ thuộc luồng Risk, bên gọi là Backend; các actor PM/HR/DEV không
được cấp quyền gọi trực tiếp để thay cho API nghiệp vụ. Plan cần xác minh cách
thực thi ranh giới này trước nghiệm thu; lần rà soát này chưa xác minh khả năng
truy cập mạng của deployment.

### Key Entities

- **User Account** — danh tính nội bộ có định danh ổn định và đúng một role theo D1.
- **Phiên xác thực** — gắn với một tài khoản, có thời hạn và trạng thái kết thúc; cơ chế và thông số chốt ở plan.
- **Employee** — hồ sơ nguồn lực. Mỗi tài khoản DEV liên kết duy nhất với một Employee đã xác minh. Skill và EmployeeSkill giữ ý nghĩa hiện có.
- **Phạm vi Project** — một PM phụ trách Project đã được gán. Sprint và Task thuộc Project theo quan hệ hiện có. Project cũ chưa ánh xạ bị từ chối mặc định.

## Success Criteria

### Measurable Outcomes

- **SC-001** — Ba vai trò với tài khoản thử hợp lệ đều đăng nhập, tải lại khi phiên hợp lệ, vào đúng workspace và đăng xuất. Toàn bộ ca sai thông tin trong ngưỡng, tài khoản bị thu hồi và phiên thiếu/sai/hết hạn/đã kết thúc nhận `401`. Giới hạn đăng nhập có thời gian chờ quan sát được.
- **SC-002** — Toàn bộ route nghiệp vụ trong ma trận có ca gọi trực tiếp thiếu phiên, sai vai trò và sai phạm vi khi áp dụng, cùng ca được phép. Không có lượt bị từ chối nào trả dữ liệu bảo vệ hoặc ghi thay đổi. Kiểm chứng ranh giới nội bộ của dự báo và proof What-if độc lập với danh tính/quyền.
- **SC-003** — Giữ 126 ca hồi quy baseline (83 Backend unit, 16 HTTP E2E với test double, 27 Frontend unit). Ca dev đối chiếu giá trị Project/Sprint/Task và Employee/Skill/EmployeeSkill trước/sau nâng cấp, cùng availability trước/sau lượt What-if.
- **SC-004** — Deep link, reload, đăng xuất và phiên hết hạn đúng workspace/trạng thái; DEV chỉ xem hồ sơ/Skills của mình và ngữ cảnh được cấp hoặc trạng thái thiếu, kiểm bằng hai tài khoản đối chứng. Phản hồi chú trọng cả dữ liệu hiển thị lẫn dữ liệu trả về.

Nghiệm thu dự kiến gồm gọi HTTP trực tiếp cho từng quyền, chạy trình duyệt từ
Login đến nghiệp vụ và Logout, đối chiếu dữ liệu dev trước/sau migration và
What-if, đồng thời chạy lại bộ hồi quy PM/HR/What-if 001. Kịch bản ngoài phạm
vi cần ít nhất hai tài khoản và tài nguyên thuộc hai phạm vi độc lập.

## Assumptions

- **Ràng buộc kỹ thuật đã giao** — Ưu tiên NestJS, React, TypeORM và MariaDB hiện có. Mật khẩu dùng giải pháp hash tiêu chuẩn, không lưu plaintext. Credential, token và secret nằm ngoài Git và log. Migration bảo toàn dữ liệu dev, không reset database. Bộ kiểm thử hiện có giữ nguyên ý nghĩa. Lựa chọn hash, credential phiên, lưu trữ, thời hạn và cách di trú thuộc plan.
- **Xử lý Role Preview đề xuất** — Thay điểm vào thực bằng Login. Giữ các artifact prototype để tham chiếu thiết kế; nếu người phụ trách cần demo tương tác, chỉ giữ bản tách biệt dùng mock, không dùng phiên hay API nghiệp vụ của ứng dụng thật. Đây là phương án giới hạn trong yêu cầu *thay thế hoặc cô lập*, chưa mở thêm deliverable demo.
- **Giới hạn bằng chứng** — Baseline, template, con trỏ feature, route và liên kết được đối chiếu trong lượt đặc tả. Kết quả runtime trích từ Chapter 8 là lịch sử. Chưa chạy Auth, build, browser E2E hoặc MariaDB trong lượt này.
