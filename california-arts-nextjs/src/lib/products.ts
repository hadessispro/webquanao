import productsData from "../../json/products-json.json";
import { formatVndAmount } from "./price";

export interface ProductImage {
  id: number;
  src: string;
  sourceUrl?: string;
  width: number;
  height: number;
  position: number;
  alt?: string;
  variant_ids: number[];
}

export interface ProductVideo {
  id: number | string;
  src: string;
  poster?: string;
  alt?: string;
  color?: string;
  position: number;
  placement?: "inherit" | "after-images" | "manual";
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export interface ProductVariant {
  id: number;
  title: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  sku: string;
  price: string;
  compare_at_price: string | null;
  available: boolean;
  featured_image: {
    id: number;
    src: string;
    alt: string | null;
    width: number;
    height: number;
    position?: number;
  } | null;
}

export interface ProductOption {
  name: string;
  position: number;
  values: string[];
}

export interface ProductColorOption {
  label: string;
  value: string;
  swatch?: string;
  swatchImage?: string;
  position?: number;
  available?: boolean;
}

export interface ProductSizeOption {
  label: string;
  value: string;
  position?: number;
  available?: boolean;
}

export interface ProductAccordion {
  title: string;
  html: string;
}

export interface Product {
  id: number;
  title: string;
  subtitle?: string;
  href?: string;
  handle: string;
  body_html: string;
  vendor: string;
  product_type: string;
  material?: string;
  tags: string[];
  variants: ProductVariant[];
  images: ProductImage[];
  videos?: ProductVideo[];
  mediaLayout?: {
    videoPlacement?: "after-images" | "manual";
  };
  options: ProductOption[];
  sizeSelectorStyle?: "auto" | "text" | "box";
  colorOptions?: ProductColorOption[];
  sizeOptions?: ProductSizeOption[];
  accordions?: ProductAccordion[];
  infoTabs?: {
    details?: string;
    shipping?: string;
    exchange?: string;
  };
  relatedProductHandles?: string[];
  sizeChartImage?: string;
  seo?: {
    title?: string;
    description?: string;
  };
  collections?: string[];
  published_at: string;
  created_at: string;
  updated_at: string;
}

export function normalizeImageUrl(src: string): string {
  if (!src) return "";
  return src.startsWith("//") ? `https:${src}` : src;
}

export function getAllProductsFromJson(): Product[] {
  const raw = (productsData as { products: Product[] }).products;
  return raw.map((p) => ({
    ...p,
    images: p.images.map((img) => ({
      ...img,
      sourceUrl: img.src,
      src: normalizeImageUrl(img.src),
    })),
    variants: p.variants.map((v) => ({
      ...v,
      featured_image: v.featured_image
        ? {
            ...v.featured_image,
            src: normalizeImageUrl(v.featured_image.src),
          }
        : null,
    })),
  }));
}

// Synchronous JSON fallback used before Payload has been seeded.
export function getAllProducts(): Product[] {
  return getAllProductsFromJson();
}

export function getProductByHandle(handle: string): Product | undefined {
  return getAllProductsFromJson().find((p) => p.handle === handle);
}

// All color values that actually exist on the product (from the legacy Color
// option, or failing that from distinct variant option1 values).
function getBaseColorValues(product: Product): string[] {
  const colorOption = product.options.find(
    (o) => o.name.toLowerCase() === "color",
  );
  if (colorOption?.values?.length) return colorOption.values.filter(Boolean);

  const seen = new Set<string>();
  const values: string[] = [];
  for (const variant of product.variants) {
    const value = variant.option1 || "";
    const key = value.toLowerCase();
    if (value && !seen.has(key)) {
      seen.add(key);
      values.push(value);
    }
  }
  return values;
}

// Get unique color options.
//
// colorOptions in the CMS are meant to *configure* colours (label, swatch image,
// ordering, visibility) — not to be the exhaustive list. Previously, adding a
// single colorOption replaced the entire colour list, so uploading one swatch
// hid every other colour. We now merge: show configured-and-available colours
// first (in their set order) and append any remaining product colours that were
// not explicitly hidden (available === false).
export function getProductColors(product: Product): string[] {
  const baseColors = getBaseColorValues(product);

  if (product.colorOptions?.length) {
    const normalize = (value: string) => value.trim().toLowerCase();

    const configured = product.colorOptions
      .filter((option) => option.available !== false)
      .slice()
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((option) => option.value || option.label)
      .filter(Boolean) as string[];

    const hidden = new Set(
      product.colorOptions
        .filter((option) => option.available === false)
        .map((option) => normalize(option.value || option.label || ""))
        .filter(Boolean),
    );

    const configuredSet = new Set(configured.map(normalize));
    const merged = [...configured];

    for (const color of baseColors) {
      const key = normalize(color);
      if (!configuredSet.has(key) && !hidden.has(key)) {
        merged.push(color);
      }
    }

    return merged.filter(Boolean);
  }

  return baseColors;
}

// Get unique size options
export function getProductSizes(product: Product): string[] {
  if (product.sizeOptions?.length) {
    return product.sizeOptions
      .filter((option) => option.available !== false)
      .slice()
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((option) => option.value || option.label)
      .filter(Boolean);
  }

  const sizeOption = product.options.find(
    (o) => o.name.toLowerCase() === "size",
  );
  return sizeOption?.values || [];
}

// Format price in VND
export function getDisplayPrice(product: Product): string {
  const price = parseInt(product.variants[0]?.price || "0", 10);
  return formatVndAmount(price);
}

// Get compare_at_price only when it represents a real discount (i.e. the
// compare-at/original price is higher than the current price). This is the old
// price that should be shown struck through next to the current price.
export function getCompareAtPrice(product: Product): string | null {
  const compareRaw = product.variants[0]?.compare_at_price;
  if (!compareRaw) return null;
  const compare = parseInt(compareRaw, 10);
  const price = parseInt(product.variants[0]?.price || "0", 10);
  if (!compare || compare <= price) return null;
  return formatVndAmount(compare);
}

// Check if product is fully sold out
export function isProductSoldOut(product: Product): boolean {
  return product.variants.every((v) => !v.available);
}

// Get main image URL (already local)
export function getMainImageUrl(product: Product): string {
  return (
    product.images[0]?.src ||
    product.variants.find((variant) => variant.featured_image?.src)?.featured_image?.src ||
    ""
  );
}

// Get hover image URL (second image)
export function getHoverImageUrl(product: Product): string | null {
  if (product.images.length >= 2) return product.images[1]?.src || null;

  const variantImage = product.variants
    .map((variant) => variant.featured_image?.src)
    .find((src) => src && src !== getMainImageUrl(product));

  return variantImage || null;
}

// Get image aspect ratio
export function getImageAspectRatio(product: Product): number {
  const img =
    product.images[0] ||
    product.variants.find((variant) => variant.featured_image?.src)?.featured_image;
  if (!img || !img.width || !img.height) return 149.83;
  return (img.height / img.width) * 100;
}

// Get variants for a specific color
export function getVariantsByColor(
  product: Product,
  color: string,
): ProductVariant[] {
  return product.variants.filter((v) => v.option1 === color);
}

export function buildProductColorImages(product: Product): Record<string, ProductImage[]> {
  const allImgs = product.images.slice().sort((a, b) => a.position - b.position);
  const colors = getProductColors(product);

  if (colors.length <= 1) return { [colors[0] || "default"]: allImgs };

  const leadPos: Record<string, number> = {};
  for (const v of product.variants) {
    const color = v.option1 || "";
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
      .filter((v) => (v.option1 || "").toLowerCase() === color.toLowerCase())
      .map((v) => v.id);
    const leadImg = allImgs.find((img) =>
      img.variant_ids && img.variant_ids.some((vid) => colorVarIds.includes(vid))
    );
    if (leadImg) leadPos[color] = leadImg.position;
  }

  const sorted = [...colors].sort(
    (a, b) => (leadPos[a] ?? 999) - (leadPos[b] ?? 999),
  );

  const groups: Record<string, ProductImage[]> = {};
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

export function expandProductByColors(product: Product): Product[] {
  const colors = getProductColors(product);
  if (colors.length <= 1) {
    return [product];
  }

  const colorImages = buildProductColorImages(product);

  return colors.map((color, index) => {
    const colorLower = color.toLowerCase();
    const matchingVariants = product.variants.filter((v) => {
      const vColor = (v.option1 || "").toLowerCase();
      const vTitle = (v.title || "").toLowerCase();
      return vColor === colorLower || vTitle.startsWith(colorLower);
    });

    const specificImages = colorImages[color] || [];
    const imagesToUse = specificImages.length > 0 ? specificImages : product.images;

    return {
      ...product,
      id: Number(`${product.id}${index + 1}`),
      href: `/products/${product.handle}?color=${encodeURIComponent(colorLower)}`,
      variants: matchingVariants.length > 0 ? matchingVariants : product.variants,
      images: imagesToUse,
    };
  });
}

