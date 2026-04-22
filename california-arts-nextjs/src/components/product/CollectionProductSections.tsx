import React from "react";
import ProductGrid from "./ProductGrid";
import { DEMO_COLLECTION_BAR_DESCRIPTION_HTML } from "@/lib/collection-bar-content";
import type { StorefrontCollection } from "@/lib/product-data";
import type { Product } from "@/lib/products";

function productSectionTitle(product: Product, index: number) {
  const number = String(index + 1).padStart(3, "0");
  const title = product.title.replace(/\s*\|\s*.*$/, "").trim();

  return `${number} ${title}`;
}

function IntroFeaturedSpacer() {
  return (
    <section className="featured-collection border-grid-color collection-product-page__intro-spacer">
      <div className="py-8">
        <div className="bg-primary-background section-x-padding px-88 py-8">
          <ul className="grid grid-cols-2 lg:grid-cols-12 gap-gutter" />
        </div>
      </div>
    </section>
  );
}

export default function CollectionProductSections({
  collection,
}: {
  collection: StorefrontCollection;
}) {
  return (
    <>
      <div className="collection-product-page__intro">
        <div className="c_text-columns-section">
          <section className="bg-primary-background text-primary-text overflow-hidden border-t-grid border-b-grid border-grid-color">
            <div className="px-8 lg:px-88 section-x-padding py-2">
              <div className="multi-column col-gap-lg lg:col-count-3 space-y-2 text-left text-base lg:text-base">
                <div className="rte px-4 text-sm">
                  <p>{collection.title}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {collection.descriptionHtml && (
          <section className="bg-primary-background text-primary-text overflow-hidden border-t-grid border-transparent">
            <div className="px-8 lg:px-8 pb-4">
              <div className="flex text-sm default text-left">
                <div className="w-full">
                  <div className="rte font-body break-words px-4">
                    <div dangerouslySetInnerHTML={{ __html: collection.descriptionHtml }} />
                  </div>
                </div>
              </div>
            </div>
            </section>
        )}

        <IntroFeaturedSpacer />
      </div>

      <div className="collection-product-page__sections">
        {collection.products.map((product, index) => (
          <section className="collection-product-section" id={`product-${product.handle}`} key={product.handle}>
            <ProductGrid
              barDescriptionHtml={DEMO_COLLECTION_BAR_DESCRIPTION_HTML}
              barLabel={productSectionTitle(product, index)}
              cardDesktopSpan={3}
              products={[product]}
              showSectionTitle={false}
              stickyBar
            />
          </section>
        ))}
      </div>
    </>
  );
}
