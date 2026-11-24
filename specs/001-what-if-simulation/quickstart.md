# Quickstart kiểm chứng — What-if Simulation

Hướng dẫn này áp dụng **sau khi triển khai**. Gate 2 chưa có kết quả
kiểm thử What-if. Dùng [ma trận theo AT](plan.md#ma-trận-kiểm-thử) để ghi
nhận lớp bằng chứng và đọc [hợp đồng HTTP](contracts/what-if-api.md) nếu
cần đối chiếu phản hồi.

## Unit và HTTP E2E với test double

Chạy trong `backend/` với dependency hiện có:

```powershell
npm test
npm run test:e2e
npm run lint
npm run build
```

Chạy trong `frontend/`:

```powershell
npm test
npm run lint
npm run build
```

Unit xác minh phép tính, decimal, trạng thái nguồn và điều phối lượt chạy.
HTTP E2E khởi tạo NestJS bằng Supertest với repository thay thế. Ghi
riêng số test đạt/trượt theo hai lớp. Ca HTTP gồm DTO lồng sai, proof
không khớp, giả mạo availability, 8→4 giờ sau đề xuất, lỗi và retry. Dùng
spy và snapshot test double để kiểm tra không có thao tác ghi. Hồi quy
đề xuất kiểm tra lọc, thứ hạng, đồng hạng, lỗi và dữ liệu cũ. Test UI dùng
deferred promise để tái lập success/error/finally đến muộn, đổi đầu vào
trong lúc chờ, đổi rồi quay lại giá trị cũ và retry cùng phương án.

## Runtime E2E với MariaDB dev

1. Xác nhận `backend/.env` ở local trỏ đúng database dev `rms_ai_pm_dev`
   đã có schema và instance hiện có đang chạy. Kiểm tra `SELECT DATABASE()`
   trước khi quan sát dữ liệu. Dùng khóa What-if 32 byte base64url ổn định
   trong file local này. Có thể tạo giá trị bằng
   `node -p "require('node:crypto').randomBytes(32).toString('base64url')"`
   trong terminal cục bộ. Không đưa giá trị khóa vào log, Git hoặc báo cáo.
2. Từ `backend/` chạy `npm run build` và `npm run start:local`. Từ
   `frontend/` chạy `npm run dev -- --host 127.0.0.1`. Mở chi tiết dự án PM
   có thật từ `/#projects`. What-if không cần khởi động AI Service.
3. Xác định dự án, kỹ năng, nhân sự và **tuần ghi trong nguồn**. Chapter 8
   từng dùng tuần `2026-11-16`, TypeScript và ứng viên có 12,5 giờ và 4 giờ.
   Kiểm tra dữ liệu còn tồn tại và dùng đúng tuần ghi trên hàng. Không lấy
   mặc định tuần hiện tại để thay thế. Nếu không có fixture phù hợp, báo
   ca Runtime chưa chạy và giữ nguyên kết quả từ các lớp khác.
4. Chụp dữ liệu nguồn trước thao tác, chạy các ca bên dưới rồi chụp lại
   cùng tập hàng. Dùng truy vấn có điều kiện với các UUID dev đã xác minh.
   Sắp thứ tự theo khóa và so sánh toàn bộ hàng/cột được đọc giữa hai mốc.
   Không chạy seed, migration hoặc cập nhật dữ liệu thật để tạo ca lỗi
   cho quickstart này.

```sql
SELECT id, name FROM projects WHERE id = '<project-id>';
SELECT id, displayName, availabilityWeekStart, availableHours
FROM employees WHERE id IN ('<employee-id-a>', '<employee-id-b>')
ORDER BY id;
SELECT employeeId, skillId
FROM employee_skills
WHERE employeeId IN ('<employee-id-a>', '<employee-id-b>')
ORDER BY employeeId, skillId;
SELECT id, name FROM skills WHERE id = '<skill-id>';
```

| Ca Runtime | Thao tác | Kết quả kỳ vọng nếu fixture khớp |
| --- | --- | --- |
| AT-01 | Đề xuất nhu cầu 8 giờ, chọn người có 12,5 giờ trống và xác nhận 8 giờ. Lặp lại với 9 giờ và một số giờ lẻ như 0,1. | Lần đầu trả 8 hỗ trợ, 0 thiếu, 4,5 trống giả định. Ca 9 giờ trả 9/0/3,5. Ca 0,1 giờ trả 0,1/7,9/12,4. Mỗi kết quả thuộc đúng ứng viên và tuần. |
| AT-02 | Cùng nhu cầu 8 giờ, chọn người còn 4 giờ và xác nhận hỗ trợ 4 giờ. | 4 hỗ trợ, 4 thiếu, 0 trống giả định. |
| AT-03 | Chạy lại đề xuất hợp lệ và đề xuất cho ngữ cảnh có tập phù hợp rỗng đã xác minh. | Thứ hạng, nội dung hỗ trợ và phân trang vẫn hoạt động. Empty hiển thị riêng và chưa thể chọn ứng viên. |
| AT-04 | Đặt giờ hỗ trợ trên mức nguồn và xác nhận. | Báo phương án không hợp lệ, giữ giờ đã nhập và không có tác động. |
| AT-08 | Sau khi chạy, thay đầu vào hoặc chọn người khác và quan sát trước lần xác nhận tiếp theo. | Kết quả vừa xem được đánh dấu cũ và không hiển thị như tác động hiện tại. Lần xác nhận mới dùng đầu vào mới. |

Đối chiếu network của một ca thành công với contract. Request trình duyệt
phải đến `/api/projects/{projectId}/simulations`, response 200 có run ID,
snapshot và ba chỉ báo. Luồng What-if không gọi AI Service và không mở bước
quyết định. Nếu diễn tập lỗi HTTP hoặc đảo thứ tự phản hồi trong trình duyệt,
ghi rõ có can thiệp network. Các ca đổi giờ nguồn giữa hai lượt, null,
sai tuần và lỗi truy vấn được bao phủ có chủ đích bằng HTTP test double
khi fixture dev không tái lập được.

Ghi vào Chapter 8 lệnh/kịch bản, môi trường, test count, kết quả
trước/sau và ca chưa chạy. SQL xác nhận các hàng nguồn lực dev không đổi
trong các lần được quan sát. Mức bằng chứng này chưa chứng minh
`ProjectAllocation` vận hành.
