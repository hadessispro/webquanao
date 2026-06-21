import { notFound } from 'next/navigation'
import CmsPageContent from '@/components/page/CmsPageContent'
import { getAllPageSlugs, getPageBySlug } from '@/lib/pages-data'

const staticPageSlugs = new Set(['about', 'campaign', 'new-arrivals', 'our-story'])
const fallbackPageSlugs = ['privacy-policy', 'returns-exchanges']

const fallbackPages = {
  'privacy-policy': {
    title: 'chính sách bảo mật',
    body: [
      'điển chỉ thu thập những thông tin cần thiết để hỗ trợ đơn hàng, chăm sóc khách hàng và cải thiện trải nghiệm mua sắm.',
      'thông tin đăng ký nhận tin có thể hủy bất kỳ lúc nào. dữ liệu khách hàng được xử lý cẩn trọng và không bán cho bên thứ ba.',
      'nội dung chi tiết của trang chính sách sẽ được cập nhật lại sau.',
    ],
  },
  'returns-exchanges': {
    title: 'câu hỏi thường gặp',
    body: [
      'các câu hỏi về vận chuyển, đổi trả, chọn size và chăm sóc sản phẩm sẽ được cập nhật tại đây.',
      'trong thời gian chờ cập nhật nội dung đầy đủ, bạn có thể liên hệ trực tiếp qua email hoặc instagram của điển.',
    ],
  },
} as const

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs()
  const payloadSlugs = slugs.filter((page) => !staticPageSlugs.has(page.slug))

  return [
    ...payloadSlugs,
    ...fallbackPageSlugs
      .filter((slug) => !payloadSlugs.some((page) => page.slug === slug))
      .map((slug) => ({ slug })),
  ]
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const fallbackPage = fallbackPages[slug as keyof typeof fallbackPages]

  if (fallbackPage) {
    return {
      title: fallbackPage.title,
      description: fallbackPage.body[0],
    }
  }

  const page = await getPageBySlug(slug)

  return {
    title: page?.seo?.title || page?.title || slug,
    description: page?.seo?.description || undefined,
  }
}

export default async function DynamicCmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const fallbackPage = fallbackPages[slug as keyof typeof fallbackPages]

  if (fallbackPage) {
    return (
      <article className="cms-page cms-page--standard cms-page--policy-static">
        <section className="cms-page__section cms-page__section--intro">
          <div className="cms-page__inner cms-page__narrow">
            <h1>{fallbackPage.title}</h1>
            {fallbackPage.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      </article>
    )
  }

  const page = await getPageBySlug(slug)

  if (!page) notFound()

  return <CmsPageContent page={page} />
}
