# RMS-AI — Audit tích hợp GitHub Spec Kit và roadmap MVP

Audit ban đầu ngày **2026-11-24**. Ngày **2026-11-25**, người phụ trách phê
chuẩn Constitution 1.0.0, Hybrid SDD, cấu hình LF và roadmap MVP. What-if
Simulation được chọn làm milestone chức năng đầu tiên. Phạm vi What-if đã
chốt ở mức PROPOSED DEMO và chưa triển khai.
Mốc mã nguồn được kiểm tra là `83e13b019bef169628f709c96aa962ca87ccf08b`.

## 1. Tích hợp Spec Kit

`git status --short` ban đầu chỉ có `?? .agents/` và `?? .specify/`.
`chore/adopt-spec-kit`, `feat/pm-resource-recommendations` và ref
`origin/feat/pm-resource-recommendations` cùng trỏ `83e13b0`.
`ui/pm-project-detail` và ref tương ứng dừng ở `50cc3df`, trước HEAD 1 commit.
`main` và `origin/main` dừng ở `ff1ab1f`, trước HEAD 3 commit theo thứ tự
`3103f68` (chi tiết PM), `50cc3df` (UI ba vai trò), `83e13b0` (đề xuất).
Các số liệu trên là snapshot của lần audit ban đầu. Final review chạy
`git fetch origin` và đối chiếu trực tiếp với `git ls-remote`. Kết quả
`origin/main` tiến đến `616f4173934e93d468a8b6a9d984d7e1a14a9c1a` khi PR #21
được merge. HEAD và `origin/feat/pm-resource-recommendations` vẫn ở
`83e13b0`. HEAD là parent thứ hai của merge commit. `git diff HEAD origin/main`
rỗng, dù HEAD đứng trước một commit trong lịch sử. `main` local vẫn ở `ff1ab1f`.

Git diff với HEAD ở lần audit ban đầu xác nhận `AGENTS.md`, `README.md`
và tài liệu đã theo dõi giữ nguyên sau init. `AGENTS.md` cũng khớp
`origin/main`. Các khác biệt chapter trong so sánh baseline trước fetch
đến từ các commit tính năng có trước audit.

### Kiểm kê 30 file có trước audit

| Vị trí | Số file | Nội dung và kết quả |
| --- | ---: | --- |
| `.agents/skills/` | 9 | Một `SKILL.md` cho mỗi skill dưới đây. Tên thư mục, front matter, phiên bản 1.4.4 và SHA-256 đều khớp manifest Codex. |
| `.specify/` | 3 | `.gitignore`, `init-options.json`, `integration.json`. Cấu hình xác nhận Codex mặc định, PowerShell, đánh số tuần tự và symlink tắt. |
| `.specify/integrations/` | 2 | `codex.manifest.json`, `speckit.manifest.json`. Kiểm tra SHA-256 khớp toàn bộ 9 mục Codex + 13 mục core. |
| `.specify/memory/` | 2 | `constitution.md` ban đầu là scaffold. `.constitution-template.json` ghi nguồn `core` và hash của template. |
| `.specify/scripts/powershell/` | 7 | `check-prerequisites.ps1`, `common.ps1`, `create-new-feature.ps1`, `resolve-template.ps1`, `setup-plan.ps1`, `setup-tasks.ps1` và `markdown_sections.py`. Parser kiểm tra cả 7 file. Resolver chạy thành công với 5 template. `create-new-feature.ps1 -DryRun -Json` trả path dự kiến và giữ nguyên checkout. |
| `.specify/templates/` | 5 | `checklist-template.md`, `constitution-template.md`, `plan-template.md`, `spec-template.md`, `tasks-template.md`. Tất cả phân giải được qua PowerShell. |
| `.specify/workflows/` | 2 | `workflow-registry.json` và `speckit/workflow.yml`. `specify workflow list` đọc được Full SDD Cycle v1.0.2. Workflow có bước `implement`, nên audit chỉ xem cấu hình và danh sách. |

`specify --version` trả `1.4.4`. `specify check` phát hiện Codex CLI.
`specify integration list` báo Codex `installed (default)`.
`specify artifact list --json` liệt kê đúng 9 command tương ứng 9 skill mà
Codex cung cấp trong phiên này.

| Skill | Chức năng và mức kiểm chứng |
| --- | --- |
| `speckit-constitution` | Soạn quy tắc dự án. Đã chạy luồng Constitution tới bản 1.0.0. |
| `speckit-specify` | Soạn spec. Đã kiểm tra resolver của spec và dry run script tạo feature. |
| `speckit-clarify` | Làm rõ spec. Đã xác nhận nhận diện và nội dung skill. |
| `speckit-checklist` | Soạn checklist chất lượng yêu cầu. Đã xác nhận nhận diện và resolver của checklist. |
| `speckit-plan` | Lập plan. Đã xác nhận nhận diện và resolver của plan. |
| `speckit-tasks` | Lập danh sách tác vụ. Đã xác nhận nhận diện và resolver của tasks. |
| `speckit-analyze` | Đối chiếu spec, plan, tasks. Đã xác nhận nhận diện và nội dung skill. |
| `speckit-converge` | Đối chiếu yêu cầu với hiện trạng triển khai. Đã xác nhận nhận diện và nội dung skill. |
| `speckit-implement` | Thực thi tasks. Đã xác nhận nhận diện và nội dung skill. |

Tám skill ngoài Constitution chưa được chạy đầu-cuối. Các bước cần feature
đã có spec/plan/tasks sẽ được kiểm chứng trong milestone được duyệt. Tại HEAD
chưa có `specs/`, `.specify/feature.json`, preset hay `.specify/extensions.yml`.
Không có hook Constitution được đăng ký trước hoặc sau khi soạn. Script dry
run trả tên `001-what-if-simulation` theo cấu hình tuần tự. Tên đó chỉ dùng
để kiểm tra và chưa trở thành tên milestone hoặc branch.

### Credentials, cấu hình cá nhân và rủi ro Git

- Quét mẫu token/khóa riêng, URI có mật khẩu, giá trị secret gán trực tiếp
  và đường dẫn người dùng trên 30 file scaffold. Kết quả **0 ứng viên**.
  Quét 171 đường dẫn tracked tại HEAD chỉ cho khớp giả ở test fixture và
  CSS/JSX, cùng một đường dẫn máy trong [audit Chapter 5](../../chapter-05-ai-for-software-design-architecture/docs/architecture-baseline-audit.md).
  Đây là rà soát theo mẫu trên nội dung văn bản và kiểm kê tên file trong lịch sử Git sẵn có.
- `git check-ignore` xác nhận `backend/.env`, `.local/`, con trỏ feature,
  cấu hình local của extension và registry adapter cục bộ được loại trừ.
  `backend/.env.example` là mẫu với placeholder. Quá trình audit không sao chép
  giá trị cấu hình local hoặc kế hoạch cá nhân vào hồ sơ chia sẻ.
- Giữ scaffold và manifest nguyên trạng. Timestamp trong metadata ghi lúc
  cài đặt. Tại milestone sau, kiểm tra hook trước khi gọi skill có khả năng
  tạo/chuyển branch hoặc chạy lệnh Git. Workflow đầy đủ đi tiếp tới triển khai.
  Mọi thao tác Git vẫn chịu giới hạn trong [AGENTS.md](../../AGENTS.md).
- Dependency manifest giữ nguyên. Repo hiện dùng `core.autocrlf=true`. Audit kiểm tra
  thêm file untracked bằng `git -c core.autocrlf=false -c core.whitespace=cr-at-eol diff --no-index --check`
  để đọc byte gốc và chấp nhận CRLF đúng chỗ trên JSON do CLI ghi.
- Cả 22 file có hash trong hai manifest đều dùng LF gốc. Thử chuyển sang
  CRLF làm sai cả 22 hash. Sau phê duyệt, [`.gitattributes`](../../.gitattributes)
  đặt `text eol=lf` cho các skill, script, template và `.specify/.gitignore`
  mà manifest quản lý. Các hash manifest giữ nguyên. Kiểm tra tái lập bằng
  repository tạm: đặt `core.autocrlf=true`, đưa attributes và 22 file vào
  index tạm, xóa bản sao làm việc của từng file rồi dùng `git checkout-index --all`.
  Bản checkout tái tạo khớp 22/22 SHA-256. `specify integration status --json`
  trên workspace trả `ok`, 0 file thiếu, bị sửa hoặc có path không hợp lệ.

## 2. Hiện trạng RMS-AI

**IMPLEMENTED** là hành vi có trong mã. **VERIFIED** cần lần chạy ghi rõ môi
trường và phạm vi. **PARTIAL** là mới đáp ứng một phần. **MOCK** là dữ liệu/màn
minh họa hoặc trạng thái cục bộ. **NOT IMPLEMENTED** là năng lực còn thiếu.
**TBD** là quyết định nghiệp vụ hoặc kỹ thuật đang mở. Một phần của tính năng
có thể đồng thời `VERIFIED` trong phạm vi demo và `PARTIAL` theo US/AC.

Đối chiếu phạm vi và các bất biến từ [PRD](../../chapter-03-ai-for-requirements-product-analysis/docs/PRD.md),
[User Stories](../../chapter-03-ai-for-requirements-product-analysis/docs/user-stories.md)
và [Acceptance Criteria](../../chapter-03-ai-for-requirements-product-analysis/docs/acceptance-criteria.md).
PRD mang nhãn **Bản nháp**. User Stories ghi nhận nhóm đã chốt phạm vi v0.1.
Các mục `TBD` và đề xuất kỹ thuật tiếp tục chờ phê duyệt.

| Năng lực | Kết luận và bằng chứng |
| --- | --- |
| PM quản lý dữ liệu dự án | **IMPLEMENTED + VERIFIED** trong phạm vi tạo/đọc Project → Sprint → Task, sửa trạng thái Task và trường kế hoạch, tổng hợp tiến độ theo số Task. E2E Backend mới chạy dùng test double. Browser + MySQL dev và reload đã được ghi ngày 17–18/11. [Màn chi tiết](../../frontend/src/projects/ProjectDetailView.tsx), [Chapter 6](../../chapter-06-ai-coding/README.md), [Chapter 8](../../chapter-08-ai-software-testing/README.md). |
| HR xem và duy trì dữ liệu, US-05 | **PARTIAL**. UI đọc Employee, Skill, quan hệ và giờ trống theo tuần. API nền tảng có tạo Employee/Skill và gắn kỹ năng, được **VERIFIED** qua E2E HTTP với repository thay thế. Browser/MySQL đã ghi nhận đọc và phân biệt 0 giờ, thiếu dữ liệu, khác tuần. Luồng HR duy trì dữ liệu theo quyền qua UI còn thiếu. [Màn Nhân sự](../../frontend/src/employees/EmployeesView.tsx), [API liên kết kỹ năng](../../backend/src/employee-skills/employee-skills.controller.ts), [Chapter 8](../../chapter-08-ai-software-testing/README.md). |
| Dự báo rủi ro PM, US-01 | **PARTIAL**. NestJS lấy `status`/`dueDate` của đúng Project, gửi ngày Việt Nam và hiển thị kết quả FastAPI. Inference Logistic Regression **IMPLEMENTED + VERIFIED** trên artifact huấn luyện tổng hợp, đo xác suất có Task quá hạn trong D+1…D+7. Tập test tổng hợp 424 mẫu/145 dự án cho F1 lớp dương 0,801 so với 0,766 của baseline đa số. Thiếu dự báo bàn giao ở cấp dự án và các yếu tố giải thích theo AC-US-01-01. `TBD` về nhãn, dữ liệu, chỉ số, độ mới và độ tin cậy ngoài dữ liệu tổng hợp. [Dịch vụ đánh giá](../../backend/src/projects/project-risk.service.ts), [inference](../../ai-service/risk.py), [metrics](../../ai-service/artifacts/metrics.json), [Chapter 8](../../chapter-08-ai-software-testing/README.md). |
| Đề xuất ứng viên PM, US-02 | **IMPLEMENTED + VERIFIED** theo `PROPOSED DEMO`, **PARTIAL** theo phạm vi đầy đủ. PM nhập kỹ năng, tuần bắt đầu thứ Hai và giờ cần. NestJS lọc người có kỹ năng và giờ trống dương đúng tuần, xếp theo `min(availableHours, requiredHours)`, tên, ID. Có ca rỗng/không hợp lệ và truy vấn chỉ đọc. E2E mới chạy và smoke MySQL ngày 19/11 ghi nhận thứ hạng cùng số giờ trước/sau. Độ phù hợp nâng cao, tải từ phân bổ, tối ưu và quan hệ với kết quả rủi ro còn mở. [Màn đề xuất](../../frontend/src/projects/ProjectResourceRecommendations.tsx), [dịch vụ](../../backend/src/projects/project-resource-recommendation.service.ts), [Chapter 8](../../chapter-08-ai-software-testing/README.md). |
| What-if, US-03 | **MOCK** cho dữ liệu và tương tác. Bộ tính tác động của phương án thật **NOT IMPLEMENTED**. Kết quả hiện tại là nội dung minh họa và `TBD`; ứng viên từ API chưa đi vào phương án có thể mô phỏng. [Màn What-if](../../frontend/src/resource-recommendation/WhatIfSimulationView.tsx), [truy vết quyết định UI](../../chapter-04-ai-for-product-design/docs/human-review-traceability.md). |
| Quyết định và áp dụng, US-04 | **MOCK** cho Chấp nhận/Từ chối trong state React. Quyết định nghiệp vụ và thay đổi phân bổ thật **NOT IMPLEMENTED**. Thiết kế phân biệt quyết định, kết quả áp dụng và thất bại. Lưu quyết định/lịch sử, thao tác lặp, dữ liệu cũ và điều kiện áp dụng còn **TBD**. [Màn What-if](../../frontend/src/resource-recommendation/WhatIfSimulationView.tsx), [ràng buộc phân bổ](../../chapter-03-ai-for-requirements-product-analysis/docs/resource-allocation-constraints.md). |
| DEV và quyền theo vai trò, US-06/07 | **PARTIAL** cho giao diện ba vai trò, **MOCK** cho Role Preview và ngữ cảnh DEV. Auth/RBAC, danh tính thực, ánh xạ User Account ↔ Employee và truy cập Project/Sprint/Task của chính DEV **NOT IMPLEMENTED**. Cơ chế kỹ thuật **TBD**. [App](../../frontend/src/App.tsx), [màn DEV](../../frontend/src/dev-workspace/DevWorkspaceViews.tsx), [thiết kế workspace](../../chapter-04-ai-for-product-design/docs/three-role-workspace-ui-design.md). |
| MySQL và API | **IMPLEMENTED** ở nền tảng vật lý 6 entity Project, Sprint, Task, Employee, Skill, EmployeeSkill. Năm migration lần lượt tạo hai nhóm bảng, thêm Task status, Task planning và HR availability. TypeORM đặt `synchronize: false`, `migrationsRun: false`. **VERIFIED** việc áp dụng migration ở MySQL dev trong minh chứng lịch sử. Allocation, phương án, impact và quyết định chỉ có ở mức thiết kế khái niệm. [Cấu hình](../../backend/src/database/database.config.ts), [migrations](../../backend/src/database/migrations/), [thiết kế DB](../../chapter-03-ai-for-requirements-product-analysis/docs/database-design.md). |

Tại HEAD, các controller NestJS có `GET /health`, Project create/list/get
qua `/projects`, Sprint create/list qua `/projects/:projectId/sprints`,
Task create/list và PATCH qua `/sprints/:sprintId/tasks[/:taskId]`.
Nhóm nguồn lực có `/employees`, `/employees/availability`, `/skills`
và `/employees/:employeeId/skills`. Hai POST theo project có hậu tố
`/risk-assessments` và `/resource-recommendations`. Vite dev nhận `/api`
rồi bỏ tiền tố khi proxy sang NestJS. NestJS gọi FastAPI `POST /risk/predict`
cho rủi ro. Thiết kế còn có `/simulations`, `/decisions` và các hợp đồng
AI khái niệm cho đề xuất/mô phỏng. Các phần này vẫn ở tài liệu.
[Controllers PM](../../backend/src/projects/projects.controller.ts),
[client rủi ro](../../backend/src/projects/risk-client.ts),
[proxy Vite](../../frontend/vite.config.ts),
[hợp đồng API ban đầu](../../chapter-03-ai-for-requirements-product-analysis/docs/initial-api-contracts.md),
[hợp đồng dữ liệu MVP](../../chapter-03-ai-for-requirements-product-analysis/docs/mvp-data-contract.md).

### Milestone và điểm lệch cần review

| Mốc | Tình trạng |
| --- | --- |
| 1 — Nền tảng và phân tích | Hoàn thành trong phạm vi khởi tạo và cơ sở yêu cầu Chapter 1/3. Lịch sử first-parent có các lần merge nền tảng và tài liệu; phạm vi v0.1 có căn cứ, các quyết định chi tiết vẫn TBD. [Project brief](../../chapter-01-ai-in-software-engineering/docs/project-brief.md), [Chapter 3](../../chapter-03-ai-for-requirements-product-analysis/README.md). |
| 2 — Thiết kế sản phẩm | Chapter 4 đã close-out ở `45edcfe`, **Ready with retained TBDs**. `COURSE_PROGRESS.md` đã đồng bộ ngày 2026-11-25, ghi hoàn tất review thiết kế với 20 mục UI được duyệt và giữ 12 TBD của close-out. UI cập nhật tại `3103f68` và `50cc3df` có QA đã ghi, chờ review UI của mốc đó. [Chapter 4](../../chapter-04-ai-for-product-design/README.md), [Frontend README](../../frontend/README.md). |
| 3 — Kiến trúc, dữ liệu, API | Phase A hoàn thành. B1 có sơ đồ hiện trạng và đang chờ review. B1 là snapshot trước các luồng PM/HR hiện tại. Kế hoạch Phase B yêu cầu duyệt B1 trước khi chọn một phạm vi thiết kế tiếp. [Chapter 5](../../chapter-05-ai-for-software-design-architecture/README.md), [kế hoạch B1](../../chapter-05-ai-for-software-design-architecture/docs/chapter-05-phase-b-plan.md). |
| 4 — Dữ liệu nghiệp vụ tối thiểu | Các mốc dev Project/Sprint/Task, cập nhật trạng thái, tiến độ, hạn/giờ Task và HR đọc theo tuần đã có bằng chứng ngày 17–18/11. Milestone tổng còn phần HR duy trì theo quyền, liên kết dữ liệu DEV và mô hình phân bổ vận hành nếu được duyệt. [Chapter 6](../../chapter-06-ai-coding/README.md). |
| 5 — AI/Data | Baseline và PM gọi FastAPI đã chạy local. Tích hợp có trong `main` `ff1ab1f`. Mục tiêu dự báo bàn giao, giải thích, đánh giá dữ liệu phù hợp và xếp hạng hoàn chỉnh chưa hoàn tất. [AI README](../../ai-service/README.md), [Chapter 8](../../chapter-08-ai-software-testing/README.md). |
| 6 — Đề xuất, What-if, quyết định | `83e13b0` hoàn thành đề xuất chỉ đọc trong phạm vi demo, chờ review. What-if/decision thật còn thiếu. [Chapter 6](../../chapter-06-ai-coding/README.md), [Chapter 8](../../chapter-08-ai-software-testing/README.md). |
| 7–9 — Review, kiểm thử, bàn giao | Đã có review race condition, regression, thử trình duyệt và bằng chứng vận hành từng luồng. Bộ nghiệm thu liên vai trò, E2E MVP và bàn giao cuối vẫn mở. [Chapter 7](../../chapter-07-ai-code-review-refactoring/README.md), [Chapter 8](../../chapter-08-ai-software-testing/README.md), [Chapter 9](../README.md). |

- README gốc trước final review còn mô tả UI thuần mock và môi trường chạy
  cơ sở không cần cấu hình. Bản cập nhật ngày 2026-11-25 ghi luồng PM/HR gọi
  API, baseline AI, cấu hình `DB_*` và cổng AI mặc định `8001`. Các snapshot
  Chapter 3/5 và vị trí `/api` tiếp tục được theo dõi trong conflict register.
  [README](../../README.md), [gap analysis](../../chapter-05-ai-for-software-design-architecture/docs/architecture-gap-analysis.md).
- Kế hoạch làm việc local có ví dụ về ngưỡng rủi ro, trường điểm xếp hạng,
  trạng thái bench và allocation. US/AC để mở các quy tắc này và nêu ví dụ
  “chỉ dự án rủi ro cao mới được đề xuất” là giả định. Roadmap giữ các câu hỏi
  mở, áp dụng bất biến What-if chỉ đọc và PM chấp nhận trước mọi áp dụng.
  Audit chưa phát hiện hai yêu cầu nghiệp vụ đã xác nhận mâu thuẫn trực tiếp.

## 3. Hybrid SDD đã được phê chuẩn

| Nguồn | Vai trò |
| --- | --- |
| `AGENTS.md` và [Constitution](../../.specify/memory/constitution.md) | Hướng dẫn làm việc trong repo và điều kiện review spec/plan/tác vụ. Constitution 1.0.0 gồm 14 nguyên tắc, phê chuẩn ngày 2026-11-25. |
| Chapter 3–5 | Nguồn yêu cầu đã xác nhận, lý do thiết kế, contract đề xuất và danh sách TBD. Mỗi spec liên kết tới mã US/AC và quyết định review có liên quan. |
| `specs/<mã-milestone>/` khi được duyệt | `spec.md` ghi phạm vi và AC của lát cắt. `plan.md` ghi thiết kế và tác động lên hợp đồng. `tasks.md` nối công việc và kiểm thử về từng AC. Dùng con trỏ feature cục bộ của Spec Kit. |
| Chapter 6–9 và `COURSE_PROGRESS.md` | Ghi triển khai, review, lệnh/kịch bản chạy, kết quả và giới hạn. Cập nhật chapter và dẫn về spec, commit hoặc minh chứng hiện có sau mỗi milestone. |

Đề xuất luồng review theo từng bước. Bắt đầu `$speckit-specify` từ US/AC và
kiểm kê hành vi hiện tại. Dùng `$speckit-clarify` cho quyết định người có thẩm
quyền cần chốt, `$speckit-checklist` khi cần soi chất lượng yêu cầu. Sau khi
spec được duyệt, dùng `$speckit-plan` rồi `$speckit-tasks`; chạy
`$speckit-analyze` trước khi xin duyệt triển khai. `$speckit-converge` phù hợp
khi cần đối chiếu phần còn thiếu sau một vòng triển khai được giao. Tài liệu
chapter dẫn về artifact Spec Kit tương ứng để tránh duy trì hai bản yêu cầu.

## 4. Roadmap MVP đã được phê chuẩn

| Thứ tự | Milestone và kết quả cần nghiệm thu | Phụ thuộc |
| --- | --- | --- |
| 0 | **Duyệt baseline và phạm vi.** Constitution, Hybrid SDD, roadmap và phạm vi What-if đầu tiên đã được duyệt. B1 và review riêng của các tích hợp demo giữ trạng thái hiện có. | Hồ sơ Chapter 3–5, 6/8 và HEAD đang audit. |
| 1 | **Ứng viên API → What-if chỉ tính tác động cho đúng phương án** (US-02 → US-03). Kiểm chứng đúng dự án/phương án, các ca lỗi và tính chỉ đọc của demo. | Đề xuất đọc ở `83e13b0`. Đầu vào, ràng buộc, chỉ báo, lỗi và độ mới của demo đã chốt tại [User Stories](../../chapter-03-ai-for-requirements-product-analysis/docs/user-stories.md#quyết-định-cho-what-if-đầu-tiên-2026-11-25). |
| 2 | **Danh tính và dữ liệu theo quyền tối thiểu** (US-05/06/07). Xác minh quyền phía server theo vai trò/đối tượng, HR duy trì dữ liệu tối thiểu, DEV xem dữ liệu của mình hoặc trạng thái thiếu phù hợp. | Duyệt định danh và quan hệ User Account ↔ Employee, ngữ nghĩa quyền và dữ liệu DEV. Có thể phân tích song song mốc 1. Cần trước khi nghiệm thu quyết định nghiệp vụ có danh tính. |
| 3 | **Quyết định PM cho đúng phương án** (US-04). Nghiệm thu Chấp nhận, Từ chối, thiếu quyết định và quyền PM. Nêu rõ cách ghi nhận được duyệt và chứng minh trạng thái chấp nhận tách khỏi kết quả áp dụng. | Mốc 1 và phạm vi quyền PM của mốc 2. Chốt liên kết phương án, nguồn nhận diện PM, yêu cầu lưu, dữ liệu thay đổi và thao tác lặp trong phạm vi cần thiết. |
| 4 | **Dự báo bàn giao và giải thích** (US-01). Chốt nhãn cấp dự án, chân trời, nguồn dữ liệu, chỉ số và yếu tố giải thích rồi mới huấn luyện/đánh giá và đồng bộ output qua FastAPI → NestJS → UI. Gắn nhãn minh bạch nếu dùng dữ liệu tổng hợp. | Dữ liệu Project/Sprint/Task hiện có và quyết định AI/Data. Có thể chốt nhãn và đánh giá dữ liệu song song mốc 1–3. Kiểm chứng lại tích hợp theo contract đã duyệt. |
| 5 | **Hoàn thiện chất lượng đề xuất** (US-02). Chốt điều kiện phù hợp, nguồn availability/workload, giải thích, tiêu chí xếp hạng và cách kiểm chứng. Giữ heuristic làm mốc so sánh, cân nhắc tối ưu hay ML khi tiêu chí và dữ liệu đủ căn cứ. | Dữ liệu HR mốc 2. Nếu nhóm yêu cầu tín hiệu rủi ro làm đầu vào, cần contract mốc 4; quan hệ bắt buộc này hiện là TBD. |
| 6 | **Áp dụng phân bổ nếu được phê duyệt.** Nghiệm thu phân biệt Accept và Apply, cập nhật đúng phạm vi, có bảo toàn dữ liệu khi lỗi, lặp hoặc đồng thời. | Mốc 2–3 và quyết định riêng về mô hình phân bổ, điều kiện, thời điểm và phục hồi. Ghi nhận như phần có điều kiện trong roadmap. |
| 7 | **Nghiệm thu MVP và bàn giao.** Chạy luồng PM trên môi trường dev từ Risk → Recommendation → What-if → Decision, ca âm phân quyền và cảnh báo thiếu dữ liệu, rà soát HR/DEV, bổ sung hướng dẫn vận hành. | Mốc 1–5 và mốc 6 nếu áp dụng được phê duyệt cho bản bàn giao. Chapter 6–9 lưu kết quả theo từng lớp và AC. |

**What-if Simulation là milestone chức năng đầu tiên.** Người phụ trách
chốt phương án A của TBD-01/03/04/05/07/08 ở mức PROPOSED DEMO. Đã ghi các
quyết định trong Chapter 3, truy vết US-02/03 và bổ sung
[kịch bản kiểm chứng](../../chapter-03-ai-for-requirements-product-analysis/docs/acceptance-criteria.md#kiểm-chứng-what-if-đầu-tiên--proposed-demo).
Mốc hiện tại chỉ hoàn thiện hồ sơ tích hợp. Việc tạo spec, lập plan và
triển khai What-if thuộc lượt làm việc tiếp theo.

## 5. Kiểm tra và giới hạn

### Baseline audit ngày 2026-11-24

| Kiểm tra ở HEAD | Kết quả |
| --- | --- |
| Frontend `npm test`, `npm run lint`, `npm run build` | **PASS** 10/10 test ở ba file Node. Bao phủ guard GET/PATCH, trường kế hoạch và tổng hợp tiến độ. Build/lint đạt. |
| Backend `npm test`, `npm run test:e2e`, `npm run lint`, `npm run build` | **PASS** 55/55 unit ở 10 file và 11/11 E2E ở 1 file. E2E chạy NestJS/Supertest với DataSource/repository thay thế, mock `fetch` ở ca rủi ro. Build/lint đạt. Vite phát thông báo về plugin tsconfig paths. [E2E](../../backend/test/app.e2e-spec.ts). |
| AI Service `python -B -m unittest -v` | **PASS** 9/9 bằng Python máy đã có `scikit-learn==1.8.0`. Lần đầu dùng `.venv` gặp `ModuleNotFoundError: sklearn`; import FastAPI trong venv đạt. Audit tái sử dụng môi trường sẵn có và giữ dependency nguyên trạng. |
| FastAPI smoke trực tiếp qua ASGI | **PASS** 5/5 cho `GET /health`, `scored`, `missing_deadlines`, `no_tasks_due_in_window` và payload sai trả 422. Chạy với dữ liệu tổng hợp, trong cùng tiến trình. |
| MySQL dev, browser E2E và production | Probe chỉ đọc tới MySQL local dev trả `ECONNREFUSED`. Browser/MySQL chưa chạy lại trong audit. Không có kiểm chứng production, Auth/RBAC, screen reader hay chất lượng AI trên dữ liệu thật ở mốc này. |
| Tài liệu, phạm vi và Git | **PASS** `git diff --check` và kiểm tra whitespace trên 31 file untracked. Đã rà soát diff, xác thực 50 liên kết nội bộ mới và kiểm tra cấu trúc, 14 nguyên tắc, phiên bản và ngày của Constitution. |

### Kiểm tra hoàn tất ngày 2026-11-25

- **Spec Kit**. Checkout Git cách ly với `core.autocrlf=true` giữ 22/22 hash.
  Kiểm tra integration status trên workspace đạt. Constitution 1.0.0 đã
  ghi ngày phê chuẩn và bỏ Sync Impact Report tạm.
- **MySQL dev**. Khởi động instance XAMPP MariaDB 10.4.32 đã có schema
  `rms_ai_pm_dev` trên loopback cổng 3306. Kiểm tra chỉ đọc `SELECT 1`,
  metadata bảng/cột và lịch sử migration đạt. Xác nhận 6 bảng nghiệp vụ,
  bảng `migrations`, 5 migration đã ghi nhận và các cột Task planning/HR
  availability. Lượt này không chạy seed, migration hoặc browser E2E.
- **AI Service**. Đồng bộ `.venv` từ `requirements.txt` hiện có, gồm
  `scikit-learn==1.8.0` và các dependency bắc cầu do pip giải quyết. Chạy
  bằng đúng interpreter trong `.venv`: `pip check` đạt, unit test **9/9**.
  Smoke HTTP với Uvicorn trên loopback đạt **5/5** cho `/health`, `scored`,
  `missing_deadlines`, `no_tasks_due_in_window` và payload sai trả 422.
  Kết quả scoring dùng artifact demo huấn luyện từ dữ liệu tổng hợp.

## 6. File của milestone

- 9 `SKILL.md` và 21 file Spec Kit ban đầu được kiểm kê ở mục 1.
  [Constitution](../../.specify/memory/constitution.md) là file scaffold duy nhất
  có nội dung dự án được cập nhật.
- Thêm [`.gitattributes`](../../.gitattributes) và báo cáo này.
- Cập nhật [README gốc](../../README.md), [`COURSE_PROGRESS.md`](../../COURSE_PROGRESS.md),
  [Chapter 9 README](../README.md), [User Stories](../../chapter-03-ai-for-requirements-product-analysis/docs/user-stories.md)
  và [Acceptance Criteria](../../chapter-03-ai-for-requirements-product-analysis/docs/acceptance-criteria.md).

Hồ sơ tích hợp kết thúc ở cấu hình và tài liệu. Chapter 5 B1 tiếp tục chờ
duyệt. Việc nghiệm thu chức năng What-if và bất biến trên `ProjectAllocation`
vẫn thuộc milestone sau.
