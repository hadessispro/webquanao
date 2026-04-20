import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAllStorefrontProducts, getStorefrontProductByHandle } from "@/lib/product-data";
import type { Product } from "@/lib/products";
import ProductDetailClient from "@/components/product/ProductDetailClient";

function getRecommendedProducts(product: Product, allProducts: Product[]) {
  return allProducts
    .filter((item) => item.handle !== product.handle)
    .map((item) => {
      const sameType = item.product_type && item.product_type === product.product_type ? 4 : 0;
      const sameCollection = item.collections?.some((collection) =>
        product.collections?.includes(collection),
      )
        ? 3
        : 0;
      const sharedTags = item.tags.filter((tag) => product.tags.includes(tag)).length;

      return {
        item,
        score: sameType + sameCollection + sharedTags,
      };
    })
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .map(({ item }) => item);
}

function toProductPreview(product: Product) {
  return {
    handle: product.handle,
    title: product.title,
    images: product.images.slice(0, 1),
    variants: product.variants.slice(0, 1),
  };
}

// Generate static params for all products
export async function generateStaticParams() {
  const products = await getAllStorefrontProducts();
  return products.map((product) => ({
    handle: product.handle,
  }));
}

// Generate metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getStorefrontProductByHandle(handle);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.title} | California Arts`,
    description: product.body_html?.replace(/<[^>]*>/g, "")?.slice(0, 160),
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const [product, allProducts] = await Promise.all([
    getStorefrontProductByHandle(handle),
    getAllStorefrontProducts(),
  ]);

  if (!product) {
    notFound();
  }

  const recommendedProducts = getRecommendedProducts(product, allProducts);
  const recommendedPreviews = recommendedProducts.map(toProductPreview);

  return (
    <Suspense fallback={null}>
      <ProductDetailClient
        allProducts={allProducts.map(toProductPreview)}
        product={product}
        styleWithProducts={recommendedPreviews.slice(0, 3)}
        suggestedProducts={recommendedPreviews.slice(0, 4)}
      />
    </Suspense>
  );
}
