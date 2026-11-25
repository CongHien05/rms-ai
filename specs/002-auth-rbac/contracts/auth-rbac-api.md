# Hợp đồng API — Authentication & RBAC

Gate 2 · [Spec](../spec.md) · [Plan](../plan.md) · [What-if 001](../../001-what-if-simulation/contracts/what-if-api.md)

Các đường dẫn trong ma trận là NestJS. Trình duyệt gọi cùng origin với prefix `/api`, proxy bỏ prefix, giữ Origin và cookie, chuyển Set-Cookie nguyên nghĩa. Đây là thiết kế 002; caller tích hợp phải gửi phiên hợp lệ và Origin phù hợp khi chuyển tiếp.

## Cookie, Origin và lỗi

- HTTPS phát cookie `__Host-rms_session`, `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`, host-only không có `Domain`. Loopback ở chế độ local dùng tên khác `rms_session_dev` và chỉ bỏ `Secure` cho HTTP loopback. Cookie mang opaque token base64url không padding, đúng 43 ký tự từ 32 byte ngẫu nhiên. Backend từ chối cookie cùng tên xuất hiện nhiều lần, ngoài định dạng hoặc không khớp phiên đang hoạt động.
- Set-Cookie khi login có `Max-Age=28800`, tương ứng thời hạn tuyệt đối trên server. Logout xóa cookie cùng tên/thuộc tính đường dẫn với `Max-Age=0` sau xóa phiên. Không phát cookie mới ở `GET /auth/me`. Auth và route bảo vệ trả `Cache-Control: no-store` kể cả khi lỗi; không trả token trong JSON hoặc url.
- Tất cả HTTP method ngoài `GET`, `HEAD`, `OPTIONS` phải có một `Origin` đúng origin cấu hình, khớp scheme, host, port. Từ chối Origin thiếu, `null`, nhiều giá trị hoặc khác origin. Login/logout và POST read-only đều áp dụng. Không đổi dữ liệu qua GET, không mở CORS có credentials, không suy ra Origin tin cậy từ Host do caller khai.
- Với route bảo vệ, xác minh phiên trước policy role, sau đó Origin nếu áp dụng, rồi validation và kiểm phạm vi tài nguyên. Login kiểm Origin trước KDF. JSON hỏng cú pháp có thể bị HTTP parser từ chối `400` trước guard. `400` từ DTO/UUID hiện có giữ nguyên cho request đã qua guard.
- `401` với phiên không hợp lệ hoặc sai thông tin đăng nhập. Dùng body `{statusCode, code, message}` với `UNAUTHENTICATED` hoặc `INVALID_CREDENTIALS`. Login không phân biệt phản hồi cho email chưa tồn tại, mật khẩu sai hoặc Account disabled. `403` với role/phạm vi không hợp lệ (`FORBIDDEN`) hoặc Origin không hợp lệ (`ORIGIN_FORBIDDEN`), không đưa tên, role của người khác hoặc dữ liệu tài nguyên vào phản hồi.
- `429` ở login có mã `LOGIN_RATE_LIMITED` và header `Retry-After` tính theo giây. Cùng policy cho email đã biết và chưa biết. Nếu kho phiên hoặc dữ liệu Auth không khả dụng, trả `503 AUTH_UNAVAILABLE` và không suy ra phiên hợp lệ. Lỗi nghiệp vụ hiện có vẫn dùng envelope/mã của endpoint, gồm `404 INVALID_SCENARIO` của What-if 001 khi Project mất sau đề xuất.

## Route Auth mới

| Route | Yêu cầu | Thành công |
| --- | --- | --- |
| `POST /auth/login` | JSON chỉ có `email` và `password` kiểu string. Email chuẩn hóa theo data model, mật khẩu kiểm nguyên văn, độ dài từ 1 đến 128 ký tự và tối đa 512 byte UTF-8 ở bước xác minh. Input sai cấu trúc `400`, nội dung có body nhưng media type khác JSON `415`. Phản hồi sai credential, CSRF và quota theo mục trên. Cookie cũ được thay và phiên cũ tương ứng bị xóa khi login thành công. | `200` với `{accountId, role}` và Set-Cookie. |
| `GET /auth/me` | Cookie phiên active. | `200` với `{accountId, role}`, role trong PM/HR/DEV, `accountId` là UUID. |
| `POST /auth/logout` | Cookie phiên active, Origin hợp lệ, body trống. | `204` và xóa cookie sau khi xóa phiên. Lặp với phiên đã hết trả `401`; Client xem đó là phiên đã kết thúc. |
| `GET /auth/me/employee` | Phiên DEV, không có path ID hoặc query. Query gồm trường tự khai bị `400`. Backend chỉ chọn Employee theo Account; header client tự khai identity/role không được dùng. | `200` với `{employee: {id, displayName}, skills: [{id, name}], workContext: {status: "unavailable"}}`. Employee/Skill ID là UUID; Skills có thể `[]`. Không có giờ trống, hồ sơ khác hoặc Project/Sprint/Task trong response. |

## Ma trận endpoint

PM-own nghĩa là PM đã xác thực và `Project.pmAccountId` bằng Account của họ.
Tài nguyên con kế thừa phạm vi qua Project. Dấu — là `403` khi phiên hợp lệ.
Trừ Login và health, thiếu phiên hợp lệ là `401`. Policy toàn cục từ chối
theo mặc định khi có route mới thiếu khai báo.

| NestJS route | Quyền | PM | HR | DEV |
| --- | --- | --- | --- | --- |
| `GET /health` | Liveness không chứa dữ liệu nghiệp vụ | Công khai | Công khai | Công khai |
| `POST /projects` | Tạo Project, Backend gán Account đang gọi | ✓ | — | — |
| `GET /projects` | Liệt kê Project đã gán cho caller | PM-own | — | — |
| `GET /projects/:projectId` | Đọc Project | PM-own | — | — |
| `POST /projects/:projectId/risk-assessments` | Đánh giá Risk | PM-own | — | — |
| `POST /projects/:projectId/resource-recommendations` | Xem Recommendation | PM-own | — | — |
| `POST /projects/:projectId/simulations` | What-if chỉ đọc, chứng minh quyền trước HMAC | PM-own | — | — |
| `POST /projects/:projectId/sprints` | Tạo Sprint | PM-own | — | — |
| `GET /projects/:projectId/sprints` | Đọc Sprint của Project | PM-own | — | — |
| `POST /sprints/:sprintId/tasks` | Tạo Task trong Sprint của Project | PM-own | — | — |
| `GET /sprints/:sprintId/tasks` | Đọc Task qua Sprint của Project | PM-own | — | — |
| `PATCH /sprints/:sprintId/tasks/:taskId` | Cập nhật Task gắn với đúng Sprint đã kiểm | PM-own | — | — |
| `POST /employees` | Tạo Employee | — | ✓ | — |
| `GET /employees` | Liệt kê Employee | — | ✓ | — |
| `GET /employees/availability` | Đọc availability theo tuần, phân biệt null/0 | — | ✓ | — |
| `GET /employees/:employeeId` | Đọc Employee theo ID cho HR | — | ✓ | — |
| `POST /employees/:employeeId/skills` | Gán Skill cho Employee | — | ✓ | — |
| `GET /employees/:employeeId/skills` | Đọc Skill của Employee theo ID cho HR | — | ✓ | — |
| `POST /skills` | Tạo Skill | — | ✓ | — |
| `GET /skills` | Đọc danh mục, gồm bộ chọn Recommendation của PM | ✓ | ✓ | — |
| `GET /skills/:skillId` | Đọc chi tiết Skill | — | ✓ | — |
| `POST /auth/login` | Xác minh thông tin nội bộ trước cấp phiên | Trước phiên | Trước phiên | Trước phiên |
| `GET /auth/me` | Danh tính do Backend xác minh | Tự thân | Tự thân | Tự thân |
| `POST /auth/logout` | Kết thúc phiên caller đang dùng | Tự thân | Tự thân | Tự thân |
| `GET /auth/me/employee` | Đọc hồ sơ DEV dựa trên Account | — | — | Tự thân |

Với PM và Origin hợp lệ, Project/Sprint đã mất giữ lỗi `404` chung.
Project tồn tại ngoài phạm vi hoặc chưa ánh xạ trả `403`, gồm route con.
Sau khi kiểm Sprint đã được cấp, Task thiếu hoặc sai cặp Task–Sprint trả
`404` theo baseline. API không tra Task ngoài Sprint đó để phân biệt.

## Hợp đồng nội bộ FastAPI

`POST /risk/predict` nằm ngoài 25 route NestJS. Không proxy trực tiếp cho Frontend.
RiskClient gửi header `X-Risk-Service-Token` lấy từ `RISK_SERVICE_TOKEN`; bí mật
32 byte base64url được cấp riêng cho đúng hai service. FastAPI so sánh constant-time
trước inference. Header thiếu/sai nhận `401`, cấu hình service thiếu/sai nhận
`503`. RiskClient dùng HTTP cho loopback, HTTPS cho địa chỉ nội bộ khác,
giữ timeout 4 giây và không theo redirect; HTTP 3xx được xử lý như lỗi upstream
không thành công. Header nội bộ không xuất hiện trong phản hồi người dùng.
FastAPI `GET /health` vẫn kiểm liveness nội bộ.
