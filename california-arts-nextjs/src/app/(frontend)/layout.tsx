import React from 'react'
import '@/app/globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ClientLayout from '@/components/layout/ClientLayout'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="js" lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/pck3rmu.css" />
        <link rel="stylesheet" href="/css/theme.min.css" />
        <link rel="stylesheet" href="/css/component.css" />
      </head>
      <body id="california-arts" suppressHydrationWarning>
        <ClientLayout>
          <div id="page-wrapper">
            <Header />
            <main role="main" id="MainContent">
              {children}
            </main>
            <Footer />
          </div>
        </ClientLayout>
      </body>
    </html>
  )
}
