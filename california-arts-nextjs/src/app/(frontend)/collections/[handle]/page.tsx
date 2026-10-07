import React from "react";
import { notFound } from "next/navigation";
import { getStorefrontCollectionByHandle } from "@/lib/product-data";
import CollectionProductSections from "@/components/product/CollectionProductSections";
import ShopAllCollectionSections from "@/components/product/ShopAllCollectionSections";
import { getStorefrontShopAllSections } from "@/lib/shop-all-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = await getStorefrontCollectionByHandle(handle);

  if (!collection) {
    return { title: "Collection Not Found" };
  }

  return {
    title: collection.seoTitle || `${collection.title} | điển`,
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

  if (!collection) {
    notFound();
  }

  if (handle === "shop-all") {
    const sections = await getStorefrontShopAllSections();

    return <ShopAllCollectionSections collection={collection} sections={sections} />;
  }

  return <CollectionProductSections collection={collection} />;
}
