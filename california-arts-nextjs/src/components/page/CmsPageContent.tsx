import type { ReactNode } from 'react'
import type { CmsPageData } from '@/lib/pages-data'

function richTextToHtml(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value !== 'object') return ''

  const node = value as {
    text?: string
    type?: string
    format?: number
    bold?: boolean
    italic?: boolean
    children?: unknown[]
    root?: { children?: unknown[] }
    tag?: string
  }

  if (node.root?.children) {
    return node.root.children.map(richTextToHtml).join('')
  }

  if (typeof node.text === 'string') {
    let text = node.text
    if (!text) return ''
    const isBold = Boolean(node.bold || (typeof node.format === 'number' && (node.format & 1)))
    const isItalic = Boolean(node.italic || (typeof node.format === 'number' && (node.format & 2)))
    const isUnderline = Boolean(typeof node.format === 'number' && (node.format & 8))
    const isStrikethrough = Boolean(typeof node.format === 'number' && (node.format & 16))

    if (isBold) text = `<strong>${text}</strong>`
    if (isItalic) text = `<em>${text}</em>`
    if (isUnderline) text = `<u>${text}</u>`
    if (isStrikethrough) text = `<s>${text}</s>`
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
    case 'quote':
      return children ? `<blockquote>${children}</blockquote>` : ''
    default:
      return children
  }
}

type MediaLike =
  | number
  | string
  | {
      url?: string
      filename?: string
      sourceUrl?: string
      alt?: string
    }
  | null
  | undefined

// Resolve the public URL for an uploaded media object. Prefer an external source
// URL, then the URL Payload serves the file from (/api/media/file/<name>), then
// the public /media folder as a last resort.
function resolveMediaUrl(media: MediaLike): string | undefined {
  if (!media || typeof media === 'number' || typeof media === 'string') return undefined
  const src = media.sourceUrl || media.url || (media.filename ? `/media/${media.filename}` : undefined)
  if (!src) return undefined
  return src.startsWith('//') ? `https:${src}` : src
}

type CmsBlock = {
  blockType?: string
  heading?: string
  subheading?: string
  body?: unknown
  image?: MediaLike
  imagePosition?: 'left' | 'right'
  ctaText?: string
  ctaLink?: string
  rows?: Array<{ title?: string; content?: unknown }>
}

function CmsBlocks({ blocks, title }: { blocks: CmsBlock[]; title: string }) {
  return (
    <>
      {blocks.map((block, index) => {
        const key = `${block.blockType || 'block'}-${index}`

        switch (block.blockType) {
          case 'hero': {
            const imageUrl = resolveMediaUrl(block.image)
            return (
              <section className="cms-page__section cms-page__section--hero" key={key}>
                {imageUrl && (
                  <div className="cms-page__hero-media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt={block.heading || title} src={imageUrl} />
                  </div>
                )}
                <div className="cms-page__inner cms-page__narrow">
                  {block.heading && <h1>{block.heading}</h1>}
                  {block.subheading && <p>{block.subheading}</p>}
                  {block.ctaText && block.ctaLink && (
                    <a className="cms-page__button" href={block.ctaLink}>
                      {block.ctaText}
                    </a>
                  )}
                </div>
              </section>
            )
          }
          case 'text-section': {
            const bodyHtml = richTextToHtml(block.body)
            return (
              <section className="cms-page__section" key={key}>
                <div className="cms-page__inner cms-page__narrow">
                  {block.heading && <h2>{block.heading}</h2>}
                  {bodyHtml && <div className="rte" dangerouslySetInnerHTML={{ __html: bodyHtml }} />}
                </div>
              </section>
            )
          }
          case 'image-with-text': {
            const imageUrl = resolveMediaUrl(block.image)
            const bodyHtml = richTextToHtml(block.body)
            return (
              <section
                className={`cms-page__section cms-page__section--image-text cms-page__section--image-${block.imagePosition || 'left'}`}
                key={key}
              >
                <div className="cms-page__image-text">
                  {imageUrl && (
                    <div className="cms-page__image-text-media">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt={block.heading || title} src={imageUrl} />
                    </div>
                  )}
                  <div className="cms-page__image-text-copy">
                    {block.heading && <h2>{block.heading}</h2>}
                    {bodyHtml && <div className="rte" dangerouslySetInnerHTML={{ __html: bodyHtml }} />}
                  </div>
                </div>
              </section>
            )
          }
          case 'collapsible-rows': {
            return (
              <section className="cms-page__section" key={key}>
                <div className="cms-page__inner cms-page__narrow">
                  {block.heading && <h2>{block.heading}</h2>}
                  {(block.rows || []).map((row, rowIndex) => {
                    const rowHtml = richTextToHtml(row.content)
                    return (
                      <details className="cms-page__row" key={`${key}-row-${rowIndex}`}>
                        <summary>{row.title}</summary>
                        {rowHtml && <div className="rte" dangerouslySetInnerHTML={{ __html: rowHtml }} />}
                      </details>
                    )
                  })}
                </div>
              </section>
            )
          }
          default:
            return null
        }
      })}
    </>
  )
}

export default function CmsPageContent({
  fallback,
  page,
}: {
  fallback?: ReactNode
  page: CmsPageData | null
}) {
  if (!page) return fallback

  const bodyHtml = page.contentHtml || richTextToHtml(page.content)
  const blocks = Array.isArray(page.sections) ? (page.sections as CmsBlock[]) : []
  const hasBlocks = blocks.length > 0

  if (!bodyHtml && !hasBlocks) {
    return (
      <article className={`cms-page cms-page--${page.template || 'standard'}`}>
        <section className="cms-page__section cms-page__section--intro">
          <div className="cms-page__inner cms-page__narrow">
            <h1>{page.title}</h1>
          </div>
        </section>
      </article>
    )
  }

  return (
    <article className={`cms-page cms-page--${page.template || 'standard'}`}>
      {bodyHtml && (
        <section className="cms-page__section">
          <div
            className="cms-page__inner cms-page__narrow"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </section>
      )}
      {hasBlocks && <CmsBlocks blocks={blocks} title={page.title} />}
    </article>
  )
}
