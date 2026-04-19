"use client";

import React, { useState, useMemo } from "react";
import {
  Product,
  getProductColors,
  getProductSizes,
  isProductSoldOut,
} from "@/lib/products";

function buildColorImages(product: Product) {
  const allImgs = product.images
    .slice()
    .sort((a, b) => a.position - b.position);
  const colors =
    product.options.find((o) => o.name.toLowerCase() === "color")?.values || [];

  if (colors.length <= 1) return { [colors[0] || ""]: allImgs };

  const leadPos: Record<string, number> = {};
  for (const v of product.variants) {
    if (v.option1 && !leadPos[v.option1] && v.featured_image) {
      leadPos[v.option1] =
        (v.featured_image as { position?: number }).position ||
        v.featured_image.id ||
        999;
    }
  }

  // Find actual lead positions from images that have variant_ids
  for (const color of colors) {
    if (leadPos[color]) continue;
    const colorVarIds = product.variants
      .filter((v) => v.option1 === color)
      .map((v) => v.id);
    const leadImg = allImgs.find((img) =>
      img.variant_ids.some((vid) => colorVarIds.includes(vid)),
    );
    if (leadImg) leadPos[color] = leadImg.position;
  }

  const sorted = [...colors].sort(
    (a, b) => (leadPos[a] ?? 999) - (leadPos[b] ?? 999),
  );

  const groups: Record<string, typeof allImgs> = {};
  for (let i = 0; i < sorted.length; i++) {
    const color = sorted[i];
    const start = leadPos[color] ?? 1;
    const nextStart =
      i + 1 < sorted.length ? (leadPos[sorted[i + 1]] ?? 9999) : 9999;
    groups[color] = allImgs.filter(
      (img) => img.position >= start && img.position < nextStart,
    );
    if (groups[color].length === 0) groups[color] = allImgs;
  }
  return groups;
}

const COLOR_MAP: Record<string, string> = {
  black: "#1a1a1a",
  "jet black": "#0a0a0a",
  "washed black": "#2a2a2a",
  blue: "#3b5998",
  "vintage blue": "#4a6fa5",
  "light rinse": "#8ba9c9",
  white: "#f5f5f0",
  "off-white": "#f5f5f0",
  ivory: "#f5f1e3",
  cream: "#f5f0e0",
  red: "#8b2020",
  merlot: "#722F37",
  sienna: "#a0522d",
  redwood: "#6b3a3a",
  olive: "#556B2F",
  green: "#4a6741",
  grey: "#808080",
  gray: "#808080",
  navy: "#1a2744",
  "sunfaded black": "#3a3a3a",
};

function colorToHex(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, hex] of Object.entries(COLOR_MAP)) {
    if (lower.includes(key)) return hex;
  }
  return "#ccc";
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const colors = getProductColors(product);
  const sizes = getProductSizes(product);
  const soldOut = isProductSoldOut(product);
  const colorImageMap = useMemo(() => buildColorImages(product), [product]);

  const [selColor, setSelColor] = useState(colors[0] || "");
  const [selSize, setSelSize] = useState("");
  const [mobileIdx, setMobileIdx] = useState(0);
  const [openAcc, setOpenAcc] = useState<number | null>(null);

  const imgs = colorImageMap[selColor] || Object.values(colorImageMap)[0] || [];
  const colorVariants = useMemo(
    () =>
      selColor
        ? product.variants.filter((v) => v.option1 === selColor)
        : product.variants,
    [product.variants, selColor],
  );
  const selVariant = useMemo(() => {
    if (selSize)
      return colorVariants.find(
        (v) => v.option2 === selSize || v.title === selSize,
      );
    return colorVariants[0];
  }, [colorVariants, selSize]);

  const fmt = (p: string) =>
    new Intl.NumberFormat("vi-VN").format(parseInt(p)) + "₫";
  const price = selVariant
    ? fmt(selVariant.price)
    : fmt(product.variants[0]?.price || "0");
  const cmpPrice = selVariant?.compare_at_price
    ? fmt(selVariant.compare_at_price)
    : null;

  const accordions = useMemo(() => {
    const s: { title: string; html: string }[] = [];
    if (product.body_html)
      s.push({ title: "Details", html: product.body_html });
    s.push({
      title: "Size & Fit",
      html: "<p>See our size guide for detailed measurements.</p>",
    });
    s.push({
      title: "Sustainability",
      html: "<p>We advocate for sustainability by producing less, building better.</p>",
    });
    s.push({
      title: "Shipping & Returns",
      html: "<p>Complimentary shipping on US orders over $150 USD. Refund within 14 days and exchange within 30 days of delivery.</p>",
    });
    s.push({
      title: "Need Assistance?",
      html: '<p>Contact us at <a href="mailto:info@california-arts.com" style="text-decoration:underline">info@california-arts.com</a></p>',
    });
    return s;
  }, [product.body_html]);

  const pickColor = (c: string) => {
    setSelColor(c);
    setMobileIdx(0);
    setSelSize("");
  };

  return (
    <div className="bg-primary-background text-primary-text">
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* ══════ LEFT: IMAGES ══════ */}
        {/* Desktop: stacked vertical scroll */}
        <div
          className="hidden lg:block"
          style={{ flex: "0 0 58%", maxWidth: "58%" }}
        >
          {imgs.map((img, i) => (
            <img
              key={img.id || i}
              src={img.src}
              alt={`${product.title} - ${i + 1}`}
              width={img.width}
              height={img.height}
              loading={i === 0 ? "eager" : "lazy"}
              style={{ display: "block", width: "100%", height: "auto" }}
            />
          ))}
          {imgs.length === 0 && (
            <div
              style={{
                height: "80vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f5f5f5",
              }}
            >
              <p style={{ opacity: 0.4 }}>No images available</p>
            </div>
          )}
        </div>

        {/* Mobile: swipeable carousel */}
        <div className="lg:hidden w-full">
          {imgs.length > 0 ? (
            <div style={{ position: "relative" }}>
              <img
                src={imgs[mobileIdx]?.src}
                alt={product.title}
                style={{ display: "block", width: "100%", height: "auto" }}
              />
              {imgs.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setMobileIdx((p) => (p === 0 ? imgs.length - 1 : p - 1))
                    }
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(255,255,255,.7)",
                      border: "none",
                      width: 32,
                      height: 32,
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                  >
                    ←
                  </button>
                  <button
                    onClick={() =>
                      setMobileIdx((p) => (p === imgs.length - 1 ? 0 : p + 1))
                    }
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(255,255,255,.7)",
                      border: "none",
                      width: 32,
                      height: 32,
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                  >
                    →
                  </button>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 16,
                      left: 0,
                      right: 0,
                      display: "flex",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    {imgs.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setMobileIdx(i)}
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          border: "none",
                          background: "var(--color-primary-text)",
                          opacity: i === mobileIdx ? 1 : 0.3,
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div
              style={{
                height: "60vh",
                background: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p style={{ opacity: 0.4 }}>No images</p>
            </div>
          )}
        </div>

        {/* ══════ RIGHT: PRODUCT INFO (sticky) ══════ */}
        <div
          className="hidden lg:block"
          style={{ flex: "0 0 42%", maxWidth: "42%" }}
        >
          <div
            style={{
              position: "sticky",
              top: 0,
              padding: "40px 48px",
              maxHeight: "100vh",
              overflowY: "auto",
            }}
          >
            {/* Title */}
            <h1
              style={{
                fontFamily: "var(--body-font-stack)",
                fontSize: "0.8rem",
                fontWeight: 400,
                letterSpacing: "0.02em",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {product.title}
            </h1>

            {/* Price */}
            <div style={{ fontSize: "0.8rem", marginTop: 4 }}>
              {cmpPrice && (
                <span
                  style={{
                    textDecoration: "line-through",
                    opacity: 0.5,
                    marginRight: 8,
                  }}
                >
                  {cmpPrice}
                </span>
              )}
              <span>{price}</span>
            </div>

            {/* Description */}
            {product.body_html && (
              <div
                style={{
                  fontSize: "0.64rem",
                  lineHeight: 1.8,
                  marginTop: 20,
                  opacity: 0.8,
                }}
                dangerouslySetInnerHTML={{ __html: product.body_html }}
              />
            )}

            {/* Color circles */}
            {colors.length > 1 && (
              <div style={{ marginTop: 28 }}>
                <div
                  style={{
                    fontSize: "0.64rem",
                    letterSpacing: "0.05em",
                    marginBottom: 8,
                  }}
                >
                  Color
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => pickColor(c)}
                      title={c}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        padding: 0,
                        cursor: "pointer",
                        background: colorToHex(c),
                        border:
                          selColor === c
                            ? "2px solid var(--color-primary-text)"
                            : "1px solid #ccc",
                        outline:
                          selColor === c
                            ? "2px solid var(--color-primary-text)"
                            : "none",
                        outlineOffset: 2,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {sizes.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <div
                  style={{
                    fontSize: "0.64rem",
                    letterSpacing: "0.05em",
                    marginBottom: 8,
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <span>Size</span>
                  {sizes.map((sz) => {
                    const avail = colorVariants.some(
                      (v) =>
                        (v.option2 === sz || v.title === sz) && v.available,
                    );
                    const active = selSize === sz;
                    return (
                      <button
                        key={sz}
                        onClick={() => avail && setSelSize(sz)}
                        disabled={!avail}
                        style={{
                          fontSize: "0.64rem",
                          background: "none",
                          border: "none",
                          padding: "2px 4px",
                          cursor: avail ? "pointer" : "not-allowed",
                          color: active
                            ? "var(--color-primary-text)"
                            : avail
                              ? "var(--color-primary-text)"
                              : "var(--color-border)",
                          textDecoration: avail
                            ? active
                              ? "underline"
                              : "none"
                            : "line-through",
                          fontWeight: active ? 600 : 400,
                        }}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add To Bag */}
            <div style={{ marginTop: 32 }}>
              <button
                disabled={soldOut || !selSize}
                style={{
                  width: "100%",
                  padding: "16px 0",
                  fontSize: "0.64rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 400,
                  border: "none",
                  borderRadius: 0,
                  background: soldOut
                    ? "var(--color-border)"
                    : "var(--color-primary-text)",
                  color: soldOut
                    ? "var(--color-primary-text)"
                    : "var(--color-primary-background)",
                  cursor: soldOut || !selSize ? "not-allowed" : "pointer",
                  opacity: soldOut ? 0.5 : 1,
                }}
              >
                {soldOut ? "Sold Out" : "Add To Bag"}
              </button>
            </div>

            {/* Accordions */}
            <div
              style={{
                marginTop: 32,
                borderTop: "1px solid var(--color-border)",
              }}
            >
              {accordions.map((acc, i) => (
                <div
                  key={i}
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                >
                  <button
                    onClick={() => setOpenAcc(openAcc === i ? null : i)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px 0",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--color-primary-text)",
                      fontSize: "0.64rem",
                      letterSpacing: "0.05em",
                    }}
                  >
                    <span>{acc.title}</span>
                    <span style={{ fontSize: "0.8rem" }}>
                      {openAcc === i ? "−" : "+"}
                    </span>
                  </button>
                  {openAcc === i && (
                    <div
                      style={{
                        paddingBottom: 14,
                        fontSize: "0.64rem",
                        lineHeight: 1.8,
                      }}
                      dangerouslySetInnerHTML={{ __html: acc.html }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════ MOBILE INFO (below image) ══════ */}
      <div className="lg:hidden" style={{ padding: "24px 20px" }}>
        <h1
          style={{
            fontFamily: "var(--body-font-stack)",
            fontSize: "0.8rem",
            fontWeight: 400,
            margin: 0,
          }}
        >
          {product.title}
        </h1>
        <div style={{ fontSize: "0.8rem", marginTop: 4 }}>
          {cmpPrice && (
            <span
              style={{
                textDecoration: "line-through",
                opacity: 0.5,
                marginRight: 8,
              }}
            >
              {cmpPrice}
            </span>
          )}
          <span>{price}</span>
        </div>
        {product.body_html && (
          <div
            style={{
              fontSize: "0.64rem",
              lineHeight: 1.8,
              marginTop: 16,
              opacity: 0.8,
            }}
            dangerouslySetInnerHTML={{ __html: product.body_html }}
          />
        )}
        {colors.length > 1 && (
          <div
            style={{
              marginTop: 20,
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.64rem" }}>Color</span>
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => pickColor(c)}
                title={c}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  padding: 0,
                  cursor: "pointer",
                  background: colorToHex(c),
                  border:
                    selColor === c
                      ? "2px solid var(--color-primary-text)"
                      : "1px solid #ccc",
                  outlineOffset: 2,
                  outline:
                    selColor === c
                      ? "2px solid var(--color-primary-text)"
                      : "none",
                }}
              />
            ))}
          </div>
        )}
        {sizes.length > 0 && (
          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "0.64rem" }}>Size</span>
            {sizes.map((sz) => {
              const avail = colorVariants.some(
                (v) => (v.option2 === sz || v.title === sz) && v.available,
              );
              return (
                <button
                  key={sz}
                  onClick={() => avail && setSelSize(sz)}
                  disabled={!avail}
                  style={{
                    fontSize: "0.64rem",
                    background: "none",
                    border: "none",
                    padding: "2px 4px",
                    cursor: avail ? "pointer" : "not-allowed",
                    color: avail
                      ? "var(--color-primary-text)"
                      : "var(--color-border)",
                    textDecoration:
                      selSize === sz
                        ? "underline"
                        : avail
                          ? "none"
                          : "line-through",
                    fontWeight: selSize === sz ? 600 : 400,
                  }}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        )}
        <div style={{ marginTop: 24 }}>
          <button
            disabled={soldOut || !selSize}
            style={{
              width: "100%",
              padding: "14px 0",
              fontSize: "0.64rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              border: "none",
              background: "var(--color-primary-text)",
              color: "var(--color-primary-background)",
              opacity: soldOut ? 0.5 : 1,
              cursor: soldOut || !selSize ? "not-allowed" : "pointer",
            }}
          >
            {soldOut ? "Sold Out" : "Add To Bag"}
          </button>
        </div>
        <div
          style={{ marginTop: 24, borderTop: "1px solid var(--color-border)" }}
        >
          {accordions.map((acc, i) => (
            <div
              key={i}
              style={{ borderBottom: "1px solid var(--color-border)" }}
            >
              <button
                onClick={() => setOpenAcc(openAcc === i ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "14px 0",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-primary-text)",
                  fontSize: "0.64rem",
                }}
              >
                <span>{acc.title}</span>
                <span>{openAcc === i ? "−" : "+"}</span>
              </button>
              {openAcc === i && (
                <div
                  style={{
                    paddingBottom: 14,
                    fontSize: "0.64rem",
                    lineHeight: 1.8,
                  }}
                  dangerouslySetInnerHTML={{ __html: acc.html }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
