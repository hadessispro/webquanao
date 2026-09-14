'use client'

import React from 'react'
import Link from 'next/link'
import ProductGrid from './ProductGrid'
import { useLayout } from '@/context/LayoutContext'
import {
  DEFAULT_COLLECTION_INTRO_HTML,
  DEMO_COLLECTION_BAR_DESCRIPTION_HTML,
} from '@/lib/collection-bar-content'
import type { StorefrontCollection } from '@/lib/product-data'
import { type Product, expandProductByColors } from '@/lib/products'

const COLLECTION_TITLE_VI: Record<string, string> = {
  'coats-jackets': 'áo khoác',
  'category-tailoring': 'may đo',
  'knitwear': 'đồ dệt kim',
  'collection-sweater': 'áo nỉ & quần nỉ',
  'shirts-all-navigation': 'áo sơ mi',
  'category-polos': 'áo polo',
  'collection-t-shirts-tanks': 'áo thun & henley',
  'category-vests': 'áo tank & vest',
  'trousers-shorts': 'quần dài & short',
  'category-nav-denim': 'đồ denim',
  'accessories': 'phụ kiện',
}

function productSectionTitle(product: Product, index: number) {
  const number = String(index + 1).padStart(2, '0')
  const title = product.title.replace(/\s*\|\s*.*$/, '').trim()

  return `${number} ${title}`
}

function IntroFeaturedSpacer() {
  return <div aria-hidden="true" className="collection-product-page__intro-spacer" />
}

function getLocalizedCollectionTitle(collection: StorefrontCollection, locale: string) {
  if (locale === 'vi') {
    return COLLECTION_TITLE_VI[collection.handle] || collection.title
  }
  return collection.title
}

export default function CollectionProductSections({
  collection,
}: {
  collection: StorefrontCollection
}) {
  const { locale } = useLayout()
  const introHtml = collection.descriptionHtml?.trim() || DEFAULT_COLLECTION_INTRO_HTML

  const cta = collection.bottomCta
  const hideCta = Boolean(cta?.hideCta)

  const eyebrow =
    (locale === 'vi' && cta?.eyebrowVi ? cta.eyebrowVi : cta?.eyebrow) ||
    (locale === 'vi' ? 'xem toàn bộ sản phẩm' : 'explore our full catalog')

  const buttonLabel =
    (locale === 'vi' && cta?.buttonLabelVi ? cta.buttonLabelVi : cta?.buttonLabel) ||
    (locale === 'vi' ? 'khám phá ngay' : 'shop all')

  const href = cta?.href || '/collections/shop-all'

  return (
    <>
      <div className="collection-product-page__intro">
        <div className="c_text-columns-section collection-page-intro__bar">
          <section className="bg-primary-background text-primary-text overflow-hidden">
            <div className="section-x-padding collection-page-intro__inner">
              <div className="collection-page-intro__copy">
                <h1>{getLocalizedCollectionTitle(collection, locale)}</h1>
                <div
                  className="rte collection-page-intro__description"
                  dangerouslySetInnerHTML={{ __html: introHtml }}
                />
              </div>
            </div>
          </section>
        </div>

        <IntroFeaturedSpacer />
      </div>

      <div className="collection-product-page__sections">
        {collection.products.map((product, index) => (
          <section className="collection-product-section" id={`product-${product.handle}`} key={product.handle}>
            <ProductGrid
              barDescriptionHtml={product.subtitle || DEMO_COLLECTION_BAR_DESCRIPTION_HTML}
              barLabel={productSectionTitle(product, index)}
              cardDesktopSpan={3}
              products={expandProductByColors(product)}
              showSectionTitle={false}
              stickyBar
            />
          </section>
        ))}
      </div>

      {!hideCta && (
        <section className="collection-product-page__next-cta">
          <div className="collection-product-page__next-cta-inner">
            <p>{eyebrow}</p>
            <Link className="collection-product-page__next-cta-button" href={href}>
              {buttonLabel}
            </Link>
          </div>
        </section>
      )}
    </>
  )
}

