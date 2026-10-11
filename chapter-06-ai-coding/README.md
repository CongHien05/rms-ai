# Chapter 6 — AI Lập trình

## 1. Mục tiêu theo đề cương

Áp dụng AI vào Code Generation, Code Completion, Debugging, AI Pair Programming
và quy trình lập trình có kiểm chứng.

## 2. RMS-AI áp dụng chương này như thế nào

Nhóm sử dụng Codex để hỗ trợ triển khai theo phạm vi nhỏ, sau đó thực hiện human
review, corrective pass, validation và merge. Source code vẫn nằm tại các thư
mục kỹ thuật của repository, không được sao chép vào chapter này.

## 3. Artifact hiện có

- [Frontend React/TypeScript](../frontend/README.md)
- [Backend NestJS/TypeScript](../backend/README.md)
- [AI service FastAPI scaffold](../ai-service/main.py)
- [Quy tắc làm việc và validation](../AGENTS.md)

Lịch sử Git xác nhận các implementation commit `711a1cc`, `96f4e55` và
`6383233`, sau đó được đưa vào `main` qua các merge commit tương ứng. Đây là
bằng chứng về checkpoint triển khai và merge, không thay thế biên bản human
review chi tiết.

## 4. Tiến độ

- [x] Khởi tạo source cho Frontend, Backend và AI service.
- [x] Triển khai backend foundation cho Project/Sprint/Task và Employee/Skill.
- [x] Triển khai frontend prototype và product shell theo phạm vi hiện tại.
- [x] Lưu lịch sử implementation và merge trong Git.
- [ ] Tập trung prompt, debugging note và kết quả human review theo chapter.

## 5. Bằng chứng AI-assisted workflow

Quy trình đang được nhóm sử dụng là: AI implement → human review → corrective
pass → validation → merge. Repository hiện có source, quy tắc validation và
lịch sử commit/merge; prompt coding và biên bản review chưa được tập trung vào
chapter này.

## 6. Việc tiếp theo

Với các scope coding được phê duyệt tiếp theo, lưu prompt, quyết định review,
corrective pass và kết quả validation thành bằng chứng có truy vết.
