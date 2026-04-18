'use client'

import React, { useState } from 'react'
import { useCart } from '@/components/cart/CartProvider'
import { formatPrice } from '@/lib/utils'

const demoProduct = {
  id: 'demo-1',
  title: 'Palladium Vegan Leather Trench',
  handle: 'demo-vegan-leather-trench',
  color: 'Black',
  price: 9594000,
  description:
    'A statement, floor-length structured trench for a daily dose of matrix-level sophistication. With a throw-on-and-go practicality, this classic staple is updated with a pointed collar, structural straight fit and self-tie belt. Crafted from a buttery smooth, imitation lamb leather that looks and feels like the real thing.',
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  soldOutSizes: [] as string[],
  images: [1, 2, 3, 4],
  accordions: [
    {
      title: 'Details',
      content:
        'Shell: 100% Polyurethane\nLining: 100% Polyester\nBelt: 100% Polyurethane\n\nPointed collar\nStructural straight fit\nSelf-tie belt\nFront button closure',
    },
    {
      title: 'Size & Fit',
      content:
        "Model is 6'1\" / 185cm and wears size M\n\nRelaxed, straight fit\nFloor length\n\nSize Guide available below.",
    },
    {
      title: 'Sustainability',
      content:
        'This product is made with vegan leather — a responsible alternative to animal-derived materials. We are committed to reducing our environmental impact through conscious material choices.',
    },
    {
      title: 'Shipping & Returns',
      content:
        'Complimentary shipping on all orders over ₫6,578,950.\n\nFree returns within 14 days.\nExchange within 30 days of delivery.\n\nSee our full return policy for details.',
    },
    {
      title: 'Need Assistance?',
      content:
        'Contact us at support@california-arts.com\n\nOr reach out via Instagram DM @california.arts',
    },
  ],
}

export default function ProductDetailPage() {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [openAccordion, setOpenAccordion] = useState<number | null>(null)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size')
      return
    }

    addItem({
      id: `${demoProduct.id}-${demoProduct.color}-${selectedSize}`,
      productId: demoProduct.id,
      productTitle: `${demoProduct.title} | ${demoProduct.color}`,
      variantTitle: `${demoProduct.color} / ${selectedSize}`,
      color: demoProduct.color,
      size: selectedSize,
      price: demoProduct.price,
      quantity: 1,
    })
  }

  return (
    <div className="product-detail">
      {/* Left — Gallery */}
      <div className="product-gallery">
        {demoProduct.images.map((_, index) => (
          <div
            key={index}
            className="product-gallery-image"
            style={{
              aspectRatio: '3/4',
              backgroundColor: index % 2 === 0 ? '#e8e8e3' : '#d5d5d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent)',
            }}
          >
            Product Image {index + 1}
          </div>
        ))}
      </div>

      {/* Right — Product Info */}
      <div className="product-info">
        {/* Title */}
        <h1 className="product-title">
          {demoProduct.title} | {demoProduct.color} | {demoProduct.color}
        </h1>

        {/* Price */}
        <p className="product-price">{formatPrice(demoProduct.price)}</p>

        {/* Description */}
        <p className="product-description">{demoProduct.description}</p>

        {/* Color */}
        <div className="variant-row">
          <span className="variant-label">Color</span>
          <div className="color-swatches">
            <button
              className="color-swatch active"
              style={{ backgroundColor: '#131818' }}
              aria-label="Black"
              title="Black"
            />
          </div>
        </div>

        {/* Size */}
        <div className="variant-row">
          <span className="variant-label">Size</span>
          <div className="size-options">
            {demoProduct.sizes.map((size) => {
              const isSoldOut = demoProduct.soldOutSizes.includes(size)
              return (
                <button
                  key={size}
                  className={`size-option ${selectedSize === size ? 'active' : ''} ${
                    isSoldOut ? 'sold-out' : ''
                  }`}
                  onClick={() => !isSoldOut && setSelectedSize(size)}
                  disabled={isSoldOut}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>

        {/* Add To Bag */}
        <button className="btn-add-to-bag" onClick={handleAddToCart}>
          Add To Bag
        </button>

        {/* Accordions */}
        <div>
          {demoProduct.accordions.map((accordion, index) => (
            <div key={index} className="accordion-item">
              <button
                className="accordion-trigger"
                onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                aria-expanded={openAccordion === index}
              >
                <span>{accordion.title}</span>
                <span className="accordion-icon">+</span>
              </button>
              <div className={`accordion-content ${openAccordion === index ? 'open' : ''}`}>
                <div className="accordion-content-inner">
                  {accordion.content.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Style With */}
        <p className="style-with-title">Style With</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--gutter)' }}>
          {[1, 2].map((i) => (
            <div
              key={i}
              style={{
                aspectRatio: '3/4',
                backgroundColor: '#e8e8e3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent)',
              }}
            >
              Related {i}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
