import type { ReactNode } from 'react'
import type { CmsPageData } from '@/lib/pages-data'
import { richTextToHtml } from '@/lib/rich-text'

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
