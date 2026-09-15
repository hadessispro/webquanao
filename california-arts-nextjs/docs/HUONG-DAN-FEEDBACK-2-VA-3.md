# HƯỚNG DẪN CHI TIẾT SỬ DỤNG & TEST THỰC TẾ (FEEDBACK 2 & FEEDBACK 3)

> **Tài liệu kiểm thử và vận hành thực tế hệ thống California Arts / Điển**  
> Dành cho Quản trị viên (Admin) và Tester. Đảm bảo tính năng hoạt động 100% trên môi trường thực tế, trực quan, dễ thao tác và không cần kiến thức kỹ thuật hay viết mã JSON.

---

## MỤC LỤC

1. [PHẦN 1: FEEDBACK 2 — Chữ & Nút cuối trang Bộ sưu tập (Bottom CTA)](#phần-1-feedback-2--chữ--nút-cuối-trang-bộ-sưu-tập-bottom-cta)
   - [1.1. Bản chất vấn đề & vị trí chính xác](#11-bản-chất-vấn-đề--vị-trí-chính-xác)
   - [1.2. Hướng dẫn cấu hình trong Admin](#12-hướng-dẫn-cấu-hình-trong-admin)
   - [1.3. Hình ảnh chụp thực tế màn hình Admin](#13-hình-ảnh-chụp-thực-tế-màn-hình-admin)
   - [1.4. Hình ảnh hiển thị thực tế ngoài Storefront](#14-hình-ảnh-hiển-thị-thực-tế-ngoài-storefront)
   - [1.5. Các bước test thực tế (Step-by-Step)](#15-các-bước-test-thực-tế-step-by-step)
2. [PHẦN 2: FEEDBACK 3 — Công cụ "Tìm size" (Size Finder) riêng cho từng sản phẩm](#phần-2-feedback-3--công-cụ-tìm-size-size-finder-riêng-cho-từng-sản-phẩm)
   - [2.1. Nâng cấp cốt lõi: Form giao diện trực quan thay vì mã JSON](#21-nâng-cấp-cốt-lõi-form-giao-diện-trực-quan-thay-vì-mã-json)
   - [2.2. Vị trí cấu hình trong Admin](#22-vị-trí-cấu-hình-trong-admin)
   - [2.3. Chi tiết 3 chế độ hoạt động](#23-chi-tiết-3-chế-độ-hoạt-động)
   - [2.4. Hướng dẫn thiết lập Form quy tắc gợi ý size (Size Rules Form)](#24-hướng-dẫn-thiết-lập-form-quy-tắc-gợi-ý-size-size-rules-form)
   - [2.5. Hình ảnh chụp thực tế màn hình Admin](#25-hình-ảnh-chụp-thực-tế-màn-hình-admin)
   - [2.6. Hình ảnh trải nghiệm thực tế ngoài Storefront](#26-hình-ảnh-trải-nghiệm-thực-tế-ngoài-storefront)
   - [2.7. Các bước test thực tế (Step-by-Step)](#27-các-bước-test-thực-tế-step-by-step)
3. [TỔNG KẾT & DANH SÁCH FILE ẢNH MINH CHỨNG](#tổng-kết--danh-sách-file-ảnh-minh-chứng)

---

# PHẦN 1: FEEDBACK 2 — Chữ & Nút cuối trang Bộ sưu tập (Bottom CTA)

## 1.1. Bản chất vấn đề & vị trí chính xác

- **Vấn đề phản ánh trước đây**: Khách hàng thấy ở cuối trang danh sách có dòng chữ và nút bấm (ví dụ: *"xem thêm về áo sơ mi"* / *"khám phá ngay"*), nhưng trong Admin không rõ chỉnh ở đâu, nút bấm bị chuyển hướng ngẫu nhiên hoặc không kiểm soát được liên kết đích.
- **Vị trí chính xác**: Đây **không phải là trang chi tiết sản phẩm**, mà là **cuối trang Danh mục / Bộ sưu tập (Collection Product Sections)** nằm ngay phía trên Footer.
- **Vị trí trong Payload Admin**:
  - Truy cập: **Admin Panel** $\rightarrow$ menu bên trái chọn **`Collections` (Bộ sưu tập)** $\rightarrow$ chọn bộ sưu tập muốn chỉnh sửa (ví dụ: *Coats & Jackets*, *Tailoring*, *Shop All*...).
  - Cuộn xuống khu vực: **`Nút & Dòng chữ cuối trang (Bottom CTA)`**.

---

## 1.2. Hướng dẫn cấu hình trong Admin

Trong mục **`Nút & Dòng chữ cuối trang (Bottom CTA)`**, quản trị viên có đầy đủ quyền kiểm soát với các trường sau:

| Tên trường | Tên kỹ thuật | Ý nghĩa & Cách dùng |
| :--- | :--- | :--- |
| **Ẩn khu vực này** | `hideCta` | Tích chọn nếu muốn **tắt hoàn toàn** dòng chữ và nút bấm ở cuối bộ sưu tập này. |
| **Dòng chữ nhỏ (Tiếng Việt)** | `eyebrowVi` | Câu dẫn chữ nhỏ tiếng Việt (ví dụ: `xem thêm về áo sơ mi`, `khám phá thêm mẫu mới`). Nếu để trống, mặc định hiển thị: `xem toàn bộ sản phẩm`. |
| **Dòng chữ nhỏ (Tiếng Anh)** | `eyebrow` | Câu dẫn chữ nhỏ tiếng Anh tương ứng (ví dụ: `explore more shirts`, `view all collection`). |
| **Chữ trên nút (Tiếng Việt)** | `buttonLabelVi` | Nội dung nút bấm tiếng Việt (ví dụ: `khám phá ngay`, `xem tất cả`). Mặc định: `khám phá ngay`. |
| **Chữ trên nút (Tiếng Anh)** | `buttonLabel` | Nội dung nút bấm tiếng Anh (ví dụ: `discover now`, `shop now`). |
| **Bộ sưu tập đích khi bấm nút** | `linkCollection` | Cho phép chọn một Bộ sưu tập khác trong hệ thống để khi khách bấm nút sẽ tự động chuyển đến đó (có ô tìm kiếm và chọn nhanh). |
| **Đường dẫn liên kết tùy chỉnh** | `customUrl` | Nếu không chọn từ danh sách bộ sưu tập ở trên, bạn có thể gõ link tùy ý (ví dụ: `/collections/shop-all`, `/pages/lookbook`, hoặc link ngoài `https://...`). |

---

## 1.3. Hình ảnh chụp thực tế màn hình Admin

### Bước 1: Vào mục Collections trong Admin
![Danh sách bộ sưu tập trong Admin](/docs-assets/fb2_admin_collections_list.png)

### Bước 2: Chỉnh sửa các trường của Bottom CTA trong Bộ sưu tập
![Cấu hình Bottom CTA trong Admin](/docs-assets/fb2_admin_collection_bottom_cta.png)

> **Nhận xét trực quan**:
> Màn hình Admin hiển thị rõ ràng từng trường song ngữ (Tiếng Việt & Tiếng Anh), có checkbox ẩn nút, và có lựa chọn chọn đích đến từ bộ sưu tập hoặc nhập URL tùy biến.

---

## 1.4. Hình ảnh hiển thị thực tế ngoài Storefront

Khi cấu hình xong và bấm **Save** trong Admin, ngoài website người dùng cuộn xuống cuối trang danh mục sản phẩm sẽ thấy chính xác nội dung vừa cấu hình:

![Hiển thị nút cuối trang trên Storefront](/docs-assets/fb2_storefront_bottom_cta.png)

> **Vị trí hiển thị**: Góc dưới bên phải trang sản phẩm, phía trên Footer. Khi rê chuột và bấm nút "khám phá ngay", hệ thống sẽ chuyển hướng chính xác đến đường dẫn đã cấu hình (ví dụ: `/collections/shop-all`).

---

## 1.5. Các bước test thực tế (Step-by-Step)

1. Mở trình duyệt, truy cập `http://localhost:3000/admin` (hoặc domain trên server).
2. Vào **Collections** $\rightarrow$ chọn bộ sưu tập bất kỳ (ví dụ: `Coats & Jackets`).
3. Cuộn xuống trường **Nút & Dòng chữ cuối trang (Bottom CTA)**.
4. Nhập thử nghiệm:
   - Dòng chữ nhỏ (Tiếng Việt): `xem thêm bộ sưu tập mới`
   - Chữ trên nút (Tiếng Việt): `xem ngay`
   - Đường dẫn liên kết tùy chỉnh: `/collections/tailoring`
5. Bấm nút **Save** ở góc trên bên phải Admin.
6. Mở tab mới truy cập trang ngoài website: `http://localhost:3000/collections/coats-jackets`.
7. Cuộn xuống cuối trang:
   - Kiểm tra dòng chữ nhỏ hiển thị đúng `xem thêm bộ sưu tập mới`.
   - Kiểm tra nút bấm hiển thị đúng `xem ngay`.
   - Bấm vào nút `xem ngay` $\rightarrow$ xác nhận trình duyệt điều hướng chính xác về `/collections/tailoring`.
8. Quay lại Admin, tích chọn ô **`Ẩn khu vực này (Không hiển thị nút cuối trang)`** $\rightarrow$ bấm **Save**.
9. Tải lại trang ngoài website $\rightarrow$ xác nhận khu vực nút này biến mất hoàn toàn và khoảng cách thẩm mỹ vẫn giữ nguyên.

---

# PHẦN 2: FEEDBACK 3 — Công cụ "Tìm size" (Size Finder) riêng cho từng sản phẩm

## 2.1. Nâng cấp cốt lõi: Form giao diện trực quan thay vì mã JSON

- **Vấn đề trước đây**: Quản trị viên phải chỉnh sửa một chuỗi JSON phức tạp trong Cài đặt chung, dễ sai sót cú pháp dấu ngoặc, và áp dụng chung cho tất cả các sản phẩm bất kể là áo, quần tây, hay áo khoác ngoại cỡ.
- **Giải pháp hoàn thiện**:
  1. **Tùy biến riêng theo từng sản phẩm**: Mỗi sản phẩm trong Admin đều có mục **Size Finder** riêng biệt.
  2. **Giao diện Form nhập liệu trực quan (Visual Array Form)**: Thêm/xóa quy tắc size bằng các ô nhập riêng: **Chiều cao**, **Cân nặng**, **Dáng (Ôm / Thoải mái)**, và **Size gợi ý**. Người dùng phổ thông hoàn toàn có thể sử dụng dễ dàng mà không cần lập trình viên.
  3. **Hỗ trợ format linh hoạt**: Cho phép gợi ý cả size chữ chuẩn quốc tế (`XS`, `S`, `M`, `L`, `XL`, `XXL`) hoặc size số cho quần tây / denim (`28`, `29`, `30`, `31`, `32`...).

---

## 2.2. Vị trí cấu hình trong Admin

- Truy cập: **Admin Panel** $\rightarrow$ menu bên trái chọn **`Products` (Sản phẩm)**.
- Bấm chọn sản phẩm cụ thể bạn muốn thiết lập bảng gợi ý size riêng.
- Cuộn xuống khu vực: **`Công cụ "Tìm size" (Size Finder)`**.

---

## 2.3. Chi tiết 3 chế độ hoạt động

Trường **Chế độ hoạt động** cung cấp 3 tùy chọn:

1. **`Dùng cấu hình chung từ Cài đặt website (Mặc định)`**:
   - Thích hợp với đa số sản phẩm thông thường. Hệ thống sẽ tự động dùng ma trận size tiêu chuẩn đã thiết lập chung.
2. **`Tùy chỉnh riêng cho sản phẩm này`**:
   - Dành riêng cho sản phẩm có form dáng đặc thù (ví dụ: áo khoác oversize, quần jean ống suông, đầm suông, áo polo slimfit...).
   - Khi chọn chế độ này, giao diện sẽ **tự động mở rộng** toàn bộ các ô nhập: mốc Chiều cao, mốc Cân nặng, và Form thêm quy tắc size.
3. **`Tắt tính năng tìm size cho sản phẩm này`**:
   - Dành cho các sản phẩm không cần tính năng gợi ý size (ví dụ: túi xách, khăn choàng, mũ nón, phụ kiện, hoặc sản phẩm một kích thước One-Size).
   - Khi tắt, ngoài trang sản phẩm nút "gợi ý size?" sẽ ẩn đi, chỉ giữ lại nút "bảng size" ảnh nếu có.

---

## 2.4. Hướng dẫn thiết lập Form quy tắc gợi ý size (Size Rules Form)

Khi chọn **`Tùy chỉnh riêng cho sản phẩm này`**, bạn thao tác qua các phần:

### A. Lựa chọn dáng sản phẩm (Fit Preference)
- **Tự động**: Hệ thống nhận diện theo loại sản phẩm (Áo có 2 dáng Ôm & Thoải mái; Quần chỉ có 1 dáng chuẩn).
- **Có cả 2 lựa chọn: Ôm & Thoải mái**: Luôn hiển thị 2 nút chuyển đổi dáng cho khách chọn.
- **Chỉ có 1 dáng chung**: Ẩn nút chọn dáng, chỉ dựa vào chiều cao và cân nặng để tìm size.

### B. Danh sách mốc Chiều cao & Cân nặng
- **Danh sách chiều cao**: Mỗi dòng nhập 1 mốc. Ví dụ:
  ```text
  ≤1m66
  1m68–1m70
  1m71–1m75
  1m76–1m78
  1m80–1m87
  ```
- **Danh sách cân nặng**: Mỗi dòng nhập 1 mốc. Ví dụ:
  ```text
  ≤53 kg
  54–58 kg
  59–61 kg
  62–64 kg
  65–69 kg
  70–74 kg
  75–81 kg
  82–86 kg
  ```

### C. Form Quy tắc gợi ý size (Visual Form)
- Bấm nút **`+ add size rule`** để thêm một quy tắc mới.
- Mỗi quy tắc bao gồm 4 ô trực quan:
  1. **Chiều cao**: Nhập mốc chiều cao tương ứng (ví dụ: `1m68–1m70`).
  2. **Cân nặng**: Nhập mốc cân nặng tương ứng (ví dụ: `54–58 kg`).
  3. **Dáng áp dụng**: Chọn `Ôm`, `Thoải mái`, hoặc `Chung`.
  4. **Size gợi ý**: Nhập size tương ứng (ví dụ: `S` hoặc `29`).
- Có thể thêm bao nhiêu dòng tùy thích, sắp xếp thứ tự kéo thả hoặc xóa dòng bằng nút menu 3 chấm.

---

## 2.5. Hình ảnh chụp thực tế màn hình Admin

### Cấu hình Size Finder khi chọn "Tùy chỉnh riêng cho sản phẩm này"
![Cấu hình Size Finder trong Admin](/docs-assets/fb3_admin_size_finder_custom.png)

### Chi tiết Form thêm quy tắc (Size Rules Form) trực quan
![Chi tiết Form nhập quy tắc size trong Admin](/docs-assets/fb3_admin_size_rules_form.png)

> **Điểm nổi bật**:
> Quản trị viên nhập liệu theo dạng thẻ từng hàng trực quan (Size Rule 01, Size Rule 02...). Mỗi hàng có nhãn rõ ràng, hỗ trợ chọn dáng dropdown và gõ size gợi ý trực tiếp. Hoàn toàn không xuất hiện một dòng code JSON nào!

---

## 2.6. Hình ảnh trải nghiệm thực tế ngoài Storefront

### Giao diện trang chi tiết sản phẩm
Phía dưới nút **`chọn kích cỡ`**, xuất hiện 2 liên kết tiện ích theo đúng ngôn ngữ thiết kế tối giản:
- **`gợi ý size?`**: Mở công cụ tương tác tìm size.
- **`bảng size`**: Mở bảng thông số kích thước chi tiết dạng ảnh.

![Nút gợi ý size ngoài trang sản phẩm](/docs-assets/fb3_storefront_product_page.png)

### Popup Modal tìm size tương tác trực tiếp
Khi khách bấm vào **`gợi ý size?`**, modal hiện đại mở lên với các lựa chọn mượt mà:
- Chọn dáng: **`ôm`** hoặc **`thoải mái`**.
- Chọn **chiều cao** từ danh sách thả xuống.
- Chọn **cân nặng** từ danh sách thả xuống.
- Bấm **`tìm size`** $\rightarrow$ Hệ thống tự động tính toán và khoanh tròn/gợi ý ngay size phù hợp nhất!

![Modal popup tìm size tương tác ngoài Storefront](/docs-assets/fb3_storefront_size_finder_modal.png)

---

## 2.7. Các bước test thực tế (Step-by-Step)

### Test Trường hợp 1: Sử dụng cấu hình riêng cho sản phẩm đặc thù
1. Mở Admin: `http://localhost:3000/admin/collections/products`.
2. Bấm vào sản phẩm `Hancock Mini Merino Polo`.
3. Cuộn xuống mục **Công cụ "Tìm size" (Size Finder)**.
4. Chọn **Chế độ hoạt động**: `Tùy chỉnh riêng cho sản phẩm này`.
5. Trong **Quy tắc gợi ý size (Thêm từng dòng trực tiếp)**:
   - Thêm quy tắc: Chiều cao `1m68–1m70`, Cân nặng `54–58 kg`, Dáng `Ôm` $\rightarrow$ Gợi ý size `S`.
   - Thêm quy tắc: Chiều cao `1m68–1m70`, Cân nặng `59–61 kg`, Dáng `Ôm` $\rightarrow$ Gợi ý size `M`.
   - Thêm quy tắc: Chiều cao `1m71–1m75`, Cân nặng `65–69 kg`, Dáng `Thoải mái` $\rightarrow$ Gợi ý size `L`.
6. Bấm nút **Save** trong Admin.
7. Mở trang sản phẩm ngoài website: `http://localhost:3000/products/hancockminimerinopolo`.
8. Bấm nút gạch chân **`gợi ý size?`**.
9. Trong cửa sổ hiện ra:
   - Chọn dáng: `ôm`
   - Chọn Chiều cao: `1m68–1m70`
   - Chọn Cân nặng: `54–58 kg`
   - Bấm nút **`tìm size`** $\rightarrow$ Xác nhận hệ thống đề xuất chính xác size **S**.
   - Đổi cân nặng thành `59–61 kg` $\rightarrow$ Xác nhận hệ thống đề xuất chuyển sang size **M**.
   - Đổi dáng sang `thoải mái`, chọn chiều cao `1m71–1m75` và cân nặng `65–69 kg` $\rightarrow$ Xác nhận hệ thống đề xuất size **L**.

### Test Trường hợp 2: Tắt công cụ tìm size cho sản phẩm phụ kiện / One-size
1. Quay lại Admin của sản phẩm đó.
2. Chọn **Chế độ hoạt động**: `Tắt tính năng tìm size cho sản phẩm này`.
3. Bấm **Save**.
4. Ra ngoài website và tải lại trang sản phẩm.
5. Xác nhận dòng chữ `gợi ý size?` đã biến mất, khách hàng không bị nhầm lẫn khi mua các sản phẩm không có size.

---

# TỔNG KẾT & DANH SÁCH FILE ẢNH MINH CHỨNG

Tất cả các ảnh chụp màn hình trong tài liệu này đều là **ảnh chụp thực tế từ hệ thống đang chạy** (không phải ảnh mockup hay thiết kế giả định) và được lưu trữ sẵn trong thư mục `public/docs-assets/`:

1. `public/docs-assets/fb2_admin_collections_list.png`: Màn hình danh sách Bộ sưu tập trong Admin.
2. `public/docs-assets/fb2_admin_collection_bottom_cta.png`: Màn hình chi tiết cài đặt Nút cuối trang (Bottom CTA).
3. `public/docs-assets/fb2_storefront_bottom_cta.png`: Màn hình hiển thị thực tế Bottom CTA ngoài website.
4. `public/docs-assets/fb3_admin_size_finder_custom.png`: Màn hình cấu hình Size Finder tùy chỉnh riêng cho sản phẩm.
5. `public/docs-assets/fb3_admin_size_rules_form.png`: Màn hình Form thêm quy tắc gợi ý size dạng bảng trực quan không dùng JSON.
6. `public/docs-assets/fb3_storefront_product_page.png`: Màn hình trang sản phẩm với các nút tiện ích size.
7. `public/docs-assets/fb3_storefront_size_finder_modal.png`: Màn hình Popup công cụ tìm size tương tác.
