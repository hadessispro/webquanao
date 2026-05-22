import { NextResponse } from 'next/server'
import { getAllStorefrontProducts } from '@/lib/product-data'
import { getDisplayPrice, getMainImageUrl, Product } from '@/lib/products'

function normalizeSearchText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function searchableText(product: Product) {
  return normalizeSearchText(
    [
      product.title,
      product.handle,
      product.product_type,
      product.vendor,
      product.material,
      ...(product.tags || []),
      ...(product.collections || []),
    ]
      .filter(Boolean)
      .join(' '),
  )
}

function scoreProduct(product: Product, query: string) {
  const text = searchableText(product)
  const title = normalizeSearchText(product.title)
  const handle = normalizeSearchText(product.handle)
  const terms = query.split(/\s+/).filter(Boolean)

  if (!query) return 1

  let score = 0
  if (title === query || handle === query) score += 120
  if (title.includes(query)) score += 70
  if (handle.includes(query)) score += 50
  if (text.includes(query)) score += 30

  const matchedTerms = terms.filter((term) => text.includes(term))
  score += matchedTerms.length * 12

  if (matchedTerms.length === terms.length && terms.length > 1) score += 18

  return score
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = normalizeSearchText(searchParams.get('q') || '')
  const products = await getAllStorefrontProducts()

  const results = products
    .map((product) => ({
      product,
      score: scoreProduct(product, query),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.product.title.localeCompare(b.product.title))
    .slice(0, 8)
    .map(({ product }) => ({
      handle: product.handle,
      href: `/products/${product.handle}`,
      image: getMainImageUrl(product),
      price: getDisplayPrice(product),
      title: product.title,
    }))

  return NextResponse.json({ results })
}
