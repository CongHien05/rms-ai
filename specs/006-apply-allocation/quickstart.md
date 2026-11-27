# Quickstart nghiệm thu — Apply Allocation 006

Các bước dành cho lượt triển khai được duyệt. Dùng [API contract](contracts/apply-allocation-api.md)
và [ma trận AT](plan.md#ma-trận-kiểm-thử) để đối chiếu.

1. Tại `backend/` chạy `npm test`, `npm run test:e2e`, `npm run build` và `npm run lint`. Tại `frontend/` chạy `npm test`, `npm run build` và `npm run lint`. Tại `ai-service/` chạy `.venv/Scripts/python.exe -m unittest discover -v`. Đối chiếu đủ ý nghĩa 188 test. Unit kiểm exact, version và state. HTTP dùng guard/DTO thật, thay DB ở tầng repo/transaction. Test double không chứng minh khóa MariaDB.
2. Restore backup được duyệt vào MariaDB clone tách biệt. Đối chiếu `SELECT DATABASE(), @@port, @@datadir`, version, engine và FK trước ghi. Snapshot theo PK Project, Sprint, Task, Employee, Skill, EmployeeSkill, UserAccount, AuthSession, PMDecision. Không xuất nội dung credential hay token. Trỏ cấu hình ngoài Git vào clone, chạy `npm run migration:local -- --transaction each` trong `backend/`. So số hàng và fingerprint chín bảng. Kiểm ba bảng mới, sau đó diễn tập trên clone recovery với DDL đã tạo một phần và chạy lại.
3. Mở Backend qua `npm run start:local` và Vite qua `npm run dev -- --host 127.0.0.1` với Auth local trên clone. Tạo fixture hai PM, hai Project, HR, DEV và một Employee có quỹ cùng tuần, Skill hợp lệ. Chụp quỹ trước/sau What-if, ACCEPT và Apply. Chỉ Apply làm giảm giờ còn lại. Lặp với v1, REJECT, PM không sở hữu, PM hiện tại của quyết định do PM trước ghi, Skill/tuần/giờ đổi và các giá trị thiếu/0/âm.
4. Tại `backend/`, chạy `node --env-file=<file-env-clone> test/runtime/apply-allocation.mariadb.mjs` sau khi có task runtime. Kịch bản phải xác minh clone trước mọi ghi. Dùng hai kết nối HTTP đồng thời cho hai PM khác Project, tổng yêu cầu vượt quỹ, rồi hai request cùng decisionId. Xem kết quả, số hàng và quỹ exact. Kiểm unique độc lập trên clone.
5. Trên clone gây lỗi trước commit bằng fixture DB tách riêng, kiểm rollback cả allocation và lịch sử thành công. Mô phỏng mất phản hồi sau commit bằng proxy nghiệm thu, đổi nguồn lực, khởi động lại, đối chiếu GET và retry POST. Mô phỏng ngắt kết nối ở commit và kiểm không có FAILED giả. Test hook chỉ ở môi trường nghiệm thu. Kiểm cả nhánh rollback đã xác nhận và commit đã thành công.
6. Chrome kiểm Apply từ quyết định lưu, pending, timeout chưa xác nhận, replay, lịch sử, đổi Project/logout, HR xem giờ exact và DEV giữ quyền 002. Ghi bằng chứng riêng theo lớp kiểm thử, runtime, migration và tính nguyên vẹn dữ liệu. Giữ database dev gốc nguyên trạng.

Kịch bản 006 nhận chế độ `baseline`, `migration`, `recovery`, `runtime`
hoặc `browser`. Dùng hai schema clone riêng, port 33308 và
`PM006_CLONE_DATA_DIRECTORY`. Chế độ browser cần `PM006_CHROME_PATH`
và các cổng loopback 3196, 5196, 9238 trống.
