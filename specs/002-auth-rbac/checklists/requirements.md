# Checklist chất lượng đặc tả — Authentication & RBAC

**Mục đích** Rà soát chất lượng đặc tả trước Gate 2.

**Ngày tạo** 2026-11-26

**Tài liệu** [Đặc tả Milestone 002](../spec.md)

## Content Quality

- [x] CHK001 Yêu cầu mô tả hành vi và giữ lựa chọn triển khai cho plan.
- [x] CHK002 Đặc tả nêu giá trị cho PM, HR, DEV và nhu cầu bảo vệ dữ liệu.
- [x] CHK003 Người phụ trách nghiệp vụ có thể đọc kịch bản và đối chiếu quyền.
- [x] CHK004 Các phần bắt buộc của template đã được điền.

## Requirement Completeness

- [x] CHK005 Các quyết định cần làm rõ đã được xử lý.
- [x] CHK006 Các quyền theo tài nguyên và vòng đời tài khoản đủ rõ để nghiệm thu.
- [x] CHK007 Tiêu chí thành công có giá trị kỳ vọng kiểm chứng được.
- [x] CHK008 Tiêu chí thành công độc lập với công nghệ triển khai.
- [x] CHK009 Mọi nhánh nghiệm thu có đầu vào và phạm vi quyền đã được duyệt.
- [x] CHK010 Có kịch bản phiên sai/hết hạn, sai vai trò/phạm vi, dữ liệu thiếu và phản hồi chậm.
- [x] CHK011 Phạm vi 002 và các nghiệp vụ kế tiếp được xác định.
- [x] CHK012 Các nguồn, phụ thuộc và giả định được ghi rõ.

## Feature Readiness

- [x] CHK013 Mỗi FR có kịch bản nghiệm thu tương ứng.
- [x] CHK014 Các kịch bản bao phủ đăng nhập/đăng xuất và workspace của ba vai trò.
- [x] CHK015 Có ca đối chiếu cho các kết quả đo về xác thực, cách ly quyền và hồi quy.
- [x] CHK016 Thiết kế session, schema và API mới được giữ cho plan. Ma trận kiểm kê endpoint hiện có theo đầu bài.

## Ghi chú

16/16 mục đạt. CHK005, CHK006 và CHK009 chuyển sang đạt sau khi D1–D3 được
duyệt ngày 2026-11-26 và tích hợp vào nguồn yêu cầu, ma trận quyền cùng tiêu chí
nghiệm thu. Dấu kiểm đánh giá đặc tả. Kiểm thử ứng dụng thuộc lượt triển khai.
