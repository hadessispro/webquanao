/**
 * Pre-fills the "Xem tất cả" (shop-all) collection with 21 customizable sticky sections
 * so admins can edit category headers, descriptions, and badges directly from
 * Admin -> Collections -> Xem tất cả -> View All sections.
 *
 * Idempotent: If "shop-all" already exists, it verifies viewAllSections and only updates
 * if sections are empty.
 *
 * Run: npm run seed:shop-all
 */
import { createRequire } from 'module'
import path from 'path'

const require = createRequire(import.meta.url)

type PayloadClient = Awaited<ReturnType<(typeof import('payload'))['getPayload']>>

function patchNextEnvDefaultInterop() {
  const moduleIds = new Set<string>(['@next/env'])
  try {
    const payloadPackagePath = path.resolve(path.dirname(require.resolve('payload')), '..')
    moduleIds.add(require.resolve('@next/env', { paths: [payloadPackagePath] }))
  } catch {
    // ignore
  }
  for (const moduleId of moduleIds) {
    try {
      const nextEnv = require(moduleId)
      if (nextEnv && typeof nextEnv === 'object' && !nextEnv.default) {
        nextEnv.default = nextEnv
      }
    } catch {
      // ignore
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

async function seed() {
  const [{ VIEW_ALL_SECTION_BAR_DEFAULTS }, { DEFAULT_COLLECTION_INTRO_HTML }] = await Promise.all([
    import('../src/lib/collection-bar-content'),
    import('../src/lib/collection-bar-content'),
  ])

  const payload = await loadPayloadClient()

  const existing = await payload.find({
    collection: 'product-collections',
    where: { handle: { equals: 'shop-all' } },
  })

  if (existing.docs.length === 0) {
    await payload.create({
      collection: 'product-collections',
      data: {
        title: 'Xem tất cả',
        handle: 'shop-all',
        descriptionHtml: DEFAULT_COLLECTION_INTRO_HTML,
        status: 'published',
        viewAllSections: VIEW_ALL_SECTION_BAR_DEFAULTS,
      },
    })
    console.log('Successfully created "shop-all" collection with 21 sections in Payload.')
  } else {
    const doc = existing.docs[0] as { id: number | string; viewAllSections?: unknown[] }
    if (!Array.isArray(doc.viewAllSections) || doc.viewAllSections.length === 0) {
      await payload.update({
        collection: 'product-collections',
        id: doc.id,
        data: {
          viewAllSections: VIEW_ALL_SECTION_BAR_DEFAULTS,
        },
      })
      console.log('Populated 21 sections into existing "shop-all" collection.')
    } else {
      console.log(`"shop-all" collection already exists with ${doc.viewAllSections.length} sections. Preserving existing data.`)
    }
  }

  process.exit(0)
}

seed().catch((error) => {
  console.error('Failed to seed shop-all collection:', error)
  process.exit(1)
})
