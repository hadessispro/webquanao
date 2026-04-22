import { getHeaderData } from './layout-data'
import { getStorefrontCollectionByHandle, type StorefrontCollection } from './product-data'
import { DEFAULT_HEADER } from './storefront-types'

export type StorefrontShopAllSection = StorefrontCollection & {
  navigationLabel?: string
  navigationLabelVi?: string
}

type SectionLink = {
  handle: string
  label?: string
  labelVi?: string
}

const DEFAULT_SECTION_ORDER = [
  'coats-jackets',
  'category-tailoring',
  'knitwear',
  'collection-sweater',
  'shirts-all-navigation',
  'category-polos',
  'collection-t-shirts-tanks',
  'category-vests',
  'trousers-shorts',
  'category-nav-denim',
  'accessories',
] as const

function collectionHandleFromHref(href?: string) {
  if (!href) return undefined
  const match = href.match(/^\/collections\/([^/?#]+)/i)
  return match?.[1]
}

function uniqueCollectionLinks(links: SectionLink[]) {
  const seen = new Set<string>()
  const excludedHandles = new Set(['shop-all', 'frontpage'])

  return links.filter((link) => {
    if (!link.handle || excludedHandles.has(link.handle) || seen.has(link.handle)) return false
    seen.add(link.handle)
    return true
  })
}

function extractShopAllSectionLinks(navigation: Awaited<ReturnType<typeof getHeaderData>>['navigation']) {
  const shopAllItem =
    navigation.find((item) => item.href === '/collections/shop-all') ||
    navigation.find((item) => item.megaMenu?.columns.some((column) => column.links.some((link) => link.href.startsWith('/collections/'))))

  if (!shopAllItem?.megaMenu?.columns.length) return []

  return uniqueCollectionLinks(
    shopAllItem.megaMenu.columns.flatMap((column) =>
      column.links
        .map((link) => {
          const handle = collectionHandleFromHref(link.href)
          return handle
            ? {
                handle,
                label: link.label,
                labelVi: link.labelVi,
              }
            : null
        })
        .filter(Boolean) as SectionLink[],
    ),
  )
}

function defaultSectionLinks() {
  return extractShopAllSectionLinks(DEFAULT_HEADER.navigation)
}

function isGenericShopAllLabel(label?: string) {
  const value = (label || '').trim().toLowerCase()
  return value === 'view all' || value === 'xem tat ca' || value === 'xem tất cả'
}

function mergeSectionLinks(primaryLinks: SectionLink[], fallbackLinks: SectionLink[]) {
  const linkByHandle = new Map<string, SectionLink>()
  const fallbackByHandle = new Map<string, SectionLink>()

  fallbackLinks.forEach((link) => {
    if (!link?.handle) return
    fallbackByHandle.set(link.handle, link)
  })

  ;[...fallbackLinks, ...primaryLinks].forEach((link) => {
    if (!link?.handle) return
    linkByHandle.set(link.handle, link)
  })

  const orderedDefaults = DEFAULT_SECTION_ORDER.map((handle) => {
    const primary = linkByHandle.get(handle)
    const fallback = fallbackByHandle.get(handle)
    const label = isGenericShopAllLabel(primary?.label) ? fallback?.label : primary?.label || fallback?.label
    const labelVi = isGenericShopAllLabel(primary?.labelVi)
      ? fallback?.labelVi
      : primary?.labelVi || fallback?.labelVi

    return {
      handle,
      label,
      labelVi,
    }
  })

  const extras = uniqueCollectionLinks([...primaryLinks, ...fallbackLinks]).filter(
    (link) => !DEFAULT_SECTION_ORDER.includes(link.handle as (typeof DEFAULT_SECTION_ORDER)[number]),
  )

  return uniqueCollectionLinks([...orderedDefaults, ...extras])
}

export async function getStorefrontShopAllSections(): Promise<StorefrontShopAllSection[]> {
  const header = await getHeaderData()
  const sectionLinks = extractShopAllSectionLinks(header.navigation)
  const fallbackLinks = defaultSectionLinks()
  const activeLinks = mergeSectionLinks(sectionLinks, fallbackLinks)

  const sections = await Promise.all(
    activeLinks.map(async (link) => {
      const collection = await getStorefrontCollectionByHandle(link.handle)
      return {
        ...collection,
        navigationLabel: link.label || collection.title,
        navigationLabelVi: link.labelVi,
      }
    }),
  )

  return sections.filter((section) => section.products.length > 0)
}
