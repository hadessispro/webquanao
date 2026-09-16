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
    adminThumbnail: () => null,
    handlers: [
      async (_req, { doc, params }) => {
        const fs = await import('node:fs')
        const path = await import('node:path')
        const fileDir = path.resolve('product-videos')
        const filePath = path.resolve(fileDir, params.filename)
        if (fs.existsSync(filePath)) {
          return null
        }
        const sourceUrl = (doc as any)?.sourceUrl || (doc as any)?.source_url
        if (sourceUrl && typeof sourceUrl === 'string') {
          return Response.redirect(sourceUrl, 302)
        }
        return new Response('File not found', { status: 404 })
      },
    ],
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
