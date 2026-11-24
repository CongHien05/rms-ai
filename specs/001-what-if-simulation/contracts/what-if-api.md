# Hợp đồng HTTP — What-if Simulation

**Trạng thái** Đề xuất kỹ thuật để review Gate 2 · **Phạm vi** PROPOSED DEMO

Hợp đồng hiện thực hóa [Initial API Contracts, mục 7–8](../../../chapter-03-ai-for-requirements-product-analysis/docs/initial-api-contracts.md).
Trình duyệt dùng prefix `/api` qua Vite. NestJS nhận route đã bỏ prefix.
Ràng buộc trường lấy từ [data-model.md](../data-model.md).

## Đề xuất hiện có và metadata bổ sung

`POST /api/projects/{projectId}/resource-recommendations` có request, HTTP
status và các trường response hiện có giữ nguyên. Bổ sung `outcome` và
`candidates[].recommendationContext` theo mô hình dữ liệu. Khi trạng thái
`unavailable` hoặc `no_suitable_candidate`, danh sách `candidates` vẫn là
`[]`; lỗi HTTP dùng quy ước hiện có. Khi thiếu proof do khóa chưa khả dụng,
UI tiếp tục hiển thị các ứng viên, báo What-if chưa khả dụng và giữ form đề
xuất. Với backend cũ thiếu `outcome`, UI vẫn hiển thị danh sách hoặc empty
theo `candidates`, và chỉ mở lượt mô phỏng nếu nhận được proof.

## Chạy What-if

**Frontend** `POST /api/projects/{projectId}/simulations`

**NestJS** `POST /projects/:projectId/simulations`

### Request DTO

`ResourceSimulationDto` có `runId` và `scenario` bắt buộc. Các trường
bắt buộc trong `scenario` là `employeeId`, `skillId`, `weekStart`,
`requiredHours`, `supportHours` và `recommendationContext`. Kiểm tra
DTO lồng nhau với ValidationPipe hiện có. UUID path/body, thứ Hai hợp lệ,
giờ dương hữu hạn và chữ ký đều phải đạt. Giờ phải là JSON number và không
tự ép kiểu từ chuỗi. Cấm trường thừa ở cả hai mức, gồm availability, impact
và `scenarioReference` do client đưa vào.

Ví dụ trường hợp ứng viên có 12,5 giờ trống, PM xác nhận hỗ trợ 9 giờ cho
nhu cầu 8 giờ. Thay giá trị proof minh họa bằng nguyên văn token nhận từ
request đề xuất.

```json
{
  "runId": "977cbf9f-060e-4e14-b6bc-4c034c0a5847",
  "scenario": {
    "employeeId": "02e24074-b1d9-4cc0-961e-99592e642830",
    "skillId": "66e930d6-3289-4012-a38c-7227daf73b18",
    "weekStart": "2026-11-16",
    "requiredHours": 8,
    "supportHours": 9,
    "recommendationContext": "v1.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
  }
}
```

### Response DTO

`ResourceSimulationResponseDto` chỉ có khi thành công HTTP 200.
`outcome` là `available`. `scenarioReference` liên kết đầu vào đã xác
minh, `runId` liên kết lượt chạy. `snapshot` biểu diễn
`SimulationSnapshot.context` dàn phẳng cộng `supportHours` và
`availableHours`. Các chỉ báo trong `expectedImpact` đều là JSON number.
Không trả proof hoặc tác động nếu lượt chạy thất bại.

```json
{
  "outcome": "available",
  "scenarioReference": "0d5a9b67034f7aa0669ffe5847b9650f1a8960c9354813091cd708c1f5aebff1",
  "runId": "977cbf9f-060e-4e14-b6bc-4c034c0a5847",
  "snapshot": {
    "projectId": "a6d68b1f-47e8-4025-bbdb-67e83c49d229",
    "employeeId": "02e24074-b1d9-4cc0-961e-99592e642830",
    "skillId": "66e930d6-3289-4012-a38c-7227daf73b18",
    "weekStart": "2026-11-16",
    "requiredHours": 8,
    "supportHours": 9,
    "availableHours": 12.5
  },
  "expectedImpact": {
    "hypotheticalSupportHours": 9,
    "remainingRequiredHours": 0,
    "remainingAvailableHours": 3.5
  }
}
```

Số trong ví dụ phản ánh dữ liệu của một lượt thành công. Giá trị hash là
minh họa định dạng. Giờ trống đọc lại được dùng nguyên cho lượt tính đó.
Xác nhận lại cùng phương án tạo run ID mới và có thể nhận giờ trống khác.

### Lỗi và thử lại

| HTTP | Mã ổn định nếu lỗi từ service | Trạng thái giao diện |
| --- | --- | --- |
| 400 | `INVALID_SCENARIO` khi proof sai, tuple sai, mất liên kết kỹ năng hoặc vượt giờ trống. DTO/UUID bị chặn bởi pipe có thể chỉ trả body chuẩn NestJS. | Phương án không hợp lệ. Giữ đầu vào, sửa hoặc tải lại đề xuất nếu ngữ cảnh không còn phù hợp. |
| 404 | `INVALID_SCENARIO` khi Project, Employee hoặc Skill đã mất. | Phương án không hợp lệ, giữ bản nháp và tải lại ngữ cảnh khi phù hợp. |
| 422 | `MISSING_AVAILABILITY` khi giờ null hoặc availability thuộc tuần khác/không khai báo tuần. | Thiếu dữ liệu. Giữ đầu vào và có thể thử lại khi dữ liệu đã có. |
| 503 | `SIMULATION_UNAVAILABLE` khi khóa chưa dùng được hoặc nguồn lỗi tạm thời. | Lỗi hệ thống, cho thử lại thủ công với đầu vào đã giữ. |
| 500 | Lỗi bất ngờ hoặc dữ liệu nguồn bất hợp lệ. Thông tin phản hồi được rút gọn. | Lỗi hệ thống. Giữ đầu vào và kết quả cũ không trở thành kết quả hiện hành. |

Lỗi service dự kiến có `statusCode`, `code` và `message`; body mặc định
từ ValidationPipe có thể dùng `message` dạng danh sách. Client dùng HTTP
status làm fallback. Client chờ tối đa 10 giây cho từng lượt, tính cả thời
gian đọc body. Hết thời gian chờ hoặc mất mạng thì giữ đầu vào và cho thử lại.
Body thành công sai cấu trúc hoặc không khớp run/snapshot đang chờ được báo lỗi.
Phản hồi thuộc lượt cũ bị bỏ qua kể cả khi chạy xong sau lượt mới. Ca thử lại là
một thao tác tính lại chỉ đọc và không có nghĩa lưu lịch sử.
