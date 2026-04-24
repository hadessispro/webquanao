'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLayout } from '@/context/LayoutContext'
import { BrandCurrencyText } from '@/components/ui/BrandCurrency'
import { HeaderData, HeaderMegaMenu, HeaderNavItem } from '@/lib/storefront-types'
import type { Locale } from '@/lib/i18n'

interface HeaderProps {
  header: HeaderData
}

function SmartLink({
  href,
  className,
  children,
  openInNewTab,
  onClick,
}: {
  href: string
  className?: string
  children: React.ReactNode
  openInNewTab?: boolean
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}) {
  const external = href.startsWith('http')
  const target = openInNewTab || external ? '_blank' : undefined
  const rel = target ? 'noreferrer' : undefined

  if (external) {
    return (
      <a href={href} className={className} target={target} rel={rel} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={className} target={target} rel={rel} onClick={onClick}>
      {children}
    </Link>
  )
}

function Chevron() {
  return (
    <span className="inline-block align-middle svg-scale mr-1 transform origin-center rotate transition">
      <svg aria-hidden="true" focusable="false" role="presentation" className="icon fill-current" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 16.596L4.222 8.818l1.414-1.414L12 13.768l6.364-6.364 1.414 1.414z" />
      </svg>
    </span>
  )
}

function BagIcon() {
  return (
    <svg
      aria-hidden="true"
      className="header-bag-icon"
      focusable="false"
      height="22"
      role="presentation"
      viewBox="0 0 24 24"
      width="22"
    >
      <path d="M7.25 8.25V7a4.75 4.75 0 0 1 9.5 0v1.25h2.18l.82 12.5H4.25l.82-12.5h2.18Zm1.5 0h6.5V7a3.25 3.25 0 0 0-6.5 0v1.25Zm-2.27 1.5-.62 9.5h12.28l-.62-9.5H6.48Z" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <span aria-hidden="true" className="header-menu-toggle__mark">
      <span />
      <span />
    </span>
  )
}

function CartButton({ cartCount, onClick, label }: { cartCount: number; label: string; onClick: () => void }) {
  return (
    <button
      aria-label={`${label} (${cartCount})`}
      className="header-bag-button"
      onClick={onClick}
      type="button"
    >
      <BagIcon />
      {cartCount > 0 && <span className="header-bag-count">{cartCount}</span>}
    </button>
  )
}

function localizedText(locale: Locale, text?: string, textVi?: string) {
  return locale === 'vi' && textVi ? textVi : text
}

function MegaMenu({
  fallbackHref,
  locale,
  megaMenu,
  onNavigate,
}: {
  fallbackHref: string
  locale: Locale
  megaMenu: HeaderMegaMenu
  onNavigate?: () => void
}) {
  if (!megaMenu.enabled) return null

  return (
    <div className="c_megamenu-upper absolute left-0 bottom-0 w-full transform translate-y-full z-20 bg-header-background text-header-text border-t-grid border-b-grid border-grid-color">
      <div className="c_megamenu-main section-x-padding text-center">
        <div className="c_megamenu-inner c_megamenu-inner-2 flex py-2 justify-center -ml-16">
          {megaMenu.columns.length > 0 && (
            <div className="c_megamenu-inner-menu">
              {megaMenu.columns.map((column, index) => (
                <div className="c_megamenu-inner-a ml-16" key={`${column.heading}-${index}`}>
                  <h2 className="c_megamenu-second font-heading mb-2">
                    <SmartLink
                      className="inline-block py-1"
                      href={column.headingHref || fallbackHref || column.links[0]?.href || '#'}
                      onClick={onNavigate}
                    >
                      {localizedText(locale, column.heading, column.headingVi)}
                    </SmartLink>
                  </h2>
                  <ul className="c_megamenu-third-ul">
                    {column.links.map((item) => (
                      <li key={`${item.label}-${item.href}`}>
                        <SmartLink className="inline-block py-1" href={item.href} onClick={onNavigate}>
                          {localizedText(locale, item.label, item.labelVi)}
                        </SmartLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {megaMenu.imageCards.length > 0 && (
            <div className="c_megamenu-inner-image">
              {megaMenu.imageCards.map((card, index) => (
                <div className="c_megamenu-inner-a c_megamenu-inner-images ml-16" key={`${card.caption || 'image'}-${index}`}>
                  {card.image && (
                    <div className="c_megamenu-image">
                      <SmartLink href={card.href || '#'} onClick={onNavigate}>
                        <img src={card.image.src} alt={card.image.alt || card.caption || ''} />
                      </SmartLink>
                    </div>
                  )}
                  {card.caption && (
                    <div className="c_megamenu-content">
                      <h2>
                        <SmartLink href={card.href || '#'} onClick={onNavigate}>
                          {localizedText(locale, card.caption, card.captionVi)}
                        </SmartLink>
                      </h2>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="c_megamenu-inner-after" />
      </div>
    </div>
  )
}

function DesktopNavItem({
  isOpen,
  item,
  locale,
  onClose,
  onOpen,
}: {
  isOpen: boolean
  item: HeaderNavItem
  locale: Locale
  onClose: () => void
  onOpen: () => void
}) {
  const hasMegaMenu = Boolean(item.megaMenu?.enabled && (item.megaMenu.columns.length > 0 || item.megaMenu.imageCards.length > 0))

  const handleBlurCapture = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      onClose()
    }
  }

  return (
    <li
      className={['ca_menu-1st-c', hasMegaMenu && isOpen ? 'ca_menu-1st-c--open' : ''].filter(Boolean).join(' ')}
      onMouseEnter={hasMegaMenu ? onOpen : undefined}
      onMouseLeave={hasMegaMenu ? onClose : undefined}
    >
      <div
        className={hasMegaMenu ? 'no-js-focus-wrapper' : undefined}
        onBlurCapture={hasMegaMenu ? handleBlurCapture : undefined}
        onFocusCapture={hasMegaMenu ? onOpen : undefined}
      >
        {hasMegaMenu ? (
          <button
            aria-expanded={isOpen}
            aria-haspopup="true"
            className="ca_menu-1st-button inline-flex items-center"
            onClick={() => (isOpen ? onClose() : onOpen())}
            type="button"
          >
            <span className="inline-block pr-1">{localizedText(locale, item.label, item.labelVi)}</span>
            <Chevron />
          </button>
        ) : (
          <SmartLink
            className="ca_menu-1st-button inline-flex items-center relative"
            href={item.href}
            openInNewTab={item.openInNewTab}
          >
            <span className="inline-block pr-1">{localizedText(locale, item.label, item.labelVi)}</span>
          </SmartLink>
        )}
        {item.megaMenu && <MegaMenu fallbackHref={item.href} locale={locale} megaMenu={item.megaMenu} onNavigate={onClose} />}
      </div>
    </li>
  )
}

export default function Header({ header }: HeaderProps) {
  const { cartCount, locale, setIsCartOpen, setIsMobileMenuOpen, t, toggleLocale } = useLayout()
  const pathname = usePathname()
  const isCheckout = pathname === '/checkout'
  const desktopMenuRef = useRef<HTMLDivElement | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [nearFooter, setNearFooter] = useState(false)
  const [openMegaMenuHref, setOpenMegaMenuHref] = useState<string | null>(null)
  const logo = header.logo
  const isHome = pathname === '/'

  useEffect(() => {
    if (isCheckout) {
      document.documentElement.style.removeProperty('--header-stack-height')
      document.documentElement.classList.remove('site-footer-near')
      return undefined
    }

    let frameId = 0

    const updateHeaderState = () => {
      frameId = 0
      setScrolled(window.scrollY > 18)

      const headerEl = document.querySelector<HTMLElement>('.site-header-stack')
      const headerHeight = headerEl?.getBoundingClientRect().height || 90
      document.documentElement.style.setProperty('--header-stack-height', `${Math.round(headerHeight)}px`)

      const footer = document.getElementById('shopify-section-footer')
      if (!footer) {
        setNearFooter(false)
        document.documentElement.classList.remove('site-footer-near')
        return
      }

      const footerRect = footer.getBoundingClientRect()
      const footerRevealPoint = Math.max(headerHeight + 44, window.innerHeight * 0.72)
      const isNearFooter = footerRect.top <= footerRevealPoint && footerRect.bottom > headerHeight

      setNearFooter(isNearFooter)
      document.documentElement.classList.toggle('site-footer-near', isNearFooter)
    }

    const queueUpdate = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(updateHeaderState)
    }

    updateHeaderState()
    window.addEventListener('scroll', queueUpdate, { passive: true })
    window.addEventListener('resize', queueUpdate)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', queueUpdate)
      window.removeEventListener('resize', queueUpdate)
      document.documentElement.style.removeProperty('--header-stack-height')
      document.documentElement.classList.remove('site-footer-near')
    }
  }, [isCheckout, pathname])

  useEffect(() => {
    if (!openMegaMenuHref) return undefined

    const handlePointerDown = (event: PointerEvent) => {
      if (!desktopMenuRef.current?.contains(event.target as Node)) {
        setOpenMegaMenuHref(null)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMegaMenuHref(null)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [openMegaMenuHref])

  const headerStackClass = [
    'site-header-stack',
    isHome ? 'site-header-stack--home' : '',
    scrolled ? 'site-header-stack--scrolled' : '',
    nearFooter ? 'site-header-stack--footer-near' : '',
    searchOpen ? 'site-header-stack--search-open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  if (isCheckout) return null

  return (
    <div className={headerStackClass}>
      {header.shippingBar.enabled && (
        <div id="shopify-section-announcement-bar" className="shopify-section site-announcement">
          <div className="ge-free-shipping-container">
            <div className="ge-free-shipping-msg">
              {header.shippingBar.href ? (
                <SmartLink href={header.shippingBar.href} className="section-x-padding hover:text-primary-accent">
                  <BrandCurrencyText text={localizedText(locale, header.shippingBar.text, header.shippingBar.textVi)} />
                </SmartLink>
              ) : (
                <BrandCurrencyText text={localizedText(locale, header.shippingBar.text, header.shippingBar.textVi)} />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="header-sticky-shell relative" style={{ position: 'sticky', top: 0, zIndex: 30 }}>
        <div id="shopify-section-header" className="shopify-section section-header" style={{ position: 'relative', zIndex: 30 }}>
          <style
            dangerouslySetInnerHTML={{
              __html: `
            :root {
              --color-header-accent: var(--color-primary-accent);
              --color-header-text: var(--color-primary-text);
              --color-header-background: var(--color-primary-background);
              --color-header-background-hex: var(--color-primary-background-hex);
              --color-header-background-0: var(--color-primary-background-0);
              --color-header-meta: var(--color-primary-meta);
              --sticky-header-height: 58px;
            }
            .logo-image { display: block; max-width: 128px; }
          `,
            }}
          />

          <section data-section-type="header" data-sticky="true">
            <header className="bg-header-background text-header-text border-b-grid relative z-10 border-theme-color">
              <nav className="relative hidden lg:block" aria-label="Primary">
                <div className="c_header-main site-header__inner section-x-padding text-sm">
                  <div className="site-header__left">
                    <button
                      aria-label={t('menu')}
                      className="header-menu-toggle header-menu-toggle--desktop"
                      onClick={() => setIsMobileMenuOpen(true)}
                      type="button"
                    >
                      <MenuIcon />
                    </button>
                  </div>

                  <h1 className="c_header-logo site-header__brand">
                    <SmartLink href={header.logoHref} className="site-header__logo-link logo-image break-all">
                      {logo ? <img src={logo.src} alt={logo.alt || header.logoAlt} /> : header.logoText}
                    </SmartLink>
                  </h1>

                  <div className="c_header-menu site-header__menu" ref={desktopMenuRef}>
                    <ul className="c_header-menu-ul flex flex-wrap">
                      {header.navigation.map((item) => (
                        <DesktopNavItem
                          isOpen={openMegaMenuHref === item.href}
                          item={item}
                          key={`${item.label}-${item.href}`}
                          locale={locale}
                          onClose={() => setOpenMegaMenuHref((current) => (current === item.href ? null : current))}
                          onOpen={() => setOpenMegaMenuHref(item.href)}
                        />
                      ))}
                    </ul>
                  </div>

                  <div className="c_header-icons site-header__actions">
                    <ul className="c_header-icons-ul">
                      {header.countrySelector.enabled && (
                        <li>
                          <button type="button" className="localization__list--button">
                            <BrandCurrencyText
                              text={localizedText(locale, header.countrySelector.label, header.countrySelector.labelVi) || t('countryLabel')}
                            />
                          </button>
                        </li>
                      )}
                      <li>
                        <button
                          aria-label={t('languageToggle')}
                          className="header-locale-toggle"
                          onClick={toggleLocale}
                          type="button"
                        >
                          {locale === 'en' ? 'VI' : 'EN'}
                        </button>
                      </li>
                      <li>
                        <div className="whitespace-nowrap">
                          <button
                            aria-label={t('openSearch')}
                            onClick={() => setSearchOpen((open) => !open)}
                            className="header-search-toggle"
                          >
                            {t('search')}
                          </button>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center justify-end text-right">
                          <div className="c_header-cartCount whitespace-nowrap">
                            <CartButton
                              cartCount={cartCount}
                              label={t('openCart')}
                              onClick={() => setIsCartOpen(true)}
                            />
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>

              <div className="lg:hidden">
                <div className="site-header__mobile section-x-padding">
                  <button
                    aria-label={t('menu')}
                    className="header-menu-toggle header-menu-toggle--mobile"
                    onClick={() => setIsMobileMenuOpen(true)}
                    type="button"
                  >
                    <MenuIcon />
                  </button>

                  <h1 className="site-header__mobile-brand">
                    <SmartLink href={header.logoHref} className="site-header__logo-link logo-image break-all">
                      {logo ? <img src={logo.src} alt={logo.alt || header.logoAlt} /> : header.logoText}
                    </SmartLink>
                  </h1>

                  <div className="ca_header-icons site-header__mobile-actions">
                    <button
                      aria-label={t('languageToggle')}
                      className="header-locale-toggle"
                      onClick={toggleLocale}
                      type="button"
                    >
                      {locale === 'en' ? 'VI' : 'EN'}
                    </button>
                    <div className="ca_header-icons__search whitespace-nowrap ml-4">
                      <button
                        aria-label={t('openSearch')}
                        onClick={() => setSearchOpen((open) => !open)}
                        className="header-search-toggle"
                      >
                        {t('search')}
                      </button>
                    </div>
                    <div className="c_header-cartCount ml-4 whitespace-nowrap">
                      <CartButton
                        cartCount={cartCount}
                        label={t('openCart')}
                        onClick={() => setIsCartOpen(true)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </header>
          </section>

          {searchOpen && (
            <div className="search-overlay anim-fade" onClick={(event) => event.stopPropagation()}>
              <div className="section-x-padding">
                <form action="/search" method="get" className="input-group search" role="search">
                  <div className="flex items-center justify-between">
                    <button className="py-2 mr-4" aria-label={t('submitSearch')} type="submit">
                      <span className="inline-block w-5 h-5 align-middle">
                        <svg aria-hidden="true" focusable="false" className="icon fill-current icon-search" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M10.533 17.438a6.968 6.968 0 01-6.96-6.96 6.968 6.968 0 016.96-6.96 6.968 6.968 0 016.96 6.96 6.968 6.968 0 01-6.96 6.96zm6.949-1.314a8.917 8.917 0 002.01-5.646c0-4.941-4.02-8.96-8.96-8.96-4.94 0-8.96 4.019-8.96 8.96 0 4.94 4.02 8.96 8.96 8.96 2.082 0 3.996-.72 5.52-1.916l4.962 4.96 1.415-1.413-4.947-4.945z" />
                        </svg>
                      </span>
                    </button>
                    <input type="text" name="q" placeholder={t('search')} className="placeholder-current font-body w-full block bg-transparent" autoFocus />
                    <button className="py-2 ml-4" aria-label={t('closeSearch')} onClick={() => setSearchOpen(false)} type="button">
                      <span className="inline-block w-5 h-5 align-middle">
                        <svg aria-hidden="true" focusable="false" className="icon fill-current icon-close" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M18.364 4.222l1.414 1.414L13.414 12l6.364 6.364-1.414 1.414L12 13.414l-6.364 6.364-1.414-1.414L10.586 12 4.222 5.636l1.414-1.414L12 10.586z" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
