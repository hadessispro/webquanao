'use client'

import React from 'react'
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
  return (
    <LayoutProvider>
      {children}
      <SmoothScroll />
      <BrandLoader />
      <NewsletterPopup settings={newsletterPopup} />
      <CartDrawer />
      <MobileMenuDrawer footer={footer} navigation={header.navigation} />
    </LayoutProvider>
  )
}
