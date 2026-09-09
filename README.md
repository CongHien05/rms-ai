# RMS-AI

**RMS-AI — Hệ thống dự báo rủi ro dự án và tối ưu hóa nguồn lực có ứng dụng AI**

RMS-AI là hệ thống hỗ trợ ra quyết định có ứng dụng AI cho quản lý nguồn lực trong dự án phần mềm.

## Trạng thái dự án

- Nền tảng mã nguồn ban đầu đã được khởi tạo.
- Các tài liệu của Chapter 1 đã có.
- PRD v0.1 đã được xây dựng và đang được rà soát.
- Chưa triển khai chức năng nghiệp vụ hoặc mô hình AI.

## Phạm vi hiện tại

Repository hiện chỉ chứa nền tảng ứng dụng và tài liệu học phần. Không thêm chức năng nghiệp vụ, mô hình AI/ML, cấu hình cơ sở dữ liệu, xác thực, CRUD, Docker, CI/CD, dashboard, ghép nối nguồn lực, dự báo rủi ro, tối ưu hóa hoặc mô phỏng trong giai đoạn này.

## Cấu trúc repository

```text
/
├── frontend/      # React + TypeScript + Vite
├── backend/       # NestJS + TypeScript API
├── ai-service/    # FastAPI + Python
├── chapter-01-ai-in-software-engineering/
├── chapter-03-ai-for-requirements-product-analysis/
├── AGENTS.md
├── README.md
└── .gitignore
```

## Tài liệu học phần

```text
chapter-01-ai-in-software-engineering/
→ Tài liệu làm rõ ý tưởng dự án và project brief

chapter-03-ai-for-requirements-product-analysis/
→ PRD và tài liệu phân tích yêu cầu
```

Các thư mục `chapter-*` lưu tài liệu, prompt và minh chứng theo tiến độ học phần. Các chapter tiếp theo sẽ được bổ sung khi dự án chuyển sang cột mốc tương ứng.

Các ứng dụng nền tảng hiện chưa yêu cầu biến môi trường.

## Frontend

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

Kiểm tra health endpoint:

```text
GET http://localhost:3000/health
{ "status": "ok" }
```

Kiểm tra:

```powershell
npm run build
npm test
```

## AI Service

```powershell
cd ai-service
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python -m uvicorn main:app --reload --port 8000
```

Kiểm tra health endpoint:

```text
GET http://localhost:8000/health
{ "status": "ok" }
```

Kiểm tra:

```powershell
.\.venv\Scripts\python -m py_compile main.py
```
