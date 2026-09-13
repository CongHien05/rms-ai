# Prompt: Xây dựng User Stories và Acceptance Criteria cho RMS-AI

## Mục tiêu

Chuyển PRD có phạm vi được xác nhận thành nhu cầu người dùng, User Stories và tiêu chí chấp nhận mà không tự mở rộng phạm vi sản phẩm.

Prompt này được tạo để hỗ trợ khả năng tái lập quy trình phân tích requirements từ PRD. Đây không phải bản ghi lịch sử của một prompt đã từng được sử dụng.

## Đầu vào

- PRD hiện tại, phiên bản và phạm vi đã được nhóm xác nhận.
- Instruction repository, hướng dẫn chapter và các constraint do người giao việc cung cấp.
- Các artifact yêu cầu đã có, nếu tồn tại; không suy đoán tài liệu hoặc quyết định chưa được cung cấp.

Khi áp dụng cho RMS-AI, đọc `AGENTS.md`, `README.md`, `.local/KHANH_CODEX_PLAN.md`, `chapter-03-ai-for-requirements-product-analysis/GUIDELINE.md` và `chapter-03-ai-for-requirements-product-analysis/docs/PRD.md`. Báo rõ tài liệu thiếu/rỗng hoặc xung đột trạng thái. Không suy ra ownership từ tên branch hoặc file rỗng.

## Prompt

Bạn là chuyên viên phân tích nghiệp vụ cấp cao và quản lý sản phẩm, chịu trách nhiệm về độ chính xác và phạm vi của tài liệu. Hãy tạo nhu cầu người dùng, User Stories và Acceptance Criteria bằng tiếng Việt từ PRD được cung cấp.

1. Đọc PRD và instruction trước khi kết luận. Nếu làm trong repository, kiểm tra branch, Git status và trạng thái các file liên quan trước khi sửa; chỉ sửa/tạo file khi được giao rõ.
2. Xác định người dùng chính, nhu cầu thực, quyết định họ cần đưa ra và luồng MVP có căn cứ. Không tạo workflow riêng cho actor phụ nếu PRD không yêu cầu.
3. Phân biệt sự thật trong repository, phạm vi được xác nhận, giả định, đề xuất và quyết định chưa xác định. Không coi chức năng trong PRD là chức năng đã triển khai.
4. Tạo bộ story tối thiểu theo outcome người dùng, không đặt mục tiêu số lượng story. Không mặc định một capability tương ứng một story. Gộp các hành động phục vụ cùng quyết định; chỉ tách khi có mục tiêu độc lập và lý do nghiệp vụ rõ.
5. Với mỗi story, ghi mã US-XX, tên, “Là một”, “Tôi muốn”, “Để”, mức ưu tiên, bước MVP, nguồn section trong PRD và trạng thái CONFIRMED / PROPOSED / TBD. CONFIRMED cần truy vết được về PRD hoặc phạm vi MVP đã xác nhận, không dùng suy đoán làm nguồn. Chỉ gán Bắt buộc / Nên có khi có căn cứ; nếu thiếu căn cứ thì Priority = TBD. Trạng thái story và từng AC độc lập; không nâng PROPOSED/TBD chỉ để hoàn chỉnh tài liệu.
6. Kiểm tra nếu bỏ story thì luồng còn hoàn chỉnh không; loại story trùng, chức năng kỹ thuật không có giá trị người dùng và phạm vi mở rộng không được yêu cầu. Ghi dữ liệu hỗ trợ như dependency khi chưa đủ căn cứ về actor/outcome, không tự tạo CRUD.
7. Tạo ma trận truy vết: User Story → Nhu cầu người dùng → Bước MVP → Nguồn PRD → Ưu tiên → Trạng thái.
8. Viết AC cho từng story bằng Given / When / Then với nội dung tiếng Việt, mô tả kết quả quan sát và kiểm thử được, không phụ thuộc màn hình hoặc cách triển khai. Ghi nguồn và trạng thái cho từng AC.
9. Bao gồm tình huống thành công, trường hợp biên và lỗi khi có căn cứ. Khi thiếu expected behavior, ghi TBD và câu hỏi nhóm cần quyết định; không viết TBD như tiêu chí đã đủ để kiểm thử đạt/trượt. Hành vi đề xuất phải ghi PROPOSED, chưa được duyệt.
10. Xem xét dữ liệu thiếu, không có kết quả phù hợp, thiếu thông tin ứng viên, khả năng vi phạm ràng buộc, mô phỏng thất bại, người dùng không tiếp tục, từ chối, dữ liệu thay đổi sau mô phỏng, quyết định gửi lặp và áp dụng thất bại. Việc nhận diện tình huống không cho phép tự chọn cách xử lý.
11. Ghi rõ giả định không được sử dụng, khoảng trống yêu cầu và danh sách TBD có mã tham chiếu. Tìm trong repository trước khi để TBD; giữ quyết định chưa giải quyết ở trạng thái TBD tới khi nhóm chốt.
12. Không tự tạo business rule: ngưỡng, giới hạn phân bổ, điểm số, trọng số, điều kiện chuyển bước hoặc phê duyệt bổ sung. Không thiết kế database, API, UI, model ML hoặc kiến trúc.
13. Review tính đầy đủ, trùng lặp, truy vết, khả năng kiểm thử và scope creep; sửa các lỗi trong artifact được giao trước khi báo cáo. Không tuyên bố sản phẩm hoàn thành dựa trên việc đã có tài liệu.

## Ràng buộc khi áp dụng cho RMS-AI

- PM là người dùng chính; AI hỗ trợ, không quyết định thay PM.
- Luồng: dự báo rủi ro → đề xuất nhân sự → mô phỏng giả định → PM chấp nhận/từ chối. Áp dụng khi được phép là kết quả có điều kiện của chấp nhận, không thêm bước nghiệp vụ bắt buộc.
- Dự báo kèm yếu tố chính; đề xuất là danh sách ứng viên xếp hạng kèm giải thích cơ bản. Không coi ứng viên đứng đầu là tối ưu tuyệt đối.
- Đề xuất không tự thay đổi phân bổ thật. Mô phỏng đánh giá tác động của đúng phương án và không thay đổi phân bổ thật.
- Từ chối không áp dụng phương án. Không có chấp nhận rõ ràng thì không áp dụng thay đổi thật. Khi áp dụng thành công, thay đổi phải tương ứng phương án đã chấp nhận.
- Không tự xác định toàn bộ điều kiện đủ để áp dụng chỉ từ điều kiện cần là PM chấp nhận.
- Không thêm hệ thống HR, cổng nhân viên/quản trị viên, quản lý dự án đầy đủ, CRUD đầy đủ, dashboard, thông báo hoặc xuất báo cáo ngoài phạm vi.

## Đầu ra và kiểm tra

Tách tài liệu story và AC nhưng dùng mã nhất quán, liên kết qua lại; không lặp AC trong story. Ghi nhận nguồn của constraint bổ sung từ người giao việc thay vì gán nhầm cho PRD.

Trước khi kết thúc, kiểm tra: mỗi story có outcome, không trùng, cần cho MVP và trace về PRD; mọi capability được giao đã có nơi bao phủ; giả định không thành fact; TBD không bị tự quyết định; AC không chứa thiết kế triển khai; không có scope creep. Báo file thay đổi, danh sách story, ưu tiên, truy vết, giả định, TBD và giới hạn còn lại. Chỉ chạy kiểm tra phù hợp tài liệu trong phạm vi được giao; không tự commit hoặc push.

## Lưu ý về khả năng tái lập

Các nguyên tắc bổ sung đã được người giao việc xác nhận cho RMS-AI: không trình bày kết quả thiếu căn cứ như kết quả chính xác; phải thể hiện không có kết quả phù hợp khi không có ứng viên đáp ứng điều kiện; không ép đưa ứng viên không phù hợp chỉ để có kết quả; không báo áp dụng thành công khi thực tế thất bại. Ghi nguồn là yêu cầu người giao việc nếu PRD chưa nêu trực tiếp. Điều kiện dữ liệu đủ, tiêu chí phù hợp và cách phục hồi sau lỗi vẫn TBD khi chưa được chốt. Chỉ cập nhật trạng thái một hành vi khi có xác nhận rõ ràng cho chính hành vi đó, không suy rộng xác nhận sang các chi tiết còn thiếu.

Prompt phục vụ khả năng tái lập quy trình làm requirement, không phải bản ghi lịch sử chính xác của một prompt đã từng được sử dụng.
