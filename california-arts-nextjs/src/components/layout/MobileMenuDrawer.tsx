'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useLayout } from '@/context/LayoutContext'
import { FooterData, HeaderNavItem } from '@/lib/storefront-types'
import type { Locale } from '@/lib/i18n'

interface MobileMenuDrawerProps {
  footer: FooterData
  navigation: HeaderNavItem[]
}

function localizedText(locale: Locale, text?: string, textVi?: string) {
  return locale === 'vi' && textVi ? textVi : text
}

function flattenFooterLinks(footer: FooterData) {
  return footer.columns.flatMap((column) => column.links).slice(0, 6)
}

export default function MobileMenuDrawer({ footer, navigation }: MobileMenuDrawerProps) {
  const { isMobileMenuOpen, locale, setIsMobileMenuOpen } = useLayout()
  const primaryMega = navigation.find((item) => item.megaMenu?.enabled)?.megaMenu
  const footerLinks = flattenFooterLinks(footer)

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
        <button
          aria-label="close menu"
          className="art-menu__close"
          onClick={() => setIsMobileMenuOpen(false)}
          type="button"
        >
          <span />
        </button>

        <div className="art-menu__scroll">
          <div className="art-menu__primary">
            {navigation.map((item) => (
              <Link
                className="art-menu__primary-link"
                href={item.href}
                key={`${item.label}-${item.href}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {localizedText(locale, item.label, item.labelVi)}
              </Link>
            ))}
          </div>

          {primaryMega && (
            <div className="art-menu__mega">
              {primaryMega.columns.map((column) => (
                <section className="art-menu__column" key={column.heading}>
                  <h2 className="art-menu__column-title">
                    {column.headingHref ? (
                      <Link href={column.headingHref} onClick={() => setIsMobileMenuOpen(false)}>
                        {localizedText(locale, column.heading, column.headingVi)}
                      </Link>
                    ) : (
                      localizedText(locale, column.heading, column.headingVi)
                    )}
                  </h2>
                  <div className="art-menu__column-links">
                    {column.links.map((link) => (
                      <Link
                        className="art-menu__sub-link"
                        href={link.href}
                        key={`${link.label}-${link.href}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {localizedText(locale, link.label, link.labelVi)}
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          <form className="art-menu__newsletter">
            <label className="art-menu__newsletter-label" htmlFor="art-menu-email">
              {localizedText(locale, footer.newsletter.title, footer.newsletter.titleVi)}
            </label>
            <div className="art-menu__newsletter-row">
              <input
                id="art-menu-email"
                name="email"
                placeholder={localizedText(locale, footer.newsletter.placeholder, footer.newsletter.placeholderVi)}
                type="email"
              />
              <button type="submit">
                {localizedText(locale, footer.newsletter.buttonLabel, footer.newsletter.buttonLabelVi)}
              </button>
            </div>
            <p>{localizedText(locale, footer.newsletter.privacyText, footer.newsletter.privacyTextVi)}</p>
          </form>

          <footer className="art-menu__footer">
            <div className="art-menu__footer-links">
              {footerLinks.map((link) => (
                <Link
                  className="art-menu__footer-link"
                  href={link.href}
                  key={`${link.label}-${link.href}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  target={link.openInNewTab ? '_blank' : undefined}
                >
                  {localizedText(locale, link.label, link.labelVi)}
                </Link>
              ))}
            </div>
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
