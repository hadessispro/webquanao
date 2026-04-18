'use client'

import React from 'react'
import { LayoutProvider } from '@/context/LayoutContext'
import CartDrawer from '@/components/cart/CartDrawer'
import MobileMenuDrawer from '@/components/layout/MobileMenuDrawer'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <LayoutProvider>
      {children}
      <CartDrawer />
      <MobileMenuDrawer />
    </LayoutProvider>
  )
}
