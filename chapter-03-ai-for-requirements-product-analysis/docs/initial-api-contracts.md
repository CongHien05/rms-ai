# Hợp đồng API ban đầu RMS-AI

## 1. Mục tiêu và phạm vi

Tài liệu này đề xuất hợp đồng ban đầu cho hai ranh giới:

```text
Frontend <-> Backend / Tầng ứng dụng
Backend / Tầng ứng dụng <-> Các năng lực AI
```

Hợp đồng bao phủ đánh giá rủi ro, đề xuất nhân sự, mô phỏng/tác động và quyết
định/áp dụng có điều kiện. Đây là thiết kế để rà soát, không phải API đã triển
khai, DTO vận hành, đặc tả OpenAPI hoặc yêu cầu nghiệp vụ mới.

Kho mã nguồn hiện chỉ có `GET /health` ở Backend NestJS và dịch vụ AI FastAPI.
Mọi điểm cuối API nghiệp vụ trong tài liệu này đều chưa tồn tại.

## 2. Nguồn và quy ước trạng thái

Nguồn yêu cầu nghiệp vụ:

- `PRD.md`.
- `user-stories.md`.
- `acceptance-criteria.md`.

Tài liệu nền và nguồn thiết kế kỹ thuật:

- `mvp-data-contract.md`.
- `system-architecture.md`.
- Các thiết kế UI về rủi ro, đề xuất nhân sự và mô phỏng giả định.
- Mã nguồn/cấu hình hiện tại trong `frontend/`, `backend/`, `ai-service/`.

| Trạng thái | Cách dùng trong tài liệu |
| --- | --- |
| YÊU CẦU SẢN PHẨM ĐÃ XÁC NHẬN | Kết quả hoặc bất biến có nguồn trực tiếp từ tài liệu yêu cầu. |
| ĐỊNH HƯỚNG KỸ THUẬT CỦA DỰ ÁN | Nền tảng hoặc ranh giới có căn cứ từ kho mã nguồn; không phải yêu cầu nghiệp vụ. |
| ĐỀ XUẤT HỢP ĐỒNG KỸ THUẬT | Điểm cuối API, phương thức, phương thức truyền, vỏ dữ liệu hoặc trường do tài liệu này đề xuất. |
| TBD | Chưa đủ căn cứ để chốt trường, quy tắc, chính sách hoặc hành vi. |
| CHỈ DỮ LIỆU MẪU / BẢN MẪU | Chỉ thuộc bản mẫu Frontend; không dùng làm lược đồ API. |

## 3. Nguyên tắc thiết kế API

- Frontend gọi Backend, không gọi AI trực tiếp.
- Backend che giấu mô hình, thuật toán và phương thức truyền chi tiết của AI khỏi
  Frontend.
- Dùng REST/JSON làm ĐỀ XUẤT HỢP ĐỒNG KỸ THUẬT ban đầu, phù hợp NestJS và
  FastAPI hiện có.
- Không dùng định danh mẫu hoặc mô hình trình bày làm hợp đồng vận hành.
- Không đưa điểm số, ngưỡng, xác suất, độ tin cậy, tỷ lệ ghép nối hoặc chỉ số
  tác động khi ngữ nghĩa còn TBD.
- Không có ứng viên phù hợp là kết quả nghiệp vụ, không phải lỗi hệ thống chung.
- Ứng viên không mặc định là phương án phân bổ.
- Mô phỏng không thay đổi phân bổ thật.
- Quyết định và việc áp dụng thành công không phải cùng một kết quả.
- Mỗi phản hồi phải giữ được ngữ cảnh dự án/phương án cần thiết; định danh cụ
  thể vẫn là đề xuất kỹ thuật hoặc TBD.

## 4. Ranh giới Frontend và Backend

Các điểm cuối API dưới đây đều có trạng thái ĐỀ XUẤT HỢP ĐỒNG KỸ THUẬT.
Backend hiện không cấu hình tiền tố chung; `/api` trong các đường dẫn dưới đây
cũng là đề xuất của tài liệu này, không phải quy ước đã triển khai.

| Vùng | Phương thức và đường dẫn đề xuất | Bên sử dụng | Mức sẵn sàng |
| --- | --- | --- | --- |
| Đánh giá rủi ro | `POST /api/projects/{projectId}/risk-assessments` | Frontend | Sẵn sàng một phần |
| Đề xuất nhân sự | `POST /api/projects/{projectId}/resource-recommendations` | Frontend | Sẵn sàng một phần |
| Mô phỏng / tác động | `POST /api/projects/{projectId}/simulations` | Frontend | Sẵn sàng một phần |
| Quyết định | `POST /api/projects/{projectId}/decisions` | Frontend | Sẵn sàng một phần |
| Áp dụng | Chưa đề xuất điểm cuối API | Backend/Tầng ứng dụng trong tương lai | Bị chặn bởi TBD về điều kiện và thời điểm áp dụng |

`projectId` là tên tham số kỹ thuật được đề xuất để giữ ngữ cảnh. Định dạng,
nguồn cấp, khả năng hiển thị và lưu trữ lâu dài của định danh vẫn TBD.

## 5. Hợp đồng đánh giá rủi ro dự án

### 5.1. Mục đích và truy vết yêu cầu

Cho PM nhận ước lượng rủi ro của dự án và các yếu tố giải thích chính.

- YÊU CẦU SẢN PHẨM ĐÃ XÁC NHẬN: US-01, AC-US-01-01.
- Ràng buộc khi thiếu căn cứ: AC-US-01-02 là TBD; AC-US-01-04 cấm trình bày kết
  quả thiếu căn cứ như chính xác.
- Tài liệu nền: Hợp đồng dữ liệu MVP mục 6, 7, 18.A và 20.

### 5.2. Thao tác đề xuất

`POST /api/projects/{projectId}/risk-assessments`

Chọn `POST` là ĐỀ XUẤT HỢP ĐỒNG KỸ THUẬT vì thao tác yêu cầu tạo/đánh giá một
kết quả, không khẳng định kết quả đã được lưu trữ thành tài nguyên.

### 5.3. Yêu cầu khái niệm

```json
{
  "projectContext": "<TBD: lấy từ Backend hay gửi bổ sung từ máy khách>"
}
```

| Thông tin | Trạng thái |
| --- | --- |
| `projectId` trong đường dẫn | ĐỀ XUẤT HỢP ĐỒNG KỸ THUẬT |
| Ngữ cảnh dự án đủ để đánh giá | YÊU CẦU SẢN PHẨM ở mức khái niệm |
| Trường cụ thể của dự án/chu kỳ phát triển/công việc/nguồn lực | TBD |
| Dữ liệu tối thiểu và tính hợp lệ | TBD-01 |
| Đầu vào về độ mới dữ liệu | TBD-02 |
| Tùy chọn hoặc lựa chọn mô hình | Không được xác nhận; không đưa vào hợp đồng hiện tại |

### 5.4. Phản hồi khái niệm

```json
{
  "projectReference": "<định danh kỹ thuật đề xuất>",
  "outcome": "<available | unavailable: đề xuất kỹ thuật>",
  "riskAssessment": "<cách biểu diễn TBD>",
  "keyFactors": ["<cấu trúc yếu tố TBD>"]
}
```

| Thông tin | Trạng thái |
| --- | --- |
| Ước lượng rủi ro cho đúng dự án | YÊU CẦU SẢN PHẨM ĐÃ XÁC NHẬN |
| Các yếu tố giải thích chính | YÊU CẦU SẢN PHẨM ĐÃ XÁC NHẬN |
| Vỏ phản hồi `outcome` | ĐỀ XUẤT HỢP ĐỒNG KỸ THUẬT |
| Ngữ nghĩa phản hồi không khả dụng/không đủ dữ liệu | TBD |
| Điểm số, xác suất, mức, ngưỡng, độ tin cậy | TBD; không có trường vận hành được chốt |
| Định danh, thứ tự, mức đóng góp và quan hệ nhân quả của yếu tố | TBD |
| Dấu thời gian, độ mới dữ liệu, phiên bản mô hình | TBD |

### 5.5. Bất biến và lỗi

- Không trả nội dung giữ chỗ như kết quả rủi ro thật.
- Không suy diễn thiếu dữ liệu thành rủi ro thấp.
- Yêu cầu không hợp lệ và thiếu ngữ cảnh dự án thuộc mô hình lỗi kỹ thuật.
- Không đủ dữ liệu và AI thất bại cần được phân biệt, nhưng ánh xạ cuối cùng còn
  TBD.

## 6. Hợp đồng đề xuất nhân sự

### 6.1. Mục đích và truy vết yêu cầu

Cho PM yêu cầu đề xuất nhân sự và nhận danh sách ứng viên được xếp hạng cùng
giải thích cơ bản về mức độ phù hợp, hoặc kết quả không có ứng viên phù hợp.

- US-02.
- AC-US-02-01 đến AC-US-02-05.
- Hợp đồng dữ liệu MVP mục 8-10, 18.B và 20.

### 6.2. Thao tác đề xuất

`POST /api/projects/{projectId}/resource-recommendations`

### 6.3. Yêu cầu khái niệm

```json
{
  "recommendationContext": "<TBD>",
  "staffingNeed": "<TBD>",
  "constraints": "<TBD>"
}
```

| Thông tin | Trạng thái |
| --- | --- |
| Yêu cầu của PM cho dự án đang xem | YÊU CẦU SẢN PHẨM ĐÃ XÁC NHẬN |
| Phụ thuộc vào kết quả rủi ro | TBD |
| Nhu cầu nhân sự, vai trò, kỹ năng, khoảng thời gian | TBD |
| Mức độ sẵn sàng, khối lượng công việc, ngữ cảnh phân bổ | TBD; PRD chỉ nêu như dữ liệu hỗ trợ có thể liên quan |
| Đầu vào về ràng buộc và điều kiện phù hợp | TBD |

Các khóa trong JSON giả lập chỉ giữ vị trí cho khái niệm TBD; chúng không xác nhận
trường hoặc cấu trúc vận hành.

### 6.4. Phản hồi khái niệm

```json
{
  "projectReference": "<định danh kỹ thuật đề xuất>",
  "outcome": "<candidates_available | no_suitable_candidate | unavailable: đề xuất kỹ thuật>",
  "candidates": [
    {
      "candidateReference": "<định danh TBD>",
      "suitabilityExplanation": "<nội dung/định dạng TBD>"
    }
  ]
}
```

Thứ tự phần tử trong `candidates` được đề xuất thể hiện thứ hạng; không có trường
điểm số hoặc tỷ lệ phần trăm.

| Thông tin | Trạng thái |
| --- | --- |
| Danh sách ứng viên được xếp hạng | YÊU CẦU SẢN PHẨM ĐÃ XÁC NHẬN |
| Giải thích cơ bản về mức độ phù hợp cho mỗi ứng viên | YÊU CẦU SẢN PHẨM ĐÃ XÁC NHẬN |
| Kết quả không có ứng viên phù hợp | YÊU CẦU SẢN PHẨM ĐÃ XÁC NHẬN |
| Vỏ phản hồi `outcome` và dùng thứ tự danh sách làm thứ hạng | ĐỀ XUẤT HỢP ĐỒNG KỸ THUẬT |
| Định danh ứng viên và trường hiển thị | TBD |
| Kỹ năng, mức độ sẵn sàng, khối lượng công việc | TBD |
| Số lượng ứng viên, đồng hạng, thứ tự ổn định | TBD |
| Công thức xếp hạng, điểm ghép nối, độ tin cậy | TBD; không đưa số giả |

### 6.5. Bất biến và lỗi

- Phản hồi đề xuất nhân sự không tự áp dụng phân bổ.
- Không thêm ứng viên không phù hợp để tránh danh sách rỗng.
- `no_suitable_candidate` là kết quả nghiệp vụ được đề xuất trả qua phản hồi
  thành công, không phải lỗi hệ thống chung.
- Thiếu dữ liệu, năng lực không khả dụng và kết quả thực sự rỗng phải được phân
  biệt; chi tiết còn TBD.

## 7. Hợp đồng mô phỏng giả định

### 7.1. Mục đích và truy vết yêu cầu

Đánh giá giả định một thay đổi phân bổ được đề xuất mà không thay đổi phân bổ
thật.

- US-03.
- AC-US-03-01 đến AC-US-03-05.
- Hợp đồng dữ liệu MVP mục 10-13, 18.C và 20.

### 7.2. Thao tác đề xuất

`POST /api/projects/{projectId}/simulations`

### 7.3. Yêu cầu khái niệm

```json
{
  "scenario": {
    "scenarioReference": "<TBD: có cần định danh hay không>",
    "proposedAllocationChange": "<cấu trúc TBD>"
  }
}
```

| Thông tin | Trạng thái |
| --- | --- |
| Thay đổi phân bổ được đề xuất cho dự án | YÊU CẦU SẢN PHẨM ĐÃ XÁC NHẬN |
| Vỏ yêu cầu `scenario` | ĐỀ XUẤT HỢP ĐỒNG KỸ THUẬT |
| Ánh xạ từ ứng viên sang phương án | TBD |
| Tham chiếu nguồn lực, vai trò, công sức, tỷ lệ, ngày | TBD |
| Ràng buộc, mốc so sánh và ngữ cảnh liên dự án | TBD |
| Một hay nhiều nguồn lực trong phương án | TBD |

Không dùng nguyên đối tượng ứng viên từ đề xuất nhân sự làm yêu cầu mô phỏng.
Tầng ứng dụng chỉ có thể tạo/chấp nhận phương án khi ánh xạ được chốt.

## 8. Hợp đồng kết quả tác động

### 8.1. Phản hồi khái niệm

```json
{
  "projectReference": "<định danh kỹ thuật đề xuất>",
  "scenarioReference": "<tham chiếu hoặc liên kết TBD>",
  "outcome": "<available | unavailable: đề xuất kỹ thuật>",
  "expectedImpact": "<cách biểu diễn TBD>"
}
```

| Thông tin | Trạng thái |
| --- | --- |
| Tác động thuộc đúng phương án đã mô phỏng | YÊU CẦU SẢN PHẨM ĐÃ XÁC NHẬN |
| Mô phỏng không thay đổi phân bổ thật | YÊU CẦU SẢN PHẨM ĐÃ XÁC NHẬN |
| Liên kết/tham chiếu cho phương án | ĐỀ XUẤT HỢP ĐỒNG KỸ THUẬT; định dạng TBD |
| Cách biểu diễn tác động | TBD |
| Mốc so sánh, mức thay đổi, thang đo, kỳ so sánh | TBD |
| Khía cạnh rủi ro/khối lượng công việc/kỹ năng/bàn giao/liên dự án | TBD |
| Chi tiết giải thích và thất bại | TBD |

Không đưa mức thay đổi rủi ro, mức thay đổi khối lượng công việc, tỷ lệ bàn giao,
tỷ lệ bao phủ kỹ năng hoặc định dạng trước/sau vào hợp đồng.

### 8.2. Bất biến và lỗi

- Mô phỏng thành công chỉ trả tác động của đúng phương án trong yêu cầu.
- Thất bại hoặc không đủ dữ liệu không được trình bày như tác động thành công.
- Dù mô phỏng thành công hay thất bại, phân bổ thật không thay đổi.
- Thời gian chờ, thử lại, hủy và phục hồi đều TBD.

## 9. Hợp đồng quyết định và áp dụng của PM

### 9.1. Mục đích và truy vết yêu cầu

Tiếp nhận Chấp nhận hoặc Từ chối rõ ràng của PM cho đúng phương án. Việc quyết
định có được lưu trữ lâu dài hay không vẫn TBD. Áp dụng là ranh giới riêng và
chưa đủ yêu cầu để chốt điểm cuối API.

- US-04.
- AC-US-04-01 đến AC-US-04-07.
- Hợp đồng dữ liệu MVP mục 14-15 và 20.

### 9.2. Điểm cuối API quyết định được đề xuất

`POST /api/projects/{projectId}/decisions`

```json
{
  "scenarioReference": "<tham chiếu kỹ thuật TBD>",
  "decision": "<accept | reject>"
}
```

| Thông tin | Trạng thái |
| --- | --- |
| Chấp nhận hoặc Từ chối rõ ràng | YÊU CẦU SẢN PHẨM ĐÃ XÁC NHẬN |
| Cách biểu diễn `decision` và điểm cuối API | ĐỀ XUẤT HỢP ĐỒNG KỸ THUẬT |
| Liên kết với đúng phương án | YÊU CẦU SẢN PHẨM ở mức bất biến; định dạng tham chiếu TBD |
| Định danh người dùng, dấu thời gian, lý do từ chối | TBD |
| Có bắt buộc mô phỏng hợp lệ trước Chấp nhận | TBD |
| Hành vi với quyết định lặp | TBD |

Phản hồi khái niệm chỉ xác nhận yêu cầu quyết định đã được xử lý theo hợp đồng kỹ thuật;
nó không được ngầm báo áp dụng thành công.

```json
{
  "scenarioReference": "<tham chiếu kỹ thuật TBD>",
  "decisionOutcome": "<accepted | rejected: đề xuất kỹ thuật>"
}
```

Phản hồi quyết định không chứa kết quả áp dụng. Kết quả áp dụng chỉ được thêm
khi hợp đồng áp dụng riêng đã được phê duyệt.

### 9.3. Hợp đồng áp dụng

Mức sẵn sàng: **BỊ CHẶN**.

Chưa đề xuất phương thức hoặc đường dẫn cho việc áp dụng vì các nội dung sau là TBD:

- Việc áp dụng được kích hoạt bởi PM, Backend hay một bước trong luồng công việc khác.
- Điều kiện đủ và thời điểm áp dụng.
- Có bắt buộc mô phỏng hợp lệ hay không.
- Lưu trữ lâu dài, giao dịch, thất bại một phần, thử lại và khôi phục.
- Trạng thái khi dữ liệu thay đổi sau mô phỏng.

Các bất biến vẫn áp dụng:

- Từ chối thì không áp dụng.
- Không có Chấp nhận rõ ràng thì không áp dụng.
- Chấp nhận không bảo đảm áp dụng thành công.
- Nếu áp dụng thành công, thay đổi phải đúng phương án đã chấp nhận.
- Nếu áp dụng thất bại, không báo thành công.

## 10. Hợp đồng Backend và AI cho rủi ro

Trạng thái: ĐỀ XUẤT HỢP ĐỒNG KỸ THUẬT.

Điểm cuối API nội bộ được đề xuất:

`POST /internal/ai/risk-assessments`

```json
{
  "projectContext": "<đầu vào tối thiểu TBD>"
}
```

```json
{
  "riskAssessment": "<cách biểu diễn TBD>",
  "keyFactors": ["<cấu trúc yếu tố TBD>"]
}
```

Backend chuẩn bị ngữ cảnh và không gửi tùy chọn mô hình từ Frontend. AI tạo kết
quả khái niệm; mục tiêu, đặc trưng, mô hình, điểm số, độ tin cậy và siêu dữ liệu vẫn TBD.

## 11. Hợp đồng Backend và AI cho đề xuất nhân sự

Trạng thái: ĐỀ XUẤT HỢP ĐỒNG KỸ THUẬT.

Điểm cuối API nội bộ được đề xuất:

`POST /internal/ai/resource-recommendations`

```json
{
  "projectContext": "<TBD>",
  "recommendationContext": "<TBD>",
  "constraints": "<TBD>"
}
```

```json
{
  "outcome": "<candidates_available | no_suitable_candidate | unavailable: đề xuất kỹ thuật>",
  "rankedCandidates": "<lược đồ ứng viên TBD>"
}
```

Backend không tự thêm điểm số và AI không áp dụng phân bổ. Điều kiện phù hợp,
công thức xếp hạng, định danh ứng viên và cấu trúc giải thích đều TBD.

## 12. Hợp đồng Backend và AI cho mô phỏng

Trạng thái: ĐỀ XUẤT HỢP ĐỒNG KỸ THUẬT.

Điểm cuối API nội bộ được đề xuất:

`POST /internal/ai/simulations`

```json
{
  "projectContext": "<TBD>",
  "allocationScenario": "<lược đồ TBD>",
  "baselineContext": "<TBD>"
}
```

```json
{
  "scenarioCorrelation": "<tham chiếu TBD>",
  "expectedImpact": "<cách biểu diễn TBD>"
}
```

Backend chịu trách nhiệm giữ liên kết với yêu cầu phương án. AI chỉ đánh giá
giả định, không ghi phân bổ hoặc quyết định thay PM. Khía cạnh tác động và
công thức vẫn TBD.

## 13. Mô hình lỗi

Không tạo danh mục mã lỗi ở giai đoạn này.

| Nhóm | Ý nghĩa | Xử lý/ánh xạ ban đầu |
| --- | --- | --- |
| Yêu cầu không hợp lệ | Sai cấu trúc hợp đồng kỹ thuật | `400` là ĐỀ XUẤT HỢP ĐỒNG KỸ THUẬT |
| Ngữ cảnh không tồn tại | Không xác định được tham chiếu dự án/phương án | `404` là ĐỀ XUẤT HỢP ĐỒNG KỸ THUẬT |
| Không đủ dữ liệu | Không đủ căn cứ tạo kết quả đáng tin cậy | Ngữ nghĩa và ánh xạ HTTP TBD |
| Năng lực AI thất bại | AI không trả kết quả hợp lệ | `502` hoặc `503` là phương án cần rà soát; thử lại TBD |
| Không có ứng viên phù hợp | Không ứng viên nào phù hợp theo quy tắc sẽ được chốt | Kết quả nghiệp vụ trong phản hồi đề xuất nhân sự, không phải lỗi hệ thống chung |
| Mô phỏng thất bại | Không tạo được tác động dự kiến | Không đổi phân bổ; phản hồi/ánh xạ và phục hồi TBD |
| Áp dụng thất bại | Việc áp dụng không thành công hoặc không đầy đủ | Không báo thành công; ánh xạ, trạng thái phân bổ và phục hồi TBD |

Vỏ phản hồi lỗi, định danh liên kết, thông báo dễ hiểu và chính sách hiển thị
lỗi là ĐỀ XUẤT/TBD, chưa được chốt trong tài liệu này.

## 14. Trạng thái thao tác lặp và tính lũy đẳng

- AC-US-04-05 xác định quyết định lặp là TBD.
- Việc thử lại yêu cầu đánh giá rủi ro, đề xuất nhân sự và mô phỏng chưa có ngữ nghĩa được
  xác nhận.
- Không định nghĩa khóa lũy đẳng, khoảng thời gian loại trùng hoặc phản hồi lặp.
- Khi triển khai, nhóm phải chốt hành vi trước khi đưa tiêu đề hoặc lưu trữ lâu dài
  tương ứng vào hợp đồng.

## 15. Trạng thái độ mới và dữ liệu lỗi thời

- Kết quả rủi ro, đề xuất nhân sự và tác động mô phỏng có liên kết với ngữ cảnh
  đã tạo ra chúng.
- Độ mới, chính sách dữ liệu lỗi thời, TTL, hết hạn, tự động tính lại và chính
  sách bộ nhớ đệm đều TBD.
- AC-US-01-03, AC-US-03-05 và AC-US-04-04 không cho phép tự chọn hành vi chặn
  hoặc chạy lại.
- API hiện không đề xuất trường độ mới bắt buộc.

## 16. Trạng thái phân quyền

- PM là người quyết định theo yêu cầu nghiệp vụ.
- Kho mã nguồn chưa có xác thực hoặc RBAC.
- Phân quyền cho dự án, quyết định và việc áp dụng là TBD.
- Không có tiêu đề vai trò, khai báo của mã thông báo hoặc trường quyền nào được đề xuất như
  hợp đồng đã chốt.

## 17. Truy vết yêu cầu

| Vùng hợp đồng | Yêu cầu | Tiêu chí chấp nhận | Hợp đồng dữ liệu |
| --- | --- | --- | --- |
| Đánh giá rủi ro | US-01 | AC-US-01-01 đến AC-US-01-04 | Mục 6-7, 18.A, 20 |
| Đề xuất nhân sự | US-02 | AC-US-02-01 đến AC-US-02-05 | Mục 8-10, 18.B, 20 |
| Mô phỏng / tác động | US-03 | AC-US-03-01 đến AC-US-03-05 | Mục 10-13, 18.C, 20 |
| Quyết định / áp dụng | US-04 | AC-US-04-01 đến AC-US-04-07 | Mục 14-15, 20 |

Thiết kế UI chỉ cung cấp ngữ cảnh trình bày. Điểm cuối API, phương thức và JSON giả
lập là đề xuất kỹ thuật của tài liệu này, không phải kết luận từ UI hoặc yêu cầu.

## 18. TBD và câu hỏi mở

- Định danh dự án và dữ liệu tối thiểu của dự án/chu kỳ phát triển/công việc.
- Chủ thể cung cấp dữ liệu yêu cầu: Frontend gửi hay Backend lấy từ nguồn dữ liệu.
- Cách biểu diễn rủi ro, mục tiêu, đặc trưng, ngưỡng và cấu trúc giải thích.
- Lược đồ ứng viên, điều kiện phù hợp, ngữ nghĩa thứ hạng, điểm số và độ tin cậy.
- Chuyển đổi từ ứng viên sang phương án.
- Cấu trúc và kiểm tra hợp lệ của phương án phân bổ.
- Cách biểu diễn, mốc so sánh, khía cạnh và công thức tác động.
- Kết quả không đủ dữ liệu và ánh xạ HTTP.
- Thời gian chờ AI, thử lại, quản lý phiên bản và xác thực nội bộ.
- Chính sách độ mới và dữ liệu lỗi thời.
- Lưu trữ quyết định, hành vi lặp và tính lũy đẳng.
- Điều kiện kích hoạt, điểm cuối API, điều kiện, giao dịch và phục hồi khi áp dụng.
- Xác thực, phân quyền và định danh người dùng.

## 19. Mức sẵn sàng triển khai

| Hợp đồng | Trạng thái | Lý do |
| --- | --- | --- |
| Đánh giá rủi ro: Frontend -> Backend | Sẵn sàng một phần | Kết quả rõ; đầu vào tối thiểu và cách biểu diễn TBD |
| Đề xuất nhân sự: Frontend -> Backend | Sẵn sàng một phần | Danh sách xếp hạng/giải thích/kết quả rỗng rõ; lược đồ ứng viên và quy tắc xếp hạng TBD |
| Mô phỏng: Frontend -> Backend | Sẵn sàng một phần | Bất biến không phá hủy và đúng phương án rõ; lược đồ phương án/tác động TBD |
| Quyết định của PM: Frontend -> Backend | Sẵn sàng một phần | Chấp nhận/Từ chối rõ; lưu trữ lâu dài và hành vi lặp TBD |
| Áp dụng | Bị chặn | Điều kiện, thời điểm, phục hồi sau thất bại và giao dịch chưa chốt |
| Backend -> AI: đánh giá rủi ro | Bị chặn ở ngữ nghĩa dữ liệu/mô hình | Mục tiêu, đầu vào tối thiểu và cách biểu diễn đầu ra TBD |
| Backend -> AI: đề xuất nhân sự | Sẵn sàng một phần | Kết quả khái niệm rõ; ngữ nghĩa đầu vào/ứng viên/xếp hạng TBD |
| Backend -> AI: mô phỏng | Sẵn sàng một phần | Đầu vào/đầu ra khái niệm rõ; ngữ nghĩa phương án và tác động TBD |

Các hợp đồng này đủ làm tài liệu nền để thảo luận cho phần nền tảng Mốc 4, nhưng
chưa đủ để sinh DTO vận hành hoặc triển khai hành vi đầu cuối mà không
chốt thêm các TBD liên quan.
