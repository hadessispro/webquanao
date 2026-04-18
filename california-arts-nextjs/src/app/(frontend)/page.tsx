import React from 'react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      {/* SECTION 1: HERO */}
      <div className="shopify-section has-full-screen-setting">
        <section>
          <div className="bg-primary-background border-t-grid border-transparent relative overflow-hidden h-auto">
            <Link href="/collections/coats-jackets" style={{ display: 'block' }}>
              <div className="h-full w-full">
                <div>
                  {/* Desktop Image */}
                  <div className="hidden lg:block">
                    <div
                      className="responsive-image-wrapper relative overflow-hidden w-full"
                      style={{ height: 0, paddingTop: '65.15518913676043%', margin: '0 auto' }}
                    >
                      <img
                        className="responsive-image block absolute top-0 left-0 w-full h-full"
                        src="//california-arts.com/cdn/shop/files/Asset_361_2048x2048.png?v=1771951324"
                        alt=""
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                  {/* Mobile Image */}
                  <div className="lg:hidden">
                    <div
                      className="responsive-image-wrapper relative overflow-hidden w-full"
                      style={{ height: 0, paddingTop: '165.41143654114362%', margin: '0 auto' }}
                    >
                      <img
                        className="responsive-image block absolute top-0 left-0 w-full h-full"
                        src="//california-arts.com/cdn/shop/files/Asset_362_2x_8458a40b-c296-4d93-8319-8e0a16af599c_2048x2048.png?v=1771951287"
                        alt=""
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 left-0 right-0 bottom-0 z-10 section-x-padding py-theme">
                <div className="w-full h-full flex justify-center items-end text-center">
                  <div className="lg:w-1/3 text-secondary-text">
                    {/* Overlay content placeholder */}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </div>

      {/* SECTION 2: RICH TEXT + CTA */}
      <div className="shopify-section">
        <section className="bg-primary-background text-primary-text overflow-hidden border-t-grid border-transparent">
          <div className="px-8 lg:px-8 pb-4">
            <div className="flex text-sm default text-right justify-end">
              <div className="w-full lg:w-full">
                <div className="rte font-body break-words px-4">
                  <p>
                    <em><br /><br />California Minimalism<br /></em>
                    Accessible design by producing less &amp; building better.<br />
                    From the palm-fringed western edge of the American dream.
                  </p>
                </div>
                <div className="mt-4 text-0 px-4">
                  <Link
                    href="/collections/coats-jackets"
                    className="inline-flex justify-center items-center text-base px-8 py-2 rounded-full bg-transparent text-primary-text border-text border-primary-text hover:border-primary-accent hover:text-primary-accent"
                  >
                    <span>Shop All</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SECTION 3: SPACER */}
      <div className="shopify-section">
        <section className="bg-primary-background text-primary-text overflow-hidden border-t-grid border-transparent">
          <div className="px-8 lg:px-8 pb-4">
            <div className="flex text-2xl lg:text-5xl text-left justify-start">
              <div className="w-full lg:w-full">
                <div className="rte font-body break-words px-4">
                  <p><br /></p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SECTION 4: QUOTE */}
      <div className="shopify-section">
        <section className="bg-primary-background text-primary-text overflow-hidden border-t-grid border-transparent">
          <div className="px-8 lg:px-8 pb-4">
            <div className="flex text-sm default text-right justify-center">
              <div className="w-full lg:w-full">
                <div className="rte font-body break-words px-4">
                  <p>&ldquo;Good design is as little design as possible.&rdquo;</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
