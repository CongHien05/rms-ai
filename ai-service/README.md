# Baseline trễ hạn Task — PROPOSED DEMO

Ngày đánh giá D là cuối ngày theo lịch của dự án. Một mẫu dương khi ít nhất một
Task đã tồn tại và còn mở tại D, có hạn từ D+1 đến D+7 (gồm hai đầu), và vẫn
ở trạng thái khác `DONE` vào cuối ngày đến hạn. Task đến hạn trước hoặc trong D
nằm ngoài mục tiêu này. Hạn trong dữ liệu giả lập được gán lúc tạo Task và giữ
nguyên. Lịch sử chuyển trạng thái tới D được dùng dựng snapshot; phần sau D
được dùng để xác định nhãn.

Chạy model đã lưu trong `ai-service/` bằng môi trường Python 3.12 hiện có.
Cấp `RISK_SERVICE_TOKEN` từ cấu hình ngoài Git cho cả FastAPI và NestJS.

```powershell
& .venv/Scripts/python.exe -m unittest discover -v
& .venv/Scripts/python.exe -m uvicorn main:app --host 127.0.0.1 --port 8001
```

Training dùng seed 42. Bốn ngày đánh giá trên mỗi dự án được lấy cách nhau
một tuần. Chỉ các snapshot có Task đủ điều kiện mới vào tập huấn luyện. Chia
train/test theo `projectId` trước khi fit StandardScaler và Logistic Regression.
Baseline đoán lớp phổ biến của train. Kết quả test dùng ngưỡng 0,5, confusion
matrix theo thứ tự `[[TN, FP], [FN, TP]]`.

Kết quả sinh ra gồm [model](artifacts/model.json) (hệ số và intercept đã gộp
bước chuẩn hóa), [schema request và thứ tự feature](artifacts/input-schema.json)
và [metric test](artifacts/metrics.json). Các metric chỉ phản ánh dữ liệu giả lập.
Khởi động lại dịch vụ sau khi thay model để nạp artifact mới.

## Gọi inference

Trong môi trường ngoài loopback, giữ endpoint trong mạng nội bộ với HTTPS.
Frontend dùng endpoint Risk của NestJS. Để kiểm tra tích hợp từ một terminal
nội bộ đã có token, gửi toàn bộ snapshot Task biết tại D. `status` và
`dueDate` là giá trị tại D.

```powershell
$body = '{"projectId":"demo","assessmentDate":"2026-11-18","tasks":[{"status":"BLOCKED","dueDate":"2026-11-25"}]}'
$headers = @{ 'X-Risk-Service-Token' = $env:RISK_SERVICE_TOKEN }
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8001/risk/predict -ContentType application/json -Headers $headers -Body $body
```

```json
{"projectId":"demo","status":"scored","probability":0.2637220822888594,"modelVersion":"synthetic-logreg-v1","eligibleTaskCount":1,"openTasksMissingDeadline":0}
```

- `missing_deadlines` khi có Task mở chưa khai báo hạn. Kết quả không có xác suất.
- `no_tasks_due_in_window` khi mọi Task mở có hạn nhưng không Task nào thuộc
  cửa sổ, kể cả snapshot không còn Task mở. Kết quả không có xác suất mô hình.
- Payload sai schema trả HTTP 422. Ca có thể chấm điểm nhưng thiếu artifact trả 503.
- Header dịch vụ thiếu, sai hoặc lặp trả 401. Cấu hình khóa chưa khả dụng
  trả 503. Health check chỉ trả trạng thái dịch vụ.

Phạm vi demo là sự kiện trễ hạn Task. Độ tin cậy trên dữ liệu thật, quy tắc với
deadline được sửa theo thời gian và kết nối vào luồng dự báo của PM còn chờ xác minh.
