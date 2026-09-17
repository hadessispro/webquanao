import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
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
    adminThumbnail: ({ doc }) => {
      const mime = doc?.mimeType || (doc as any)?.mime_type || ''
      const filename = (doc?.filename as string) || ''
      if (
        (typeof mime === 'string' && mime.startsWith('video/')) ||
        /\.(mp4|webm|mov|mkv|ogg|m4v|avi)$/i.test(filename)
      ) {
        return null
      }
      if (doc?.sourceUrl && typeof doc.sourceUrl === 'string') {
        return doc.sourceUrl
      }
      return (doc?.sizes as any)?.thumbnail?.url || (doc?.url as string) || null
    },
    // Allow both images and product videos (mp4/webm). Sharp only resizes images;
    // videos are stored as-is and served from /api/media/file/<name>.
    mimeTypes: ['image/*', 'video/*'],
    handlers: [
      async (_req, { doc, params }) => {
        const fs = await import('node:fs')
        const path = await import('node:path')
        const fileDir = path.resolve('media')
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
