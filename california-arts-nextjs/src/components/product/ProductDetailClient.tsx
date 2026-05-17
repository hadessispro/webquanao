"use client";

import React, { useMemo, useState } from "react";
import { useLayout } from "@/context/LayoutContext";
import { BrandPrice } from "@/components/ui/BrandCurrency";
import { formatVndAmount } from "@/lib/price";
import type { Product, ProductImage, ProductVariant, ProductVideo } from "@/lib/products";
import {
  getProductColors,
  getProductSizes,
  isProductSoldOut,
} from "@/lib/products";
import { BRAND_CONTACT_EMAIL, BRAND_INSTAGRAM_PROFILE_URL, BRAND_NAME } from "@/lib/brand";

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

const SIZE_FINDER_HEIGHTS = [
  "≤1m66",
  "1m68–1m70",
  "1m71–1m75",
  "1m76–1m78",
  "1m80–1m87",
] as const;

const SIZE_FINDER_CHART = {
  "ôm": {
    weightRanges: ["≤53 kg", "54–58 kg", "59–61 kg", "62–64 kg", "65–69 kg", "70–74 kg", "75–81 kg", "82–86 kg"] as const,
    matrix: [
      ["S", "S", "S", "M", "M", "L", "XL", "XXL"],
      ["S", "S", "M", "M", "M", "L", "XL", "XXL"],
      ["S", "M", "M", "M", "M", "L", "XL", "XXL"],
      ["M", "M", "M", "L", "L", "XL", "XL", "XXL"],
      ["M", "L", "L", "L", "XL", "XL", "XXL", "XXL"],
    ] as const,
  },
  "thoải mái": {
    weightRanges: ["≤53kg", "54–60kg", "61–63kg", "64–66kg", "67–73kg", "74–78kg", "79–85kg"] as const,
    matrix: [
      ["S", "M", "M", "L", "XL", "XXL", "XXL"],
      ["S", "M", "M", "L", "L", "XL", "XXL"],
      ["S", "M", "M", "L", "L", "XL", "XXL"],
      ["M", "M", "L", "L", "XL", "XL", "XXL"],
      ["M", "L", "L", "XL", "XL", "XL", "XXL"],
    ] as const,
  },
} as const;

type SizeFinderFit = keyof typeof SIZE_FINDER_CHART;
type SizeFinderView = "finder" | "chart";
type ProductInfoTab = "details" | "shipping" | "exchange";

function resolveSizeRecommendation(
  fit: SizeFinderFit,
  height: string,
  weight: string,
) {
  const heightIndex = SIZE_FINDER_HEIGHTS.findIndex((item) => item === height);
  const weightIndex = SIZE_FINDER_CHART[fit].weightRanges.findIndex((item) => item === weight);

  if (heightIndex < 0 || weightIndex < 0) {
    return null;
  }

  return SIZE_FINDER_CHART[fit].matrix[heightIndex]?.[weightIndex] || null;
}

const LYNDON_ACCORDION_CONTENT: Record<string, string> = {
  Details:
    "<p>- Bề mặt ngoài 100% len<br />- Phom oversized<br />- Cổ quân đội bản lớn<br />- Cổ đứng với nút cài<br />- Thiết kế hai hàng khuy<br />- Khuy đồng màu<br />- Túi viền phía trước<br />- Dáng dài qua gối<br />- Xẻ tà giữa thân sau<br />- Túi ngực bên trong<br />- Đai rời cùng chất liệu<br />- Đỉa đai phía sau</p><p>Chất liệu &amp; bảo quản<br />- Vỏ ngoài: 100% len<br />- Bảo quản: Chỉ giặt khô</p>",
  "Size & Fit":
    '<p>Phom dáng oversized với tỷ lệ rộng rãi. Hãy chọn size thường mặc để giữ đúng tinh thần thiết kế. Jude cao 1m85 và mặc size L.</p><p><a href="#size-guide">Hướng dẫn chọn size</a></p>',
  Sustainability:
    "<p>Được hoàn thiện từ 100% len có nguồn gốc có trách nhiệm và có khả năng phân hủy sinh học. Chủ ý không pha polyester hay các sợi vi nhựa khác.</p>",
  "Shipping & Returns":
    '<p>Miễn phí vận chuyển cho đơn hàng đủ điều kiện. Xem <a href="/pages/returns-exchanges">Vận chuyển &amp; đổi trả</a> để biết thêm chi tiết.</p><p>Hỗ trợ đổi trả trong vòng 14 ngày kể từ khi giao hàng thành công.</p>',
  "Need Assistance?":
    `<p>Liên hệ với chúng tôi qua <a href="mailto:${BRAND_CONTACT_EMAIL}">${BRAND_CONTACT_EMAIL}</a> hoặc <a href="${BRAND_INSTAGRAM_PROFILE_URL}" rel="noreferrer" target="_blank">instagram của ${BRAND_NAME}</a>.</p>`,
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
      return "<p>Thiết kế theo phom relaxed của điển. Hãy chọn size thường mặc để có đúng dáng mong muốn.</p>";
    case "Sustainability":
      return "<p>Chúng tôi theo đuổi cách làm ít hơn nhưng tốt hơn, ưu tiên độ bền và tính sử dụng lâu dài.</p>";
    case "Shipping & Returns":
      return '<p>Miễn phí vận chuyển cho đơn hàng đủ điều kiện. Hỗ trợ hoàn trả trong vòng 14 ngày kể từ khi giao thành công.</p>';
    case "Need Assistance?":
      return `<p>Liên hệ với chúng tôi qua <a href="mailto:${BRAND_CONTACT_EMAIL}">${BRAND_CONTACT_EMAIL}</a> hoặc nhắn trực tiếp qua <a href="${BRAND_INSTAGRAM_PROFILE_URL}" rel="noreferrer" target="_blank">instagram</a>.</p>`;
    default:
      return "";
  }
}

export default function ProductDetailClient({
  initialColorParam,
  initialVariantId = 0,
  product,
}: {
  initialColorParam?: string;
  initialVariantId?: number;
  product: Product;
}) {
  const { addCartItem, setIsCartOpen, t } = useLayout();
  const colors = getProductColors(product);
  const sizes = getProductSizes(product);
  const sizeSelectorStyle = getSizeSelectorStyle(product);
  const soldOut = isProductSoldOut(product);
  const colorImageMap = useMemo(() => buildColorImages(product), [product]);
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
  const [activeInfoTab, setActiveInfoTab] = useState<ProductInfoTab>("details");
  const [isSizeFinderOpen, setIsSizeFinderOpen] = useState(false);
  const [sizeFinderView, setSizeFinderView] = useState<SizeFinderView>("finder");
  const [desiredFit, setDesiredFit] = useState<SizeFinderFit>("ôm");
  const [selectedHeight, setSelectedHeight] = useState<string>("");
  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);

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

  const infoTabs = useMemo(() => {
    const accordionMap = new Map(
      accordions.map((accordion) => [accordion.title.toLowerCase(), accordion.html]),
    );
    const detailHtml = [
      accordionMap.get("details"),
      accordionMap.get("sustainability"),
    ]
      .filter(Boolean)
      .join("");
    const shippingHtml =
      accordionMap.get("shipping & returns") ||
      "<p>Miễn phí vận chuyển cho đơn hàng đủ điều kiện. Hỗ trợ hoàn trả trong vòng 14 ngày kể từ khi giao thành công.</p>";
    const exchangeHtml = [
      accordionMap.get("size & fit"),
      accordionMap.get("need assistance?"),
    ]
      .filter(Boolean)
      .join("");

    return [
      {
        key: "details" as const,
        label: t("details"),
        html:
          detailHtml ||
          "<p>Được hoàn thiện với tỷ lệ cân nhắc kỹ và hướng đến nhu cầu mặc hằng ngày.</p>",
      },
      {
        key: "shipping" as const,
        label: "giao hàng",
        html: shippingHtml,
      },
      {
        key: "exchange" as const,
        label: "đổi size",
        html:
          exchangeHtml ||
          "<p>Liên hệ với chúng tôi qua email hoặc instagram để được hỗ trợ đổi size phù hợp hơn.</p>",
      },
    ];
  }, [accordions, t]);

  const activeInfoTabData =
    infoTabs.find((tab) => tab.key === activeInfoTab) || infoTabs[0];

  const openSizeFinder = (view: SizeFinderView) => {
    setSizeFinderView(view);
    setIsSizeFinderOpen(true);
  };

  const handleFindSize = () => {
    setRecommendedSize(resolveSizeRecommendation(desiredFit, selectedHeight, selectedWeight));
  };

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
              <>
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
                <div className="product-detail__size-tools">
                  <button
                    className="product-detail__text-link"
                    onClick={() => openSizeFinder("finder")}
                    type="button"
                  >
                    gợi ý size?
                  </button>
                  <button
                    className="product-detail__text-link product-detail__text-link--right"
                    onClick={() => openSizeFinder("chart")}
                    type="button"
                  >
                    bảng size
                  </button>
                </div>
              </>
            )}

            <button
              className="product-detail__add-button"
              disabled={!canAddToBag}
              onClick={addSelectedVariantToCart}
              type="button"
            >
              {buttonLabel}
            </button>

            <div className="product-detail__info">
              <div className="product-detail__info-tabs" role="tablist" aria-label="Thông tin sản phẩm">
                {infoTabs.map((tab) => (
                  <button
                    aria-selected={activeInfoTab === tab.key}
                    className={
                      activeInfoTab === tab.key
                        ? "product-detail__info-tab product-detail__info-tab--active"
                        : "product-detail__info-tab"
                    }
                    key={tab.key}
                    onClick={() => setActiveInfoTab(tab.key)}
                    role="tab"
                    type="button"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div
                className="product-detail__info-panel"
                dangerouslySetInnerHTML={{ __html: activeInfoTabData.html }}
              />
            </div>
          </div>
        </aside>
      </div>

      {isSizeFinderOpen && (
        <div
          aria-hidden="true"
          className="product-detail__modal-backdrop"
          onClick={() => setIsSizeFinderOpen(false)}
        >
          <div
            aria-label="Tìm size"
            aria-modal="true"
            className="product-detail__modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <button
              aria-label="Đóng gợi ý size"
              className="product-detail__modal-close"
              onClick={() => setIsSizeFinderOpen(false)}
              type="button"
            >
              ×
            </button>
            <div className="product-detail__modal-tabs">
              <button
                className={
                  sizeFinderView === "finder"
                    ? "product-detail__modal-tab product-detail__modal-tab--active"
                    : "product-detail__modal-tab"
                }
                onClick={() => setSizeFinderView("finder")}
                type="button"
              >
                tìm size
              </button>
              <button
                className={
                  sizeFinderView === "chart"
                    ? "product-detail__modal-tab product-detail__modal-tab--active"
                    : "product-detail__modal-tab"
                }
                onClick={() => setSizeFinderView("chart")}
                type="button"
              >
                bảng size
              </button>
            </div>

            {sizeFinderView === "finder" ? (
              <div className="product-detail__finder">
                <label className="product-detail__finder-field product-detail__finder-field--full">
                  <span>dáng sản phẩm mong muốn:</span>
                  <div className="product-detail__finder-fit-options" role="tablist" aria-label="Dáng sản phẩm mong muốn">
                    <button
                      aria-selected={desiredFit === "ôm"}
                      className={
                        desiredFit === "ôm"
                          ? "product-detail__finder-fit-option product-detail__finder-fit-option--active"
                          : "product-detail__finder-fit-option"
                      }
                      onClick={() => {
                        setDesiredFit("ôm");
                        setSelectedWeight("");
                        setRecommendedSize(null);
                      }}
                      role="tab"
                      type="button"
                    >
                      ôm
                    </button>
                    <button
                      aria-selected={desiredFit === "thoải mái"}
                      className={
                        desiredFit === "thoải mái"
                          ? "product-detail__finder-fit-option product-detail__finder-fit-option--active"
                          : "product-detail__finder-fit-option"
                      }
                      onClick={() => {
                        setDesiredFit("thoải mái");
                        setSelectedWeight("");
                        setRecommendedSize(null);
                      }}
                      role="tab"
                      type="button"
                    >
                      thoải mái
                    </button>
                  </div>
                </label>
                <label className="product-detail__finder-field product-detail__finder-field--full">
                  <span>chiều cao:</span>
                  <select
                    onChange={(event) => {
                      setSelectedHeight(event.target.value);
                      setRecommendedSize(null);
                    }}
                    value={selectedHeight}
                  >
                    <option value="">chọn chiều cao</option>
                    {SIZE_FINDER_HEIGHTS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="product-detail__finder-field product-detail__finder-field--full">
                  <span>cân nặng</span>
                  <select
                    onChange={(event) => {
                      setSelectedWeight(event.target.value);
                      setRecommendedSize(null);
                    }}
                    value={selectedWeight}
                  >
                    <option value="">chọn cân nặng</option>
                    {SIZE_FINDER_CHART[desiredFit].weightRanges.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="product-detail__finder-footer">
                  {recommendedSize && (
                    <div className="product-detail__finder-result">
                      <span>size gợi ý</span>
                      <strong>{recommendedSize}</strong>
                    </div>
                  )}
                  <div className="product-detail__finder-actions">
                    <button
                      className="product-detail__finder-submit"
                      disabled={!selectedHeight || !selectedWeight}
                      onClick={handleFindSize}
                      type="button"
                    >
                      tìm size
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="product-detail__size-chart">
                {(Object.keys(SIZE_FINDER_CHART) as SizeFinderFit[]).map((fit) => (
                  <div className="product-detail__size-chart-block" key={fit}>
                    <h3>{fit}</h3>
                    <div className="product-detail__size-chart-scroll">
                      <table>
                        <thead>
                          <tr>
                            <th>chiều cao \\ cân nặng</th>
                            {SIZE_FINDER_CHART[fit].weightRanges.map((weight) => (
                              <th key={weight}>{weight}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {SIZE_FINDER_HEIGHTS.map((height, rowIndex) => (
                            <tr key={height}>
                              <th>{height}</th>
                              {SIZE_FINDER_CHART[fit].matrix[rowIndex].map((size, colIndex) => (
                                <td key={`${height}-${colIndex}`}>{size}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
