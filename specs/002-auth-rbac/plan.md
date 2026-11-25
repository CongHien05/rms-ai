# Implementation Plan — Authentication & RBAC

**Nhánh** `codex/002-auth-rbac` · **Ngày** 2026-11-26 · **Baseline** `75404caf5de104dd0e1fb15e232e9bd4f2101776`

**Đầu vào** [Spec D1–D3](spec.md#clarifications) · [Research](research.md) · [Data model](data-model.md) · [API/ma trận](contracts/auth-rbac-api.md) · [Quickstart](quickstart.md)

## Summary

NestJS xác thực cookie phiên opaque dựa trên MariaDB và kiểm tra đúng một role. Service kiểm tra PM phụ trách Project trước mọi luồng nghiệp vụ, kể cả Sprint/Task và What-if. DEV có endpoint đọc bản thân từ Account đã xác minh. React giữ trạng thái phiên trong bộ nhớ và dựng workspace dựa trên danh tính từ Backend. DDL cộng thêm và ánh xạ có duyệt giữ ID, dữ liệu và response nghiệp vụ cũ.

## Technical Context

| Mục | Thiết kế |
| --- | --- |
| Stack hiện có | Node 24, NestJS/Express, TypeScript, TypeORM/`mysql2`, MariaDB dev, React/Vite, FastAPI Risk. Dùng `node:crypto`, response cookie của Express và truy vấn TypeORM hiện có. Không thêm dependency. |
| Quy mô | Một tiến trình Backend cho 002, cùng origin web và `/api`. Một truy vấn indexed để nhận diện phiên và Account, một hoặc các truy vấn có điều kiện cho ownership, không tải toàn bộ Project để lọc trong bộ nhớ. Giữ giới hạn chờ hiện có của RiskClient và What-if. |
| Phạm vi | 21 route NestJS baseline, 4 route mới, 3 workspace và quy trình vận hành nội bộ. Không có đăng ký công khai, Admin UI, giao việc, ProjectAllocation, PM Decision, Apply Allocation, huấn luyện, OAuth hoặc MFA. |
| Nghiệm thu | Backend unit Vitest, HTTP E2E Supertest với test double, Frontend Node test có clock/deferred promise, FastAPI unittest và runtime Browser → Vite → NestJS → MariaDB dev trên bản sao. Giữ 126 test lịch sử gồm 83 unit Backend, 16 HTTP E2E và 27 unit Frontend. [Minh chứng trước đó](../../chapter-08-ai-software-testing/README.md#kiểm-chứng-what-if-001-2026-11-25) |

## Constitution Check

| Nguyên tắc | Trước research và sau thiết kế |
| --- | --- |
| I–II | D1–D3 APPROVED trong nguồn yêu cầu và spec. Thiết kế giữ phạm vi MVP và dừng tại Gate 2. |
| III–IV | Ma trận kiểm kê mọi route hiện có. Di trú, trạng thái lỗi, React, NestJS, MariaDB và FastAPI có điều kiện chuyển tiếp và kiểm chứng. API cho caller cũ thêm phiên và Origin theo contract. |
| V–VI | Dùng stack, dependency và cấu trúc hiện có. Mỗi FR liên kết AC và AT; kết quả, điều kiện và phạm vi định danh được nêu rõ. |
| VII–VIII | Giữ 126 test và assertion nghiệp vụ. Chỉ cập nhật setup xác thực/ownership, Origin và khóa tích hợp khi cần. Unit, HTTP E2E test double và runtime thật có minh chứng riêng. |
| IX–XI | Risk giữ mô hình demo hiện tại, What-if vẫn chỉ đọc. Ba vùng quyền có kiểm phía server. Tài khoản, digest, rate limiting, Origin và chuyển tiếp dữ liệu được thiết kế để kiểm thử. |
| XII–XIV | Chapter và chỉ mục tiến độ dẫn về hồ sơ này. Gate 2 chỉ xác nhận thiết kế và kiểm tra tài liệu. Thao tác Git giới hạn ở kiểm tra. |

## Project Structure

- `specs/002-auth-rbac/` chứa spec, research, data model, contract, quickstart và tasks.
- `backend/src/auth/` thêm module Auth, model Auth, policy, guard, đọc hồ sơ DEV và CLI nội bộ. `backend/src/database/` đăng ký entity và DDL. Controller/service Project, Sprint, Task, Employee, Skill và EmployeeSkill giữ cách phân lớp hiện có.
- `frontend/src/auth/` thêm Login, API client và quản lý phiên. `frontend/src/App.tsx` và `frontend/src/layout/AppShell.tsx` chọn workspace và logout. Các caller nghiệp vụ tiếp tục dùng module hiện có.
- `backend/test/`, `frontend/test/`, `ai-service/test_risk.py` là điểm mở rộng kiểm thử. `backend/src/projects/risk-client.ts` và `ai-service/main.py` đồng bộ kiểm thông tin dịch vụ nội bộ, giữ model, input/output và timeout.

## Phiên, thông tin đăng nhập và vận hành

1. **Cấu hình.** `AUTH_MODE=local` chỉ dùng origin loopback và Backend bind loopback. Môi trường HTTPS dùng `AUTH_MODE=https`, cùng origin với proxy `/api`. `AUTH_FRONTEND_ORIGIN` là origin cấu hình chính xác. Bản MVP dùng địa chỉ từ socket; nếu có proxy tin cậy, chỉ bật IP forwarding cho proxy đã xác định và proxy phải ghi đè giá trị do client gửi. Cookie, mật khẩu, hash, digest, token dịch vụ và proof không vào log. `RISK_SERVICE_TOKEN`, khóa What-if và cấu hình DB lấy từ môi trường ngoài Git. Cấu hình thiếu/sai làm Auth fail closed; DB lỗi trả lỗi hệ thống, React che workspace và cho thử lại.
2. **Login.** Chuẩn hóa email trước khi tra, khống chế body và áp dụng quota trước KDF. Dùng async scrypt `N=2^17,r=8,p=1`, salt ngẫu nhiên 16 byte, khóa 64 byte, `maxmem=256 MiB`, so sánh constant-time. Tối đa 2 KDF đồng thời mỗi tiến trình, dùng dummy hash cùng chi phí cho email chưa tồn tại hoặc Account đã khóa. Giới hạn 5 lần/email và 30 lần/địa chỉ nguồn mỗi 15 phút, tính mọi yêu cầu hợp lệ về hình thức được nhận cho xác minh. Bản đồ tối đa 10.000 khóa, dọn hết hạn rồi từ chối khóa mới nếu vẫn đầy. `429` kèm `Retry-After` tới khi có thể thử lại, tối thiểu 1 giây khi hết slot KDF. Đo bộ nhớ và độ trễ trên môi trường nhận tải dự kiến, không nới KDF để che quá tải.
3. **Cấp phiên.** Sau khi KDF hoàn thành, transaction khóa hàng Account và xác nhận trạng thái còn hoạt động và hash vừa kiểm vẫn khớp. Sinh token mới và lưu digest với hạn 8 giờ. Nếu login thành công có cookie cũ, xóa phiên của cookie cũ trong cùng transaction. Các phiên khác vẫn hoạt động. Chỉ gửi cookie sau commit.
4. **Xác minh và kết thúc.** `AuthenticationGuard` đọc đúng một cookie có định dạng hợp lệ, lấy phiên live kèm Account active và danh tính do server tạo. Tiếp tục kiểm role/policy rõ ràng, không mặc định mở route chưa khai báo. Logout xóa phiên theo digest hiện tại, sau commit mới trả thành công và xóa cookie. Cấp lại mật khẩu hoặc thu hồi khóa cùng hàng Account và xóa mọi phiên trong transaction thay thông tin đăng nhập hoặc trạng thái. Mọi kiểm quyền bắt đầu sau commit thu hồi đều từ chối phiên cũ. Request đã qua kiểm quyền trước commit có thể hoàn tất. Không gia hạn ngầm. Dọn phiên hết hạn theo lô qua CLI nội bộ.
5. **CLI vận hành.** `auth:admin:local` có `issue`, `reset-password`, `disable`, `map-projects` và `prune-expired` cho người vận hành đã được cấp quyền DB. Cấp DEV từ Employee UUID đã xác minh; mỗi Account chỉ nhận một role. Mật khẩu nhập bằng prompt TTY ẩn, không truyền qua argv, file mapping hoặc log. Từ 15 đến 128 ký tự và tối đa 512 byte UTF-8 khi cấp; xác minh nguyên văn. Cấp lại chỉ áp dụng cho Account active. Mapping nhận danh sách đã duyệt gồm Project UUID và PM Account UUID; kiểm cả batch trước khi ghi. Giai đoạn này không có API quản trị hay chức năng sửa role.
6. **Cookie và Origin.** Theo [API contract](contracts/auth-rbac-api.md#cookie-origin-và-lỗi). Áp dụng guard Origin cho thao tác có thể thay đổi trạng thái, kể cả login/logout, và các POST nghiệp vụ chỉ đọc để đồng nhất policy. Sau xác thực/phân quyền role và trước service đối với route bảo vệ. Login chỉ mở bước xác thực credential, qua Origin trước KDF. Bảo toàn thứ tự kiểm tra DTO/UUID so với dữ liệu nghiệp vụ cho request có phiên và Origin hợp lệ.

## Quyền tài nguyên và tích hợp

- **NestJS.** Dùng hai guard toàn cục theo thứ tự Authentication → Authorization, policy khai báo tường minh cho từng handler. Route mới thiếu policy bị từ chối. `AuthOriginGuard` kiểm origin trên phương thức không an toàn. Controller lấy principal từ guard, ghép DTO và gọi service.
- **PM.** `ProjectsService` lọc theo `pmAccountId` và cung cấp kiểm quyền cho các luồng Project, kể cả Risk, Recommendation, What-if trước đọc nguồn, gọi FastAPI hoặc kiểm proof. `SprintsService` bảo vệ qua Project từ path/quan hệ. `TasksService` dùng Sprint đã kiểm và luôn lookup Task theo cặp ID + Sprint. UUID/DTO không hợp lệ vẫn `400` sau guard. ID hợp lệ thiếu Project/Sprint giữ `404`; Project tồn tại nhưng khác chủ hoặc chưa ánh xạ trả `403`. Task không thấy trong Sprint đã được phép trả `404` chung, không tra Task toàn cục. Riêng Project mất sau tạo proof giữ `404 INVALID_SCENARIO` theo What-if 001.
- **HR và DEV.** Bảo toàn các thao tác HR hiện có, quyền PM đọc danh mục `GET /skills`. Bề mặt DEV đọc Account đã xác thực và chiếu đúng Employee/Skill của mình, không nhận ID từ client. Mọi route Project/Employee hiện có khác vẫn đóng với DEV, workspace Công việc hiển thị thiếu ngữ cảnh. [Ma trận đầy đủ](contracts/auth-rbac-api.md#ma-trận-endpoint)
- **React.** Khi tải trang, gọi `GET /auth/me` trước khi mount workspace. Login/Logout và mọi caller nghiệp vụ đi qua API client cùng origin. Giữ tín hiệu abort, timeout đọc body, retry thủ công và bảo vệ phản hồi đến muộn của What-if. Thế hệ phiên gắn với mọi request: sau logout, `401` hoặc đổi phiên, bỏ phản hồi cũ kể cả `401`, dọn state và không tự gửi lại thao tác ghi. `403` tài nguyên giữ phiên và hiển thị thông báo đúng workspace. Deep link `#projects`/`#project/:id` chỉ phục hồi cho PM, dùng API kiểm Project. Thay bộ chọn/đổi role trong shell bằng Login/Logout. Nội dung mock còn dùng khi xem minh họa tuân theo quyền workspace.
- **FastAPI.** Proxy web chỉ chuyển `/api` tới NestJS. FastAPI bind loopback hoặc mạng riêng, xác minh `RISK_SERVICE_TOKEN` dùng giữa RiskClient và `POST /risk/predict`. Chỉ dùng HTTP cho loopback, HTTPS cho địa chỉ nội bộ khác. RiskClient không theo redirect. Kiểm secret trước inference, không truyền cookie hoặc role người dùng. `GET /health` chỉ liveness. Giữ dữ liệu/timeout/phân loại lỗi upstream hiện có cho luồng hợp lệ. Không đổi logic tính Risk.

## Di trú và chuyển tiếp

1. **Diễn tập trước.** Dùng bản sao dev được phép, xác nhận đích qua `SELECT DATABASE()`, chụp backup có thể khôi phục, kiểm FK type/collation và engine, lưu số hàng và snapshot các cột hiện có theo PK của Project/Sprint/Task/Employee/Skill/EmployeeSkill. Không sao chép credential thật làm fixture. Giữ `synchronize=false`, `migrationsRun=false`.
2. **DDL cộng thêm.** Tạo `user_accounts`, `auth_sessions`, thêm FK/index nullable `projects.pmAccountId`. Không sửa hay xóa cột cũ; mọi hàng cũ vẫn giữ nguyên, cột mới NULL. Dùng TypeORM chế độ transaction `each`, tắt transaction cho DDL này vì MariaDB tự commit DDL. Kiểm kết quả từng bước theo tên bảng/index/FK; nếu fail giữa chừng, giữ ingress đóng, kiểm đối tượng đã tạo rồi hoàn tất bước còn thiếu sau khi xác minh schema. Không đánh dấu migration thành công khi schema chưa khớp.
3. **Cắt chuyển.** Đóng ingress bảo vệ trước khi thay Backend/DB. Deploy Backend có guard, FastAPI giới hạn nội bộ, và Frontend có Login. Cấp Account qua quy trình nội bộ. Áp dụng danh sách ánh xạ D2 trong giao dịch riêng, chỉ điền quyền còn trống và kiểm PM active. Project cũ chưa ánh xạ mặc định bị khóa. So sánh snapshot các cột cũ, kiểm ca âm và ba workspace trước khi mở ingress. Client cũ phải gửi cookie phiên và Origin phù hợp khi gọi thao tác ghi. Các route và payload nghiệp vụ hợp lệ giữ nguyên.
4. **Khôi phục.** Nếu lỗi trước mở traffic, giữ ingress đóng, giữ DDL cộng thêm và sửa tiến. Diễn tập phục hồi từ backup trên bản sao nếu schema/dữ liệu sai. Sau mở traffic, ưu tiên sửa tiến và khóa ingress khi quyền sai. Không chạy Backend baseline có route công khai sau mở quyền, không xóa dữ liệu đã phát sinh hoặc tự gán tất cả Project để mở lại. Phục hồi dữ liệu phải đối chiếu thay đổi kể từ backup trước khi đưa vào dùng.

## Ma trận kiểm thử

AT là ca/nhóm ca sẽ được thực thi sau Gate 2. Ma trận định nghĩa mục tiêu ca, không ghi kết quả chạy hiện tại.

| AT | AC | FR/SC | Cách kiểm |
| --- | --- | --- | --- |
| AT-01 | 002-AC-01 | FR-001/002/004, SC-001/004 | HTTP bootstrap và Runtime cả PM, HR, DEV đăng nhập, reload, đúng role. |
| AT-02 | 002-AC-02 | FR-001, SC-001 | Unit hash/dummy/clock/quota, HTTP `401` giống nhau cho mật khẩu sai/email lạ/Account disabled, `429` và `Retry-After` theo email, nguồn và trần KDF. Email hoa và thường chung quota. |
| AT-03 | 002-AC-03 | FR-002/004, SC-001/004 | HTTP mọi route bảo vệ với thiếu/sai/duplicate cookie, hết hạn và token bị xóa. Khi kho phiên lỗi, HTTP `503` và workspace không mở. Unit clock biên và Frontend bỏ phản hồi của phiên cũ. |
| AT-04 | 002-AC-04 | FR-002/004, SC-001/004 | HTTP logout đúng phiên, cookie xóa đúng, phiên thứ hai giữ nguyên, replay cũ `401`; Runtime logout và Unit UI mất mạng/late response. |
| AT-05 | 002-AC-05 | FR-005/008, SC-002/003 | HTTP + Runtime hai PM, PM tạo Project, danh sách và Sprint/Task được cấp quyền, response và hành vi baseline. |
| AT-06 | 002-AC-06 | FR-003/005/008/009, SC-002/003 | HTTP + Runtime Risk, Recommendation, What-if ở Project được gán, lỗi nghiệp vụ và snapshot trước/sau, bao gồm `404 INVALID_SCENARIO` khi Project biến mất và quota không đổi nghiệp vụ. |
| AT-07 | 002-AC-07 | FR-003/005/009, SC-002 | HTTP ma trận sai role/phạm vi, PM A → Project hoặc Sprint/Task của B, role/ID giả lập trong client, Project chưa ánh xạ, proof thật của B bị từ chối với A và không gọi downstream. |
| AT-08 | 002-AC-08 | FR-003/004, SC-004 | Unit trạng thái UI và Runtime deep link/hash, `401` về Login, `403` giữ phiên, không có đường Role Preview. |
| AT-09 | 002-AC-09 | FR-006/008, SC-003 | HTTP các quyền HR hợp lệ. Runtime HR xem Skill và availability, gồm 0 giờ/thiếu/khác tuần, đối chiếu nguồn. |
| AT-10 | 002-AC-10 | FR-003/006/008, SC-002/003 | HTTP PM/DEV không đọc/ghi Employee ngoài quyền; HR không gọi nghiệp vụ PM. Danh mục Skill PM vẫn dùng được. |
| AT-11 | 002-AC-11 | FR-007, SC-004 | HTTP hai DEV, đúng Employee & Skills từ Account; Runtime Công việc hiển thị thiếu ngữ cảnh. |
| AT-12 | 002-AC-12 | FR-003/007, SC-002/004 | HTTP gọi ID Employee khác, yêu cầu Project/Sprint/Task, ghi hoặc chèn `employeeId`/role qua query/header/body. Không trả dữ liệu khác; lỗi input đúng contract. |
| AT-13 | 002-AC-13 | FR-009, SC-002 | Unit FastAPI/RiskClient cho khóa nội bộ, từ chối redirect, Runtime qua mạng/proxy đúng triển khai và kiểm `GET /health` chỉ liveness. |
| AT-14 | 002-AC-14 | FR-001/002, SC-001 | Unit CLI/tranh chấp login-reset/disable, HTTP nhiều phiên trước/sau, MariaDB thật xác nhận transaction, duplicate DEV và mọi phiên đã cấp bị thu hồi. |
| AT-15 | 002-AC-15 | FR-005/008, SC-002/003 | MariaDB dev clone so sánh cột cũ trước/sau, thử batch lỗi/ghi lặp và gián đoạn DDL, quyền khi cột NULL, giữ khóa dữ liệu. Chạy lại 126 test baseline. |
| AT-16 | 002-AC-16 | FR-003, SC-002 | HTTP và Runtime Origin sai/thiếu/null cho login, logout và ghi, cookie tampering, thử đúng Origin để đối chứng. |

## Phases

- **Phase 0** [Research](research.md) chốt thiết kế và lựa chọn thay thế.
- **Phase 1** [Data model](data-model.md), [API contract](contracts/auth-rbac-api.md) và [Quickstart](quickstart.md) kiểm tương thích xuyên hệ thống.
- **Phase 2** Tasks theo US và Analyze chỉ đọc. Gate 2 dừng tại tài liệu; test, MariaDB và Browser bắt đầu khi có lượt triển khai riêng.

## Complexity Tracking

Không có ngoại lệ Constitution. Opaque token và hạn mức một tiến trình ưu tiên đơn giản cho MVP; bước triển khai cần xác nhận tải, môi trường cookie và quyền vận hành trên dev clone.
