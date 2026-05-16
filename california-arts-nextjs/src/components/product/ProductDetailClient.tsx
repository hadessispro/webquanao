"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLayout } from "@/context/LayoutContext";
import { BrandPrice } from "@/components/ui/BrandCurrency";
import { formatVndAmount } from "@/lib/price";
import type { Product, ProductImage, ProductVariant, ProductVideo } from "@/lib/products";
import {
  getProductColors,
  getProductSizes,
  isProductSoldOut,
} from "@/lib/products";

type ProductPreview = Pick<Product, "handle" | "images" | "title" | "variants">;

type ProductDetailMediaItem =
  | {
      image: ProductImage;
      key: string;
      position: number;
      type: "image";
    }
  | {
      key: string;
      position: number;
      type: "video";
      video: ProductVideo;
    };

function normalizeOptionName(name: string) {
  return name.toLowerCase().trim();
}

function normalizeOptionValue(value?: string | null) {
  return (value || "").toLowerCase().trim().replace(/\s+/g, "-");
}

function getVariantOption(product: Product, variant: ProductVariant, optionName: string) {
  const option = product.options.find(
    (item) => normalizeOptionName(item.name) === normalizeOptionName(optionName),
  );
  const position = option?.position || (optionName.toLowerCase() === "color" ? 1 : 2);
  const key = `option${position}` as "option1" | "option2" | "option3";

  return variant[key] || "";
}

function buildColorImages(product: Product) {
  const allImgs = product.images
    .slice()
    .sort((a, b) => a.position - b.position);
  const colors = getProductColors(product);

  if (colors.length <= 1) return { [colors[0] || "default"]: allImgs };

  const leadPos: Record<string, number> = {};
  for (const v of product.variants) {
    const color = getVariantOption(product, v, "color");
    if (color && !leadPos[color] && v.featured_image) {
      leadPos[color] =
        (v.featured_image as { position?: number }).position ||
        v.featured_image.id ||
        999;
    }
  }

  for (const color of colors) {
    if (leadPos[color]) continue;
    const colorVarIds = product.variants
      .filter((v) => getVariantOption(product, v, "color") === color)
      .map((v) => v.id);
    const leadImg = allImgs.find((img) =>
      img.variant_ids.some((vid) => colorVarIds.includes(vid)),
    );
    if (leadImg) leadPos[color] = leadImg.position;
  }

  const sorted = [...colors].sort(
    (a, b) => (leadPos[a] ?? 999) - (leadPos[b] ?? 999),
  );

  const groups: Record<string, typeof allImgs> = {};
  for (let i = 0; i < sorted.length; i++) {
    const color = sorted[i];
    const start = leadPos[color] ?? 1;
    const nextStart =
      i + 1 < sorted.length ? (leadPos[sorted[i + 1]] ?? 9999) : 9999;
    groups[color] = allImgs.filter(
      (img) => img.position >= start && img.position < nextStart,
    );
    if (groups[color].length === 0) groups[color] = allImgs;
  }

  return groups;
}

function buildProductMediaItems(
  product: Product,
  images: ProductImage[],
): ProductDetailMediaItem[] {
  const imageItems: ProductDetailMediaItem[] = images.map((image, index) => ({
    image,
    key: `image-${image.id || index}`,
    position: image.position || index + 1,
    type: "image",
  }));
  const videoItems = (product.videos || []).map(
    (video, index) => ({
      key: `video-${video.id || index}`,
      position: video.position ?? 999 + index,
      type: "video" as const,
      video,
    }),
  );

  if (videoItems.length === 0) return imageItems;

  const usesManualPlacement =
    product.mediaLayout?.videoPlacement === "manual" ||
    (product.videos || []).some((video) => video.placement === "manual");

  if (usesManualPlacement) {
    return [...imageItems, ...videoItems].sort((a, b) => a.position - b.position);
  }

  return [
    ...imageItems,
    ...videoItems
      .filter((item) => item.video.placement !== "manual")
      .sort((a, b) => a.position - b.position),
  ];
}

function ProductMediaImage({
  image,
  index,
  title,
}: {
  image: ProductImage;
  index: number;
  title: string;
}) {
  return (
    <img
      className="product-detail__image"
      src={image.src}
      alt={image.alt || `${title} ${index + 1}`}
      width={image.width || undefined}
      height={image.height || undefined}
      loading={index === 0 ? "eager" : "lazy"}
    />
  );
}

function ProductMediaVideo({ video }: { video: ProductVideo }) {
  const autoplay = video.autoplay !== false;
  const muted = autoplay ? true : video.muted !== false;

  return (
    <video
      aria-label={video.alt || undefined}
      autoPlay={autoplay}
      className="product-detail__video"
      controls={video.controls === true}
      loop={video.loop !== false}
      muted={muted}
      playsInline
      poster={video.poster || undefined}
      preload="metadata"
      src={video.src}
    />
  );
}

const COLOR_MAP: Record<string, string> = {
  black: "#1a1a1a",
  "jet black": "#0a0a0a",
  "washed black": "#2a2a2a",
  blue: "#3b5998",
  "vintage blue": "#4a6fa5",
  "light rinse": "#8ba9c9",
  white: "#f7f7f2",
  "off-white": "#f5f5f0",
  ivory: "#f5f1e3",
  cream: "#f5f0e0",
  red: "#8b2020",
  merlot: "#722f37",
  sienna: "#a0522d",
  redwood: "#6b3a3a",
  olive: "#556b2f",
  green: "#4a6741",
  grey: "#808080",
  gray: "#808080",
  navy: "#1a2744",
  "sunfaded black": "#3a3a3a",
};

function colorToHex(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, hex] of Object.entries(COLOR_MAP)) {
    if (lower.includes(key)) return hex;
  }
  return "#c9c9c9";
}

function getColorControl(product: Product, color: string) {
  return product.colorOptions?.find(
    (option) =>
      normalizeOptionValue(option.value) === normalizeOptionValue(color) ||
      normalizeOptionValue(option.label) === normalizeOptionValue(color),
  );
}

function getColorLabel(product: Product, color: string) {
  const control = getColorControl(product, color);
  return control?.label || color;
}

function getColorSwatch(product: Product, color: string) {
  const control = getColorControl(product, color);
  return control?.swatch || colorToHex(color);
}

function getSizeLabel(product: Product, size: string) {
  const control = product.sizeOptions?.find(
    (option) =>
      normalizeOptionValue(option.value) === normalizeOptionValue(size) ||
      normalizeOptionValue(option.label) === normalizeOptionValue(size),
  );
  return control?.label || size;
}

function getSizeSelectorStyle(product: Product) {
  if (product.sizeSelectorStyle && product.sizeSelectorStyle !== "auto") {
    return product.sizeSelectorStyle;
  }

  return "text";
}

function formatPrice(value?: string) {
  return formatVndAmount(value);
}

const LYNDON_ACCORDION_CONTENT: Record<string, string> = {
  Details:
    "<p>- Bề mặt ngoài 100% len<br />- Phom oversized<br />- Cổ quân đội bản lớn<br />- Cổ đứng với nút cài<br />- Thiết kế hai hàng khuy<br />- Khuy đồng màu<br />- Túi viền phía trước<br />- Dáng dài qua gối<br />- Xẻ tà giữa thân sau<br />- Túi ngực bên trong<br />- Đai rời cùng chất liệu<br />- Đỉa đai phía sau</p><p>Chất liệu &amp; bảo quản<br />- Vỏ ngoài: 100% len<br />- Bảo quản: Chỉ giặt khô</p>",
  "Size & Fit":
    '<p>Phom dáng oversized với tỷ lệ rộng rãi. Hãy chọn size thường mặc để giữ đúng tinh thần thiết kế. Jude cao 1m85 và mặc size L.</p><p><a href="#size-guide">Hướng dẫn chọn size</a></p>',
  Sustainability:
    "<p>Được hoàn thiện từ 100% len có nguồn gốc có trách nhiệm và có khả năng phân hủy sinh học. Chủ ý không pha polyester hay các sợi vi nhựa khác.</p>",
  "Shipping & Returns":
    '<p>Miễn phí vận chuyển cho đơn tại Mỹ từ 150 USD và các thị trường khác từ 250 USD. Xem <a href="/pages/returns-exchanges">Vận chuyển &amp; đổi trả</a> để biết thêm lựa chọn và mức phí.</p><p>Chấp nhận hoàn tiền trong vòng 14 ngày kể từ khi giao hàng. Không phát sinh thuế hay phụ phí bất ngờ khi nhận hàng. California Arts sẽ chi trả phần thuế nhập khẩu phát sinh.</p>',
  "Need Assistance?":
    '<p>Liên hệ với chúng tôi qua <a href="mailto:clientservices@california-arts.com">clientservices@california-arts.com</a>.</p>',
};

function getFallbackAccordionHtml(product: Product, title: string) {
  if (product.handle === "lyndonoversizedwatchcoat" && LYNDON_ACCORDION_CONTENT[title]) {
    return LYNDON_ACCORDION_CONTENT[title];
  }

  switch (title) {
    case "Details":
      return product.material
        ? `<p>${product.material}</p>`
        : "<p>Được hoàn thiện với tỷ lệ cân nhắc kỹ và hướng đến nhu cầu mặc hằng ngày.</p>";
    case "Size & Fit":
      return "<p>Thiết kế theo phom relaxed của California Arts. Hãy chọn size thường mặc để có đúng dáng mong muốn.</p>";
    case "Sustainability":
      return "<p>Chúng tôi theo đuổi cách làm ít hơn nhưng tốt hơn, ưu tiên độ bền và tính sử dụng lâu dài.</p>";
    case "Shipping & Returns":
      return '<p>Miễn phí vận chuyển cho đơn hàng đủ điều kiện. Hỗ trợ hoàn trả trong vòng 14 ngày kể từ khi giao thành công.</p>';
    case "Need Assistance?":
      return '<p>Liên hệ với chúng tôi qua <a href="mailto:clientservices@california-arts.com">clientservices@california-arts.com</a>.</p>';
    default:
      return "";
  }
}

export default function ProductDetailClient({
  allProducts: _allProducts,
  product,
  suggestedProducts: _suggestedProducts,
  styleWithProducts: _styleWithProducts,
}: {
  allProducts: ProductPreview[];
  product: Product;
  suggestedProducts: ProductPreview[];
  styleWithProducts: ProductPreview[];
}) {
  const searchParams = useSearchParams();
  const { addCartItem, setIsCartOpen, t } = useLayout();
  const colors = getProductColors(product);
  const sizes = getProductSizes(product);
  const sizeSelectorStyle = getSizeSelectorStyle(product);
  const soldOut = isProductSoldOut(product);
  const colorImageMap = useMemo(() => buildColorImages(product), [product]);
  const initialVariantId = Number(searchParams.get("variant") || 0);
  const initialColorParam = searchParams.get("color") || undefined;
  const variantFromUrl = useMemo(() => {
    if (!initialVariantId) return undefined;
    return product.variants.find((variant) => variant.id === initialVariantId);
  }, [initialVariantId, product.variants]);
  const colorFromUrl = useMemo(() => {
    const colorParam = normalizeOptionValue(initialColorParam);
    if (!colorParam) return "";
    return (
      colors.find((color) => normalizeOptionValue(color) === colorParam) || ""
    );
  }, [colors, initialColorParam]);
  const resolvedInitialColor =
    (variantFromUrl && getVariantOption(product, variantFromUrl, "color")) ||
    colorFromUrl ||
    colors[0] ||
    "";
  const initialSize =
    (variantFromUrl && getVariantOption(product, variantFromUrl, "size")) || "";

  const [selColor, setSelColor] = useState(resolvedInitialColor);
  const [selSize, setSelSize] = useState(initialSize);
  const [mobileIdx, setMobileIdx] = useState(0);
  const [openAcc, setOpenAcc] = useState<number | null>(null);

  const imgs = useMemo(
    () => colorImageMap[selColor] || Object.values(colorImageMap)[0] || [],
    [colorImageMap, selColor],
  );
  const mediaItems = useMemo(
    () => buildProductMediaItems(product, imgs),
    [imgs, product],
  );
  const colorVariants = useMemo(
    () =>
      selColor
        ? product.variants.filter((v) => getVariantOption(product, v, "color") === selColor)
        : product.variants,
    [product, selColor],
  );
  const selVariant = useMemo(() => {
    if (selSize) {
      return colorVariants.find(
        (v) => getVariantOption(product, v, "size") === selSize,
      );
    }
    return colorVariants.find((v) => v.available) || colorVariants[0];
  }, [colorVariants, product, selSize]);

  const requiresSize = sizes.length > 0;
  const selectedVariantAvailable = selVariant?.available ?? !soldOut;
  const canAddToBag =
    !soldOut && selectedVariantAvailable && (!requiresSize || Boolean(selSize));
  const buttonLabel = soldOut
    ? t("soldOut")
    : requiresSize && !selSize
      ? t("selectSize")
      : selectedVariantAvailable
        ? t("addToBag")
        : t("unavailable");

  const price = selVariant
    ? formatPrice(selVariant.price)
    : formatPrice(product.variants[0]?.price);
  const cmpPrice = selVariant?.compare_at_price
    ? formatPrice(selVariant.compare_at_price)
    : null;
  const selectedImage =
    selVariant?.featured_image?.src ||
    imgs[0]?.src ||
    product.images[0]?.src ||
    product.videos?.[0]?.poster ||
    "";
  const selectedColorLabel = selColor ? getColorLabel(product, selColor) : "";
  const displayTitle = selectedColorLabel ? `${product.title} | ${selectedColorLabel}` : product.title;

  const accordions = useMemo(() => {
    const orderedTitles = [
      { title: "Details", label: t("details") },
      { title: "Size & Fit", label: t("sizeFit") },
      { title: "Sustainability", label: t("sustainability") },
      { title: "Shipping & Returns", label: t("shippingReturns") },
      { title: "Need Assistance?", label: t("needAssistance") },
    ];
    const payloadAccordions = product.accordions || [];

    return orderedTitles.map(({ label, title }) => {
      const payloadAccordion = payloadAccordions.find(
        (item) => item.title.toLowerCase() === title.toLowerCase(),
      );

      return {
        label,
        title,
        html: payloadAccordion?.html || getFallbackAccordionHtml(product, title),
      };
    });
  }, [product, t]);

  const pickColor = (color: string) => {
    setSelColor(color);
    setMobileIdx(0);
    setSelSize((currentSize) => {
      const stillAvailable = product.variants.some(
        (variant) =>
          getVariantOption(product, variant, "color") === color &&
          getVariantOption(product, variant, "size") === currentSize &&
          variant.available,
      );

      return stillAvailable ? currentSize : "";
    });
  };

  const nextMobileImage = () => {
    setMobileIdx((current) => {
      const bounded = Math.min(current, mediaItems.length - 1);
      return bounded === mediaItems.length - 1 ? 0 : bounded + 1;
    });
  };

  const prevMobileImage = () => {
    setMobileIdx((current) => {
      const bounded = Math.min(current, mediaItems.length - 1);
      return bounded === 0 ? mediaItems.length - 1 : bounded - 1;
    });
  };

  const addSelectedVariantToCart = () => {
    if (!canAddToBag || !selVariant) return;

    addCartItem({
      productId: product.id,
      handle: product.handle,
      title: product.title,
      image: selectedImage,
      variantId: selVariant.id,
      variantTitle: selVariant.title,
      color: selColor || undefined,
      size: selSize || undefined,
      sku: selVariant.sku,
      price: Number.parseInt(selVariant.price || "0", 10) || 0,
      compareAtPrice: selVariant.compare_at_price
        ? Number.parseInt(selVariant.compare_at_price, 10)
        : null,
    });
    setIsCartOpen(true);
  };

  const safeMobileIdx =
    mediaItems.length > 0 ? Math.min(mobileIdx, mediaItems.length - 1) : 0;
  const currentMobileMedia = mediaItems[safeMobileIdx];

  return (
    <section className="product-detail bg-primary-background text-primary-text">
      <div className="product-detail__layout">
        <div className="product-detail__media product-detail__media--desktop">
          {mediaItems.length > 0 ? (
            mediaItems.map((item, index) => (
              <figure
                className={
                  item.type === "image"
                    ? "product-detail__image-frame"
                    : "product-detail__video-frame"
                }
                key={item.key}
              >
                {item.type === "image" ? (
                  <ProductMediaImage
                    image={item.image}
                    index={index}
                    title={product.title}
                  />
                ) : (
                  <ProductMediaVideo video={item.video} />
                )}
              </figure>
            ))
          ) : (
            <div className="product-detail__empty-media">Chưa có hình ảnh</div>
          )}
        </div>

        <div className="product-detail__mobile-gallery">
          {currentMobileMedia ? (
            <div className="product-detail__mobile-frame">
              {currentMobileMedia.type === "image" ? (
                <ProductMediaImage
                  image={currentMobileMedia.image}
                  index={safeMobileIdx}
                  title={product.title}
                />
              ) : (
                <ProductMediaVideo video={currentMobileMedia.video} />
              )}

              {mediaItems.length > 1 && (
                <>
                  <button
                    aria-label="Ảnh sản phẩm trước"
                    className="product-detail__carousel-button product-detail__carousel-button--prev"
                    onClick={prevMobileImage}
                    type="button"
                  >
                    {"<"}
                  </button>
                  <button
                    aria-label="Ảnh sản phẩm kế tiếp"
                    className="product-detail__carousel-button product-detail__carousel-button--next"
                    onClick={nextMobileImage}
                    type="button"
                  >
                    {">"}
                  </button>
                  <div className="product-detail__dots" aria-hidden="true">
                    {mediaItems.map((item, index) => (
                      <button
                        className={
                          index === safeMobileIdx
                            ? "product-detail__dot product-detail__dot--active"
                            : "product-detail__dot"
                        }
                        key={item.key}
                        onClick={() => setMobileIdx(index)}
                        tabIndex={-1}
                        type="button"
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="product-detail__empty-media product-detail__empty-media--mobile">
              Chưa có hình ảnh
            </div>
          )}
        </div>

        <aside className="product-detail__summary">
          <div className="product-detail__summary-inner">
            <div className="product-detail__heading">
              <h1 className="product-detail__title">{displayTitle}</h1>
              <div className="product-detail__price">
                {cmpPrice && (
                  <span className="product-detail__compare-price">
                    <BrandPrice amount={cmpPrice} />
                  </span>
                )}
                <BrandPrice amount={price} />
              </div>
            </div>

            {product.body_html && (
              <div
                className="product-detail__description"
                dangerouslySetInnerHTML={{ __html: product.body_html }}
              />
            )}

            {colors.length > 1 && (
              <div
                aria-label={t("color")}
                className="product-detail__option product-detail__option--inline"
                role="group"
              >
                <span className="product-detail__option-label">{t("color")}</span>
                <div className="product-detail__swatches">
                  {colors.map((color) => {
                    const label = getColorLabel(product, color);

                    return (
                      <button
                        aria-label={label}
                        aria-pressed={selColor === color}
                        className={
                          selColor === color
                            ? "product-detail__swatch product-detail__swatch--active"
                            : "product-detail__swatch"
                        }
                        key={color}
                        onClick={() => pickColor(color)}
                        style={{ backgroundColor: getColorSwatch(product, color) }}
                        title={label}
                        type="button"
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div
                aria-label={t("size")}
                className="product-detail__option product-detail__option--inline"
                role="group"
              >
                <span className="product-detail__option-label">{t("size")}</span>
                <div
                  className={
                    sizeSelectorStyle === "text"
                      ? "product-detail__sizes product-detail__sizes--text"
                      : "product-detail__sizes product-detail__sizes--box"
                  }
                >
                  {sizes.map((size) => {
                    const available = colorVariants.some(
                      (v) =>
                        getVariantOption(product, v, "size") === size && v.available,
                    );
                    const active = selSize === size;
                    const label = getSizeLabel(product, size);

                    return (
                      <button
                        aria-pressed={active}
                        className={[
                          "product-detail__size",
                          sizeSelectorStyle === "text"
                            ? "product-detail__size--text"
                            : "product-detail__size--box",
                          active ? "product-detail__size--active" : "",
                          !available ? "product-detail__size--disabled" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        disabled={!available}
                        key={size}
                        onClick={() => setSelSize(size)}
                        type="button"
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              className="product-detail__add-button"
              disabled={!canAddToBag}
              onClick={addSelectedVariantToCart}
              type="button"
            >
              {buttonLabel}
            </button>

            <div className="product-detail__accordions">
              {accordions.map((accordion, index) => (
                <div
                  className={
                    openAcc === index
                      ? "product-detail__accordion product-detail__accordion--open"
                      : "product-detail__accordion"
                  }
                  key={accordion.title}
                >
                  <button
                    aria-expanded={openAcc === index}
                    className="product-detail__accordion-trigger"
                    onClick={() => setOpenAcc(openAcc === index ? null : index)}
                    type="button"
                  >
                    <span>{accordion.label}</span>
                    <span aria-hidden="true" className="product-detail__accordion-indicator">
                      {openAcc === index ? "-" : "+"}
                    </span>
                  </button>
                  <div className="product-detail__accordion-panel">
                    <div
                      className="product-detail__accordion-body"
                      dangerouslySetInnerHTML={{ __html: accordion.html }}
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </aside>
      </div>
    </section>
  );
}
