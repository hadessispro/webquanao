'use client'

import React, { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLayout } from '@/context/LayoutContext'
import type { NewsletterPopupData } from '@/lib/storefront-types'
import type { Locale } from '@/lib/i18n'

const SUBSCRIBED_UNTIL_KEY = 'dien_newsletter_popup_subscribed_until_v4'

function localizedText(locale: Locale, text?: string, textVi?: string) {
  return locale === 'vi' && textVi ? textVi : text
}

function pathMatches(pathname: string, paths: string[]) {
  return paths.some((path) => {
    if (!path) return false
    if (path.endsWith('*')) {
      return pathname.startsWith(path.slice(0, -1))
    }

    return pathname === path
  })
}

function rememberSubscribe(days: number) {
  const safeDays = Number.isFinite(days) && days > 0 ? days : 30
  const expiresAt = Date.now() + safeDays * 24 * 60 * 60 * 1000
  window.localStorage.setItem(SUBSCRIBED_UNTIL_KEY, String(expiresAt))
}

export default function NewsletterPopup({ settings }: { settings: NewsletterPopupData }) {
  const pathname = usePathname()
  const { isCartOpen, isMobileMenuOpen, locale } = useLayout()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const title =
    locale === 'vi'
      ? 'đồng hành cùng điển'
      : localizedText(locale, settings.title, settings.titleVi)
  const description =
    locale === 'vi'
      ? 'nhận quyền truy cập sớm cho các đợt drop tiếp theo và miễn phí vận chuyển cho đơn hàng đầu tiên.'
      : localizedText(locale, settings.description, settings.descriptionVi)
  const placeholder =
    locale === 'vi'
      ? 'email của bạn'
      : localizedText(locale, settings.placeholder, settings.placeholderVi)
  const submitLabel =
    locale === 'vi'
      ? 'tham gia'
      : localizedText(locale, settings.buttonLabel, settings.buttonLabelVi)
  const privacyText =
    locale === 'vi'
      ? 'khi đăng ký, bạn đồng ý với chính sách bảo mật'
      : localizedText(locale, settings.privacyText, settings.privacyTextVi)
  const popupEnabled = settings.enabled !== false || pathname === '/'
  const popupPaths =
    settings.showOnPaths && settings.showOnPaths.length > 0
      ? settings.showOnPaths
      : ['/']
  const canShowOnPath = useMemo(
    () => pathMatches(pathname, popupPaths),
    [pathname, popupPaths],
  )

  useEffect(() => {
    if (!popupEnabled || !canShowOnPath || isCartOpen || isMobileMenuOpen) return undefined

    try {
      const subscribedUntil = Number(window.localStorage.getItem(SUBSCRIBED_UNTIL_KEY) || 0)
      if (subscribedUntil > Date.now()) return undefined
    } catch {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setOpen(true)
    }, Math.min(420, Math.max(0, settings.delayMs || 0)))

    return () => window.clearTimeout(timer)
  }, [
    canShowOnPath,
    isCartOpen,
    isMobileMenuOpen,
    popupEnabled,
    settings.delayMs,
  ])

  useEffect(() => {
    if (!open || (!isCartOpen && !isMobileMenuOpen)) return undefined

    const timer = window.setTimeout(() => setOpen(false), 0)

    return () => window.clearTimeout(timer)
  }, [isCartOpen, isMobileMenuOpen, open])

  if (!popupEnabled || !open) return null

  const close = () => {
    setOpen(false)
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) return

    setSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          source: 'newsletter popup',
        }),
      })

      if (!response.ok) throw new Error('newsletter request failed')

      rememberSubscribe(60)
      setMessage(locale === 'vi' ? 'đã đăng ký' : 'subscribed')
      window.setTimeout(() => setOpen(false), 900)
    } catch {
      setMessage(locale === 'vi' ? 'không thể đăng ký lúc này' : 'could not subscribe right now')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="newsletter-popup" role="dialog" aria-modal="true" aria-label={title}>
      <button className="newsletter-popup__scrim" aria-label="close popup" onClick={close} type="button" />
      <section className="newsletter-popup__panel">
        <button className="newsletter-popup__close" aria-label="close popup" onClick={close} type="button">
          <span />
        </button>

        <div className="newsletter-popup__copy">
          {locale === 'vi' ? (
            <>
              <h2 className="newsletter-popup__headline">
                <span>đồng hành cùng</span>
                <img alt="điển" className="newsletter-popup__wordmark" src="/media/dien-logo-header.png" />
              </h2>
              <p className="newsletter-popup__description">
                nhận quyền <em>truy cập sớm</em> cho các đợt drop tiếp theo và
                <em> miễn phí vận chuyển</em> cho đơn hàng đầu tiên!
              </p>
            </>
          ) : (
            <>
              <h2>{title}</h2>
              <p>{description}</p>
            </>
          )}
        </div>

        <form className="newsletter-popup__form" onSubmit={submit}>
          <input
            autoComplete="email"
            name="email"
            onChange={(event) => setEmail(event.currentTarget.value)}
            placeholder={placeholder}
            type="email"
            value={email}
          />
          <div className="newsletter-popup__actions">
            <button className="newsletter-popup__dismiss" onClick={close} type="button">
              {locale === 'vi' ? 'không, cảm ơn' : 'no, thanks'}
            </button>
            <button className="newsletter-popup__submit" disabled={submitting} type="submit">
              {submitting ? '...' : submitLabel}
            </button>
          </div>
        </form>

        {message && <p className="newsletter-popup__message">{message}</p>}

        <p className="newsletter-popup__privacy">
          <Link href={settings.privacyHref} onClick={close}>
            {privacyText}
          </Link>
        </p>
      </section>
    </div>
  )
}
