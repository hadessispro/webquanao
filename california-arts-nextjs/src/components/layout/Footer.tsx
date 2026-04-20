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
  const shippingLabel = locale === 'vi' ? 'giao đến' : 'shipping to'
  const shippingCountry = locale === 'vi' ? 'việt nam (vnd)' : 'vietnam (vnd)'
  const newsletterPlaceholder =
    locale === 'vi' ? 'đăng ký nhận newsletter' : 'sign up for our newsletter'
  const footerLinks = [
    { label: locale === 'vi' ? 'giới thiệu' : 'about us', href: '/pages/our-story' },
    { label: locale === 'vi' ? 'sustainability report' : 'sustainability report', href: '/pages/about' },
    { label: locale === 'vi' ? 'chăm sóc khách hàng' : 'customer care', href: '/pages/about' },
    { label: locale === 'vi' ? 'legal / t&c' : 'legal / t&c', href: '/pages/privacy-policy' },
    { label: locale === 'vi' ? 'privacy' : 'privacy', href: '/pages/privacy-policy' },
    { label: locale === 'vi' ? 'account' : 'account', href: '/admin' },
    { label: 'ig', href: 'https://www.instagram.com/california.arts/' },
  ]

  return (
    <div id="shopify-section-footer" className="shopify-section">
      <footer className="site-footer dien-footer" role="contentinfo">
        <div className="dien-footer__inner">
          <div className="dien-footer__shipping">
            <span>{shippingLabel}</span>
            <button type="button" aria-label={shippingCountry}>
              {shippingCountry}
              <span aria-hidden="true">⌄</span>
            </button>
          </div>

          <div className="dien-footer__brand">
            {logo && (
              <div className="dien-footer__logo">
                <img src={logo.src} alt={logo.alt || 'điển'} />
              </div>
            )}
            <p>{locale === 'vi' ? 'the next great american heritage brand.' : 'the next great american heritage brand.'}</p>
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
              <button type="submit">send</button>
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
