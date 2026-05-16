'use client'

import React from 'react'
import Link from 'next/link'
import type { FooterData } from '@/lib/storefront-types'
import { BRAND_INSTAGRAM_PROFILE_URL, BRAND_NAME, BRAND_TAGLINE } from '@/lib/brand'

function isExternalHref(href: string) {
  return href.startsWith('http://') || href.startsWith('https://')
}

export default function Footer({ footer }: { footer: FooterData }) {
  const logo = footer.desktopLogo || footer.mobileLogo
  const footerLinks = [
    { label: 'liên hệ', href: '/pages/about' },
    { label: 'chính sách', href: '/pages/privacy-policy' },
    { label: 'câu hỏi thường gặp', href: '/pages/returns-exchanges' },
    { label: 'ig', href: BRAND_INSTAGRAM_PROFILE_URL },
  ]

  return (
    <div id="shopify-section-footer" className="shopify-section">
      <footer className="site-footer dien-footer" role="contentinfo">
        <div className="dien-footer__inner">
          <div className="dien-footer__brand">
            {logo && (
              <div className="dien-footer__logo">
                <img src={logo.src} alt={logo.alt || BRAND_NAME} />
              </div>
            )}
            <p>{BRAND_TAGLINE}</p>
          </div>

          <div className="dien-footer__bottom">
            <form className="dien-footer__newsletter">
              <label className="visually-hidden" htmlFor="dien-footer-email">
                đăng ký newsletter
              </label>
              <input
                id="dien-footer-email"
                autoComplete="email"
                name="email"
                placeholder="đăng ký newsletter"
                type="email"
              />
              <button type="submit">gửi</button>
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
