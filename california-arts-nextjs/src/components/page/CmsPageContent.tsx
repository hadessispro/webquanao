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

export default function CmsPageContent({
  fallback,
  page,
}: {
  fallback?: ReactNode
  page: CmsPageData | null
}) {
  if (!page) return fallback

  const bodyHtml = page.contentHtml || richTextToHtml(page.content)

  if (!bodyHtml && (!page.sections || page.sections.length === 0)) {
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
    </article>
  )
}
