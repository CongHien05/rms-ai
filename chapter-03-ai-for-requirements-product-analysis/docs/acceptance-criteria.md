# Tiêu chí chấp nhận RMS-AI

Tài liệu đi cùng [User Stories](user-stories.md), dựa trên [PRD v0.1](PRD.md). Các mã TBD tham chiếu bảng quyết định chưa xác định trong tài liệu User Stories.

## Quy ước và căn cứ

- ĐÃ XÁC NHẬN: hành vi có căn cứ từ PRD hoặc nguyên tắc MVP được người giao việc xác nhận rõ; nguồn ghi tại từng tiêu chí. Không gán ràng buộc bổ sung của người giao việc thành nội dung vốn có trong PRD.
- ĐỀ XUẤT: tiêu chí đề xuất để nhóm rà soát, không phải điều kiện nghiệm thu đã được duyệt.
- TBD: tình huống đã nhận diện nhưng chưa xác định được kết quả kỳ vọng. Phần Then ghi quyết định còn thiếu, không được dùng như kiểm thử đạt/trượt.
- Given / When / Then lần lượt diễn đạt điều kiện có trước / hành động hoặc sự kiện / kết quả quan sát được theo quy ước BDD.
- Điều kiện dữ liệu đủ hoặc áp dụng được phép trong tình huống thành công không tự định nghĩa ràng buộc dữ liệu/phân bổ; xem TBD-01, TBD-04 và TBD-06.
- Các tiêu chí dưới đây kiểm tra hành vi, không chứng minh độ chính xác mô hình hay khả năng giảm rủi ro thực tế. Không có ngưỡng, trọng số hoặc thiết kế kỹ thuật được chốt thêm.
- Các tiêu chí cho DEV, PM và HR xác nhận capability ở mức sản phẩm sau khi danh tính/role được xác định; chúng không định nghĩa cơ chế xác thực, RBAC, API hoặc lược đồ User.

## AC-US-01 — Xem và hiểu rủi ro bàn giao dự án

### AC-US-01-01 — Kết quả dự báo và giải thích — ĐÃ XÁC NHẬN

**Liên quan:** US-01

**Trạng thái:** ĐÃ XÁC NHẬN

**Nguồn:** PRD — Mục tiêu sản phẩm; Phạm vi MVP — Dự báo rủi ro dự án.

**Given:** Có dữ liệu cần thiết và một kết quả dự báo thành công cho dự án PM đang xem.

**When:** PM xem kết quả dự báo của dự án đó.

**Then:** Kết quả thể hiện ước lượng nguy cơ không đáp ứng kế hoạch/thời hạn bàn giao của chính dự án đó, kèm các yếu tố chính giải thích kết quả ở mức khái quát. Cách biểu diễn cụ thể còn ở TBD-02.

### AC-US-01-02 — Thiếu dữ liệu hoặc không đánh giá được — TBD

**Liên quan:** US-01

**Trạng thái:** TBD

**Nguồn khoảng trống:** PRD — Các vấn đề chưa quyết định; TBD-01, TBD-07.

**Given:** Dữ liệu cần thiết bị thiếu/không hợp lệ hoặc quá trình đánh giá không tạo được kết quả.

**When:** PM yêu cầu xem rủi ro.

**Then:** TBD — nhóm cần xác định điều kiện dữ liệu đủ, cách báo không đánh giá được và khả năng tiếp tục. Không mặc định thiếu dữ liệu tương đương rủi ro thấp.

### AC-US-01-03 — Kết quả không còn cập nhật — TBD

**Liên quan:** US-01

**Trạng thái:** TBD

**Nguồn khoảng trống:** TBD-02.

**Given:** Dữ liệu dự án đã thay đổi kể từ lần đánh giá.

**When:** PM xem kết quả cũ.

**Then:** TBD — nhóm cần xác định mức độ cập nhật cần thiết và cách xử lý kết quả cũ; chưa yêu cầu tự chạy lại hoặc tự chặn luồng.

### AC-US-01-04 — Không khẳng định kết quả thiếu căn cứ — ĐÃ XÁC NHẬN

**Liên quan:** US-01

**Trạng thái:** ĐÃ XÁC NHẬN

**Nguồn:** Constraint người giao việc — Thiếu dữ liệu; không phải quy tắc dữ liệu chi tiết đã có trong PRD.

**Given:** Dữ liệu được xác định không đủ để tạo kết quả đáng tin cậy theo điều kiện sẽ được nhóm chốt tại TBD-01.

**When:** PM yêu cầu đánh giá rủi ro.

**Then:** Hệ thống không trình bày kết quả thiếu căn cứ đó như một kết quả chính xác. Dữ liệu bắt buộc, mức thiếu khiến kết quả không hợp lệ và cách thông báo vẫn TBD.

## AC-US-02 — Cân nhắc ứng viên được đề xuất

### AC-US-02-01 — Nhận danh sách có thứ hạng và giải thích — ĐÃ XÁC NHẬN

**Liên quan:** US-02

**Trạng thái:** ĐÃ XÁC NHẬN

**Nguồn:** PRD — Người dùng mục tiêu — PM; Phạm vi MVP — Đề xuất nhân sự.

**Given:** Có dữ liệu cần thiết và việc đề xuất tạo được danh sách ứng viên cho nhu cầu dự án.

**When:** PM yêu cầu đề xuất nhân sự cho dự án đó.

**Then:** PM nhận được danh sách ứng viên có thứ hạng; mỗi ứng viên có giải thích cơ bản về mức độ phù hợp để giảm rủi ro hoặc bù thiếu hụt kỹ năng/nguồn lực của dự án.

Thứ hạng hỗ trợ cân nhắc, không chứng minh ứng viên đầu tiên tối ưu tuyệt đối. Căn cứ: PRD — Tổng quan sản phẩm xác định AI hỗ trợ và PM quyết định; nguyên tắc không đồng nhất thứ hạng với tối ưu tuyệt đối cũng được người giao việc yêu cầu rõ. Không đặt công thức hay tiêu chí kiểm thử tối ưu tuyệt đối.

### AC-US-02-02 — Đề xuất không tự phân bổ — ĐÃ XÁC NHẬN

**Liên quan:** US-02

**Trạng thái:** ĐÃ XÁC NHẬN

**Nguồn:** PRD — Tổng quan sản phẩm; Phạm vi MVP — PM chấp nhận / từ chối.

**Given:** PM chưa chấp nhận rõ ràng thay đổi phân bổ.

**When:** Hệ thống cung cấp danh sách đề xuất hoặc PM xem danh sách đó.

**Then:** Phân bổ thật không thay đổi do việc cung cấp/xem đề xuất; thứ hạng không được xem là sự chấp nhận của PM.

### AC-US-02-03 — Thể hiện không có kết quả phù hợp — ĐÃ XÁC NHẬN

**Liên quan:** US-02

**Trạng thái:** ĐÃ XÁC NHẬN

**Nguồn:** Yêu cầu bổ sung đã được người giao việc xác nhận — Không có ứng viên phù hợp: hệ thống phải thể hiện rằng không có kết quả phù hợp. PRD chưa quy định trực tiếp tình huống này; tiêu chí phù hợp vẫn TBD-03. Trạng thái được cập nhật nhờ xác nhận mới này, không phải để lấp khoảng trống tài liệu.

**Given:** Quá trình đề xuất hoàn tất và không tìm thấy ứng viên theo tiêu chí phù hợp sẽ được nhóm chốt.

**When:** PM nhận kết quả đề xuất.

**Then:** Kết quả thể hiện rõ không có ứng viên phù hợp. Tiêu chí phù hợp và hành động tiếp theo của PM vẫn TBD-03; không quy định cách trình bày UI hoặc tự động nới điều kiện tìm ứng viên.

### AC-US-02-04 — Thiếu thông tin hoặc không tạo được đề xuất — TBD

**Liên quan:** US-02

**Trạng thái:** TBD

**Nguồn khoảng trống:** TBD-01, TBD-03, TBD-07.

**Given:** Thiếu thông tin mức độ sẵn sàng/khối lượng công việc của ứng viên, hoặc quá trình đề xuất thất bại.

**When:** PM yêu cầu đề xuất.

**Then:** TBD — xác định việc loại/giữ ứng viên thiếu thông tin, cách thể hiện độ thiếu và phân biệt lỗi với kết quả rỗng. Không mặc định thiếu khối lượng công việc nghĩa là đang rảnh hoặc thiếu thông tin sẵn sàng nghĩa là có thể phân bổ; không tự gán giá trị thiếu.

### AC-US-02-05 — Không ép đưa ứng viên không phù hợp — ĐÃ XÁC NHẬN

**Liên quan:** US-02

**Trạng thái:** ĐÃ XÁC NHẬN

**Nguồn:** Constraint người giao việc — Không có ứng viên phù hợp; tiêu chí phù hợp chưa được PRD chốt.

**Given:** Không có ứng viên đáp ứng điều kiện phù hợp sẽ được nhóm xác nhận tại TBD-03.

**When:** Hệ thống cung cấp kết quả đề xuất.

**Then:** Hệ thống không đưa ứng viên không đáp ứng điều kiện vào như ứng viên phù hợp chỉ để có kết quả. Việc thể hiện kết quả rỗng được kiểm tra riêng tại AC-US-02-03; điều kiện ứng viên phù hợp vẫn TBD-03.

## AC-US-03 — Đánh giá phương án bằng mô phỏng

### AC-US-03-01 — Xem tác động của đúng phương án — ĐÃ XÁC NHẬN

**Liên quan:** US-03

**Trạng thái:** ĐÃ XÁC NHẬN

**Nguồn:** PRD — Phạm vi MVP — Mô phỏng giả định.

**Given:** Có một phương án thay đổi phân bổ xác định và dữ liệu cần thiết cho mô phỏng.

**When:** PM chạy mô phỏng và quá trình mô phỏng thành công.

**Then:** Kết quả cho biết tác động dự kiến của chính phương án đã mô phỏng, để PM xem xét trước quyết định thật. Chỉ báo tác động và mốc so sánh cụ thể thuộc TBD-05.

### AC-US-03-02 — Mô phỏng không phá hủy dữ liệu — ĐÃ XÁC NHẬN

**Liên quan:** US-03

**Trạng thái:** ĐÃ XÁC NHẬN

**Nguồn:** PRD — Phạm vi MVP — nguyên tắc không phá hủy dữ liệu.

**Given:** Có trạng thái phân bổ thật trước khi mô phỏng và không có thay đổi thật độc lập trong tình huống kiểm tra.

**When:** PM chạy/xem mô phỏng, kể cả khi mô phỏng thất bại.

**Then:** Trạng thái phân bổ thật sau hoạt động mô phỏng giữ nguyên so với trước đó; mô phỏng không được tự áp dụng phương án.

### AC-US-03-03 — Phương án có khả năng vi phạm ràng buộc — TBD

**Liên quan:** US-03

**Trạng thái:** TBD

**Nguồn khoảng trống:** TBD-04.

**Given:** Phương án có khả năng xung đột với khả năng sẵn sàng, khối lượng công việc hoặc ràng buộc phân bổ.

**When:** PM muốn mô phỏng phương án đó.

**Then:** TBD — nhóm xác định ràng buộc và hành vi khi vi phạm; chưa chọn cảnh báo, chặn hoặc vẫn mô phỏng. Không đặt giới hạn phân bổ hoặc ngưỡng bất kỳ.

### AC-US-03-04 — Mô phỏng thất bại — TBD

**Liên quan:** US-03

**Trạng thái:** TBD

**Nguồn khoảng trống:** TBD-07.

**Given:** Quá trình mô phỏng không tạo được kết quả.

**When:** PM chờ kết quả mô phỏng.

**Then:** TBD — nhóm xác định cách báo lỗi, thử lại và điều kiện tiếp tục tới quyết định. Bất kể cách xử lý, AC-US-03-02 vẫn áp dụng.

### AC-US-03-05 — Phương án thay đổi sau mô phỏng — TBD

**Liên quan:** US-03

**Trạng thái:** TBD

**Nguồn khoảng trống:** TBD-08.

**Given:** PM đã xem kết quả cho một phương án, sau đó phương án được thay đổi.

**When:** PM tiếp tục xem xét phương án mới.

**Then:** TBD — nhóm xác định cách xử lý kết quả trước đó và có yêu cầu mô phỏng lại không. Kết quả cũ vẫn chỉ là kết quả của phương án cũ theo AC-US-03-01, không phải bằng chứng tác động của phương án mới.

## AC-US-04 — Quyết định áp dụng hoặc từ chối phương án

### AC-US-04-01 — Chấp nhận và áp dụng thành công — ĐÃ XÁC NHẬN

**Liên quan:** US-04

**Trạng thái:** ĐÃ XÁC NHẬN

**Nguồn:** PRD — Phạm vi MVP — PM chấp nhận / từ chối; Tổng quan sản phẩm.

**Given:** PM đang xem xét một phương án xác định và việc áp dụng đáp ứng các điều kiện sẽ được nhóm chốt.

**When:** PM chấp nhận rõ ràng phương án đó và quá trình áp dụng thành công.

**Then:** Thay đổi phân bổ thật tương ứng với phương án PM đã chấp nhận. Không thay bằng phương án khác do AI lựa chọn. Tiêu chí này không khẳng định chấp nhận luôn thành công hoặc áp dụng ngay; xem TBD-04, TBD-06.

### AC-US-04-02 — Từ chối phương án — ĐÃ XÁC NHẬN

**Liên quan:** US-04

**Trạng thái:** ĐÃ XÁC NHẬN

**Nguồn:** PRD — Phạm vi MVP — PM chấp nhận / từ chối.

**Given:** Có phương án được đề xuất chưa áp dụng.

**When:** PM từ chối phương án đó.

**Then:** Phương án bị từ chối không được áp dụng vào phân bổ thật. Không bắt buộc lý do từ chối hoặc thêm phê duyệt của vai trò khác.

### AC-US-04-03 — Không có chấp nhận rõ ràng — ĐÃ XÁC NHẬN

**Liên quan:** US-04

**Trạng thái:** ĐÃ XÁC NHẬN

**Nguồn:** PRD — Phạm vi MVP — chỉ thay đổi thật khi PM chấp nhận rõ ràng.

**Given:** PM chưa chấp nhận phương án được đề xuất.

**When:** PM không tiếp tục phương án, hoặc hệ thống đã có đề xuất/kết quả mô phỏng nhưng chưa nhận được chấp nhận rõ ràng.

**Then:** Phương án không được áp dụng vào phân bổ thật. Không suy diễn sự im lặng hoặc kết quả AI thành sự chấp nhận. Hành vi lưu/hủy/hết hạn phương án thuộc TBD-09, không phải chức năng bắt buộc ở đây.

### AC-US-04-04 — Dữ liệu thật thay đổi sau mô phỏng — TBD

**Liên quan:** US-04

**Trạng thái:** TBD

**Nguồn khoảng trống:** TBD-06, TBD-08.

**Given:** Dữ liệu phân bổ thật đã thay đổi sau khi phương án được mô phỏng.

**When:** PM chấp nhận phương án dựa trên kết quả trước đó.

**Then:** TBD — nhóm xác định điều kiện còn hiệu lực, cách kiểm tra lại và hành vi tiếp tục. Chưa tự yêu cầu chặn, mô phỏng lại hoặc phê duyệt bổ sung.

### AC-US-04-05 — Quyết định gửi lặp — TBD

**Liên quan:** US-04

**Trạng thái:** TBD

**Nguồn khoảng trống:** TBD-08.

**Given:** Một quyết định của PM đối với phương án đã được gửi.

**When:** Cùng quyết định được gửi lại.

**Then:** TBD — nhóm xác định cách nhận diện và phản hồi quyết định lặp. AC-US-04-01 vẫn ràng buộc thay đổi thành công phải tương ứng phương án đã chấp nhận; chưa chỉ định cơ chế xử lý.

### AC-US-04-06 — Áp dụng thất bại — TBD

**Liên quan:** US-04

**Trạng thái:** TBD

**Nguồn khoảng trống:** TBD-07.

**Given:** PM đã chấp nhận phương án nhưng việc áp dụng thất bại hoặc không hoàn tất đầy đủ.

**When:** Hệ thống xử lý kết quả áp dụng.

**Then:** TBD — nhóm xác định trạng thái phân bổ, thông tin kết quả cho PM và cách phục hồi/thử lại. Không tự cam kết khôi phục toàn bộ hoặc yêu cầu PM chấp nhận lại.

### AC-US-04-07 — Không báo thành công khi áp dụng thất bại — ĐÃ XÁC NHẬN

**Liên quan:** US-04

**Trạng thái:** ĐÃ XÁC NHẬN

**Nguồn:** Constraint người giao việc — Áp dụng thay đổi thất bại.

**Given:** PM đã chấp nhận phương án nhưng việc áp dụng thực tế thất bại.

**When:** Hệ thống cung cấp thông tin kết quả áp dụng cho PM.

**Then:** Hệ thống không báo phương án đã được áp dụng thành công. Trạng thái phân bổ và cách phục hồi/thử lại vẫn TBD-07; không tự quy định rollback hoặc transaction.

## AC-US-05 — HR duy trì dữ liệu nguồn lực cho RMS-AI

### AC-US-05-01 — Xem dữ liệu Employee và Skill trong phạm vi RMS-AI — ĐÃ XÁC NHẬN

**Liên quan:** US-05

**Trạng thái:** ĐÃ XÁC NHẬN

**Nguồn:** Quyết định sản phẩm ba vai trò; PRD — Người dùng mục tiêu — HR; Phạm vi MVP.

**Given:** Danh tính và role HR đã được xác định, và RMS-AI có dữ liệu Employee, Skill hoặc Employee ↔ Skill.

**When:** HR xem dữ liệu nguồn lực.

**Then:** HR có thể xem dữ liệu Employee, Skill và các mối quan hệ Employee ↔ Skill thuộc phạm vi RMS-AI. Tiêu chí này không mở rộng dữ liệu sang payroll, attendance, leave, recruitment, performance review, rewards, contracts hoặc finance.

### AC-US-05-02 — Duy trì Employee, Skill và quan hệ kỹ năng — ĐÃ XÁC NHẬN

**Liên quan:** US-05

**Trạng thái:** ĐÃ XÁC NHẬN

**Nguồn:** Quyết định sản phẩm ba vai trò; PRD — Người dùng mục tiêu — HR; Phạm vi MVP.

**Given:** Danh tính và role HR đã được xác định, capability duy trì dữ liệu tương ứng đã được cung cấp, và dữ liệu đáp ứng các điều kiện hợp lệ sẽ được chốt tại TBD-01.

**When:** HR duy trì Employee, Skill hoặc mối quan hệ Employee ↔ Skill trong phạm vi RMS-AI.

**Then:** Hệ thống phản ánh dữ liệu nguồn lực đã được duy trì để downstream Resource Recommendation có thể sử dụng khi năng lực đó được triển khai. Trường dữ liệu, lifecycle, cách kiểm tra hợp lệ, UI, API và lưu trữ vẫn là TBD; tiêu chí không xác nhận CRUD đầy đủ.

### AC-US-05-03 — Thiếu dữ liệu được thể hiện trung thực — ĐÃ XÁC NHẬN

**Liên quan:** US-05

**Trạng thái:** ĐÃ XÁC NHẬN

**Nguồn:** Quyết định sản phẩm ba vai trò — không bịa dữ liệu nguồn lực; TBD-01, TBD-03.

**Given:** Một Employee thiếu Skill, quan hệ Employee ↔ Skill hoặc dữ liệu nguồn lực chưa được xác nhận.

**When:** HR xem dữ liệu hoặc dữ liệu đó được chuẩn bị cho downstream Resource Recommendation.

**Then:** Hệ thống thể hiện phần dữ liệu đang thiếu và không tự tạo Skill, quan hệ kỹ năng, availability, utilization, workload hoặc bench status. Hành vi downstream khi thiếu dữ liệu vẫn là TBD-01 và TBD-03.

### AC-US-05-04 — HR không thay PM quyết định — ĐÃ XÁC NHẬN

**Liên quan:** US-05, US-07

**Trạng thái:** ĐÃ XÁC NHẬN

**Nguồn:** Quyết định sản phẩm ba vai trò; PRD — PM là người quyết định cuối cùng.

**Given:** Danh tính và role HR đã được xác định.

**When:** HR sử dụng workspace của mình.

**Then:** Chấp nhận hoặc Từ chối recommendation/simulation không được cung cấp như capability quyết định của HR; dữ liệu do HR duy trì không được xem là quyết định của PM.

## AC-US-06 — DEV xem ngữ cảnh công việc của bản thân

### AC-US-06-01 — Xem thông tin và Skills của chính DEV — ĐÃ XÁC NHẬN

**Liên quan:** US-06

**Trạng thái:** ĐÃ XÁC NHẬN

**Nguồn:** Quyết định sản phẩm ba vai trò; PRD — Người dùng mục tiêu — DEV.

**Given:** Danh tính và role DEV đã được xác định, và RMS-AI có thông tin cá nhân hoặc Skills liên quan tới DEV đó.

**When:** DEV xem thông tin của mình.

**Then:** DEV có thể xem thông tin cá nhân liên quan tới RMS-AI và bộ kỹ năng của chính mình. Tiêu chí không xác nhận quyền xem hồ sơ của DEV khác hoặc toàn bộ dữ liệu Employee.

### AC-US-06-02 — Xem Project/Sprint/Task context khi tồn tại — ĐÃ XÁC NHẬN

**Liên quan:** US-06

**Trạng thái:** ĐÃ XÁC NHẬN

**Nguồn:** Quyết định sản phẩm ba vai trò; PRD — Người dùng mục tiêu — DEV; Phạm vi MVP.

**Given:** RMS-AI có Project/Sprint/Task context được cung cấp cho DEV đã xác định.

**When:** DEV xem ngữ cảnh công việc của mình.

**Then:** DEV có thể xem đúng Project/Sprint/Task context được cung cấp cho mình. Tiêu chí không mở rộng RMS-AI thành bộ quản lý dự án tổng quát.

### AC-US-06-03 — Không có ngữ cảnh công việc — ĐÃ XÁC NHẬN

**Liên quan:** US-06

**Trạng thái:** ĐÃ XÁC NHẬN

**Nguồn:** Quyết định sản phẩm ba vai trò — thể hiện trung thực dữ liệu không tồn tại.

**Given:** Không có Project/Sprint/Task context được cung cấp cho DEV đã xác định.

**When:** DEV xem ngữ cảnh công việc của mình.

**Then:** Hệ thống thể hiện trạng thái không có dữ liệu phù hợp và không tự tạo Project, Sprint, Task hoặc assignment để lấp khoảng trống.

### AC-US-06-04 — Write action của DEV — TBD

**Liên quan:** US-06

**Trạng thái:** TBD

**Nguồn khoảng trống:** TBD-12.

**Given:** DEV đang xem thông tin, Skills hoặc ngữ cảnh công việc của mình.

**When:** DEV muốn sửa Skill, gửi tiến độ, thay đổi allocation hoặc tự nhận task.

**Then:** TBD — các write action này chưa được xác nhận là capability của DEV; không dùng story xem dữ liệu để suy ra quyền ghi.

### AC-US-06-05 — DEV không quyết định recommendation — ĐÃ XÁC NHẬN

**Liên quan:** US-06, US-07

**Trạng thái:** ĐÃ XÁC NHẬN

**Nguồn:** Quyết định sản phẩm ba vai trò; PRD — PM là người quyết định cuối cùng.

**Given:** Danh tính và role DEV đã được xác định.

**When:** DEV sử dụng workspace của mình.

**Then:** Chấp nhận hoặc Từ chối recommendation/simulation không được cung cấp như capability quyết định của DEV; việc DEV xem ngữ cảnh không được xem là quyết định của PM.

## AC-US-07 — Truy cập workspace theo role

### AC-US-07-01 — Capability phù hợp với role — ĐÃ XÁC NHẬN

**Liên quan:** US-07

**Trạng thái:** ĐÃ XÁC NHẬN

**Nguồn:** Quyết định sản phẩm ba vai trò; PRD — Người dùng mục tiêu.

**Given:** Danh tính người dùng và một role DEV, PM hoặc HR đã được xác định.

**When:** Người dùng truy cập RMS-AI.

**Then:** Sản phẩm trình bày workspace, điều hướng và capability phù hợp với role đã xác định: PM sử dụng luồng quyết định AI, HR duy trì dữ liệu nguồn lực trong phạm vi, và DEV xem ngữ cảnh của chính mình. Cách xác định danh tính/role và thực thi quyền vẫn là TBD-11.

### AC-US-07-02 — PM giữ quyền quyết định cuối cùng — ĐÃ XÁC NHẬN

**Liên quan:** US-04, US-07

**Trạng thái:** ĐÃ XÁC NHẬN

**Nguồn:** PRD — Tổng quan sản phẩm; quyết định sản phẩm ba vai trò.

**Given:** Một recommendation hoặc phương án mô phỏng đang được xem xét.

**When:** RMS-AI cung cấp capability quyết định Chấp nhận/Từ chối.

**Then:** Capability quyết định thuộc về PM; HR và DEV không được thực hiện quyết định thay PM. AI, dữ liệu do HR duy trì và hành vi xem của DEV không được suy diễn thành sự chấp nhận.

### AC-US-07-03 — Quan hệ User Account và Employee — TBD

**Liên quan:** US-05, US-06, US-07

**Trạng thái:** TBD

**Nguồn khoảng trống:** TBD-11.

**Given:** Một người dùng có role DEV, PM hoặc HR và có thể đồng thời là nhân viên của tổ chức.

**When:** Hệ thống cần liên kết danh tính người dùng với dữ liệu Employee.

**Then:** TBD — nhóm cần xác định quan hệ User Account ↔ Employee và quyền xem chi tiết; không mặc định hai khái niệm là một hoặc thiết kế schema trong Acceptance Criteria.

## Giới hạn nghiệm thu

Mỗi story có tình huống thành công; các nhánh thiếu căn cứ được ghi rõ thay vì tự tạo quy tắc nghiệp vụ. Nguyên tắc thể hiện kết quả rỗng, dữ liệu thiếu và không ép đưa ứng viên không phù hợp đã được xác nhận; tiêu chí phù hợp vẫn TBD. Các tình huống TBD chưa có kết quả kỳ vọng hoàn chỉnh. Bảy mục tiêu người dùng, ranh giới DEV/PM/HR và quyền quyết định của PM được mô tả nhất quán, nhưng còn cần nhóm chốt TBD trước khi nghiệm thu đầy đủ các nhánh tương ứng.
