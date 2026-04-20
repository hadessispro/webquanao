import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'California Arts',
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      defaultValue: 'California Minimalism. Accessible design by producing less & building better.',
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'VND',
    },
    {
      name: 'currencySymbol',
      type: 'text',
      defaultValue: '₫',
    },
    {
      name: 'country',
      type: 'text',
      defaultValue: 'Vietnam',
    },
    {
      name: 'freeShippingThreshold',
      type: 'number',
      defaultValue: 6578950,
    },
    {
      name: 'defaultProductImageBehavior',
      type: 'select',
      defaultValue: 'payload',
      options: [
        { label: 'Payload media first', value: 'payload' },
        { label: 'Shopify CDN fallback first', value: 'shopify' },
      ],
    },
    {
      name: 'productPhilosophy',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Our Product Philosophy:',
        },
        {
          name: 'subtitle',
          type: 'text',
          defaultValue: '"Less and More."',
        },
        {
          name: 'body',
          type: 'textarea',
          defaultValue: 'We re-imagine one garment at a time, combining intentional proportions with superior craftsmanship. We advocate for sustainability by producing less, building better & simplifying the way we get dressed.',
        },
      ],
    },
    {
      name: 'homeHero',
      type: 'group',
      label: 'Home Hero Banner',
      admin: {
        description:
          'Controls the 100vh homepage banner, transparent header artwork, and primary homepage CTA.',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'href',
          type: 'text',
          defaultValue: '/collections/coats-jackets',
          admin: {
            description: 'Click target for the banner.',
          },
        },
        {
          name: 'desktopImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'desktopSourceUrl',
          type: 'text',
          defaultValue: '/media/nha-trang-6h.webp',
          admin: {
            description: 'External desktop image fallback when no Payload image is selected.',
          },
        },
        {
          name: 'mobileImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'mobileSourceUrl',
          type: 'text',
          defaultValue: '/media/nha-trang-6h.webp',
          admin: {
            description: 'External mobile image fallback when no Payload image is selected.',
          },
        },
        {
          name: 'eyebrow',
          type: 'text',
          defaultValue: 'california minimalism',
        },
        {
          name: 'eyebrowVi',
          type: 'text',
          defaultValue: 'california minimalism',
        },
        {
          name: 'title',
          type: 'textarea',
          defaultValue: 'accessible design by producing less & building better.',
        },
        {
          name: 'titleVi',
          type: 'textarea',
          defaultValue: 'thiết kế dễ tiếp cận bằng cách sản xuất ít hơn và xây dựng tốt hơn.',
        },
        {
          name: 'body',
          type: 'textarea',
          defaultValue: 'from the palm-fringed western edge of the american dream.',
        },
        {
          name: 'bodyVi',
          type: 'textarea',
          defaultValue: 'từ rìa phía tây của giấc mơ mỹ.',
        },
        {
          name: 'ctaLabel',
          type: 'text',
          defaultValue: 'shop all',
        },
        {
          name: 'ctaLabelVi',
          type: 'text',
          defaultValue: 'mua sắm',
        },
        {
          name: 'textPosition',
          type: 'select',
          defaultValue: 'bottom-right',
          options: [
            { label: 'Bottom left', value: 'bottom-left' },
            { label: 'Bottom center', value: 'bottom-center' },
            { label: 'Bottom right', value: 'bottom-right' },
            { label: 'Center', value: 'center' },
          ],
        },
        {
          name: 'textTheme',
          type: 'select',
          defaultValue: 'light',
          options: [
            { label: 'Light text', value: 'light' },
            { label: 'Dark text', value: 'dark' },
          ],
        },
        {
          name: 'overlayOpacity',
          type: 'number',
          defaultValue: 0.08,
          min: 0,
          max: 0.6,
          admin: {
            description: '0 keeps the image clean. Use up to 0.6 only when text needs contrast.',
          },
        },
      ],
    },
    {
      name: 'newsletterPopup',
      type: 'group',
      label: 'Newsletter Popup',
      admin: {
        description:
          'Controls the customer capture popup. It is intentionally frequency-limited on the frontend so it does not annoy shoppers.',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'showOnPaths',
          type: 'array',
          defaultValue: [{ path: '/' }, { path: '/collections/shop-all' }],
          admin: {
            description: 'Exact frontend paths where the popup can appear.',
          },
          fields: [
            {
              name: 'path',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'delayMs',
          type: 'number',
          defaultValue: 1800,
          min: 0,
          admin: {
            description: 'Delay before opening after the page is ready.',
          },
        },
        {
          name: 'dismissDays',
          type: 'number',
          defaultValue: 7,
          min: 1,
          admin: {
            description: 'After dismissing, hide the popup for this many days.',
          },
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'logoSourceUrl',
          type: 'text',
          defaultValue: '/media/dien-logo-header.png',
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'join us, in southern california',
        },
        {
          name: 'titleVi',
          type: 'text',
          defaultValue: 'tham gia cùng chúng tôi, tại southern california',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: 'get early access to new product launches & events',
        },
        {
          name: 'descriptionVi',
          type: 'textarea',
          defaultValue: 'nhận quyền truy cập sớm cho các đợt ra mắt sản phẩm và sự kiện',
        },
        {
          name: 'placeholder',
          type: 'text',
          defaultValue: 'email address',
        },
        {
          name: 'placeholderVi',
          type: 'text',
          defaultValue: 'email',
        },
        {
          name: 'buttonLabel',
          type: 'text',
          defaultValue: 'subscribe',
        },
        {
          name: 'buttonLabelVi',
          type: 'text',
          defaultValue: 'đăng ký',
        },
        {
          name: 'privacyText',
          type: 'text',
          defaultValue: 'by subscribing, you agree to the privacy policy',
        },
        {
          name: 'privacyTextVi',
          type: 'text',
          defaultValue: 'khi đăng ký, bạn đồng ý với chính sách bảo mật',
        },
        {
          name: 'privacyHref',
          type: 'text',
          defaultValue: '/pages/privacy-policy',
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'California Arts™ — California Minimalism',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: 'Accessible design by producing less & building better.',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
  ],
}
