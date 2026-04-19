import productsData from "../../json/products-json.json";

export interface ProductImage {
  id: number;
  src: string;
  width: number;
  height: number;
  position: number;
  alt?: string;
  variant_ids: number[];
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

export interface Product {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  vendor: string;
  product_type: string;
  tags: string[];
  variants: ProductVariant[];
  images: ProductImage[];
  options: ProductOption[];
  published_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Convert a Shopify CDN URL to a local path under /products/[handle]/
 * e.g. "https://cdn.shopify.com/.../CA-MARCH-26-C19759.jpg?v=123"
 *   → "/products/coldwaterjeans/CA-MARCH-26-C19759.jpg"
 */
function toLocalImagePath(src: string, handle: string): string {
  if (!src) return "";
  // Remove protocol
  let url = src.startsWith("//") ? `https:${src}` : src;
  try {
    const u = new URL(url);
    const segments = u.pathname.split("/");
    const filename = segments[segments.length - 1];
    return `/products/${handle}/${filename}`;
  } catch {
    // fallback: just extract last part
    const parts = url.split("/");
    let filename = parts[parts.length - 1];
    if (filename.includes("?")) filename = filename.split("?")[0];
    return `/products/${handle}/${filename}`;
  }
}

// Get all products with local image paths
export function getAllProducts(): Product[] {
  const raw = (productsData as { products: Product[] }).products;
  return raw.map((p) => ({
    ...p,
    images: p.images.map((img) => ({
      ...img,
      src: toLocalImagePath(img.src, p.handle),
    })),
    variants: p.variants.map((v) => ({
      ...v,
      featured_image: v.featured_image
        ? {
            ...v.featured_image,
            src: toLocalImagePath(v.featured_image.src, p.handle),
          }
        : null,
    })),
  }));
}

// Get a single product by handle
export function getProductByHandle(handle: string): Product | undefined {
  return getAllProducts().find((p) => p.handle === handle);
}

// Get unique color options
export function getProductColors(product: Product): string[] {
  const colorOption = product.options.find(
    (o) => o.name.toLowerCase() === "color",
  );
  return colorOption?.values || [];
}

// Get unique size options
export function getProductSizes(product: Product): string[] {
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
