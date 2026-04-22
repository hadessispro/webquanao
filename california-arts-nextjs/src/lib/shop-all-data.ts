import { getAllStorefrontProducts } from './product-data'
import type { Product } from './products'

export type StorefrontShopAllSection = {
  handle: string
  title: string
  titleVi?: string
  products: Product[]
}

type ShopAllSectionDefinition = {
  baseHandles?: string[]
  handle: string
  title: string
  titleVi?: string
  match: (product: Product, text: string) => boolean
}

const PRODUCT_LIMIT_PER_SECTION = 2

const SHOP_ALL_SECTION_DEFINITIONS: ShopAllSectionDefinition[] = [
  {
    handle: 'coats',
    title: '01 Coats',
    titleVi: '01 Coats',
    baseHandles: ['coats-jackets'],
    match: (_product, text) =>
      (text.includes('coat') || text.includes('trench') || text.includes('overcoat') || text.includes('parka')) &&
      !text.includes('waistcoat') &&
      !text.includes('blazer') &&
      !text.includes('jacket'),
  },
  {
    handle: 'jackets',
    title: '02 Jackets',
    titleVi: '02 Jackets',
    baseHandles: ['coats-jackets'],
    match: (_product, text) =>
      (text.includes('jacket') || text.includes('bomber') || text.includes('blouson') || text.includes('harrington')) &&
      !text.includes('denim') &&
      !text.includes('blazer'),
  },
  {
    handle: 'denim-jackets',
    title: '03 Denim Jackets',
    titleVi: '03 Denim Jackets',
    baseHandles: ['category-nav-denim', 'coats-jackets'],
    match: (_product, text) => text.includes('denim') && text.includes('jacket'),
  },
  {
    handle: 'blazers',
    title: '04 Blazers',
    titleVi: '04 Blazers',
    baseHandles: ['category-tailoring', 'coats-jackets'],
    match: (_product, text) => text.includes('blazer'),
  },
  {
    handle: 'crewneck-sweaters',
    title: '05 Crewneck Sweaters',
    titleVi: '05 Crewneck Sweaters',
    baseHandles: ['knitwear'],
    match: (_product, text) => text.includes('crewneck') || text.includes('crew neck'),
  },
  {
    handle: 'v-neck-sweaters',
    title: '06 V-Neck Sweaters',
    titleVi: '06 V-Neck Sweaters',
    baseHandles: ['knitwear'],
    match: (_product, text) => text.includes('v-neck') || text.includes('v neck'),
  },
  {
    handle: 'cardigans',
    title: '07 Cardigans',
    titleVi: '07 Cardigans',
    baseHandles: ['knitwear'],
    match: (_product, text) => text.includes('cardigan'),
  },
  {
    handle: 'polos',
    title: '08 Polos',
    titleVi: '08 Polos',
    baseHandles: ['category-polos'],
    match: (_product, text) => text.includes('polo'),
  },
  {
    handle: 'turtlenecks',
    title: '09 Turtlenecks',
    titleVi: '09 Turtlenecks',
    baseHandles: ['knitwear'],
    match: (_product, text) => text.includes('turtleneck') || text.includes('rollneck'),
  },
  {
    handle: 'sweatshirts',
    title: '10 Sweatshirts',
    titleVi: '10 Sweatshirts',
    baseHandles: ['collection-sweater'],
    match: (_product, text) => text.includes('sweatshirt') || text.includes('hoodie'),
  },
  {
    handle: 'long-sleeve-shirts',
    title: '11 Long Sleeve Shirts',
    titleVi: '11 Long Sleeve Shirts',
    baseHandles: ['shirts-all-navigation'],
    match: (_product, text) =>
      (text.includes('long sleeve') || text.includes('long-sleeve')) &&
      text.includes('shirt') &&
      !text.includes('tee'),
  },
  {
    handle: 'short-sleeve-shirts',
    title: '12 Short Sleeve Shirts',
    titleVi: '12 Short Sleeve Shirts',
    baseHandles: ['shirts-all-navigation'],
    match: (_product, text) =>
      ((text.includes('short sleeve') || text.includes('short-sleeve') || text.includes('camp shirt')) &&
        text.includes('shirt')) ||
      (text.includes('shirt') &&
        !text.includes('long sleeve') &&
        !text.includes('long-sleeve') &&
        !text.includes('henley')),
  },
  {
    handle: 'long-sleeve-tees-henleys',
    title: '13 Long Sleeve Tees & Henleys',
    titleVi: '13 Long Sleeve Tees & Henleys',
    baseHandles: ['collection-t-shirts-tanks'],
    match: (_product, text) =>
      text.includes('henley') ||
      ((text.includes('tee') || text.includes('t-shirt')) &&
        (text.includes('long sleeve') || text.includes('long-sleeve'))),
  },
  {
    handle: 't-shirts',
    title: '14 T-Shirts',
    titleVi: '14 T-Shirts',
    baseHandles: ['collection-t-shirts-tanks'],
    match: (_product, text) =>
      (text.includes('tee') || text.includes('t-shirt')) &&
      !text.includes('long sleeve') &&
      !text.includes('long-sleeve') &&
      !text.includes('henley') &&
      !text.includes('tank'),
  },
  {
    handle: 'vests',
    title: '15 Vests',
    titleVi: '15 Vests',
    baseHandles: ['category-vests', 'collection-t-shirts-tanks'],
    match: (_product, text) =>
      (text.includes('vest') && !text.includes('invest')) ||
      text.includes('waistcoat') ||
      text.includes('gilet'),
  },
  {
    handle: 'tank-tops',
    title: '16 Tank Tops',
    titleVi: '16 Tank Tops',
    baseHandles: ['category-vests', 'collection-t-shirts-tanks'],
    match: (_product, text) => text.includes('tank') && !text.includes('muscle'),
  },
  {
    handle: 'muscle-tanks',
    title: '17 Muscle Tanks',
    titleVi: '17 Muscle Tanks',
    baseHandles: ['category-vests', 'collection-t-shirts-tanks'],
    match: (_product, text) => text.includes('muscle'),
  },
  {
    handle: 'pants-trousers',
    title: '18 Pants & Trousers',
    titleVi: '18 Pants & Trousers',
    baseHandles: ['trousers-shorts'],
    match: (_product, text) =>
      (text.includes('pant') || text.includes('trouser') || text.includes('slack')) &&
      !text.includes('sweatpant') &&
      !text.includes('short') &&
      !text.includes('jean') &&
      !text.includes('denim'),
  },
  {
    handle: 'jeans',
    title: '19 Jeans',
    titleVi: '19 Jeans',
    baseHandles: ['category-nav-denim'],
    match: (_product, text) => text.includes('jean') || (text.includes('denim') && !text.includes('jacket')),
  },
  {
    handle: 'shorts',
    title: '20 Shorts',
    titleVi: '20 Shorts',
    baseHandles: ['trousers-shorts'],
    match: (_product, text) => text.includes('short'),
  },
  {
    handle: 'accessories',
    title: '21 Accessories',
    titleVi: '21 Accessories',
    baseHandles: ['accessories'],
    match: (product, text) =>
      product.product_type.toLowerCase() === 'accessories' ||
      text.includes('accessories') ||
      text.includes('belt') ||
      text.includes('bag') ||
      text.includes('beanie') ||
      text.includes('scarf') ||
      text.includes('wallet'),
  },
]

function productText(product: Product): string {
  return [product.title, product.product_type, product.handle, ...(product.tags || [])]
    .join(' ')
    .toLowerCase()
}

function hasCollectionHandle(product: Product, handles?: string[]) {
  if (!handles?.length) return true
  return product.collections?.some((collection) => handles.includes(collection)) ?? false
}

function uniqueProducts(products: Product[]) {
  const seen = new Set<string>()
  return products.filter((product) => {
    if (!product.handle || seen.has(product.handle)) return false
    seen.add(product.handle)
    return true
  })
}

function pickSectionProducts(allProducts: Product[], definition: ShopAllSectionDefinition, usedHandles: Set<string>) {
  const matchesDefinition = (product: Product) => definition.match(product, productText(product))
  const availablePrimary = uniqueProducts(
    allProducts.filter(
      (product) => !usedHandles.has(product.handle) && hasCollectionHandle(product, definition.baseHandles) && matchesDefinition(product),
    ),
  )
  const availableCollectionFallback = uniqueProducts(
    allProducts.filter((product) => !usedHandles.has(product.handle) && hasCollectionHandle(product, definition.baseHandles)),
  )
  const availableFallback = uniqueProducts(
    allProducts.filter((product) => !usedHandles.has(product.handle) && matchesDefinition(product)),
  )
  const collectionFallbackWithReuse = uniqueProducts(
    allProducts.filter((product) => hasCollectionHandle(product, definition.baseHandles)),
  )
  const fallbackWithReuse = uniqueProducts(
    allProducts.filter((product) => matchesDefinition(product)),
  )

  const selected = (
    availablePrimary.length > 0
      ? availablePrimary
      : availableFallback.length > 0
        ? availableFallback
        : availableCollectionFallback.length > 0
          ? availableCollectionFallback
          : collectionFallbackWithReuse.length > 0
            ? collectionFallbackWithReuse
            : fallbackWithReuse
  )
    .slice(0, PRODUCT_LIMIT_PER_SECTION)

  selected.forEach((product) => {
    usedHandles.add(product.handle)
  })

  return selected
}

export async function getStorefrontShopAllSections(): Promise<StorefrontShopAllSection[]> {
  const allProducts = await getAllStorefrontProducts()
  const usedHandles = new Set<string>()

  return SHOP_ALL_SECTION_DEFINITIONS.map((definition) => ({
    handle: definition.handle,
    title: definition.title,
    titleVi: definition.titleVi,
    products: pickSectionProducts(allProducts, definition, usedHandles),
  })).filter((section) => section.products.length > 0)
}
