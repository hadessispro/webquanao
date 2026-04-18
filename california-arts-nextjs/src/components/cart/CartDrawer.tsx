'use client'

import React from 'react'
import { useCart } from '@/components/cart/CartProvider'
import { useLayout } from '@/context/LayoutContext'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'

export default function CartDrawer() {
  const { items, itemCount, subtotal, updateQuantity, removeItem } = useCart()
  const { isCartOpen, setIsCartOpen } = useLayout()

  if (!isCartOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-primary-background h-screen shadow-2xl flex flex-col animate-slide-in-right border-l border-grid">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-grid">
          <h2 className="font-heading text-xs uppercase tracking-[0.2em] font-bold">
            Shopping Bag <span className="opacity-40 ml-2">({itemCount})</span>
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:opacity-60 transition-opacity"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M18.364 4.222l1.414 1.414L13.414 12l6.364 6.364-1.414 1.414L12 13.414l-6.364 6.364-1.414-1.414L10.586 12 4.222 5.636l1.414-1.414L12 10.586z"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <p className="opacity-40 uppercase tracking-[0.2em] text-[10px] font-bold">Your bag is currently empty.</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="uppercase tracking-[0.2em] text-[10px] font-bold underline underline-offset-4 hover:opacity-60 transition-opacity"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-10">
              {items.map((item) => (
                <li key={item.id} className="flex gap-6 pb-10 border-b border-grid/10 last:border-0 last:pb-0">
                  <div className="w-24 h-32 bg-tertiary-background shrink-0 relative overflow-hidden border border-grid/10">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.productTitle} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest">{item.productTitle}</h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-40 hover:opacity-100 transition-opacity"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-[10px] opacity-40 uppercase tracking-[0.1em] font-medium">
                        {item.color && `Color: ${item.color}`} {item.size && ` | Size: ${item.size}`}
                      </p>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="flex items-center border border-grid rounded-full px-4 py-1">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 text-xs hover:opacity-40 transition-opacity"
                        >
                          —
                        </button>
                        <span className="px-4 text-[10px] font-bold tracking-widest">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-xs hover:opacity-40 transition-opacity"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-[11px] font-bold tracking-widest">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-8 border-t border-grid bg-tertiary-background/20">
            <div className="flex justify-between items-center mb-8">
              <span className="uppercase tracking-[0.2em] text-[10px] font-bold opacity-40">Subtotal</span>
              <span className="text-sm font-bold tracking-widest">{formatPrice(subtotal)}</span>
            </div>
            
            <button className="w-full bg-primary-text text-primary-background rounded-full py-4 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-primary-text/90 transition-all shadow-lg active:scale-[0.98]">
              Proceed to checkout
            </button>
            
            <p className="text-[9px] text-center mt-8 opacity-40 leading-relaxed uppercase tracking-[0.1em] font-medium">
              Shipping & taxes calculated at checkout.<br/>
              Free shipping on orders over ₫6,578,950.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
