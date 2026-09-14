'use client'

import React, { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useLayout } from '@/context/LayoutContext'
import { BRAND_INSTAGRAM_PROFILE_URL } from '@/lib/brand'
import type { FooterColumn, FooterData } from '@/lib/storefront-types'

function isExternalHref(href: string) {
  return href.startsWith('http://') || href.startsWith('https://')
}

interface FooterProps {
  footer?: FooterData
}

const DEFAULT_LINKS = [
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
  const nlTitle = locale === 'vi' && nl?.titleVi ? nl.titleVi : nl?.title
  const nlDescription =
    locale === 'vi' && nl?.descriptionVi ? nl.descriptionVi : nl?.description
  const nlPlaceholder =
    (locale === 'vi' && nl?.placeholderVi ? nl.placeholderVi : nl?.placeholder) ||
    (locale === 'vi' ? 'đăng ký newsletter' : 'subscribe to newsletter')
  const nlButtonLabel =
    (locale === 'vi' && nl?.buttonLabelVi ? nl.buttonLabelVi : nl?.buttonLabel) ||
    (locale === 'vi' ? 'gửi' : 'send')
  const nlPrivacyText =
    locale === 'vi' && nl?.privacyTextVi ? nl.privacyTextVi : nl?.privacyText
  const nlPrivacyHref = nl?.privacyHref || '/pages/privacy-policy'

  const columns: FooterColumn[] =
    footer?.columns && footer.columns.length > 0
      ? footer.columns
      : [{ title: '', links: DEFAULT_LINKS }]

  const hasAnyColumnTitle = columns.some((col) =>
    Boolean(col.title?.trim() || col.titleVi?.trim()),
  )

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
            <div className="dien-footer__newsletter-block">
              {nlTitle ? (
                <h3 className="dien-footer__newsletter-title">{nlTitle}</h3>
              ) : null}
              {nlDescription ? (
                <p className="dien-footer__newsletter-desc">{nlDescription}</p>
              ) : null}

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
                  placeholder={nlPlaceholder}
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

              {newsletterStatus === 'success' && (
                <p className="dien-footer__newsletter-message dien-footer__newsletter-message--success">
                  {locale === 'vi'
                    ? 'cảm ơn bạn đã đăng ký.'
                    : 'thank you for subscribing.'}
                </p>
              )}
              {newsletterStatus === 'error' && (
                <p className="dien-footer__newsletter-message dien-footer__newsletter-message--error">
                  {locale === 'vi'
                    ? 'đã có lỗi xảy ra, vui lòng thử lại sau.'
                    : 'something went wrong, please try again.'}
                </p>
              )}

              {nlPrivacyText ? (
                <p className="dien-footer__newsletter-privacy">
                  {nlPrivacyHref ? (
                    <Link href={nlPrivacyHref} prefetch={false}>
                      {nlPrivacyText}
                    </Link>
                  ) : (
                    nlPrivacyText
                  )}
                </p>
              ) : null}
            </div>

            <div className="dien-footer__columns-wrap">
              {hasAnyColumnTitle ? (
                <div className="dien-footer__columns">
                  {columns.map((col, cIdx) => {
                    const colTitle =
                      locale === 'vi' && col.titleVi ? col.titleVi : col.title
                    return (
                      <div className="dien-footer__col" key={cIdx}>
                        {colTitle ? (
                          <h4 className="dien-footer__col-title">{colTitle}</h4>
                        ) : null}
                        <ul className="dien-footer__col-links">
                          {col.links.map((link, lIdx) => {
                            const label =
                              locale === 'vi' && link.labelVi
                                ? link.labelVi
                                : link.label
                            const isExt =
                              link.openInNewTab || isExternalHref(link.href)
                            return (
                              <li key={lIdx}>
                                {isExt ? (
                                  <a
                                    href={link.href}
                                    rel="noreferrer"
                                    target="_blank"
                                  >
                                    {label}
                                  </a>
                                ) : (
                                  <Link href={link.href} prefetch={false}>
                                    {label}
                                  </Link>
                                )}
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <nav aria-label="footer" className="dien-footer__links">
                  {columns
                    .flatMap((col) => col.links)
                    .map((link, idx) => {
                      const label =
                        locale === 'vi' && link.labelVi ? link.labelVi : link.label
                      const isExt = link.openInNewTab || isExternalHref(link.href)
                      return isExt ? (
                        <a
                          href={link.href}
                          key={`${link.label}-${idx}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          key={`${link.label}-${idx}`}
                          prefetch={false}
                        >
                          {label}
                        </Link>
                      )
                    })}
                </nav>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
