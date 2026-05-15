import ProductGrid from '@/components/product/ProductGrid'
import { getPageBySlug } from '@/lib/pages-data'
import { getAllStorefrontProducts } from '@/lib/product-data'

export const metadata = {
  title: 'hàng mới | điển',
  description: 'những thiết kế mới nhất của điển.',
}

export default async function NewArrivalsPage() {
  const page = await getPageBySlug('new-arrivals')
  const products = await getAllStorefrontProducts()
  const sortedProducts = [...products].sort((a, b) => {
    const dateA = Date.parse(a.published_at || a.created_at || a.updated_at || '')
    const dateB = Date.parse(b.published_at || b.created_at || b.updated_at || '')

    return (Number.isFinite(dateB) ? dateB : 0) - (Number.isFinite(dateA) ? dateA : 0)
  })

  return (
    <ProductGrid
      products={sortedProducts}
      sectionTitle={page?.title || 'hàng mới'}
      sectionSubtitle={page?.contentHtml || '<p><br/><br/><br/>những thiết kế mới nhất của điển.</p>'}
    />
  )
}
