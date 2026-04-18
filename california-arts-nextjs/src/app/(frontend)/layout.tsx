import React from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ClientLayout from '@/components/layout/ClientLayout'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientLayout>
      <Header />
      <main role="main" id="MainContent">
        {children}
      </main>
      <Footer />
    </ClientLayout>
  )
}
