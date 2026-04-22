import type { CollectionConfig } from 'payload'
import { VIEW_ALL_SECTION_BAR_DEFAULTS } from '../../lib/collection-bar-content'

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
      name: 'viewAllSections',
      type: 'array',
      label: 'View All sections',
      defaultValue: VIEW_ALL_SECTION_BAR_DEFAULTS,
      admin: {
        condition: (_, siblingData) => siblingData?.handle === 'shop-all',
        description: 'Controls the sticky category bars on /collections/shop-all. Handles must match the built-in section handles.',
      },
      fields: [
        {
          name: 'handle',
          type: 'text',
          required: true,
          admin: {
            description: 'Example: jeans, coats, jackets.',
          },
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'titleVi',
          type: 'text',
          label: 'Vietnamese title',
        },
        {
          name: 'barDescription',
          type: 'textarea',
          label: 'Bar description',
          admin: {
            description: 'Plain text rendered in the sticky bar at 10px.',
          },
        },
        {
          name: 'barDescriptionHtml',
          type: 'textarea',
          label: 'Bar description HTML',
          admin: {
            description: 'Optional HTML override. Leave blank unless this bar needs markup.',
          },
        },
      ],
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
