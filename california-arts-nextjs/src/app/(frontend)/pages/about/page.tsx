import React from 'react'

export default function AboutPage() {
  return (
    <section style={{ padding: '3rem var(--spacing-section-h)' }}>
      <div style={{ maxWidth: '600px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '2rem' }}>
          Contact
        </h1>
        <div style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
          <p style={{ marginBottom: '1rem' }}>
            For any inquiries, please reach out to us:
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Email:</strong> support@california-arts.com
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Instagram:</strong> @california.arts
          </p>
          <p style={{ marginBottom: '2rem' }}>
            <strong>Location:</strong> Southern California
          </p>
        </div>

        {/* Contact Form */}
        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxWidth: '400px',
          }}
        >
          <div>
            <label style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
              Name
            </label>
            <input
              type="text"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: 'none',
                borderBottom: '1px solid var(--color-text)',
                background: 'transparent',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
              Email
            </label>
            <input
              type="email"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: 'none',
                borderBottom: '1px solid var(--color-text)',
                background: 'transparent',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
              Message
            </label>
            <textarea
              rows={4}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid var(--color-border)',
                background: 'transparent',
                fontSize: '0.875rem',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>
          <button className="btn btn-primary" type="submit" style={{ alignSelf: 'flex-start' }}>
            Send
          </button>
        </form>
      </div>
    </section>
  )
}
