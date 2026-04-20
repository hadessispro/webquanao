import type { CollectionConfig } from 'payload'

export const ProductCollections: CollectionConfig = {
  slug: 'product-collections',
  labels: {
    singular: 'Collection',
    plural: 'Collections',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'handle', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'shopifyId',
      type: 'number',
      unique: true,
      admin: {
        hidden: true,
        position: 'sidebar',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'handle',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'descriptionHtml',
      type: 'textarea',
      admin: {
        description: 'Legacy Shopify HTML description.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'sourceImageUrl',
      type: 'text',
      admin: {
        hidden: true,
        description: 'Original Shopify collection image URL, if present.',
      },
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
    {
      name: 'productsCount',
      type: 'number',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'showInMenu',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'menuLabel',
      type: 'text',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.showInMenu),
        position: 'sidebar',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        hidden: true,
        position: 'sidebar',
      },
    },
    {
      name: 'shopifyUpdatedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
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
