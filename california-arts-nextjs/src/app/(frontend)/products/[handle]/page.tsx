import React from "react";
import { notFound } from "next/navigation";
import { getAllStorefrontProducts, getStorefrontProductByHandle } from "@/lib/product-data";
import ProductDetailClient from "@/components/product/ProductDetailClient";

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
    title: `${product.title} | điển`,
    description: product.body_html?.replace(/<[^>]*>/g, "")?.slice(0, 160),
  };
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { handle } = await params;
  const resolvedSearchParams = await searchParams;
  const variantParam = resolvedSearchParams.variant;
  const colorParam = resolvedSearchParams.color;
  const product = await getStorefrontProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const initialVariantId = Array.isArray(variantParam)
    ? Number.parseInt(variantParam[0] || "0", 10)
    : Number.parseInt(variantParam || "0", 10);
  const initialColorParam = Array.isArray(colorParam) ? colorParam[0] : colorParam;

  return (
    <ProductDetailClient
      initialColorParam={initialColorParam}
      initialVariantId={Number.isFinite(initialVariantId) ? initialVariantId : 0}
      product={product}
    />
  );
}
