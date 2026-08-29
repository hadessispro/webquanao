# HƯỚNG DẪN SỬ DỤNG ADMIN — điển

> Tài liệu này mô tả **đầy đủ từng bước** cách dùng trang quản trị (admin). Vì không chèn được ảnh chụp màn hình trực tiếp, mỗi phần được mô tả theo dạng: **đường dẫn menu → tên field chính xác → điền gì → kết quả ngoài web**. Bạn mở admin lên và làm theo song song.

---

## 0. Đăng nhập & tổng quan giao diện

**Đăng nhập**
1. Mở trình duyệt, vào địa chỉ: `https://<tên-miền-của-bạn>/admin` (ví dụ khi chạy máy local là `http://localhost:3000/admin`).
2. Nhập email + mật khẩu tài khoản admin → **Login**.

**Bố cục màn hình**
- **Cột trái** là danh sách các mục quản lý, chia 2 nhóm:
  - **Collections** (dữ liệu nhiều bản ghi): Users, Media, Fonts, Product Videos, Products, Collections, Pages, Discount Codes, Customers, Orders.
  - **Globals** (cấu hình dùng chung, 1 bản ghi): Header, Footer, Site Settings.
- **Giữa màn hình**: danh sách bản ghi (list) hoặc form chỉnh sửa.
- **Nút "Save"** (Lưu) luôn nằm **góc trên bên phải** của form. **Chỉnh xong phải bấm Save** thì mới có tác dụng.

**Quy tắc chung quan trọng**
- Web đang chạy **tiếng Việt**. Nhiều field có 2 phiên bản: field tiếng Anh và field **"Vietnamese ..."** (tiếng Việt). **Hãy sửa field tiếng Việt** thì mới hiển thị đúng ra ngoài.
- Sau khi bấm **Save**, thay đổi hiển thị ra web **gần như ngay lập tức** (không cần deploy lại), trừ khi có ghi chú riêng.
- Ảnh/tệp bạn tải lên trong admin được lưu và phục vụ tự động — không cần copy file thủ công.

---

## 1. SẢN PHẨM (Products)

Menu trái → **Products**.

### 1.1 Tạo / sửa sản phẩm
- **Tạo mới**: bấm **Create New** (góc trên phải danh sách).
- **Sửa**: bấm vào tên sản phẩm trong danh sách.
- Các field chính (khu vực giữa): **title** (tên), **handle** (đường dẫn, ví dụ `ao-so-mi-xanh`), **subtitle** (mô tả ngắn dưới tên), **description** (mô tả chi tiết).
- Khu vực **sidebar (cột phải)**: **price**, **compareAtPrice**, **sizeChartImage**, **status**...
- **status**: `active` = hiển thị ngoài web; `draft`/`archived` = ẩn.
- Xong bấm **Save**.

### 1.2 Giá & Giá giảm (gạch ngang) — SIDEBAR
Trong cột phải (sidebar):
- **price** = *giá bán hiện tại* (VND, số nguyên, ví dụ `9594000`).
- **compareAtPrice** = *giá gốc/giá cũ trước khi giảm* (ví dụ `12000000`).

**Cách hoạt động ngoài web:**
- Nếu **compareAtPrice > price** → web hiện: ~~giá gốc~~ (gạch ngang) + giá bán, ở **cả trang danh sách lẫn trang chi tiết**.
- Nếu **compareAtPrice để trống hoặc ≤ price** → chỉ hiện 1 giá (giá bán), không gạch ngang.

> Lưu ý: đừng nhập ngược. Muốn "giảm từ 123.456đ còn 100.000đ" thì `price = 100000`, `compareAtPrice = 123456`.

### 1.3 Ảnh sản phẩm (Images)
- Field **images** (dạng danh sách). Bấm **Add item** để thêm ảnh.
- Mỗi ảnh: chọn **image** (tải từ máy lên) hoặc dán **sourceUrl** (link ảnh ngoài); có thể thêm **alt** (mô tả) và **variantIds** (gắn ảnh cho biến thể màu cụ thể).
- Kéo–thả để đổi thứ tự ảnh.

### 1.4 Màu sắc (Colors / colorOptions) — tên tiếng Việt + ảnh mẫu màu
Field **colorOptions** (danh sách màu). Mỗi màu gồm:
- **value**: *giá trị màu khớp với biến thể* (ví dụ `black`, `white`). **Bắt buộc nhập đúng** để màu liên kết được ảnh/biến thể.
- **label**: *tên hiển thị cho khách* — đây là chỗ ghi **tiếng Việt** (ví dụ `Đen`, `Trắng`, `Xanh sọc`).
- **swatchImage**: tải ảnh mẫu màu (ô tròn màu) — hoặc **swatch** (mã màu hex).
- **position**: thứ tự (số nhỏ hiện trước).
- **available**: bỏ tick để **ẩn** màu đó.

> **QUAN TRỌNG (đã sửa lỗi mất màu):** Bạn **không cần khai báo hết tất cả màu**. Chỉ cần thêm màu nào bạn muốn đặt tên tiếng Việt / gắn ảnh mẫu. Các màu còn lại của sản phẩm vẫn **tự động hiển thị** như cũ. Muốn ẩn 1 màu thì thêm nó vào đây và bỏ tick **available**.

### 1.5 Size (sizeOptions / options / variants)
- **sizeOptions / options**: khai báo danh sách size (S, M, L...).
- **variants**: các biến thể (tổ hợp màu + size) kèm tồn kho, giá. Khi bạn nhập **price** ở sidebar, hệ thống tự áp giá đó cho các biến thể.

### 1.6 Video sản phẩm (upload mp4 + gắn theo màu)
Field **videos** (danh sách). Mỗi video:
- **video**: **tải file MP4/WebM trực tiếp từ máy** lên (đã cho phép định dạng video), hoặc dán **sourceUrl** (link video ngoài).
- **poster**: ảnh bìa video (tùy chọn).
- **color**: *nhập ĐÚNG giá trị màu (value) của biến thể* để video **chỉ hiện khi khách chọn màu đó**. Ví dụ: video áo đen ghi `black`, video áo trắng ghi `white`. **Để trống** nếu muốn video hiện cho **mọi màu**.
- **placement**: vị trí video trong cột ảnh (`inherit` / `after-images` / `manual`). Nếu chọn `manual` thì dùng **position** để sắp thứ tự.
- **autoplay / loop / muted / controls**: tùy chọn phát.

> Ví dụ gắn video theo màu: sản phẩm có màu đen và trắng → thêm 2 video, video 1 điền color = `black`, video 2 điền color = `white`. Khách chọn màu nào sẽ thấy video màu đó.

### 1.7 Bảng size (ảnh) & công cụ "tìm size"
- **Bảng size (ảnh)**: ở **sidebar**, field **sizeChartImage** → tải ảnh bảng size lên. Ngoài web, khách bấm nút **"bảng size"** trong popup size sẽ thấy đúng ảnh này.
- **Công cụ "tìm size"** (nhập chiều cao/cân nặng/dáng → gợi ý size): cấu hình ở **Site Settings → Size finder** (xem mục 7.6). Đây là công cụ dùng chung cho toàn shop.
- Trong popup ngoài web: nút **"gợi ý size"** = công cụ tính; nút **"bảng size"** = ảnh bảng size bạn tải ở trên. (Đã sửa lỗi 2 nút hiện chung 1 ảnh.)

### 1.8 Ba tab "chi tiết / giao hàng / đổi size" (Info tabs)
Field **"Info tabs (chi tiết / giao hàng / đổi size)"** — nhóm gồm 3 ô soạn thảo:
- **Tab "chi tiết"**
- **Tab "giao hàng"**
- **Tab "đổi size"**

Nhập nội dung trực tiếp vào 3 ô này → ngoài trang chi tiết sản phẩm, 3 tab dưới nút đặt hàng sẽ hiển thị đúng nội dung đó. Để trống ô nào thì tab đó dùng nội dung mặc định.

> (Field **accordions** phía dưới là nội dung cũ, chỉ dùng khi để trống Info tabs — bạn có thể bỏ qua.)

### 1.9 SEO sản phẩm
Field **seo** (nhóm): **title** (tiêu đề trên Google/tab trình duyệt) và **description** (mô tả). Điền vào đây → thẻ tiêu đề/mô tả của trang sản phẩm sẽ dùng nội dung này. Để trống thì tự lấy tên + mô tả sản phẩm.

### 1.10 Sản phẩm liên quan (relatedProducts)
Field **relatedProducts**: chọn các sản phẩm gợi ý kèm ("có thể bạn thích") hiển thị ở cuối trang chi tiết.

### 1.11 Gán sản phẩm vào bộ sưu tập
Có 2 cách: gán trong sản phẩm (nếu có field collections), hoặc **vào Collections → mở bộ sưu tập → thêm sản phẩm** (xem mục 2).

---

## 2. BỘ SƯU TẬP (Collections) & TRANG "XEM TẤT CẢ" (shop-all)

Menu trái → **Collections** (product-collections).

### 2.1 Tạo / sửa bộ sưu tập
- **title**: tên bộ sưu tập.
- **handle**: đường dẫn (ví dụ `coats-jackets`, `shop-all`).
- **description**: mô tả.
- **products**: danh sách sản phẩm thuộc bộ sưu tập (bấm để chọn/sắp xếp). Nếu không chọn thủ công, hệ thống tự lấy theo quy tắc.
- **seo**: title + description cho trang bộ sưu tập.
- Bấm **Save**.

### 2.2 Trang "Xem tất cả" (shop-all) — QUAN TRỌNG
Trang shop-all được đánh số **tự động bắt đầu từ 01** và tiêu đề tiếng Việt (đã sửa lỗi bắt đầu từ 05). Muốn tùy chỉnh tiêu đề/mô tả từng khối:
1. Vào **Collections** → mở bộ sưu tập có **handle = `shop-all`**.
2. Tìm field **"View All sections"** (chỉ hiện với bộ sưu tập shop-all). Mỗi mục cho phép chỉnh:
   - **title** / **titleVi**: tiêu đề khối (tiếng Anh / tiếng Việt).
   - **barDescription**: mô tả nhỏ.
3. Bấm **Save**. Số thứ tự (01, 02, 03...) được tự động thêm theo các khối **có sản phẩm** (khối trống bị ẩn, không để lại khoảng trống).

---

## 3. TRANG NỘI DUNG (Pages) — về điển, about, campaign...

Menu trái → **Pages**.

### 3.1 Trang "về điển" (our story) — chỉnh chữ & ảnh
1. Vào **Pages** → mở trang **"về điển"** (slug = `our-story`).
2. Cuộn tới field **Sections** (các khối nội dung). Có các loại khối:
   - **Image with text**: khối có **ảnh** — sửa **heading** (tiêu đề), **body** (nội dung), **image** (đổi ảnh bằng cách tải ảnh mới), **imagePosition** (ảnh trái/phải).
   - **Text section**: khối chỉ có chữ — **heading** + **body**.
3. Sửa chữ, đổi ảnh, **thêm/xóa/kéo thứ tự** các khối tùy ý.
4. Bấm **Save** → trang về điển ngoài web cập nhật theo.

> Nếu trang chưa có khối Sections nào, ngoài web sẽ hiển thị **nội dung tiếng Việt mặc định** (không bao giờ trống). Khi bạn thêm khối, nội dung khối sẽ thay cho mặc định.

### 3.2 Trang "about" / "campaign" / trang chính sách
- Mở trang tương ứng trong **Pages**, chỉnh **content** (soạn thảo) hoặc **Sections**.
- **contentHtml** là nội dung HTML cũ (thường không cần đụng).

### 3.3 Tạo trang mới
1. **Pages → Create New**.
2. Nhập **title**, **slug** (đường dẫn, ví dụ `size-guide`), chọn **template**, **status = published**.
3. Thêm nội dung ở **content** hoặc **Sections**.
4. **Save**. Trang sẽ truy cập được tại `/<slug>` hoặc `/pages/<slug>`.

---

## 4. MEDIA (ảnh & video)

Menu trái → **Media**.
- **Upload**: bấm **Create New** → kéo/thả hoặc chọn file. **Hỗ trợ cả ảnh và video (MP4/WebM).**
- **alt**: mô tả ảnh (nên điền, tốt cho SEO & khả năng tiếp cận).
- File đã tải sẽ dùng lại được ở mọi nơi có ô "upload" (logo, hero, ảnh sản phẩm, ảnh trang...).

---

## 5. HEADER (logo, menu, thanh khuyến mãi)

Menu trái → Globals → **Header**.
- **logo**: tải logo header (nếu để trống dùng logo mặc định).
- **logoAlt**: mô tả logo. **logoHref**: link khi bấm logo (mặc định `/`).
- **shippingBar** (thanh chạy trên cùng / khuyến mãi):
  - **enabled**: bật/tắt.
  - **text**: nội dung tiếng Anh.
  - **Vietnamese text (textVi)**: **nội dung tiếng Việt** — *sửa ô này* để đổi chữ thanh khuyến mãi ngoài web.
  - **href**: link khi bấm vào thanh.
- **navigation**: menu trên cùng + mega menu. Mỗi mục có **label / Vietnamese label**, chọn **collection** (tự sinh link) hoặc nhập **href** thủ công; bật **megaMenu** để hiện menu lớn nhiều cột.
- Bấm **Save**.

---

## 6. FOOTER

Menu trái → Globals → **Footer**.
- **desktopLogo / mobileLogo**: logo chân trang.
- **columns**: các cột menu ở footer — mỗi cột có **title / Vietnamese title** và danh sách **links** (label / Vietnamese label / url).
- **newsletter**: tiêu đề, mô tả, nút... (mỗi cái đều có bản **Vietnamese**).
- **socialLinks**: chọn nền tảng (Instagram/TikTok/Facebook/Twitter) + dán **url**.
- **copyright**, **locationText**: dòng bản quyền và địa điểm.
- Bấm **Save**.

---

## 7. SITE SETTINGS (hero, SEO trang chủ, popup, social, tìm size)

Menu trái → Globals → **Site Settings**.

### 7.1 Home Hero Banner (ảnh lớn trang chủ)
Nhóm **homeHero**:
- **enabled**: bật/tắt hero.
- **desktopImage / mobileImage**: tải ảnh hero cho máy tính / điện thoại.
- **eyebrow / title / body / ctaLabel** (và các bản **...Vi** tiếng Việt): chữ trên hero.
- **href**: link khi bấm hero (mặc định trỏ tới trang shop-all).
- **textPosition**: vị trí chữ (bottom-left/center/right...). **textTheme**: màu chữ (light/dark).
- **overlayOpacity / imageOpacity**: độ tối lớp phủ / độ mờ ảnh (để chữ + logo rõ).
- **flipHorizontal (Lật ảnh theo chiều ngang)**: **tick vào nếu muốn lật gương ảnh hero**. Mặc định TẮT = ảnh đúng chiều gốc (đã sửa lỗi ảnh bị lật ngược).

### 7.2 SEO trang chủ
Nhóm **seo**: **title**, **description**, **image** — dùng cho thẻ tiêu đề/mô tả/preview của **trang chủ**.

### 7.3 Newsletter Popup
Nhóm **newsletterPopup**: bật/tắt, tiêu đề, mô tả, thời điểm hiện... (có bản tiếng Việt).

### 7.4 Social links
Danh sách **socialLinks** (label + href).

### 7.5 Site name / description
**siteName**, **siteDescription**: tên & mô tả chung của site.

### 7.6 Size finder — công cụ "tìm size"
Field **"Size finder (công cụ 'tìm size')"** — dạng dữ liệu JSON có cấu trúc:
```json
{
  "heights": ["≤1m66", "1m68–1m70", "1m71–1m75", "1m76–1m78", "1m80–1m87"],
  "fits": [
    {
      "key": "ôm",
      "label": "ôm",
      "weights": ["≤53 kg", "54–58 kg", "..."],
      "matrix": [
        ["S", "S", "..."],
        ["S", "M", "..."]
      ]
    },
    { "key": "thoải mái", "label": "thoải mái", "weights": ["..."], "matrix": [["..."]] }
  ]
}
```
- **heights** = danh sách chiều cao (ô "chọn chiều cao").
- Mỗi **fits** (ôm / thoải mái) có **weights** = danh sách cân nặng, và **matrix** = size gợi ý.
- **matrix** đọc theo: *dòng = chiều cao* (thứ tự trong `heights`), *cột = cân nặng* (thứ tự trong `weights`).
- Chỉ **sửa giá trị** (đổi `"M"` → `"L"`, thêm/bớt chiều cao/cân nặng), **giữ nguyên cấu trúc** (dấu ngoặc, tên khóa). Để trống = dùng bảng mặc định.

---

## 8. ĐƠN HÀNG, MÃ GIẢM GIÁ, KHÁCH HÀNG

- **Orders** (Đơn hàng): xem danh sách đơn, trạng thái, sản phẩm trong đơn, thông tin khách. Cập nhật trạng thái xử lý ở đây.
- **Discount Codes** (Mã giảm giá): tạo mã (code), kiểu giảm (theo % hoặc số tiền), giá trị, điều kiện áp dụng, thời hạn.
- **Customers** (Khách hàng): danh sách khách + thông tin liên hệ.

---

## 9. FONTS
Menu trái → **Fonts**: quản lý phông chữ dùng cho site (tải file font, đặt tên). Chỉ dùng khi cần đổi bộ chữ.

---

## 10. LƯU Ý QUAN TRỌNG

1. **Luôn bấm Save** sau khi chỉnh. Đa số thay đổi hiển thị ra web ngay.
2. **Tiếng Việt**: ưu tiên điền các field có nhãn **"Vietnamese ..."** vì web đang chạy tiếng Việt.
3. **Ảnh/video**: tải trực tiếp trong admin là được, hệ thống tự phục vụ file (không cần copy thủ công).
4. **Giá giảm**: chỉ hiện gạch ngang khi *compareAtPrice > price*.
5. **Màu sản phẩm**: chỉ cần khai báo màu muốn đặt tên tiếng Việt/ảnh mẫu; các màu khác vẫn tự hiện. Bỏ tick **available** để ẩn 1 màu.
6. **Trang về điển**: chỉnh ở **Pages → về điển → Sections**.
7. Khi thêm **field/chức năng mới trong code** (do lập trình cập nhật), có thể cần chạy lệnh cập nhật cơ sở dữ liệu trên máy chủ — phần này do người kỹ thuật xử lý khi deploy (xem `docs/deploy-vps.md`).

---

*Nếu có mục nào trên admin chưa thấy hoặc chưa rõ, chụp màn hình chỗ đó gửi lại để được hướng dẫn cụ thể hơn.*
