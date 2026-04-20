import productsData from "../../json/products-json.json";

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

// Get unique color options
export function getProductColors(product: Product): string[] {
  if (product.colorOptions?.length) {
    return product.colorOptions
      .filter((option) => option.available !== false)
      .slice()
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((option) => option.value || option.label)
      .filter(Boolean);
  }

  const colorOption = product.options.find(
    (o) => o.name.toLowerCase() === "color",
  );
  return colorOption?.values || [];
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
  return new Intl.NumberFormat("vi-VN").format(price) + "₫";
}

// Get compare_at_price if exists
export function getCompareAtPrice(product: Product): string | null {
  const comparePrice = product.variants[0]?.compare_at_price;
  if (!comparePrice) return null;
  return (
    new Intl.NumberFormat("vi-VN").format(parseInt(comparePrice, 10)) + "₫"
  );
}

// Check if product is fully sold out
export function isProductSoldOut(product: Product): boolean {
  return product.variants.every((v) => !v.available);
}

// Get main image URL (already local)
export function getMainImageUrl(product: Product): string {
  return product.images[0]?.src || "";
}

// Get hover image URL (second image)
export function getHoverImageUrl(product: Product): string | null {
  if (product.images.length < 2) return null;
  return product.images[1]?.src || null;
}

// Get image aspect ratio
export function getImageAspectRatio(product: Product): number {
  const img = product.images[0];
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
