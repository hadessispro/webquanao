import React from 'react'
import '@/app/globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ClientLayout from '@/components/layout/ClientLayout'
import {
  getDesignSystemData,
  getFooterData,
  getHeaderData,
  getNewsletterPopupData,
} from '@/lib/layout-data'
import type { DesignSystemData, StorefrontFont } from '@/lib/storefront-types'

export const dynamic = 'force-dynamic'

function sanitizeFontFamily(value: string) {
  return value.replace(/["\\\n\r{};]/g, '').trim()
}

function fontStack(font: StorefrontFont) {
  return `"${sanitizeFontFamily(font.family)}", ${font.fallback}`
}

function fontFormat(source: string) {
  const cleanSource = source.split('?')[0].toLowerCase()
  if (cleanSource.endsWith('.woff2')) return 'woff2'
  if (cleanSource.endsWith('.woff')) return 'woff'
  if (cleanSource.endsWith('.otf')) return 'opentype'
  return 'truetype'
}

function fontFace(font: StorefrontFont) {
  if (!font.source) return ''
  const safeSource = font.source.replace(/[<>\n\r]/g, '')

  return `
    @font-face {
      font-family: "${sanitizeFontFamily(font.family)}";
      src: url(${JSON.stringify(safeSource)}) format("${fontFormat(safeSource)}");
      font-display: swap;
      font-style: ${font.style};
      font-weight: ${font.weight};
    }
  `
}

function createDesignSystemStyle(designSystem: DesignSystemData & { allFonts?: StorefrontFont[] }) {
  const { typography, spacing, allFonts = [] } = designSystem
  const fontFaces = Array.from(
    new Map(
      [typography.bodyFont, typography.headingFont, typography.uiFont, ...allFonts]
        .filter((font) => font.source)
        .map((font) => [
          `${font.family}-${font.weight}-${font.style}-${font.source}`,
          fontFace(font),
        ]),
    ).values(),
  ).join('\n')

  return `
  ${fontFaces}

  :root {
    --dien-body-font-stack: ${fontStack(typography.bodyFont)};
    --dien-heading-font-stack: ${fontStack(typography.headingFont)};
    --dien-ui-font-stack: ${fontStack(typography.uiFont)};
    --body-font-stack: var(--dien-body-font-stack);
    --serif-font-stack: var(--dien-body-font-stack);
    --heading-font-stack: var(--dien-heading-font-stack);
    --ui-font-stack: var(--dien-ui-font-stack);
    --dien-heading-size: ${typography.headingSize}px;
    --dien-subheading-size: ${typography.subheadingSize}px;
    --dien-body-size: ${typography.bodySize}px;
    --dien-line-height: ${typography.lineHeight};
    --dien-letter-spacing: ${typography.letterSpacing}em;
    --dien-spacing-scale: ${spacing.scale};
    --dien-page-padding-mobile: ${spacing.pagePaddingMobile}px;
    --dien-page-padding-desktop: ${spacing.pagePaddingDesktop}px;
    --dien-grid-gap: ${spacing.gridGap}px;
    --base-font-size: var(--dien-body-size);
    --base-line-height: var(--dien-line-height);
    --spacing: calc(2rem * var(--dien-spacing-scale));
    --spacing-double: calc(4rem * var(--dien-spacing-scale));
    --spacing-half: calc(1rem * var(--dien-spacing-scale));
    --gutter: var(--dien-grid-gap);
  }

  body#california-arts {
    font-family: var(--dien-body-font-stack) !important;
    letter-spacing: var(--dien-letter-spacing) !important;
  }

  body#california-arts main,
  body#california-arts main *:not(button):not(input):not(textarea):not(select):not(option):not([role='button']):not(.home-hero__cta):not(.cms-page__button):not(.collection-product-page__next-cta-button):not(.product-detail__add-button):not(.search-overlay__submit):not(.contact-intake-form__submit):not(.checkout-page__submit):not(.cart-drawer__checkout):not(.cart-drawer__continue):not(.newsletter-popup__submit):not(.newsletter-popup__dismiss),
  body#california-arts main *:not(button):not(input):not(textarea):not(select):not(option):not([role='button']):not(.home-hero__cta):not(.cms-page__button):not(.collection-product-page__next-cta-button):not(.product-detail__add-button):not(.search-overlay__submit):not(.contact-intake-form__submit):not(.checkout-page__submit):not(.cart-drawer__checkout):not(.cart-drawer__continue):not(.newsletter-popup__submit):not(.newsletter-popup__dismiss)::before,
  body#california-arts main *:not(button):not(input):not(textarea):not(select):not(option):not([role='button']):not(.home-hero__cta):not(.cms-page__button):not(.collection-product-page__next-cta-button):not(.product-detail__add-button):not(.search-overlay__submit):not(.contact-intake-form__submit):not(.checkout-page__submit):not(.cart-drawer__checkout):not(.cart-drawer__continue):not(.newsletter-popup__submit):not(.newsletter-popup__dismiss)::after {
    font-family: var(--dien-body-font-stack) !important;
    letter-spacing: var(--dien-letter-spacing) !important;
  }

  body#california-arts {
    font-size: var(--dien-body-size);
    line-height: var(--dien-line-height);
  }

  body#california-arts h1,
  body#california-arts h2,
  body#california-arts h3,
  body#california-arts h4,
  body#california-arts h5,
  body#california-arts h6,
  body#california-arts .font-heading,
  body#california-arts .font-serif {
    font-family: var(--dien-heading-font-stack) !important;
  }

  body#california-arts button,
  body#california-arts input,
  body#california-arts textarea,
  body#california-arts select,
  body#california-arts option,
  body#california-arts [role='button'],
  body#california-arts .home-hero__cta,
  body#california-arts .cms-page__button,
  body#california-arts .collection-product-page__next-cta-button,
  body#california-arts .product-detail__add-button,
  body#california-arts .product-detail__accordion-trigger,
  body#california-arts .dien-footer__newsletter button,
  body#california-arts .newsletter-popup__dismiss,
  body#california-arts .newsletter-popup__submit,
  body#california-arts .contact-intake-form__submit,
  body#california-arts .checkout-page__submit,
  body#california-arts .cart-drawer__checkout,
  body#california-arts .cart-drawer__continue,
  body#california-arts .dien-footer__brand p,
  body#california-arts .c_megamenu-upper,
  body#california-arts .c_megamenu-upper *,
  body#california-arts .dien-product-menu,
  body#california-arts .dien-product-menu *,
  body#california-arts .art-menu,
  body#california-arts .art-menu * {
    font-family: var(--dien-ui-font-stack) !important;
  }

  body#california-arts .site-header-stack,
  body#california-arts .site-header-stack *,
  body#california-arts .c_header-main,
  body#california-arts .c_header-main *,
  body#california-arts .c_megamenu-upper,
  body#california-arts .c_megamenu-upper *,
  body#california-arts .dien-product-menu,
  body#california-arts .dien-product-menu *,
  body#california-arts .art-menu,
  body#california-arts .art-menu *,
  body#california-arts .search-overlay,
  body#california-arts .search-overlay *,
  body#california-arts .dien-footer__brand p,
  body#california-arts .dien-footer__newsletter,
  body#california-arts .dien-footer__newsletter *,
  body#california-arts .dien-footer__links,
  body#california-arts .dien-footer__links * {
    font-family: var(--dien-ui-font-stack) !important;
    letter-spacing: 0 !important;
  }

  body#california-arts .site-header-stack,
  body#california-arts .site-header-stack *,
  body#california-arts .c_header-main,
  body#california-arts .c_header-main *,
  body#california-arts .c_megamenu-upper,
  body#california-arts .c_megamenu-upper *,
  body#california-arts .dien-product-menu,
  body#california-arts .dien-product-menu *,
  body#california-arts .art-menu,
  body#california-arts .art-menu *,
  body#california-arts .search-overlay,
  body#california-arts .search-overlay * {
    font-family: "SVN Arial 3", Arial, Helvetica, sans-serif !important;
  }

  body#california-arts :where(.site-header-stack, .mobile-menu-drawer) :where(.c_megamenu-upper, .dien-product-menu, .art-menu),
  body#california-arts :where(.site-header-stack, .mobile-menu-drawer) :where(.c_megamenu-upper, .dien-product-menu, .art-menu) :where(a, button, span, div, h1, h2, h3, h4, p, li, ul, small) {
    font-family: "SVN Arial 3", Arial, Helvetica, sans-serif !important;
    letter-spacing: -0.01em !important;
  }

  body#california-arts :where(.site-header-stack, .mobile-menu-drawer) :where(.dien-product-menu__tab, .dien-product-menu__heading, .dien-product-menu__link, .art-menu__tab, .art-menu__group-title, .art-menu__link) {
    font-family: "SVN Arial 3", Arial, Helvetica, sans-serif !important;
  }

  body#california-arts .section-x-padding {
    padding-left: var(--dien-page-padding-mobile) !important;
    padding-right: var(--dien-page-padding-mobile) !important;
  }

  body#california-arts .gap-gutter,
  body#california-arts .lg\\:gap-gutter {
    gap: var(--dien-grid-gap) !important;
  }

  @media (min-width: 1024px) {
    body#california-arts .section-x-padding {
      padding-left: var(--dien-page-padding-desktop) !important;
      padding-right: var(--dien-page-padding-desktop) !important;
    }
  }
`
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [header, footer, newsletterPopup, designSystem] = await Promise.all([
    getHeaderData(),
    getFooterData(),
    getNewsletterPopupData(),
    getDesignSystemData(),
  ])

  return (
    <html className="js" data-scroll-behavior="auto" lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.png?v=20260701b" type="image/png" />
        <link rel="shortcut icon" href="/icon.png?v=20260701b" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png?v=20260701b" />
        <link rel="stylesheet" href="/css/theme.min.css?v=20260517b" />
        <link rel="stylesheet" href="/css/component.css?v=20260517b" />
        <style dangerouslySetInnerHTML={{ __html: createDesignSystemStyle(designSystem) }} />
      </head>
      <body id="california-arts" suppressHydrationWarning>
        <ClientLayout footer={footer} header={header} newsletterPopup={newsletterPopup}>
          <div id="page-wrapper">
            <Header header={header} />
            <main role="main" id="MainContent">
              {children}
            </main>
            <Footer footer={footer} />
          </div>
        </ClientLayout>
      </body>
    </html>
  )
}
