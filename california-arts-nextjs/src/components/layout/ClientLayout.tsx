'use client'

import React from 'react'
import { CartProvider } from '@/components/cart/CartProvider'
import { LayoutProvider } from '@/context/LayoutContext'
import CartDrawer from '@/components/cart/CartDrawer'
import MobileMenuDrawer from '@/components/layout/MobileMenuDrawer'
import SearchDrawer from '@/components/layout/SearchDrawer'

interface ClientLayoutProps {
  children: React.ReactNode
  headerData?: any
}

export default function ClientLayout({ children, headerData }: ClientLayoutProps) {
  return (
    <LayoutProvider>
      <CartProvider>
        {children}
        <CartDrawer />
        <MobileMenuDrawer data={headerData} />
        <SearchDrawer />
      </CartProvider>
    </LayoutProvider>
  )
}
