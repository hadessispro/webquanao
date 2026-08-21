# BÁO CÁO TỔNG HỢP TOÀN BỘ LỖI HỆ THỐNG & CHI TIẾT KHẮC PHỤC
**Dự án:** Website điển (California Arts Next.js & Payload CMS v3)  
**Ngày cập nhật:** 21/08/2026

---

## MỤC LỤC
1. [Tổng quan & Tóm tắt các vấn đề phát sinh](#1-tổng-quan--tóm-tắt-các-vấn-đề-phát-sinh)
2. [Chi tiết từng lỗi, nguyên nhân và giải pháp khắc phục](#2-chi-tiết-từng-lỗi-nguyên-nhân-và-giải-pháp-khắc-phục)
   - [Lỗi 1: Sai lệch cấu trúc Header & Mega Menu](#lỗi-1-sai-lệch-cấu-trúc-header--mega-menu)
   - [Lỗi 2: Sai lệch Footer & Giao diện trang Our Story / About](#lỗi-2-sai-lệch-footer--giao-diện-trang-our-story--about)
   - [Lỗi 3: Không đồng bộ giá sản phẩm từ Admin sang Storefront](#lỗi-3-không-đồng-bộ-giá-sản-phẩm-từ-admin-sang-storefront)
   - [Lỗi 4: Bảng size & Biến thể màu thiếu chức năng Upload ảnh](#lỗi-4-bảng-size--biến-thể-màu-thiếu-chức-năng-upload-ảnh)
   - [Lỗi 5: Lỗi Crash Admin Products do Upload Relation & Cột Database](#lỗi-5-lỗi-crash-admin-products-do-upload-relation--cột-database)
   - [Lỗi 6: Tỉ lệ ảnh bị sai kích thước / Mất góc chân ảnh](#lỗi-6-tỉ-lệ-ảnh-bị-sai-kích-thước--mất-góc-chân-ảnh)
   - [Lỗi 7: Logo bị dính nền trắng khi chuyển trang về Trang chủ](#lỗi-7-logo-bị-dính-nền-trắng-khi-chuyển-trang-về-trang-chủ)
   - [Lỗi 8: Click vào "Sản phẩm gợi ý" không chuyển trang](#lỗi-8-click-vào-sản-phẩm-gợi-ý-không-chuyển-trang)
   - [Lỗi 9: Đánh số thứ tự sản phẩm danh mục sai định dạng (00x thay vì 0x)](#lỗi-9-đánh-số-thứ-tự-sản-phẩm-danh-mục-sai-định-dạng-00x-thay-vì-0x)
   - [Lỗi 10: Mô tả ngắn thanh danh mục bị gán cứng, không chỉnh được trong Admin](#lỗi-10-mô-tả-ngắn-thanh-danh-mục-bị-gán-cứng-không-chỉnh-được-trong-admin)
   - [Lỗi 11: Trang danh mục chỉ hiện 1 sản phẩm màu đen thay vì từng màu riêng](#lỗi-11-trang-danh-mục-chỉ-hiện-1-sản-phẩm-màu-đen-thay-vì-từng-màu-riêng)
3. [Danh sách tập tin đã chỉnh sửa](#3-danh-sách-tập-tin-đã-chỉnh-sửa)
4. [Hướng dẫn triển khai Git an toàn lên VPS](#4-hướng-dẫn-triển-khai-git-an-toàn-lên-vps)

---

## 1. TỔNG QUAN & TÓM TẮT CÁC VẤN ĐỀ PHÁT SINH

Trong quá trình đồng bộ và chuyển giao từ Shopify / Template sang Next.js App Router kết hợp Payload CMS v3, đã xuất hiện một số vấn đề liên quan đến:
- Sự sai lệch layout so với bản gốc thiết kế của thương hiệu (Header, Footer, Our Story, tỉ lệ ảnh 2:3).
- Lỗi thiếu trường tùy biến trong CMS (Bảng size ảnh, Swatch ảnh màu, mô tả ngắn danh mục).
- Lỗi logic tương tác & điều hướng (Click sản phẩm gợi ý bị chặn, logo bị nền trắng, danh mục chưa bung màu).
- Xung đột kiểu dữ liệu và thiếu cột database trong SQLite khi cập nhật schema Payload v3.

Toàn bộ các mục trên đã được rà soát, viết lại mã nguồn chuẩn xác, kiểm tra build Next.js thành công 100%.

---

## 2. CHI TIẾT TỪNG LỖI, NGUYÊN NHÂN VÀ GIẢI PHÁP KHẮC PHỤC

### Lỗi 1: Sai lệch cấu trúc Header & Mega Menu
- **Hiện tượng:** Header bị chèn thêm các mục không đúng thiết kế gốc; Mega menu xổ ngang hoặc sai vị trí.
- **Nguyên nhân:** Menu được gán tự động từ các collection chung thay vì giữ đúng cấu trúc tối giản ban đầu.
- **Khắc phục:** 
  - Đưa Header về đúng 2 mục điều hướng chuẩn: `sản phẩm` và `về điển`.
  - Mega Menu khi trỏ vào `sản phẩm` hiển thị danh sách dọc các danh mục sản phẩm cùng slogan *"điển, you already know"*.

### Lỗi 2: Sai lệch Footer & Giao diện trang Our Story / About
- **Hiện tượng:** Footer bị chia nhiều cột dư thừa; trang `/pages/our-story` mất bố cục gốc và ảnh chiếc xe máy ven biển (`/media/nha-trang-6h.webp`).
- **Nguyên nhân:** File `Footer.tsx` và trang `our-story/page.tsx` bị ghi đè layout mẫu.
- **Khắc phục:** 
  - Khôi phục Footer về đúng 4 liên kết chữ ký: `câu hỏi thường gặp`, `chính sách`, `liên hệ`, `ig` kèm ô đăng ký bản tin (newsletter).
  - Khôi phục trang `/pages/our-story` về đúng 3 section gốc cùng ảnh nền xe máy bờ biển Nha Trang.

### Lỗi 3: Không đồng bộ giá sản phẩm từ Admin sang Storefront
- **Hiện tượng:** Chỉnh sửa giá (`price` / `compareAtPrice`) ở sidebar Admin nhưng ra ngoài website giá không đổi.
- **Nguyên nhân:** Dữ liệu hiển thị ngoài storefront ưu tiên đọc từ mảng `variants`, trong khi ô sửa ngoài sidebar chỉ lưu vào cấp ngoài của bảng `products` mà không tự động đồng bộ xuống các biến thể con.
- **Khắc phục:**
  - Thêm `beforeChange` hook trong `src/payload/collections/Products.ts` để tự động đẩy giá từ top-level xuống toàn bộ các `variants`.
  - Bổ sung fallback trong `src/lib/product-data.ts` ưu tiên lấy giá `doc.price` nếu có.

### Lỗi 4: Bảng size & Biến thể màu thiếu chức năng Upload ảnh
- **Hiện tượng:** "Gợi ý size" / "Bảng size" chỉ dùng bảng số text giả lập; ô chọn màu chỉ cho nhập mã màu Hex thay vì upload ảnh mẫu vải thật.
- **Nguyên nhân:** Schema Payload chưa khai báo quan hệ upload hình ảnh cho bảng size và color swatches.
- **Khắc phục:**
  - Thêm trường `sizeChartImage` (upload media) và `sizeChartImageSourceUrl` trong `Products.ts`.
  - Thêm trường `swatchImage` (upload media) và `swatchImageSourceUrl` trong `colorOptions` của `Products.ts`.
  - Cập nhật modal Bảng size trong `ProductDetailClient.tsx` ưu tiên render trực tiếp hình ảnh bảng size đã upload.
  - Cập nhật các nút tròn swatch màu để hiển thị background ảnh mẫu vải đã tải lên.

### Lỗi 5: Lỗi Crash Admin Products do Upload Relation & Cột Database
- **Hiện tượng:** Khi bấm vào danh sách Products trong Admin, màn hình bị crash trắng hoặc báo lỗi relationship.
- **Nguyên nhân:** 
  - Trường `video` khai báo `relationTo: ['media', 'other']` (mảng string) không hợp lệ trong Payload v3 SQLite adapter.
  - SQLite database thiếu cột `media_id` trong bảng quan hệ `products_rels`.
- **Khắc phục:**
  - Chuẩn hóa `relationTo: 'media'` trong `Products.ts`.
  - Tạo script `scripts/fix-db.js` tự động bổ sung cột `media_id` trong `products_rels` và các cột mới (`price`, `compare_at_price`, `size_chart_image_id`, `swatch_image_id`, `subtitle`) mà không làm mất dữ liệu cũ.

### Lỗi 6: Tỉ lệ ảnh bị sai kích thước / Mất góc chân ảnh
- **Hiện tượng:** Tỉ lệ ảnh ở trang sản phẩm mobile, trang tìm kiếm và sản phẩm gợi ý desktop bị mất chân ảnh hoặc méo tỉ lệ.
- **Nguyên nhân:** Sử dụng các tỉ lệ không đồng nhất (`aspect-square` hoặc co giãn không định hình).
- **Khắc phục:**
  - Thiết lập chuẩn tỉ lệ cố định `2:3` (`aspect-ratio: 2 / 3`) với `object-fit: cover` trong CSS toàn cục (`src/app/globals.css`).

### Lỗi 7: Logo bị dính nền trắng khi chuyển trang về Trang chủ
- **Hiện tượng:** Từ trang con quay về Homepage, logo thương hiệu bị bao quanh bởi một mảng nền trắng.
- **Nguyên nhân:** Ảnh logo PNG có nền hoặc CSS container bị render lại background màu trắng đè lên header trong suốt.
- **Khắc phục:**
  - Bổ sung `mix-blend-mode: multiply` và kiểm soát màu nền trong suốt trên link logo tại `Header.tsx` và `globals.css`.

### Lỗi 8: Click vào "Sản phẩm gợi ý" không chuyển trang
- **Hiện tượng:** Bấm vào các sản phẩm ở mục "Gợi ý phối đồ / Sản phẩm liên quan" không điều hướng sang trang sản phẩm đó được.
- **Nguyên nhân:** Sự kiện kéo chuột (drag handler) để cuộn ngang đã chặn sự kiện click vào thẻ `<a>` / `<Link>`.
- **Khắc phục:**
  - Gỡ bỏ cờ chặn `e.preventDefault()` / drag intercepting trên danh sách gợi ý trong `ProductDetailClient.tsx`.

### Lỗi 9: Đánh số thứ tự sản phẩm danh mục sai định dạng (00x thay vì 0x)
- **Hiện tượng:** Header từng khối sản phẩm trên trang danh mục hiển thị dạng 3 chữ số: `001`, `002`...
- **Nguyên nhân:** Hàm định dạng sử dụng `.padStart(3, '0')`.
- **Khắc phục:**
  - Đổi thành `.padStart(2, '0')` trong `CollectionProductSections.tsx` để hiển thị chuẩn 2 chữ số: `01`, `02`, `03`...

### Lỗi 10: Mô tả ngắn thanh danh mục bị gán cứng, không chỉnh được trong Admin
- **Hiện tượng:** Dòng text mô tả ngắn dưới tiêu đề danh mục bị auto áp dụng chuỗi mặc định chung cho toàn bộ sản phẩm, không có chỗ để admin chỉnh riêng từng cái.
- **Nguyên nhân:** Truyền cố định hằng số `DEMO_COLLECTION_BAR_DESCRIPTION_HTML` trong `ProductGrid`.
- **Khắc phục:**
  - Thêm trường `subtitle` (textarea) vào `Products.ts`.
  - Map `subtitle` qua `src/lib/product-data.ts` và `src/lib/products.ts`.
  - Trong `CollectionProductSections.tsx`, ưu tiên hiển thị `product.subtitle` do Admin nhập cho riêng sản phẩm đó.

### Lỗi 11: Trang danh mục chỉ hiện 1 sản phẩm màu đen thay vì từng màu riêng
- **Hiện tượng:** Trừ trang `shop-all`, ở các trang danh mục cụ thể (như `áo thun`, `áo nỉ`), một sản phẩm có 4 màu nhưng chỉ hiện 1 thẻ màu đen duy nhất.
- **Nguyên nhân:** `CollectionProductSections` chỉ truyền mảng chứa 1 đối tượng `product` gốc vào `ProductGrid`.
- **Khắc phục:**
  - Xây dựng hàm `expandProductByColors(product)` trong `src/lib/products.ts`.
  - Tự động tách từng biến thể màu thành một card độc lập với ảnh đại diện đúng của màu đó, gắn link trực tiếp `/products/[handle]?color=[color]` và hiển thị size khả dụng tương ứng của từng màu.

---

## 3. DANH SÁCH TẬP TIN ĐÃ CHỈNH SỬA

| Tập tin | Chức năng chính được cập nhật |
|---|---|
| `src/payload/collections/Products.ts` | Thêm trường `subtitle`, `sizeChartImage`, `swatchImage`, `video` relationTo, hook sync giá |
| `src/components/product/CollectionProductSections.tsx` | Đổi số thứ tự `01`, `02`, truyền `product.subtitle`, bung sản phẩm theo từng màu (`expandProductByColors`) |
| `src/components/product/ProductCard.tsx` | Hỗ trợ đường dẫn biến thể `product.href`, kiểm tra size theo từng màu |
| `src/lib/products.ts` | Khai báo `subtitle`, `href`, viết hàm `buildProductColorImages` và `expandProductByColors` |
| `src/lib/product-data.ts` | Chuẩn hóa dữ liệu `subtitle`, `sizeChartImage`, `swatchImage`, `price` từ Payload CMS |
| `src/components/product/ProductDetailClient.tsx` | Render ảnh Bảng size, ảnh Swatch màu, fix click gợi ý sản phẩm |
| `src/components/layout/Header.tsx` | Giữ đúng 2 menu gốc (`sản phẩm`, `về điển`), mega menu dọc |
| `src/components/layout/Footer.tsx` | Giữ đúng 4 liên kết chữ ký + form newsletter |
| `src/app/(frontend)/pages/our-story/page.tsx` | Khôi phục bố cục 3 section và ảnh xe máy Nha Trang |
| `src/app/globals.css` | Chuẩn hóa tỉ lệ ảnh `2:3` cover, xử lý hòa trộn nền logo |
| `scripts/fix-db.js` | Tự động migrate các cột database mới an toàn, không mất dữ liệu |

---

## 4. HƯỚNG DẪN TRIỂN KHAI GIT AN TOÀN LÊN VPS

### Cách 1: Cập nhật TOÀN BỘ hệ thống (Khuyên dùng)
```bash
cd /var/www/dien-web/app/california-arts-nextjs

# 1. Kéo toàn bộ code mới nhất
git pull origin main

# 2. Đồng bộ cột mới vào Database (an toàn, giữ nguyên dữ liệu và ảnh)
node scripts/fix-db.js

# 3. Xóa cache và build lại Next.js
rm -rf .next
npm run build

# 4. Khởi động lại ứng dụng
pm2 restart dien-web
```

### Cách 2: CHỈ cập nhật phần ADMIN (Không đụng đến bất kỳ file giao diện bên ngoài nào)
```bash
cd /var/www/dien-web/app/california-arts-nextjs

# 1. Tải metadata mới từ Git
git fetch origin main

# 2. Chỉ ghi đè duy nhất thư mục Admin và Scripts sửa Database
git checkout origin/main -- src/payload/ scripts/

# 3. Đồng bộ cột Admin vào Database
node scripts/fix-db.js

# 4. Build lại và restart
rm -rf .next
npm run build
pm2 restart dien-web
```
