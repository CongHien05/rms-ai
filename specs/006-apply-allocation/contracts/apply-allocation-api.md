# API Contract — Apply Allocation 006

Đường dẫn NestJS, browser thêm `/api`. Dùng cookie, Origin cho POST, role PM, ownership, no-store và envelope lỗi Auth 002.

## Ghi và đọc kết quả

- `POST /projects/:projectId/decisions/:decisionId/apply` nhận body rỗng hoặc `{}`, ID UUID. Từ chối mọi identity, giờ, version hoặc snapshot trong body.
- `201` khi commit mới, `200` khi replay đúng Project. Body `{id, decisionId, projectId, employeeId, skillId, weekStart, hoursExact, decidedByAccountId, appliedByAccountId, appliedAt, status: "APPLIED"}`. Actor lấy từ bản ghi gốc.
- `GET /projects/:projectId/decisions/:decisionId/apply` trả `200` cùng body APPLIED hoặc `{decisionId, status: "NOT_APPLIED", latestFailure: null | {code, occurredAt}}`. Lấy khóa chia sẻ Project trên primary để đối chiếu. NOT_APPLIED mô tả thời điểm đọc. Yêu cầu đến sau vẫn có thể commit. Khi GET lỗi, client giữ trạng thái chưa xác nhận.
- `GET /projects/:projectId/allocation-results?limit=20&offset=0` trả `{items, hasMore}`, sắp `occurredAt DESC, id DESC`. Limit 1–100, offset nguyên không âm tối đa 2147483647. Mỗi item có `id, decisionId, outcome, code, occurredAt, decidedByAccountId, actorAccountId, allocation`. Allocation theo body APPLIED hoặc null. Nếu chưa có kết quả, trả danh sách rỗng.
- GET lịch sử quyết định 003 bổ sung `allocationState`: `UNAVAILABLE` với REJECT/legacy, `ACCEPTED` với ACCEPT có provenance chưa Apply, `APPLIED` khi có phân bổ. ACCEPTED trong luồng Apply chỉ là trạng thái dẫn tới POST. POST xác minh freshness. Với v2, GET còn trả `snapshotExact` và `expectedImpactExact` để đối chiếu giờ lịch sử với phân bổ. Các trường 003 giữ nguyên.

| HTTP | Mã | Điều kiện |
| --- | --- | --- |
| 400 | Validation 002 | ID, body hoặc query không hợp lệ. |
| 401 / 403 | Auth 002 | Thiếu phiên/sai role/ownership/Origin. Không trả chi tiết ngoài phạm vi. |
| 404 | `NOT_FOUND` | Project không có hoặc quyết định không thuộc Project được phép. |
| 409 | `DECISION_NOT_ACCEPTED` | REJECT. |
| 409 | `LEGACY_DECISION` | Thiếu provenance v2. |
| 409 | `STALE_ALLOCATION` | Employee/Skill/giờ còn lại khác snapshot hoặc tuần đã qua. |
| 409 | `AVAILABILITY_MISSING`, `INSUFFICIENT_AVAILABILITY`, `AVAILABILITY_OVER_ALLOCATED` | Thiếu/sai tuần, không đủ hoặc âm. |
| 503 | `APPLICATION_RETRYABLE` | Lỗi đã xác nhận trước commit hoặc rollback đã xác nhận. |
| 503 | `APPLICATION_UNCONFIRMED` | Chưa rõ kết quả commit hoặc chưa thể đọc để đối chiếu. |

Xét REJECT, legacy, tuần qua, Employee/Skill, tình trạng quỹ (thiếu, âm, không đủ), rồi so exact với snapshot. Lỗi 409 có thể ghi FAILED khi DB khả dụng. Dữ liệu đổi hoặc thiếu điều kiện cần What-if và ACCEPT mới trước lần Apply mới. Không ghi FAILED cho 400/401/403/404/503. Khi lỗi chỉ nằm ở ghi audit của 409, giữ báo lỗi nghiệp vụ đã xác nhận, không báo APPLIED.

## Giờ chính xác

Dạng canonical là `0` hoặc `<coefficient>e<exponent>`. Coefficient nguyên, dấu trừ khi âm, không có số 0 đầu/cuối. Exponent là số nguyên chuẩn không dấu cộng hoặc số 0 đầu. Ví dụ `3e-1` là 0,3. Kiểm độ dài tối đa 672 ký tự và exponent −324…308 trước khi phân tích input exact từ request/evidence. Giá trị nguồn number chuyển theo biểu diễn round-trip. Các field exact là string hoặc null khi thiếu tương ứng. Số 001 giữ dạng number, được chiếu IEEE-754 ở biên. UI 006 đọc exact khi có. Phép chiếu không quyết định đủ giờ hay freshness.

## Tương thích 001, 002 và 003

- HR `GET /employees/availability` giữ dữ liệu cũ và thêm `capacity: {weekStart, declaredHoursExact, allocatedHoursExact, remainingHoursExact, status}`. Status `MISSING|AVAILABLE|EXHAUSTED|OVER_ALLOCATED`. UI HR dùng capacity. Không trả chi tiết Project.
- Recommendation giữ các trường số, thêm `availableHoursExact` và `supportHoursExact` trên ứng viên. Lọc/ranking dùng exact, giờ hỗ trợ bằng min chính xác với nhu cầu. Nếu không có ứng viên và có dữ liệu thiếu/vượt mức, giữ outcome `unavailable` của 001.
- What-if giữ trường số, runId, scenarioReference và ba chỉ báo 001. Bổ sung `snapshotExact: {availableHoursExact, supportHoursExact}` và `expectedImpactExact` với ba khóa cũ, giá trị exact. Request giữ shape 001, thêm tùy chọn `scenario.supportHoursExact` canonical dương cùng numeric projection `supportHours`. Backend kiểm phép chiếu, miền số, quỹ giờ và proof ứng viên 001. ScenarioReference vẫn giữ kết quả cũ cho input số 001 và phân biệt exact khi exact khác decimal round-trip của số chiếu. Lỗi thiếu/0 giữ hành vi 001. Quỹ âm giữ nhánh lỗi nguồn lực hiện có của What-if và không phát evidence.
- Evidence `v2.<payload>.<mac>` giữ envelope 003 và giới hạn 4 KiB. Dùng khóa hiện hành với domain `rms-ai/what-if/decision/v2:`. Bao gồm claim 003, `availabilityBasis: "remaining-v1"`, `snapshotExact`. Kiểm version/MAC, exact schema, scope, numeric projection và impact tính lại. Server cấp version. Không log token hay digest.
- 003 nhận v1 đúng schema khi còn freshness, so snapshot number qua chuỗi canonical với giờ còn lại exact. Lượt mới từ v2 dùng exact và ghi provenance cùng quyết định. Replay bản ghi 003 đã lưu kiểm digest sau Auth/ownership, trước freshness/khóa ký. Thiếu provenance không được Apply kể cả quyết định ghi sau rollout. Giữ snapshot và lịch sử cũ. Recommendation proof vẫn là 001.
