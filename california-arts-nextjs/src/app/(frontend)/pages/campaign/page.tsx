import { notFound } from 'next/navigation'
import CmsPageContent from '@/components/page/CmsPageContent'
import { getPageBySlug } from '@/lib/pages-data'

export const metadata = {
  title: 'chiến dịch | điển',
  description: 'chiến dịch sáng tạo của điển.',
}

export default async function CampaignPage() {
  const page = await getPageBySlug('campaign')

  if (!page) {
    notFound()
  }

  return <CmsPageContent page={page} />
}
