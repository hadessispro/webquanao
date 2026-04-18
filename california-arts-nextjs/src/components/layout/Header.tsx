'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useLayout } from '@/context/LayoutContext'

export default function Header() {
  const { setIsCartOpen, setIsMobileMenuOpen } = useLayout()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div id="shopify-section-header" className="shopify-section section-header" style={{ position: 'sticky', top: 0, zIndex: 30 }}>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --color-header-accent: var(--color-primary-accent);
          --color-header-text: var(--color-primary-text);
          --color-header-background: var(--color-primary-background);
          --color-header-background-hex: var(--color-primary-background-hex);
          --color-header-background-0: var(--color-primary-background-0);
          --color-header-meta: var(--color-primary-meta);
          --sticky-header-height: 66px;
        }
        .logo-image { display: block; max-width: 120px; }
      `}} />

      <section data-section-type="header" data-sticky="true">
        <header className="bg-header-background text-header-text border-b-grid relative z-10 border-theme-color">
          
          {/* DESKTOP NAV */}
          <nav className="relative hidden lg:block" aria-label="Primary">
            <div className="c_header-main section-x-padding flex items-center justify-between flex-wrap py-1 text-sm">
              
              {/* Logo */}
              <div className="c_header-logo">
                <div className="flex items-center">
                  <div>
                    <h1>
                      <Link href="/" className="inline-block logo-image break-all">
                        <img
                          src="//california-arts.com/cdn/shop/files/Asset_9_4x_614e882d-af68-488c-a539-fd6f96b13db1_120x.png?v=1719078598"
                          srcSet="//california-arts.com/cdn/shop/files/Asset_9_4x_614e882d-af68-488c-a539-fd6f96b13db1_120x.png?v=1719078598 1x, //california-arts.com/cdn/shop/files/Asset_9_4x_614e882d-af68-488c-a539-fd6f96b13db1_120x@2x.png?v=1719078598 2x"
                          alt="California Arts"
                        />
                      </Link>
                    </h1>
                  </div>
                </div>
              </div>

              {/* Menu */}
              <div className="c_header-menu">
                <ul className="c_header-menu-ul flex flex-wrap">
                  
                  {/* Shop All - with mega menu */}
                  <li className="ca_menu-1st-c">
                    <div className="no-js-focus-wrapper">
                      <button className="ca_menu-1st-button inline-block flex items-center">
                        <span className="inline-block pr-1">01 Shop All</span>
                        <span className="inline-block align-middle svg-scale mr-1 transform origin-center rotate transition">
                          <svg aria-hidden="true" focusable="false" role="presentation" className="icon fill-current" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 16.596L4.222 8.818l1.414-1.414L12 13.768l6.364-6.364 1.414 1.414z" />
                          </svg>
                        </span>
                      </button>

                      {/* Mega Menu */}
                      <div className="c_megamenu-upper absolute left-0 bottom-0 w-full transform translate-y-full z-20 bg-header-background text-header-text border-t-grid border-b-grid border-grid-color">
                        <div className="c_megamenu-main section-x-padding text-center">
                          <div className="c_megamenu-inner c_megamenu-inner-2 flex py-2 justify-center -ml-16">
                            <div className="c_megamenu-inner-menu">
                              <div className="c_megamenu-inner-a ml-16">
                                <h2 className="c_megamenu-second font-heading mb-2">
                                  <Link className="inline-block py-1" href="/collections/coats-jackets">Shop by Category</Link>
                                </h2>
                                <ul className="c_megamenu-third-ul">
                                  {[
                                    { label: 'View All', href: '/collections/coats-jackets' },
                                    { label: 'Outerwear', href: '/collections/coats-jackets' },
                                    { label: 'Tailoring', href: '/collections/category-tailoring' },
                                    { label: 'Knitwear', href: '/collections/knitwear' },
                                    { label: 'Sweatshirts & Sweatpants', href: '/collections/collection-sweater' },
                                    { label: 'Shirts', href: '/collections/shirts-all-navigation' },
                                    { label: 'Polos', href: '/collections/category-polos' },
                                    { label: 'Tees & Henleys', href: '/collections/collection-t-shirts-tanks' },
                                    { label: 'Tanks & Vests', href: '/collections/category-vests' },
                                    { label: 'Pants & Shorts', href: '/collections/trousers-shorts' },
                                    { label: 'Denim', href: '/collections/category-nav-denim' },
                                    { label: 'Accessories', href: '/collections/accessories' },
                                    { label: 'Gift Card', href: '/products/giftcard' },
                                  ].map((item, i) => (
                                    <li key={i}>
                                      <Link className="inline-block py-1" href={item.href}>{item.label}</Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="c_megamenu-inner-a ml-16">
                                <h2 className="c_megamenu-second font-heading mb-2">
                                  <Link className="inline-block py-1" href="/pages/campaign">In Focus</Link>
                                </h2>
                                <ul className="c_megamenu-third-ul">
                                  <li><Link className="inline-block py-1" href="/pages/new-arrivals">New Arrivals</Link></li>
                                  <li><Link className="inline-block py-1" href="/pages/campaign">Campaign</Link></li>
                                </ul>
                              </div>
                            </div>

                            <div className="c_megamenu-inner-image">
                              <div className="c_megamenu-inner-a c_megamenu-inner-images ml-16">
                                <div className="c_megamenu-image">
                                  <Link href="/collections/category-tailoring">
                                    <img src="//california-arts.com/cdn/shop/files/Asset_352_3x_dbdd82e6-4465-4e61-9689-c70fca184266.png?v=1762811468" alt="" />
                                  </Link>
                                </div>
                                <div className="c_megamenu-content">
                                  <h2><Link href="/collections/category-tailoring">Tailoring</Link></h2>
                                </div>
                              </div>
                              <div className="c_megamenu-inner-a c_megamenu-inner-images ml-16">
                                <div className="c_megamenu-image">
                                  <Link href="/collections/accessories">
                                    <img src="//california-arts.com/cdn/shop/files/Asset_351_3x_31d33670-8ce1-43c9-816d-182528667610.png?v=1762810489" alt="" />
                                  </Link>
                                </div>
                                <div className="c_megamenu-content">
                                  <h2><Link href="/collections/accessories">Accessories</Link></h2>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="c_megamenu-inner-after"></div>
                        </div>
                      </div>
                    </div>
                  </li>

                  {/* About the Brand */}
                  <li className="ca_menu-1st-c">
                    <Link className="ca_menu-1st-button inline-block pt-2 relative" href="/pages/our-story">
                      02 About the Brand
                    </Link>
                  </li>

                  {/* Creative Campaign */}
                  <li className="ca_menu-1st-c">
                    <Link className="ca_menu-1st-button inline-block pt-2 relative" href="/pages/campaign">
                      03 Creative Campaign
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Icons */}
              <div className="c_header-icons">
                <ul className="c_header-icons-ul">
                  <li>
                    <button type="button" className="localization__list--button">
                      Vietnam | VND ₫
                    </button>
                  </li>
                  <li>
                    <div className="whitespace-nowrap">
                      <button
                        onClick={() => setSearchOpen(!searchOpen)}
                        className="inline-block pt-2"
                      >
                        Search
                      </button>
                      {searchOpen && (
                        <div className="search-overlay anim-fade" onClick={(e) => e.stopPropagation()}>
                          <div className="section-x-padding">
                            <form action="/search" method="get" className="input-group search" role="search">
                              <label htmlFor="search-desktop" className="hidden">Submit</label>
                              <div className="flex items-center justify-between">
                                <button className="py-2 mr-4" aria-label="Submit" type="submit">
                                  <span className="inline-block w-5 h-5 align-middle">
                                    <svg aria-hidden="true" focusable="false" role="presentation" className="icon fill-current icon-search" viewBox="0 0 24 24">
                                      <path fillRule="evenodd" d="M10.533 17.438a6.968 6.968 0 01-6.96-6.96 6.968 6.968 0 016.96-6.96 6.968 6.968 0 016.96 6.96 6.968 6.968 0 01-6.96 6.96zm6.949-1.314a8.917 8.917 0 002.01-5.646c0-4.941-4.02-8.96-8.96-8.96-4.94 0-8.96 4.019-8.96 8.96 0 4.94 4.02 8.96 8.96 8.96 2.082 0 3.996-.72 5.52-1.916l4.962 4.96 1.415-1.413-4.947-4.945z" />
                                    </svg>
                                  </span>
                                </button>
                                <input
                                  id="search-desktop"
                                  type="text"
                                  name="q"
                                  placeholder="Search"
                                  className="placeholder-current font-body w-full block bg-transparent"
                                  aria-label="Search"
                                  autoFocus
                                />
                                <button className="py-2 ml-4" onClick={() => setSearchOpen(false)} type="button">
                                  <span className="inline-block w-5 h-5 align-middle">
                                    <svg aria-hidden="true" focusable="false" role="presentation" className="icon fill-current icon-close" viewBox="0 0 24 24">
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
                  </li>
                  <li>
                    <div className="flex items-center justify-end text-right">
                      <div className="c_header-cartCount whitespace-nowrap">
                        <button onClick={() => setIsCartOpen(true)} className="inline-block pt-2">
                          <span className="c_header-cartText">Cart</span>{' '}
                          <span className="c_header-cartCounter"><span>0</span></span>
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          {/* MOBILE NAV */}
          <div className="lg:hidden">
            <div className="lg:relative section-x-padding flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="mr-4">
                  <h1>
                    <Link href="/" className="inline-block logo-image break-all">
                      <img
                        src="//california-arts.com/cdn/shop/files/Asset_9_4x_614e882d-af68-488c-a539-fd6f96b13db1_120x.png?v=1719078598"
                        srcSet="//california-arts.com/cdn/shop/files/Asset_9_4x_614e882d-af68-488c-a539-fd6f96b13db1_120x.png?v=1719078598 1x, //california-arts.com/cdn/shop/files/Asset_9_4x_614e882d-af68-488c-a539-fd6f96b13db1_120x@2x.png?v=1719078598 2x"
                        alt="California Arts"
                      />
                    </Link>
                  </h1>
                </div>
              </div>

              <div className="ca_header-icons flex items-center justify-end text-right">
                <div className="ca_header-icons__search whitespace-nowrap ml-4">
                  <button onClick={() => setSearchOpen(!searchOpen)} className="inline-block pt-2">Search</button>
                  {searchOpen && (
                    <div className="search-overlay anim-fade">
                      <div className="section-x-padding">
                        <form action="/search" method="get" className="input-group search" role="search">
                          <div className="flex items-center justify-between">
                            <button className="py-2 mr-4" aria-label="Submit" type="submit">
                              <span className="inline-block w-5 h-5 align-middle">
                                <svg aria-hidden="true" focusable="false" className="icon fill-current icon-search" viewBox="0 0 24 24">
                                  <path fillRule="evenodd" d="M10.533 17.438a6.968 6.968 0 01-6.96-6.96 6.968 6.968 0 016.96-6.96 6.968 6.968 0 016.96 6.96 6.968 6.968 0 01-6.96 6.96zm6.949-1.314a8.917 8.917 0 002.01-5.646c0-4.941-4.02-8.96-8.96-8.96-4.94 0-8.96 4.019-8.96 8.96 0 4.94 4.02 8.96 8.96 8.96 2.082 0 3.996-.72 5.52-1.916l4.962 4.96 1.415-1.413-4.947-4.945z" />
                                </svg>
                              </span>
                            </button>
                            <input type="text" name="q" placeholder="Search" className="placeholder-current font-body w-full block bg-transparent" autoFocus />
                            <button className="py-2 ml-4" onClick={() => setSearchOpen(false)} type="button">
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

                <div className="c_header-cartCount ml-4 whitespace-nowrap">
                  <button onClick={() => setIsCartOpen(true)} className="inline-block pt-2">
                    <span className="c_header-cartText">Cart</span>{' '}
                    <span className="c_header-cartCounter"><span>0</span></span>
                  </button>
                </div>

                <button
                  className="inline-block pt-2 ml-4"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <span className="inline-block w-5 h-5 align-middle">
                    <svg aria-hidden="true" focusable="false" className="icon fill-current icon-menu" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M23 18v2H1v-2h22zm0-7v2H1v-2h22zm0-7v2H1V4h22z" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>
      </section>
    </div>
  )
}
