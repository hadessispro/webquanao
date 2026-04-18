import React from 'react'

export default function OurStoryPage() {
  return (
    <>
      {/* 01 Our Brand Philosophy */}
      <div className="category-header">
        <span>01 Our Brand Philosophy</span>
      </div>
      <section style={{ padding: '3rem var(--spacing-section-h)' }}>
        <div style={{ maxWidth: '500px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
            The California Arts &amp;<br />Recreation Board
          </h2>
          <div style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
            <p style={{ marginBottom: '1rem' }}>
              We believe that art is our day-to-day is a driving force for a creative life. But
              today, design in menswear is either produced by small brands with the same
              re-imagined styles or by luxury fashion houses at exclusive prices.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              We pursue the mission of releasing beautiful design from exclusive pricing so we
              can all enjoy the kind of art that inspires our everyday.
            </p>
            <p>
              Live creatively.<br />
              Foster deeper connections.
            </p>
          </div>
        </div>
      </section>

      {/* 02 Our Production Philosophy */}
      <div className="category-header">
        <span>02 Our Production Philosophy</span>
      </div>
      <section style={{ padding: '3rem var(--spacing-section-h)' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            California Minimalism
          </h3>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Accessible design by producing less &amp; building better.
          </p>

          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            West Coast Alternative
          </h3>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Capturing the laid-back, effortless cool of California. Inspired by the past, made
            for living in the present. The result is a fresh take on American sportswear that
            outlasts seasons after season.
          </p>

          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Modular Alternative
          </h3>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            We believe that the simplest things are the most complex. We take the time to
            re-imagine one piece at a time, creating less but better modular staples.
          </p>

          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Sustainable Alternative
          </h3>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
            We are critical with our textile choices, favoring natural and biodegradable
            materials over micro-plastic blends. From the lining to the stitching, we find
            creative ways to use and reuse fabrics and scraps.
          </p>
        </div>
      </section>

      {/* 03 Founder Notes */}
      <div className="category-header">
        <span>03 Founder Notes</span>
      </div>
      <section style={{ padding: '3rem var(--spacing-section-h)' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
            <p style={{ marginBottom: '1rem' }}>
              I believe that the people and the things we surround ourselves with, have the power
              to influence the way we navigate everyday life. Whether that&apos;s unconventional
              thinking, a pursuit of personal passions or a life of meaning.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              But I&apos;ve always wondered why good design was made at price points so few
              Americans could afford. I created California Arts™ to release forward thinking
              design from inaccessible price points so we can all realize its benefit in our
              everyday.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              With gratitude &amp; a full heart,<br />
              QV
            </p>
            <p>
              You can always reach me directly:<br />
              guy@california-arts.com
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
