import { createRequire } from 'module'
import path from 'path'

const require = createRequire(import.meta.url)

type PayloadClient = Awaited<ReturnType<typeof import('payload')['getPayload']>>

function patchNextEnvDefaultInterop() {
  const moduleIds = new Set<string>(['@next/env'])

  try {
    const payloadPackagePath = path.resolve(path.dirname(require.resolve('payload')), '..')
    moduleIds.add(require.resolve('@next/env', { paths: [payloadPackagePath] }))
  } catch {
    // Payload can resolve the top-level module in most installs.
  }

  for (const moduleId of moduleIds) {
    try {
      const nextEnv = require(moduleId)
      if (nextEnv && typeof nextEnv === 'object' && !nextEnv.default) {
        nextEnv.default = nextEnv
      }
    } catch {
      // Keep seeding resilient across package manager layouts.
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

async function findPage(payload: PayloadClient, slug: string) {
  const result = await payload.find({
    collection: 'pages',
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs[0] as { id: number | string } | undefined
}

const campaignImages = [
  'https://california-arts.com/cdn/shop/files/Asset_952_b21b3b1a-a717-4815-b78c-2d69319965c3_2048x2048.png?v=1734233428',
  'https://california-arts.com/cdn/shop/files/Asset_956_2048x2048.png?v=1734232488',
  'https://california-arts.com/cdn/shop/files/Asset_953_2048x2048.png?v=1734232404',
  'https://california-arts.com/cdn/shop/files/Asset_954_2048x2048.png?v=1734232431',
  'https://california-arts.com/cdn/shop/files/Asset_955_2048x2048.png?v=1734232469',
  'https://california-arts.com/cdn/shop/files/Asset_957_2048x2048.png?v=1734232554',
  'https://california-arts.com/cdn/shop/files/Asset_961_2048x2048.png?v=1734232528',
  'https://california-arts.com/cdn/shop/files/Asset_963_2048x2048.png?v=1734232689',
  'https://california-arts.com/cdn/shop/files/Asset_958_2048x2048.png?v=1734232449',
  'https://california-arts.com/cdn/shop/files/Asset_959_2048x2048.png?v=1734232458',
  'https://california-arts.com/cdn/shop/files/Asset_960_2048x2048.png?v=1734232511',
  'https://california-arts.com/cdn/shop/files/Asset_962_2048x2048.png?v=1734232695',
]

const campaignHtml = `
  <section class="cms-page__section cms-page__section--text">
    <div class="cms-page__inner"><p>FW24 Creative Campaign: "Corporate Holiday"</p></div>
  </section>
  <section class="cms-page__campaign-grid">
    ${campaignImages
      .map(
        (src) => `
          <a class="cms-page__image-link" href="/collections/coats-jackets">
            <img class="cms-page__campaign-image" src="${src}" alt="" />
          </a>
        `,
      )
      .join('')}
  </section>
  <section class="cms-page__section cms-page__section--text">
    <div class="cms-page__inner cms-page__narrow cms-page__center">
      <p><strong>Credits</strong></p>
      <p>Photography Logan Mock. Grooming Zaheer Sukhnandan. Talent Victor Ndigwe and Bret Fast. Creative Direction Gary Tam.</p>
      <p><a class="cms-page__button" href="/collections/shop-all">shop all</a></p>
    </div>
  </section>
`

const pages = [
  {
    title: 'customer care',
    slug: 'about',
    template: 'about',
    contentHtml: `
      <section class="cms-page__section cms-page__section--intro">
        <div class="cms-page__inner cms-page__narrow">
          <h1>customer care</h1>
          <p>for questions about shipping, returns and exchanges, please visit our <a href="/pages/returns-exchanges">shipping and returns</a> page.</p>
          <p>for accessibility, feedback and all other inquiries, email us at <strong>clientservices@california-arts.com</strong>.</p>
          <p>thank you for visiting california arts.</p>
        </div>
      </section>
      <section class="cms-page__section cms-page__section--text">
        <div class="cms-page__inner cms-page__right cms-page__narrow">
          <p>"good design makes a product useful."</p>
        </div>
      </section>
    `,
    seo: {
      title: 'customer care | california arts',
      description: 'customer care, shipping, returns, exchanges and contact information.',
    },
  },
  {
    title: 'our story',
    slug: 'our-story',
    template: 'our-story',
    contentHtml: `
      <section class="cms-page__section cms-page__section--intro">
        <div class="cms-page__inner cms-page__narrow">
          <p>01 our brand philosophy</p>
          <h1>the california arts and recreation board</h1>
          <p>we believe that art in our day-to-day is a driving force for a creative life. we pursue the mission of releasing beautiful design from exclusive pricing so we can all enjoy the luxury of art that inspires our everyday.</p>
          <p>live creatively. foster the deeper connections.</p>
        </div>
      </section>
      <section class="cms-page__section cms-page__section--text">
        <div class="cms-page__inner cms-page__narrow cms-page__center">
          <p>02 our production philosophy</p>
          <h2>california minimalism: accessible design by producing less and building better.</h2>
          <p>capturing the laid-back, effortless cool of california. inspired by the past, made for living in the present.</p>
          <p>we take the time to re-imagine one piece at a time, creating less but better modular staples.</p>
        </div>
      </section>
      <section class="cms-page__section cms-page__section--text">
        <div class="cms-page__inner cms-page__narrow cms-page__right">
          <p>03 founder notes</p>
          <p>i created california arts to release forward thinking design from inaccessible price points so we can all realize its benefit in our everyday.</p>
          <p>with gratitude and a full heart,<br />gt</p>
          <p><a class="cms-page__button" href="/collections/coats-jackets">shop all</a></p>
        </div>
      </section>
    `,
    seo: {
      title: 'our story | california arts',
      description: 'the california arts brand, production philosophy and founder notes.',
    },
  },
  {
    title: 'creative campaign',
    slug: 'campaign',
    template: 'campaign',
    contentHtml: campaignHtml,
    seo: {
      title: 'creative campaign | california arts',
      description: 'california arts creative campaign.',
    },
  },
  {
    title: 'new arrivals',
    slug: 'new-arrivals',
    template: 'standard',
    contentHtml: '<p><br/><br/><br/>the newest california arts pieces.</p>',
    seo: {
      title: 'new arrivals | california arts',
      description: 'the newest california arts pieces.',
    },
  },
  {
    title: 'shipping and returns',
    slug: 'returns-exchanges',
    template: 'policy',
    contentHtml: `
      <section class="cms-page__section cms-page__section--intro">
        <div class="cms-page__inner cms-page__narrow">
          <h1>shipping and returns</h1>
          <p>orders ship after payment confirmation. delivery windows may vary by destination and carrier.</p>
          <p>returns and exchanges are reviewed within the policy window. items must be unworn, unwashed and returned with original packaging.</p>
          <p>email <strong>clientservices@california-arts.com</strong> for help with an order.</p>
        </div>
      </section>
    `,
    seo: {
      title: 'shipping and returns | california arts',
      description: 'shipping, returns and exchange policy.',
    },
  },
  {
    title: 'privacy policy',
    slug: 'privacy-policy',
    template: 'policy',
    contentHtml: `
      <section class="cms-page__section cms-page__section--intro">
        <div class="cms-page__inner cms-page__narrow">
          <h1>privacy policy</h1>
          <p>we collect only the information needed to operate the storefront, process orders, provide customer care and improve the shopping experience.</p>
          <p>newsletter subscribers can unsubscribe at any time. customer data is handled with care and is not sold.</p>
          <p>for privacy requests, email <strong>clientservices@california-arts.com</strong>.</p>
        </div>
      </section>
    `,
    seo: {
      title: 'privacy policy | california arts',
      description: 'privacy policy for california arts.',
    },
  },
]

async function seedPages() {
  const payload = await loadPayloadClient()

  for (const page of pages) {
    const existing = await findPage(payload, page.slug)
    const data = {
      title: page.title,
      slug: page.slug,
      template: page.template,
      status: 'published',
      contentHtml: page.contentHtml.trim(),
      seo: page.seo,
    }

    if (existing) {
      await payload.update({ collection: 'pages', id: existing.id, data })
      console.log(`Updated page: ${page.slug}`)
    } else {
      await payload.create({ collection: 'pages', data })
      console.log(`Created page: ${page.slug}`)
    }
  }

  process.exit(0)
}

seedPages().catch((error) => {
  console.error(error)
  process.exit(1)
})
