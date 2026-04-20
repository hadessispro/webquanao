"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Product,
  getDisplayPrice,
  getCompareAtPrice,
  getMainImageUrl,
  getHoverImageUrl,
  getImageAspectRatio,
  isProductSoldOut,
  getProductSizes,
} from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const mainImage = getMainImageUrl(product);
  const hoverImage = getHoverImageUrl(product);
  const aspectRatio = getImageAspectRatio(product);
  const soldOut = isProductSoldOut(product);
  const price = getDisplayPrice(product);
  const comparePrice = getCompareAtPrice(product);
  const sizes = getProductSizes(product);

  // Build the product URL
  const productUrl = `/products/${product.handle}`;

  const prefetchProduct = () => {
    router.prefetch(productUrl);
  };

  return (
    <li
      className={`ca_pro-item col-span-1 lg:col-span-3 bg-primary-background text-primary-text px-4${soldOut ? " ca_pro-item__soldout" : ""}`}
    >
      <div className="c_grid-inner c_grid-inner-available group block h-full relative text-center text-sm type-product-grid-item hover:text-primary-accent">
        {/* Clickable overlay link */}
        <Link
          href={productUrl}
          className="increase-target"
          onFocus={prefetchProduct}
          onMouseEnter={prefetchProduct}
          prefetch={false}
        >
          <span className="visually-hidden">{product.title}</span>
        </Link>

        <div className="relative">
          {/* Image container with aspect ratio */}
          <div className="w-full h-full pb-0 lg:pb">
            <div className="featured-collection__image z-0 relative ca_pro-item__gallery">
              {/* Main Image */}
              <div
                className="responsive-image-wrapper relative overflow-hidden w-full my-0 mx-auto"
                style={{ height: 0, paddingTop: `${aspectRatio}%` }}
              >
                <img
                  className="responsive-image block absolute top-0 left-0 w-full h-full transition-opacity duration-200 ease-in-out"
                  src={mainImage}
                  alt={product.title}
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                  style={{
                    objectFit: "cover",
                    opacity: imageLoaded ? 1 : 0,
                  }}
                />
                {!imageLoaded && (
                  <div className="responsive-image-placeholder bg-primary-text absolute top-0 left-0 right-0 bottom-0" />
                )}
              </div>

              {/* Hover Image */}
              {hoverImage && (
                <div
                  className="product-item-hover bg-primary-background absolute top-0 left-0 bottom-0 right-0 opacity-0 z-10 bg-cover bg-no-repeat bg-center transition-opacity duration-200 ease-in-out group-hover:opacity-100"
                  style={{ backgroundImage: `url(${hoverImage})` }}
                />
              )}
            </div>
          </div>

          {/* Product Info */}
          <div
            className="c_grid-content py-4 section-x-padding justify-between text-sm lg:text-base lg:flex"
            style={{ flexWrap: "wrap" }}
          >
            {/* Title */}
            <div
              className="text-sm text-left lg:w-3/5 break-words"
              style={{ width: "100%" }}
            >
              <p aria-hidden="true" className="aaa product-grid-title">
                {product.title}
              </p>
            </div>

            {/* Variants & Price */}
            <div
              className="text-sm text-left lg:w-2/5 lg:text-right mt-1 lg:mt-0 lg:pl-2"
              style={{
                width: "100%",
                textAlign: "left",
                padding: "2px 0px 0px",
                margin: "0",
              }}
            >
              {/* Size variants */}
              {sizes.length > 0 && (
                <div className="c_grid-var">
                  <ul className="c_grid-var-ul ca_pro-item__variants">
                    {sizes.map((size) => {
                      // Check if this size has any available variant
                      const sizeAvailable = product.variants.some(
                        (v) =>
                          (v.option2 === size || v.title === size) &&
                          v.available,
                      );
                      return (
                        <li key={size} className="ca_pro-item__variant">
                          <input
                            type="radio"
                            name={`c_${product.id}-variants`}
                            id={`c_${product.id}-${size}`}
                            value={size}
                            disabled={!sizeAvailable}
                            readOnly
                          />
                          <label htmlFor={`c_${product.id}-${size}`}>
                            {size}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Price */}
              <div
                className="ca_pro-prices"
                style={{ display: "flex", gap: "4px" }}
              >
                {comparePrice && (
                  <span
                    className="dfgjghjhg4"
                    style={{ textDecoration: "line-through", opacity: 0.5 }}
                  >
                    {comparePrice}
                  </span>
                )}
                <span className="dfgjghjhg4">{price}</span>
              </div>

              {/* Sold out indicator */}
              <div className="ca_pro-sold">
                {soldOut && <span>Sold out</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
