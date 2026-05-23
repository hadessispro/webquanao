import type { Product } from './products'
import { getAllProductsFromJson, normalizeImageUrl } from './products'
import { getPayloadClient } from './payload-client'

type MediaDoc = {
  id?: number | string
  url?: string
  filename?: string
  alt?: string
  sourceUrl?: string
  source_url?: string
  poster?: MediaDoc | number | string
  originalWidth?: number
  originalHeight?: number
}

type PayloadProductDoc = {
  id: number | string
  shopifyId?: number
  title?: string
  handle?: string
  bodyHtml?: string
  vendor?: string
  productType?: string
  material?: string
  sizeSelectorStyle?: 'auto' | 'text' | 'box'
  tags?: Array<{ tag?: string }>
  collections?: Array<{ handle?: string } | string | number>
  colorOptions?: Array<{
    label?: string
    value?: string
    swatch?: string
    position?: number
    available?: boolean
  }>
  sizeOptions?: Array<{
    label?: string
    value?: string
    position?: number
    available?: boolean
  }>
  variants?: Array<{
    id?: string
    shopifyVariantId?: number
    title?: string
    option1?: string
    option2?: string
    option3?: string
    sku?: string
    price?: number
    compareAtPrice?: number
    available?: boolean
    featuredImage?: MediaDoc | number | string
    featuredImageSourceUrl?: string
  }>
  images?: Array<{
    id?: string
    shopifyImageId?: number
    image?: MediaDoc | number | string
    sourceUrl?: string
    alt?: string
    position?: number
    width?: number
    height?: number
    variantIds?: Array<{ shopifyVariantId?: number }>
  }>
  mediaLayout?: {
    videoPlacement?: 'after-images' | 'manual'
  }
  videos?: Array<{
    id?: string
    video?: MediaDoc | number | string
    sourceUrl?: string
    poster?: MediaDoc | number | string
    posterSourceUrl?: string
    alt?: string
    position?: number
    placement?: 'inherit' | 'after-images' | 'manual'
    autoplay?: boolean
    loop?: boolean
    muted?: boolean
    controls?: boolean
  }>
  options?: Array<{
    name?: string
    position?: number
    values?: Array<{ value?: string }>
  }>
  accordions?: Array<{
    title?: string
    content?: unknown
  }>
  publishedAt?: string
  shopifyCreatedAt?: string
  shopifyUpdatedAt?: string
  createdAt?: string
  updatedAt?: string
}

type PayloadCollectionDoc = {
  id: number | string
  title?: string
  handle?: string
  menuLabel?: string
  descriptionHtml?: string
  description?: unknown
  products?: Array<PayloadProductDoc | number | string>
  sortOrder?: number
  seo?: {
    title?: string
    description?: string
  }
}

export type StorefrontCollection = {
  handle: string
  title: string
  descriptionHtml: string
  seoTitle?: string
  seoDescription?: string
  products: Product[]
}

type CollectionHandleMap = Map<string, string>

const PRODUCT_CACHE_MS = 5 * 60_000
let allProductsCache:
  | {
      expiresAt: number
      promise: Promise<Product[]>
    }
  | undefined

function mediaUrl(media: MediaDoc | number | string | undefined, fallback?: string): string {
  if (media && typeof media === 'object') {
    const mediaSourceUrl = media.sourceUrl || media.source_url
    const localUploadUrl =
      media.url && !media.url.startsWith('/api/media/file/') ? media.url : undefined
    const src =
      mediaSourceUrl ||
      fallback ||
      localUploadUrl ||
      (media.filename ? `/media/${media.filename}` : undefined) ||
      media.url
    if (src) return normalizeImageUrl(src)
  }

  return normalizeImageUrl(fallback || '')
}

function mediaMeta(media: MediaDoc | number | string | undefined) {
  if (media && typeof media === 'object') {
    return {
      alt: media.alt || undefined,
      width: media.originalWidth,
      height: media.originalHeight,
    }
  }

  return {
    alt: undefined,
    width: undefined,
    height: undefined,
  }
}

function richTextToHtml(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value !== 'object') return ''

  const node = value as {
    text?: string
    type?: string
    children?: unknown[]
    root?: { children?: unknown[] }
  }

  if (node.root?.children) {
    return node.root.children.map(richTextToHtml).join('')
  }

  if (typeof node.text === 'string') {
    return node.text
  }

  const children = Array.isArray(node.children) ? node.children.map(richTextToHtml).join('') : ''

  switch (node.type) {
    case 'paragraph':
      return children ? `<p>${children}</p>` : ''
    case 'heading':
      return children ? `<p><strong>${children}</strong></p>` : ''
    case 'list':
      return children ? `<ul>${children}</ul>` : ''
    case 'listitem':
      return children ? `<li>${children}</li>` : ''
    default:
      return children
  }
}

function humanizeHandle(handle: string): string {
  return handle
    .replace(/^category-nav-/, '')
    .replace(/^category-/, '')
    .replace(/^collection-/, '')
    .replace(/-navigation$/, '')
    .replace(/-/g, ' ')
}

function productText(product: Product): string {
  return [product.title, product.product_type, product.handle, ...(product.tags || [])]
    .join(' ')
    .toLowerCase()
}

function hasCollection(product: Product, handles: string[]) {
  return product.collections?.some((collection) => handles.includes(collection))
}

function collectionHandleFromRelation(
  collection: { id?: number | string; handle?: string } | string | number,
  collectionHandleById?: CollectionHandleMap,
) {
  if (collection && typeof collection === 'object') {
    return collection.handle || (collection.id ? collectionHandleById?.get(String(collection.id)) : undefined)
  }

  return collectionHandleById?.get(String(collection))
}

function makeCollectionHandleMap(collections: PayloadCollectionDoc[]) {
  return new Map(
    collections
      .map((collection) => [String(collection.id), collection.handle || ''] as const)
      .filter((entry) => entry[1]),
  )
}

function defaultCollectionDescription() {
  return ''
}

const COLLECTION_ALIASES: Record<
  string,
  {
    title: string
    sourceHandles?: string[]
    descriptionHtml?: string
    match?: (product: Product) => boolean
  }
> = {
  'shop-all': {
    title: 'View All',
    match: () => true,
    descriptionHtml:
      '<p><br/><br/><br/><br/></p><p><br/><br/><br/>Our Product Philosophy:<br/><em>"Less and More."</em></p><p>We re-imagine one garment at a time, combining<br/>intentional proportions with superior craftsmanship.<br/>We advocate for sustainability by producing less,<br/>building better &amp; simplifying the way we get dressed.</p>',
  },
  'coats-jackets': {
    title: 'Outerwear',
    match: (product) => {
      const text = productText(product)
      return (
        product.product_type.toLowerCase() === 'coats & jackets' ||
        text.includes('coat') ||
        text.includes('jacket') ||
        text.includes('blazer') ||
        text.includes('overcoat') ||
        text.includes('trench') ||
        text.includes('blouson')
      )
    },
  },
  'category-tailoring': {
    title: 'Tailoring',
    match: (product) => {
      const text = productText(product)
      return text.includes('blazer') || text.includes('tailored') || text.includes('trouser')
    },
  },
  'collection-sweater': {
    title: 'Sweatshirts & Sweatpants',
    sourceHandles: ['t-shirts', 'fw25-sale-shirts-copy'],
    match: (product) => {
      const text = productText(product)
      return text.includes('sweater') || text.includes('sweatshirt') || text.includes('sweatpant') || text.includes('hoodie')
    },
  },
  knitwear: {
    title: 'Knitwear',
    sourceHandles: ['fw25-sale-knitwear-copy', 'fw25-sale-accessories-copy', 'hammer-v-neck', 'hauser-crewneck'],
    match: (product) => productText(product).includes('knitwear'),
  },
  'category-polos': {
    title: 'Polos',
    match: (product) => productText(product).includes('polo'),
  },
  'shirts-all-navigation': {
    title: 'Shirts',
    sourceHandles: ['na-button-up-shirts', 'na-long-sleeve-shirts'],
    match: (product) => {
      const text = productText(product)
      return text.includes('shirt') || text.includes('shirts')
    },
  },
  'collection-t-shirts-tanks': {
    title: 'Tees & Henleys',
    match: (product) => {
      const text = productText(product)
      return text.includes('tee') || text.includes('t-shirt') || text.includes('henley') || text.includes('tank')
    },
  },
  'category-vests': {
    title: 'Tanks & Vests',
    sourceHandles: ['fw25-sale-vests-copy'],
    match: (product) => {
      const text = productText(product)
      return text.includes('vest') || text.includes('tank')
    },
  },
  'trousers-shorts': {
    title: 'Pants & Shorts',
    sourceHandles: ['fw25-sale-shirts-copy', 'fw25-sale-shorts-copy'],
    match: (product) => {
      const text = productText(product)
      return (
        product.product_type.toLowerCase() === 'pants' ||
        text.includes('trouser') ||
        text.includes('shorts') ||
        text.includes('bottoms')
      )
    },
  },
  'category-nav-denim': {
    title: 'Denim',
    sourceHandles: ['fw23-denim', 'fw25-sale-denim-copy'],
    match: (product) => {
      const text = productText(product)
      return text.includes('denim') || text.includes('jeans')
    },
  },
  accessories: {
    title: 'Accessories',
    sourceHandles: ['na-accessories', 'fw25-sale-all-products-copy'],
    match: (product) => {
      const text = productText(product)
      return product.product_type.toLowerCase() === 'accessories' || text.includes('accessories')
    },
  },
}

export function normalizePayloadProduct(
  doc: PayloadProductDoc,
  collectionHandleById?: CollectionHandleMap,
): Product {
  const variants = doc.variants || []
  const images = doc.images || []
  const videos = doc.videos || []

  return {
    id: Number(doc.shopifyId || doc.id),
    title: doc.title || '',
    handle: doc.handle || '',
    body_html: doc.bodyHtml || '',
    vendor: doc.vendor || 'điển',
    product_type: doc.productType || '',
    material: doc.material || undefined,
    sizeSelectorStyle: doc.sizeSelectorStyle || 'auto',
    mediaLayout: {
      videoPlacement: doc.mediaLayout?.videoPlacement || 'after-images',
    },
    tags: Array.isArray(doc.tags) ? doc.tags.map((tag) => tag.tag).filter(Boolean) as string[] : [],
    collections: Array.isArray(doc.collections)
      ? doc.collections
          .map((collection) => collectionHandleFromRelation(collection, collectionHandleById))
          .filter(Boolean) as string[]
      : [],
    variants: variants.map((variant) => {
      const featuredMeta = mediaMeta(variant.featuredImage)
      const featuredSrc = mediaUrl(variant.featuredImage, variant.featuredImageSourceUrl)

      return {
        id: Number(variant.shopifyVariantId || variant.id || 0),
        title: variant.title || '',
        option1: variant.option1 || null,
        option2: variant.option2 || null,
        option3: variant.option3 || null,
        sku: variant.sku || '',
        price: String(variant.price || 0),
        compare_at_price: variant.compareAtPrice ? String(variant.compareAtPrice) : null,
        available: variant.available ?? true,
        featured_image: featuredSrc
          ? {
              id: Number(variant.shopifyVariantId || variant.id || 0),
              src: featuredSrc,
              alt: featuredMeta.alt || null,
              width: featuredMeta.width || 0,
              height: featuredMeta.height || 0,
            }
          : null,
      }
    }),
    images: images
      .map((image, index) => {
        const meta = mediaMeta(image.image)
        const src = mediaUrl(image.image, image.sourceUrl)

        return {
          id: Number(image.shopifyImageId || index + 1),
          src,
          sourceUrl: image.sourceUrl,
          width: image.width || meta.width || 0,
          height: image.height || meta.height || 0,
          position: image.position || index + 1,
          alt: image.alt || meta.alt,
          variant_ids: Array.isArray(image.variantIds)
            ? image.variantIds.map((variant) => Number(variant.shopifyVariantId)).filter(Boolean)
            : [],
        }
      })
      .filter((image) => image.src),
    videos: videos
      .map((video, index) => {
        const videoMeta = mediaMeta(video.video)
        const sourceUrl =
          video.sourceUrl ||
          (video.video && typeof video.video === 'object' ? video.video.sourceUrl : undefined)
        const posterAsset =
          video.poster || (video.video && typeof video.video === 'object' ? video.video.poster : undefined)
        const poster = mediaUrl(posterAsset, video.posterSourceUrl)
        const src = mediaUrl(video.video, sourceUrl)

        return {
          id:
            video.id ||
            (video.video && typeof video.video === 'object' ? video.video.id : undefined) ||
            index + 1,
          src,
          poster: poster || undefined,
          alt: video.alt || videoMeta.alt,
          position: video.position ?? 999 + index,
          placement: video.placement || 'inherit',
          autoplay: video.autoplay ?? true,
          loop: video.loop ?? true,
          muted: video.muted ?? true,
          controls: video.controls ?? false,
        }
      })
      .filter((video) => video.src)
      .sort((a, b) => a.position - b.position),
    colorOptions: Array.isArray(doc.colorOptions)
      ? doc.colorOptions
          .map((option, index) => ({
            label: option.label || option.value || '',
            value: option.value || option.label || '',
            swatch: option.swatch || undefined,
            position: option.position ?? index,
            available: option.available ?? true,
          }))
          .filter((option) => option.value)
      : undefined,
    sizeOptions: Array.isArray(doc.sizeOptions)
      ? doc.sizeOptions
          .map((option, index) => ({
            label: option.label || option.value || '',
            value: option.value || option.label || '',
            position: option.position ?? index,
            available: option.available ?? true,
          }))
          .filter((option) => option.value)
      : undefined,
    options: Array.isArray(doc.options)
      ? doc.options.map((option, index) => ({
          name: option.name || '',
          position: option.position || index + 1,
          values: Array.isArray(option.values) ? option.values.map((value) => value.value).filter(Boolean) as string[] : [],
        }))
      : [],
    accordions: Array.isArray(doc.accordions)
      ? doc.accordions
          .map((accordion) => ({
            title: accordion.title || '',
            html: richTextToHtml(accordion.content),
          }))
          .filter((accordion) => accordion.title)
      : [],
    published_at: doc.publishedAt || '',
    created_at: doc.shopifyCreatedAt || doc.createdAt || '',
    updated_at: doc.shopifyUpdatedAt || doc.updatedAt || '',
  }
}

async function loadAllStorefrontProducts(): Promise<Product[]> {
  try {
    const payload = await getPayloadClient()
    const [result, collectionResult] = await Promise.all([
      payload.find({
        collection: 'products',
        depth: 2,
        limit: 200,
        where: {
          status: {
            equals: 'active',
          },
        },
        sort: 'title',
      }),
      payload.find({
        collection: 'product-collections',
        depth: 0,
        limit: 300,
      }),
    ])

    if (result.docs.length > 1) {
      const collectionHandleById = makeCollectionHandleMap(collectionResult.docs as PayloadCollectionDoc[])
      return (result.docs as PayloadProductDoc[]).map((doc) =>
        normalizePayloadProduct(doc, collectionHandleById),
      )
    }
  } catch {
    // Keep storefront usable until Payload is installed, migrated, and seeded.
  }

  return getAllProductsFromJson()
}

export async function getAllStorefrontProducts(): Promise<Product[]> {
  const now = Date.now()

  if (!allProductsCache || allProductsCache.expiresAt <= now) {
    allProductsCache = {
      expiresAt: now + PRODUCT_CACHE_MS,
      promise: loadAllStorefrontProducts(),
    }
  }

  return allProductsCache.promise
}

export async function getStorefrontProductByHandle(handle: string): Promise<Product | undefined> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      depth: 2,
      limit: 1,
      where: {
        and: [
          { handle: { equals: handle } },
          { status: { equals: 'active' } },
        ],
      },
    })

    if (result.docs[0]) {
      const collectionResult = await payload.find({
        collection: 'product-collections',
        depth: 0,
        limit: 300,
      })
      return normalizePayloadProduct(
        result.docs[0] as PayloadProductDoc,
        makeCollectionHandleMap(collectionResult.docs as PayloadCollectionDoc[]),
      )
    }
  } catch {
    // Fall through to JSON fallback.
  }

  const cachedProduct = (await getAllStorefrontProducts()).find((product) => product.handle === handle)
  if (cachedProduct) return cachedProduct

  return getAllProductsFromJson().find((product) => product.handle === handle)
}

async function getPayloadCollectionByHandle(handle: string): Promise<PayloadCollectionDoc | undefined> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'product-collections',
      depth: 2,
      limit: 1,
      where: {
        and: [
          { handle: { equals: handle } },
          { status: { equals: 'published' } },
        ],
      },
    })

    return result.docs[0] as PayloadCollectionDoc | undefined
  } catch {
    return undefined
  }
}

function collectionProductsFromDoc(collection: PayloadCollectionDoc | undefined, allProducts: Product[]) {
  if (!Array.isArray(collection?.products) || collection.products.length === 0) return []

  const productsByHandle = new Map(allProducts.map((product) => [product.handle, product]))
  const seen = new Set<string>()

  return collection.products
    .map((relation) => {
      if (relation && typeof relation === 'object') {
        const relationHandle = relation.handle
        if (relationHandle && productsByHandle.has(relationHandle)) {
          return productsByHandle.get(relationHandle)
        }

        return normalizePayloadProduct(relation as PayloadProductDoc)
      }

      const relationId = Number(relation)
      if (Number.isNaN(relationId)) return undefined

      return allProducts.find((product) => product.id === relationId)
    })
    .filter((product): product is Product => {
      if (!product?.handle || seen.has(product.handle)) return false
      seen.add(product.handle)
      return true
    })
}

export async function getStorefrontCollectionByHandle(handle: string): Promise<StorefrontCollection> {
  const [collection, allProducts] = await Promise.all([
    getPayloadCollectionByHandle(handle),
    getAllStorefrontProducts(),
  ])
  const alias = COLLECTION_ALIASES[handle]
  const matchHandles = [handle, ...(alias?.sourceHandles || [])]
  const explicitProducts = collectionProductsFromDoc(collection, allProducts)
  let products =
    explicitProducts.length > 0
      ? explicitProducts
      : allProducts.filter((product) => {
          if (handle === 'shop-all') return true
          if (hasCollection(product, matchHandles)) return true
          return alias?.match?.(product) || false
        })
  if (products.length === 0 && collection?.title) {
    const titleText = collection.title.toLowerCase()
    products = allProducts.filter((product) => {
      const text = productText(product)
      return text.includes(titleText) || product.product_type.toLowerCase() === titleText
    })
  }
  const title = alias?.title || collection?.title || humanizeHandle(handle)
  const descriptionHtml =
    collection?.descriptionHtml ||
    richTextToHtml(collection?.description) ||
    alias?.descriptionHtml ||
    defaultCollectionDescription()

  return {
    handle,
    title,
    descriptionHtml,
    seoTitle: collection?.seo?.title || `${title} | điển`,
    seoDescription:
      collection?.seo?.description ||
      descriptionHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160) ||
      `${title} | điển`,
    products,
  }
}

export async function getStorefrontProductsByCollection(handle: string): Promise<Product[]> {
  const collection = await getStorefrontCollectionByHandle(handle)
  return collection.products
}
