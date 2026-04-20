import { redirect } from 'next/navigation'

function buildQueryString(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams()

  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item))
      return
    }

    if (value) params.set(key, value)
  })

  const query = params.toString()
  return query ? `?${query}` : ''
}

export default async function CollectionProductRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string; productHandle: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { productHandle } = await params
  const queryString = buildQueryString(await searchParams)

  redirect(`/products/${productHandle}${queryString}`)
}
