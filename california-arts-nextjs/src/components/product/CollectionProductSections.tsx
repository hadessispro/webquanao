import React from "react";
import Link from "next/link";
import ProductGrid from "./ProductGrid";
import {
  DEFAULT_COLLECTION_INTRO_HTML,
  DEMO_COLLECTION_BAR_DESCRIPTION_HTML,
} from "@/lib/collection-bar-content";
import type { StorefrontCollection } from "@/lib/product-data";
import type { Product } from "@/lib/products";

const COLLECTION_SEQUENCE = [
  { handle: "coats-jackets", title: "áo khoác" },
  { handle: "category-tailoring", title: "may đo" },
  { handle: "knitwear", title: "đồ dệt kim" },
  { handle: "collection-sweater", title: "áo nỉ & quần nỉ" },
  { handle: "shirts-all-navigation", title: "áo sơ mi" },
  { handle: "category-polos", title: "áo polo" },
  { handle: "collection-t-shirts-tanks", title: "áo thun & henley" },
  { handle: "category-vests", title: "áo tank & vest" },
  { handle: "trousers-shorts", title: "quần dài & short" },
  { handle: "category-nav-denim", title: "đồ denim" },
  { handle: "accessories", title: "phụ kiện" },
] as const;

const COLLECTION_TITLE_VI: Record<string, string> = Object.fromEntries(
  COLLECTION_SEQUENCE.map((item) => [item.handle, item.title]),
);

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

function getLocalizedCollectionTitle(collection: StorefrontCollection) {
  return COLLECTION_TITLE_VI[collection.handle] || collection.title;
}

function getNextCollectionCta(handle: string) {
  const currentIndex = COLLECTION_SEQUENCE.findIndex((item) => item.handle === handle);

  if (currentIndex === -1) {
    return {
      eyebrow: "xem toàn bộ sản phẩm",
      buttonLabel: "khám phá ngay",
      href: "/collections/shop-all",
    };
  }

  const nextItem = COLLECTION_SEQUENCE[currentIndex + 1];

  if (!nextItem) {
    return {
      eyebrow: "xem toàn bộ sản phẩm",
      buttonLabel: "khám phá ngay",
      href: "/collections/shop-all",
    };
  }

  return {
    eyebrow: `xem thêm về ${nextItem.title}`,
    buttonLabel: "khám phá ngay",
    href: `/collections/${nextItem.handle}`,
  };
}

export default function CollectionProductSections({
  collection,
}: {
  collection: StorefrontCollection;
}) {
  const introHtml = collection.descriptionHtml?.trim() || DEFAULT_COLLECTION_INTRO_HTML;
  const nextCollectionCta = getNextCollectionCta(collection.handle);

  return (
    <>
      <div className="collection-product-page__intro">
        <div className="c_text-columns-section">
          <section className="bg-primary-background text-primary-text overflow-hidden border-b-grid border-grid-color">
            <div className="px-8 lg:px-88 section-x-padding py-2">
              <div className="multi-column col-gap-lg lg:col-count-3 space-y-2 text-left text-base lg:text-base">
                <div className="rte px-4 text-sm">
                  <p>{getLocalizedCollectionTitle(collection)}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="bg-primary-background text-primary-text overflow-hidden border-t-grid border-transparent">
          <div className="px-8 lg:px-8 pb-4">
            <div className="flex text-sm default text-left">
              <div className="w-full">
                <div className="rte font-body break-words px-4">
                  <div dangerouslySetInnerHTML={{ __html: introHtml }} />
                </div>
              </div>
            </div>
          </div>
        </section>

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

      <section className="collection-product-page__next-cta">
        <div className="collection-product-page__next-cta-inner">
          <p>{nextCollectionCta.eyebrow}</p>
          <Link className="collection-product-page__next-cta-button" href={nextCollectionCta.href}>
            {nextCollectionCta.buttonLabel}
          </Link>
        </div>
      </section>
    </>
  );
}
