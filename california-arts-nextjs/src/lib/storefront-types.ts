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
    text: 'Complimentary shipping to Vietnam on all orders over ₫6,578,950. No additional duties and fees upon delivery.',
    textVi:
      'Miễn phí vận chuyển đến Việt Nam cho đơn hàng trên ₫6,578,950. Không phát sinh thuế và phí khi giao hàng.',
    href: '/pages/returns-exchanges',
  },
  countrySelector: {
    enabled: true,
    label: 'Vietnam | VND ₫',
    labelVi: 'Việt Nam | VND ₫',
  },
  navigation: [
    {
      label: '01 Shop All',
      labelVi: '01 Mua sắm',
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
    { label: '02 About the Brand', labelVi: '02 Về thương hiệu', href: '/pages/our-story' },
    { label: '03 Creative Campaign', labelVi: '03 Chiến dịch sáng tạo', href: '/pages/campaign' },
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
  eyebrow: 'california minimalism',
  eyebrowVi: 'tối giản california',
  title: 'accessible design by producing less & building better.',
  titleVi: 'thiết kế dễ tiếp cận bằng cách sản xuất ít hơn và xây dựng tốt hơn.',
  body: 'from the palm-fringed western edge of the american dream.',
  bodyVi: 'từ rìa phía tây của giấc mơ mỹ.',
  ctaLabel: 'shop all',
  ctaLabelVi: 'xem tất cả',
  textPosition: 'bottom-right',
  textTheme: 'light',
  overlayOpacity: 0.08,
}

export const DEFAULT_NEWSLETTER_POPUP: NewsletterPopupData = {
  enabled: true,
  showOnPaths: ['/', '/collections/shop-all'],
  delayMs: 1800,
  dismissDays: 7,
  logo: {
    src: '/media/dien-logo-header.png',
    alt: 'điển',
  },
  title: 'join us, at điển',
  titleVi: 'tham gia cùng điển',
  description: 'get early access to new product launches & events',
  descriptionVi: 'nhận quyền truy cập sớm cho các đợt ra mắt sản phẩm và sự kiện',
  placeholder: 'email address',
  placeholderVi: 'địa chỉ email',
  buttonLabel: 'subscribe',
  buttonLabelVi: 'đăng ký',
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
          href: 'https://www.instagram.com/california.arts/',
          openInNewTab: true,
        },
        {
          label: 'Tik Tok',
          href: 'https://www.tiktok.com/@california.arts',
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
    title: 'Subscribe to West Coast Living',
    titleVi: 'Đăng ký West Coast Living',
    description:
      'Stay connected for product launches, restocks and events from Southern California.',
    descriptionVi:
      'Theo dõi các đợt ra mắt sản phẩm, restock và sự kiện từ Southern California.',
    placeholder: 'Email',
    placeholderVi: 'Email',
    buttonLabel: 'Subscribe',
    buttonLabelVi: 'Đăng ký',
    privacyText: 'By subscribing, you agree to the privacy policy',
    privacyTextVi: 'Khi đăng ký, bạn đồng ý với chính sách bảo mật',
    privacyHref: '/pages/privacy-policy',
  },
  copyright: 'California Arts © 2024',
  locationText: 'Southern California',
}
