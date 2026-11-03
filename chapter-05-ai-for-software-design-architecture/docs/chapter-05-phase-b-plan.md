# Chapter 5 — Proposed Phase B Plan

## 1. Trạng thái của kế hoạch

Đây là **đề xuất**, chưa được thực hiện trong Phase A. Kế hoạch chỉ có một
milestone ưu tiên để giữ phạm vi nhỏ và không kéo công việc sang implementation
hoặc Chapter 6.

## 2. Milestone B1 — Reconcile Current-State Architecture & Minimal UML Baseline

### 2.1. Mục tiêu

Tạo một baseline kiến trúc hiện trạng có thể được con người review, phản ánh đúng
source tại thời điểm thực hiện và tách rõ ba lớp trạng thái:

1. `IMPLEMENTED / VERIFIED FROM SOURCE`.
2. `PROPOSED / DOCUMENTED ONLY`.
3. `TBD / NOT VERIFIED`.

Milestone không thiết kế chi tiết payload nghiệp vụ đang bị chặn và không triển
khai bất kỳ capability mới nào.

### 2.2. Phạm vi

- Reconcile mô tả current state của Frontend, Backend, AI Service và database
  với [Architecture Baseline Audit](architecture-baseline-audit.md).
- Tạo current-state component diagram thể hiện:
  - Frontend prototype và các workspace PM/HR/DEV;
  - Backend application, sáu feature module và database boundary;
  - AI Service health-only;
  - các integration chưa tồn tại được dùng nét/nhãn `PROPOSED`, không vẽ như đã chạy.
- Tạo một runtime/deployment view tối giản cho môi trường hiện biết, ghi MySQL
  connection/migration applied là `NOT VERIFIED` nếu chưa có bằng chứng mới.
- Tạo pattern evidence record cho modular structure, layered request path,
  dependency injection, Controller–Service separation và TypeORM Repository.
- Cập nhật disposition cho C5-CONFLICT-001, 002, 004 và 007 ở mức tài liệu.

### 2.3. Deliverables đề xuất

Tên file cuối cùng có thể được nhóm duyệt trước khi bắt đầu; không file nào dưới
đây được tạo trong Phase A:

| Deliverable | Nội dung |
| --- | --- |
| `docs/current-state-architecture.md` | Trách nhiệm/ràng giới/state của FE, BE, AI, DB; supersession note cho snapshot cũ |
| `docs/uml/component-diagram.md` | Component diagram current state với evidence path và state legend |
| `docs/uml/deployment-view.md` | Runtime view tối giản; không thêm Docker/cloud/infrastructure |
| `docs/architecture-pattern-evidence.md` | Pattern, intent, source evidence, trade-off, giới hạn và review status |
| README Chapter 5 | Liên kết artifact và ghi B1 review status, không đóng Chapter 5 |

Không cần tạo tất cả file riêng nếu một tài liệu nhỏ có thể chứa nhiều view mà
vẫn dễ review. Tránh nhân bản nội dung chỉ để tăng số deliverable.

## 3. Dependencies

| Dependency | Trạng thái | Ảnh hưởng B1 |
| --- | --- | --- |
| Phase A audit/gap/traceability đã validate | Bắt buộc | Là input của milestone |
| Human review về cách ghi current vs target state | Bắt buộc, nhỏ | Tránh dùng diagram làm cam kết triển khai |
| C4-HDR-021–030 | Có thể giữ TBD | Không chặn current-state component/runtime view |
| C4-HDR-031 Auth/RBAC | Có thể ghi `ABSENT/TBD` | Không chặn B1; chặn final security design |
| C4-HDR-032 DEV write | Giữ TBD | Không chặn B1; DEV tiếp tục read-only scope |
| MySQL runtime | Không cần cho tài liệu current state | Nếu không kiểm chứng thì tiếp tục `NOT VERIFIED` |

## 4. Quyết định cần con người xác nhận trong B1

| Decision ID đề xuất | Câu hỏi | Owner đề xuất | Default an toàn nếu chưa quyết định |
| --- | --- | --- | --- |
| B1-DEC-01 | Current-state architecture artifact có được xem là nguồn thay thế phần “trạng thái repository” cũ hay chỉ là addendum? | Maintainer + Architect | Dùng addendum, không xóa lịch sử |
| B1-DEC-02 | Có chính thức ghi backend hiện tại là modular monolith/layered architecture không? | Architect + team | Ghi “source-evidenced structure”, chưa gọi là approved pattern |
| B1-DEC-03 | Runtime view nào đã được xác minh ngoài source/build/test? | Maintainer | Ghi `NOT VERIFIED` cho DB và inter-service calls |
| B1-DEC-04 | Conflict docs nào được sửa ngay, docs nào chỉ ghi superseded? | Maintainer/course owner | Giữ nguyên nguồn Chapter 3 và liên kết correction trong Chapter 5 |

Các quyết định này là technical documentation decisions, không chốt risk formula,
matching, allocation, impact, Auth/RBAC mechanism hoặc apply behavior.

## 5. Acceptance conditions

Milestone B1 chỉ đạt khi:

1. Component diagram khớp với module/source paths được kiểm tra.
2. Implemented, proposed, TBD và not-verified được phân biệt bằng legend rõ.
3. Frontend -> Backend và Backend -> AI không được vẽ như integration đang chạy.
4. AI Service được ghi đúng là health-only.
5. Database có 6 entity/2 migration trong source nhưng applied/runtime vẫn không
   được báo PASS nếu không có bằng chứng.
6. PM/HR/DEV được phản ánh; Role Preview không được mô tả là Auth/RBAC.
7. Pattern chỉ được đánh dấu source-evidenced khi có symbol/path cụ thể.
8. Không tạo business rule, API payload, table hoặc module mới.
9. Human reviewer ghi rõ Approved / Changes requested / Keep as proposed cho
   các architecture views.
10. Markdown/link/evidence checks và build/test an toàn không có regression do
    thay đổi tài liệu.

## 6. Explicit non-goals

B1 không thực hiện:

- risk/recommendation/simulation/decision/apply endpoint;
- Frontend API integration;
- Backend -> AI client;
- model loading, training, dataset hoặc evaluation;
- schema/migration mới hoặc chạy migration hiện có;
- Auth, RBAC, User/Role/Permission tables;
- Docker, Redis, Kafka, Kubernetes, CI/CD hoặc cloud resource;
- quyết định allocation unit, workload, availability, utilization, impact formula;
- sửa Chapter 3/4 requirement hoặc đóng toàn bộ Chapter 5.

## 7. Validation dự kiến

- Kiểm tra mọi source path/symbol dùng trong diagram.
- Kiểm tra link Markdown và anchor nội bộ.
- So sánh module/entity/controller inventory tự động bằng tìm kiếm source.
- Kiểm tra diagram render nếu công cụ hiện có hỗ trợ, không cài dependency mới.
- Chạy `npm run build`, `npm test`, `npm run test:e2e` cho Backend và build/lint
  Frontend chỉ khi dependencies sẵn sàng và không dùng database thật.
- Không chạy migration/seed hoặc kết nối/sửa dữ liệu thật.
- Chạy `git diff --check`, `git status --short`, `git diff --stat`.

## 8. Exit và bước sau B1

Sau khi B1 được human-approved, nhóm mới chọn **một** phạm vi tiếp theo dựa trên
rubric và quyết định đã có: sequence/API reconciliation hoặc current physical
data model. Không tự động tiếp tục sang milestone mới và không mở implementation
chỉ vì diagram đã hoàn thành.

