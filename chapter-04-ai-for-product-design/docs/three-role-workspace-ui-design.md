# Thiết kế không gian làm việc cho 3 vai trò RMS-AI

## 1. Mục tiêu và phạm vi

Tài liệu này mô tả kiến trúc thông tin, luồng, trạng thái và ranh giới trình
bày cho ba không gian làm việc PM, HR và DEV của RMS-AI. Mục tiêu là tạo một thiết kế
Chapter 4 có thể rà soát và một bản mẫu Frontend thể hiện đúng phạm vi sản phẩm
ba vai trò.

Trạng thái tổng thể: **GIAO DIỆN ĐỀ XUẤT** dựa trên các yêu cầu **ĐÃ XÁC NHẬN**.
Bản mẫu không phải hành vi trong môi trường vận hành, không triển khai xác thực hoặc phân
quyền kỹ thuật, và không khẳng định các tích hợp dữ liệu đã tồn tại.

Thiết kế giữ luồng quyết định cốt lõi của PM:

```text
Dự án
-> Đánh giá rủi ro
-> Giải thích rủi ro
-> Đề xuất nhân sự
-> Mô phỏng giả định
-> Quyết định của PM
```

Các bất biến được giữ nguyên:

- AI hỗ trợ; PM quyết định.
- Mô phỏng không phải thay đổi phân bổ thật.
- Quyết định Chấp nhận không đồng nghĩa việc áp dụng đã thành công.
- Ứng viên không mặc định là một phương án phân bổ hoàn chỉnh.

Tài liệu không định nghĩa API, cơ sở dữ liệu, mô hình ML, công thức rủi ro, công
thức ghép nối, công thức tác động, ngữ nghĩa availability, utilization,
workload, bench hoặc allocation.

## 2. Nguồn yêu cầu

Nguồn có thẩm quyền theo thứ tự:

1. `chapter-03-ai-for-requirements-product-analysis/docs/PRD.md`
2. `chapter-03-ai-for-requirements-product-analysis/docs/user-stories.md`
3. `chapter-03-ai-for-requirements-product-analysis/docs/acceptance-criteria.md`

Các tài liệu UI PM hiện có được dùng để giữ tính liên tục của thiết kế, không
thay thế cơ sở yêu cầu.

| Phạm vi UI | Câu chuyện người dùng | Tiêu chí chấp nhận chính | Trạng thái |
| --- | --- | --- | --- |
| PM xem rủi ro và giải thích | US-01 | AC-US-01-01, AC-US-01-04 | ĐÃ XÁC NHẬN; cách trình bày là GIAO DIỆN ĐỀ XUẤT |
| PM xem đề xuất | US-02 | AC-US-02-01 đến AC-US-02-05 | ĐÃ XÁC NHẬN; tiêu chí phù hợp và dữ liệu thiếu còn TBD |
| PM mô phỏng | US-03 | AC-US-03-01 đến AC-US-03-05 | Bất biến không phá hủy dữ liệu ĐÃ XÁC NHẬN; đầu vào và tác động còn TBD |
| PM quyết định | US-04 | AC-US-04-01 đến AC-US-04-07 | Quyền quyết định ĐÃ XÁC NHẬN; áp dụng và phục hồi còn TBD |
| HR xem/duy trì Employee, Skill, EmployeeSkill | US-05 | AC-US-05-01 đến AC-US-05-04 | Phạm vi ĐÃ XÁC NHẬN; UI, dữ liệu và vòng đời còn TBD |
| DEV xem ngữ cảnh của mình | US-06 | AC-US-06-01 đến AC-US-06-05 | Phạm vi xem ĐÃ XÁC NHẬN; thao tác ghi và mô phỏng còn TBD |
| Không gian làm việc theo vai trò | US-07 | AC-US-07-01 đến AC-US-07-03 | Kết quả sản phẩm ĐÃ XÁC NHẬN; Auth/RBAC và ánh xạ danh tính còn TBD |

Quy ước trong tài liệu:

- **ĐÃ XÁC NHẬN:** có căn cứ trực tiếp từ PRD, câu chuyện người dùng hoặc tiêu chí chấp nhận.
- **GIAO DIỆN ĐỀ XUẤT:** lựa chọn trình bày hoặc tương tác để rà soát.
- **TBD:** chưa có đủ căn cứ để xác định hành vi hoặc quy tắc.

## 3. Mô hình tác nhân

### PM

PM là người dùng chính và là thẩm quyền quyết định. PM xem Tổng quan, Dự án,
Trung tâm rủi ro, Chi tiết rủi ro, giải thích, Đề xuất nhân sự, Mô phỏng và
thực hiện Chấp nhận/Từ chối trong luồng bản mẫu. Nội dung này truy vết US-01 đến
US-04 và AC-US-07-02.

### HR

HR là người dùng hỗ trợ dữ liệu nguồn lực. Không gian làm việc chỉ bao phủ
Employee, Skill và Employee ↔ Skill ở mức cần thiết cho RMS-AI theo US-05.
Tiền lương, chấm công, nghỉ phép, tuyển dụng, đánh giá hiệu suất, khen thưởng,
tài chính, quản lý hợp đồng và HRIS tổng quát nằm ngoài phạm vi.

### DEV

DEV là người dùng hỗ trợ tiêu thụ ngữ cảnh cá nhân. Không gian làm việc chỉ
trình bày thông tin và Skill của chính DEV cùng ngữ cảnh Project/Sprint/Task
khi dữ liệu tồn tại theo US-06. Bản mẫu hiện không hiển thị thao tác ghi hoặc
mô phỏng của DEV vì các khả năng này vẫn TBD; quyền quyết định Chấp nhận/Từ
chối của PM cũng không được hiển thị cho DEV.

## 4. Kiến trúc thông tin

Khái niệm sản phẩm tương lai:

```text
RMS-AI
  -> Xác định danh tính [TBD kỹ thuật]
  -> Xác định role [TBD kỹ thuật]
     -> PM Workspace
     -> HR Workspace
     -> DEV Workspace
```

Bản mẫu hiện tại:

```text
Role Preview [GIAO DIỆN ĐỀ XUẤT]
  -> PM: Tổng quan | Dự án | Trung tâm rủi ro
  -> HR: Tổng quan nguồn lực | Nhân sự | Kỹ năng
  -> DEV: Tổng quan của tôi | Kỹ năng của tôi | Công việc của tôi
```

Đề xuất nhân sự, Mô phỏng và Quyết định là các bước theo ngữ cảnh dự án trong
không gian làm việc PM, không phải điều hướng toàn cục. Nhân sự chuyển khỏi
điều hướng PM và thuộc không gian làm việc HR.

## 5. Luồng sản phẩm liên vai trò

```text
HR
-> dữ liệu Employee / Skill / EmployeeSkill được phép
-> đầu vào nguồn lực cho các bước xử lý tiếp theo của RMS-AI

DEV
-> ngữ cảnh cá nhân và công việc được cung cấp
-> chỉ xem Project / Sprint / Task của chính mình

PM
-> ngữ cảnh dự án và nguồn lực
-> Risk
-> Recommendation
-> Simulation
-> Decision
```

Luồng này không khẳng định dữ liệu HR đã tích hợp vào Frontend, PM Chấp nhận sẽ
tự động áp dụng phân bổ, hoặc DEV lập tức nhận nhiệm vụ mới.

## 6. Giao diện đăng nhập đề xuất

Trạng thái: **GIAO DIỆN ĐỀ XUẤT / TBD kỹ thuật**. Đây là khái niệm cho một giai
đoạn tương lai, không được hiện thực như Auth giả trong bản mẫu hiện tại.

```text
RMS-AI
Không gian hỗ trợ quyết định

Email
Mật khẩu

[Đăng nhập]
```

Các nội dung còn **TBD**:

- Nguồn danh tính.
- Cơ chế xác thực.
- Cách xác định vai trò.
- Ngữ nghĩa lỗi đăng nhập.
- Quan hệ User Account ↔ Employee.

Khôi phục hoặc đặt lại mật khẩu nằm ngoài phạm vi hiện tại.

## 7. Chế độ xem theo vai trò trong bản mẫu

Chế độ xem theo vai trò (`Role Preview`) là màn hình đầu vào gọn để người rà
soát chọn PM, HR hoặc DEV. Màn hình ghi rõ “Bản mẫu giao diện theo vai trò” và
“Xác thực tài khoản chưa được triển khai trong bản mẫu này”. Mỗi lựa chọn là
một `button` có tên vai trò, phạm vi ngắn và hành động mở không gian làm việc.
Ở màn hình máy tính, phần giới thiệu và danh sách vai trò dùng bố cục hai cột;
PM có viền nhấn nhẹ để phản ánh vai trò chính nhưng HR và DEV vẫn là lựa chọn
hoạt động bình thường. Đây là **GIAO DIỆN ĐỀ XUẤT**, không phải quy tắc ưu tiên
truy cập.

Chế độ xem theo vai trò là **GIAO DIỆN ĐỀ XUẤT** để duyệt UI:

```text
Role Preview != Authentication
Role Preview != Authorization
Role Preview != Security
```

Bản mẫu không tạo tên người dùng, ảnh đại diện, email, công ty, phòng ban hoặc
phiên làm việc giả. Hành động “Đổi vai trò bản mẫu” quay về màn hình đầu vào
này và không được gọi là “Đăng xuất”.

## 8. Không gian làm việc PM

Không gian làm việc PM tái sử dụng nền tảng sản phẩm và luồng trạng thái hiện
có. Phần trình bày dùng thanh bên hẹp trên màn hình máy tính để tách điều hướng
toàn cục khỏi luồng quyết định theo dự án. Điều hướng toàn cục gồm:

1. Tổng quan.
2. Dự án.
3. Trung tâm rủi ro.

Luồng theo ngữ cảnh:

```text
Trung tâm rủi ro
-> Chi tiết rủi ro
-> Đề xuất nhân sự
-> Mô phỏng
-> Quyết định
```

Ngữ cảnh Project được giữ khi đi từ chi tiết đến đề xuất. Ngữ cảnh ứng viên
được giữ khi đi từ đề xuất đến mô phỏng/quyết định. Điều hướng quay lại giữ đúng
dự án. Dữ liệu minh họa Project/Risk/Recommendation/Simulation hiện có tiếp tục
được sử dụng trong bản mẫu PM, không phải dữ liệu môi trường vận hành.

Phân cấp thị giác đặt tiêu đề và ngữ cảnh trước, sau đó đến dữ liệu/hành động
chính, siêu dữ liệu và cuối cùng là ghi chú GIAO DIỆN ĐỀ XUẤT/TBD. Tổng quan ưu tiên dự
án cần chú ý; chi tiết rủi ro ưu tiên kết quả và yếu tố giải thích;
đề xuất dùng danh sách có thứ hạng; mô phỏng tách rõ phương án, hành
động chạy, tác động và quyết định. Lựa chọn trình bày này không bổ sung quy tắc
nghiệp vụ.

Quyết định hiển thị Chấp nhận/Từ chối chỉ có ở PM. Trạng thái chấp nhận trong
bản mẫu không tuyên bố việc áp dụng trong thực tế đã thành công.

## 9. Không gian làm việc HR

### Tổng quan nguồn lực

Trình bày ba nền tảng dữ liệu theo danh sách có cấu trúc: dữ liệu nhân sự, dữ
liệu kỹ năng và liên kết nhân sự — kỹ năng. Trạng thái tích hợp nằm ở vùng phụ,
không có trọng lượng ngang với ba nền tảng. Không hiển thị KPI giả. Khi Frontend
chưa tích hợp, UI ghi “Chưa kết nối dữ liệu vận hành”.

### Nhân sự

Tái sử dụng `EmployeesView` ở trạng thái rỗng có chủ đích. UI xác nhận kho mã
nguồn có nền tảng Employee ở Backend nhưng không tuyên bố Frontend đã tích hợp
và không tạo danh sách nhân sự giả.

### Kỹ năng

Trình bày nền tảng Skill và EmployeeSkill đã được kho mã nguồn xác nhận. UI
ghi “Dữ liệu kỹ năng chưa được kết nối vào giao diện”. Trường dữ liệu, thang
mức kỹ năng, vòng đời và kiểm tra dữ liệu vẫn là **TBD**.

Khả năng duy trì dữ liệu của HR được yêu cầu xác nhận ở US-05, nhưng bản mẫu
Chapter 4 này chỉ tạo nền tảng trình bày; CRUD đầy đủ, API và lưu trữ không được
triển khai.

## 10. Không gian làm việc DEV

### Tổng quan của tôi

Trình bày một trạng thái ngữ cảnh cá nhân chung và ba hàng Hồ sơ của tôi, Kỹ
năng của tôi, Ngữ cảnh công việc. Cách nhóm này tránh lặp ba trạng thái rỗng
ngang hàng. Vì chưa có Auth hoặc ánh xạ danh tính, UI ghi “Chưa có danh tính người
dùng trong bản mẫu” thay vì tạo lời chào hoặc người dùng giả.

### Kỹ năng của tôi

Hiển thị trạng thái chưa khả dụng có chủ đích. Không có dữ liệu Skill giả và
không có nút Thêm/Sửa/Xóa vì khả năng thao tác ghi của DEV là **TBD-12**.

### Công việc của tôi

Dành vùng chỉ xem cho Dự án, Sprint và Task. Khi chưa có ánh xạ Người dùng đã
xác thực → Employee → Project/Sprint/Task, mỗi vùng hiển thị trạng thái không có
dữ liệu. Các thao tác nhận/hoàn thành Task, cập nhật tiến độ hoặc thay đổi phân
bổ vẫn TBD và chưa được hiển thị trong bản mẫu hiện tại.

Khả năng mô phỏng của DEV là **TBD-12** nên chưa được hiển thị trong bản mẫu
hiện tại.

## 11. Ranh giới trình bày quyền

Đây là ranh giới khả năng được trình bày, không phải ma trận RBAC kỹ thuật.

| Khả năng trình bày | PM | HR | DEV | Căn cứ |
| --- | --- | --- | --- | --- |
| Rủi ro → Đề xuất → Mô phỏng | Có | Không | Chưa hiển thị (TBD-12) | US-01 đến US-03; mô phỏng của DEV là TBD-12 |
| Chấp nhận/Từ chối | Có | Không | Không | US-04; AC-US-05-04; AC-US-06-05; AC-US-07-02 |
| Không gian Employee/Skill/EmployeeSkill | Không nằm trong điều hướng PM | Có | Chỉ xem Skill của mình khi có danh tính | US-05; US-06 |
| Thao tác ghi của DEV | Không áp dụng | Không áp dụng | Chưa hiển thị (TBD-12) | AC-US-06-04; TBD-12 |

**Việc hiển thị trên Frontend không thay thế phân quyền ở Backend.** Cơ chế xác
thực, kiểm tra vai trò và thực thi quyền vẫn là **TBD-11** và không được triển
khai trong lượt này.

## 12. Trạng thái rỗng / chưa khả dụng

| Khu vực | Trạng thái thiết kế | Điều không được suy diễn |
| --- | --- | --- |
| HR Tổng quan | Chưa kết nối dữ liệu vận hành | Không suy ra số lượng Employee/Skill hoặc KPI |
| HR Nhân sự | Chưa có dữ liệu Frontend để hiển thị | Không tạo Employee, email, phòng ban, chức danh hoặc dữ liệu HR giả |
| HR Kỹ năng | Dữ liệu kỹ năng chưa kết nối | Không tạo Skill hoặc quan hệ EmployeeSkill giả |
| DEV Tổng quan | Chưa có danh tính người dùng | Không tạo tên, ảnh đại diện, hồ sơ hoặc ánh xạ Employee giả |
| DEV Kỹ năng | Không thể xác định Skill của người dùng | Không suy ra khả năng thao tác ghi |
| DEV Công việc | Không có ngữ cảnh Project/Sprint/Task được cung cấp | Không tạo nhiệm vụ để lấp khoảng trống |
| PM rủi ro | Giữ các trạng thái hiện có: `available`/`unavailable` | Không xem thiếu dữ liệu là rủi ro thấp |
| PM đề xuất | Giữ trạng thái có danh sách/không có ứng viên phù hợp | Không ép ứng viên không phù hợp vào danh sách |

## 13. Chuyển đổi trạng thái

Trạng thái của bản mẫu được phân tách theo vai trò để không tạo tổ hợp bất hợp lệ.

```text
Role Preview
  -> chọn PM  -> PM / Tổng quan
  -> chọn HR  -> HR / Tổng quan nguồn lực
  -> chọn DEV -> DEV / Tổng quan của tôi

Trong workspace
  -> Đổi vai trò bản mẫu
  -> Role Preview
```

Khi quay về chế độ xem theo vai trò, trạng thái không gian làm việc hiện tại bị
hủy. Chọn một vai trò luôn mở màn hình đầu tiên hợp lệ của vai trò đó. Mã
Project, mã ứng viên, trạng thái mô phỏng và trạng thái quyết định của PM không
được mang sang HR hoặc DEV.

Trạng thái theo ngữ cảnh của PM giữ chuỗi:

```text
risk overview
-> risk detail(projectId)
-> recommendation(projectId)
-> simulation(projectId, candidateId)
-> decision(projectId, candidateId)
```

Không thêm React Router hoặc thư viện phụ thuộc quản lý trạng thái cho bản mẫu này.

## 14. Hành vi đáp ứng

Thiết kế được rà soát tại các mốc 1440px, 1280px, 1024px và 768px:

- Khung nội dung dùng chiều rộng giới hạn và khoảng trắng nhất quán.
- Từ 1024px trở lên, không gian làm việc dùng thanh bên hẹp và vùng nội dung riêng.
- Ở 768px, thanh bên chuyển thành phần đầu trang nhiều hàng; điều hướng chia đều
  ba mục để tránh ép chữ và không tạo tràn ngang cho toàn trang.
- Luồng theo ngữ cảnh có thể cuộn trong chính vùng của nó ở chiều rộng hẹp; đây
  là vùng tràn chủ động duy nhất.
- Các lựa chọn vai trò chuyển từ hàng đầy đủ sang bố cục gọn khi màn hình hẹp.
- Các phần HR/DEV chuyển từ nhiều cột sang một cột trước khi nội dung bị ép.
- Các hàng PM, phần so sánh mô phỏng và hành động quyết định chuyển sang một cột
  khi không còn đủ chiều rộng.

Không yêu cầu một ứng dụng riêng hoàn chỉnh cho thiết bị di động, nhưng không
được có tràn ngang ngoài vùng luồng theo ngữ cảnh được chủ động cho phép.

## 15. Khả năng tiếp cận

- Chọn vai trò, điều hướng, quay lại, quyết định và đổi vai trò dùng `button` có
  ngữ nghĩa; không dùng `div` có thể nhấp.
- Mỗi vùng điều hướng nằm trong `nav` và có nhãn hỗ trợ tiếp cận.
- Mục điều hướng đang hoạt động dùng `aria-current="page"`.
- Bước theo ngữ cảnh hiện tại của PM dùng `aria-current="step"`.
- Trạng thái `focus-visible` dùng đường viền rõ và không chỉ dựa vào màu.
- Mỗi màn hình có một `h1`; các phần dùng `h2` theo thứ bậc.
- Trạng thái rỗng/chưa khả dụng dùng câu chữ, không dùng màu làm tín hiệu duy nhất.
- Trạng thái quyết định và trạng thái rỗng quan trọng tiếp tục dùng `status` hoặc
  `note` có ngữ nghĩa khi phù hợp.

## 16. Các quyết định còn TBD

- Nguồn danh tính, cơ chế Auth, cách xác định vai trò và phân quyền ở Backend.
- Quan hệ User Account ↔ Employee và phạm vi xem dữ liệu chi tiết.
- UI, API, trường dữ liệu, vòng đời và kiểm tra dữ liệu để HR duy trì Employee,
  Skill và EmployeeSkill.
- Thang mức kỹ năng và ý nghĩa của từng mức.
- Khả năng thao tác ghi của DEV: sửa Skill, gửi tiến độ, thay đổi phân bổ hoặc
  tự nhận Task.
- DEV có được chạy mô phỏng trong tương lai hay không.
- Ngữ nghĩa availability, utilization, workload, bench và allocation.
- Toàn bộ công thức rủi ro, ghép nối và tác động mô phỏng.
- Điều kiện đủ, thời điểm áp dụng và phục hồi sau khi PM Chấp nhận.
- Chính sách dữ liệu cũ, thử lại và quyết định lặp.

## 17. Danh sách kiểm tra thủ công

- [ ] Xác nhận chế độ xem theo vai trò là điều khiển của bản mẫu, không phải Auth.
- [ ] Xác nhận giao diện đăng nhập chỉ là đề xuất tương lai và các quyết định kỹ thuật vẫn TBD.
- [ ] Xác nhận điều hướng PM chỉ có Tổng quan, Dự án và Trung tâm rủi ro.
- [ ] Chạy luồng PM từ rủi ro đến Chấp nhận/Từ chối và kiểm tra ngữ cảnh Project/ứng viên.
- [ ] Xác nhận Đề xuất và Mô phỏng không nằm trong điều hướng toàn cục.
- [ ] Xác nhận HR chỉ có Tổng quan nguồn lực, Nhân sự và Kỹ năng.
- [ ] Xác nhận HR không có khả năng quyết định của PM hoặc nghiệp vụ HRIS ngoài phạm vi.
- [ ] Xác nhận thao tác ghi và mô phỏng của DEV không được hiển thị trong bản mẫu hiện tại vì vẫn TBD.
- [ ] Xác nhận không có người dùng, Employee, Skill, nhiệm vụ hoặc KPI giả mới.
- [ ] Xác nhận trạng thái rỗng/chưa khả dụng không che giấu khoảng trống dữ liệu.
- [ ] Xác nhận đổi vai trò đặt lại màn hình và toàn bộ trạng thái theo ngữ cảnh của PM.
- [ ] Rà soát 1440px, 1280px, 1024px và 768px; không có tràn ngoài vùng chủ động.
- [ ] Kiểm tra bàn phím, `focus-visible`, thứ bậc tiêu đề và `aria-current`.
- [ ] Xác nhận việc hiển thị trên Frontend không bị diễn giải thành phân quyền ở Backend.
- [ ] Ghi nhận quyết định của con người cho mọi nội dung GIAO DIỆN ĐỀ XUẤT và TBD.
