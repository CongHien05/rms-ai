# API Contract — PM Decision Workflow

Đường dẫn dưới đây theo NestJS. Trình duyệt gọi cùng origin qua `/api`.
Dùng [Auth 002](../../002-auth-rbac/contracts/auth-rbac-api.md) cho cookie,
Origin và quyền, và [What-if 001](../../001-what-if-simulation/contracts/what-if-api.md)
cho DTO, lỗi và ba chỉ báo baseline.

## What-if thành công

`POST /projects/:projectId/simulations` giữ mọi trường/status cũ. Sau khi
đã xác thực quyền và tính thành công, response 200 được bổ sung tùy cấu
hình `decisionEvidence: {simulationId, simulationToken}`. `simulationId`
là UUID v4 mới do Backend sinh cho mỗi lần tính thành công, kể cả khi
`runId` hoặc tham số lặp. Mỗi lần tính lỗi giữ response 001 và không có
evidence. Nếu khóa phát proof thiếu hoặc sai định dạng, giữ response 001
thành công, bỏ trường `decisionEvidence` và UI báo chưa thể quyết định,
cho chạy lại thủ công khi dịch vụ sẵn sàng.

Token `v1.<payload>.<mac>` tối đa 4 KiB (4.096 ký tự ASCII) với
payload JSON UTF-8 và MAC 32 byte, hai phần dùng base64url canonical không
padding. Payload đúng các trường `simulationId`, `projectId`,
`pmAccountId`, `snapshot`, `expectedImpact`. HMAC-SHA-256 ký chuỗi ASCII
`rms-ai/what-if/decision/v1:` nối với đoạn payload đã encode, bằng khóa
riêng `WHAT_IF_DECISION_SIGNING_KEY` 32 byte base64url canonical ngoài Git.
Verifier kiểm version, hình thức và độ dài, so MAC constant-time trước khi
tin payload, rồi kiểm kiểu/cấu trúc, range và các định danh khớp principal,
path và `simulationId`. Không thêm TTL cho lượt đang khớp D1. Lượt chưa
ghi vẫn dùng được sau restart cùng khóa. Nếu triển khai đã thay khóa, lượt
chưa ghi cần mô phỏng lại. Digest chỉ dùng nội bộ. Token chỉ trao đổi giữa
browser và Backend. Không đưa giá trị nào vào log, URL, storage lâu dài
của browser hoặc lịch sử.

## Ghi quyết định

`POST /projects/:projectId/decisions` chỉ nhận JSON
`{simulationId, simulationToken, decision}`. `decision` chỉ nhận
`ACCEPT` hay `REJECT`. Từ chối trường ngoài contract, gồm identity, reason,
snapshot và impact tự khai. Auth/role/Origin chạy theo 002. Sau validation,
service kiểm owner hiện tại trước khi xét bản ghi hoặc nguồn lực.

Response thành công có `{id, simulationId, projectId, pmAccountId, decision,
decidedAt, snapshot, expectedImpact}` theo [Data Model](../data-model.md).
`decidedAt` là ISO 8601 UTC. Không trả token, digest hoặc trạng thái áp dụng.

| HTTP | Mã nghiệp vụ | Điều kiện |
| --- | --- | --- |
| 201 | — | Ghi mới và transaction đã commit. |
| 200 | — | Đã có bản ghi đúng Project và PM gốc, token trùng digest lưu, lựa chọn giống. Trả nguyên bản ghi kể cả sau khi nguồn thay đổi hoặc khóa ký cũ không còn. |
| 400 | `INVALID_SIMULATION_EVIDENCE` | Token giả, sai định dạng/nội dung, không khớp ID hoặc token retry khác token đã ghi. Lỗi DTO/UUID theo 002. |
| 401 | `UNAUTHENTICATED` | Phiên thiếu, hết hạn hoặc không hợp lệ. |
| 403 | `FORBIDDEN` | Sai role/quyền Project, hoặc token có chữ ký hợp lệ/bản ghi thuộc PM hay Project khác. Origin sai dùng `ORIGIN_FORBIDDEN` như 002. |
| 404 | — | PM được vào route nhưng Project không tồn tại. |
| 409 | `STALE_SIMULATION` | Chưa có quyết định, dữ liệu hiện hành khác snapshot hoặc không đủ điều kiện. Mô phỏng lại. |
| 409 | `DECISION_CONFLICT` | Bản ghi đã có, đúng PM và token, lựa chọn đối nghịch. |
| 503 | `DECISION_UNAVAILABLE` | Thiếu cấu hình xác minh lượt mới hoặc lỗi lưu/truy xuất tạm thời. Thử lại thủ công. |

Các lỗi mới theo envelope `{statusCode, code, message}`. Với key hợp lệ
nhưng token ký bằng key đã thay, trả 400 cùng hướng dẫn mô phỏng lại.
Kiểm bản ghi trước freshness và trước nhu cầu đọc khóa xác minh lượt mới.
Trên mất mạng hoặc timeout, client thử lại đúng ba trường ban đầu. Không tự
gửi lại thao tác ghi sau đăng nhập. Response route bảo vệ dùng `no-store`.

## Đọc lịch sử

`GET /projects/:projectId/decisions?limit=20&offset=0` chỉ cho PM hiện
phụ trách. `limit` 1–100, mặc định 20. `offset` nguyên không âm tối đa
2.147.483.647, mặc định 0. Kiểm query, từ chối tham số lạ. Trả 200
`{items, hasMore}` theo thứ tự giảm của `decidedAt`, sau đó `id`, gồm
quyết định của PM trước nếu có. `items` dùng shape thành công ở trên.
Khi rỗng trả `{items: [], hasMore: false}`. Dùng 401/403/404/503 như
đã mô tả khi áp dụng. Không có API sửa, xóa hoặc thay thế quyết định.
