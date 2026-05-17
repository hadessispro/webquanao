import React from 'react'
import '@/app/globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ClientLayout from '@/components/layout/ClientLayout'
import { getFooterData, getHeaderData, getNewsletterPopupData } from '@/lib/layout-data'

const typographyOverride = `
  :root {
    --dien-body-font-stack: "Times New Roman", Times, serif;
    --dien-ui-font-stack: Arial, Helvetica, sans-serif;
  }

  body#california-arts,
  body#california-arts *:not(button):not(input):not(textarea):not(select):not(option):not([role='button']),
  body#california-arts *:not(button):not(input):not(textarea):not(select):not(option):not([role='button'])::before,
  body#california-arts *:not(button):not(input):not(textarea):not(select):not(option):not([role='button'])::after {
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
  body#california-arts .cart-drawer__continue {
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
