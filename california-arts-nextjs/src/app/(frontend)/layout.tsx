import React from 'react'
import '@/app/globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ClientLayout from '@/components/layout/ClientLayout'
import { getFooterData, getHeaderData, getNewsletterPopupData } from '@/lib/layout-data'

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [header, footer, newsletterPopup] = await Promise.all([
    getHeaderData(),
    getFooterData(),
    getNewsletterPopupData(),
  ])

  return (
    <html className="js" data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/pck3rmu.css" />
        <link rel="stylesheet" href="/css/theme.min.css" />
        <link rel="stylesheet" href="/css/component.css" />
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
