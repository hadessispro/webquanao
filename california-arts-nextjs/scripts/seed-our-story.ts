// Pre-fills the "our story" (về điển) page with editable section blocks holding
// the Vietnamese content, so the admin can edit text/images from Pages -> our
// story -> Sections. Idempotent: re-running replaces the section blocks.
//
// Run: npm run seed:our-story
import { createRequire } from 'module'
import path from 'path'

const require = createRequire(import.meta.url)

type PayloadClient = Awaited<ReturnType<(typeof import('payload'))['getPayload']>>

function patchNextEnvDefaultInterop() {
  const moduleIds = new Set<string>(['@next/env'])
  try {
    const payloadPackagePath = path.resolve(path.dirname(require.resolve('payload')), '..')
    moduleIds.add(require.resolve('@next/env', { paths: [payloadPackagePath] }))
  } catch {
    // ignore
  }
  for (const moduleId of moduleIds) {
    try {
      const nextEnv = require(moduleId)
      if (nextEnv && typeof nextEnv === 'object' && !nextEnv.default) {
        nextEnv.default = nextEnv
      }
    } catch {
      // ignore
    }
  }
}

async function loadPayloadClient(): Promise<PayloadClient> {
  patchNextEnvDefaultInterop()
  const [{ getPayload }, configModule] = await Promise.all([
    import('payload'),
    import('../payload.config'),
  ])
  return getPayload({ config: configModule.default })
}

function lexicalParagraphs(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        children: [
          { type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 },
        ],
      })),
    },
  }
}

const HERO_IMAGE_FILENAME = 'nha-trang-6h.webp'

const sections = {
  one: {
    heading:
      'mỗi sản phẩm được làm ra để sống cùng đời thường, không chỉ để trưng bày trong một mùa.',
    body: [
      'điển bắt đầu từ mong muốn đưa quần áo đẹp quay lại đúng nhịp sống hằng ngày. chúng tôi không chạy theo quá nhiều bộ sưu tập hay nhịp phát hành dồn dập, mà muốn mỗi món đồ đứng được lâu, mặc được nhiều và gợi đúng cảm giác sống cùng nó.',
      'điều chúng tôi theo đuổi là sự rõ ràng trong phom, vật liệu và cảm xúc sử dụng. một chiếc áo, một chiếc quần hay một lớp ngoài đều cần đủ đẹp để giữ lại, nhưng cũng đủ bình tĩnh để không lỗi thời sau một mùa.',
    ],
  },
  two: {
    heading:
      'thiết kế của điển hướng tới sự mạch lạc: ít chi tiết hơn, cân đối hơn và bền hơn trong cách mặc.',
    body: [
      'chúng tôi làm theo hướng ít hơn nhưng chặt hơn: chọn lọc vật liệu, giữ bộ khung màu gọn, cắt giảm những chi tiết trang trí dư thừa và ưu tiên các tỉ lệ mặc được lâu. cách tiếp cận đó giúp mỗi sản phẩm dễ phối, dễ lặp lại trong tủ đồ và không bị trôi quá nhanh khỏi đời sống thực tế.',
      'thay vì mở rộng vô hạn, điển giữ nhịp phát triển vừa phải để đội ngũ có thể nhìn kỹ từng bản fit, từng ảnh chụp và từng phản hồi của khách hàng trước khi đưa ra đợt tiếp theo.',
    ],
  },
  three: {
    heading:
      'một thương hiệu tốt không chỉ làm ra sản phẩm đúng, mà còn phải phản hồi đúng lúc và đủ gần với người mặc.',
    body: [
      'điển không cố tạo khoảng cách với người mặc. chúng tôi muốn thương hiệu có thể nói chuyện trực tiếp, nhận góp ý nhanh, sửa những gì còn cấn và giữ mối liên hệ đủ gần để mỗi lần cập nhật đều có lý do rõ ràng.',
      'nếu bạn cần hỗ trợ, muốn góp ý hoặc chỉ đơn giản là muốn hỏi thêm về một món đồ, cứ để lại thông tin hoặc nhắn trực tiếp qua instagram. chúng tôi sẽ trả lời như một cuộc hội thoại thực sự.',
    ],
  },
}

async function findOrCreateHeroImage(payload: PayloadClient): Promise<number | string | undefined> {
  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    where: { filename: { equals: HERO_IMAGE_FILENAME } },
  })
  if (existing.docs[0]) {
    return (existing.docs[0] as { id: number | string }).id
  }

  try {
    const created = await payload.create({
      collection: 'media',
      data: { alt: 'điển campaign on the coast' },
      filePath: path.resolve(process.cwd(), 'public/media', HERO_IMAGE_FILENAME),
    })
    return (created as { id: number | string }).id
  } catch (err) {
    console.warn(
      `Could not create hero image (${HERO_IMAGE_FILENAME}); section 1 will have no image.`,
      err instanceof Error ? err.message : err,
    )
    return undefined
  }
}

async function seed() {
  const payload = await loadPayloadClient()

  const found = await payload.find({
    collection: 'pages',
    limit: 1,
    where: { slug: { equals: 'our-story' } },
  })
  const page = found.docs[0] as { id: number | string } | undefined

  const imageId = await findOrCreateHeroImage(payload)

  const blocks: Record<string, unknown>[] = [
    {
      blockType: 'image-with-text',
      heading: sections.one.heading,
      body: lexicalParagraphs(sections.one.body),
      imagePosition: 'right',
      ...(imageId ? { image: imageId } : {}),
    },
    {
      blockType: 'text-section',
      heading: sections.two.heading,
      body: lexicalParagraphs(sections.two.body),
    },
    {
      blockType: 'text-section',
      heading: sections.three.heading,
      body: lexicalParagraphs(sections.three.body),
    },
  ]

  const data = {
    title: 'về điển',
    slug: 'our-story',
    template: 'our-story',
    status: 'published',
    // Clear the legacy English HTML so it can never override the sections.
    contentHtml: '',
    sections: blocks,
    seo: {
      title: 'về điển | điển',
      description: 'câu chuyện và cách làm của điển.',
    },
  }

  if (page) {
    await payload.update({ collection: 'pages', id: page.id, data })
    console.log('Updated "our-story" page with Vietnamese section blocks.')
  } else {
    await payload.create({ collection: 'pages', data })
    console.log('Created "our-story" page with Vietnamese section blocks.')
  }

  process.exit(0)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
