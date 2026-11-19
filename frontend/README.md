# React + TypeScript + Vite

Thư mục này cung cấp cấu hình tối thiểu để chạy React trong Vite với HMR và một
số quy tắc Oxlint.

Hiện có hai plugin chính thức:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) sử dụng [Oxc](https://oxc.rs).
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) sử dụng [SWC](https://swc.rs/).

## React Compiler

React Compiler chưa được bật trong cấu hình này vì ảnh hưởng đến hiệu năng phát
triển và build. Để bổ sung, xem [tài liệu cài đặt React Compiler](https://react.dev/learn/react-compiler/installation).

## Mở rộng cấu hình Oxlint

Khi phát triển ứng dụng production, nên bật các quy tắc lint nhận biết kiểu dữ
liệu bằng cách cài đặt `oxlint-tsgolint` và chỉnh sửa `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

Xem [tài liệu quy tắc Oxlint](https://oxc.rs/docs/guide/usage/linter/rules) để biết
danh sách đầy đủ các quy tắc và nhóm quy tắc.

## Rà soát frontend PM, HR và DEV (2026-11-19)

Mốc `3103f68` trên nhánh `ui/pm-project-detail` là nền cho đợt đồng bộ giao diện.
Người dùng chốt xanh chàm `#4338CA`, bố cục gọn, tên đầy đủ trên mobile và một
form Sprint cho cả desktop lẫn mobile. AI hỗ trợ phác thảo, sửa giao diện và kiểm
tra bằng trình duyệt. Bản giao diện chờ người dùng duyệt.

- **PROPOSED UI, US-07**. Chọn PM, HR hoặc DEV bằng một thao tác. Header ghi
  vai trò hiện tại và cho phép đổi vai trò.
- **PROPOSED UI, US-01 đến US-04**. PM mở dự án và công việc từ danh sách có
  phân trang. Luồng rủi ro minh họa ghi rõ dữ liệu demo. Mô phỏng trình bày
  phương án cạnh kết quả trên màn rộng. Quyết định được ghi nhận trong phiên
  demo. Các điều kiện và thời điểm áp dụng phân bổ là TBD.
- **PROPOSED DEMO, AC-US-05-01/03**. Bảng HR đặt tên, kỹ năng, tuần và giờ
  trống trong cùng một hàng. Mobile giữ các nhãn cùng từng người. `0 giờ`,
  `Chưa khai báo` và `Dữ liệu khác tuần` là ba trạng thái riêng.
- **AC-US-06-01/02/03**. DEV có ba màn chỉ xem. Bản mẫu hiển thị thông báo
  thiếu dữ liệu khi tài khoản chưa gắn với hồ sơ nhân sự.

Kiểm tra trong trình duyệt tích hợp tại 1280×800 và 390×844 đã mở đủ 15 màn hoặc
bước. Đã tạo Sprint qua API local ở mỗi kích thước, tạo công việc và xác nhận
trạng thái sau khi tải lại. Đã thử chấp nhận và từ chối phương án demo, đọc dữ
liệu HR và kiểm tra DEV chỉ xem. Đã kiểm tra nút **Thử lại** sau lỗi HTTP 503
có kiểm soát ở danh sách dự án, Nhân sự, Kỹ năng HR và đánh giá rủi ro.

Đối chiếu [thiết kế Chapter 4](../chapter-04-ai-for-product-design/README.md),
[User Stories](../chapter-03-ai-for-requirements-product-analysis/docs/user-stories.md)
và [Acceptance Criteria](../chapter-03-ai-for-requirements-product-analysis/docs/acceptance-criteria.md).
