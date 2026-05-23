'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useLayout } from '@/context/LayoutContext'
import { FooterData, HeaderNavItem } from '@/lib/storefront-types'
import type { Locale } from '@/lib/i18n'
import { BRAND_INSTAGRAM_PROFILE_URL } from '@/lib/brand'
import { PRODUCT_MENU_GROUPS } from '@/lib/product-menu'

interface MobileMenuDrawerProps {
  footer: FooterData
  navigation: HeaderNavItem[]
}

function localizedText(locale: Locale, text?: string, textVi?: string) {
  return locale === 'vi' && textVi ? textVi : text
}

export default function MobileMenuDrawer({ footer, navigation }: MobileMenuDrawerProps) {
  const { isMobileMenuOpen, locale, setIsMobileMenuOpen } = useLayout()
  const aboutLink = navigation.find((item) => item.href === '/pages/our-story')
  const newsletterPlaceholder =
    localizedText(locale, footer.newsletter.placeholder, footer.newsletter.placeholderVi) || 'đăng ký newsletter'

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
        onClick={() => setIsMobileMenuOpen(false)}
        type="button"
      />
      <aside className="art-menu__panel">
        <div className="art-menu__scroll">
          <div className="art-menu__top">
            <button
              aria-label="close menu"
              className="art-menu__close"
              onClick={() => setIsMobileMenuOpen(false)}
              type="button"
            >
              <span />
            </button>
            <div className="art-menu__tabs">
              <Link
                className="art-menu__tab art-menu__tab--active"
                href="/collections/shop-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                sản phẩm
              </Link>
              {aboutLink && (
                <Link
                  className="art-menu__tab"
                  href={aboutLink.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {localizedText(locale, aboutLink.label, aboutLink.labelVi) || 'về điển'}
                </Link>
              )}
            </div>
          </div>

          <div className="art-menu__primary">
            {PRODUCT_MENU_GROUPS.map((group) => (
              <div className="art-menu__product-group" key={group.title}>
                {group.href ? (
                  <Link
                    className="art-menu__product-heading art-menu__product-heading--link"
                    href={group.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {group.title}
                  </Link>
                ) : (
                  <h2 className="art-menu__product-heading">{group.title}</h2>
                )}

                {group.items && group.items.length > 0 && (
                  <ul className="art-menu__product-list">
                    {group.items.map((item) => (
                      <li key={item.label}>
                        {item.href ? (
                          <Link
                            className="art-menu__primary-link"
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
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
              </div>
            ))}
          </div>

          <div className="art-menu__social">
            <a
              className="art-menu__footer-link"
              href={BRAND_INSTAGRAM_PROFILE_URL}
              rel="noreferrer"
              target="_blank"
            >
              instagram
            </a>
          </div>

          <form className="art-menu__newsletter">
            <label className="art-menu__newsletter-label" htmlFor="art-menu-email">
              đăng ký newsletter
            </label>
            <div className="art-menu__newsletter-row">
              <input id="art-menu-email" name="email" placeholder={newsletterPlaceholder} type="email" />
              <button type="submit">gửi</button>
            </div>
            <p>*nhận thông báo về quyền truy cập website sớm hơn cho các đợt drop; miễn phí vận chuyển cho đơn hàng đầu tiên.</p>
          </form>

          <footer className="art-menu__footer">
            <div className="art-menu__meta">
              <span>{footer.locationText}</span>
              <span>{footer.copyright}</span>
            </div>
          </footer>
        </div>
      </aside>
    </nav>
  )
}
