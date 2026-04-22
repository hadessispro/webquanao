import type { ReactNode } from 'react'
import Link from 'next/link'
import CmsPageContent from '@/components/page/CmsPageContent'
import { getPageBySlug } from '@/lib/pages-data'

function TextColumnHeader({ children }: { children: ReactNode }) {
  return (
    <div className="shopify-section c_text-columns-section our-story-page__bar">
      <section className="bg-primary-background text-primary-text overflow-hidden border-t-grid border-b-grid border-grid-color">
        <div className="px-8 lg:px-8 py-2">
          <div className="multi-column col-gap-lg lg:col-count-4 space-y-2 text-left text-base lg:text-base">
            <div className="rte px-4 text-sm">
              <p>{children}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function RichTextSection({
  children,
  placement = 'start',
  sectionClassName = '',
  textSize = 'text-sm',
}: {
  children: ReactNode
  placement?: 'start' | 'center' | 'end'
  sectionClassName?: string
  textSize?: string
}) {
  return (
    <div className={`shopify-section our-story-page__copy-section ${sectionClassName}`.trim()}>
      <section className="bg-primary-background text-primary-text overflow-hidden border-t-grid border-transparent">
        <div className={`our-story-page__copy-wrap ${textSize} default text-left`}>
          <div className={`our-story-page__copy-slot our-story-page__copy-slot--${placement}`}>
            <div className="rte font-body break-words our-story-page__copy">{children}</div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Spacer() {
  return (
    <RichTextSection
      sectionClassName="our-story-page__copy-section--spacer"
      textSize="text-2xl lg:text-5xl"
    >
      <p>
        <br />
      </p>
      <p>
        <br />
      </p>
    </RichTextSection>
  )
}

function OurStoryFallback() {
  return (
    <div className="our-story-page">
      <TextColumnHeader>01 Our Brand Philosophy</TextColumnHeader>

      <RichTextSection sectionClassName="our-story-page__copy-section--brand">
        <p>
          <strong>
            The California Arts &amp;
            <br />
            Recreation Board
          </strong>
          <br />
          <br />
          We believe that art in our day-to-day
          <br />
          is a driving force for a creative life. But
          <br />
          today, design in menswear is either
          <br />
          produced by mall brands with the same
          <br />
          un-inspired styles or by luxury fashion
          <br />
          houses at exclusive prices.
        </p>
        <p>
          We pursue the mission of releasing
          <br />
          beautiful design from exclusive pricing
          <br />
          so we can all enjoy the luxury of art
          <br />
          that inspires our everyday.
          <br />
          <br />
          Live creatively.
          <br />
          Foster the deeper connections.
        </p>
      </RichTextSection>

      <TextColumnHeader>02 Our Production Philosophy</TextColumnHeader>

      <RichTextSection
        placement="center"
        sectionClassName="our-story-page__copy-section--production"
      >
        <p>
          <strong>
            California Minimalism:
            <br />
          </strong>
          Accessible design by producing less &amp;
          <br />
          building better.
        </p>
        <p>
          <br />
        </p>
        <p>
          <em>West Coast Minimalism</em>
        </p>
        <p>
          Capturing the laid-back, effortless cool of
          <br />
          California. Inspired by the past, made for living
          <br />
          in the present. The result is a fresh take on
          <br />
          American sportswear that endures season
          <br />
          after season.
        </p>
        <p>
          <em>Modular Minimalism</em>
        </p>
        <p>
          We believe that the simplest things are the most
          <br />
          complex. We take the time to re-imagine one
          <br />
          piece at a time, creating less but better modular
          <br />
          staples. By avoiding multi-piece collections and
          <br />
          seasonal fashion calendars, we minimize excess
          <br />
          inventory and trend-based waste.
        </p>
        <p>
          <em>Sustainable Minimalism</em>
        </p>
        <p>
          We are critical with our textile choices,
          <br />
          favouring natural and biodegradable materials
          <br />
          over micro-plastic blends. From the lining to
          <br />
          the exteriors, we find creative ways to use and
          <br />
          reuse fabrics and scraps.
        </p>
      </RichTextSection>

      <Spacer />

      <TextColumnHeader>03 Founder Notes</TextColumnHeader>

      <RichTextSection placement="end" sectionClassName="our-story-page__copy-section--founder">
        <p>
          I believe that the people and the things we
          <br />
          surround ourselves with, have the power to
          <br />
          influence the way we navigate everyday life.
          <br />
          Whether that&apos;s unconventional thinking, a
          <br />
          pursuit of personal passions or a life of
          <br />
          meaning. For me, it was a release from a
          <br />
          corporate 9-5 to build a brand that has
          <br />
          renewed my sense of purpose.
          <br />
          <br />
          But I&apos;ve always wondered why good design
          <br />
          was made at price points so few Americans
          <br />
          could afford. I created California Arts&trade;
          <br />
          to release forward thinking design from
          <br />
          inaccessible price points so we can all
          <br />
          realize its benefit in our everyday.
        </p>
        <p>
          With gratitude &amp; a full heart,
          <br />
          GT
        </p>
        <p>
          <br />
          You can always reach me directly.
          <br />
          gary@california-arts.com
        </p>
      </RichTextSection>

      <RichTextSection
        sectionClassName="our-story-page__copy-section--spacer"
        textSize="text-2xl lg:text-5xl"
      >
        <p />
        <p>
          <br />
          <br />
        </p>
      </RichTextSection>

      <div className="shopify-section our-story-page__cta-section">
        <section className="bg-primary-background text-primary-text overflow-hidden border-t-grid border-transparent">
          <div className="px-8 lg:px-8 pb-4">
            <div className="flex text-base default text-right justify-start">
              <div className="w-full lg:w-full">
                <div className="rte font-body break-words px-4">
                  <p>
                    <br />
                  </p>
                  <p>Discover the Perennial Collection</p>
                </div>
                <div className="mt-4 text-0 px-4">
                  <Link
                    className="inline-flex justify-center items-center text-base px-8 py-2 rounded-full bg-transparent text-primary-text border-text border-primary-text hover:border-primary-accent hover:text-primary-accent"
                    href="/collections/coats-jackets"
                  >
                    <span>Shop All</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default async function OurStoryPage() {
  const page = await getPageBySlug('our-story')

  return <CmsPageContent page={page} fallback={<OurStoryFallback />} />
}
