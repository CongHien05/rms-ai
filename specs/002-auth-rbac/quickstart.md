# Quickstart kiểm chứng — Authentication & RBAC

Thực hiện sau khi được giao triển khai. Trong Gate 2, các lệnh dưới đây là kịch bản nghiệm thu. Tham chiếu [AT](plan.md#ma-trận-kiểm-thử), [hợp đồng](contracts/auth-rbac-api.md) và [cách chuyển tiếp](plan.md#di-trú-và-chuyển-tiếp).

## 1. Unit và HTTP E2E với test double

Trong `backend/` chạy:

```powershell
npm test
npm run test:e2e
npm run build
npm run lint
```

Trong `frontend/` chạy:

```powershell
npm test
npm run build
npm run lint
```

Trong `ai-service/` chạy `python -m unittest discover -v` với dependency đã có. Giữ mô hình đã lưu trong repo, không huấn luyện lại.

| Lớp | Bằng chứng cần lưu |
| --- | --- |
| Unit Backend | Hash, dummy verify, rate limiter với clock, sinh/kiểm digest, phiên hết hạn, revoke/reset, policy, tác động của race. Dùng cổng/thời gian kiểm soát được; diễn tập transaction DB thật riêng. |
| HTTP E2E với test double | Khởi tạo NestJS/Supertest dùng cấu hình guard và pipe như app. Chỉ thay repository/DataSource, clock hoặc transport Risk. Setup bằng fixture role, Project owner, cookie phiên, Origin; không tắt guard. Giữ assertion của 16 ca cũ, gồm `404 INVALID_SCENARIO`, UUID/DTO, Task sai Sprint, Request đúng payload và tính chỉ đọc. Dùng ma trận route để kiểm phiên, role, phạm vi, CSRF và `429`. |
| Unit Frontend và FastAPI | Giữ abort/timeout của What-if, dùng promise treo và clock giả kiểm 401/403, state phiên cũ và lỗi logout. FastAPI kiểm thông tin dịch vụ và giữ kết quả baseline. |
| Regression | Mốc lịch sử 126 = 83 Backend unit + 16 HTTP E2E test double + 27 Frontend unit. Ghi số baseline được bảo toàn và số bài bổ sung theo từng lớp. FastAPI ghi riêng. |

## 2. Chuẩn bị runtime thật trên bản sao MariaDB dev

1. Dùng bản sao MariaDB dev được cấp phép, giữ database dev gốc. Xác nhận tên DB thực qua `SELECT DATABASE()`, khôi phục thử backup trên bản sao và chụp số hàng + nội dung các cột cũ theo khóa cho sáu bảng nghiệp vụ theo plan. Lưu hiện trạng FK, engine và collation.
2. Sau khi triển khai và xác nhận đích clone, trong `backend/` chạy `npm run build` và `npm run migration:local -- --transaction each`. So sánh snapshot trước/sau DDL. Tất cả Project cũ có owner NULL. Diễn tập lỗi DDL và rerun trên bản sao phụ có cùng baseline; kiểm đầy đủ index/FK và không thay đổi cột cũ.
3. Cấu hình file local ngoài Git. Backend trỏ tới clone, `AUTH_MODE=local`, `AUTH_FRONTEND_ORIGIN=http://127.0.0.1:5173`, `AI_SERVICE_URL=http://127.0.0.1:8001`. Cấp riêng `RISK_SERVICE_TOKEN` cho hai service và giữ `WHAT_IF_CONTEXT_SECRET` của môi trường. Không ghi lại giá trị vào ảnh/log/báo cáo.
4. Trong `backend/` chạy `npm run auth:admin:local -- issue` bằng TTY có prompt ẩn. Cấp PM A, PM B, HR và hai DEV liên kết hai Employee đã xác minh. Dùng `npm run auth:admin:local -- map-projects --file <danh-sách-đã-duyệt>` với danh sách UUID của clone. Ánh xạ một Project cũ cho mỗi PM, giữ một Project cũ NULL. Chạy lại cùng lô phải no-op; lô có một cặp sai hoặc xung đột thì toàn bộ không thay đổi.
5. Khởi động Backend bằng `npm run start:local` trong `backend/`, FastAPI bằng `python -m uvicorn main:app --host 127.0.0.1 --port 8001` trong `ai-service/` với secret được cấp riêng, và Frontend bằng `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort` trong `frontend/`. Mở chính xác origin cấu hình.

## 3. Runtime E2E và kiểm sau vận hành

| Ca | Thao tác và kết quả |
| --- | --- |
| AT-01/03/04/08 | Mỗi role đăng nhập, reload, mở deep link, Logout. Workspace đúng role. Confirm logout xóa phiên hiện tại. Request sau logout nhận `401`. PM truy cập Project của mình được; với Project khác nhận thông báo quyền và phiên còn. HR/DEV sửa hash PM không vào workspace PM. Hết hạn dùng phiên thử trên clone đặt expiry đã qua sau khi login hoặc đợi hạn thật, xác nhận reload và API đều từ chối. |
| AT-05/06/07/15 | PM A tạo Project và kiểm danh sách chỉ có mục được cấp. Chạy Project → Sprint → Task và Risk → Recommendation → What-if bằng fixture thực của clone. Dùng ca kiểm quyền với Project/Sprint thuộc B và Project cũ chưa gán. B lấy proof hợp lệ từ API cho Project của B, ca HTTP quản lý fixture xác nhận A bị từ chối cùng proof, không ghi. Đối chiếu dữ liệu trước/sau What-if, gồm giờ trống, và phân biệt snapshot nâng cấp với thay đổi nghiệp vụ đã chủ động tạo. |
| AT-09/10/11/12 | HR mở Employee/Skill và đối chiếu availability theo tuần. HR không có quyền nghiệp vụ PM. Hai DEV chỉ xem hồ sơ/kỹ năng của mình và trạng thái thiếu công việc. Dùng bề mặt kiểm thử trực tiếp để xác nhận ID Employee, Project hoặc Task ngoài quyền không trả dữ liệu. |
| AT-13/16 | Health web chỉ liveness. Risk qua Backend chạy với PM được cấp, FastAPI từ request thiếu thông tin dịch vụ bị từ chối. Kiểm cookie có thuộc tính đúng cho loopback, và `Secure`/host-only ở target HTTPS. Dùng request kiểm thử với Origin sai/thiếu cho login/logout/ghi, xác nhận không thay đổi phiên hoặc dữ liệu. |
| AT-14 | Dùng hai phiên cùng Account trên hai browser context. Chạy `npm run auth:admin:local -- reset-password`, cả hai phiên trước reset mất hiệu lực và mật khẩu cũ bị từ chối. Đăng nhập bằng thông tin mới và chạy `npm run auth:admin:local -- disable`; phiên mới và lần login tiếp đều nhận `401`. Dùng phiên của Account khác để đối chứng. |

Ghi ngày, commit, tên môi trường, lớp bằng chứng và kết quả theo AT. Báo rõ ca
chưa chạy hoặc fixture thiếu. Chỉ lưu số đo/snapshot đã loại dữ liệu định danh
nhạy cảm và bí mật. Truy ngược 126 assertion cũ trước khi kết luận hồi quy đạt.
