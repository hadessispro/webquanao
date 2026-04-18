'use client'

import React from 'react'
import Link from 'next/link'

interface FooterProps {
  data?: any
}

export default function Footer({ data }: FooterProps) {
  const currentYear = new Date().getFullYear()
  
  const columns = data?.columns || [
    {
      title: 'Company',
      links: [
        { label: 'About', url: '/pages/our-story' },
        { label: 'Campaign', url: '/pages/campaign' },
        { label: 'Shop All', url: '/collections/all' },
      ]
    },
    {
      title: 'Community',
      links: [
        { label: 'Instagram', url: 'https://instagram.com/california.arts' },
        { label: 'Tik Tok', url: 'https://tiktok.com/@california.arts' },
      ]
    },
    {
      title: 'Client Services',
      links: [
        { label: 'Shipping', url: '/pages/returns' },
        { label: 'Returns', url: '/pages/returns' },
        { label: 'Contact', url: '/pages/contact' },
        { label: 'Gift Card', url: '/products/gift-card' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', url: '/pages/privacy-policy' },
        { label: 'Accessibility', url: '/pages/about' },
      ]
    }
  ]

  const copyright = data?.copyright || `California Arts ® ${currentYear}, Southern California`

  return (
    <div id="shopify-section-footer" className="shopify-section section-footer">
      <footer className="bg-secondary-background text-secondary-text relative z-10">
        
        {/* Big Logo Overlay Graphic (The Bridge) */}
        <div className="c_footer-logo relative w-full border-grid border-b">
          <div className="c_footer-logo-mbl flex lg:hidden justify-center bg-primary-background border-theme-color">
            <img 
              src="https://california-arts.com/cdn/shop/files/Mobile_new_Svg.svg?v=1734022795" 
              className="w-full h-auto"
              alt="California Arts" 
            />
          </div>
          <div className="c_footer-logo-dsktp hidden lg:flex absolute left-1/2 transform -translate-x-1/2 justify-center">
            <img 
              src="https://california-arts.com/cdn/shop/files/New_Svg_Logo_3_1.svg?v=1743668488" 
              alt="California Arts" 
            />
          </div>
        </div>

        {/* Footer Main Grid */}
        <div className="c_footer-main grid grid-cols-12 section-x-padding py-1 pr-1 border-theme-color">
          
          {columns.map((col: any, idx: number) => (
            <div key={idx} className="c_footer-column col-span-12 lg:col-span-3 border-theme-color pt-theme pb-theme lg:pt-double lg:pb-double">
              <div className="text-left">
                <h2 className="font-heading text-[11px] uppercase tracking-[0.2em] font-bold mb-8 opacity-40">{col.title}</h2>
                <ul className="list-none space-y-4">
                  {col.links?.map((link: any, lIdx: number) => (
                    <li key={lIdx}>
                      <Link href={link.url} className="text-[13px] hover:opacity-100 transition-opacity">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

        </div>

        {/* Newsletter & Copyright Bar */}
        <div className="c_footer-date bg-secondary-background">
          <div className="section-x-padding flex flex-col md:flex-row justify-between items-center py-5 border-t border-grid">
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold">{copyright}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

      </footer>
    </div>
  )
}
