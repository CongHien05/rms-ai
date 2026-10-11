<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Framework <a href="http://nodejs.org" target="_blank">Node.js</a> hiện đại để xây dựng ứng dụng phía máy chủ hiệu quả và có khả năng mở rộng.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Mô tả

Repository khởi tạo TypeScript với framework [Nest](https://github.com/nestjs/nest).

## Thiết lập dự án

```bash
$ npm install
```

## Cấu hình cơ sở dữ liệu

Backend đọc cấu hình kết nối MySQL từ các biến môi trường. File `.env.example`
chỉ là mẫu tên biến; ứng dụng không tự động tải file `.env` và không có thông
tin đăng nhập mặc định.

Các biến bắt buộc:

```text
DB_HOST
DB_PORT
DB_USERNAME
DB_PASSWORD
DB_DATABASE
```

Tính năng đồng bộ schema tự động đã bị tắt. Sau khi cấu hình đủ các biến môi
trường, chạy migration đã được lưu trong repository bằng các lệnh sau:

```bash
$ npm run migration:run
$ npm run migration:revert
```

## Biên dịch và chạy dự án

```bash
# phát triển
$ npm run start

# chế độ theo dõi thay đổi
$ npm run start:dev

# chế độ production
$ npm run start:prod
```

## Chạy test

```bash
# unit test
$ npm run test

# e2e test
$ npm run test:e2e

# độ bao phủ test
$ npm run test:cov
```

## Triển khai

Khi sẵn sàng triển khai ứng dụng NestJS lên môi trường production, cần thực hiện
các bước cần thiết để ứng dụng vận hành hiệu quả. Xem [tài liệu triển khai](https://docs.nestjs.com/deployment)
để biết thêm thông tin.

Nếu cần nền tảng cloud để triển khai ứng dụng NestJS, có thể tham khảo
[Mau](https://mau.nestjs.com), nền tảng chính thức để triển khai ứng dụng NestJS
trên AWS. Mau hỗ trợ triển khai qua một số bước ngắn:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

Mau cho phép triển khai ứng dụng bằng một số thao tác, giúp nhóm tập trung vào
phát triển chức năng thay vì quản lý hạ tầng.

## Khả năng quan sát

Trong ứng dụng production, khả năng quan sát giúp hiểu hành vi hệ thống, phát
hiện vấn đề sớm và duy trì hiệu năng ổn định.

[NestJS Observe](https://observe.nestjs.com) tự động bổ sung cơ chế quan sát cho
ứng dụng NestJS, giúp theo dõi hệ thống với cấu hình tối thiểu:

- **Theo dõi phân tán:** Theo dõi request qua các dịch vụ và hiểu luồng xử lý trong hệ thống.
- **Phân tích waterfall:** Trực quan hóa quá trình xử lý request và xác định thao tác chậm, điểm nghẽn hoặc độ trễ bất thường.
- **Phân tích hiệu năng:** Phân tích hiệu năng ứng dụng theo thời gian thực và nhanh chóng xác định khu vực cần tối ưu.
- **Chỉ số:** Theo dõi chỉ số chính của ứng dụng và hạ tầng để hiểu tình trạng hệ thống và xu hướng hiệu năng.
- **Ghi log:** Tập trung log và liên kết với trace cùng dữ liệu đo lường khác để hỗ trợ gỡ lỗi.
- **Theo dõi lỗi:** Phát hiện lỗi nhanh và điều tra nguyên nhân gốc với ngữ cảnh liên quan.
- **Theo dõi SLA:** Theo dõi mục tiêu cấp độ dịch vụ và nhận biết khi ứng dụng tiến gần hoặc vượt ngưỡng đã xác định.
- **Cảnh báo:** Thiết lập cảnh báo cho lỗi nghiêm trọng, suy giảm hiệu năng, vi phạm SLA và bất thường khác để nhóm phản ứng kịp thời.

## Tài nguyên tham khảo

Các tài nguyên có thể hữu ích khi làm việc với NestJS:

- Xem [tài liệu NestJS](https://docs.nestjs.com) để tìm hiểu thêm về framework.
- Khi cần đặt câu hỏi hoặc hỗ trợ, truy cập [kênh Discord](https://discord.gg/G7Qnnhy).
- Xem các [khóa học](https://courses.nestjs.com/) video chính thức để thực hành chuyên sâu.
- Dùng [NestJS Mau](https://mau.nestjs.com) để hỗ trợ triển khai ứng dụng lên AWS.
- Dùng [NestJS Observer](https://observer.nestjs.com) để tự động bổ sung trace phân tán, chỉ số, log, theo dõi lỗi và hiệu năng.
- Dùng [NestJS Devtools](https://devtools.nestjs.com) để trực quan hóa đồ thị ứng dụng và tương tác với ứng dụng NestJS theo thời gian thực.
- Xem dịch vụ [hỗ trợ doanh nghiệp](https://enterprise.nestjs.com) khi dự án cần hỗ trợ chuyên môn.
- Theo dõi [X](https://x.com/nestframework) và [LinkedIn](https://linkedin.com/company/nestjs) để nhận thông tin cập nhật.
- Xem [bảng việc làm](https://jobs.nestjs.com) để tìm hoặc đăng cơ hội việc làm.

## Hỗ trợ

Nest là dự án mã nguồn mở theo giấy phép MIT và được duy trì nhờ các nhà tài trợ
cùng cộng đồng hỗ trợ. Xem [thông tin hỗ trợ NestJS](https://docs.nestjs.com/support)
để biết thêm chi tiết.

## Thông tin liên hệ

- Tác giả - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## Giấy phép

Nest sử dụng [giấy phép MIT](https://github.com/nestjs/nest/blob/master/LICENSE).
