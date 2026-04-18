import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'sections',
      type: 'blocks',
      blocks: [
        {
          slug: 'hero',
          fields: [
            { name: 'heading', type: 'text' },
            { name: 'subheading', type: 'text' },
            { name: 'image', type: 'upload', relationTo: 'media' },
            { name: 'ctaText', type: 'text' },
            { name: 'ctaLink', type: 'text' },
          ],
        },
        {
          slug: 'text-section',
          fields: [
            { name: 'heading', type: 'text' },
            { name: 'body', type: 'richText' },
          ],
        },
        {
          slug: 'image-with-text',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media' },
            { name: 'heading', type: 'text' },
            { name: 'body', type: 'richText' },
            {
              name: 'imagePosition',
              type: 'select',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
              ],
              defaultValue: 'left',
            },
          ],
        },
        {
          slug: 'collapsible-rows',
          fields: [
            { name: 'heading', type: 'text' },
            {
              name: 'rows',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'content', type: 'richText' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}
