"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/products";

interface ProductGridProps {
  products: Product[];
  sectionTitle?: string;
  sectionSubtitle?: string;
}

export default function ProductGrid({
  products,
  sectionTitle,
  sectionSubtitle,
}: ProductGridProps) {
  return (
    <>
      {/* Section Header */}
      {sectionTitle && (
        <div className="c_text-columns-section">
          <section className="bg-primary-background text-primary-text overflow-hidden border-t-grid border-b-grid border-grid-color">
            <div className="px-8 lg:px-88 section-x-padding py-2">
              <div className="multi-column col-gap-lg lg:col-count-3 space-y-2 text-left text-base lg:text-base">
                <div className="rte px-4 text-sm">
                  <p>{sectionTitle}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Description text section (optional) */}
      {sectionSubtitle && (
        <section className="bg-primary-background text-primary-text overflow-hidden border-t-grid border-transparent">
          <div className="px-8 lg:px-8 pb-4">
            <div className="flex text-sm default text-left">
              <div className="w-full">
                <div className="rte font-body break-words px-4">
                  <div dangerouslySetInnerHTML={{ __html: sectionSubtitle }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Product Grid */}
      <section className="featured-collection border-grid-color">
        <div className="py-8">
          <div className="bg-primary-background section-x-padding px-88 py-8">
            <ul className="grid grid-cols-2 lg:grid-cols-12 gap-gutter">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
