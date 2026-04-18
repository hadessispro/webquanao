'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useLayout } from '@/context/LayoutContext'

export default function SearchDrawer() {
  const { isSearchOpen, setIsSearchOpen } = useLayout()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isSearchOpen])

  if (!isSearchOpen) return null

  return (
    <div className="absolute left-0 top-[66px] lg:top-[66px] w-full z-[40] bg-header-background text-header-text border-b border-grid py-2 section-x-padding animate-fade-in shadow-xl">
      <form action="/search" method="get" className="input-group search max-w-7xl mx-auto" role="search">
        <div className="flex items-center justify-between h-12">
          
          <button className="py-2 mr-4 opacity-60 hover:opacity-100 transition-opacity" aria-label="Submit" type="submit">
            <span className="inline-block w-5 h-5 align-middle">
              <svg aria-hidden="true" focusable="false" role="presentation" className="icon fill-current icon-search" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M10.533 17.438a6.968 6.968 0 01-6.96-6.96 6.968 6.968 0 016.96-6.96 6.968 6.968 0 016.96 6.96 6.968 6.968 0 01-6.96 6.96zm6.949-1.314a8.917 8.917 0 002.01-5.646c0-4.941-4.02-8.96-8.96-8.96-4.94 0-8.96 4.019-8.96 8.96 0 4.94 4.02 8.96 8.96 8.96 2.082 0 3.996-.72 5.52-1.916l4.962 4.96 1.415-1.413-4.947-4.945z"></path>
              </svg>
            </span>
            <span className="visually-hidden">Submit</span>
          </button>

          <input 
            ref={inputRef}
            id="search" 
            type="text" 
            name="q" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search our catalog" 
            className="placeholder-current font-body w-full block bg-transparent border-none focus:ring-0 outline-none uppercase tracking-widest text-[11px] font-bold" 
            aria-label="Search"
          />

          <button 
            className="py-2 ml-4 opacity-60 hover:opacity-100 transition-opacity" 
            onClick={() => setIsSearchOpen(false)} 
            type="button"
          >
            <span className="visually-hidden">Close</span>
            <span className="inline-block w-5 h-5 align-middle">
              <svg aria-hidden="true" focusable="false" role="presentation" className="icon fill-current icon-close" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M18.364 4.222l1.414 1.414L13.414 12l6.364 6.364-1.414 1.414L12 13.414l-6.364 6.364-1.414-1.414L10.586 12 4.222 5.636l1.414-1.414L12 10.586z"></path>
              </svg>
            </span>
          </button>

        </div>
      </form>
    </div>
  )
}
