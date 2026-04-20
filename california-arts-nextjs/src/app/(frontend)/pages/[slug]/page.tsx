import { notFound } from 'next/navigation'
import CmsPageContent from '@/components/page/CmsPageContent'
import { getAllPageSlugs, getPageBySlug } from '@/lib/pages-data'

const staticPageSlugs = new Set(['about', 'campaign', 'new-arrivals', 'our-story'])

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs()

  return slugs.filter((page) => !staticPageSlugs.has(page.slug))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  return {
    title: page?.seo?.title || page?.title || slug,
    description: page?.seo?.description || undefined,
  }
}

export default async function DynamicCmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) notFound()

  return <CmsPageContent page={page} />
}
