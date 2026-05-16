'use client'

import React from 'react'
import Link from 'next/link'
import type { FooterData } from '@/lib/storefront-types'
import { useLayout } from '@/context/LayoutContext'

function isExternalHref(href: string) {
  return href.startsWith('http://') || href.startsWith('https://')
}

export default function Footer({ footer }: { footer: FooterData }) {
  const { locale } = useLayout()
  const logo = footer.desktopLogo || footer.mobileLogo
  const newsletterPlaceholder =
    locale === 'vi'
      ? footer.newsletter.placeholderVi || footer.newsletter.placeholder || 'đăng ký nhận bản tin'
      : footer.newsletter.placeholder || 'sign up for our newsletter'
  const newsletterButtonLabel =
    locale === 'vi'
      ? footer.newsletter.buttonLabelVi || footer.newsletter.buttonLabel || 'đăng ký'
      : footer.newsletter.buttonLabel || 'subscribe'
  const brandTagline =
    locale === 'vi'
      ? 'thương hiệu di sản mỹ đương đại.'
      : 'the next great american heritage brand.'
  const footerLinks = [
    { label: locale === 'vi' ? 'liên hệ' : 'contact', href: '/pages/about' },
    { label: locale === 'vi' ? 'chính sách' : 'policy', href: '/pages/privacy-policy' },
    { label: locale === 'vi' ? 'câu hỏi thường gặp' : 'faq', href: '/pages/returns-exchanges' },
    { label: 'ig', href: 'https://www.instagram.com/california.arts/' },
  ]

  return (
    <div id="shopify-section-footer" className="shopify-section">
      <footer className="site-footer dien-footer" role="contentinfo">
        <div className="dien-footer__inner">
          <div className="dien-footer__brand">
            {logo && (
              <div className="dien-footer__logo">
                <img src={logo.src} alt={logo.alt || 'điển'} />
              </div>
            )}
            <p>{brandTagline}</p>
          </div>

          <div className="dien-footer__bottom">
            <form className="dien-footer__newsletter">
              <label className="visually-hidden" htmlFor="dien-footer-email">
                {newsletterPlaceholder}
              </label>
              <input
                id="dien-footer-email"
                autoComplete="email"
                name="email"
                placeholder={newsletterPlaceholder}
                type="email"
              />
              <button type="submit">{locale === 'vi' ? 'gửi' : newsletterButtonLabel}</button>
            </form>

            <nav aria-label="footer" className="dien-footer__links">
              {footerLinks.map((link) =>
                isExternalHref(link.href) ? (
                  <a href={link.href} key={link.label} rel="noreferrer" target="_blank">
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} key={link.label}>
                    {link.label}
                  </Link>
                ),
              )}
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
