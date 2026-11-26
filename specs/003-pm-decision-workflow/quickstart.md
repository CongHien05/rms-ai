# Quickstart nghiệm thu — PM Decision Workflow

Chỉ chạy các lệnh dưới đây khi được giao triển khai. [Ma trận AT](plan.md#ma-trận-kiểm-thử)
và [API contract](contracts/pm-decision-api.md) là nguồn kết quả kỳ vọng.

## Unit và HTTP E2E với test double

- Tại `backend/` chạy `npm test`, `npm run test:e2e`, `npm run build` và `npm run lint`. Unit kiểm ký/xác minh token, chuẩn hóa dữ liệu 001, nhánh retry và thứ tự giao dịch. HTTP E2E dùng guard/pipe thật, thay repo/transaction ở lớp DB, kiểm scope, status, hold/retry và lời gọi ghi. Test double không xác nhận hành vi lock hay constraint MariaDB.
- Tại `frontend/` chạy `npm test`, `npm run build` và `npm run lint`. Dùng fake clock và deferred response kiểm stale, đổi dự án, logout và retry. Tại `ai-service/` chạy `.venv/Scripts/python.exe -m unittest discover -v`.
- Ghi số liệu 167 baseline từng lớp và các ca mới. Giữ các assertion của What-if và Auth, gồm retry, lỗi DTO/ownership và các giá trị thập phân.

## Runtime trên MariaDB clone và Chrome

1. Khôi phục bản sao từ backup được duyệt. Xác minh đích bằng `SELECT DATABASE()` và đối chiếu charset/collation/engine. Lưu snapshot theo PK của Project, Sprint, Task, Employee, Skill, EmployeeSkill, UserAccount và AuthSession trước khi khởi động app hoặc thao tác phiên. Trong `backend/`, chạy `npm run build`, rồi `npm run migration:local -- --transaction each` chỉ sau khi đối chiếu cấu hình đích clone. So số hàng, cột baseline và fingerprint trước/sau, xác minh unique/FK trên bảng mới. Không xuất dữ liệu nhạy cảm của tài khoản hay phiên ra log/báo cáo.
2. Cấp `WHAT_IF_DECISION_SIGNING_KEY` ngoài Git độc lập với khóa What-if đã có. Khởi động `npm run start:local` trong Backend và `npm run dev -- --host 127.0.0.1` trong Frontend, cùng origin cấu hình Auth 002. Dùng fixture clone hai PM, hai Project, HR, DEV, availability đúng tuần và đủ Skill.
3. Trong Chrome chạy What-if trên hai lượt, ghi ACCEPT và REJECT, reload và đối chiếu lịch sử với DB. Gọi trực tiếp API cho phiên hết hạn, role sai, Project khác và token bị sửa, rồi đối chiếu mã tình trạng với contract. Đổi quyền trên một fixture clone đã xác minh để kiểm PM hiện phụ trách được đọc bản ghi của PM cũ và PM cũ mất quyền. Đây là thao tác fixture, không phải chức năng mới.
4. Gửi hai request đồng thời cho cùng lượt mới, một đợt cùng lựa chọn và một đợt đối nghịch. Kiểm một hàng duy nhất, 201 rồi 200 hoặc 409 theo lựa chọn đã thắng. Trong clone, tạo lỗi sau INSERT trước commit bằng test hook chỉ dùng cho nghiệm thu và kiểm rollback, sau đó retry và đối chiếu nguồn lực.
5. Dùng proxy nghiệm thu giữ/bỏ response sau commit. Đổi availability hoặc link trên fixture clone, khởi động lại Backend với cùng cấu hình, retry cùng bằng chứng và xác nhận 200 trả đúng ID. Thử lựa chọn đối nghịch trả 409. Với lượt mới, đổi availability/tuần/Skill trước khi ghi phải trả stale. Kiểm lượt chưa ghi tiếp tục dùng được sau restart cùng khóa, thử khóa thiếu hoặc thay trên môi trường nghiệm thu tách biệt.
6. Đo tác động trước/sau bằng row count/fingerprint của tập bản ghi nguồn lực liên quan, tách khỏi việc chuẩn bị fixture. Ghi riêng bằng chứng unit, HTTP E2E test double và runtime thật theo AT. Giữ database dev gốc nguyên trạng.

Tại `backend/`, dùng `node --env-file=<env-riêng-của-clone> test/runtime/pm-decisions.mariadb.mjs <mode>`.
Chọn `baseline` nếu restore từ bản trước Auth 002 và cần thêm fixture Account/Session,
`migrate` hoặc `recovery` để kiểm DDL, `runtime` để chạy HTTP, và `browser` để chạy Chrome.
Đặt `PM003_CLONE_DATA_DIRECTORY` là datadir riêng dưới `.local/`, dùng TCP
loopback ngoài cổng 3306 và schema riêng theo mẫu `rms_ai_pm003_<nhãn>_clone`
hoặc `rms_ai_pm003_<nhãn>_recovery`. Chế độ `browser` cần
`PM003_CHROME_PATH` và các cổng 3193, 5193, 9237 trống. Với Chrome dành
riêng cho test đang chạy, đặt `PM003_TEST_CHROME_PORT` để dùng browser context mới.
Chế độ runtime dùng
trigger chỉ trên DB clone để kiểm rollback và một proxy thử nghiệm để bỏ
phản hồi sau commit. Kịch bản tự dừng Backend và browser đã khởi động.
