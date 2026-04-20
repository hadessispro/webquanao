import type { CollectionConfig } from 'payload'

export const ProductVideos: CollectionConfig = {
  slug: 'product-videos',
  labels: {
    singular: 'Product Video',
    plural: 'Product Videos',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'source', 'filename', 'updatedAt'],
    group: 'Commerce',
  },
  upload: {
    staticDir: 'product-videos',
    mimeTypes: ['video/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Short description for accessibility and admin search.',
      },
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'manual',
      options: [
        { label: 'Manual upload', value: 'manual' },
        { label: 'External CDN', value: 'external' },
        { label: 'Layout asset', value: 'layout' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      admin: {
        description: 'Original or external video URL used when the file is hosted outside Payload.',
        position: 'sidebar',
      },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Poster image shown before the video loads.',
        position: 'sidebar',
      },
    },
  ],
}
