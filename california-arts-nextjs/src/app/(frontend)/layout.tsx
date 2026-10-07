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
  getSiteMetadata,
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

function fontFaceRule(family: string, source: string, weight: number | string, style: string) {
  if (!source) return ''
  const safeSource = source.replace(/[<>\n\r]/g, '')
  return `
    @font-face {
      font-family: "${sanitizeFontFamily(family)}";
      src: url(${JSON.stringify(safeSource)}) format("${fontFormat(safeSource)}");
      font-display: swap;
      font-style: ${style};
      font-weight: ${weight};
    }
  `
}

function buildAllFontFaces(
  typography: DesignSystemData['typography'],
  allFonts: StorefrontFont[],
): string {
  const rulesMap = new Map<string, string>()

  const addRule = (family: string, source?: string, weight: number | string = 400, style = 'normal') => {
    if (!family || !source) return
    const key = `${family.toLowerCase().trim()}-${weight}-${style}-${source}`
    if (!rulesMap.has(key)) {
      rulesMap.set(key, fontFaceRule(family, source, weight, style))
    }
  }

  // 1. Register each font in allFonts under its own family name
  for (const font of allFonts) {
    if (font.source) {
      addRule(font.family, font.source, font.weight, font.style)
    }
  }

  // Helper to link variants (bold, italic, bold italic) for a primary font
  const linkVariants = (
    primaryFont: StorefrontFont,
    boldFont?: StorefrontFont,
    italicFont?: StorefrontFont,
    boldItalicFont?: StorefrontFont,
  ) => {
    const primaryFamily = primaryFont.family
    if (primaryFont.source) {
      addRule(primaryFamily, primaryFont.source, primaryFont.weight || 400, primaryFont.style || 'normal')
    }

    if (boldFont?.source) {
      addRule(primaryFamily, boldFont.source, 700, 'normal')
    }
    if (italicFont?.source) {
      addRule(primaryFamily, italicFont.source, 400, 'italic')
    }
    if (boldItalicFont?.source) {
      addRule(primaryFamily, boldItalicFont.source, 700, 'italic')
    }

    // Auto-scan allFonts to link matching bold / italic files to the primary font family
    const primaryBase = primaryFamily.toLowerCase().replace(/(thường|regular|normal|đậm|bold|nghiêng|italic)/g, '').trim()

    for (const font of allFonts) {
      if (!font.source) continue
      const fnLower = (font.filename || '').toLowerCase()
      const famLower = font.family.toLowerCase()

      const isRelated = primaryBase ? (famLower.includes(primaryBase) || fnLower.includes(primaryBase)) : true
      if (!isRelated && allFonts.length > 5) continue

      const isBold = font.weight >= 600 || fnLower.includes('bold') || fnLower.includes('đậm') || famLower.includes('bold') || famLower.includes('đậm')
      const isItalic = font.style === 'italic' || fnLower.includes('italic') || fnLower.includes('nghiêng') || famLower.includes('italic') || famLower.includes('nghiêng')

      if (isBold && isItalic && !boldItalicFont) {
        addRule(primaryFamily, font.source, 700, 'italic')
      } else if (isBold && !isItalic && !boldFont) {
        addRule(primaryFamily, font.source, 700, 'normal')
      } else if (!isBold && isItalic && !italicFont) {
        addRule(primaryFamily, font.source, 400, 'italic')
      }
    }
  }

  linkVariants(typography.bodyFont, typography.bodyBoldFont, typography.bodyItalicFont, typography.bodyBoldItalicFont)
  linkVariants(typography.headingFont, typography.headingBoldFont, typography.headingItalicFont)
  linkVariants(typography.uiFont, typography.uiBoldFont, typography.uiItalicFont)

  // Alias common standard fonts
  for (const font of allFonts) {
    if (!font.source) continue
    const fnLower = (font.filename || '').toLowerCase()
    const famLower = font.family.toLowerCase()
    if (famLower.includes('times') || fnLower.includes('times')) {
      const isBold = font.weight >= 600 || fnLower.includes('bold') || fnLower.includes('đậm') || famLower.includes('bold') || famLower.includes('đậm')
      const isItalic = font.style === 'italic' || fnLower.includes('italic') || fnLower.includes('nghiêng') || famLower.includes('italic') || famLower.includes('nghiêng')
      const weight = isBold ? 700 : 400
      const style = isItalic ? 'italic' : 'normal'
      addRule('SVN Times New Roman 2', font.source, weight, style)
      addRule('Times New Roman', font.source, weight, style)
      addRule('TIMES thường', font.source, weight, style)
    }
    if (famLower.includes('arial') || fnLower.includes('arial')) {
      const isBold = font.weight >= 600 || fnLower.includes('bold') || fnLower.includes('đậm') || famLower.includes('bold') || famLower.includes('đậm')
      const isItalic = font.style === 'italic' || fnLower.includes('italic') || fnLower.includes('nghiêng') || famLower.includes('italic') || famLower.includes('nghiêng')
      const weight = isBold ? 700 : 400
      const style = isItalic ? 'italic' : 'normal'
      addRule('SVN Arial 3', font.source, weight, style)
      addRule('Arial', font.source, weight, style)
      addRule('arial thường', font.source, weight, style)
    }
  }

  return Array.from(rulesMap.values()).join('\n')
}

function createDesignSystemStyle(designSystem: DesignSystemData & { allFonts?: StorefrontFont[] }) {
  const { typography, spacing, allFonts = [] } = designSystem
  const fontFaces = buildAllFontFaces(typography, allFonts)

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
    --dien-text-transform: ${typography.textTransform || 'none'};
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
    font-weight: ${typography.bodyBold ? 'bold' : 'normal'};
    font-style: ${typography.bodyItalic ? 'italic' : 'normal'};
    font-synthesis: weight style !important;
  }

  body#california-arts main {
    font-family: var(--dien-body-font-stack);
    letter-spacing: var(--dien-letter-spacing);
  }

  /* Support bold, italic, underline, strikethrough, uppercase and formatting everywhere */
  body#california-arts strong,
  body#california-arts b,
  body#california-arts main strong,
  body#california-arts main b,
  body#california-arts :where(.story-page, .cms-page, .cms-rich-text, article, .product-detail) :where(strong, b) {
    font-weight: 700 !important;
    font-weight: bold !important;
  }

  body#california-arts em,
  body#california-arts i,
  body#california-arts main em,
  body#california-arts main i,
  body#california-arts :where(.story-page, .cms-page, .cms-rich-text, article, .product-detail) :where(em, i) {
    font-style: italic !important;
  }

  body#california-arts u,
  body#california-arts main u,
  body#california-arts :where(.story-page, .cms-page, .cms-rich-text, article, .product-detail) u {
    text-decoration: underline !important;
    text-decoration-line: underline !important;
  }

  body#california-arts :where(s, del, strike),
  body#california-arts main :where(s, del, strike),
  body#california-arts :where(.story-page, .cms-page, .cms-rich-text, article, .product-detail) :where(s, del, strike) {
    text-decoration: line-through !important;
    text-decoration-line: line-through !important;
  }

  body#california-arts :where(code, pre),
  body#california-arts main :where(code, pre) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
  }

  body#california-arts :where(sub),
  body#california-arts main :where(sub) {
    vertical-align: sub !important;
    font-size: 0.75em !important;
    line-height: 0 !important;
  }

  body#california-arts :where(sup),
  body#california-arts main :where(sup) {
    vertical-align: super !important;
    font-size: 0.75em !important;
    line-height: 0 !important;
  }

  body#california-arts :where(mark),
  body#california-arts main :where(mark) {
    background-color: rgba(254, 240, 138, 0.5) !important;
    padding: 1px 4px !important;
    border-radius: 2px !important;
  }

  /* Editorial & CMS content preserves typed casing */
  body#california-arts :where(.story-page__copy, .cms-page, .cms-rich-text, .product-detail__summary, .product-detail__accordion) {
    text-transform: ${typography.textTransform || 'none'} !important;
  }
  body#california-arts :where(.story-page__copy, .cms-page, .cms-rich-text, .product-detail__summary, .product-detail__accordion) * {
    text-transform: ${typography.textTransform || 'none'} !important;
  }

  html {
    background-color: #131818 !important;
    color-scheme: dark !important;
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
    font-weight: ${typography.headingBold ? 'bold' : 'normal'} !important;
    font-style: ${typography.headingItalic ? 'italic' : 'normal'} !important;
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
    font-weight: ${typography.uiBold ? 'bold' : 'normal'} !important;
    font-style: ${typography.uiItalic ? 'italic' : 'normal'} !important;
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
    font-weight: ${typography.uiBold ? 'bold' : 'normal'} !important;
    font-style: ${typography.uiItalic ? 'italic' : 'normal'} !important;
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

  body#california-arts .site-header-stack .dien-product-menu .dien-product-menu__slogan,
  body#california-arts .art-menu .art-menu__slogan {
    font-family: "SVN Times New Roman 2", "Times New Roman", Times, serif !important;
    font-style: italic !important;
    font-weight: 400 !important;
    letter-spacing: 0 !important;
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
  const [header, footer, newsletterPopup, designSystem, siteMetadata] = await Promise.all([
    getHeaderData(),
    getFooterData(),
    getNewsletterPopupData(),
    getDesignSystemData(),
    getSiteMetadata(),
  ])

  return (
    <html className="js" data-scroll-behavior="auto" lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#181818" />
        <link rel="icon" href="/icon.png?v=20260701b" type="image/png" />
        <link rel="shortcut icon" href="/icon.png?v=20260701b" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png?v=20260701b" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteMetadata.title} />
        <meta property="og:title" content={siteMetadata.title} />
        <meta property="og:description" content={siteMetadata.description} />
        {siteMetadata.image ? <meta property="og:image" content={siteMetadata.image} /> : null}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteMetadata.title} />
        <meta name="twitter:description" content={siteMetadata.description} />
        {siteMetadata.image ? <meta name="twitter:image" content={siteMetadata.image} /> : null}
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
