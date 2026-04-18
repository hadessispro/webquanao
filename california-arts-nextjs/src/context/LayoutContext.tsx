'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface LayoutContextType {
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <LayoutContext.Provider value={{ isCartOpen, setIsCartOpen, isMobileMenuOpen, setIsMobileMenuOpen }}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}
