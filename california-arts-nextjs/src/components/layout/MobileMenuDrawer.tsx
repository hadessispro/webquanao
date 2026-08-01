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

const MOBILE_PRODUCT_ITEMS = PRODUCT_MENU_GROUPS.flatMap((group) => {
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
  const [productsOpen, setProductsOpen] = useState(false)
  const aboutLink = navigation.find((item) => item.href === '/pages/our-story')

  const closeMenu = () => {
    setProductsOpen(false)
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
            <button
              aria-controls="art-menu-products"
              aria-expanded={productsOpen}
              className="art-menu__product-toggle"
              onClick={() => setProductsOpen((current) => !current)}
              type="button"
            >
              <span>sản phẩm</span>
              <span aria-hidden="true" className="art-menu__chevron" />
            </button>

            {productsOpen && (
              <ul className="art-menu__accordion" id="art-menu-products">
                {MOBILE_PRODUCT_ITEMS.map((item) => (
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

            <Link className="art-menu__about-link" href={aboutLink?.href || '/pages/our-story'} onClick={closeMenu}>
              {localizedText(locale, aboutLink?.label, aboutLink?.labelVi) || 'về điển'}
            </Link>
          </div>

          <p className="art-menu__slogan">điển, you already know</p>
        </div>
      </aside>
    </nav>
  )
}
