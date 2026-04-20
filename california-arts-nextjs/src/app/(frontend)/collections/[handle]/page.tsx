import React from "react";
import { getStorefrontCollectionByHandle } from "@/lib/product-data";
import ProductGrid from "@/components/product/ProductGrid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = await getStorefrontCollectionByHandle(handle);

  return {
    title: collection.seoTitle || `${collection.title} | california arts`,
    description: collection.seoDescription,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = await getStorefrontCollectionByHandle(handle);

  return (
    <ProductGrid
      products={collection.products}
      sectionTitle={collection.title}
      sectionSubtitle={collection.descriptionHtml}
    />
  );
}
