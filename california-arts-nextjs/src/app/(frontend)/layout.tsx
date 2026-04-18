import React from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ClientLayout from '@/components/layout/ClientLayout'
import { getPayload } from 'payload'
import configPromise from '@/../payload.config'

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const payload = await getPayload({ config: configPromise })

  const headerData = await payload.findGlobal({
    slug: 'header',
  })

  const footerData = await payload.findGlobal({
    slug: 'footer',
  })

  return (
    <ClientLayout headerData={headerData}>
      <Header data={headerData} />
      <main>{children}</main>
      <Footer data={footerData} />
    </ClientLayout>
  )
}
