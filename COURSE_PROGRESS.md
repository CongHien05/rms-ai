# RMS-AI — Tiến độ theo đề cương học phần

## Mục đích

Tài liệu này là chỉ mục theo dõi tiến độ RMS-AI từ Chapter 3 đến Chapter 9.
Mã nguồn thật được giữ tại `frontend/`, `backend/` và `ai-service/`; các thư mục
chapter chỉ lưu tài liệu, bằng chứng và trạng thái học tập. Mã nguồn không được
sao chép vào các thư mục chapter.

## Tiến độ

| Chương | Nội dung | Trạng thái | Tài liệu chính |
| --- | --- | --- | --- |
| 3 | AI trong Phân tích Yêu cầu & Sản phẩm | HOÀN THÀNH | [Theo dõi Chapter 3](chapter-03-ai-for-requirements-product-analysis/README.md) |
| 4 | AI trong Thiết kế Sản phẩm | ĐANG THỰC HIỆN | [Theo dõi Chapter 4](chapter-04-ai-for-product-design/README.md) |
| 5 | AI trong Thiết kế & Kiến trúc Phần mềm | ĐANG THỰC HIỆN | [Theo dõi Chapter 5](chapter-05-ai-for-software-design-architecture/README.md) |
| 6 | AI Lập trình | ĐANG THỰC HIỆN | [Theo dõi Chapter 6](chapter-06-ai-coding/README.md) |
| 7 | Tái cấu trúc & Review Mã nguồn cùng AI | ĐANG THỰC HIỆN | [Theo dõi Chapter 7](chapter-07-ai-code-review-refactoring/README.md) |
| 8 | AI trong Kiểm thử Phần mềm | ĐANG THỰC HIỆN | [Theo dõi Chapter 8](chapter-08-ai-software-testing/README.md) |
| 9 | AI trong việc sinh tài liệu kỹ thuật | ĐANG THỰC HIỆN | [Theo dõi Chapter 9](chapter-09-ai-technical-documentation/README.md) |

Trạng thái Chapter 3 xác nhận cơ sở yêu cầu đã có, không có nghĩa mọi quy tắc
nghiệp vụ `TBD` đã được quyết định. Các chapter còn lại đã có một phần bằng chứng
trong repository nhưng chưa đủ điều kiện để đánh dấu hoàn thành.

## Tiến độ ngày 2026-11-17

- Đã kiểm chứng luồng PM tạo/xem dự án qua UI → NestJS → MySQL local,
  dùng `GET /projects` và `POST /projects`. Tải lại trang vẫn thấy dữ liệu;
  GET API và bản ghi MySQL khớp ID. Hai migration đã áp dụng trên database
  dev riêng `rms_ai_pm_dev`; dự án thật không dẫn vào risk mock.
- PASS: Frontend và Backend build/lint; Backend 36/36 unit test và 5/5
  e2e test dùng mock. Kiểm thử trình duyệt PASS cho danh sách rỗng, tạo/reload,
  tên trống, chống submit lặp, lỗi API và thử lại sau phục hồi.
  Chi tiết: [triển khai Chapter 6](chapter-06-ai-coding/README.md) và
  [minh chứng Chapter 8](chapter-08-ai-software-testing/README.md).
- Chapter 5 B1 đã chỉnh theo review và vẫn chờ phê duyệt. B1 là snapshot
  trước tích hợp PM; bằng chứng runtime mới được ghi tại Chapter 6/8.
- Việc tiếp theo: cải thiện UI/UX và làm rõ luồng thao tác PM. Các chapter
  đang thực hiện tiếp tục giữ nguyên trạng thái; chưa xác minh Auth/RBAC,
  AI thật hoặc triển khai production.

## Mốc trước tích hợp PM (lịch sử)

- Cơ sở phân tích yêu cầu và sản phẩm đã có PRD, User Stories, Acceptance
  Criteria và hợp đồng dữ liệu khái niệm.
- Thiết kế UI và bản mẫu cho luồng Đánh giá rủi ro → Đề xuất nhân sự → Mô phỏng
  giả định → Quyết định của PM đã được triển khai ở phạm vi hiện tại; các quyết
  định `GIAO DIỆN ĐỀ XUẤT` và `TBD` vẫn cần tiếp tục rà soát.
- Nền tảng kiến trúc, API và database đã có tài liệu; UML hoàn chỉnh và các mẫu
  thiết kế chưa có bằng chứng hoàn tất.
- Nền tảng Backend và bản mẫu Frontend đã bắt đầu được hiện thực hóa và đã được
  merge vào `main`.
- Mô hình AI thật không thuộc mốc của tuần này và chưa được triển khai.
- Không gian làm việc theo ba vai trò DEV/PM/HR là định hướng tuần sau, chưa được
  triển khai trong tác vụ này.
