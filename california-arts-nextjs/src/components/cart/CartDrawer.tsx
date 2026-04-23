'use client'

import React from 'react'
import Link from 'next/link'
import { useLayout } from '@/context/LayoutContext'
import { BrandPrice } from '@/components/ui/BrandCurrency'
import PaymentLogoStrip from '@/components/ui/PaymentLogos'

function formatMoney(value: number) {
  return value
}

export default function CartDrawer() {
  const {
    cartCount,
    cartItems,
    cartSubtotal,
    isCartOpen,
    removeCartItem,
    setIsCartOpen,
    t,
    updateCartQuantity,
  } = useLayout()

  if (!isCartOpen) return null

  return (
    <>
      <div className="drawer-overlay anim-fade" onClick={() => setIsCartOpen(false)} />
      <aside className="drawer-panel cart-drawer anim-slide-r" aria-label={t('cart')}>
        <div className="cart-drawer__inner">
          <button
            aria-label={t('closeCart')}
            className="cart-drawer__close"
            onClick={() => setIsCartOpen(false)}
            type="button"
          >
            <span className="inline-block w-5 h-5 align-middle">
              <svg aria-hidden="true" focusable="false" className="icon fill-current icon-close" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M18.364 4.222l1.414 1.414L13.414 12l6.364 6.364-1.414 1.414L12 13.414l-6.364 6.364-1.414-1.414L10.586 12 4.222 5.636l1.414-1.414L12 10.586z" />
              </svg>
            </span>
          </button>

          <header className="cart-drawer__header">
            <h2>{t('cart')}</h2>
            <span>{cartCount}</span>
          </header>

          {cartItems.length === 0 ? (
            <div className="cart-drawer__empty">
              <p>{t('emptyCart')}</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="cart-drawer__continue"
                type="button"
              >
                {t('continueShopping')}
              </button>
            </div>
          ) : (
            <>
              <div className="cart-drawer__items">
                {cartItems.map((item) => (
                  <article className="cart-drawer__item" key={item.id}>
                    <Link
                      className="cart-drawer__image"
                      href={`/products/${item.handle}`}
                      onClick={() => setIsCartOpen(false)}
                      prefetch={false}
                    >
                      {item.image ? <img src={item.image} alt={item.title} /> : <span />}
                    </Link>

                    <div className="cart-drawer__item-main">
                      <div>
                        <Link
                          href={`/products/${item.handle}`}
                          onClick={() => setIsCartOpen(false)}
                          prefetch={false}
                        >
                          {item.title}
                        </Link>
                        <p>
                          {[item.color, item.size].filter(Boolean).join(' / ') ||
                            item.variantTitle ||
                            t('itemDefault')}
                        </p>
                      </div>

                      <div className="cart-drawer__quantity">
                        <button
                          aria-label={`${t('decreaseQuantity')}: ${item.title}`}
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          type="button"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          aria-label={`${t('increaseQuantity')}: ${item.title}`}
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          type="button"
                        >
                          +
                        </button>
                      </div>

                      <div className="cart-drawer__item-footer">
                        <BrandPrice amount={formatMoney(item.price * item.quantity)} />
                        <button onClick={() => removeCartItem(item.id)} type="button">
                          {t('remove')}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <footer className="cart-drawer__footer">
                <div className="cart-drawer__subtotal">
                  <span>Subtotal</span>
                  <BrandPrice amount={formatMoney(cartSubtotal)} />
                </div>
                <Link
                  className="cart-drawer__checkout"
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  prefetch={false}
                >
                  Proceed to Checkout
                </Link>

                <div className="cart-drawer__assistant-min">
                  <section className="cart-drawer__assistant">
                    <h2>Shipping &amp; Returns</h2>
                    <p>
                      Complimentary shipping on US orders over $150 USD. Refund within 14 days and
                      exchange within 30 days of delivery. See our return policy{' '}
                      <Link
                        href="/pages/returns-exchanges"
                        onClick={() => setIsCartOpen(false)}
                        prefetch={false}
                      >
                        here
                      </Link>
                      .
                    </p>
                  </section>

                  <section className="cart-drawer__assistant">
                    <h2>Secure Payment</h2>
                    <PaymentLogoStrip
                      className="cart-drawer__secure-logos"
                      compact
                      logos={['visa', 'amex', 'mastercard', 'jcb', 'vnpay']}
                    />
                  </section>
                </div>
              </footer>
            </>
          )}
        </div>
      </aside>
    </>
  )
}
