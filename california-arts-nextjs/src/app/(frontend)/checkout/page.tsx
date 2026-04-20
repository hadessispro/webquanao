'use client'

import React, { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useLayout } from '@/context/LayoutContext'

const CHECKOUT_PROFILE_KEY = 'california_arts_checkout_profile'

type CheckoutProfile = {
  acceptsMarketing: boolean
  apartment: string
  city: string
  country: string
  district: string
  email: string
  firstName: string
  lastName: string
  paymentMethod: string
  phone: string
  street: string
  zipCode: string
}

type AppliedDiscount = {
  code: string
  discountAmount: number
  id: string | number
  label?: string
}

const emptyProfile: CheckoutProfile = {
  acceptsMarketing: true,
  apartment: '',
  city: '',
  country: 'Vietnam',
  district: '',
  email: '',
  firstName: '',
  lastName: '',
  paymentMethod: 'cod',
  phone: '',
  street: '',
  zipCode: '',
}

function formatMoney(value: number) {
  return `${new Intl.NumberFormat('vi-VN').format(value)}₫`
}

function makeOrderNumber() {
  return `CA-${Date.now().toString(36).toUpperCase()}`
}

function buildCustomerName(profile: CheckoutProfile) {
  return [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim()
}

function hasProfileValue(profile: CheckoutProfile) {
  return [
    profile.apartment,
    profile.city,
    profile.district,
    profile.email,
    profile.firstName,
    profile.lastName,
    profile.phone,
    profile.street,
    profile.zipCode,
  ].some((value) => value.trim())
}

function readSavedProfile() {
  try {
    const rawProfile = window.localStorage.getItem(CHECKOUT_PROFILE_KEY)
    if (!rawProfile) return null

    const savedProfile = JSON.parse(rawProfile) as Partial<CheckoutProfile> & {
      customerName?: string
    }
    const legacyName = savedProfile.customerName?.trim().split(/\s+/) || []

    const profile = {
      ...emptyProfile,
      ...savedProfile,
      country: savedProfile.country || 'Vietnam',
      firstName: savedProfile.firstName || legacyName[0] || '',
      lastName: savedProfile.lastName || legacyName.slice(1).join(' ') || '',
      paymentMethod: savedProfile.paymentMethod || 'cod',
    }

    return hasProfileValue(profile) ? profile : null
  } catch {
    return null
  }
}

export default function CheckoutPage() {
  const { cartItems, cartSubtotal, clearCart, t } = useLayout()
  const [profile, setProfile] = useState<CheckoutProfile>(emptyProfile)
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [hasSavedProfile, setHasSavedProfile] = useState(false)
  const [notes, setNotes] = useState('')
  const [discountInput, setDiscountInput] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null)
  const [discountMessage, setDiscountMessage] = useState('')
  const [discountStatus, setDiscountStatus] = useState<'idle' | 'checking' | 'applied' | 'error'>(
    'idle',
  )
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [orderNumber, setOrderNumber] = useState('')

  const discountAmount = appliedDiscount?.discountAmount || 0
  const total = useMemo(
    () => Math.max(cartSubtotal - discountAmount, 0),
    [cartSubtotal, discountAmount],
  )

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedProfile = readSavedProfile()

      if (savedProfile) {
        setProfile(savedProfile)
        setHasSavedProfile(true)
      }

      setProfileLoaded(true)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!profileLoaded) return

    try {
      if (hasProfileValue(profile)) {
        window.localStorage.setItem(CHECKOUT_PROFILE_KEY, JSON.stringify(profile))
      } else {
        window.localStorage.removeItem(CHECKOUT_PROFILE_KEY)
      }
    } catch {
      // Checkout should keep working even if localStorage is blocked.
    }
  }, [profile, profileLoaded])

  const updateProfile = (field: keyof CheckoutProfile, value: string | boolean) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [field]: value,
    }))
  }

  const applyDiscount = async () => {
    const code = discountInput.trim()
    if (!code) return

    setDiscountStatus('checking')
    setDiscountMessage('')

    try {
      const response = await fetch('/api/checkout/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          customerEmail: profile.email,
          subtotal: cartSubtotal,
        }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.message || t('discountError'))
      }

      setAppliedDiscount({
        code: result.code,
        discountAmount: Number(result.discountAmount || 0),
        id: result.id,
        label: result.label,
      })
      setDiscountInput(result.code)
      setDiscountStatus('applied')
      setDiscountMessage(t('discountApplied'))
    } catch (error) {
      setAppliedDiscount(null)
      setDiscountStatus('error')
      setDiscountMessage(error instanceof Error ? error.message : t('discountError'))
    }
  }

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (cartItems.length === 0) return

    const nextOrderNumber = makeOrderNumber()
    const customerName = buildCustomerName(profile)

    setStatus('submitting')
    setMessage('')

    const payload = {
      acceptsMarketing: profile.acceptsMarketing,
      orderNumber: nextOrderNumber,
      firstName: profile.firstName,
      lastName: profile.lastName,
      customerName,
      customerEmail: profile.email,
      customerPhone: profile.phone,
      shippingAddress: {
        street: profile.street,
        apartment: profile.apartment,
        city: profile.city,
        district: profile.district,
        zipCode: profile.zipCode,
        country: profile.country || 'Vietnam',
      },
      items: cartItems.map((item) => ({
        productTitle: item.title,
        variantTitle: [item.color, item.size].filter(Boolean).join(' / ') || item.variantTitle,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: cartSubtotal,
      shippingCost: 0,
      discountCode: appliedDiscount?.id,
      discountAmount,
      total,
      status: 'pending',
      paymentMethod: profile.paymentMethod || 'cod',
      paymentStatus: 'pending',
      notes,
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.message || t('orderSubmitError'))
      }

      setOrderNumber(result?.order?.orderNumber || nextOrderNumber)
      clearCart()
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : t('orderSubmitError'))
    }
  }

  return (
    <section className="checkout-page bg-primary-background text-primary-text">
      {status === 'success' ? (
        <section className="checkout-page__success">
          <p>{t('orderReceived')}</p>
          <h1>{orderNumber}</h1>
          <span>{t('savedDetailsNextVisit')}</span>
          <Link href="/collections/shop-all">{t('continueShopping')}</Link>
        </section>
      ) : cartItems.length === 0 ? (
        <section className="checkout-page__empty">
          <p>{t('emptyCart')}.</p>
          <Link href="/collections/shop-all">{t('shopAll')}</Link>
        </section>
      ) : (
        <form className="checkout-page__layout" onSubmit={submitOrder}>
          <main className="checkout-page__form">
            <section className="checkout-page__intro">
              <p>{t('secureCheckout')}</p>
              <h1>{t('completeYourOrder')}</h1>
              <span>
                {hasSavedProfile
                  ? t('savedCustomerLoaded')
                  : t('detailsSavedNextTime')}
              </span>
            </section>

            <section className="checkout-page__fieldset">
              <div className="checkout-page__section-head">
                <h2>{t('contact')}</h2>
                <span>{hasSavedProfile ? t('returningCustomer') : t('savedAfterCheckout')}</span>
              </div>
              <label className="checkout-page__field checkout-page__field--full">
                <span>{t('email')}</span>
                <input
                  autoComplete="email"
                  name="email"
                  onChange={(event) => updateProfile('email', event.target.value)}
                  required
                  type="email"
                  value={profile.email}
                />
              </label>
              <label className="checkout-page__checkbox">
                <input
                  checked={profile.acceptsMarketing}
                  onChange={(event) => updateProfile('acceptsMarketing', event.target.checked)}
                  type="checkbox"
                />
                <span>{t('newsOffers')}</span>
              </label>
            </section>

            <section className="checkout-page__fieldset">
              <div className="checkout-page__section-head">
                <h2>{t('delivery')}</h2>
              </div>
              <label className="checkout-page__field checkout-page__field--full">
                <span>{t('countryRegion')}</span>
                <select
                  name="country"
                  onChange={(event) => updateProfile('country', event.target.value)}
                  required
                  value={profile.country}
                >
                  <option value="Vietnam">Vietnam</option>
                  <option value="United States">United States</option>
                  <option value="Japan">Japan</option>
                  <option value="South Korea">South Korea</option>
                </select>
              </label>
              <div className="checkout-page__grid">
                <label className="checkout-page__field">
                  <span>{t('firstName')}</span>
                  <input
                    autoComplete="given-name"
                    name="firstName"
                    onChange={(event) => updateProfile('firstName', event.target.value)}
                    required
                    type="text"
                    value={profile.firstName}
                  />
                </label>
                <label className="checkout-page__field">
                  <span>{t('lastName')}</span>
                  <input
                    autoComplete="family-name"
                    name="lastName"
                    onChange={(event) => updateProfile('lastName', event.target.value)}
                    type="text"
                    value={profile.lastName}
                  />
                </label>
              </div>
              <label className="checkout-page__field checkout-page__field--full">
                <span>{t('address')}</span>
                <input
                  autoComplete="street-address"
                  name="street"
                  onChange={(event) => updateProfile('street', event.target.value)}
                  required
                  type="text"
                  value={profile.street}
                />
              </label>
              <label className="checkout-page__field checkout-page__field--full">
                <span>{t('apartmentOptional')}</span>
                <input
                  name="apartment"
                  onChange={(event) => updateProfile('apartment', event.target.value)}
                  type="text"
                  value={profile.apartment}
                />
              </label>
              <div className="checkout-page__grid">
                <label className="checkout-page__field">
                  <span>{t('city')}</span>
                  <input
                    autoComplete="address-level2"
                    name="city"
                    onChange={(event) => updateProfile('city', event.target.value)}
                    required
                    type="text"
                    value={profile.city}
                  />
                </label>
                <label className="checkout-page__field">
                  <span>{t('district')}</span>
                  <input
                    name="district"
                    onChange={(event) => updateProfile('district', event.target.value)}
                    type="text"
                    value={profile.district}
                  />
                </label>
              </div>
              <div className="checkout-page__grid">
                <label className="checkout-page__field">
                  <span>{t('postalCodeOptional')}</span>
                  <input
                    autoComplete="postal-code"
                    name="zipCode"
                    onChange={(event) => updateProfile('zipCode', event.target.value)}
                    type="text"
                    value={profile.zipCode}
                  />
                </label>
                <label className="checkout-page__field">
                  <span>{t('phone')}</span>
                  <input
                    autoComplete="tel"
                    name="phone"
                    onChange={(event) => updateProfile('phone', event.target.value)}
                    type="tel"
                    value={profile.phone}
                  />
                </label>
              </div>
            </section>

            <section className="checkout-page__fieldset">
              <div className="checkout-page__section-head">
                <h2>{t('payment')}</h2>
              </div>
              <label className="checkout-page__field checkout-page__field--full">
                <span>{t('method')}</span>
                <select
                  name="paymentMethod"
                  onChange={(event) => updateProfile('paymentMethod', event.target.value)}
                  value={profile.paymentMethod}
                >
                  <option value="cod">{t('cashOnDelivery')}</option>
                  <option value="bank_transfer">{t('bankTransfer')}</option>
                  <option value="vnpay">VNPay</option>
                </select>
              </label>
              <label className="checkout-page__field checkout-page__field--full">
                <span>{t('notesOptional')}</span>
                <textarea
                  name="notes"
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  value={notes}
                />
              </label>
            </section>

            {message && <p className="checkout-page__message">{message}</p>}
          </main>

          <aside className="checkout-page__summary" aria-label={t('orderSummary')}>
            <h2>{t('orderSummary')}</h2>
            <div className="checkout-page__items">
              {cartItems.map((item) => (
                <article className="checkout-page__item" key={item.id}>
                  <div className="checkout-page__thumb">
                    {item.image ? <img src={item.image} alt={item.title} /> : <span />}
                    <b>{item.quantity}</b>
                  </div>
                  <div className="checkout-page__item-copy">
                    <p>{item.title}</p>
                    <span>
                      {[item.color, item.size].filter(Boolean).join(' / ') ||
                        item.variantTitle ||
                        t('itemDefault')}
                    </span>
                  </div>
                  <strong>{formatMoney(item.price * item.quantity)}</strong>
                </article>
              ))}
            </div>

            <div className="checkout-page__discount">
              <input
                aria-label={t('discountPlaceholder')}
                onChange={(event) => setDiscountInput(event.target.value)}
                placeholder={t('discountPlaceholder')}
                type="text"
                value={discountInput}
              />
              <button
                disabled={discountStatus === 'checking' || !discountInput.trim()}
                onClick={applyDiscount}
                type="button"
              >
                {discountStatus === 'checking' ? t('checking') : t('apply')}
              </button>
            </div>
            {discountMessage && (
              <p
                className={
                  discountStatus === 'error'
                    ? 'checkout-page__discount-message checkout-page__discount-message--error'
                    : 'checkout-page__discount-message'
                }
              >
                {discountMessage}
              </p>
            )}

            <div className="checkout-page__totals">
              <p>
                <span>{t('subtotal')}</span>
                <span>{formatMoney(cartSubtotal)}</span>
              </p>
              {appliedDiscount && (
                <p>
                  <span>{appliedDiscount.code}</span>
                  <span>-{formatMoney(discountAmount)}</span>
                </p>
              )}
              <p>
                <span>{t('shipping')}</span>
                <span>{t('shippingCalculated')}</span>
              </p>
              <p className="checkout-page__total">
                <span>{t('total')}</span>
                <span>{formatMoney(total)}</span>
              </p>
            </div>
            <button
              className="checkout-page__submit"
              disabled={status === 'submitting'}
              type="submit"
            >
              {status === 'submitting' ? t('placingOrder') : t('placeOrder')}
            </button>
          </aside>
          <div className="checkout-page__sticky-total">
            <span>
              <small>{t('total')}</small>
              <strong>{formatMoney(total)}</strong>
            </span>
            <button disabled={status === 'submitting'} type="submit">
              {status === 'submitting' ? t('placingOrder') : t('placeOrder')}
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
