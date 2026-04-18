'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useLayout } from '@/context/LayoutContext'

interface MobileMenuDrawerProps {
  data: any // Payload Header data
}

export default function MobileMenuDrawer({ data }: MobileMenuDrawerProps) {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useLayout()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  if (!isMobileMenuOpen) return null

  const navigation = data?.navigation || []

  const toggleAccordion = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="fixed inset-0 z-[110] flex lg:hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-[300px] bg-primary-background h-screen shadow-2xl flex flex-col animate-slide-in-left">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-grid-color/10">
          <span className="uppercase tracking-widest text-[10px] font-heading opacity-40 font-bold">Menu</span>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:opacity-60 transition-opacity"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        {/* Dynamic Navigation */}
        <nav className="flex-grow overflow-y-auto p-6 scrollbar-hide">
          <ul className="space-y-6">
            {navigation.map((item: any, idx: number) => (
              <li key={idx}>
                {item.megaMenu?.enabled ? (
                  <div>
                    <button 
                      onClick={() => toggleAccordion(item.label)}
                      className="flex items-center justify-between w-full text-left font-heading text-xs uppercase tracking-[0.2em] font-bold py-2"
                    >
                      <span>{String(idx + 1).padStart(2, '0')} {item.label}</span>
                      <svg 
                        className={`w-3 h-3 transition-transform duration-300 ${expandedItems.includes(item.label) ? 'rotate-180' : ''}`} 
                        viewBox="0 0 24 24"
                      >
                        <path d="M7 10l5 5 5-5H7z" />
                      </svg>
                    </button>
                    {expandedItems.includes(item.label) && (
                      <ul className="mt-4 pl-4 space-y-4 animate-fade-in border-l border-grid-color/5">
                        {item.megaMenu.categories?.map((cat: any, cIdx: number) => (
                          <li key={cIdx}>
                            <Link 
                              href={cat.url}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="text-[12px] opacity-60 hover:opacity-100 transition-opacity"
                            >
                              {cat.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link 
                    href={item.url}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block font-heading text-xs uppercase tracking-[0.2em] font-bold py-2"
                  >
                    {String(idx + 1).padStart(2, '0')} {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Static Footer */}
        <div className="p-6 border-t border-grid-color/10 space-y-6 bg-tertiary-background/20">
          <div className="space-y-4">
            <Link href="/account" className="block text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 font-bold">Account</Link>
            <Link href="/pages/contact" className="block text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 font-bold">Help & Contact</Link>
          </div>
          
          <div className="flex space-x-6 opacity-40">
            <span className="text-[9px] tracking-[0.2em] uppercase font-bold">Instagram</span>
            <span className="text-[9px] tracking-[0.2em] uppercase font-bold">TikTok</span>
          </div>
        </div>
      </div>
    </div>
  )
}
