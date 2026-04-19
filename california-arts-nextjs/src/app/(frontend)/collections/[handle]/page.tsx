import React from "react";
import { getAllProducts } from "@/lib/products";
import ProductGrid from "@/components/product/ProductGrid";

export const metadata = {
  title: "Shop All | California Arts",
  description:
    "Shop all California Arts products. Intentional proportions with superior craftsmanship.",
};

export default function CollectionPage() {
  const allProducts = getAllProducts();

  return (
    <ProductGrid
      products={allProducts}
      sectionTitle="View All"
      sectionSubtitle={`<p><br/><br/><br/><br/></p><p><br/><br/><br/>Our Product Philosophy:<br/><em>"Less and More."</em></p><p>We re-imagine one garment at a time, combining<br/>intentional proportions with superior craftsmanship.<br/>We advocate for sustainability by producing less,<br/>building better &amp; simplifying the way we get dressed.</p>`}
    />
  );
}
