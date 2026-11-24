# RMS-AI

**RMS-AI — Hệ thống dự báo rủi ro dự án và tối ưu nguồn lực bằng AI**

RMS-AI là hệ thống hỗ trợ ra quyết định bằng AI cho hoạt động quản lý nguồn lực
trong dự án phần mềm. Luồng MVP đi từ đánh giá rủi ro, đề xuất nhân sự và What-if
đến quyết định của PM.

## Phạm vi hiện tại

- **PM** tạo/xem Project, Sprint và Task trên NestJS/MySQL, cập nhật trạng thái
  và xem tiến độ Sprint. Từ chi tiết dự án, PM có thể đánh giá rủi ro và yêu
  cầu đề xuất nhân sự theo kỹ năng, tuần và số giờ cần.
- **HR** xem nhân sự, kỹ năng và giờ trống khai báo theo tuần. Đề xuất nhân sự
  dùng các dữ liệu này để xếp hạng ứng viên và chỉ đọc dữ liệu nguồn lực.
- **AI Service** chạy baseline Logistic Regression huấn luyện với dữ liệu tổng
  hợp để ước lượng khả năng có Task quá hạn trong 7 ngày tới. Phạm vi demo và
  kết quả đo nằm trong [AI Service README](ai-service/README.md).
- **What-if, quyết định PM và Role Preview** hiện là bản mẫu giao diện. Phạm vi
  [What-if đầu tiên](chapter-03-ai-for-requirements-product-analysis/docs/user-stories.md#quyết-định-cho-what-if-đầu-tiên-2026-11-25)
  đã được duyệt ở mức PROPOSED DEMO và đang chờ triển khai. Auth/RBAC và áp dụng
  phân bổ thực vẫn là các phạm vi riêng.

## Cấu trúc dự án

```text
/
├── frontend/      # React + TypeScript + Vite
├── backend/       # API NestJS + TypeScript
├── ai-service/    # Dịch vụ FastAPI
├── chapter-*/     # Tài liệu học phần và minh chứng
├── .specify/      # Cấu hình Spec Kit, template và Constitution
├── .agents/       # Skill Spec Kit cho Codex
├── COURSE_PROGRESS.md
├── AGENTS.md
├── README.md
└── .gitignore
```

## Tài liệu học phần

- [Chỉ mục tiến độ học phần](COURSE_PROGRESS.md)
- [Yêu cầu sản phẩm](chapter-03-ai-for-requirements-product-analysis/README.md)
- [Thiết kế và close-out Chapter 4](chapter-04-ai-for-product-design/README.md)
- [Constitution 1.0.0](.specify/memory/constitution.md)
- [Tích hợp Spec Kit và roadmap MVP](chapter-09-ai-technical-documentation/docs/spec-kit-adoption-audit.md)

## Chạy local

Dùng Node.js/npm, Python 3.12 và instance MySQL/MariaDB dev đã có schema.
Chạy từng dịch vụ trong một terminal riêng từ thư mục tương ứng. Giữ
`backend/.env` ở máy local theo [mẫu cấu hình](backend/.env.example). Backend
cần `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD` và `DB_DATABASE`.
Xác nhận instance dev đang lắng nghe ở đúng cổng trước khi khởi động Backend.

### AI Service

```powershell
cd ai-service
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python -m uvicorn main:app --host 127.0.0.1 --port 8001
```

`GET http://127.0.0.1:8001/health` trả `{"status":"ok"}`. Backend mặc định dùng
`http://127.0.0.1:8001`. Nếu dùng địa chỉ khác, đặt `AI_SERVICE_URL` trong
`backend/.env`.

### Backend

```powershell
cd backend
npm ci
npm run build
npm run start:local
```

`npm run start:local` nạp `backend/.env`. `GET http://127.0.0.1:3000/health`
trả `{"status":"ok"}` khi Backend đã khởi động với cấu hình dev. Cấu hình
TypeORM tắt đồng bộ schema và migration tự động.

### Frontend

```powershell
cd frontend
npm ci
npm run dev -- --host 127.0.0.1
```

Mở địa chỉ do Vite in ra, thường là `http://127.0.0.1:5173`. Vite proxy
`/api` sang NestJS ở cổng `3000`. Đặt `BACKEND_URL` trước khi chạy Vite nếu
Backend dùng địa chỉ khác. Trong PM, mở `/#projects` để xem dự án đã lưu.

## Kiểm tra

| Thư mục | Lệnh |
| --- | --- |
| `frontend/` | `npm test`, `npm run lint`, `npm run build` |
| `backend/` | `npm test`, `npm run test:e2e`, `npm run lint`, `npm run build` |
| `ai-service/` | `.\.venv\Scripts\python -m pip check`, `.\.venv\Scripts\python -B -m unittest discover -v` |

Xem phạm vi và môi trường của từng kết quả chạy tại
[Chapter 8](chapter-08-ai-software-testing/README.md).
