# Human Review Traceability Matrix — Chapter 4

## 1. Mục đích

Ma trận này liên kết từng Review ID trong
[`human-review-decision-register.md`](human-review-decision-register.md) với cơ
sở yêu cầu, artifact thiết kế/prototype và trạng thái xác minh. Ma trận không
biến lựa chọn UI thành requirement và không tạo ánh xạ giả khi không có căn cứ.

Quy ước Verification Result:

- `Static verified`: đã đối chiếu tài liệu hoặc mã nguồn tĩnh.
- `Browser verified`: đã thao tác hoặc quan sát bằng trình duyệt thật trong
  Giai đoạn B; không đồng nghĩa người dùng trực tiếp review.
- `Not verified`: cần review giao diện hoặc bằng chứng thực thi.
- `Not run`: phép kiểm cụ thể chưa được thực hiện.
- `Not applicable`: quyết định thuộc giai đoạn sau, không cần thực thi để review
  Chapter 4.
- `Conflict`: có hai nguồn đang mô tả khác nhau và cần con người quyết định.

Decision provenance cho 32 mục là: **User-provided, AI-assisted delegated
design review decisions**. Trạng thái sau ghi nhận gồm 15 `Approved`, 5
`Pending` và 12 `Keep as TBD`; verification được quản lý độc lập với approval.

## 2. Ma trận truy vết

| Review ID | UI Screen / Flow | PRD section | User Story | Acceptance Criteria | Classification | Decision | Review Status | Affected artifact / impact | Verification Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C4-HDR-001 | PM — Tổng quan vận hành | Tổng quan sản phẩm; Phạm vi MVP | US-01 đến US-04 | AC-US-01-01; AC-US-07-02 | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | Approved | Operations overview structure retained | Static verified; visual tracked by 020 |
| C4-HDR-002 | PM — Dự án minh họa / Hoạt động chưa kết nối | Không có yêu cầu dashboard trực tiếp | US-01 | AC-US-01-02; AC-US-01-04 | GIAO DIỆN ĐỀ XUẤT | Request revision | Pending — Awaiting re-review | `operations-overview-ui-design.md`; `OperationsOverview.tsx` microcopy revised | Static revised; Browser verified; human re-review pending |
| C4-HDR-003 | PM — Dự án / Trung tâm rủi ro | Người dùng mục tiêu — PM; Phạm vi MVP — Risk | US-01 | AC-US-01-01; AC-US-01-04 | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | Approved | `ProjectsView.tsx`; `ProjectRiskOverview.tsx` | Static verified; visual tracked by 020 |
| C4-HDR-004 | PM — Chi tiết rủi ro | Mục tiêu sản phẩm; Phạm vi MVP — Risk | US-01; US-02 | AC-US-01-01; AC-US-02-01 | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | Approved | `pm-risk-ui-design.md`; `ProjectRiskDetail.tsx` | Static verified; visual tracked by 020 |
| C4-HDR-005 | PM — Risk unavailable → Recommendation | Các vấn đề chưa quyết định — dữ liệu đủ/lỗi | US-01; US-02 | AC-US-01-02; AC-US-01-04; AC-US-02-04 | GIAO DIỆN ĐỀ XUẤT | Request revision | Pending — Awaiting re-review | CTA microcopy/docs revised; eligibility remains TBD | Static revised; Browser verified; human re-review pending |
| C4-HDR-006 | PM — Ranked recommendation list | Mục tiêu sản phẩm; Phạm vi MVP — Recommendation | US-02 | AC-US-02-01; AC-US-02-02 | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | Approved | Recommendation list retained | Static verified; visual tracked by 020 |
| C4-HDR-007 | PM — No matching candidate | Phạm vi MVP — Recommendation | US-02 | AC-US-02-03; AC-US-02-05 | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | Approved | Empty result retained | Static verified |
| C4-HDR-008 | PM — Candidate → Simulation context | Phạm vi MVP — Recommendation/Simulation | US-02; US-03 | AC-US-02-01; AC-US-03-01 | GIAO DIỆN ĐỀ XUẤT | Request revision | Pending — Awaiting re-review | Candidate/scenario microcopy and docs revised | Static revised; Browser verified; human re-review pending |
| C4-HDR-009 | PM — Progressive Simulation screen | Phạm vi MVP — Simulation/Decision | US-03; US-04 | AC-US-03-01; AC-US-03-02; AC-US-04-01 | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | Approved | Progressive screen retained | Static verified; visual tracked by 020 |
| C4-HDR-010 | PM — Simulation state model | Phạm vi MVP — non-destructive simulation | US-03 | AC-US-03-02; AC-US-03-03; AC-US-03-04 | GIAO DIỆN ĐỀ XUẤT | Request revision | Pending — Awaiting re-review | Prototype labels/docs distinguish local placeholder from engine result | Ready/Success Browser verified; Loading/Missing/Failure design-only, not implemented; human re-review pending |
| C4-HDR-011 | PM — Impact comparison | Phạm vi MVP — expected impact | US-03 | AC-US-03-01; AC-US-03-02 | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | Approved | Two-column placeholder retained | Static verified; metric Not applicable yet |
| C4-HDR-012 | PM — Accept / Reject | Tổng quan sản phẩm; Phạm vi MVP — PM decision | US-04 | AC-US-04-01 đến AC-US-04-03; AC-US-04-07 | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | Approved | Decision controls retained; no real allocation change | Static + Browser verified for both Accept and Reject; no Applied Successfully |
| C4-HDR-013 | HR — Workspace IA | Người dùng mục tiêu — HR; Phạm vi MVP | US-05; US-07 | AC-US-05-01 đến AC-US-05-04; AC-US-07-01 | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | Approved | Old Operations doc aligned; HR owns Employee/Skill UI scope | Static verified; no RBAC inference |
| C4-HDR-014 | HR — Empty/unconnected states | Phạm vi sản phẩm; ngoài phạm vi HRIS | US-05 | AC-US-05-01 đến AC-US-05-03 | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | Approved | HR empty states retained | Static verified; data integration Not applicable |
| C4-HDR-015 | DEV — Read-only Workspace IA | Người dùng mục tiêu — DEV; Phạm vi MVP | US-06; US-07 | AC-US-06-01; AC-US-06-02; AC-US-06-05; AC-US-07-01 | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | Approved | DEV read-only IA retained | Static verified; identity-backed data Not applicable |
| C4-HDR-016 | DEV — Missing identity/context states | User Account khác Employee; dữ liệu chỉ khi tồn tại | US-06 | AC-US-06-01 đến AC-US-06-04 | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | Approved | No fake identity/task data | Static verified |
| C4-HDR-017 | Cross-role — Role Preview | Workspace theo role; Auth/RBAC TBD | US-07 | AC-US-07-01 đến AC-US-07-03 | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | Approved | Role Preview retained as prototype control | Static verified; browser interaction tracked by 020 |
| C4-HDR-018 | Cross-role — App Shell/navigation | Người dùng mục tiêu; luồng MVP | US-01 đến US-07 | AC-US-07-01; AC-US-07-02 | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | Approved | PM/HR/DEV navigation boundaries retained | Static verified; no RBAC inference |
| C4-HDR-019 | Cross-role — State reset/context | Workspace phù hợp role | US-07 | AC-US-07-01; AC-US-07-02 | GIAO DIỆN ĐỀ XUẤT | Approve proposed UI | Approved | `App.tsx`; reset to Role Preview then role home | Static + Browser verified via PM → HR → DEV → PM; PM returns to Overview without candidate/context flow |
| C4-HDR-020 | Cross-role — Responsive/A11y | Không có section PRD trực tiếp | US-01 đến US-07 | Không có AC breakpoint/a11y trực tiếp | GIAO DIỆN ĐỀ XUẤT | Pending | Pending | `App.css`; `index.css`; all prototype screens; responsive context-flow fix | Browser visual QA PASS at 1440/1280/1024/768; keyboard PASS; DOM/AX PASS with limits; screen reader Not run; human decision pending |
| C4-HDR-021 | Toàn luồng — Minimum valid data | Phạm vi sản phẩm; Các vấn đề TBD — dữ liệu tối thiểu | US-01; US-02; US-05; US-06 | AC-US-01-02; AC-US-02-04; AC-US-05-02; AC-US-05-03 | TBD | Keep as TBD | Keep as TBD | Future requirement/data scope; preserve honest missing-data UI | Static traced; business decision deferred |
| C4-HDR-022 | PM Risk — Representation/freshness | Mục tiêu sản phẩm; Các vấn đề TBD — risk output/freshness | US-01 | AC-US-01-01; AC-US-01-03 | TBD | Keep as TBD | Keep as TBD | Placeholder retained until risk output/freshness is defined | Static traced; business decision deferred |
| C4-HDR-023 | Recommendation — Fit/ranking/data gaps | Mục tiêu sản phẩm; Các vấn đề TBD — matching/workload | US-02 | AC-US-02-01; AC-US-02-03 đến AC-US-02-05 | TBD | Keep as TBD | Keep as TBD | No matching formula/weights added | Static traced; business decision deferred |
| C4-HDR-024 | Simulation — Scenario/constraints | Các vấn đề TBD — allocation unit/constraints | US-03; US-04 | AC-US-03-03; AC-US-04-01 | TBD | Keep as TBD | Keep as TBD | Candidate remains context, not validated scenario | Static traced; business decision deferred |
| C4-HDR-025 | Impact — Metrics/baseline/scope | Phạm vi MVP — expected impact; detail TBD | US-03 | AC-US-03-01 | TBD | Keep as TBD | Keep as TBD | Impact placeholder retained | Static traced; business decision deferred |
| C4-HDR-026 | Decision — Preconditions/apply timing | Phạm vi MVP — PM decision; apply boundary TBD | US-04 | AC-US-04-01; AC-US-04-04 | TBD | Keep as TBD | Keep as TBD | Accept remains distinct from apply success | Static traced; production decision deferred |
| C4-HDR-027 | Toàn luồng — Failure/recovery | Các vấn đề TBD — failure/retry/recovery | US-01 đến US-04 | AC-US-01-02; AC-US-02-04; AC-US-03-04; AC-US-04-06; AC-US-04-07 | TBD | Keep as TBD | Keep as TBD | No retry/recovery rule added | Static traced; business decision deferred |
| C4-HDR-028 | Simulation/Decision — Stale/repeat | Các vấn đề TBD — freshness/repeated decisions | US-03; US-04 | AC-US-03-05; AC-US-04-04; AC-US-04-05 | TBD | Keep as TBD | Keep as TBD | No freshness/idempotency rule added | Static traced; business decision deferred |
| C4-HDR-029 | PM Decision — No-decision lifecycle | PM Accept/Reject; no implicit acceptance | US-03; US-04 | AC-US-04-03 | TBD | Keep as TBD | Keep as TBD | No draft/history/expiry behavior added | Static traced; business decision deferred |
| C4-HDR-030 | AI/Data — Model and dataset choices | Các vấn đề TBD — label/metric/matching/demo data | Không có story triển khai thuật toán | Không có AC xác nhận thuật toán | TBD | Keep as TBD | Keep as TBD | No AI/ML implementation | Not applicable to Chapter 4 implementation |
| C4-HDR-031 | Cross-role — Identity/Auth/RBAC | Người dùng mục tiêu; User Account khác Employee; technical auth TBD | US-05; US-06; US-07 | AC-US-07-01; AC-US-07-03 | TBD | Keep as TBD | Keep as TBD | Role Preview remains non-security prototype control | Static boundary verified; implementation deferred |
| C4-HDR-032 | DEV — Write/simulation capability | Người dùng mục tiêu — DEV read scope | US-06 | AC-US-06-04; AC-US-06-05 | TBD | Keep as TBD | Keep as TBD | No DEV write/simulation action added | Static absence verified; capability deferred |

## 3. Bao phủ User Story

| User Story | Review ID bao phủ | Trạng thái |
| --- | --- | --- |
| US-01 — Project Risk | C4-HDR-001 đến C4-HDR-005; C4-HDR-021, C4-HDR-022, C4-HDR-027 | Có traceability; 002/005 awaiting re-review |
| US-02 — Resource Recommendation | C4-HDR-006 đến C4-HDR-008; C4-HDR-021, C4-HDR-023, C4-HDR-027 | Có traceability; 008 awaiting re-review |
| US-03 — What-if Simulation | C4-HDR-008 đến C4-HDR-011; C4-HDR-024 đến C4-HDR-029 | Có traceability; 008/010 awaiting re-review |
| US-04 — PM Decision | C4-HDR-012; C4-HDR-024, C4-HDR-026 đến C4-HDR-029 | Có traceability; design approved, business TBD retained |
| US-05 — HR Workspace | C4-HDR-013, C4-HDR-014, C4-HDR-021, C4-HDR-031 | Có traceability; design approved, technical TBD retained |
| US-06 — DEV Workspace | C4-HDR-015, C4-HDR-016, C4-HDR-021, C4-HDR-031, C4-HDR-032 | Có traceability; design approved, capability TBD retained |
| US-07 — Role-based Workspace | C4-HDR-013, C4-HDR-015, C4-HDR-017 đến C4-HDR-020, C4-HDR-031 | Có traceability; 019 browser-verified; 020 vẫn Pending do chưa có screen-reader/human decision |

## 4. Conflict register

| Conflict ID | Nguồn 1 | Nguồn 2 | Khác biệt | Ảnh hưởng UI | Review ID liên quan | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- |
| C4-CONFLICT-01 | `COURSE_PROGRESS.md` — Mốc cuối tuần hiện tại | Chapter 4 README; commit `1fa4d47`; component Frontend | Tài liệu tiến độ nói workspace ba vai trò chưa triển khai, baseline mới cho thấy đã có prototype | Báo cáo tiến độ có thể gây hiểu sai, nhưng không đổi requirement | C4-HDR-013, C4-HDR-015, C4-HDR-017 | Pending; không sửa `COURSE_PROGRESS.md` trong lượt này |
| C4-CONFLICT-02 | `operations-overview-ui-design.md` — Quyết định ở mức bản mẫu | `three-role-workspace-ui-design.md`; `App.tsx` | Nguồn cũ đặt Nhân sự trong điều hướng PM; nguồn mới đặt Nhân sự trong HR | Kiến trúc thông tin và ranh giới role | C4-HDR-013, C4-HDR-018 | Resolved in Chapter 4 UI docs: HR scope retained; không suy ra RBAC |

## 5. Kiểm tra tính toàn vẹn

- Review ID dự kiến: C4-HDR-001 đến C4-HDR-032.
- Classification hợp lệ: 20 `GIAO DIỆN ĐỀ XUẤT`, 12 `TBD`.
- Review Status hiện tại: 15 `Approved`, 5 `Pending`, 12 `Keep as TBD`, 0
  `Rejected`. Approval có provenance và không thay thế verification.
- Không có ánh xạ US/AC giả. Khi không có căn cứ trực tiếp, ma trận ghi rõ
  “Không có” hoặc sử dụng TBD tương ứng.
- Các bất biến PM quyết định, simulation không phá hủy dữ liệu, Accept khác
  Applied Successfully và Role Preview không phải Auth được bảo toàn.

