'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLayout } from '@/context/LayoutContext'
import { FooterData, HeaderNavItem } from '@/lib/storefront-types'
import type { Locale } from '@/lib/i18n'
import { PRODUCT_MENU_GROUPS } from '@/lib/product-menu'
import { topNavLabel } from './Header'

interface MobileMenuDrawerProps {
  footer: FooterData
  navigation: HeaderNavItem[]
}

function localizedText(locale: Locale, text?: string, textVi?: string) {
  return locale === 'vi' && textVi ? textVi : text
}

const FALLBACK_MOBILE_PRODUCT_ITEMS = PRODUCT_MENU_GROUPS.flatMap((group) => {
  if (group.items && group.items.length > 0) {
    return group.items.map((item) => ({
      href: item.href,
      label: item.label,
    }))
  }

  return [
    {
      href: group.href,
      label: group.title === 'xem tất cả' ? `→ ${group.title}` : group.title,
    },
  ]
})

export default function MobileMenuDrawer({ navigation }: MobileMenuDrawerProps) {
  const { isMobileMenuOpen, locale, setIsMobileMenuOpen } = useLayout()
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(null)

  const closeMenu = () => {
    setOpenAccordionIndex(null)
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined

    document.documentElement.classList.add('art-menu-lock')
    document.body.classList.add('art-menu-lock')

    return () => {
      document.documentElement.classList.remove('art-menu-lock')
      document.body.classList.remove('art-menu-lock')
    }
  }, [isMobileMenuOpen])

  if (!isMobileMenuOpen) return null

  const navItems = (Array.isArray(navigation) ? navigation : []).filter(
    (item) => item.href !== '/pages/campaign' && !item.href.endsWith('/campaign'),
  )

  return (
    <nav aria-label="menu" className="art-menu">
      <button
        aria-label="close menu"
        className="art-menu__scrim"
        onClick={closeMenu}
        type="button"
      />
      <aside className="art-menu__panel">
        <div className="art-menu__scroll">
          <div className="art-menu__top">
            <button
              aria-label="close menu"
              className="art-menu__close"
              onClick={closeMenu}
              type="button"
            >
              <span />
            </button>
          </div>

          <div className="art-menu__primary">
            {navItems.length > 0 ? (
              navItems.map((item, index) => {
                const hasMegaMenu = Boolean(
                  item.megaMenu?.enabled &&
                    (item.megaMenu.columns.length > 0 ||
                      item.href === '/collections/shop-all' ||
                      item.href.includes('shop') ||
                      item.href.includes('product')),
                )
                const isOpen = openAccordionIndex === index
                const label = topNavLabel(item, locale) || 'sản phẩm'

                if (hasMegaMenu) {
                  const hasCustomColumns = Boolean(
                    item.megaMenu?.columns && item.megaMenu.columns.length > 0,
                  )

                  return (
                    <React.Fragment key={`${item.href}-${index}`}>
                      <button
                        aria-controls={`art-menu-accordion-${index}`}
                        aria-expanded={isOpen}
                        className="art-menu__product-toggle"
                        onClick={() => setOpenAccordionIndex(isOpen ? null : index)}
                        type="button"
                      >
                        <span>{label}</span>
                        <span aria-hidden="true" className="art-menu__chevron" />
                      </button>

                      {isOpen && (
                        <ul className="art-menu__accordion" id={`art-menu-accordion-${index}`}>
                          {hasCustomColumns
                            ? item.megaMenu!.columns.map((column, colIndex) => (
                                <React.Fragment key={`${column.heading}-${colIndex}`}>
                                  {column.heading && (
                                    <li className="art-menu__group-heading">
                                      {column.headingHref ? (
                                        <Link
                                          className="art-menu__primary-link font-bold"
                                          href={column.headingHref}
                                          onClick={closeMenu}
                                        >
                                          {localizedText(locale, column.heading, column.headingVi)}
                                        </Link>
                                      ) : (
                                        <span className="art-menu__primary-link font-bold">
                                          {localizedText(locale, column.heading, column.headingVi)}
                                        </span>
                                      )}
                                    </li>
                                  )}
                                  {column.links.map((link) => (
                                    <li key={`${link.label}-${link.href}`}>
                                      {link.href ? (
                                        <Link
                                          className="art-menu__primary-link"
                                          href={link.href}
                                          onClick={closeMenu}
                                        >
                                          {localizedText(locale, link.label, link.labelVi)}
                                        </Link>
                                      ) : (
                                        <span className="art-menu__primary-link art-menu__primary-link--disabled">
                                          {localizedText(locale, link.label, link.labelVi)}
                                        </span>
                                      )}
                                    </li>
                                  ))}
                                </React.Fragment>
                              ))
                            : FALLBACK_MOBILE_PRODUCT_ITEMS.map((fallbackItem) => (
                                <li key={fallbackItem.label}>
                                  {fallbackItem.href ? (
                                    <Link
                                      className="art-menu__primary-link"
                                      href={fallbackItem.href}
                                      onClick={closeMenu}
                                    >
                                      {fallbackItem.label}
                                    </Link>
                                  ) : (
                                    <span className="art-menu__primary-link art-menu__primary-link--disabled">
                                      {fallbackItem.label}
                                    </span>
                                  )}
                                </li>
                              ))}
                        </ul>
                      )}
                    </React.Fragment>
                  )
                }

                return (
                  <Link
                    className="art-menu__about-link"
                    href={item.href || '#'}
                    key={`${item.href}-${index}`}
                    onClick={closeMenu}
                    target={item.openInNewTab ? '_blank' : undefined}
                  >
                    {label}
                  </Link>
                )
              })
            ) : (
              <>
                <button
                  aria-controls="art-menu-products"
                  aria-expanded={openAccordionIndex === 0}
                  className="art-menu__product-toggle"
                  onClick={() => setOpenAccordionIndex(openAccordionIndex === 0 ? null : 0)}
                  type="button"
                >
                  <span>sản phẩm</span>
                  <span aria-hidden="true" className="art-menu__chevron" />
                </button>

                {openAccordionIndex === 0 && (
                  <ul className="art-menu__accordion" id="art-menu-products">
                    {FALLBACK_MOBILE_PRODUCT_ITEMS.map((item) => (
                      <li key={item.label}>
                        {item.href ? (
                          <Link className="art-menu__primary-link" href={item.href} onClick={closeMenu}>
                            {item.label}
                          </Link>
                        ) : (
                          <span className="art-menu__primary-link art-menu__primary-link--disabled">
                            {item.label}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}

                <Link className="art-menu__about-link" href="/pages/our-story" onClick={closeMenu}>
                  về điển
                </Link>
              </>
            )}
          </div>

          <p className="art-menu__slogan">điển, you already know</p>
        </div>
      </aside>
    </nav>
  )
}
