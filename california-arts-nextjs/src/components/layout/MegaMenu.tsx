'use client'

import React from 'react'
import Link from 'next/link'

interface MegaMenuProps {
  data: any
}

export default function MegaMenu({ data }: MegaMenuProps) {
  const categories = data?.categories || []
  const images = data?.images || []

  return (
    <div className="c_megamenu-upper no-js no-js-focus-container absolute top-full left-0 w-full transition-all duration-300">
      <div className="c_megamenu-main bg-primary-background lg:border-grid border-b border-grid">
        <div className="c_megamenu-inner-after"></div>
        <div className="c_megamenu-inner flex">
          
          {/* Menu Column (30% via CSS) */}
          <div className="c_megamenu-inner-menu">
            <div className="c_megamenu-inner-a">
              <h2 className="c_megamenu-second font-heading">
                <Link className="inline-block py-1 uppercase tracking-widest text-[11px] font-bold" href="/collections/all">Shop by Category</Link>
              </h2>
              <ul className="c_megamenu-third-ul">
                {categories.map((cat: any, idx: number) => (
                  <li key={idx} className="mb-px">
                    <Link className="inline-block py-1 text-[13px] hover:opacity-60 transition-opacity" href={cat.url}>
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="c_megamenu-inner-a">
              <h2 className="c_megamenu-second font-heading">
                <Link className="inline-block py-1 uppercase tracking-widest text-[11px] font-bold" href="/pages/campaign">In Focus</Link>
              </h2>
              <ul className="c_megamenu-third-ul">
                <li className="mb-px">
                  <Link className="inline-block py-1 text-[13px] hover:opacity-60 transition-opacity" href="/pages/new-arrivals">New Arrivals</Link>
                </li>
                <li className="mb-px">
                  <Link className="inline-block py-1 text-[13px] hover:opacity-60 transition-opacity" href="/pages/campaign">Campaign</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Image Columns (70% via CSS) */}
          <div className="c_megamenu-inner-image">
            {images.slice(0, 2).map((img: any, idx: number) => (
              <div key={idx} className="c_megamenu-inner-a c_megamenu-inner-images">
                <div className="c_megamenu-image group/img">
                  <Link href={img.url || '#'} className="block">
                    <img 
                      src={img.image?.url} 
                      alt={img.caption || ''} 
                      className="transition-transform duration-700 group-hover/img:scale-[1.03] w-full h-full object-cover"
                    />
                  </Link>
                </div>
                <div className="c_megamenu-content">
                  <h2 className="text-[10px] tracking-widest uppercase font-bold text-left">
                    <Link href={img.url || '#'}>{img.caption}</Link>
                  </h2>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
