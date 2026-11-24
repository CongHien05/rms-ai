# Implementation Plan: Mô phỏng phân bổ nguồn lực What-if

**Branch** `codex/001-what-if-simulation` · **Ngày** 2026-11-25 · **Spec** [đã duyệt ở Gate 1](spec.md)

**Baseline** `e45d4c6c5532dc578787f40127be21f0351de512` · **Trạng thái** Chờ review Gate 2

## Summary

Nối ứng viên từ danh sách đề xuất trên chi tiết dự án PM sang What-if.
NestJS xác minh ngữ cảnh đề xuất do máy chủ phát, đọc lại giờ trống và tính
ba chỉ báo theo giờ. React dùng lại phần trình bày phương án/tác động hiện
có. Luồng trên dự án thật dừng tại kết quả What-if và giữ nguyên hành vi
bản mẫu PM Decision. [Hợp đồng HTTP](contracts/what-if-api.md)

## Technical Context

| Hạng mục | Quyết định |
| --- | --- |
| Ứng dụng | TypeScript, NestJS 12, TypeORM, React 19 và Vite. Dùng `node:crypto` và `BigInt` sẵn có. |
| Dữ liệu | Đọc `Project`, `Skill`, `Employee`, `EmployeeSkill` qua module hiện có. `Employee.availabilityWeekStart` là DATE nullable và `availableHours` là DOUBLE nullable. Phương án, proof và snapshot không lưu vào MariaDB. |
| Routing | Vite gọi `POST /api/projects/{projectId}/simulations`, proxy bỏ `/api`; NestJS xử lý `POST /projects/:projectId/simulations` trong `ProjectsController`. Giữ phương thức và kiểu dữ liệu đang dùng của route đề xuất, bổ sung metadata theo contract. |
| Kiểm thử | Vitest unit cho service/phép tính, Node test cho thành phần điều phối lượt chạy phía client, Supertest HTTP E2E dùng TypeORM test double, trình duyệt và truy vấn SQL chỉ đọc trên MariaDB dev. |
| Phạm vi | Một nhân sự, một dự án, một kỹ năng theo đề xuất và một tuần. Không đặt SLA mới. AI Service, database schema, Auth/RBAC, Decision, Apply và lịch sử nằm ngoài milestone. |

## Constitution Check

| Nguyên tắc | Trước nghiên cứu | Sau thiết kế |
| --- | --- | --- |
| I–III | **PASS**. Scope căn cứ spec đã duyệt và US/AC. Hiện trạng đề xuất/risk/decision được đối chiếu từ mã nguồn. | **PASS**. Thay đổi đề xuất có tính bổ sung. Tái lập kiểm thử thứ hạng, lọc, lỗi và phân trang hiện tại. |
| IV–V | **PASS**. Nguồn dữ liệu và routing hiện có đáp ứng phạm vi demo. | **PASS**. Một contract giữa React và NestJS, dùng schema và module hiện tại, không thêm dependency hoặc giao tiếp AI. |
| VI–VIII | **PASS**. Spec đã có FR, AT và SC kiểm chứng được. | **PASS**. Ma trận bên dưới gắn bằng chứng với từng lớp. Test hồi quy giữ kỳ vọng hiện tại. |
| IX–XI | **PASS**. Mô phỏng giờ là phép tính giả định với dữ liệu khai báo. PM xác nhận đầu vào mô phỏng. | **PASS**. Proof xác thực ngữ cảnh của chính đề xuất. Dùng secret ngoài Git, kiểm tra phía server, xác nhận dữ liệu không bị ghi và xử lý lượt chạy chồng nhau. |
| XII–XIV | **PASS**. Gate 2 chỉ lập kế hoạch, task và phân tích. | **PASS**. Có task ghi bằng chứng theo chapter sau khi chạy. Không chạy triển khai hay thao tác Git ghi lịch sử ở Gate 2. |

## Phase 0 — Research

Đã đối chiếu endpoint đề xuất, mô hình Employee, routing và bộ test hiện có.
Các lựa chọn về proof, precision, phân loại kết quả đề xuất và kiểm thử độc
lập được ghi tại [research.md](research.md). Không có điểm cần làm rõ thêm
trong phạm vi spec đã duyệt.

## Phase 1 — Design & Contracts

1. **Đề xuất và chứng thực ngữ cảnh.** Trong `EmployeesService`, dùng một lượt
   đọc các hồ sơ có liên kết với kỹ năng yêu cầu, giữ cả giờ `null`, `0` và giờ
   khác tuần. `ProjectResourceRecommendationService` tiếp tục lọc đúng tuần,
   giờ dương và xếp hạng bằng số giờ hỗ trợ, tên, ID như hiện tại. Nếu không
   có người đủ điều kiện, phân biệt danh sách rỗng với trường hợp có hồ sơ
   đúng kỹ năng nhưng thiếu khai báo cho tuần. Phát `recommendationContext`
   có HMAC riêng cho từng ứng viên đủ điều kiện. Proof ràng buộc dự án, nhân
   sự, kỹ năng, tuần và giờ cần theo kết quả server phát.
2. **Xác minh và đọc nguồn.** `ProjectSimulationService` xác thực proof và
   đối chiếu các trường request với ngữ cảnh đã ký. Dùng `ProjectsService` và
   `SkillsService` để đọc tham chiếu hiện hành. Thêm phương thức đọc nhân
   sự theo ID trong `EmployeesService`, lấy tuần, giờ và liên kết kỹ năng từ
   cùng một truy vấn chỉ đọc. Cách này giữ được sự khác biệt giữa hồ sơ sai
   kỹ năng, 0 giờ đúng tuần và thiếu dữ liệu đúng tuần. Lỗi nguồn không tạo
   tác động.
3. **Tính và trả snapshot.** Kiểm tra giờ cần/giờ hỗ trợ là số JSON hữu hạn,
   dương. So sánh giờ hỗ trợ với giờ trống mới đọc bằng số thập phân chuẩn
   hóa. Dùng một snapshot duy nhất trong lượt tính và trả lại cùng ba chỉ báo.
   Dùng `scenarioReference` ổn định theo đầu vào chuẩn hóa và `runId` riêng
   cho mỗi lần xác nhận hoặc thử lại. Availability thay đổi chỉ làm snapshot
   lần chạy mới thay đổi. Giờ hỗ trợ có thể lớn hơn giờ cần nếu <= giờ trống.
4. **Điều phối trên giao diện.** Theo ngữ cảnh của
   `ProjectResourceRecommendations`, PM chọn ứng viên và xác nhận số giờ
   điền sẵn hoặc giờ đã sửa. Tách lớp trình bày dùng chung cho phương án và
   tác động từ `WhatIfSimulationView`. Luồng đang có trong `App.tsx` giữ mock
   và callback quyết định hiện hành. Luồng dự án thật gọi Backend trong
   `ProjectWhatIfSimulation` và không hiển thị bước quyết định.
5. **Trạng thái lượt chạy.** Phân biệt idle, loading, empty, missing, invalid,
   error, success và stale. Empty từ đề xuất không đưa PM vào mô phỏng. Khi
   đổi dự án, kỹ năng, tuần, giờ cần, ứng viên hoặc giờ hỗ trợ, vô hiệu kết
   quả và lượt trước. Client dùng revision cục bộ và run ID để chặn
   success, error và finally đến muộn. Hủy request chỉ giúp tiết kiệm tài
   nguyên. Retry thủ công giữ dữ liệu nhập, tạo run ID mới và đọc lại nguồn.
   Nếu proof không còn dùng được, giữ bản nháp và hướng PM tải đề xuất mới.

Chi tiết trường, công thức và trạng thái nằm trong [data-model.md](data-model.md)
và [HTTP contract](contracts/what-if-api.md). [Quickstart](quickstart.md) ghi
cách chạy và giới hạn của từng lớp bằng chứng.

### Ma trận kiểm thử

**U-BE** là unit test NestJS; **U-FE** là unit test điều phối trên Node;
**HTTP** là Supertest với TypeORM test double; **Runtime** là trình duyệt →
Vite → NestJS → MariaDB dev sau triển khai. Một số lỗi hoặc tình huống thay
đổi ngữ cảnh chủ động được tạo ở unit/HTTP, có thể đối chiếu thêm bằng trì
hoãn request trình duyệt có kiểm soát. Dữ liệu trước/sau Runtime thuộc schema
hiện hành, chưa bao phủ `ProjectAllocation` vận hành.

| AT | FR liên quan | SC | Ca và bằng chứng theo lớp |
| --- | --- | --- | --- |
| AT-01 | FR-001/002/004/005/009 | SC-001/004 | U-BE và HTTP kiểm tra 8/8/12,5 → 8/0/4,5; ca 0,3−0,1 → 0,2, số mũ và hỗ trợ vượt nhu cầu. Runtime kiểm tra chọn đúng ứng viên, xác nhận, đúng tuần và đối chiếu SQL. |
| AT-02 | FR-002/004/005/009 | SC-001/004 | U-BE và HTTP kiểm tra hỗ trợ bằng giờ trống 4/8/4 → 4/4/0. Runtime kiểm tra đủ ba chỉ báo và SQL. |
| AT-03 | FR-001/006/009 | SC-002/004 | HTTP kiểm tra giữ lượt xếp hạng, đồng hạng và loại người sai kỹ năng/tuần; danh sách rỗng, thiếu khả dụng và lỗi nguồn. U-FE kiểm tra không thể chọn khi thiếu ứng viên. Runtime kiểm tra đề xuất cũ và ca rỗng với dữ liệu hiện có. |
| AT-04 | FR-001/003/004/006/007/009 | SC-002/004 | U-BE kiểm tra 0, âm, NaN, Infinity, vượt giờ trống và precision biên; HTTP kiểm tra null/thiếu/chuỗi, số mũ tràn, UUID/tuần sai, proof và tham chiếu không khớp, cấm trường thừa. Runtime thử số giờ vượt giờ trống. |
| AT-05 | FR-003/006/007/009 | SC-002/004 | U-BE và HTTP thay đổi fixture ngay sau khi phát proof để phân biệt null/khác tuần với 0 đúng tuần. Runtime dùng hồ sơ có sẵn nếu có đúng tiền điều kiện, ghi giới hạn nếu thiếu. |
| AT-06 | FR-003/006/007/009 | SC-002/004 | HTTP tiêm lỗi nguồn rồi cho lần đọc sau thành công. U-FE kiểm tra giữ đầu vào và retry có run ID mới. Runtime có thể chặn phản hồi tại trình duyệt để thử UX, ghi rõ là lỗi mô phỏng. |
| AT-07 | FR-003/004/005/008/009 | SC-003/004 | U-BE và HTTP đổi fixture 8 → 4 giờ sau khi phát proof; 6 bị chặn, 4 chạy lại đạt. Test thêm thay đổi còn trong giới hạn và phản hồi snapshot mới, đầu vào mang availability giả bị chặn. |
| AT-08 | FR-002/008/009 | SC-003/004 | U-FE dùng deferred promise kiểm tra đổi từng đầu vào, kể cả đổi rồi quay lại giá trị cũ mà chưa chạy. Runtime kiểm tra bỏ kết quả cũ và phải xác nhận lần mới. |
| AT-09 | FR-008/009 | SC-003/004 | U-FE kiểm tra success/error cũ trong khi B đang chờ, B thành công hoặc lỗi, gồm finally cũ và retry cùng tham số. Trình duyệt thử đảo thứ tự nếu có kiểm soát network; tách bằng chứng này khỏi SQL runtime. |

Mỗi ca HTTP chụp dữ liệu test double trước/sau lượt mô phỏng, kiểm tra
phương thức ghi không được gọi. Runtime chụp tập hàng dự án, nhân sự và
liên kết kỹ năng dùng cho ca bằng SQL chỉ đọc. Nếu thay fixture để tạo tình
huống, lần chụp trước phải sau khi fixture đã đổi. Phân loại mức đã chạy và
blocker theo [quickstart.md](quickstart.md).

## Project Structure

### Documentation

```text
specs/001-what-if-simulation/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── contracts/what-if-api.md
├── quickstart.md
└── tasks.md
```

### Source Code (đường dẫn dự kiến ở bước triển khai)

```text
backend/
├── .env.example
├── src/employees/{employees.service.ts,employees.service.spec.ts}
├── src/projects/
│   ├── dto/resource-simulation.dto.ts
│   ├── project-hours.ts
│   ├── recommendation-context.ts
│   ├── project-resource-recommendation.service.ts
│   ├── project-simulation.service.ts
│   ├── project-simulation.service.spec.ts
│   ├── projects.controller.ts
│   └── projects.module.ts
└── test/app.e2e-spec.ts
frontend/
├── package.json
├── src/projects/{ProjectResourceRecommendations.tsx,ProjectWhatIfSimulation.tsx,simulationRun.ts}
├── src/resource-recommendation/{WhatIfSimulationView.tsx,WhatIfSimulationPanels.tsx}
└── test/simulation-run.test.mjs
```

`frontend/package.json` chỉ cần cập nhật danh sách lệnh test. Hồ sơ sau
triển khai cập nhật các README Chapter 5/6/7/8/9 và `COURSE_PROGRESS.md` theo
task, giữ nguyên trạng thái B1 chờ duyệt.

## Complexity Tracking

Không có ngoại lệ Constitution. Proof HMAC đủ để xác minh ứng viên đã xuất
hiện trong kết quả phù hợp mà vẫn giữ thao tác stateless và cho đọc lại
availability ở từng lần chạy.
