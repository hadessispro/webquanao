'use client'

import React, { FormEvent, useState } from 'react'
import Link from 'next/link'
import { BRAND_INSTAGRAM_PROFILE_URL } from '@/lib/brand'

function isExternalHref(href: string) {
  return href.startsWith('http://') || href.startsWith('https://')
}

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle')
  const footerLinks = [
    { label: 'câu hỏi thường gặp', href: '/pages/returns-exchanges' },
    { label: 'chính sách', href: '/pages/privacy-policy' },
    { label: 'liên hệ', href: '/pages/about' },
    { label: 'ig', href: BRAND_INSTAGRAM_PROFILE_URL },
  ]

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
                đăng ký newsletter
              </label>
              <input
                id="dien-footer-email"
                autoComplete="email"
                name="email"
                onChange={(event) => {
                  setNewsletterEmail(event.currentTarget.value)
                  if (newsletterStatus !== 'idle') setNewsletterStatus('idle')
                }}
                placeholder="đăng ký newsletter"
                required
                type="email"
                value={newsletterEmail}
              />
              <button
                aria-busy={newsletterStatus === 'submitting'}
                disabled={newsletterStatus === 'submitting'}
                type="submit"
              >
                gửi
              </button>
              <span aria-live="polite" className="visually-hidden">
                {newsletterStatus === 'success'
                  ? 'đăng ký thành công'
                  : newsletterStatus === 'error'
                    ? 'không thể đăng ký lúc này'
                    : ''}
              </span>
            </form>

            <nav aria-label="footer" className="dien-footer__links">
              {footerLinks.map((link) =>
                isExternalHref(link.href) ? (
                  <a href={link.href} key={link.label} rel="noreferrer" target="_blank">
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} key={link.label} prefetch={false}>
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
