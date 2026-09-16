'use client'

import React, { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useLayout } from '@/context/LayoutContext'
import { BRAND_INSTAGRAM_PROFILE_URL } from '@/lib/brand'
import type { FooterData } from '@/lib/storefront-types'

function isExternalHref(href: string) {
  return href.startsWith('http://') || href.startsWith('https://')
}

interface FooterProps {
  footer?: FooterData
}

interface LinkItem {
  label: string
  labelVi?: string
  href: string
  openInNewTab?: boolean
}

const DEFAULT_LINKS: LinkItem[] = [
  { label: 'câu hỏi thường gặp', labelVi: 'câu hỏi thường gặp', href: '/pages/returns-exchanges' },
  { label: 'chính sách', labelVi: 'chính sách', href: '/pages/privacy-policy' },
  { label: 'liên hệ', labelVi: 'liên hệ', href: '/pages/about' },
  { label: 'ig', labelVi: 'ig', href: BRAND_INSTAGRAM_PROFILE_URL, openInNewTab: true },
]

export default function Footer({ footer }: FooterProps) {
  const { locale } = useLayout()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle')

  const nl = footer?.newsletter
  const nlPlaceholder =
    (locale === 'vi' && nl?.placeholderVi ? nl.placeholderVi : nl?.placeholder) ||
    (locale === 'vi' ? 'đăng ký newsletter' : 'subscribe to newsletter')
  const nlButtonLabel =
    (locale === 'vi' && nl?.buttonLabelVi ? nl.buttonLabelVi : nl?.buttonLabel) ||
    (locale === 'vi' ? 'gửi' : 'send')

  // Extract all links configured in admin (flatten across all columns)
  const adminLinks: LinkItem[] =
    footer?.columns && footer.columns.length > 0
      ? footer.columns.flatMap((col) =>
          (col.links || []).map((link) => ({
            label: link.label,
            labelVi: link.labelVi,
            href: link.href || (link as any).url || '#',
            openInNewTab: link.openInNewTab,
          })),
        )
      : []

  const validLinks = adminLinks.filter((l) => Boolean(l.label?.trim() || l.labelVi?.trim()))
  const links = validLinks.length > 0 ? validLinks : DEFAULT_LINKS

  const submitNewsletter = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const email = newsletterEmail.trim().toLowerCase()
    if (!email || newsletterStatus === 'submitting') return

    setNewsletterStatus('submitting')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer newsletter' }),
      })

      if (!response.ok) throw new Error('newsletter request failed')

      setNewsletterEmail('')
      setNewsletterStatus('success')
    } catch {
      setNewsletterStatus('error')
    }
  }

  return (
    <div id="shopify-section-footer" className="shopify-section">
      <footer className="site-footer dien-footer" role="contentinfo">
        <div className="dien-footer__inner">
          <div className="dien-footer__bottom">
            <form className="dien-footer__newsletter" onSubmit={submitNewsletter}>
              <label className="visually-hidden" htmlFor="dien-footer-email">
                {nlPlaceholder}
              </label>
              <input
                id="dien-footer-email"
                autoComplete="email"
                name="email"
                onChange={(event) => {
                  setNewsletterEmail(event.currentTarget.value)
                  if (newsletterStatus !== 'idle') setNewsletterStatus('idle')
                }}
                placeholder={
                  newsletterStatus === 'success'
                    ? locale === 'vi'
                      ? 'đăng ký thành công'
                      : 'subscribed successfully'
                    : nlPlaceholder
                }
                required
                type="email"
                value={newsletterEmail}
              />
              <button
                aria-busy={newsletterStatus === 'submitting'}
                disabled={newsletterStatus === 'submitting'}
                type="submit"
              >
                {nlButtonLabel}
              </button>
              <span aria-live="polite" className="visually-hidden">
                {newsletterStatus === 'success'
                  ? locale === 'vi'
                    ? 'đăng ký thành công'
                    : 'subscribed successfully'
                  : newsletterStatus === 'error'
                    ? locale === 'vi'
                      ? 'không thể đăng ký lúc này'
                      : 'unable to subscribe at this time'
                    : ''}
              </span>
            </form>

            <nav aria-label="footer" className="dien-footer__links">
              {links.map((link, idx) => {
                const label =
                  (locale === 'vi' && link.labelVi ? link.labelVi : link.label) || ''
                const href = link.href || '#'
                const isExt = Boolean(link.openInNewTab || isExternalHref(href))
                return isExt ? (
                  <a
                    href={href}
                    key={`${label}-${idx}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    href={href}
                    key={`${label}-${idx}`}
                    prefetch={false}
                  >
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
