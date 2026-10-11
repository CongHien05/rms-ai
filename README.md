# RMS-AI

**RMS-AI — Hệ thống dự báo rủi ro dự án và tối ưu nguồn lực bằng AI**

RMS-AI là hệ thống hỗ trợ ra quyết định bằng AI cho hoạt động quản lý nguồn lực
trong dự án phần mềm. Repository hiện có các dịch vụ nền tảng, cơ sở yêu cầu
của Chapter 3 và sản phẩm thiết kế độ trung thực thấp của Chapter 4.

## Phạm vi hiện tại

Phạm vi thiết kế sản phẩm hiện tại bao phủ luồng quyết định của PM từ Đánh giá
rủi ro dự án, Đề xuất nhân sự, Mô phỏng giả định đến Chấp nhận/Từ chối. UI hiện
có là bản mẫu giới hạn dùng để rà soát luồng này; đây không phải phần triển khai
production và không cung cấp dự báo AI, ghép nối nhân sự, mô phỏng, lưu trữ hay
thay đổi phân bổ thật.

Không mở rộng repository thành nền tảng HR hoặc quản lý dự án đầy đủ; không bổ
sung mô hình AI/ML, thiết kế database production, xác thực, hạ tầng hoặc quy tắc
nghiệp vụ chưa được cơ sở yêu cầu xác nhận.

## Cấu trúc dự án

```text
/
├── frontend/      # React + TypeScript + Vite
├── backend/       # API NestJS + TypeScript
├── ai-service/    # Dịch vụ FastAPI
├── chapter-01-ai-in-software-engineering/
├── chapter-03-ai-for-requirements-product-analysis/
├── chapter-04-ai-for-product-design/
├── AGENTS.md
├── README.md
└── .gitignore
```

## Tài liệu học phần

```text
chapter-01-ai-in-software-engineering/
→ Làm rõ ý tưởng và bản mô tả dự án

chapter-03-ai-for-requirements-product-analysis/
→ PRD và tài liệu phân tích yêu cầu

chapter-04-ai-for-product-design/
→ Luồng người dùng, thiết kế UI độ trung thực thấp, prompt thiết kế và tài liệu rà soát
```

Các ứng dụng nền tảng không yêu cầu biến môi trường.

## Frontend

Frontend React có bản mẫu độ trung thực thấp cho Đánh giá rủi ro dự án, Đề xuất
nhân sự, Mô phỏng giả định và các trạng thái quyết định cục bộ của PM. Những màn
hình này sử dụng dữ liệu minh họa và không gọi dịch vụ AI hoặc phân bổ production.

```powershell
cd frontend
npm install
npm run dev
```

Kiểm tra build:

```powershell
npm run build
```

## Backend

```powershell
cd backend
npm install
npm run start:dev
```

Kiểm tra tình trạng dịch vụ:

```text
GET http://localhost:3000/health
{ "status": "ok" }
```

Kiểm tra xác nhận:

```powershell
npm run build
npm test
```

## Dịch vụ AI

```powershell
cd ai-service
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python -m uvicorn main:app --reload --port 8000
```

Kiểm tra tình trạng dịch vụ:

```text
GET http://localhost:8000/health
{ "status": "ok" }
```

Kiểm tra xác nhận:

```powershell
.\.venv\Scripts\python -m py_compile main.py
```
