'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useLayout } from '@/context/LayoutContext'

export default function MobileMenuDrawer() {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useLayout()
  const [shopOpen, setShopOpen] = useState(false)

  if (!isMobileMenuOpen) return null

  const categories = [
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
  ]

  return (
    <>
      <div className="drawer-overlay anim-fade" onClick={() => setIsMobileMenuOpen(false)} />
      <div className="drawer-panel-left anim-slide-l">
        <div style={{ padding: '20px', height: '100%', overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <span className="inline-block w-5 h-5 align-middle">
                <svg aria-hidden="true" focusable="false" className="icon fill-current icon-close" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M18.364 4.222l1.414 1.414L13.414 12l6.364 6.364-1.414 1.414L12 13.414l-6.364 6.364-1.414-1.414L10.586 12 4.222 5.636l1.414-1.414L12 10.586z" />
                </svg>
              </span>
            </button>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '16px' }}>
              <button
                onClick={() => setShopOpen(!shopOpen)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit', fontSize: 'inherit' }}
              >
                <span>01 Shop All</span>
                <span className="inline-block align-middle svg-scale" style={{ transform: shopOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
                  <svg aria-hidden="true" focusable="false" className="icon fill-current" viewBox="0 0 24 24" style={{ width: '12px', height: '12px' }}>
                    <path fillRule="evenodd" d="M12 16.596L4.222 8.818l1.414-1.414L12 13.768l6.364-6.364 1.414 1.414z" />
                  </svg>
                </span>
              </button>
              {shopOpen && (
                <ul style={{ listStyle: 'none', padding: '10px 0 0 16px', margin: 0 }}>
                  {categories.map((cat, i) => (
                    <li key={i} style={{ marginBottom: '8px' }}>
                      <Link href={cat.href} onClick={() => setIsMobileMenuOpen(false)}>{cat.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li style={{ marginBottom: '16px' }}>
              <Link href="/pages/our-story" onClick={() => setIsMobileMenuOpen(false)}>02 About the Brand</Link>
            </li>
            <li style={{ marginBottom: '16px' }}>
              <Link href="/pages/campaign" onClick={() => setIsMobileMenuOpen(false)}>03 Creative Campaign</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
