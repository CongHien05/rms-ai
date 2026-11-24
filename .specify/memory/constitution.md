# RMS-AI Constitution

## Core Principles

### I. Đặc tả trước khi triển khai

Mỗi milestone thay đổi hành vi phải có spec được người phụ trách duyệt trước khi sửa
mã. Spec phải mô tả mục tiêu, hiện trạng, phạm vi, truy vết nguồn yêu cầu và các điểm
`TBD`. Kế hoạch kỹ thuật và danh sách tác vụ phải bám spec đã duyệt.

### II. Giữ phạm vi milestone

Mỗi thay đổi phải gắn với yêu cầu hoặc điều kiện nghiệm thu của milestone được giao.
Mở rộng phạm vi cần quyết định rõ của người có thẩm quyền. Phải ghi lại các đề xuất
phát sinh để review và giữ quy tắc chưa chốt ở trạng thái `TBD`.

### III. Bảo toàn hành vi đang hoạt động

Phải kiểm kê luồng, dữ liệu đã tồn tại và bên sử dụng hợp đồng bị tác động. Giữ hành
vi họ đang dựa vào, trừ thay đổi đã được phê duyệt. Khi thay đổi ảnh hưởng tính
tương thích ngược hoặc cần di trú, plan phải chỉ ra cách kiểm chứng dữ liệu cũ,
chuyển tiếp và khôi phục theo phạm vi được duyệt.

### IV. Đồng bộ hợp đồng xuyên hệ thống

Khi thay đổi hợp đồng, phải đối chiếu các bên liên quan trong Frontend, Backend,
Database và AI Service. Review phải kiểm tra kiểu và ý nghĩa dữ liệu, định danh,
trạng thái/lỗi và tương thích với dữ liệu đã có. Mọi khác biệt giữa tài liệu
đề xuất với hành vi hiện hành phải được ghi rõ trước khi triển khai.

### V. Dùng cấu trúc và dependency cần thiết

Phải ưu tiên module, kiểu dữ liệu, phần kiểm thử và công cụ đang dùng. Mọi
dependency, thành phần kiến trúc hoặc hạ tầng mới phải có nhu cầu trong spec và
lý do kỹ thuật được review trong plan.

### VI. Nghiệm thu bằng tiêu chí kiểm chứng được

Mỗi yêu cầu trong spec phải có Acceptance Criteria nêu điều kiện, thao tác và
kết quả quan sát được. Liên kết mã US/AC hiện có khi áp dụng. Tiêu chí dựa trên
giả định phải được xác nhận trước khi dùng để kết luận đạt hoặc trượt.

### VII. Kiểm thử theo phạm vi

Plan phải chỉ rõ cách kiểm chứng từng AC, hồi quy và các trường hợp lỗi liên quan.
Thay đổi hợp đồng hoặc luồng xuyên thành phần phải kiểm thử ranh giới bị tác động
và luồng thực tế cần nghiệm thu. Thay đổi tài liệu phải kiểm tra Git diff và liên
kết. Báo môi trường, kết quả và các lớp kiểm thử chưa chạy.

### VIII. Giữ ý nghĩa của bộ kiểm thử

Khi test thất bại, phải xác định nguyên nhân trước khi sửa. Chỉ thay đổi kỳ vọng
khi truy được tới yêu cầu đã duyệt hoặc lỗi của test, kèm lý do review. Nghiêm
cấm bỏ test, nới assertion hoặc thay kết quả kỳ vọng chỉ để đạt PASS.

### IX. Trung thực về dữ liệu và AI

Phải ghi rõ dữ liệu mock, dữ liệu tổng hợp, quy tắc xếp hạng và mô hình thực sự
được chạy. Kết quả từ dữ liệu tổng hợp chỉ chứng minh phạm vi đánh giá tương ứng.
Phải công bố nguồn dữ liệu và phạm vi đo trước khi tuyên bố độ tin cậy. Nghiêm cấm
trình bày đầu ra gán sẵn như kết quả inference hoặc suy rộng kết quả tổng hợp
thành chất lượng dự báo trên dữ liệu thực.

### X. PM giữ quyền quyết định

Luồng sản phẩm đi từ đánh giá rủi ro đến đề xuất, What-if và quyết định rõ ràng
của PM. Mô phỏng chỉ tính tác động của đúng phương án giả định và phải bảo toàn
phân bổ thật. Có chấp nhận rõ ràng mới đủ điều kiện xem xét áp dụng. Trạng thái
chấp nhận và kết quả áp dụng phải độc lập. Từ chối hoặc thiếu quyết định phải
giữ nguyên phân bổ thật. Điều kiện và thời điểm áp dụng vẫn theo quyết định
nghiệp vụ được duyệt riêng.

### XI. Bảo mật, phân quyền và toàn vẹn dữ liệu

Phải giữ secrets ngoài Git và chỉ sử dụng dữ liệu cần cho mục đích được duyệt.
Khi milestone liên quan đến truy cập hoặc ghi thật, plan và kiểm thử phải chứng
minh kiểm tra quyền phía server, cô lập đúng đối tượng và bảo toàn dữ liệu khi
lỗi, thao tác lặp hoặc thay đổi đồng thời theo contract đã duyệt. Role Preview
chỉ phục vụ trình bày giao diện. Cơ chế Auth/RBAC và ánh xạ User Account ↔
Employee phải đi qua phê duyệt riêng.

### XII. Cập nhật chapter sau mỗi milestone

Phải cập nhật README của chapter phù hợp với mục tiêu, vai trò hoặc prompt của
AI, quyết định của con người, bằng chứng đã chạy và phần còn chờ review. Cập nhật
`COURSE_PROGRESS.md` khi trạng thái chung thay đổi và dẫn về minh chứng gốc.

### XIII. Báo cáo giới hạn kiểm chứng

Mọi kết luận về hành vi phải nêu căn cứ là tài liệu, mã nguồn, kiểm tra từng
được ghi nhận hay lần chạy hiện tại. Với bằng chứng chạy, ghi lệnh hoặc kịch bản,
môi trường và kết quả. PASS với mock, prototype hoặc test double chỉ áp dụng
trong điều kiện đó. Bằng chứng lịch sử phải có ngày, mốc hoặc nguồn đối chiếu.

### XIV. Giữ quyền quyết định thao tác Git

Chỉ commit, push hoặc merge khi người dùng yêu cầu rõ. Mọi hook hoặc workflow
phải tuân thủ quyền này và các giới hạn Git trong `AGENTS.md`. Mốc chờ review
kết thúc bằng Git diff, kết quả kiểm tra và trạng thái còn mở.

## Căn cứ và phạm vi

[AGENTS.md](../../AGENTS.md) hướng dẫn thao tác trong repository. Constitution
bổ sung các điều kiện viết spec, lập plan và review milestone. Các hành vi nghiệp
vụ phải truy về phần đã xác nhận trong [PRD](../../chapter-03-ai-for-requirements-product-analysis/docs/PRD.md),
[User Stories](../../chapter-03-ai-for-requirements-product-analysis/docs/user-stories.md)
và [Acceptance Criteria](../../chapter-03-ai-for-requirements-product-analysis/docs/acceptance-criteria.md).
Giữ ý nghĩa các nhãn `CONFIRMED`, `PROPOSED UI`, `PROPOSED DEMO` và `TBD`.

## Review và minh chứng

Review spec kiểm tra phạm vi, truy vết và AC. Review plan kiểm tra tác động
hợp đồng, tính tương thích, dữ liệu, bảo mật và phạm vi kiểm thử. Review kết
quả đối chiếu diff, từng AC và bằng chứng chạy rồi ghi nhận trong chapter
liên quan. Khi có mâu thuẫn nghiệp vụ nghiêm trọng, phải dừng phần việc và
báo nguồn mâu thuẫn để người phụ trách quyết định.

## Governance

Đề xuất sửa Constitution phải ghi nội dung, lý do, tác động tới spec/plan đang
dùng và cách chuyển tiếp nếu cần. Người phụ trách dự án phê chuẩn, ghi ngày và
phiên bản trước khi áp dụng. Dùng SemVer với MAJOR cho thay đổi nguyên tắc không
tương thích, MINOR cho nguyên tắc hoặc mục mới hay hướng dẫn được mở rộng đáng
kể, PATCH cho làm rõ không đổi nghĩa.

Người review milestone phải đối chiếu spec, plan, kết quả và bằng chứng với
Constitution cùng `AGENTS.md`. Nếu thấy xung đột, báo người phụ trách trước
khi tiếp tục phần bị ảnh hưởng. Mọi thay đổi yêu cầu nghiệp vụ phải được duyệt
trong tài liệu nguồn trước khi cập nhật spec dẫn chiếu.

**Version**: 1.0.0 | **Ratified**: 2026-11-25 | **Last Amended**: 2026-11-25
