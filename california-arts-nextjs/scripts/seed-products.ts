/**
 * Import Shopify-exported product, collection, media, and header data into Payload.
 *
 * Usage:
 *   npx tsx scripts/seed-products.ts
 *
 * Optional:
 *   SKIP_MEDIA_DOWNLOAD=1 npx tsx scripts/seed-products.ts
 *   ARCHIVE_STALE_PRODUCTS=1 npx tsx scripts/seed-products.ts
 */

import productsData from '../json/products-json.json'
import collectionsData from '../json/collections-json.json'
import { DEFAULT_FOOTER, DEFAULT_HEADER } from '../src/lib/storefront-types'
import fs from 'fs/promises'
import path from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)

type PayloadClient = Awaited<ReturnType<typeof import('payload')['getPayload']>>

function patchNextEnvDefaultInterop() {
  const moduleIds = new Set<string>(['@next/env'])

  try {
    const payloadPackagePath = path.resolve(
      path.dirname(require.resolve('payload')),
      '..',
    )
    moduleIds.add(
      require.resolve('@next/env', {
        paths: [payloadPackagePath],
      }),
    )
  } catch {
    // Optional compatibility path; the top-level module is enough in some installs.
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

interface ShopifyImage {
  id: number
  src: string
  position: number
  width: number
  height: number
  alt?: string | null
  variant_ids: number[]
}

interface ShopifyVariant {
  id: number
  title: string
  option1: string | null
  option2: string | null
  option3: string | null
  sku: string
  price: string
  compare_at_price: string | null
  available: boolean
  featured_image: {
    id?: number
    src: string
    alt: string | null
    width?: number
    height?: number
    position?: number
  } | null
}

interface ShopifyProduct {
  id: number
  title: string
  handle: string
  body_html: string
  vendor: string
  product_type: string
  tags: string[]
  variants: ShopifyVariant[]
  images: ShopifyImage[]
  options: Array<{
    name: string
    position: number
    values: string[]
  }>
  published_at: string
  created_at: string
  updated_at: string
}

interface ShopifyCollection {
  id: number
  title: string
  handle: string
  description: string
  published_at: string
  updated_at: string
  image: { src?: string } | null
  products_count: number
}

type PayloadId = string | number

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const projectRoot = path.resolve(dirname, '..')
const tempDir = path.join(projectRoot, '.tmp-import-media')
const skipMediaDownload = process.env.SKIP_MEDIA_DOWNLOAD === '1'
const archiveStaleProducts = process.env.ARCHIVE_STALE_PRODUCTS === '1'

function normalizeUrl(src?: string | null): string {
  if (!src) return ''
  return src.startsWith('//') ? `https:${src}` : src
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function filenameFromUrl(src: string, fallback: string): string {
  try {
    const url = new URL(src)
    const basename = path.basename(url.pathname)
    return basename || fallback
  } catch {
    return fallback
  }
}

async function findOne(payload: PayloadClient, collection: string, field: string, value: string | number) {
  const result = await payload.find({
    collection: collection as never,
    limit: 1,
    where: {
      [field]: {
        equals: value,
      },
    },
  } as never)

  return result.docs[0] as { id: PayloadId } | undefined
}

async function downloadToTemp(src: string, preferredFilename: string): Promise<{ filePath: string; contentType: string }> {
  await fs.mkdir(tempDir, { recursive: true })

  const response = await fetch(src)
  if (!response.ok) {
    throw new Error(`Failed to download ${src}: ${response.status} ${response.statusText}`)
  }

  const contentType = response.headers.get('content-type') || 'application/octet-stream'
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const safeFilename = preferredFilename.replace(/[^a-zA-Z0-9._-]/g, '-')
  const filePath = path.join(tempDir, `${Date.now()}-${safeFilename}`)

  await fs.writeFile(filePath, buffer)
  return { filePath, contentType }
}

async function upsertMedia(
  payload: PayloadClient,
  image: {
    id?: number
    src?: string | null
    alt?: string | null
    width?: number
    height?: number
  },
  fallbackAlt: string,
): Promise<PayloadId | undefined> {
  const sourceUrl = normalizeUrl(image.src)
  if (!sourceUrl) return undefined

  const existing = await findOne(payload, 'media', 'sourceUrl', sourceUrl)
  if (existing) return existing.id

  if (skipMediaDownload) return undefined

  const sourceFilename = filenameFromUrl(sourceUrl, `${slugify(fallbackAlt)}.jpg`)
  const { filePath } = await downloadToTemp(sourceUrl, sourceFilename)

  try {
    const created = await payload.create({
      collection: 'media',
      data: {
        alt: image.alt || fallbackAlt,
        source: 'shopify',
        sourceUrl,
        sourceId: image.id ? String(image.id) : undefined,
        sourceFilename,
        originalWidth: image.width,
        originalHeight: image.height,
      },
      filePath,
    } as never)

    return (created as { id: PayloadId }).id
  } finally {
    await fs.rm(filePath, { force: true })
  }
}

function inferCollectionIds(
  product: ShopifyProduct,
  collectionsByHandle: Map<string, { id: PayloadId; title: string; handle: string }>,
): PayloadId[] {
  const productTokens = new Set([
    ...product.tags.map(slugify),
    slugify(product.product_type || ''),
    slugify(product.handle),
  ])

  const ids: PayloadId[] = []

  for (const collection of collectionsByHandle.values()) {
    const handle = slugify(collection.handle)
    const title = slugify(collection.title)

    if (productTokens.has(handle) || productTokens.has(title)) {
      ids.push(collection.id)
      continue
    }

    for (const token of productTokens) {
      if (token.length >= 4 && (handle.includes(token) || title.includes(token))) {
        ids.push(collection.id)
        break
      }
    }
  }

  return Array.from(new Set(ids))
}

async function upsertCollections(payload: PayloadClient) {
  const collections = (collectionsData as { collections: ShopifyCollection[] }).collections
  const byHandle = new Map<string, { id: PayloadId; title: string; handle: string }>()

  for (const collection of collections) {
    const existing =
      (await findOne(payload, 'product-collections', 'shopifyId', collection.id)) ||
      (await findOne(payload, 'product-collections', 'handle', collection.handle))

    const data = {
      shopifyId: collection.id,
      title: collection.title,
      handle: collection.handle,
      descriptionHtml: collection.description || '',
      sourceImageUrl: normalizeUrl(collection.image?.src),
      productsCount: collection.products_count,
      status: 'published',
      showInMenu: false,
      publishedAt: collection.published_at || undefined,
      shopifyUpdatedAt: collection.updated_at || undefined,
    }

    const doc = existing
      ? await payload.update({ collection: 'product-collections', id: existing.id, data } as never)
      : await payload.create({ collection: 'product-collections', data } as never)

    byHandle.set(collection.handle, {
      id: (doc as { id: PayloadId }).id,
      title: collection.title,
      handle: collection.handle,
    })
  }

  return byHandle
}

async function upsertProducts(
  payload: PayloadClient,
  collectionsByHandle: Map<string, { id: PayloadId; title: string; handle: string }>,
) {
  const products = (productsData as { products: ShopifyProduct[] }).products
  const importedHandles = new Set<string>()

  for (const product of products) {
    importedHandles.add(product.handle)

    const imageMediaBySourceUrl = new Map<string, PayloadId>()
    for (const image of product.images) {
      const mediaId = await upsertMedia(payload, image, `${product.title} ${image.position}`)
      if (mediaId) imageMediaBySourceUrl.set(normalizeUrl(image.src), mediaId)
    }

    for (const variant of product.variants) {
      if (!variant.featured_image?.src) continue
      const src = normalizeUrl(variant.featured_image.src)
      if (imageMediaBySourceUrl.has(src)) continue

      const mediaId = await upsertMedia(payload, variant.featured_image, `${product.title} ${variant.title}`)
      if (mediaId) imageMediaBySourceUrl.set(src, mediaId)
    }

    const collectionIds = inferCollectionIds(product, collectionsByHandle)
    const existing =
      (await findOne(payload, 'products', 'shopifyId', product.id)) ||
      (await findOne(payload, 'products', 'handle', product.handle))

    const data = {
      shopifyId: product.id,
      title: product.title,
      handle: product.handle,
      bodyHtml: product.body_html || '',
      productType: product.product_type || '',
      vendor: product.vendor || 'California Arts',
      status: 'active',
      collections: collectionIds,
      tags: product.tags.map((tag) => ({ tag })),
      options: product.options.map((option) => ({
        name: option.name,
        position: option.position,
        values: option.values.map((value) => ({ value })),
      })),
      images: product.images.map((image) => {
        const src = normalizeUrl(image.src)
        return {
          shopifyImageId: image.id,
          image: imageMediaBySourceUrl.get(src),
          sourceUrl: src,
          alt: image.alt || product.title,
          position: image.position,
          width: image.width,
          height: image.height,
          variantIds: image.variant_ids.map((shopifyVariantId) => ({ shopifyVariantId })),
        }
      }),
      variants: product.variants.map((variant) => {
        const featuredSrc = normalizeUrl(variant.featured_image?.src)
        return {
          shopifyVariantId: variant.id,
          title: variant.title,
          sku: variant.sku || '',
          option1: variant.option1 || '',
          option2: variant.option2 || '',
          option3: variant.option3 || '',
          price: parseInt(variant.price, 10),
          compareAtPrice: variant.compare_at_price ? parseInt(variant.compare_at_price, 10) : undefined,
          available: variant.available,
          featuredImage: featuredSrc ? imageMediaBySourceUrl.get(featuredSrc) : undefined,
          featuredImageSourceUrl: featuredSrc,
        }
      }),
      accordions: [
        ...(product.body_html ? [{ title: 'Details', content: undefined }] : []),
        { title: 'Size & Fit', content: undefined },
        { title: 'Sustainability', content: undefined },
        { title: 'Shipping & Returns', content: undefined },
        { title: 'Need Assistance?', content: undefined },
      ],
      publishedAt: product.published_at || undefined,
      shopifyCreatedAt: product.created_at || undefined,
      shopifyUpdatedAt: product.updated_at || undefined,
      seo: {
        title: `${product.title} | California Arts`,
        description: product.body_html?.replace(/<[^>]*>/g, '').slice(0, 160),
      },
    }

    if (existing) {
      await payload.update({ collection: 'products', id: existing.id, data } as never)
      console.log(`Updated product: ${product.title}`)
    } else {
      await payload.create({ collection: 'products', data } as never)
      console.log(`Created product: ${product.title}`)
    }
  }

  if (archiveStaleProducts) {
    const current = await payload.find({
      collection: 'products',
      limit: 1000,
      where: {
        status: {
          equals: 'active',
        },
      },
    })

    for (const doc of current.docs as Array<{ id: PayloadId; handle?: string; title?: string }>) {
      if (!doc.handle || importedHandles.has(doc.handle)) continue
      await payload.update({
        collection: 'products',
        id: doc.id,
        data: { status: 'archived' },
      } as never)
      console.log(`Archived stale product: ${doc.title || doc.handle}`)
    }
  }
}

async function seedHeader(payload: PayloadClient) {
  await payload.updateGlobal({
    slug: 'header',
    data: {
      logoText: DEFAULT_HEADER.logoText,
      logoAlt: DEFAULT_HEADER.logoAlt,
      logoHref: DEFAULT_HEADER.logoHref,
      shippingBar: DEFAULT_HEADER.shippingBar,
      countrySelector: DEFAULT_HEADER.countrySelector,
      navigation: DEFAULT_HEADER.navigation.map((item) => ({
        label: item.label,
        href: item.href,
        openInNewTab: item.openInNewTab || false,
        megaMenu: item.megaMenu
          ? {
              enabled: item.megaMenu.enabled,
              columns: item.megaMenu.columns.map((column) => ({
                heading: column.heading,
                headingHref: column.headingHref,
                links: column.links,
              })),
              imageCards: item.megaMenu.imageCards.map((card) => ({
                caption: card.caption,
                href: card.href,
                sourceUrl: card.image?.src,
              })),
            }
          : { enabled: false },
      })),
    },
  } as never)

  console.log('Updated header global')
}

async function seedFooter(payload: PayloadClient) {
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      columns: DEFAULT_FOOTER.columns.map((column) => ({
        title: column.title,
        links: column.links.map((link) => ({
          label: link.label,
          url: link.href,
          openInNewTab: Boolean(link.openInNewTab),
        })),
      })),
      newsletter: DEFAULT_FOOTER.newsletter,
      copyright: DEFAULT_FOOTER.copyright,
      locationText: DEFAULT_FOOTER.locationText,
    },
  } as never)

  console.log('Updated footer global')
}

async function seed() {
  console.log('Starting Shopify import into Payload')
  console.log(skipMediaDownload ? 'Media download is skipped' : 'Media download is enabled')

  const payload = await loadPayloadClient()

  const collectionsByHandle = await upsertCollections(payload)
  console.log(`Upserted ${collectionsByHandle.size} collections`)

  await upsertProducts(payload, collectionsByHandle)
  await seedHeader(payload)
  await seedFooter(payload)

  await fs.rm(tempDir, { recursive: true, force: true })
  console.log('Import complete')
  process.exit(0)
}

seed().catch(async (error) => {
  await fs.rm(tempDir, { recursive: true, force: true })
  console.error(error)
  process.exit(1)
})
