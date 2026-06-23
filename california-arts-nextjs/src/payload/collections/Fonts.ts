import type { CollectionConfig } from 'payload'

export const Fonts: CollectionConfig = {
  slug: 'fonts',
  labels: {
    singular: 'Font',
    plural: 'Fonts',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'fontFamily',
    defaultColumns: ['fontFamily', 'weight', 'style', 'filename', 'updatedAt'],
    description:
      'Upload TTF, OTF, WOFF, or WOFF2 files, then assign them in Site Settings > Typography & Spacing.',
  },
  upload: {
    staticDir: process.env.FONT_UPLOAD_DIR || 'font-files',
    mimeTypes: [
      'font/ttf',
      'font/otf',
      'font/woff',
      'font/woff2',
      'application/font-woff',
      'application/x-font-ttf',
      'application/x-font-opentype',
      'application/octet-stream',
    ],
  },
  fields: [
    {
      name: 'fontFamily',
      type: 'text',
      required: true,
      admin: {
        description: 'CSS font-family name, for example: SVN Times New Roman 2.',
      },
    },
    {
      name: 'weight',
      type: 'select',
      required: true,
      defaultValue: '400',
      options: [
        { label: '100 - Thin', value: '100' },
        { label: '200 - Extra Light', value: '200' },
        { label: '300 - Light', value: '300' },
        { label: '400 - Regular', value: '400' },
        { label: '500 - Medium', value: '500' },
        { label: '600 - Semi Bold', value: '600' },
        { label: '700 - Bold', value: '700' },
        { label: '800 - Extra Bold', value: '800' },
        { label: '900 - Black', value: '900' },
      ],
    },
    {
      name: 'style',
      type: 'select',
      required: true,
      defaultValue: 'normal',
      options: [
        { label: 'Normal', value: 'normal' },
        { label: 'Italic', value: 'italic' },
      ],
    },
    {
      name: 'fallback',
      type: 'select',
      required: true,
      defaultValue: 'sans-serif',
      options: [
        { label: 'Sans serif', value: 'sans-serif' },
        { label: 'Serif', value: 'serif' },
        { label: 'Monospace', value: 'monospace' },
      ],
      admin: {
        description: 'Fallback used while the uploaded font is loading.',
      },
    },
  ],
}
