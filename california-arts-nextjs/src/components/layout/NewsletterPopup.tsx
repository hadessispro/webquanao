'use client'

import React, { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLayout } from '@/context/LayoutContext'
import type { NewsletterPopupData } from '@/lib/storefront-types'
import type { Locale } from '@/lib/i18n'

const DISMISS_UNTIL_KEY = 'dien_newsletter_popup_dismiss_until'
const SESSION_KEY = 'dien_newsletter_popup_seen'

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

function rememberDismiss(days: number) {
  const safeDays = Number.isFinite(days) && days > 0 ? days : 7
  const expiresAt = Date.now() + safeDays * 24 * 60 * 60 * 1000
  window.localStorage.setItem(DISMISS_UNTIL_KEY, String(expiresAt))
  window.sessionStorage.setItem(SESSION_KEY, '1')
}

export default function NewsletterPopup({ settings }: { settings: NewsletterPopupData }) {
  const pathname = usePathname()
  const { isCartOpen, isMobileMenuOpen, locale } = useLayout()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const canShowOnPath = useMemo(
    () => pathMatches(pathname, settings.showOnPaths || []),
    [pathname, settings.showOnPaths],
  )

  useEffect(() => {
    if (!settings.enabled || !canShowOnPath || isCartOpen || isMobileMenuOpen) return undefined

    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) return undefined
      const dismissedUntil = Number(window.localStorage.getItem(DISMISS_UNTIL_KEY) || 0)
      if (dismissedUntil > Date.now()) return undefined
    } catch {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setOpen(true)
      window.sessionStorage.setItem(SESSION_KEY, '1')
    }, Math.max(0, settings.delayMs || 0))

    return () => window.clearTimeout(timer)
  }, [
    canShowOnPath,
    isCartOpen,
    isMobileMenuOpen,
    settings.delayMs,
    settings.enabled,
  ])

  useEffect(() => {
    if (!open || (!isCartOpen && !isMobileMenuOpen)) return undefined

    const timer = window.setTimeout(() => setOpen(false), 0)

    return () => window.clearTimeout(timer)
  }, [isCartOpen, isMobileMenuOpen, open])

  if (!settings.enabled || !open) return null

  const close = () => {
    rememberDismiss(settings.dismissDays)
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

      rememberDismiss(60)
      setMessage(locale === 'vi' ? 'đã đăng ký' : 'subscribed')
      window.setTimeout(() => setOpen(false), 900)
    } catch {
      setMessage(locale === 'vi' ? 'không thể đăng ký lúc này' : 'could not subscribe right now')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="newsletter-popup" role="dialog" aria-modal="true" aria-label={settings.title}>
      <button className="newsletter-popup__scrim" aria-label="close popup" onClick={close} type="button" />
      <section className="newsletter-popup__panel">
        <button className="newsletter-popup__close" aria-label="close popup" onClick={close} type="button">
          <span />
        </button>

        <div className="newsletter-popup__brand">
          {settings.logo && <img src={settings.logo.src} alt={settings.logo.alt || ''} />}
          <div className="newsletter-popup__dots" aria-hidden="true">
            {Array.from({ length: 16 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
        </div>

        <div className="newsletter-popup__copy">
          <h2>{localizedText(locale, settings.title, settings.titleVi)}</h2>
          <p>{localizedText(locale, settings.description, settings.descriptionVi)}</p>
        </div>

        <form className="newsletter-popup__form" onSubmit={submit}>
          <input
            autoComplete="email"
            name="email"
            onChange={(event) => setEmail(event.currentTarget.value)}
            placeholder={localizedText(locale, settings.placeholder, settings.placeholderVi)}
            type="email"
            value={email}
          />
          <button disabled={submitting} type="submit">
            {submitting ? '...' : localizedText(locale, settings.buttonLabel, settings.buttonLabelVi)}
          </button>
        </form>

        {message && <p className="newsletter-popup__message">{message}</p>}

        <p className="newsletter-popup__privacy">
          <Link href={settings.privacyHref} onClick={close}>
            {localizedText(locale, settings.privacyText, settings.privacyTextVi)}
          </Link>
        </p>
      </section>
    </div>
  )
}
