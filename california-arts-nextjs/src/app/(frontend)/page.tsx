import React from 'react'
import Link from 'next/link'
import { getHomeHeroData } from '@/lib/layout-data'

export default async function HomePage() {
  const hero = await getHomeHeroData()
  const desktopImage = hero.desktopImage
  const mobileImage = hero.mobileImage || desktopImage

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
        <Link aria-label={hero.ctaLabel || hero.title || 'shop all'} className="home-hero__link" href={hero.href}>
          <picture className="home-hero__picture">
            {mobileImage && <source media="(max-width: 767px)" srcSet={mobileImage.src} />}
            <img
              alt={desktopImage.alt || hero.title || 'california arts'}
              className="home-hero__image"
              src={desktopImage.src}
            />
          </picture>
          <span
            aria-hidden="true"
            className="home-hero__overlay"
            style={{ opacity: hero.overlayOpacity }}
          />
          {(hero.eyebrow || hero.title || hero.body || hero.ctaLabel) && (
            <span className="home-hero__content">
              {hero.eyebrow && <span className="home-hero__eyebrow">{hero.eyebrow}</span>}
              {hero.title && <span className="home-hero__title">{hero.title}</span>}
              {hero.body && <span className="home-hero__body">{hero.body}</span>}
              {hero.ctaLabel && <span className="home-hero__cta">{hero.ctaLabel}</span>}
            </span>
          )}
        </Link>
      </section>
    </div>
  )
}
