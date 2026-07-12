import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
        try {
          const { revalidatePath } = await import('next/cache')
          revalidatePath('/', 'layout')
          console.log('Revalidated site settings layout cache')
        } catch (err) {
          console.error('Failed to revalidate layout:', err)
        }
      },
    ],
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'Điển',
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      defaultValue: 'Điển. Accessible design by producing less & building better.',
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
      name: 'designSystem',
      type: 'group',
      label: 'Typography & Spacing',
      admin: {
        description:
          'Global design controls used by the storefront. Uploaded fonts are managed in the Fonts collection.',
      },
      fields: [
        {
          name: 'typography',
          type: 'group',
          fields: [
            {
              name: 'bodyFont',
              type: 'relationship',
              relationTo: 'fonts',
              admin: {
                description:
                  'Default copy font. When empty, the storefront keeps SVN Times New Roman 2.',
              },
            },
            {
              name: 'headingFont',
              type: 'relationship',
              relationTo: 'fonts',
              admin: {
                description:
                  'Headings and editorial titles. When empty, the body font is used.',
              },
            },
            {
              name: 'uiFont',
              type: 'relationship',
              relationTo: 'fonts',
              admin: {
                description:
                  'Buttons, inputs, navigation, mega menu, and other interface controls. When empty, SVN Arial 3 is used.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'headingSize',
                  type: 'number',
                  defaultValue: 22,
                  min: 16,
                  max: 64,
                  admin: {
                    width: '33.333%',
                    description: 'Heading size in px.',
                  },
                },
                {
                  name: 'subheadingSize',
                  type: 'number',
                  defaultValue: 17,
                  min: 13,
                  max: 36,
                  admin: {
                    width: '33.333%',
                    description: 'Subheading size in px.',
                  },
                },
                {
                  name: 'bodySize',
                  type: 'number',
                  defaultValue: 16,
                  min: 12,
                  max: 24,
                  admin: {
                    width: '33.333%',
                    description: 'Body text size in px.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'lineHeight',
                  type: 'number',
                  defaultValue: 1.5,
                  min: 1,
                  max: 2.2,
                  admin: {
                    width: '50%',
                    step: 0.05,
                    description: 'Global text line-height.',
                  },
                },
                {
                  name: 'letterSpacing',
                  type: 'number',
                  defaultValue: 0,
                  min: -0.08,
                  max: 0.12,
                  admin: {
                    width: '50%',
                    step: 0.005,
                    description: 'Global letter spacing in em.',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'spacing',
          type: 'group',
          fields: [
            {
              name: 'scale',
              type: 'number',
              defaultValue: 1,
              min: 0.7,
              max: 1.6,
              admin: {
                step: 0.05,
                description:
                  'Global spacing multiplier. 1 is the current design, 0.9 is tighter, and 1.1 is more spacious.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'pagePaddingMobile',
                  type: 'number',
                  defaultValue: 16,
                  min: 0,
                  max: 64,
                  admin: {
                    width: '33.333%',
                    description: 'Mobile side padding in px.',
                  },
                },
                {
                  name: 'pagePaddingDesktop',
                  type: 'number',
                  defaultValue: 28,
                  min: 0,
                  max: 160,
                  admin: {
                    width: '33.333%',
                    description: 'Desktop side padding in px.',
                  },
                },
                {
                  name: 'gridGap',
                  type: 'number',
                  defaultValue: 16,
                  min: 0,
                  max: 80,
                  admin: {
                    width: '33.333%',
                    description: 'Product and layout grid gap in px.',
                  },
                },
              ],
            },
          ],
        },
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
          defaultValue: 'điển / thường phục hằng ngày',
        },
        {
          name: 'eyebrowVi',
          type: 'text',
          defaultValue: 'dien everyday wardrobe',
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
          defaultValue: 'join us, at điển',
        },
        {
          name: 'titleVi',
          type: 'text',
          defaultValue: 'tham gia cùng điển',
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
          defaultValue: 'Điển',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: 'Điển. Accessible design by producing less & building better.',
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
