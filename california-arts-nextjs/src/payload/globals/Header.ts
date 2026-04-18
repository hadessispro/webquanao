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
      defaultValue: 'California Arts',
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
      ],
    },
    {
      name: 'navigation',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'megaMenu',
          type: 'group',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'categories',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
              ],
            },
            {
              name: 'images',
              type: 'array',
              maxRows: 2,
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'caption', type: 'text' },
                { name: 'url', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
