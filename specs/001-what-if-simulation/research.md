# Research — What-if Simulation

## Chứng thực ngữ cảnh đề xuất

**Quyết định** Dùng HMAC SHA-256 với `node:crypto`, ký ngữ cảnh từng ứng
viên đủ điều kiện trên response đề xuất. Dùng cùng khóa dev ổn định cho
phát và xác minh. Proof có phiên bản kỹ thuật và không chứa giờ trống.

**Lý do** `findAvailableForSkill` chỉ trả hồ sơ đúng tuần với giờ dương.
Nếu dùng nó để xác minh tư cách vào lúc chạy, hệ thống không phân biệt được
ứng viên từng được đề xuất nhưng vừa mất khai báo (AT-05) với đầu vào sai.
Đối chiếu proof trước, dữ liệu hiện hành sau giúp làm rõ cả hai.

**Phương án đã xem xét** Tái chạy danh sách khi mô phỏng không chứng minh
ứng viên từng xuất hiện và làm sai ca thiếu dữ liệu. Cache trong tiến trình
mất khi Backend khởi động lại. Lưu bảng đề xuất để tra cứu vượt phạm vi.
Proof ký bằng khóa ổn định cho phép retry sau khi dịch vụ hồi phục. Đổi
khóa làm proof cũ vô hiệu và yêu cầu lấy lại đề xuất.

## Nguồn dữ liệu và tính tương thích

**Quyết định** Đọc một tập hồ sơ đúng kỹ năng để giữ nguyên thứ hạng đồng
thời phát hiện thiếu tuần/giờ khi kết quả rỗng. Ở lượt mô phỏng, đọc một hồ
sơ nhân sự cùng trạng thái liên kết kỹ năng, kỳ availability và giờ trống.

**Lý do** Lọc giờ dương ở truy vấn cũ làm mất dữ liệu phân loại AT-03/05.
Sử dụng cùng tập đọc để lọc và phân loại tránh hai truy vấn thấy hai mốc
khác nhau. Scope hiện tại có một dòng Employee cho kỳ availability khai
báo. Hai lần chạy có thể thấy hai giá trị khác nhau và mỗi lần trả đúng
giá trị đã dùng.

**Phương án đã xem xét** Đọc danh mục HR toàn bộ rồi lọc phía client lấy
thêm dữ liệu và trao quyết định cho trình duyệt. Giữ query lọc cũ rồi
thêm một truy vấn trạng thái chỉ khi rỗng có thể phân loại theo dữ liệu vừa
đổi. Thay schema theo tuần nằm ngoài milestone.

## Độ chính xác của phép tính giờ

**Quyết định** Giữ số JSON và kiểu nguồn DOUBLE hiện có. Dùng chuỗi thập
phân ngắn nhất của từng `number` sau parse (`Number.toString()`), hỗ trợ
biểu diễn số mũ. Chuẩn hóa về hệ số `BigInt` và thang thập phân chung cho
so sánh/trừ. Đưa giá trị về JSON number một lần ở phản hồi. Dữ liệu nhập
không bị làm tròn trước khi kiểm tra vượt giới hạn.

**Lý do** Bảo toàn phạm vi số hữu hạn hiện tại, giữ được số giờ lẻ và tránh
nhiễu như `0.3 - 0.1` ở các giá trị demo. Độ chính xác đầu vào đã phụ
thuộc vào số JS/DOUBLE. Contract không hứa bảo toàn nguyên văn chữ số vượt
khả năng biểu diễn của JSON number trong ứng dụng.

**Phương án đã xem xét** Phép trừ Number thuần có thể hiển thị sai số nhị
phân. Làm tròn hai chữ số hoặc dùng epsilon có thể hợp thức hóa số giờ vượt
giới hạn. Decimal SQL hoặc thư viện decimal thêm schema/dependency. Phương
án đã chọn không đặt thêm ngưỡng giờ hoặc số chữ số nhập.

## Lượt chạy giao diện và cách chứng minh chỉ đọc

**Quyết định** Dùng revision cục bộ, `runId` mới mỗi lượt và snapshot
Server để liên kết kết quả. Dùng deferred promises trong Node test để
điều khiển thứ tự success/error/finally, dùng Supertest cho hợp đồng và
MariaDB dev để đối chiếu SQL trước/sau.

**Lý do** Hủy network không bảo đảm callback cũ hết hiệu lực. Mỗi suite
chứng minh một ranh giới khác nhau. Supertest đang dùng repository thay
thế. Chapter 8 đã có bằng chứng Recommendation thật trên MariaDB dev
và là căn cứ chọn fixture, chưa có kết quả chạy What-if.

**Phương án đã xem xét** Chỉ kiểm thử trình duyệt khiến race khó lặp.
Chỉ dựa vào suite có test double không chứng minh luồng đọc dữ liệu thật.
Xác nhận `ProjectAllocation` đòi hỏi entity vận hành ngoài phạm vi.

Nguồn đối chiếu mã cục bộ gồm [EmployeesService](../../backend/src/employees/employees.service.ts),
[kiểu Employee](../../backend/src/employees/employee.entity.ts),
[HTTP E2E hiện tại](../../backend/test/app.e2e-spec.ts),
[test guard hiện tại](../../frontend/test/task-load-guard.test.mjs)
và [bằng chứng runtime Chapter 8](../../chapter-08-ai-software-testing/README.md).
