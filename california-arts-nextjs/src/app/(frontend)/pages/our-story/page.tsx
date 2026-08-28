import { getPageBySlug } from '@/lib/pages-data'

export async function generateMetadata() {
  const page = await getPageBySlug('our-story')
  return {
    title: page?.seo?.title || 'về điển | điển',
    description: page?.seo?.description || 'câu chuyện và cách làm của điển.',
  }
}

type StorySection = {
  key: string
  title: string
  // Either plain paragraphs (built-in fallback) or rich HTML (from the CMS).
  body?: string[]
  bodyHtml?: string
  media?: {
    alt: string
    src: string
  }
}

// Built-in Vietnamese content. Used as the fallback when the "our-story" page in
// the admin has no section blocks yet, so the page is never empty.
const fallbackSections: StorySection[] = [
  {
    key: '01',
    body: [
      'điển bắt đầu từ mong muốn đưa quần áo đẹp quay lại đúng nhịp sống hằng ngày. chúng tôi không chạy theo quá nhiều bộ sưu tập hay nhịp phát hành dồn dập, mà muốn mỗi món đồ đứng được lâu, mặc được nhiều và gợi đúng cảm giác sống cùng nó.',
      'điều chúng tôi theo đuổi là sự rõ ràng trong phom, vật liệu và cảm xúc sử dụng. một chiếc áo, một chiếc quần hay một lớp ngoài đều cần đủ đẹp để giữ lại, nhưng cũng đủ bình tĩnh để không lỗi thời sau một mùa.',
    ],
    media: {
      alt: 'điển campaign on the coast',
      src: '/media/nha-trang-6h.webp',
    },
    title:
      'mỗi sản phẩm được làm ra để sống cùng đời thường, không chỉ để trưng bày trong một mùa.',
  },
  {
    key: '02',
    body: [
      'chúng tôi làm theo hướng ít hơn nhưng chặt hơn: chọn lọc vật liệu, giữ bộ khung màu gọn, cắt giảm những chi tiết trang trí dư thừa và ưu tiên các tỉ lệ mặc được lâu. cách tiếp cận đó giúp mỗi sản phẩm dễ phối, dễ lặp lại trong tủ đồ và không bị trôi quá nhanh khỏi đời sống thực tế.',
      'thay vì mở rộng vô hạn, điển giữ nhịp phát triển vừa phải để đội ngũ có thể nhìn kỹ từng bản fit, từng ảnh chụp và từng phản hồi của khách hàng trước khi đưa ra đợt tiếp theo.',
    ],
    title:
      'thiết kế của điển hướng tới sự mạch lạc: ít chi tiết hơn, cân đối hơn và bền hơn trong cách mặc.',
  },
  {
    key: '03',
    body: [
      'điển không cố tạo khoảng cách với người mặc. chúng tôi muốn thương hiệu có thể nói chuyện trực tiếp, nhận góp ý nhanh, sửa những gì còn cấn và giữ mối liên hệ đủ gần để mỗi lần cập nhật đều có lý do rõ ràng.',
      'nếu bạn cần hỗ trợ, muốn góp ý hoặc chỉ đơn giản là muốn hỏi thêm về một món đồ, cứ để lại thông tin hoặc nhắn trực tiếp qua instagram. chúng tôi sẽ trả lời như một cuộc hội thoại thực sự.',
    ],
    title:
      'một thương hiệu tốt không chỉ làm ra sản phẩm đúng, mà còn phải phản hồi đúng lúc và đủ gần với người mặc.',
  },
]

function richTextToHtml(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value !== 'object') return ''

  const node = value as {
    text?: string
    type?: string
    format?: number
    tag?: string
    children?: unknown[]
    root?: { children?: unknown[] }
  }

  if (node.root?.children) {
    return node.root.children.map(richTextToHtml).join('')
  }

  if (typeof node.text === 'string') {
    let text = node.text
    if (!text) return ''
    if (typeof node.format === 'number') {
      if (node.format & 1) text = `<strong>${text}</strong>`
      if (node.format & 2) text = `<em>${text}</em>`
      if (node.format & 8) text = `<u>${text}</u>`
    }
    return text
  }

  const children = Array.isArray(node.children) ? node.children.map(richTextToHtml).join('') : ''

  switch (node.type) {
    case 'paragraph':
      return children ? `<p>${children}</p>` : ''
    case 'heading': {
      const tag = node.tag || 'h2'
      return children ? `<${tag}>${children}</${tag}>` : ''
    }
    case 'list':
      return node.tag === 'ol' ? `<ol>${children}</ol>` : `<ul>${children}</ul>`
    case 'listitem':
      return children ? `<li>${children}</li>` : ''
    default:
      return children
  }
}

function resolveMediaUrl(media: unknown): string | undefined {
  if (!media || typeof media !== 'object') return undefined
  const m = media as { url?: string; filename?: string; sourceUrl?: string }
  const src = m.sourceUrl || m.url || (m.filename ? `/media/${m.filename}` : undefined)
  if (!src) return undefined
  return src.startsWith('//') ? `https:${src}` : src
}

type CmsBlock = {
  blockType?: string
  heading?: string
  body?: unknown
  image?: unknown
}

// Convert the editable "our-story" page blocks (image-with-text / text-section)
// into story sections that render with the existing story-page layout.
function blocksToSections(blocks: unknown[]): StorySection[] {
  const sections: StorySection[] = []

  blocks.forEach((raw, index) => {
    const block = raw as CmsBlock
    if (block.blockType !== 'image-with-text' && block.blockType !== 'text-section') {
      return
    }
    const bodyHtml = richTextToHtml(block.body)
    const imageUrl = block.blockType === 'image-with-text' ? resolveMediaUrl(block.image) : undefined

    sections.push({
      key: `block-${index}`,
      title: block.heading || '',
      bodyHtml,
      media: imageUrl ? { alt: block.heading || 'điển', src: imageUrl } : undefined,
    })
  })

  return sections.filter((section) => section.title || section.bodyHtml || section.media)
}

function StoryPage({ sections }: { sections: StorySection[] }) {
  return (
    <section className="story-page bg-primary-background text-primary-text">
      <div className="story-page__sections">
        {sections.map((section, index) => (
          <section
            className={
              section.media
                ? 'story-page__section story-page__section--has-media'
                : 'story-page__section'
            }
            key={section.key}
          >
            <div className="story-page__content story-page__content--right">
              <div className="story-page__copy">
                {section.title && <h2>{section.title}</h2>}
                {section.bodyHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: section.bodyHtml }} />
                ) : (
                  section.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
                )}
              </div>
            </div>

            {section.media && (
              <div className="story-page__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={section.media.alt}
                  className="story-page__media-image"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  src={section.media.src}
                />
              </div>
            )}
          </section>
        ))}
      </div>
    </section>
  )
}

export default async function OurStoryPage() {
  // Editable in the admin: Pages -> "our story" -> Sections (Image with text /
  // Text section). When section blocks exist they drive the page; otherwise the
  // built-in Vietnamese content is shown so the page is never empty or stale.
  const page = await getPageBySlug('our-story')
  const cmsSections = Array.isArray(page?.sections) ? blocksToSections(page.sections) : []
  const sections = cmsSections.length > 0 ? cmsSections : fallbackSections

  return <StoryPage sections={sections} />
}
