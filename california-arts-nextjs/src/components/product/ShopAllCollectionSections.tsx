'use client'

import React from 'react'
import ProductGrid from './ProductGrid'
import { useLayout } from '@/context/LayoutContext'
import type { StorefrontCollection } from '@/lib/product-data'
import type { StorefrontShopAllSection } from '@/lib/shop-all-data'

export default function ShopAllCollectionSections({
  collection,
  sections,
}: {
  collection: StorefrontCollection
  sections: StorefrontShopAllSection[]
}) {
  const { locale } = useLayout()
  const introLabel = locale === 'vi' ? 'Xem Tất Cả' : 'View All'

  return (
    <>
      <div className="shop-all-page__intro">
        <div className="c_text-columns-section">
          <section className="bg-primary-background text-primary-text overflow-hidden border-t-grid border-b-grid border-grid-color">
            <div className="px-8 lg:px-88 section-x-padding py-2">
              <div className="multi-column col-gap-lg lg:col-count-3 space-y-2 text-left text-base lg:text-base">
                <div className="rte px-4 text-sm">
                  <p>{introLabel}</p>
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
      </div>

      <div className="shop-all-page__sections">
        {sections.map((section) => {
          const label = locale === 'vi' && section.titleVi ? section.titleVi : section.title
          return (
            <section
              className="shop-all-collection"
              data-section-handle={section.handle}
              id={`shop-all-${section.handle}`}
              key={section.handle}
            >
              <ProductGrid
                barLabel={label}
                cardDesktopSpan={3}
                products={section.products}
                showSectionTitle={false}
                stickyBar
              />
            </section>
          )
        })}
      </div>
    </>
  )
}
