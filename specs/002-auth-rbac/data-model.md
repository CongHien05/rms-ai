# Data model — Authentication & RBAC

Các bảng dùng InnoDB. Kiểu, chiều dài, charset và collation FK phải khớp cột đích thực tế trên bản sao dev. Thời gian lưu UTC theo mili giây. Các trường dưới đây là nguồn chuẩn để triển khai và kiểm tra.

## UserAccount · `user_accounts`

| Trường | Ràng buộc chuẩn | Ý nghĩa |
| --- | --- | --- |
| `UserAccount.id` | `varchar(36)`, UUID do Backend sinh, PK, bắt buộc. | Danh tính ổn định độc lập với Employee. |
| `UserAccount.email` | `varchar(254)` ASCII, bắt buộc, unique. Kiểm email hợp lệ dạng ASCII, trim và lowercase trước khi ghi hoặc tra; dùng collation nhị phân cho giá trị đã chuẩn hóa. | Định danh đăng nhập nội bộ. |
| `UserAccount.passwordHash` | `varchar(255)` ASCII, bắt buộc, chỉ nhận định dạng `scrypt-v1$<salt-hex>$<hash-hex>` với salt 16 byte và khóa dẫn xuất 64 byte. | Phiên bản `scrypt-v1` cố định `N=2^17, r=8, p=1`; đổi thuật toán cần phiên bản mới. Không select theo mặc định. |
| `UserAccount.role` | Bắt buộc, tập chính xác `PM`, `HR`, `DEV`. Ràng buộc DB và kiểm ở lớp quyền. | Một role do người vận hành cấp, không chọn từ UI. |
| `UserAccount.employeeId` | FK `varchar(36)` → `Employee.id`, unique khi có giá trị, `ON DELETE/UPDATE RESTRICT`. CHECK yêu cầu khác NULL khi role DEV và NULL khi role PM/HR. | Người vận hành xác minh trước khi cấp DEV. Employee vẫn tồn tại độc lập. |
| `UserAccount.disabledAt` | `datetime(3)` nullable. NULL nghĩa là hoạt động, có giá trị nghĩa là thu hồi. | Disable không xóa tài khoản hoặc quyền sở hữu đã lưu. |

## AuthSession · `auth_sessions`

| Trường | Ràng buộc chuẩn | Ý nghĩa |
| --- | --- | --- |
| `AuthSession.tokenDigest` | `char(64)` ASCII collation nhị phân, PK, bắt buộc, 64 ký tự hex lowercase SHA-256 của token ngẫu nhiên 32 byte. | Token gốc chỉ nằm trong cookie. |
| `AuthSession.accountId` | FK `varchar(36)` → `UserAccount.id`, bắt buộc, index không unique, `ON DELETE/UPDATE RESTRICT`. | Một tài khoản có thể có nhiều phiên độc lập. |
| `AuthSession.expiresAt` | `datetime(3)`, bắt buộc, index, bất biến sau khi cấp. Bằng thời điểm cấp UTC cộng 8 giờ. | Hết hạn khi `now >= expiresAt`, kể cả khi row chưa dọn. |

## Project · `projects`

| Trường | Ràng buộc chuẩn | Ý nghĩa |
| --- | --- | --- |
| `Project.pmAccountId` | FK `varchar(36)` nullable → `UserAccount.id`, index không unique, `ON DELETE/UPDATE RESTRICT`. Backend chỉ gán Account role PM đang hoạt động. | Cột NULL cho Project cũ chưa ánh xạ. Project mới do Backend ghi cùng người tạo trong một lần ghi; mỗi Project đã cấp có đúng một PM. |

Các trường và quan hệ cũ giữ nguyên. `Sprint.projectId` và `Task.sprintId` là chuỗi cha đã tồn tại, không có trường quyền mới trên Sprint/Task. Role của chủ Project là điều kiện xuyên bảng nên được kiểm khi ghi và khi đọc qua danh tính PM hiện hành. Tài khoản bị thu hồi giữ FK phục vụ toàn vẹn; các phiên của tài khoản không còn quyền. `User Account` trong spec tương ứng `UserAccount` ở đây.

## Chuyển trạng thái và tính toàn vẹn

- **Account** — Cấp một lần bằng thông tin đã xác minh. Trùng email hoặc trùng Employee của DEV bị từ chối, không biến thành thao tác sửa. Cấp lại chỉ cho tài khoản đang hoạt động, thay hash và xóa toàn bộ phiên trong cùng transaction. Disable ghi `disabledAt` và xóa phiên trong cùng transaction. Disable lặp là no-op nếu đã khóa.
- **AuthSession** — Login hợp lệ tạo token mới. Nếu trình duyệt đã gửi cookie cũ, login thành công xóa digest cũ trong cùng transaction tạo phiên mới. Các phiên khác tiếp tục theo thời hạn. Logout xóa đúng digest hiện hành. Disable/cấp lại xóa các phiên liên quan. Quét hết hạn theo index theo lô, không ảnh hưởng hiệu lực kiểm tra.
- **Project** — Sau DDL, mọi Project cũ có NULL. Chỉ lệnh vận hành với danh sách được duyệt mới điền quyền khi NULL; chạy lặp cùng cặp là no-op, khác giá trị đang có bị từ chối. Gán mới qua create luôn ghi người tạo. Kiểm toàn lô và khóa Account rồi Project theo thứ tự nhất quán trước khi ghi; rollback toàn lô khi phát hiện lỗi.
- **Tài nguyên con** — Tra Sprint đến Project trước khi lấy hoặc ghi Task, luôn ràng buộc Task theo Sprint yêu cầu. Phạm vi của DEV đến từ `UserAccount.employeeId`. Khả năng xem ngữ cảnh công việc ở 002 là trạng thái thiếu vì chưa có nguồn giao việc.

## Di trú

[Plan](plan.md#di-trú-và-chuyển-tiếp) quy định thứ tự deploy, kiểm chứng dữ liệu, diễn tập lỗi DDL và phục hồi. Không có backfill tự động hoặc tạo Account bằng dữ liệu suy đoán trong migration.
