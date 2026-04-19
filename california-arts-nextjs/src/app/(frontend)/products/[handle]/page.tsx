import React from "react";
import { notFound } from "next/navigation";
import { getAllProducts, getProductByHandle } from "@/lib/products";
import ProductDetailClient from "@/components/product/ProductDetailClient";

// Generate static params for all products
export async function generateStaticParams() {
  const products = getAllProducts();
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
  const product = getProductByHandle(handle);
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
  const product = getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
