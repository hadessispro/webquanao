import { getPayloadClient } from './payload-client'

export interface CmsPageData {
  id: number | string
  title: string
  slug: string
  content?: unknown
  contentHtml?: string | null
  template?: string | null
  sections?: unknown[]
  seo?: {
    title?: string | null
    description?: string | null
  }
}

export async function getPageBySlug(slug: string): Promise<CmsPageData | null> {
  try {
    const payload = await getPayloadClient()
    const cleanSlug = slug.replace(/^\/+/, '').replace(/^pages\//, '')

    // 1. Primary search: exact match by slug
    const result = await payload.find({
      collection: 'pages',
      depth: 2,
      limit: 1,
      where: {
        slug: {
          equals: cleanSlug,
        },
      },
    })

    if (result.docs && result.docs.length > 0) {
      return result.docs[0] as CmsPageData
    }

    // 2. Secondary search: alternative slug formats or template matching
    const altResult = await payload.find({
      collection: 'pages',
      depth: 2,
      limit: 1,
      where: {
        or: [
          { slug: { equals: `pages/${cleanSlug}` } },
          { slug: { equals: `/${cleanSlug}` } },
          { template: { equals: cleanSlug } },
        ],
      },
    })

    if (altResult.docs && altResult.docs.length > 0) {
      return altResult.docs[0] as CmsPageData
    }

    return null
  } catch {
    return null
  }
}

export async function getAllPageSlugs(): Promise<Array<{ slug: string }>> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 100,
    })

    return result.docs
      .map((page) => ({ slug: (page as { slug?: string }).slug || '' }))
      .filter((page) => page.slug)
  } catch {
    return []
  }
}
