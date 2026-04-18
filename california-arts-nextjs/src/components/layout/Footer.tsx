'use client'

import React from 'react'
import Link from 'next/link'

export default function Footer() {
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })

  return (
    <div id="shopify-section-footer" className="shopify-section">
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --color-footer-accent: var(--color-secondary-accent);
          --color-footer-text: var(--color-secondary-text);
          --color-footer-background: var(--color-secondary-background);
          --color-footer-background-hex: var(--color-secondary-background-hex);
          --color-footer-meta: var(--color-secondary-meta);
        }
      `}} />

      {/* Mobile Logo */}
      <div className="c_footer-logo c_footer-logo-mbl">
        <img src="//california-arts.com/cdn/shop/files/Mobile_new_Svg.svg?v=1734022795" alt="" />
      </div>

      <footer className="bg-footer-background text-footer-text" data-section-type="footer">
        
        {/* Desktop Logo */}
        <div className="c_footer-logo c_footer-logo-dsktp">
          <img src="//california-arts.com/cdn/shop/files/New_Svg_Logo_3_1.svg?v=1743668488" alt="" />
        </div>

        <div className="border-t-grid border-grid-color">
          <div className="c_footer-container">
            <div className="c_footer-wrapper">
              <div className="c_footer-menu">
                <div className="c_footer-flex grid lg:grid-cols-12 bg-border">
                  
                  {/* Company */}
                  <div className="c_footer-column section-x-padding py-theme bg-footer-background text-footer-text">
                    <div className="text-left">
                      <h2 className="font-heading text-base mb-4">Company</h2>
                      <ul className="list-none space-y-1">
                        <li><Link href="/pages/our-story" className="hover:text-footer-accent">About</Link></li>
                        <li><Link href="/pages/campaign" className="hover:text-footer-accent">Campaign</Link></li>
                        <li><Link href="/collections/shop-all" className="hover:text-footer-accent">Shop All</Link></li>
                      </ul>
                    </div>
                  </div>

                  {/* Community */}
                  <div className="c_footer-column section-x-padding py-theme bg-footer-background text-footer-text">
                    <div className="text-left">
                      <h2 className="font-heading text-base mb-4">Community</h2>
                      <ul className="list-none space-y-1">
                        <li><a href="https://www.instagram.com/california.arts/" className="hover:text-footer-accent">Instagram</a></li>
                        <li><a href="https://www.tiktok.com/@california.arts" className="hover:text-footer-accent">Tik Tok</a></li>
                      </ul>
                    </div>
                  </div>

                  {/* Client Services */}
                  <div className="c_footer-column section-x-padding py-theme bg-footer-background text-footer-text">
                    <div className="text-left">
                      <h2 className="font-heading text-base mb-4">Client Services</h2>
                      <ul className="list-none space-y-1">
                        <li><Link href="/pages/returns-exchanges" className="hover:text-footer-accent">Shipping</Link></li>
                        <li><Link href="/pages/returns-exchanges" className="hover:text-footer-accent">Returns</Link></li>
                        <li><Link href="/pages/about" className="hover:text-footer-accent">Contact</Link></li>
                        <li><Link href="/products/giftcard" className="hover:text-footer-accent">Gift Card</Link></li>
                      </ul>
                    </div>
                  </div>

                  {/* Legal */}
                  <div className="c_footer-column section-x-padding py-theme bg-footer-background text-footer-text">
                    <div className="text-left">
                      <h2 className="font-heading text-base mb-4">Legal</h2>
                      <ul className="list-none space-y-1">
                        <li><Link href="/pages/privacy-policy" className="hover:text-footer-accent">Privacy Policy</Link></li>
                        <li><Link href="/pages/about" className="hover:text-footer-accent">Accessibility</Link></li>
                      </ul>
                    </div>
                  </div>

                </div>
              </div>

              {/* Newsletter */}
              <div className="c_footer-newsletter">
                <section className="ca_footer-newsletter py-theme border-t-grid border-primary-text bg-footer-background text-footer-text">
                  <div className="px-8 py-10">
                    <div className="c_footer-text">
                      <p><strong>Subscribe to West Coast Living<br /></strong>Stay connected for product launches, restocks and events from Southern California.</p>
                    </div>
                    <div className="mt-4">
                      <form style={{ display: 'flex', borderRadius: '60px', border: '1px solid currentColor', overflow: 'hidden' }}>
                        <input
                          type="email"
                          placeholder="Email"
                          aria-label="Email"
                          style={{
                            flex: 1,
                            padding: '8px 16px',
                            background: 'transparent',
                            border: 'none',
                            color: 'inherit',
                            fontFamily: 'inherit',
                            fontSize: '11px',
                            outline: 'none',
                          }}
                        />
                        <button
                          type="button"
                          style={{
                            padding: '8px 20px',
                            background: 'transparent',
                            border: 'none',
                            color: 'inherit',
                            fontSize: '10px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Subscribe
                        </button>
                      </form>
                    </div>
                    <div className="c_footer-text" style={{ marginTop: '10px' }}>
                      <p>By subscribing, you agree to the <Link href="/pages/privacy-policy" style={{ textDecoration: 'underline' }}>privacy policy</Link></p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="c_footer-date">
        <div className="c_footer-container">
          <p>California Arts ® 2024, Southern California</p>
          <p>{dateStr}. {timeStr}</p>
        </div>
      </div>
    </div>
  )
}
