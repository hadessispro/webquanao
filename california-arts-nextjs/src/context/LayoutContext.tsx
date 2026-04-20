'use client'

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import {
  LOCALE_STORAGE_KEY,
  Locale,
  TranslationKey,
  readStoredLocale,
  translate,
} from '@/lib/i18n'

export interface CartLineItem {
  id: string
  productId: number
  handle: string
  title: string
  image?: string
  variantId?: number
  variantTitle?: string
  color?: string
  size?: string
  sku?: string
  price: number
  compareAtPrice?: number | null
  quantity: number
}

export type AddCartLineItem = Omit<CartLineItem, 'id' | 'quantity'> & {
  quantity?: number
}

interface LayoutContextType {
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
  cartItems: CartLineItem[]
  cartCount: number
  cartSubtotal: number
  addCartItem: (item: AddCartLineItem) => void
  updateCartQuantity: (id: string, quantity: number) => void
  removeCartItem: (id: string) => void
  clearCart: () => void
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: (key: TranslationKey) => string
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)
const CART_STORAGE_KEY = 'california_arts_cart'

function readStoredCartItems(): CartLineItem[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw) as CartLineItem[]
    return Array.isArray(parsed) ? parsed.filter((item) => item.id && item.quantity > 0) : []
  } catch {
    return []
  }
}

function makeCartLineId(item: Pick<CartLineItem, 'productId' | 'variantId' | 'color' | 'size'>) {
  return [
    item.productId,
    item.variantId || 'default',
    item.color || 'color',
    item.size || 'size',
  ].join(':')
}

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [hasHydrated, setHasHydrated] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartLineItem[]>([])
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCartItems(readStoredCartItems())
      setLocale(readStoredLocale())
      setHasHydrated(true)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!hasHydrated) return
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems, hasHydrated])

  useEffect(() => {
    if (!hasHydrated) return
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale, hasHydrated])

  const cartCount = useMemo(
    () => cartItems.reduce((count, item) => count + item.quantity, 0),
    [cartItems],
  )

  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  )

  const addCartItem = (item: AddCartLineItem) => {
    const id = makeCartLineId(item)
    const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1

    setCartItems((current) => {
      const existing = current.find((line) => line.id === id)
      if (existing) {
        return current.map((line) =>
          line.id === id ? { ...line, quantity: line.quantity + quantity } : line,
        )
      }

      return [...current, { ...item, id, quantity }]
    })
  }

  const updateCartQuantity = (id: string, quantity: number) => {
    setCartItems((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const removeCartItem = (id: string) => {
    setCartItems((current) => current.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const toggleLocale = () => {
    setLocale((currentLocale) => (currentLocale === 'en' ? 'vi' : 'en'))
  }

  const t = (key: TranslationKey) => translate(locale, key)

  return (
    <LayoutContext.Provider
      value={{
        isCartOpen,
        setIsCartOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        cartItems,
        cartCount,
        cartSubtotal,
        addCartItem,
        updateCartQuantity,
        removeCartItem,
        clearCart,
        locale,
        setLocale,
        toggleLocale,
        t,
      }}
    >
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
