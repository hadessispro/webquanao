'use client'

import React, { FormEvent, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLayout } from '@/context/LayoutContext'
import { BrandCurrencyText, BrandPrice } from '@/components/ui/BrandCurrency'
import { HeaderData, HeaderMegaMenu, HeaderNavItem } from '@/lib/storefront-types'
import type { Locale } from '@/lib/i18n'
import { PRODUCT_MENU_GROUPS } from '@/lib/product-menu'

interface HeaderProps {
  header: HeaderData
}

const BRAND_LOGO_SRC = '/media/dien-logo-header.png'

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

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="header-search-icon"
      focusable="false"
      height="20"
      role="presentation"
      viewBox="0 0 24 24"
      width="20"
    >
      <path
        d="M10.5 3.5a7 7 0 1 0 4.43 12.42l4.82 4.82 1.06-1.06-4.82-4.82A7 7 0 0 0 10.5 3.5Zm0 1.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z"
        fill="currentColor"
      />
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

function localizedText(locale: Locale, text?: string, textVi?: string) {
  return locale === 'vi' && textVi ? textVi : text
}

function topNavLabel(item: HeaderNavItem, locale: Locale) {
  if (item.href === '/collections/shop-all') return locale === 'vi' ? 'sản phẩm' : 'products'
  if (item.href === '/pages/our-story') return locale === 'vi' ? 'về điển' : 'about điển'
  if (item.href === '/pages/campaign') return locale === 'vi' ? 'chiến dịch' : 'campaign'

  return localizedText(locale, item.label, item.labelVi) || item.label
}

type SearchResult = {
  handle: string
  href: string
  image?: string
  price?: string
  title: string
}

function ProductMegaMenu({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div
      className="c_megamenu-upper dien-product-menu absolute left-0 bottom-0 w-full transform translate-y-full z-20 bg-header-background text-header-text"
    >
      <div className="dien-product-menu__inner section-x-padding">
        <div className="dien-product-menu__tabs">
          <span className="dien-product-menu__tab dien-product-menu__tab--active">sản phẩm</span>
          <SmartLink className="dien-product-menu__tab" href="/pages/our-story" onClick={onNavigate}>
            về điển
          </SmartLink>
        </div>

        <div className="dien-product-menu__groups">
          {PRODUCT_MENU_GROUPS.map((group) => (
            <div className="dien-product-menu__group" key={group.title}>
              {group.href ? (
                <SmartLink className="dien-product-menu__heading dien-product-menu__heading--link" href={group.href} onClick={onNavigate}>
                  {group.title}
                </SmartLink>
              ) : (
                <h2 className="dien-product-menu__heading">{group.title}</h2>
              )}

              {group.items && group.items.length > 0 && (
                <ul className="dien-product-menu__list">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      {item.href ? (
                        <SmartLink className="dien-product-menu__link" href={item.href} onClick={onNavigate}>
                          {item.label}
                        </SmartLink>
                      ) : (
                        <span className="dien-product-menu__link dien-product-menu__link--disabled" aria-disabled="true">
                          {item.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
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

  if (fallbackHref === '/collections/shop-all') {
    return <ProductMegaMenu onNavigate={onNavigate} />
  }

  return (
    <div
      className="c_megamenu-upper absolute left-0 bottom-0 w-full transform translate-y-full z-20 bg-header-background text-header-text border-b-grid border-grid-color"
    >
      <div className="c_megamenu-main section-x-padding text-center">
        <div className="c_megamenu-inner c_megamenu-inner-2 flex py-2 justify-center">
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
  onLeave,
  onOpen,
}: {
  isOpen: boolean
  item: HeaderNavItem
  locale: Locale
  onClose: () => void
  onLeave: () => void
  onOpen: () => void
}) {
  const hasMegaMenu = Boolean(
    item.megaMenu?.enabled &&
      (item.href === '/collections/shop-all' ||
        item.megaMenu.columns.length > 0 ||
        item.megaMenu.imageCards.length > 0),
  )

  const handleBlurCapture = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      onClose()
    }
  }

  return (
    <li
      className={['ca_menu-1st-c', hasMegaMenu && isOpen ? 'ca_menu-1st-c--open' : ''].filter(Boolean).join(' ')}
      onMouseEnter={hasMegaMenu ? onOpen : undefined}
      onMouseLeave={hasMegaMenu ? onLeave : undefined}
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
  const { locale, setIsMobileMenuOpen, t } = useLayout()
  const pathname = usePathname()
  const desktopMenuRef = useRef<HTMLDivElement | null>(null)
  const megaMenuCloseTimerRef = useRef<number | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [nearFooter, setNearFooter] = useState(false)
  const [openMegaMenuHref, setOpenMegaMenuHref] = useState<string | null>(null)
  const logoAlt = header.logo?.alt || header.logoAlt || 'điển'
  const isHome = pathname === '/'
  const desktopNavigation = header.navigation
    .filter((item) => item.href !== '/pages/campaign')
    .slice(0, 2)
  const shippingText =
    locale === 'vi'
      ? 'miễn phí vận chuyển cho đơn hàng trên 950.000đ.'
      : 'complimentary shipping on orders over 950.000đ.'

  const cancelMegaMenuClose = () => {
    if (megaMenuCloseTimerRef.current !== null) {
      window.clearTimeout(megaMenuCloseTimerRef.current)
      megaMenuCloseTimerRef.current = null
    }
  }

  const closeMegaMenu = () => {
    cancelMegaMenuClose()
    setOpenMegaMenuHref(null)
  }

  const scheduleMegaMenuClose = () => {
    cancelMegaMenuClose()
    megaMenuCloseTimerRef.current = window.setTimeout(() => {
      setOpenMegaMenuHref(null)
      megaMenuCloseTimerRef.current = null
    }, 20)
  }

  const openMegaMenu = (href: string) => {
    cancelMegaMenuClose()
    setOpenMegaMenuHref(href)
  }

  useEffect(() => {
    setSearchOpen(false)
    setSearchQuery('')
    setSearchResults([])
    cancelMegaMenuClose()
    setOpenMegaMenuHref(null)
    setNearFooter(false)
    document.documentElement.classList.remove('site-footer-near')
  }, [pathname])

  useEffect(() => {
    if (!searchOpen) return undefined

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setSearchLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('search failed')
        const data = (await response.json()) as { results?: SearchResult[] }
        setSearchResults(Array.isArray(data.results) ? data.results : [])
      } catch (error) {
        if (!controller.signal.aborted) setSearchResults([])
      } finally {
        if (!controller.signal.aborted) setSearchLoading(false)
      }
    }, 140)

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [searchOpen, searchQuery])

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (searchResults[0]?.href) {
      window.location.href = searchResults[0].href
    }
  }

  useEffect(() => {
    let frameId = 0
    let settleFrameId = 0
    let settleTimerId = 0

    const updateHeaderState = () => {
      frameId = 0
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0
      setScrolled(scrollTop > 18)

      const headerEl = document.querySelector<HTMLElement>('.site-header-stack')
      const headerHeight = headerEl?.getBoundingClientRect().height || 90
      document.documentElement.style.setProperty('--header-stack-height', `${Math.round(headerHeight)}px`)

      const footer = document.getElementById('shopify-section-footer')
      if (!footer) {
        setNearFooter(false)
        document.documentElement.classList.remove('site-footer-near')
        return
      }

      const footerLogo = footer.querySelector<HTMLElement>('.dien-footer__logo')
      const footerLogoRect = footerLogo?.getBoundingClientRect()
      const isNearFooter = Boolean(
        scrollTop > 24 &&
          footerLogoRect &&
          footerLogoRect.top <= window.innerHeight - 8 &&
          footerLogoRect.bottom >= headerHeight + 8,
      )

      if (isNearFooter) {
        setSearchOpen(false)
        setOpenMegaMenuHref(null)
        setIsMobileMenuOpen(false)
      }

      setNearFooter(isNearFooter)
      document.documentElement.classList.toggle('site-footer-near', isNearFooter)
    }

    const queueUpdate = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(updateHeaderState)
    }

    updateHeaderState()
    settleFrameId = window.requestAnimationFrame(updateHeaderState)
    settleTimerId = window.setTimeout(updateHeaderState, 120)
    window.addEventListener('scroll', queueUpdate, { passive: true })
    document.addEventListener('scroll', queueUpdate, { capture: true, passive: true })
    window.addEventListener('resize', queueUpdate)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      if (settleFrameId) window.cancelAnimationFrame(settleFrameId)
      if (settleTimerId) window.clearTimeout(settleTimerId)
      window.removeEventListener('scroll', queueUpdate)
      document.removeEventListener('scroll', queueUpdate, true)
      window.removeEventListener('resize', queueUpdate)
      document.documentElement.style.removeProperty('--header-stack-height')
      document.documentElement.classList.remove('site-footer-near')
    }
  }, [pathname, setIsMobileMenuOpen])

  useEffect(() => {
    const footer = document.getElementById('shopify-section-footer')
    const footerLogo = footer?.querySelector<HTMLElement>('.dien-footer__logo')

    if (!footerLogo || typeof IntersectionObserver === 'undefined') {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const headerHeight =
          document.querySelector<HTMLElement>('.site-header-stack')?.getBoundingClientRect().height ||
          90
        const logoRect = entry.boundingClientRect
        const isNearFooter = Boolean(
          window.scrollY > 24 &&
            entry.isIntersecting &&
            logoRect.bottom >= headerHeight + 8,
        )

        if (isNearFooter) {
          setSearchOpen(false)
          closeMegaMenu()
          setIsMobileMenuOpen(false)
        }

        setNearFooter(isNearFooter)
        document.documentElement.classList.toggle('site-footer-near', isNearFooter)
      },
      { threshold: [0, 0.01] },
    )

    observer.observe(footerLogo)

    return () => observer.disconnect()
  }, [pathname, setIsMobileMenuOpen])

  useEffect(() => {
    if (!openMegaMenuHref) return undefined

    const closeIfOutsideMenu = (event: Event) => {
      if (!desktopMenuRef.current?.contains(event.target as Node)) {
        closeMegaMenu()
      }
    }

    const trackPointerAroundMenu = (event: PointerEvent) => {
      if (desktopMenuRef.current?.contains(event.target as Node)) {
        cancelMegaMenuClose()
        return
      }

      scheduleMegaMenuClose()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMegaMenu()
      }
    }

    window.addEventListener('pointerdown', closeIfOutsideMenu)
    window.addEventListener('pointermove', trackPointerAroundMenu, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('pointerdown', closeIfOutsideMenu)
      window.removeEventListener('pointermove', trackPointerAroundMenu)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [openMegaMenuHref])

  useEffect(
    () => () => {
      if (megaMenuCloseTimerRef.current !== null) {
        window.clearTimeout(megaMenuCloseTimerRef.current)
      }
    },
    [],
  )

  const headerStackClass = [
    'site-header-stack',
    isHome ? 'site-header-stack--home' : '',
    scrolled ? 'site-header-stack--scrolled' : '',
    nearFooter ? 'site-header-stack--footer-near' : '',
    openMegaMenuHref ? 'site-header-stack--menu-open' : '',
    searchOpen ? 'site-header-stack--search-open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={headerStackClass}>
      {header.shippingBar.enabled && (
        <div id="shopify-section-announcement-bar" className="shopify-section site-announcement">
          <div className="ge-free-shipping-container">
            <div className="ge-free-shipping-msg">
              {header.shippingBar.href ? (
                <SmartLink href={header.shippingBar.href} className="section-x-padding hover:text-primary-accent">
                  <BrandCurrencyText text={shippingText} />
                </SmartLink>
              ) : (
                <BrandCurrencyText text={shippingText} />
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
            <header className="bg-header-background text-header-text relative z-10">
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
                      <img src={BRAND_LOGO_SRC} alt={logoAlt} />
                    </SmartLink>
                  </h1>

                  <div
                    className="c_header-menu site-header__menu"
                    onMouseEnter={cancelMegaMenuClose}
                    onMouseLeave={scheduleMegaMenuClose}
                    ref={desktopMenuRef}
                  >
                    <ul
                      className="c_header-menu-ul flex flex-wrap"
                    >
                      {desktopNavigation.map((item) => (
                        <DesktopNavItem
                          isOpen={openMegaMenuHref === item.href}
                          item={{ ...item, label: topNavLabel(item, locale), labelVi: topNavLabel(item, 'vi') }}
                          key={`${item.label}-${item.href}`}
                          locale={locale}
                          onClose={closeMegaMenu}
                          onLeave={scheduleMegaMenuClose}
                          onOpen={() => openMegaMenu(item.href)}
                        />
                      ))}
                    </ul>
                  </div>

                  <div className="c_header-icons site-header__actions">
                    <ul className="c_header-icons-ul">
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
                      <img src={BRAND_LOGO_SRC} alt={logoAlt} />
                    </SmartLink>
                  </h1>

                  <div className="ca_header-icons site-header__mobile-actions">
                    <div className="ca_header-icons__search whitespace-nowrap">
                      <button
                        aria-label={t('openSearch')}
                        onClick={() => setSearchOpen((open) => !open)}
                        className="header-search-toggle header-search-toggle--icon"
                      >
                        <SearchIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </header>
          </section>

          {searchOpen && (
            <div className="search-overlay search-overlay--drawer anim-fade" onClick={() => setSearchOpen(false)}>
              <aside className="search-overlay__panel" onClick={(event) => event.stopPropagation()}>
                <div className="search-overlay__head">
                  <p>tìm kiếm</p>
                  <button aria-label={t('closeSearch')} className="search-overlay__close" onClick={() => setSearchOpen(false)} type="button">
                    <span />
                  </button>
                </div>

                <form className="search-overlay__form" onSubmit={submitSearch} role="search">
                  <input
                    autoFocus
                    className="search-overlay__input"
                    name="q"
                    onChange={(event) => setSearchQuery(event.currentTarget.value)}
                    placeholder="nhập tên sản phẩm hoặc từ khóa"
                    type="text"
                    value={searchQuery}
                  />
                  <button className="search-overlay__submit" type="submit">
                    tìm
                  </button>
                </form>

                <div className="search-overlay__results">
                  <p className="search-overlay__label">
                    {searchQuery ? 'kết quả gợi ý' : 'sản phẩm gợi ý'}
                  </p>
                  {searchLoading && <p className="search-overlay__empty">đang tìm...</p>}
                  {!searchLoading && searchResults.length === 0 && (
                    <p className="search-overlay__empty">chưa có sản phẩm phù hợp.</p>
                  )}
                  {!searchLoading &&
                    searchResults.map((product) => (
                      <SmartLink className="search-overlay__result" href={product.href} key={product.handle} onClick={() => setSearchOpen(false)}>
                        {product.image && <img alt={product.title} src={product.image} />}
                        <span>
                          <strong>{product.title}</strong>
                          {product.price && <BrandPrice amount={product.price} />}
                        </span>
                      </SmartLink>
                    ))}
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
