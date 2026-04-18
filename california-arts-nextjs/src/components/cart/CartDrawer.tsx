'use client'

import React from 'react'
import { useLayout } from '@/context/LayoutContext'

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen } = useLayout()

  if (!isCartOpen) return null

  return (
    <>
      <div className="drawer-overlay anim-fade" onClick={() => setIsCartOpen(false)} />
      <div className="drawer-panel anim-slide-r">
        <div style={{ padding: '50px 20px 20px 20px', height: '100%', overflow: 'auto' }}>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ position: 'absolute', right: '15px', top: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span className="inline-block w-5 h-5 align-middle">
              <svg aria-hidden="true" focusable="false" className="icon fill-current icon-close" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M18.364 4.222l1.414 1.414L13.414 12l6.364 6.364-1.414 1.414L12 13.414l-6.364 6.364-1.414-1.414L10.586 12 4.222 5.636l1.414-1.414L12 10.586z" />
              </svg>
            </span>
          </button>

          <div style={{ textAlign: 'center', paddingTop: '40px' }}>
            <p>Your cart is empty</p>
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => setIsCartOpen(false)}
                className="button"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
