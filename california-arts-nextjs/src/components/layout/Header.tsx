'use client'

import React, { FormEvent, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createPortal } from 'react-dom'
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
    <Link href={href} className={className} target={target} rel={rel} onClick={onClick} prefetch={false}>
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
  const customLabel = localizedText(locale, item.label, item.labelVi) || item.label
  if (customLabel) return customLabel

  if (item.href === '/collections/shop-all') return locale === 'vi' ? 'sản phẩm' : 'products'
  if (item.href === '/pages/our-story') return locale === 'vi' ? 'về điển' : 'about điển'
  if (item.href === '/pages/campaign') return locale === 'vi' ? 'chiến dịch' : 'campaign'

  return item.label
}

type SearchResult = {
  handle: string
  href: string
  image?: string
  price?: string
  title: string
}

function ProductMegaMenu({ onNavigate }: { onNavigate?: () => void }) {
  const flatMenuItems = PRODUCT_MENU_GROUPS.flatMap((group) => {
    if (group.items && group.items.length > 0) {
      return group.items.map((item) => ({
        label: item.label,
        href: item.href,
      }))
    }
    return [
      {
        label: group.title === 'xem tất cả' ? '→ ' + group.title : group.title,
        href: group.href,
      },
    ]
  })

  return (
    <div
      className="c_megamenu-upper dien-product-menu absolute left-0 bottom-0 w-full transform translate-y-full z-20 bg-header-background text-header-text"
    >
      <div className="dien-product-menu__inner section-x-padding">
        <div className="dien-product-menu__groups">
          <ul className="dien-product-menu__list">
            {flatMenuItems.map((item) => (
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
        </div>
        <p className="dien-product-menu__slogan">điển, you already know</p>
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

  return <ProductMegaMenu onNavigate={onNavigate} />
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
      onMouseEnter={hasMegaMenu ? onOpen : onClose}
      onMouseLeave={hasMegaMenu ? onLeave : undefined}
    >
      <div
        className={hasMegaMenu ? 'no-js-focus-wrapper' : undefined}
        onBlurCapture={hasMegaMenu ? handleBlurCapture : undefined}
        onFocusCapture={hasMegaMenu ? onOpen : onClose}
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

  const [openMegaMenuHref, setOpenMegaMenuHref] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isHome = pathname === '/'
  const justNavigatedHome = useRef(false)
  const previousPathname = useRef(pathname)

  const logoAlt = localizedText(locale, header.logoAlt, header.logoAlt) || 'điển'
  const shippingText = localizedText(locale, header.shippingBar.text, header.shippingBar.textVi) || ''
  const desktopNavigation = header.navigation

  const openMegaMenu = (href: string) => {
    if (megaMenuCloseTimerRef.current !== null) {
      window.clearTimeout(megaMenuCloseTimerRef.current)
      megaMenuCloseTimerRef.current = null
    }
    setOpenMegaMenuHref(href)
  }

  const closeMegaMenu = () => {
    if (megaMenuCloseTimerRef.current !== null) {
      window.clearTimeout(megaMenuCloseTimerRef.current)
      megaMenuCloseTimerRef.current = null
    }
    setOpenMegaMenuHref(null)
  }

  const scheduleMegaMenuClose = () => {
    if (megaMenuCloseTimerRef.current !== null) {
      window.clearTimeout(megaMenuCloseTimerRef.current)
    }

    megaMenuCloseTimerRef.current = window.setTimeout(() => {
      setOpenMegaMenuHref(null)
      megaMenuCloseTimerRef.current = null
    }, 180)
  }

  const cancelMegaMenuClose = () => {
    if (megaMenuCloseTimerRef.current !== null) {
      window.clearTimeout(megaMenuCloseTimerRef.current)
      megaMenuCloseTimerRef.current = null
    }
  }

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = searchQuery.trim()
    if (!query) return
    window.location.href = `/api/search?q=${encodeURIComponent(query)}`
  }

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      if (pathname === '/') {
        justNavigatedHome.current = true
      }
      previousPathname.current = pathname
    }
  }, [pathname])

  useEffect(() => {
    closeMegaMenu()
    setSearchOpen(false)

    if (pathname === '/') {
      setScrolled(false)
      justNavigatedHome.current = false
    }

    const timer = window.setTimeout(() => setScrolled(false), 0)

    return () => window.clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    let frameId = 0
    let settleFrameId = 0
    let settleTimerId = 0

    const updateHeaderState = () => {
      frameId = 0
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0

      if (justNavigatedHome.current) {
        if (scrollTop === 0) {
          justNavigatedHome.current = false
        }
        setScrolled(false)
      } else {
        setScrolled(scrollTop > 18)
      }

      const headerEl = document.querySelector<HTMLElement>('.site-header-stack')
      let headerHeight = headerEl?.getBoundingClientRect().height || 90
      if (scrollTop > 18 && !isHome) {
        headerHeight -= 30
      }
      document.documentElement.style.setProperty('--header-stack-height', `${Math.round(headerHeight)}px`)
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
    }
  }, [isHome])

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

  useEffect(() => {
    if (!searchOpen || !searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const controller = new AbortController()
    setSearchLoading(true)

    fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}&json=true`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setSearchResults(data.results || [])
        setSearchLoading(false)
      })
      .catch(() => {
        setSearchLoading(false)
      })

    return () => controller.abort()
  }, [searchOpen, searchQuery])

  const headerStackClass = [
    'site-header-stack',
    isHome ? 'site-header-stack--home' : '',
    scrolled ? 'site-header-stack--scrolled' : '',
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
                    <ul className="c_header-menu-ul flex flex-wrap">
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
                            onFocus={closeMegaMenu}
                            onMouseEnter={closeMegaMenu}
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

          {searchOpen && createPortal(
            <div className="search-overlay search-overlay--drawer anim-fade" onClick={() => setSearchOpen(false)}>
              <aside className="search-overlay__panel" onClick={(event) => event.stopPropagation()}>
                <div className="search-overlay__head">
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
            </div>,
            document.body,
          )}
        </div>
      </div>
    </div>
  )
}
