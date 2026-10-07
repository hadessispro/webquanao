import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/lib/pages-data'
import CmsPageContent from '@/components/page/CmsPageContent'

export const metadata = {
  title: 'liên hệ | điển',
  description: 'liên hệ cùng điển.',
}

export default async function AboutPage() {
  const page = await getPageBySlug('about')

  if (!page) {
    notFound()
  }

  return <CmsPageContent page={page} />
}
