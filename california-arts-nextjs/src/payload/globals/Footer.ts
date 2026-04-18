import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      maxRows: 5,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Subscribe to West Coast Living',
        },
        {
          name: 'description',
          type: 'text',
          defaultValue: 'Stay connected for product launches, restocks and events from Southern California.',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Twitter/X', value: 'twitter' },
          ],
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      defaultValue: 'California Arts © 2024. Southern California.',
    },
  ],
}
