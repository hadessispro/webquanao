const fs = require('fs');

try {
  let html = fs.readFileSync('c:/Users/thaibao/Documents/webquanao/crawled_output/header.html', 'utf8');

  // Add Alpine wrapper
  html = `<section id="shopify-section-header" class="shopify-section section-header" x-data="{ menuOpen: {menu0: false}, searchOpen: false, searchFocusOut() { setTimeout(() => {this.searchOpen = false}, 100); }, openMenu(i) { this.menuOpen['menu'+i] = !this.menuOpen['menu'+i]; } }">\n` + html + `\n</section>`;

  // Fix spacing
  html = html.replace('<ul class="c_header-menu-ul flex flex-wrap ">', '<ul class="c_header-menu-ul flex flex-wrap gap-6 lg:gap-8 ">');

  // Fix megamenu
  const oldMega = '<div class="c_megamenu-upper no-js-focus-container absolute left-0 bottom-0 w-full transform translate-y-full z-20 bg-header-background text-header-text border-t-grid border-b-grid border-grid-color">';
  const newMega = '<div x-cloak x-show="menuOpen.menu0" x-transition.opacity.duration.200ms class="c_megamenu-upper no-js-focus-container absolute left-0 bottom-0 w-full transform translate-y-full z-20 bg-header-background text-header-text border-t-grid border-b-grid border-grid-color">';
  html = html.replace(oldMega, newMega);

  // Fix cart button
  html = html.replace(
    'class="inline-block pt-2 " data-cart-drawer-toggle=""',
    'class="inline-block text-xs uppercase tracking-widest font-heading border border-header-text rounded-full px-4 py-1 mt-1 transition hover:bg-header-text hover:text-white-text " data-cart-drawer-toggle=""'
  );

  // Escape backticks in HTML so they don't break the template literal
  html = html.replace(/`/g, '\\`');
  // Escape ${} syntax in strings so it doesn't break JS template literal
  html = html.replace(/\$\{/g, '\\${');

  const reactCode = `'use client'
import React from 'react'

export default function Header() {
  return (
    <>
      <div className="shipping-bar" style={{ textAlign: "center", padding: "6px 10px", fontSize: "0.8rem", backgroundColor: "var(--color-primary-background)", borderBottom: "1px solid var(--color-border)" }}>
        Complimentary shipping to Vietnam on all orders over ₫6,578,950. No additional duties and fees upon delivery.
      </div>
      <div dangerouslySetInnerHTML={{__html: \`${html}\` }} suppressHydrationWarning />
    </>
  )
}
`;

  fs.writeFileSync('c:/Users/thaibao/Documents/webquanao/crawled_output/california-arts-nextjs/src/components/layout/Header.tsx', reactCode);
  console.log('Successfully generated Header.tsx');
} catch (e) {
  console.error(e);
}
