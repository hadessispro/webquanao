"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/products";

interface ProductGridProps {
  products: Product[];
  sectionTitle?: string;
  sectionSubtitle?: string;
  barLabel?: string;
  barDescriptionHtml?: string;
  cardDesktopSpan?: 3 | 4 | 6 | 12;
  productLimit?: number;
  showSectionTitle?: boolean;
  stickyBar?: boolean;
}

export default function ProductGrid({
  barDescriptionHtml,
  barLabel,
  cardDesktopSpan,
  products,
  productLimit,
  sectionTitle,
  sectionSubtitle,
  showSectionTitle = true,
  stickyBar = false,
}: ProductGridProps) {
  const barRef = React.useRef<HTMLDivElement>(null);
  const [barStuck, setBarStuck] = React.useState(false);
  const visibleProducts =
    typeof productLimit === "number" && productLimit > 0
      ? products.slice(0, productLimit)
      : products;
  const desktopSpan =
    cardDesktopSpan ??
    (visibleProducts.length <= 1 ? 12 : visibleProducts.length === 2 ? 6 : visibleProducts.length === 3 ? 4 : 3);
  const barSectionClass = [
    "bg-primary-background text-primary-text overflow-hidden",
  ]
    .filter(Boolean)
    .join(" ");

  React.useEffect(() => {
    if (!stickyBar || !barLabel) {
      return;
    }

    let frame = 0;

    const update = () => {
      const bar = barRef.current;
      if (!bar) return;

      const headerHeight = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--header-stack-height"),
      ) || 88;
      const rect = bar.getBoundingClientRect();

      setBarStuck(rect.top <= headerHeight + 1 && rect.bottom > headerHeight);
    };

    const queueUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(update);
    };

    queueUpdate();
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
    };
  }, [barLabel, stickyBar]);

  return (
    <>
      {barLabel && (
        <div
          className={`c_text-columns-section product-grid__bar${stickyBar ? " product-grid__bar--sticky" : ""}${stickyBar && barStuck ? " product-grid__bar--stuck" : ""}`}
          ref={barRef}
        >
          <section className={barSectionClass}>
            <div className="px-8 lg:px-88 section-x-padding py-2">
              <div className="multi-column col-gap-lg lg:col-count-3 text-left text-base lg:text-base">
                <div className="product-grid__bar-content">
                  <h2 className="font-body text-base">{barLabel}</h2>
                  {barDescriptionHtml ? (
                    <div
                      className="rte text-sm product-grid__bar-copy"
                      dangerouslySetInnerHTML={{ __html: barDescriptionHtml }}
                    />
                  ) : (
                    <div className="rte text-sm product-grid__bar-copy" />
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Section Header */}
      {showSectionTitle && sectionTitle && (
        <div className="c_text-columns-section">
          <section className="bg-primary-background text-primary-text overflow-hidden border-t-grid border-b-grid border-grid-color">
            <div className="px-8 lg:px-88 section-x-padding py-2">
              <div className="multi-column col-gap-lg lg:col-count-3 text-left text-base lg:text-base">
                <h2 className="px-4 font-body text-base">{sectionTitle}</h2>
                <div className="rte px-4 text-sm" />
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
            <ul className="product-grid__items grid grid-cols-2 lg:grid-cols-12 gap-gutter">
              {visibleProducts.map((product) => (
                <ProductCard desktopSpan={desktopSpan} key={product.id} product={product} />
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
