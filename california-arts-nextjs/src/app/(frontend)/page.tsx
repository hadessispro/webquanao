import React from 'react'
import Link from 'next/link'
import { getHomeHeroData } from '@/lib/layout-data'

export default async function HomePage() {
  const hero = await getHomeHeroData()
  const desktopImage = hero.desktopImage
  const mobileImage = hero.mobileImage || desktopImage
  const eyebrow = hero.eyebrowVi || hero.eyebrow
  const title = hero.titleVi || hero.title
  const body = hero.bodyVi || hero.body
  const ctaLabel = hero.ctaLabelVi || hero.ctaLabel

  if (!hero.enabled || !desktopImage) {
    return <div className="home-page home-page--empty" />
  }

  return (
    <div className="home-page">
      <section
        className={[
          'home-hero',
          `home-hero--${hero.textPosition}`,
          `home-hero--text-${hero.textTheme}`,
        ].join(' ')}
      >
        <Link aria-label={ctaLabel || title || 'xem tất cả'} className="home-hero__link" href={hero.href}>
          <picture className="home-hero__picture">
            {mobileImage && <source media="(max-width: 767px)" srcSet={mobileImage.src} />}
            <img
              alt={desktopImage.alt || title || 'điển'}
              className="home-hero__image"
              src={desktopImage.src}
            />
          </picture>
          <span
            aria-hidden="true"
            className="home-hero__overlay"
            style={{ opacity: hero.overlayOpacity }}
          />
          {(eyebrow || title || body || ctaLabel) && (
            <span className="home-hero__content">
              {eyebrow && <span className="home-hero__eyebrow">{eyebrow}</span>}
              {title && <span className="home-hero__title">{title}</span>}
              {body && <span className="home-hero__body">{body}</span>}
              {ctaLabel && <span className="home-hero__cta">{ctaLabel}</span>}
            </span>
          )}
        </Link>
      </section>
    </div>
  )
}
