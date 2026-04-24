'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { LayoutProvider } from '@/context/LayoutContext'
import CartDrawer from '@/components/cart/CartDrawer'
import MobileMenuDrawer from '@/components/layout/MobileMenuDrawer'
import SmoothScroll from '@/components/layout/SmoothScroll'
import BrandLoader from '@/components/layout/BrandLoader'
import NewsletterPopup from '@/components/layout/NewsletterPopup'
import { FooterData, HeaderData, NewsletterPopupData } from '@/lib/storefront-types'

interface ClientLayoutProps {
  children: React.ReactNode
  footer: FooterData
  header: HeaderData
  newsletterPopup: NewsletterPopupData
}

export default function ClientLayout({ children, footer, header, newsletterPopup }: ClientLayoutProps) {
  const pathname = usePathname()
  const isCheckout = pathname === '/checkout'

  return (
    <LayoutProvider>
      {children}
      <SmoothScroll />
      <BrandLoader />
      {!isCheckout && <NewsletterPopup settings={newsletterPopup} />}
      {!isCheckout && <CartDrawer />}
      {!isCheckout && <MobileMenuDrawer footer={footer} navigation={header.navigation} />}
    </LayoutProvider>
  )
}
