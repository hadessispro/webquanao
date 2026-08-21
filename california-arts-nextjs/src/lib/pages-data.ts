import { getPayloadClient } from './payload-client'

export interface CmsPageData {
  id: number | string
  title: string
  slug: string
  contentHtml?: string | null
  template?: string | null
  seo?: {
    title?: string | null
    description?: string | null
  }
}

export async function getPageBySlug(slug: string): Promise<CmsPageData | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      depth: 2,
      limit: 1,
      where: {
        and: [
          {
            slug: {
              equals: slug,
            },
          },
          {
            status: {
              equals: 'published',
            },
          },
        ],
      },
    })

    const page = result.docs[0] as CmsPageData | undefined
    return page || null
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
      where: {
        status: {
          equals: 'published',
        },
      },
    })

    return result.docs
      .map((page) => ({ slug: (page as { slug?: string }).slug || '' }))
      .filter((page) => page.slug)
  } catch {
    return []
  }
}
