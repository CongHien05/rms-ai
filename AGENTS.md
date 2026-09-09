# Hướng dẫn repository RMS-AI

## Dự án

RMS-AI — Hệ thống dự báo rủi ro dự án và tối ưu hóa nguồn lực có ứng dụng AI.

Hệ thống là sản phẩm hỗ trợ ra quyết định có ứng dụng AI cho quản lý nguồn lực trong dự án phần mềm.

Luồng sản phẩm dài hạn cốt lõi:

Dự báo rủi ro dự án
-> Đề xuất nhân sự
-> Mô phỏng giả định
-> PM chấp nhận / từ chối

## Giai đoạn môn học hiện tại

Kho mã nguồn hiện đang ở giai đoạn khởi tạo dự án và xác định yêu cầu sản phẩm.

QUAN TRỌNG:
Chưa triển khai chức năng sản phẩm.
Chưa triển khai mô hình AI/ML.
Chưa thiết kế đầy đủ cơ sở dữ liệu.
Chưa triển khai xác thực, module CRUD, dashboard, ghép nối nguồn lực,
dự báo rủi ro, tối ưu hóa hoặc mô phỏng.

## Định hướng kỹ thuật hiện tại

Frontend:
- React
- TypeScript

Backend:
- NestJS
- TypeScript

Dịch vụ AI:
- Python
- FastAPI

Cơ sở dữ liệu dự kiến cho giai đoạn sau:
- MySQL

## Cấu trúc kho mã nguồn mục tiêu

/
├── frontend/
├── backend/
├── ai-service/
├── docs/
│   ├── PRD.md
│   └── ai-usage/
├── README.md
├── .gitignore
└── .env.example

## Quy tắc làm việc

1. Chỉ làm việc bên trong kho mã nguồn này.
2. Kiểm tra kho mã nguồn hiện có trước khi thay đổi.
3. Không giả định file hoặc kiến trúc chưa tồn tại.
4. Không thêm khung công nghệ, hạ tầng, cơ sở dữ liệu, Docker, CI/CD hoặc gói phụ thuộc không cần thiết.
5. Giữ thay đổi ở mức tối thiểu và phù hợp với giai đoạn môn học hiện tại.
6. Không triển khai sớm yêu cầu thuộc giai đoạn tương lai.
7. Trước khi sửa file, giải thích các thay đổi dự kiến.
8. Sau khi sửa file, chạy các lệnh kiểm tra hoặc build phù hợp.
9. Không chạy git commit, git push, git reset, git rebase hoặc lệnh Git phá hủy trừ khi được yêu cầu rõ ràng.
10. Không sửa các file không liên quan.

## Định nghĩa hoàn thành hiện tại

Nền tảng dự án chỉ được xem là hoàn thành khi:

- frontend khởi chạy thành công
- backend khởi chạy thành công
- ai-service khởi chạy thành công
- backend có endpoint GET /health đơn giản
- ai-service có endpoint GET /health đơn giản
- README giải thích cách chạy từng dịch vụ
- chưa có chức năng nghiệp vụ RMS-AI nào được triển khai
