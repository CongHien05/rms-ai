# Tiêu chí chấp nhận RMS-AI

Tài liệu đi cùng [User Stories](user-stories.md), dựa trên [PRD v0.1](PRD.md). Các mã TBD tham chiếu bảng quyết định chưa xác định trong tài liệu User Stories.

## Quy ước và căn cứ

- CONFIRMED: hành vi có căn cứ từ PRD; nguồn ghi tại từng tiêu chí.
- PROPOSED: tiêu chí đề xuất để nhóm review, không phải điều kiện nghiệm thu đã được duyệt.
- TBD: tình huống đã nhận diện nhưng chưa xác định được kết quả kỳ vọng. Phần Then ghi quyết định còn thiếu, không được dùng như kiểm thử đạt/trượt.
- Given / When / Then lần lượt diễn đạt điều kiện có trước / hành động hoặc sự kiện / kết quả quan sát được.
- Điều kiện dữ liệu đủ hoặc áp dụng được phép trong tình huống thành công không tự định nghĩa ràng buộc dữ liệu/phân bổ; xem TBD-01, TBD-04 và TBD-06.
- Các tiêu chí dưới đây kiểm tra hành vi, không chứng minh độ chính xác mô hình hay khả năng giảm rủi ro thực tế. Không có ngưỡng, trọng số hoặc thiết kế kỹ thuật được chốt thêm.

## AC-US-01 — Xem và hiểu rủi ro bàn giao dự án

### AC-US-01-01 — Kết quả dự báo và giải thích — CONFIRMED

**Nguồn:** PRD — Mục tiêu sản phẩm; Phạm vi MVP — Dự báo rủi ro dự án.

**Given:** Có dữ liệu cần thiết và một kết quả dự báo thành công cho dự án PM đang xem.

**When:** PM xem kết quả dự báo của dự án đó.

**Then:** Kết quả thể hiện ước lượng nguy cơ không đáp ứng kế hoạch/thời hạn bàn giao của chính dự án đó, kèm các yếu tố chính giải thích kết quả ở mức khái quát. Cách biểu diễn cụ thể còn ở TBD-02.

### AC-US-01-02 — Thiếu dữ liệu hoặc không đánh giá được — TBD

**Nguồn khoảng trống:** PRD — Các vấn đề chưa quyết định; TBD-01, TBD-07.

**Given:** Dữ liệu cần thiết bị thiếu/không hợp lệ hoặc quá trình đánh giá không tạo được kết quả.

**When:** PM yêu cầu xem rủi ro.

**Then:** TBD — nhóm cần xác định điều kiện dữ liệu đủ, cách báo không đánh giá được và khả năng tiếp tục. Không mặc định thiếu dữ liệu tương đương rủi ro thấp.

### AC-US-01-03 — Kết quả không còn cập nhật — TBD

**Nguồn khoảng trống:** TBD-02.

**Given:** Dữ liệu dự án đã thay đổi kể từ lần đánh giá.

**When:** PM xem kết quả cũ.

**Then:** TBD — nhóm cần xác định mức độ cập nhật cần thiết và cách xử lý kết quả cũ; chưa yêu cầu tự chạy lại hoặc tự chặn luồng.

## AC-US-02 — Cân nhắc ứng viên được đề xuất

### AC-US-02-01 — Nhận danh sách có thứ hạng và giải thích — CONFIRMED

**Nguồn:** PRD — Người dùng mục tiêu — PM; Phạm vi MVP — Đề xuất nhân sự.

**Given:** Có dữ liệu cần thiết và việc đề xuất tạo được danh sách ứng viên cho nhu cầu dự án.

**When:** PM yêu cầu đề xuất nhân sự cho dự án đó.

**Then:** PM nhận được danh sách ứng viên có thứ hạng; mỗi ứng viên có giải thích cơ bản về mức độ phù hợp để giảm rủi ro hoặc bù thiếu hụt kỹ năng/nguồn lực của dự án.

Thứ hạng hỗ trợ cân nhắc, không chứng minh ứng viên đầu tiên tối ưu tuyệt đối. Căn cứ: PRD — Tổng quan sản phẩm xác định AI hỗ trợ và PM quyết định; nguyên tắc không đồng nhất thứ hạng với tối ưu tuyệt đối cũng được người giao việc yêu cầu rõ. Không đặt công thức hay tiêu chí kiểm thử tối ưu tuyệt đối.

### AC-US-02-02 — Đề xuất không tự phân bổ — CONFIRMED

**Nguồn:** PRD — Tổng quan sản phẩm; Phạm vi MVP — PM chấp nhận / từ chối.

**Given:** PM chưa chấp nhận rõ ràng thay đổi phân bổ.

**When:** Hệ thống cung cấp danh sách đề xuất hoặc PM xem danh sách đó.

**Then:** Phân bổ thật không thay đổi do việc cung cấp/xem đề xuất; thứ hạng không được xem là sự chấp nhận của PM.

### AC-US-02-03 — Không có ứng viên phù hợp — PROPOSED

**Nguồn khoảng trống:** PRD chưa quy định kết quả rỗng; TBD-03. Đây là đề xuất cần review, không phải quy tắc đã được phê duyệt.

**Given:** Quá trình đề xuất hoàn tất và không tìm thấy ứng viên theo tiêu chí phù hợp sẽ được nhóm chốt.

**When:** PM nhận kết quả đề xuất.

**Then:** Đề xuất thể hiện rõ không có ứng viên phù hợp và không trình bày một ứng viên khác như kết quả phù hợp thay thế. Hành động tiếp theo của PM và tiêu chí phù hợp vẫn TBD.

### AC-US-02-04 — Thiếu thông tin hoặc không tạo được đề xuất — TBD

**Nguồn khoảng trống:** TBD-01, TBD-03, TBD-07.

**Given:** Thiếu thông tin mức độ sẵn sàng/khối lượng công việc của ứng viên, hoặc quá trình đề xuất thất bại.

**When:** PM yêu cầu đề xuất.

**Then:** TBD — xác định việc loại/giữ ứng viên thiếu thông tin, cách thể hiện độ thiếu và phân biệt lỗi với kết quả rỗng. Không mặc định ứng viên đang rảnh hoặc tự gán giá trị thiếu.

## AC-US-03 — Đánh giá phương án bằng mô phỏng

### AC-US-03-01 — Xem tác động của đúng phương án — CONFIRMED

**Nguồn:** PRD — Phạm vi MVP — Mô phỏng giả định.

**Given:** Có một phương án thay đổi phân bổ xác định và dữ liệu cần thiết cho mô phỏng.

**When:** PM chạy mô phỏng và quá trình mô phỏng thành công.

**Then:** Kết quả cho biết tác động dự kiến của chính phương án đã mô phỏng, để PM xem xét trước quyết định thật. Chỉ báo tác động và mốc so sánh cụ thể thuộc TBD-05.

### AC-US-03-02 — Mô phỏng không phá hủy dữ liệu — CONFIRMED

**Nguồn:** PRD — Phạm vi MVP — nguyên tắc không phá hủy dữ liệu.

**Given:** Có trạng thái phân bổ thật trước khi mô phỏng và không có thay đổi thật độc lập trong tình huống kiểm tra.

**When:** PM chạy/xem mô phỏng, kể cả khi mô phỏng thất bại.

**Then:** Trạng thái phân bổ thật sau hoạt động mô phỏng giữ nguyên so với trước đó; mô phỏng không được tự áp dụng phương án.

### AC-US-03-03 — Phương án có khả năng vi phạm ràng buộc — TBD

**Nguồn khoảng trống:** TBD-04.

**Given:** Phương án có khả năng xung đột với khả năng sẵn sàng, khối lượng công việc hoặc ràng buộc phân bổ.

**When:** PM muốn mô phỏng phương án đó.

**Then:** TBD — nhóm xác định ràng buộc và hành vi khi vi phạm; chưa chọn cảnh báo, chặn hoặc vẫn mô phỏng. Không đặt giới hạn phân bổ hoặc ngưỡng bất kỳ.

### AC-US-03-04 — Mô phỏng thất bại — TBD

**Nguồn khoảng trống:** TBD-07.

**Given:** Quá trình mô phỏng không tạo được kết quả.

**When:** PM chờ kết quả mô phỏng.

**Then:** TBD — nhóm xác định cách báo lỗi, thử lại và điều kiện tiếp tục tới quyết định. Bất kể cách xử lý, AC-US-03-02 vẫn áp dụng.

### AC-US-03-05 — Phương án thay đổi sau mô phỏng — TBD

**Nguồn khoảng trống:** TBD-08.

**Given:** PM đã xem kết quả cho một phương án, sau đó phương án được thay đổi.

**When:** PM tiếp tục xem xét phương án mới.

**Then:** TBD — nhóm xác định cách xử lý kết quả trước đó và có yêu cầu mô phỏng lại không. Kết quả cũ vẫn chỉ là kết quả của phương án cũ theo AC-US-03-01, không phải bằng chứng tác động của phương án mới.

## AC-US-04 — Quyết định áp dụng hoặc từ chối phương án

### AC-US-04-01 — Chấp nhận và áp dụng thành công — CONFIRMED

**Nguồn:** PRD — Phạm vi MVP — PM chấp nhận / từ chối; Tổng quan sản phẩm.

**Given:** PM đang xem xét một phương án xác định và việc áp dụng đáp ứng các điều kiện sẽ được nhóm chốt.

**When:** PM chấp nhận rõ ràng phương án đó và quá trình áp dụng thành công.

**Then:** Thay đổi phân bổ thật tương ứng với phương án PM đã chấp nhận. Không thay bằng phương án khác do AI lựa chọn. Tiêu chí này không khẳng định chấp nhận luôn thành công hoặc áp dụng ngay; xem TBD-04, TBD-06.

### AC-US-04-02 — Từ chối phương án — CONFIRMED

**Nguồn:** PRD — Phạm vi MVP — PM chấp nhận / từ chối.

**Given:** Có phương án được đề xuất chưa áp dụng.

**When:** PM từ chối phương án đó.

**Then:** Phương án bị từ chối không được áp dụng vào phân bổ thật. Không bắt buộc lý do từ chối hoặc thêm phê duyệt của vai trò khác.

### AC-US-04-03 — Không có chấp nhận rõ ràng — CONFIRMED

**Nguồn:** PRD — Phạm vi MVP — chỉ thay đổi thật khi PM chấp nhận rõ ràng.

**Given:** PM chưa chấp nhận phương án được đề xuất.

**When:** PM không tiếp tục phương án, hoặc hệ thống đã có đề xuất/kết quả mô phỏng nhưng chưa nhận được chấp nhận rõ ràng.

**Then:** Phương án không được áp dụng vào phân bổ thật. Không suy diễn sự im lặng hoặc kết quả AI thành sự chấp nhận. Hành vi lưu/hủy/hết hạn phương án thuộc TBD-09, không phải chức năng bắt buộc ở đây.

### AC-US-04-04 — Dữ liệu thật thay đổi sau mô phỏng — TBD

**Nguồn khoảng trống:** TBD-06, TBD-08.

**Given:** Dữ liệu phân bổ thật đã thay đổi sau khi phương án được mô phỏng.

**When:** PM chấp nhận phương án dựa trên kết quả trước đó.

**Then:** TBD — nhóm xác định điều kiện còn hiệu lực, cách kiểm tra lại và hành vi tiếp tục. Chưa tự yêu cầu chặn, mô phỏng lại hoặc phê duyệt bổ sung.

### AC-US-04-05 — Quyết định gửi lặp — TBD

**Nguồn khoảng trống:** TBD-08.

**Given:** Một quyết định của PM đối với phương án đã được gửi.

**When:** Cùng quyết định được gửi lại.

**Then:** TBD — nhóm xác định cách nhận diện và phản hồi quyết định lặp. AC-US-04-01 vẫn ràng buộc thay đổi thành công phải tương ứng phương án đã chấp nhận; chưa chỉ định cơ chế xử lý.

### AC-US-04-06 — Áp dụng thất bại — TBD

**Nguồn khoảng trống:** TBD-07.

**Given:** PM đã chấp nhận phương án nhưng việc áp dụng thất bại hoặc không hoàn tất đầy đủ.

**When:** Hệ thống xử lý kết quả áp dụng.

**Then:** TBD — nhóm xác định trạng thái phân bổ, thông tin kết quả cho PM và cách phục hồi/thử lại. Không tự cam kết khôi phục toàn bộ hoặc yêu cầu PM chấp nhận lại.

## Giới hạn nghiệm thu

Mỗi story có tình huống thành công; các nhánh thiếu căn cứ được ghi rõ thay vì tạo business rule. Trường hợp không có ứng viên có tiêu chí PROPOSED để review; các tình huống TBD chưa có expected behavior hoàn chỉnh. Bốn outcome và quyền quyết định của PM được mô tả nhất quán, nhưng còn cần nhóm chốt TBD trước khi nghiệm thu đầy đủ các nhánh tương ứng.
