import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logoText',
      type: 'text',
      defaultValue: 'điển',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Main header logo. Falls back to logo text or the legacy CDN logo.',
      },
    },
    {
      name: 'logoAlt',
      type: 'text',
      defaultValue: 'điển',
    },
    {
      name: 'logoHref',
      type: 'text',
      defaultValue: '/',
    },
    {
      name: 'shippingBar',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'text',
          type: 'text',
          defaultValue: 'Complimentary shipping to Vietnam on all orders over ₫6,578,950. No additional duties and fees upon delivery.',
        },
        {
          name: 'textVi',
          type: 'text',
          label: 'Vietnamese text',
          defaultValue:
            'Miễn phí vận chuyển đến Việt Nam cho đơn hàng trên ₫6,578,950. Không phát sinh thuế và phí khi giao hàng.',
        },
        {
          name: 'href',
          type: 'text',
          defaultValue: '/pages/returns-exchanges',
        },
      ],
    },
    {
      name: 'countrySelector',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Vietnam | VND ₫',
        },
        {
          name: 'labelVi',
          type: 'text',
          label: 'Vietnamese label',
          defaultValue: 'Việt Nam | VND ₫',
        },
      ],
    },
    {
      name: 'navigation',
      type: 'array',
      admin: {
        description:
          'Top menu. Use Collection for shop/category links, or use Custom href for pages and external links.',
        initCollapsed: true,
      },
      labels: {
        singular: 'Navigation item',
        plural: 'Navigation items',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          admin: {
            description: 'Optional when a collection is selected.',
          },
        },
        {
          name: 'labelVi',
          type: 'text',
          label: 'Vietnamese label',
          admin: {
            description: 'Shown when the storefront language is VI.',
          },
        },
        {
          name: 'collection',
          type: 'relationship',
          relationTo: 'product-collections',
          admin: {
            description: 'Choose a Payload collection/category instead of manually typing a URL.',
          },
        },
        {
          name: 'href',
          type: 'text',
          admin: {
            description: 'Use for custom pages or external links. Collection links are generated automatically.',
          },
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'megaMenu',
          type: 'group',
          admin: {
            description: 'Mega menu content for this navigation item.',
          },
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'columns',
              type: 'array',
              admin: {
                description: 'Group category links into readable columns.',
                initCollapsed: true,
              },
              labels: {
                singular: 'Mega menu column',
                plural: 'Mega menu columns',
              },
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'headingVi',
                  type: 'text',
                  label: 'Vietnamese heading',
                },
                {
                  name: 'headingHref',
                  type: 'text',
                },
                {
                  name: 'links',
                  type: 'array',
                  admin: {
                    description: 'Choose a collection/category or enter a custom label and href.',
                    initCollapsed: true,
                  },
                  labels: {
                    singular: 'Mega menu link',
                    plural: 'Mega menu links',
                  },
                  fields: [
                    {
                      name: 'collection',
                      type: 'relationship',
                      relationTo: 'product-collections',
                    },
                    {
                      name: 'label',
                      type: 'text',
                      admin: {
                        description: 'Optional when a collection is selected.',
                      },
                    },
                    {
                      name: 'labelVi',
                      type: 'text',
                      label: 'Vietnamese label',
                    },
                    {
                      name: 'href',
                      type: 'text',
                      admin: {
                        description: 'Optional when a collection is selected.',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'imageCards',
              type: 'array',
              maxRows: 2,
              admin: {
                description: 'Optional image cards shown in the mega menu.',
                initCollapsed: true,
              },
              labels: {
                singular: 'Mega menu image card',
                plural: 'Mega menu image cards',
              },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'sourceUrl', type: 'text' },
                { name: 'caption', type: 'text' },
                { name: 'captionVi', type: 'text', label: 'Vietnamese caption' },
                { name: 'href', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
