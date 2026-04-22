'use client'

import React, { useEffect, useMemo, useState } from 'react'
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
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.handle || '')
  const navigationItems = useMemo(
    () =>
      sections.map((section) => ({
        handle: section.handle,
        label: locale === 'vi' && section.titleVi ? section.titleVi : section.title,
      })),
    [locale, sections],
  )

  useEffect(() => {
    if (!sections.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visibleEntries[0]?.target instanceof HTMLElement) {
          setActiveSection(visibleEntries[0].target.dataset.sectionHandle || visibleEntries[0].target.id.replace('shop-all-', ''))
        }
      },
      {
        rootMargin: '-120px 0px -55% 0px',
        threshold: [0.05, 0.2, 0.45],
      },
    )

    const sectionElements = sections
      .map((section) => document.getElementById(`shop-all-${section.handle}`))
      .filter(Boolean) as HTMLElement[]

    sectionElements.forEach((element) => observer.observe(element))

    return () => {
      sectionElements.forEach((element) => observer.unobserve(element))
      observer.disconnect()
    }
  }, [sections])

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
            <div className="px-8 lg:px-8 pb-4 pt-6">
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

      <nav aria-label="Shop all categories" className="shop-all-category-nav">
        <div className="shop-all-category-nav__inner section-x-padding">
          {navigationItems.map((item) => (
            <a
              className={`shop-all-category-nav__link${activeSection === item.handle ? ' shop-all-category-nav__link--active' : ''}`}
              href={`#shop-all-${item.handle}`}
              key={item.handle}
              onClick={() => setActiveSection(item.handle)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

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
                products={section.products}
                showSectionTitle={false}
              />
            </section>
          )
        })}
      </div>
    </>
  )
}
