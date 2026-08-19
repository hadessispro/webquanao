'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLayout } from '@/context/LayoutContext'
import { FooterData, HeaderNavItem } from '@/lib/storefront-types'
import type { Locale } from '@/lib/i18n'
import { PRODUCT_MENU_GROUPS } from '@/lib/product-menu'

interface MobileMenuDrawerProps {
  footer: FooterData
  navigation: HeaderNavItem[]
}

function localizedText(locale: Locale, text?: string, textVi?: string) {
  return locale === 'vi' && textVi ? textVi : text
}

const FALLBACK_PRODUCT_ITEMS = PRODUCT_MENU_GROUPS.flatMap((group) => {
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
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({})

  const closeMenu = () => {
    setOpenAccordions({})
    setIsMobileMenuOpen(false)
  }

  const toggleAccordion = (href: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [href]: !prev[href],
    }))
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

  const itemsToRender = navigation && navigation.length > 0 ? navigation : [
    { label: 'sản phẩm', href: '/collections/shop-all', megaMenu: { enabled: true, columns: [] } },
    { label: 'về điển', href: '/pages/our-story' },
  ]

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
            {itemsToRender.map((item) => {
              const label = localizedText(locale, item.label, item.labelVi) || item.label
              const hasMegaMenu = Boolean(
                item.megaMenu?.enabled &&
                  (item.href === '/collections/shop-all' ||
                    (item.megaMenu?.columns && item.megaMenu.columns.length > 0)),
              )

              // Build sub-items for accordion: use custom Admin columns if set, else fallback for shop-all
              const customLinks = item.megaMenu?.columns?.flatMap((col) =>
                col.links.map((link) => ({
                  href: link.href,
                  label: localizedText(locale, link.label, link.labelVi) || link.label,
                })),
              )

              const accordionLinks =
                customLinks && customLinks.length > 0
                  ? customLinks
                  : item.href === '/collections/shop-all'
                    ? FALLBACK_PRODUCT_ITEMS
                    : []

              const isOpen = Boolean(openAccordions[item.href])

              if (hasMegaMenu && accordionLinks.length > 0) {
                return (
                  <div key={`${item.label}-${item.href}`} className="art-menu__group">
                    <button
                      aria-controls={`art-menu-${item.href}`}
                      aria-expanded={isOpen}
                      className="art-menu__product-toggle"
                      onClick={() => toggleAccordion(item.href)}
                      type="button"
                    >
                      <span>{label}</span>
                      <span aria-hidden="true" className={`art-menu__chevron ${isOpen ? 'transform rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                      <ul className="art-menu__accordion" id={`art-menu-${item.href}`}>
                        {accordionLinks.map((link, idx) => (
                          <li key={`${link.label}-${idx}`}>
                            {link.href ? (
                              <Link className="art-menu__primary-link" href={link.href} onClick={closeMenu}>
                                {link.label}
                              </Link>
                            ) : (
                              <span className="art-menu__primary-link art-menu__primary-link--disabled">
                                {link.label}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={`${item.label}-${item.href}`}
                  className="art-menu__about-link block py-2 text-base"
                  href={item.href}
                  onClick={closeMenu}
                >
                  {label}
                </Link>
              )
            })}
          </div>

          <p className="art-menu__slogan">điển, you already know</p>
        </div>
      </aside>
    </nav>
  )
}
