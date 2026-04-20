import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'source', 'filename', 'updatedAt'],
  },
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 600,
        height: 800,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'manual',
      options: [
        { label: 'Manual upload', value: 'manual' },
        { label: 'Shopify import', value: 'shopify' },
        { label: 'Layout asset', value: 'layout' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      unique: true,
      admin: {
        hidden: true,
        description: 'Original URL used for imports. Keeps media imports idempotent.',
        position: 'sidebar',
      },
    },
    {
      name: 'sourceId',
      type: 'text',
      admin: {
        hidden: true,
        description: 'Shopify image ID or other upstream identifier.',
        position: 'sidebar',
      },
    },
    {
      name: 'sourceFilename',
      type: 'text',
      admin: {
        hidden: true,
        position: 'sidebar',
      },
    },
    {
      name: 'originalWidth',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'originalHeight',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
