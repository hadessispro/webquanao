import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload-client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.NEXT_PUBLIC_SERVER_URL || 'https://d-dien.shop').replace(/\/+$/, '')

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/collections/shop-all`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/pages/our-story`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/pages/campaign`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/pages/returns-exchanges`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/pages/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  try {
    const payload = await getPayloadClient()
    const [productsResult, pagesResult] = await Promise.all([
      payload.find({
        collection: 'products',
        limit: 1000,
        depth: 0,
      }),
      payload.find({
        collection: 'pages',
        limit: 100,
        depth: 0,
      }),
    ])

    const productRoutes: MetadataRoute.Sitemap = (productsResult.docs || [])
      .filter((p: any) => p && p.handle)
      .map((p: any) => ({
        url: `${siteUrl}/products/${p.handle}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))

    const pageRoutes: MetadataRoute.Sitemap = (pagesResult.docs || [])
      .filter((page: any) => page && page.slug)
      .map((page: any) => ({
        url: `${siteUrl}/pages/${page.slug}`,
        lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))

    return [...staticRoutes, ...productRoutes, ...pageRoutes]
  } catch (err) {
    console.error('Failed to generate dynamic sitemap entries:', err)
    return staticRoutes
  }
}
