import {
  DEFAULT_FOOTER,
  DEFAULT_HEADER,
  DEFAULT_HOME_HERO,
  DEFAULT_NEWSLETTER_POPUP,
  FooterColumn,
  FooterData,
  HeaderData,
  HeaderMegaColumn,
  HeaderMegaImageCard,
  HeaderNavItem,
  HomeHeroData,
  NewsletterPopupData,
  StorefrontImage,
} from './storefront-types'
import { getPayloadClient } from './payload-client'

type MediaLike =
  | number
  | string
  | {
      url?: string
      alt?: string
      filename?: string
      sourceUrl?: string
    }
  | null
  | undefined

function ensureAbsoluteUrl(src?: string): string | undefined {
  if (!src) return undefined
  if (src.startsWith('//')) return `https:${src}`
  return src
}

function mediaToImage(media: MediaLike, fallbackAlt?: string): StorefrontImage | undefined {
  if (!media || typeof media === 'number' || typeof media === 'string') return undefined

  const src = ensureAbsoluteUrl(media.url || media.sourceUrl || (media.filename ? `/media/${media.filename}` : undefined))
  if (!src) return undefined

  return {
    src,
    alt: media.alt || fallbackAlt,
  }
}

const VI_TEXT_MAP: Record<string, string> = {
  '01 shop all': 'sản phẩm',
  '02 about the brand': 'về điển',
  '03 creative campaign': 'chiến dịch sáng tạo',
  'shop by category': 'mua theo danh mục',
  'view all': 'xem tất cả',
  outerwear: 'áo khoác',
  tailoring: 'may đo',
  knitwear: 'đồ dệt kim',
  'sweatshirts & sweatpants': 'áo nỉ & quần nỉ',
  shirts: 'áo sơ mi',
  polos: 'áo polo',
  'tees & henleys': 'áo thun & henley',
  'tanks & vests': 'áo tank & vest',
  'pants & shorts': 'quần dài & short',
  denim: 'đồ denim',
  accessories: 'phụ kiện',
  'gift card': 'thẻ quà tặng',
  'in focus': 'nổi bật',
  'new arrivals': 'hàng mới',
  campaign: 'chiến dịch',
  'about us': 'giới thiệu',
  'sustainability report': 'báo cáo bền vững',
  'customer care': 'chăm sóc khách hàng',
  'legal / t&c': 'pháp lý / điều khoản',
  privacy: 'bảo mật',
  account: 'tài khoản',
  shipping: 'vận chuyển',
  returns: 'đổi trả',
  contact: 'liên hệ',
  accessibility: 'khả năng truy cập',
  'shipping to': 'giao đến',
  'vietnam | vnd ₫': 'việt nam | vnd ₫',
  'complimentary shipping to vietnam on all orders over ₫6,578,950. no additional duties and fees upon delivery.':
    'miễn phí vận chuyển cho đơn hàng trên 950,000đ.',
  'complimentary shipping on orders over ₫950,000.': 'miễn phí vận chuyển cho đơn hàng trên 950,000đ.',
  'california minimalism': 'điển / thường phục hằng ngày',
  'accessible design by producing less & building better.':
    'thiết kế dễ tiếp cận bằng cách sản xuất ít hơn và làm tốt hơn.',
  'from the palm-fringed western edge of the american dream.':
    'từ rìa phía tây phủ bóng cọ của giấc mơ mỹ.',
  'shop all': 'xem tất cả',
  'join us, at điển': 'đồng hành cùng điển',
  'join điển': 'đồng hành cùng điển',
  'get early access to new product launches & events':
    'nhận quyền truy cập sớm cho các đợt drop tiếp theo và miễn phí vận chuyển cho đơn hàng đầu tiên.',
  'get early access to the next drops and complimentary shipping on your first order.':
    'nhận quyền truy cập sớm cho các đợt drop tiếp theo và miễn phí vận chuyển cho đơn hàng đầu tiên.',
  'email address': 'email của bạn',
  'your email': 'email của bạn',
  subscribe: 'tham gia',
  join: 'tham gia',
  'by subscribing, you agree to the privacy policy':
    'khi đăng ký, bạn đồng ý với chính sách bảo mật',
  'subscribe to west coast living': 'đăng ký west coast living',
  'stay connected for product launches, restocks and events from southern california.':
    'theo dõi các đợt ra mắt sản phẩm, mở bán lại và sự kiện từ southern california.',
  company: 'công ty',
  community: 'cộng đồng',
  'client services': 'dịch vụ khách hàng',
  legal: 'pháp lý',
  about: 'giới thiệu',
  'privacy policy': 'chính sách bảo mật',
  'the next great american heritage brand.': 'you already know.',
  send: 'gửi',
  'sign up for our newsletter': 'đăng ký nhận bản tin',
}

function translateSourceTextToVi(text?: string) {
  if (!text) return undefined
  return VI_TEXT_MAP[text.trim().toLowerCase()]
}

function isViewAllLabel(label?: string) {
  const value = (label || '').trim().toLowerCase()
  return value === 'view all' || value === 'xem tất cả' || value === 'xem tat ca'
}

function isShopAllLabel(label?: string) {
  const value = (label || '').trim().toLowerCase().replace(/^\d+\s*/, '')
  return value === 'shop all' || value === 'mua sắm' || value === 'mua sam'
}

function normalizeMegaColumns(columns: unknown, parentHref?: string): HeaderMegaColumn[] {
  if (!Array.isArray(columns)) return []

  return columns
    .map((column) => {
      const value = column as {
        heading?: string
        headingVi?: string
        headingHref?: string
        links?: Array<{
          label?: string
          labelVi?: string
          href?: string
          collection?: { handle?: string; menuLabel?: string; title?: string } | number | string
        }>
      }

      const normalizedLinks = Array.isArray(value.links)
        ? value.links
            .map((link) => {
              const collection =
                link?.collection && typeof link.collection === 'object'
                  ? link.collection
                  : undefined
              const label = link?.label || collection?.menuLabel || collection?.title
              const href =
                isViewAllLabel(label) ? parentHref || value.headingHref || link?.href :
                link?.href ||
                (collection?.handle ? `/collections/${collection.handle}` : undefined) ||
                undefined

              return label && href
                ? {
                    label,
                    labelVi: link?.labelVi || translateSourceTextToVi(label) || undefined,
                    href,
                  }
                : null
            })
            .filter(Boolean) as Array<{ label: string; labelVi?: string; href: string }>
        : []

      return {
        heading: value.heading || '',
        headingVi: value.headingVi || translateSourceTextToVi(value.heading) || undefined,
        headingHref: value.headingHref || normalizedLinks[0]?.href || parentHref || undefined,
        links: normalizedLinks,
      }
    })
    .filter((column) => column.heading || column.links.length > 0)
}

function normalizeMegaImageCards(cards: unknown): HeaderMegaImageCard[] {
  if (!Array.isArray(cards)) return []

  return cards.map((card) => {
    const value = card as {
      caption?: string
      captionVi?: string
      href?: string
      image?: MediaLike
      sourceUrl?: string
    }

    return {
      caption: value.caption,
      captionVi: value.captionVi || translateSourceTextToVi(value.caption),
      href: value.href,
      image: mediaToImage(value.image, value.caption) || (value.sourceUrl ? { src: ensureAbsoluteUrl(value.sourceUrl) || value.sourceUrl, alt: value.caption } : undefined),
    }
  })
}

function normalizeNavigation(navigation: unknown): HeaderNavItem[] {
  if (!Array.isArray(navigation) || navigation.length === 0) return DEFAULT_HEADER.navigation

  const items = navigation
    .map((item) => {
      const value = item as {
        label?: string
        labelVi?: string
        href?: string
        url?: string
        collection?: { handle?: string; menuLabel?: string; title?: string } | number | string
        openInNewTab?: boolean
        megaMenu?: {
          enabled?: boolean
          columns?: unknown
          categories?: Array<{ label?: string; url?: string; href?: string }>
          imageCards?: unknown
          images?: unknown
        }
      }

      const collection =
        value.collection && typeof value.collection === 'object' ? value.collection : undefined
      const label = value.label || collection?.menuLabel || collection?.title
      const href = isShopAllLabel(label)
        ? '/collections/shop-all'
        : value.href || value.url || (collection?.handle ? `/collections/${collection.handle}` : undefined)

      if (!label || !href) return null

      const legacyCategories =
        Array.isArray(value.megaMenu?.categories) && value.megaMenu.categories.length > 0
          ? [
              {
                heading: 'Shop by Category',
                links: value.megaMenu.categories
                  .filter((link) => link.label && (link.href || link.url))
                  .map((link) => ({ label: link.label as string, href: (link.href || link.url) as string })),
              },
            ]
          : []

      const columns = normalizeMegaColumns(value.megaMenu?.columns, href)
      const imageCards = normalizeMegaImageCards(value.megaMenu?.imageCards || value.megaMenu?.images)

      return {
        label,
        labelVi: value.labelVi || translateSourceTextToVi(label) || undefined,
        href,
        openInNewTab: Boolean(value.openInNewTab),
        megaMenu: {
          enabled: Boolean(value.megaMenu?.enabled),
          columns: columns.length > 0 ? columns : legacyCategories,
          imageCards,
        },
      }
    })
    .filter(Boolean) as HeaderNavItem[]

  return items.length > 0 ? items : DEFAULT_HEADER.navigation
}

function normalizeFooterColumns(columns: unknown): FooterColumn[] {
  if (!Array.isArray(columns) || columns.length === 0) return DEFAULT_FOOTER.columns

  const normalized = columns
    .map((column) => {
      const value = column as {
        title?: string
        titleVi?: string
        links?: Array<{
          label?: string
          labelVi?: string
          href?: string
          url?: string
          openInNewTab?: boolean
        }>
      }

      return {
        title: value.title || '',
        titleVi: value.titleVi || translateSourceTextToVi(value.title) || undefined,
        links: Array.isArray(value.links)
          ? value.links
              .map((link) => {
                const href = link?.href || link?.url
                return link?.label && href
                  ? {
                      label: link.label,
                      labelVi: link.labelVi || translateSourceTextToVi(link.label) || undefined,
                      href,
                      openInNewTab: Boolean(link.openInNewTab || href.startsWith('http')),
                    }
                  : null
              })
              .filter(Boolean) as FooterColumn['links']
          : [],
      }
    })
    .filter((column) => column.title || column.links.length > 0)

  return normalized.length > 0 ? normalized : DEFAULT_FOOTER.columns
}

export async function getHeaderData(): Promise<HeaderData> {
  try {
    const payload = await getPayloadClient()
    const header = (await payload.findGlobal({
      slug: 'header',
      depth: 2,
    })) as {
      logoText?: string
      logoHref?: string
      logoAlt?: string
      logo?: MediaLike
      shippingBar?: {
        enabled?: boolean
        text?: string
        textVi?: string
        href?: string
      }
      countrySelector?: {
        enabled?: boolean
        label?: string
        labelVi?: string
      }
      navigation?: unknown
    }

    const navigation = normalizeNavigation(header.navigation)

    return {
      logoText: header.logoText || DEFAULT_HEADER.logoText,
      logoHref: header.logoHref || DEFAULT_HEADER.logoHref,
      logoAlt: header.logoAlt || header.logoText || DEFAULT_HEADER.logoAlt,
      logo: mediaToImage(header.logo, header.logoAlt || header.logoText) || DEFAULT_HEADER.logo,
      shippingBar: {
        enabled: header.shippingBar?.enabled ?? DEFAULT_HEADER.shippingBar.enabled,
        text: header.shippingBar?.text || DEFAULT_HEADER.shippingBar.text,
        textVi:
          header.shippingBar?.textVi ||
          translateSourceTextToVi(header.shippingBar?.text) ||
          DEFAULT_HEADER.shippingBar.textVi,
        href: header.shippingBar?.href || DEFAULT_HEADER.shippingBar.href,
      },
      countrySelector: {
        enabled: header.countrySelector?.enabled ?? DEFAULT_HEADER.countrySelector.enabled,
        label: header.countrySelector?.label || DEFAULT_HEADER.countrySelector.label,
        labelVi:
          header.countrySelector?.labelVi ||
          translateSourceTextToVi(header.countrySelector?.label) ||
          DEFAULT_HEADER.countrySelector.labelVi,
      },
      navigation,
    }
  } catch {
    return DEFAULT_HEADER
  }
}

export async function getFooterData(): Promise<FooterData> {
  try {
    const payload = await getPayloadClient()
    const footer = (await payload.findGlobal({
      slug: 'footer',
      depth: 2,
    })) as {
      desktopLogo?: MediaLike
      mobileLogo?: MediaLike
      columns?: unknown
      newsletter?: Partial<FooterData['newsletter']>
      copyright?: string
      locationText?: string
    }

    return {
      desktopLogo:
        mediaToImage(footer.desktopLogo, 'điển') || DEFAULT_FOOTER.desktopLogo,
      mobileLogo:
        mediaToImage(footer.mobileLogo, 'điển') || DEFAULT_FOOTER.mobileLogo,
      columns: normalizeFooterColumns(footer.columns),
      newsletter: {
        title: footer.newsletter?.title || DEFAULT_FOOTER.newsletter.title,
        titleVi:
          footer.newsletter?.titleVi ||
          translateSourceTextToVi(footer.newsletter?.title) ||
          DEFAULT_FOOTER.newsletter.titleVi,
        description:
          footer.newsletter?.description || DEFAULT_FOOTER.newsletter.description,
        descriptionVi:
          footer.newsletter?.descriptionVi ||
          translateSourceTextToVi(footer.newsletter?.description) ||
          DEFAULT_FOOTER.newsletter.descriptionVi,
        placeholder:
          footer.newsletter?.placeholder || DEFAULT_FOOTER.newsletter.placeholder,
        placeholderVi:
          footer.newsletter?.placeholderVi ||
          translateSourceTextToVi(footer.newsletter?.placeholder) ||
          DEFAULT_FOOTER.newsletter.placeholderVi,
        buttonLabel:
          footer.newsletter?.buttonLabel || DEFAULT_FOOTER.newsletter.buttonLabel,
        buttonLabelVi:
          footer.newsletter?.buttonLabelVi ||
          translateSourceTextToVi(footer.newsletter?.buttonLabel) ||
          DEFAULT_FOOTER.newsletter.buttonLabelVi,
        privacyText:
          footer.newsletter?.privacyText || DEFAULT_FOOTER.newsletter.privacyText,
        privacyTextVi:
          footer.newsletter?.privacyTextVi ||
          translateSourceTextToVi(footer.newsletter?.privacyText) ||
          DEFAULT_FOOTER.newsletter.privacyTextVi,
        privacyHref:
          footer.newsletter?.privacyHref || DEFAULT_FOOTER.newsletter.privacyHref,
      },
      copyright: footer.copyright || DEFAULT_FOOTER.copyright,
      locationText: footer.locationText || DEFAULT_FOOTER.locationText,
    }
  } catch {
    return DEFAULT_FOOTER
  }
}

export async function getHomeHeroData(): Promise<HomeHeroData> {
  try {
    const payload = await getPayloadClient()
    const settings = (await payload.findGlobal({
      slug: 'site-settings',
      depth: 2,
    })) as {
      homeHero?: {
        enabled?: boolean
        href?: string
        desktopImage?: MediaLike
        desktopSourceUrl?: string
        mobileImage?: MediaLike
        mobileSourceUrl?: string
        eyebrow?: string
        eyebrowVi?: string
        title?: string
        titleVi?: string
        body?: string
        bodyVi?: string
        ctaLabel?: string
        ctaLabelVi?: string
        textPosition?: HomeHeroData['textPosition']
        textTheme?: HomeHeroData['textTheme']
        overlayOpacity?: number
      }
    }

    const hero = settings.homeHero
    if (!hero) return DEFAULT_HOME_HERO

    return {
      enabled: hero.enabled ?? DEFAULT_HOME_HERO.enabled,
      href: hero.href || DEFAULT_HOME_HERO.href,
      desktopImage:
        mediaToImage(hero.desktopImage, hero.title || DEFAULT_HOME_HERO.desktopImage?.alt) ||
        (hero.desktopSourceUrl
          ? {
              src: ensureAbsoluteUrl(hero.desktopSourceUrl) || hero.desktopSourceUrl,
              alt: hero.title || DEFAULT_HOME_HERO.desktopImage?.alt,
            }
          : DEFAULT_HOME_HERO.desktopImage),
      mobileImage:
        mediaToImage(hero.mobileImage, hero.title || DEFAULT_HOME_HERO.mobileImage?.alt) ||
        (hero.mobileSourceUrl
          ? {
              src: ensureAbsoluteUrl(hero.mobileSourceUrl) || hero.mobileSourceUrl,
              alt: hero.title || DEFAULT_HOME_HERO.mobileImage?.alt,
            }
          : DEFAULT_HOME_HERO.mobileImage),
      eyebrow: hero.eyebrow || DEFAULT_HOME_HERO.eyebrow,
      eyebrowVi:
        hero.eyebrowVi || translateSourceTextToVi(hero.eyebrow) || DEFAULT_HOME_HERO.eyebrowVi,
      title: hero.title || DEFAULT_HOME_HERO.title,
      titleVi: hero.titleVi || translateSourceTextToVi(hero.title) || DEFAULT_HOME_HERO.titleVi,
      body: hero.body || DEFAULT_HOME_HERO.body,
      bodyVi: hero.bodyVi || translateSourceTextToVi(hero.body) || DEFAULT_HOME_HERO.bodyVi,
      ctaLabel: hero.ctaLabel || DEFAULT_HOME_HERO.ctaLabel,
      ctaLabelVi:
        hero.ctaLabelVi ||
        translateSourceTextToVi(hero.ctaLabel) ||
        DEFAULT_HOME_HERO.ctaLabelVi,
      textPosition: hero.textPosition || DEFAULT_HOME_HERO.textPosition,
      textTheme: hero.textTheme || DEFAULT_HOME_HERO.textTheme,
      overlayOpacity: hero.overlayOpacity ?? DEFAULT_HOME_HERO.overlayOpacity,
    }
  } catch {
    return DEFAULT_HOME_HERO
  }
}

export async function getNewsletterPopupData(): Promise<NewsletterPopupData> {
  try {
    const payload = await getPayloadClient()
    const settings = (await payload.findGlobal({
      slug: 'site-settings',
      depth: 2,
    })) as {
      newsletterPopup?: {
        enabled?: boolean
        showOnPaths?: Array<{ path?: string }>
        delayMs?: number
        dismissDays?: number
        logo?: MediaLike
        logoSourceUrl?: string
        title?: string
        titleVi?: string
        description?: string
        descriptionVi?: string
        placeholder?: string
        placeholderVi?: string
        buttonLabel?: string
        buttonLabelVi?: string
        privacyText?: string
        privacyTextVi?: string
        privacyHref?: string
      }
    }

    const popup = settings.newsletterPopup
    if (!popup) return DEFAULT_NEWSLETTER_POPUP

    const showOnPaths = Array.isArray(popup.showOnPaths)
      ? popup.showOnPaths.map((item) => item.path).filter(Boolean) as string[]
      : []

    return {
      enabled: popup.enabled ?? DEFAULT_NEWSLETTER_POPUP.enabled,
      showOnPaths:
        popup.enabled === false
          ? showOnPaths
          : ['/*'],
      delayMs: popup.delayMs ?? DEFAULT_NEWSLETTER_POPUP.delayMs,
      dismissDays: popup.dismissDays ?? DEFAULT_NEWSLETTER_POPUP.dismissDays,
      logo:
        mediaToImage(popup.logo, DEFAULT_HEADER.logoAlt || DEFAULT_NEWSLETTER_POPUP.logo?.alt) ||
        (popup.logoSourceUrl
          ? {
              src: ensureAbsoluteUrl(popup.logoSourceUrl) || popup.logoSourceUrl,
              alt: DEFAULT_HEADER.logoAlt || DEFAULT_NEWSLETTER_POPUP.logo?.alt,
            }
          : DEFAULT_NEWSLETTER_POPUP.logo),
      title: popup.title || DEFAULT_NEWSLETTER_POPUP.title,
      titleVi: popup.titleVi || translateSourceTextToVi(popup.title) || DEFAULT_NEWSLETTER_POPUP.titleVi,
      description: popup.description || DEFAULT_NEWSLETTER_POPUP.description,
      descriptionVi:
        popup.descriptionVi ||
        translateSourceTextToVi(popup.description) ||
        DEFAULT_NEWSLETTER_POPUP.descriptionVi,
      placeholder: popup.placeholder || DEFAULT_NEWSLETTER_POPUP.placeholder,
      placeholderVi:
        popup.placeholderVi ||
        translateSourceTextToVi(popup.placeholder) ||
        DEFAULT_NEWSLETTER_POPUP.placeholderVi,
      buttonLabel: popup.buttonLabel || DEFAULT_NEWSLETTER_POPUP.buttonLabel,
      buttonLabelVi:
        popup.buttonLabelVi ||
        translateSourceTextToVi(popup.buttonLabel) ||
        DEFAULT_NEWSLETTER_POPUP.buttonLabelVi,
      privacyText: popup.privacyText || DEFAULT_NEWSLETTER_POPUP.privacyText,
      privacyTextVi:
        popup.privacyTextVi ||
        translateSourceTextToVi(popup.privacyText) ||
        DEFAULT_NEWSLETTER_POPUP.privacyTextVi,
      privacyHref: popup.privacyHref || DEFAULT_NEWSLETTER_POPUP.privacyHref,
    }
  } catch {
    return DEFAULT_NEWSLETTER_POPUP
  }
}
