import React from 'react'
import Link from 'next/link'

const demoProduct = {
  title: 'Demo Vegan Leather Trench',
  handle: 'demo-vegan-leather-trench',
  price: 9594000,
  color: 'Black',
}

export default function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  return (
    <>
      {/* View All Link */}
      <div className="border-bottom" style={{ padding: 'var(--spacing-sm) var(--spacing-section-h)' }}>
        <Link href="/collections/shop-all" style={{ fontSize: '0.875rem' }}>
          View All
        </Link>
      </div>

      {/* Product Philosophy */}
      <section style={{ padding: '3rem var(--spacing-section-h)' }}>
        <div style={{ maxWidth: '400px' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-accent)', marginBottom: '0.25rem' }}>
            Our Product Philosophy:
          </p>
          <p
            style={{
              fontFamily: 'var(--font-accent)',
              fontStyle: 'italic',
              fontSize: '0.875rem',
              marginBottom: '1rem',
            }}
          >
            &ldquo;Less and More.&rdquo;
          </p>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
            We re-imagine one garment at a time, combining intentional proportions with superior
            craftsmanship. We advocate for sustainability by producing less, building better &amp;
            simplifying the way we get dressed.
          </p>
        </div>
      </section>

      {/* Category Section */}
      <div className="category-header">
        <span>01 Coats</span>
      </div>

      {/* Product Grid */}
      <section style={{ padding: 'var(--spacing-xl) var(--spacing-section-h)' }}>
        <div className="product-grid">
          <Link href={`/products/${demoProduct.handle}`} style={{ textDecoration: 'none' }}>
            <div className="product-card animate-fade-in">
              <div className="product-card-image">
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#e8e8e3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--color-accent)',
                  }}
                >
                  Product Image
                </div>
              </div>
              <div className="product-card-info">
                <span className="product-card-title">
                  {demoProduct.title} | {demoProduct.color}
                </span>
                <span className="product-card-price">
                  {new Intl.NumberFormat('vi-VN').format(demoProduct.price)}₫
                </span>
              </div>
            </div>
          </Link>

          {[2, 3, 4].map((i) => (
            <div key={i} className="product-card" style={{ opacity: 0.4 }}>
              <div className="product-card-image">
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#e8e8e3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--color-accent)',
                  }}
                >
                  Coming Soon
                </div>
              </div>
              <div className="product-card-info">
                <span className="product-card-title">—</span>
                <span className="product-card-price">—</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
