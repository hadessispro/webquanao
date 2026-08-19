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
  imageOpacity?: number
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
      family: 'SVN Arial 3',
      weight: 400,
      style: 'normal',
      fallback: 'sans-serif',
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
      labelVi: 'sản phẩm',
      href: '/collections/shop-all',
      megaMenu: {
        enabled: true,
        columns: [],
        imageCards: [],
      },
    },
    {
      label: 'About điển',
      labelVi: 'về điển',
      href: '/pages/our-story',
    },
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
  eyebrow: 'điển / thường phục hằng ngày',
  eyebrowVi: 'điển / thường phục hằng ngày',
  title: 'thiết kế dễ tiếp cận bằng cách sản xuất ít hơn và làm tốt hơn.',
  titleVi: 'thiết kế dễ tiếp cận bằng cách sản xuất ít hơn và làm tốt hơn.',
  body: 'từ rìa phía tây phủ bóng cọ của giấc mơ mỹ.',
  bodyVi: 'từ rìa phía tây phủ bóng cọ của giấc mơ mỹ.',
  ctaLabel: 'mua sắm',
  ctaLabelVi: 'mua sắm',
  textPosition: 'bottom-right',
  textTheme: 'light',
  overlayOpacity: 0,
  imageOpacity: 1,
}

export const DEFAULT_FOOTER: FooterData = {
  columns: [
    {
      title: 'Company',
      titleVi: 'câu hỏi thường gặp',
      links: [{ label: 'câu hỏi thường gặp', labelVi: 'câu hỏi thường gặp', href: '/pages/returns-exchanges' }],
    },
    {
      title: 'Policy',
      titleVi: 'chính sách',
      links: [{ label: 'chính sách', labelVi: 'chính sách', href: '/pages/privacy-policy' }],
    },
    {
      title: 'Contact',
      titleVi: 'liên hệ',
      links: [{ label: 'liên hệ', labelVi: 'liên hệ', href: '/pages/about' }],
    },
    {
      title: 'Social',
      titleVi: 'ig',
      links: [{ label: 'ig', labelVi: 'ig', href: BRAND_INSTAGRAM_PROFILE_URL }],
    },
  ],
  newsletter: {
    title: 'Newsletter',
    titleVi: 'đăng ký newsletter',
    description: '',
    descriptionVi: '',
    placeholder: 'đăng ký newsletter',
    placeholderVi: 'đăng ký newsletter',
    buttonLabel: 'gửi',
    buttonLabelVi: 'gửi',
    privacyText: '',
    privacyHref: '/pages/privacy-policy',
  },
  copyright: '© 2026 điển',
  locationText: 'southern california',
}

export const DEFAULT_NEWSLETTER_POPUP: NewsletterPopupData = {
  enabled: false,
  showOnPaths: ['/'],
  delayMs: 3500,
  dismissDays: 7,
  title: 'join us, at điển',
  titleVi: 'đồng hành cùng điển',
  description:
    'get early access to the next drops and complimentary shipping on your first order.',
  descriptionVi:
    'nhận quyền truy cập sớm cho các đợt drop tiếp theo và miễn phí vận chuyển cho đơn hàng đầu tiên.',
  placeholder: 'your email',
  placeholderVi: 'email của bạn',
  buttonLabel: 'join',
  buttonLabelVi: 'tham gia',
  privacyText: 'by subscribing, you agree to the privacy policy',
  privacyTextVi: 'khi đăng ký, bạn đồng ý với chính sách bảo mật',
  privacyHref: '/pages/privacy-policy',
}
