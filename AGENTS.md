Hướng dẫn làm việc với RMS-AI
Mục tiêu sản phẩm
RMS-AI hỗ trợ quản lý dự án phần mềm dự báo rủi ro trễ hạn và xem xét phương án phân bổ nguồn lực. Luồng mục tiêu là đánh giá rủi ro → đề xuất phân bổ → mô phỏng What-if → PM chấp nhận hoặc từ chối. Mô phỏng chỉ tính kết quả giả định. Quyết định chấp nhận và việc áp dụng phân bổ là hai bước riêng.
Cấu trúc và nguồn đối chiếu
Vị trí	Nội dung
frontend/	React, TypeScript và Vite
backend/	NestJS, TypeScript, TypeORM và MySQL. Xem backend/.env.example để biết các biến cấu hình mẫu.
ai-service/	Python và FastAPI
chapter-*/	Tài liệu học phần và minh chứng. Mã nguồn ứng dụng nằm trong các thư mục kỹ thuật ở trên.
COURSE_PROGRESS.md	Chỉ mục tiến độ và liên kết đến README từng chapter.


- Dùng COURSE_PROGRESS.md để tìm chapter liên quan. Đọc README của chapter và kế hoạch milestone tương ứng để xác định bước tiếp theo. Khi các tài liệu lệch nhau, nêu rõ điểm lệch và đối chiếu với hiện trạng repo.
- Đối chiếu hành vi đã có với mã nguồn và kết quả chạy. Đối chiếu yêu cầu nghiệp vụ với PRD, User Stories và Acceptance Criteria. Ghi rõ bằng chứng là từ mã nguồn, từ chạy thực tế hay mới có trong tài liệu.
- Prototype và dữ liệu mock dùng để rà soát thiết kế. Role Preview chỉ dùng để xem giao diện theo vai trò. Việc có cấu hình MySQL hoặc migration trong repo chỉ xác nhận chúng có trong mã nguồn.
Phạm vi và nghiệp vụ
- Thực hiện đúng phạm vi tác vụ hoặc milestone được giao. Việc triển khai mô hình AI/ML, dự báo, tối ưu phân bổ, mô phỏng nghiệp vụ, database đầy đủ, Auth/RBAC hoặc CRUD đầy đủ cần được yêu cầu rõ trong tác vụ.
- Gắn các bước UI quan trọng với PRD, User Stories hoặc Acceptance Criteria. Dùng PROPOSED UI cho thiết kế giao diện đề xuất, PROPOSED DEMO cho giả định demo và TBD cho quy tắc chưa được chốt.
- Khi rà soát Chapter 4, kiểm tra luồng, wireframe hoặc prototype, các trạng thái chính và liên kết với yêu cầu. Phân biệt CONFIRMED, PROPOSED UI và TBD. Các quyết định API, database và ML thuộc phạm vi thiết kế riêng khi được giao.
Quy trình làm việc
1. Làm việc trong repo. Kiểm tra git status --short và đọc đúng các file hoặc đoạn liên quan. Giữ các thay đổi sẵn có của người dùng.
2. Nêu ngắn gọn thay đổi dự kiến trước khi sửa. Tận dụng cấu trúc hiện có và giữ thay đổi trong phạm vi. Chỉ thêm framework, dependency hoặc hạ tầng khi tác vụ thực sự cần.
3. Viết tài liệu và báo cáo bằng tiếng Việt. Giữ nguyên đường dẫn, tên công nghệ, API, định danh trong code và nhãn trạng thái đang dùng.
4. Chạy kiểm tra phù hợp với thay đổi. Với tài liệu, dùng git diff --check và kiểm tra liên kết đã thêm hoặc sửa. Với mã nguồn, chạy các lệnh build, lint hoặc test liên quan. Báo rõ kiểm tra nào đã chạy và mục nào chưa xác minh.
5. Khi hoàn tất một milestone, cập nhật chapter tương ứng. Ghi ngắn mục tiêu, prompt hoặc vai trò của AI, quyết định của người làm dự án, bằng chứng kiểm tra thực tế và phần còn chờ review. Cập nhật chỉ mục tiến độ khi trạng thái chung thay đổi.
6. Kết thúc bằng báo cáo ngắn về thay đổi, kiểm tra và việc còn lại. Chỉ commit, push, reset, rebase hoặc chạy lệnh Git có tính phá hủy khi người dùng yêu cầu rõ.