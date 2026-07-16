import {
  BRAND_INSTAGRAM_PROFILE_URL,
  BRAND_NAME,
  BRAND_TAGLINE,
} from '@/lib/brand'

export interface StorefrontImage {
  src: string
  alt?: string
}

export interface HeaderLink {
  label: string
  labelVi?: string
  href: string
}

export interface HeaderMegaColumn {
  heading: string
  headingVi?: string
  headingHref?: string
  links: HeaderLink[]
}

export interface HeaderMegaImageCard {
  caption?: string
  captionVi?: string
  href?: string
  image?: StorefrontImage
}

export interface HeaderMegaMenu {
  enabled: boolean
  columns: HeaderMegaColumn[]
  imageCards: HeaderMegaImageCard[]
}

export interface HeaderNavItem {
  label: string
  labelVi?: string
  href: string
  openInNewTab?: boolean
  megaMenu?: HeaderMegaMenu
}

export interface HeaderData {
  logoText: string
  logoHref: string
  logoAlt: string
  logo?: StorefrontImage
  shippingBar: {
    enabled: boolean
    text: string
    textVi?: string
    href?: string
  }
  countrySelector: {
    enabled: boolean
    label: string
    labelVi?: string
  }
  navigation: HeaderNavItem[]
}

export interface FooterLink {
  label: string
  labelVi?: string
  href: string
  openInNewTab?: boolean
}

export interface FooterColumn {
  title: string
  titleVi?: string
  links: FooterLink[]
}

export interface FooterData {
  desktopLogo?: StorefrontImage
  mobileLogo?: StorefrontImage
  columns: FooterColumn[]
  newsletter: {
    title: string
    titleVi?: string
    description: string
    descriptionVi?: string
    placeholder: string
    placeholderVi?: string
    buttonLabel: string
    buttonLabelVi?: string
    privacyText: string
    privacyTextVi?: string
    privacyHref: string
  }
  copyright: string
  locationText: string
}

export interface HomeHeroData {
  enabled: boolean
  href: string
  desktopImage?: StorefrontImage
  mobileImage?: StorefrontImage
  eyebrow?: string
  eyebrowVi?: string
  title?: string
  titleVi?: string
  body?: string
  bodyVi?: string
  ctaLabel?: string
  ctaLabelVi?: string
  textPosition: 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center'
  textTheme: 'light' | 'dark'
  overlayOpacity: number
}

export interface NewsletterPopupData {
  enabled: boolean
  showOnPaths: string[]
  delayMs: number
  dismissDays: number
  logo?: StorefrontImage
  title: string
  titleVi?: string
  description: string
  descriptionVi?: string
  placeholder: string
  placeholderVi?: string
  buttonLabel: string
  buttonLabelVi?: string
  privacyText: string
  privacyTextVi?: string
  privacyHref: string
}

export interface StorefrontFont {
  family: string
  source?: string
  weight: number
  style: 'normal' | 'italic'
  fallback: 'serif' | 'sans-serif' | 'monospace'
}

export interface DesignSystemData {
  typography: {
    bodyFont: StorefrontFont
    bodyBold?: boolean
    bodyItalic?: boolean
    headingFont: StorefrontFont
    headingBold?: boolean
    headingItalic?: boolean
    uiFont: StorefrontFont
    uiBold?: boolean
    uiItalic?: boolean
    headingSize: number
    subheadingSize: number
    bodySize: number
    lineHeight: number
    letterSpacing: number
  }
  spacing: {
    scale: number
    pagePaddingMobile: number
    pagePaddingDesktop: number
    gridGap: number
  }
}

export const DEFAULT_DESIGN_SYSTEM: DesignSystemData = {
  typography: {
    bodyFont: {
      family: 'SVN Times New Roman 2',
      weight: 400,
      style: 'normal',
      fallback: 'serif',
    },
    bodyBold: false,
    bodyItalic: false,
    headingFont: {
      family: 'SVN Times New Roman 2',
      weight: 400,
      style: 'normal',
      fallback: 'serif',
    },
    headingBold: false,
    headingItalic: false,
    uiFont: {
      family: 'SVN Arial 3',
      weight: 400,
      style: 'normal',
      fallback: 'sans-serif',
    },
    uiBold: false,
    uiItalic: false,
    headingSize: 22,
    subheadingSize: 17,
    bodySize: 16,
    lineHeight: 1.5,
    letterSpacing: 0,
  },
  spacing: {
    scale: 1,
    pagePaddingMobile: 16,
    pagePaddingDesktop: 28,
    gridGap: 16,
  },
}

export const DEFAULT_HEADER: HeaderData = {
  logoText: 'điển',
  logoHref: '/',
  logoAlt: 'điển',
  logo: {
    src: '/media/dien-logo-header.png',
    alt: 'điển',
  },
  shippingBar: {
    enabled: true,
    text: 'Complimentary shipping on orders over ₫950,000.',
    textVi: 'Miễn phí vận chuyển cho đơn hàng trên 950,000đ.',
    href: '/pages/returns-exchanges',
  },
  countrySelector: {
    enabled: false,
    label: 'Vietnam | VND ₫',
    labelVi: 'Việt Nam | VND ₫',
  },
  navigation: [
    {
      label: 'Products',
      labelVi: 'Sản phẩm',
      href: '/collections/shop-all',
      megaMenu: {
        enabled: true,
        columns: [
          {
            heading: 'Shop by Category',
            headingVi: 'Mua theo danh mục',
            headingHref: '/collections/shop-all',
            links: [
              { label: 'View All', labelVi: 'Xem tất cả', href: '/collections/shop-all' },
              { label: 'Outerwear', labelVi: 'Áo khoác', href: '/collections/coats-jackets' },
              { label: 'Tailoring', labelVi: 'May đo', href: '/collections/category-tailoring' },
              { label: 'Knitwear', labelVi: 'Đồ dệt kim', href: '/collections/knitwear' },
              {
                label: 'Sweatshirts & Sweatpants',
                labelVi: 'Áo nỉ & quần nỉ',
                href: '/collections/collection-sweater',
              },
              { label: 'Shirts', labelVi: 'Áo sơ mi', href: '/collections/shirts-all-navigation' },
              { label: 'Polos', labelVi: 'Áo polo', href: '/collections/category-polos' },
              {
                label: 'Tees & Henleys',
                labelVi: 'Áo thun & Henley',
                href: '/collections/collection-t-shirts-tanks',
              },
              { label: 'Tanks & Vests', labelVi: 'Áo tank & vest', href: '/collections/category-vests' },
              { label: 'Pants & Shorts', labelVi: 'Quần dài & short', href: '/collections/trousers-shorts' },
              { label: 'Denim', labelVi: 'Đồ denim', href: '/collections/category-nav-denim' },
              { label: 'Accessories', labelVi: 'Phụ kiện', href: '/collections/accessories' },
              { label: 'Gift Card', labelVi: 'Thẻ quà tặng', href: '/products/giftcard' },
            ],
          },
          {
            heading: 'In Focus',
            headingVi: 'Nổi bật',
            headingHref: '/pages/campaign',
            links: [
              { label: 'New Arrivals', labelVi: 'Hàng mới', href: '/pages/new-arrivals' },
              { label: 'Campaign', labelVi: 'Chiến dịch', href: '/pages/campaign' },
            ],
          },
        ],
        imageCards: [
          {
            caption: 'Tailoring',
            captionVi: 'May đo',
            href: '/collections/category-tailoring',
            image: {
              src: 'https://california-arts.com/cdn/shop/files/Asset_352_3x_dbdd82e6-4465-4e61-9689-c70fca184266.png?v=1762811468',
              alt: 'Tailoring',
            },
          },
          {
            caption: 'Accessories',
            captionVi: 'Phụ kiện',
            href: '/collections/accessories',
            image: {
              src: 'https://california-arts.com/cdn/shop/files/Asset_351_3x_31d33670-8ce1-43c9-816d-182528667610.png?v=1762810489',
              alt: 'Accessories',
            },
          },
        ],
      },
    },
    { label: 'About điển', labelVi: 'Về điển', href: '/pages/our-story' },
    { label: 'Creative Campaign', labelVi: 'Chiến dịch sáng tạo', href: '/pages/campaign' },
  ],
}

export const DEFAULT_HOME_HERO: HomeHeroData = {
  enabled: true,
  href: '/collections/shop-all',
  desktopImage: {
    src: '/media/nha-trang-6h.webp',
    alt: 'coastal road campaign',
  },
  mobileImage: {
    src: '/media/nha-trang-6h.webp',
    alt: 'coastal road campaign',
  },
  eyebrow: 'dien everyday wardrobe',
  eyebrowVi: 'điển / thường phục hằng ngày',
  title: 'quiet clothing for repeat wear.',
  titleVi: 'quần áo tĩnh, mặc đi mặc lại vẫn đúng.',
  body: 'built with fewer details, steadier proportions and a calmer pace.',
  bodyVi: 'được làm với ít chi tiết hơn, tỉ lệ ổn định hơn và một nhịp phát triển chậm hơn.',
  ctaLabel: 'shop all',
  ctaLabelVi: 'xem tất cả',
  textPosition: 'bottom-right',
  textTheme: 'light',
  overlayOpacity: 0.08,
}

export const DEFAULT_NEWSLETTER_POPUP: NewsletterPopupData = {
  enabled: true,
  showOnPaths: ['/*'],
  delayMs: 320,
  dismissDays: 7,
  logo: {
    src: '/media/dien-logo-header.png',
    alt: 'điển',
  },
  title: 'join điển',
  titleVi: 'đồng hành cùng điển',
  description: 'get early access to the next drops and complimentary shipping on your first order.',
  descriptionVi: 'nhận quyền truy cập sớm cho các đợt drop tiếp theo và miễn phí vận chuyển cho đơn hàng đầu tiên.',
  placeholder: 'your email',
  placeholderVi: 'email của bạn',
  buttonLabel: 'join',
  buttonLabelVi: 'tham gia',
  privacyText: 'by subscribing, you agree to the privacy policy',
  privacyTextVi: 'khi đăng ký, bạn đồng ý với chính sách bảo mật',
  privacyHref: '/pages/privacy-policy',
}

export const DEFAULT_FOOTER: FooterData = {
  desktopLogo: {
    src: '/media/dien-logo-header.png',
    alt: 'điển',
  },
  mobileLogo: {
    src: '/media/dien-logo-header.png',
    alt: 'điển',
  },
  columns: [
    {
  title: 'Company',
      titleVi: 'Công ty',
      links: [
        { label: 'About', labelVi: 'Giới thiệu', href: '/pages/our-story' },
        { label: 'Campaign', labelVi: 'Chiến dịch', href: '/pages/campaign' },
        { label: 'Shop All', labelVi: 'Mua sắm', href: '/collections/shop-all' },
      ],
    },
    {
      title: 'Community',
      titleVi: 'Cộng đồng',
      links: [
        {
          label: 'Instagram',
          href: BRAND_INSTAGRAM_PROFILE_URL,
          openInNewTab: true,
        },
      ],
    },
    {
      title: 'Client Services',
      titleVi: 'Dịch vụ khách hàng',
      links: [
        { label: 'Shipping', labelVi: 'Vận chuyển', href: '/pages/returns-exchanges' },
        { label: 'Returns', labelVi: 'Đổi trả', href: '/pages/returns-exchanges' },
        { label: 'Contact', labelVi: 'Liên hệ', href: '/pages/about' },
        { label: 'Gift Card', labelVi: 'Thẻ quà tặng', href: '/products/giftcard' },
      ],
    },
    {
      title: 'Legal',
      titleVi: 'Pháp lý',
      links: [
        { label: 'Privacy Policy', labelVi: 'Chính sách bảo mật', href: '/pages/privacy-policy' },
        { label: 'Accessibility', labelVi: 'Khả năng truy cập', href: '/pages/about' },
      ],
    },
  ],
  newsletter: {
    title: 'Keep in touch with điển',
    titleVi: 'Giữ liên hệ cùng điển',
    description: 'Receive new drops, restocks and quiet updates from the brand.',
    descriptionVi: 'Nhận đợt mở bán mới, restock và cập nhật vừa đủ từ thương hiệu.',
    placeholder: 'Your email',
    placeholderVi: 'Email của bạn',
    buttonLabel: 'Send',
    buttonLabelVi: 'Gửi',
    privacyText: 'By subscribing, you agree to the privacy policy.',
    privacyTextVi: 'Khi đăng ký, bạn đồng ý với chính sách bảo mật.',
    privacyHref: '/pages/privacy-policy',
  },
  copyright: `${BRAND_NAME} © 2026`,
  locationText: BRAND_TAGLINE,
}
