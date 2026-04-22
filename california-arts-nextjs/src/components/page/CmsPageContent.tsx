import type { ReactNode } from 'react'
import type { CmsPageData } from '@/lib/pages-data'

export default function CmsPageContent({
  fallback,
  page,
}: {
  fallback?: ReactNode
  page: CmsPageData | null
}) {
  if (!page) return fallback

  if (fallback && page.template && page.template !== 'standard') {
    return fallback
  }

  if (!page.contentHtml) {
    return (
      <article className={`cms-page cms-page--${page.template || 'standard'}`}>
        <section className="cms-page__section cms-page__section--intro">
          <div className="cms-page__inner">
            <h1>{page.title}</h1>
          </div>
        </section>
      </article>
    )
  }

  return (
    <article
      className={`cms-page cms-page--${page.template || 'standard'}`}
      dangerouslySetInnerHTML={{ __html: page.contentHtml }}
    />
  )
}
