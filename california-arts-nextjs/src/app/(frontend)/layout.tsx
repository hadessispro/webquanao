import React from 'react'
import '@/app/globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ClientLayout from '@/components/layout/ClientLayout'
import { getFooterData, getHeaderData, getNewsletterPopupData } from '@/lib/layout-data'

const typographyOverride = `
  :root {
    --dien-body-font-stack: "SVN Times New Roman 2", "Times New Roman", Times, serif;
    --dien-ui-font-stack: "SVN Arial 3", Arial, Helvetica, sans-serif;
    --body-font-stack: var(--dien-body-font-stack);
    --serif-font-stack: var(--dien-body-font-stack);
    --heading-font-stack: var(--dien-body-font-stack);
    --ui-font-stack: var(--dien-ui-font-stack);
  }

  body#california-arts,
  body#california-arts *,
  body#california-arts *::before,
  body#california-arts *::after {
    font-family: var(--dien-body-font-stack) !important;
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
`

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [header, footer, newsletterPopup] = await Promise.all([
    getHeaderData(),
    getFooterData(),
    getNewsletterPopupData(),
  ])

  return (
    <html className="js" data-scroll-behavior="auto" lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/media/d-brandmark.png?v=20260524e" type="image/png" />
        <link rel="shortcut icon" href="/media/d-brandmark.png?v=20260524e" type="image/png" />
        <link rel="apple-touch-icon" href="/media/d-brandmark.png?v=20260524e" />
        <link rel="stylesheet" href="/css/theme.min.css?v=20260517b" />
        <link rel="stylesheet" href="/css/component.css?v=20260517b" />
        <style dangerouslySetInnerHTML={{ __html: typographyOverride }} />
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
