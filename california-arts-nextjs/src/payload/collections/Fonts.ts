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
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (!data) return data
        const filename = (data.filename || originalDoc?.filename || '').toLowerCase()
        const family = (data.fontFamily || originalDoc?.fontFamily || '').toLowerCase()

        // Auto-detect weight if default 400
        if (!data.weight || data.weight === '400') {
          if (filename.includes('bold') || filename.includes('đậm') || family.includes('bold') || family.includes('đậm')) {
            data.weight = '700'
          } else if (filename.includes('black') || family.includes('black')) {
            data.weight = '900'
          } else if (filename.includes('light') || family.includes('light')) {
            data.weight = '300'
          } else if (filename.includes('medium') || family.includes('medium')) {
            data.weight = '500'
          } else if (filename.includes('semi') || family.includes('semi')) {
            data.weight = '600'
          }
        }

        // Auto-detect style if default normal
        if (!data.style || data.style === 'normal') {
          if (filename.includes('italic') || filename.includes('nghiêng') || family.includes('italic') || family.includes('nghiêng')) {
            data.style = 'italic'
          }
        }

        return data
      },
    ],
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
        description: 'Tên Font Family (VD: SVN Times New Roman 2, TIMES thường). Hệ thống sẽ tự liên kết các file Đậm/Nghiêng có liên quan.',
      },
    },
    {
      name: 'weight',
      type: 'select',
      required: true,
      defaultValue: '400',
      admin: {
        description: 'Độ đậm font (400 - Thường, 700 - Đậm). Tự động nhận diện nếu tên file có chữ bold/đậm.',
      },
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
