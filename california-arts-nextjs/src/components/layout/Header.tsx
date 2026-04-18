'use client'

import React from 'react'
import Link from 'next/link'
import { useLayout } from '@/context/LayoutContext'
import MegaMenu from './MegaMenu'

interface HeaderProps {
  data?: any
}

export default function Header({ data }: HeaderProps) {
  const { setIsCartOpen, setIsMobileMenuOpen, setIsSearchOpen } = useLayout()

  // Navigation data matching the original site's structure
  const navigation = data?.navigation || [
    { 
      label: 'Shop All', 
      url: '/collections/all',
      megaMenu: {
        enabled: true,
        categories: [
          { label: 'View All', url: '/collections/all' },
          { label: 'Outerwear', url: '/collections/outerwear' },
          { label: 'Tailoring', url: '/collections/tailoring' },
          { label: 'Knitwear', url: '/collections/knitwear' },
          { label: 'Sweatshirts & Sweatpants', url: '/collections/sweatshirts' },
          { label: 'Shirts', url: '/collections/shirts' },
          { label: 'Polos', url: '/collections/polos' },
          { label: 'Tees & Henleys', url: '/collections/tees' },
          { label: 'Tanks & Vests', url: '/collections/tanks' },
          { label: 'Pants & Shorts', url: '/collections/pants' },
          { label: 'Denim', url: '/collections/denim' },
          { label: 'Accessories', url: '/collections/accessories' },
          { label: 'Gift Card', url: '/products/gift-card' },
        ],
        images: [
          { 
            image: { url: 'https://california-arts.com/cdn/shop/files/Asset_352_3x_dbdd82e6-4465-4e61-9689-c70fca184266.png?v=1719078598' },
            caption: 'Tailoring',
            url: '/collections/tailoring'
          },
          { 
            image: { url: 'https://california-arts.com/cdn/shop/files/Asset_351_3x_31d33670-8ce1-43c9-816d-182528667610.png?v=1719078598' },
            caption: 'Accessories',
            url: '/collections/accessories'
          }
        ]
      }
    },
    { label: 'About the Brand', url: '/pages/our-story' },
    { label: 'Creative Campaign', url: '/pages/campaign' },
  ]

  const shippingBar = data?.shippingBar || { enabled: true, text: 'Complimentary shipping to Vietnam on all orders over ₫6,578,950.' }

  return (
    <div id="shopify-section-header" className="shopify-section section-header" data-sticky="true">
      {/* Shipping Bar */}
      {shippingBar.enabled && (
        <div className="shipping-bar bg-primary-background border-b border-grid text-center py-2 px-4 text-[11px] uppercase tracking-[0.2em] font-heading z-50 relative">
          {shippingBar.text}
        </div>
      )}

      <header className="bg-header-background text-header-text relative z-20">
        <div className="c_header-main grid grid-cols-12 section-x-padding py-1 text-sm lg:py-0 lg:text-base border-b border-grid items-center h-[66px] lg:h-[66px]">
          
          {/* Column 1: Logo (10% - col-span-1) */}
          <div className="c_header-logo col-span-4 lg:col-span-1 border-theme-color lg:border-r border-grid h-full flex items-center">
            <Link href="/" className="inline-block logo-image break-all">
              <img 
                src="https://california-arts.com/cdn/shop/files/Asset_9_4x_614e882d-af68-488c-a539-fd6f96b13db1_120x.png?v=1719078598" 
                className="w-[120px] h-auto"
                alt="California Arts"
              />
            </Link>
          </div>

          {/* Column 2: Navigation (65% - col-span-8) */}
          <nav className="c_header-menu col-span-1 lg:col-span-8 border-theme-color lg:border-r border-grid h-full hidden lg:block" aria-label="Primary">
            <ul className="c_header-menu-ul flex flex-wrap h-full items-center">
              {navigation.map((item: any, idx: number) => (
                <li key={idx} className="relative group h-full flex items-center">
                  {item.megaMenu?.enabled ? (
                    <>
                      <button className="ca_menu-1st-button h-full px-[15px] inline-block flex items-center transition hover:text-header-accent uppercase tracking-[0.1em] text-[11px] font-bold">
                        <span className="inline-block pr-1 leading-none">{String(idx + 1).padStart(2, '0')} {item.label}</span>
                        <span className="inline-block align-middle transform transition-transform duration-300 group-hover:rotate-180">
                          <svg aria-hidden="true" focusable="false" role="presentation" className="icon fill-current w-[8px]" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 16.596L4.222 8.818l1.414-1.414L12 13.768l6.364-6.364 1.414 1.414z" />
                          </svg>
                        </span>
                      </button>
                      <MegaMenu data={item.megaMenu} />
                    </>
                  ) : (
                    <Link 
                      href={item.url}
                      className="ca_menu-1st-button h-full px-[15px] inline-block flex items-center transition hover:text-header-accent uppercase tracking-[0.1em] text-[11px] font-bold"
                    >
                      {String(idx + 1).padStart(2, '0')} {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: Icons (25% - col-span-3) */}
          <div className="c_header-icons col-span-3 lg:col-span-3 h-full flex items-center justify-end">
            {/* Mobile Menu Toggle (Visible only on mobile inside this col) */}
            <div className="lg:hidden flex items-center justify-start w-full">
               <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20"><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path></svg>
              </button>
            </div>

            <ul className="c_header-icons-ul h-full flex items-center justify-end">
              <li className="hidden xl:block">
                <button className="localization__list--button transition flex items-center text-[10.4px] uppercase tracking-[0.1em] font-bold">
                  VN | VND ₫
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="transition text-[10.4px] uppercase tracking-[0.1em] font-bold"
                >
                  Search
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="inline-flex items-center text-[10.4px] uppercase tracking-[0.1em] font-bold"
                >
                  <span className="c_header-cartText">Bag</span>
                  <span className="c_header-cartCounter ml-1">
                    <span>0</span>
                  </span>
                </button>
              </li>
            </ul>
          </div>

        </div>
      </header>
    </div>
  )
}
