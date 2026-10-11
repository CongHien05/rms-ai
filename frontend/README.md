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
