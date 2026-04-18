import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'productType', 'status', 'updatedAt'],
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
      name: 'handle',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly slug (e.g., "vegan-leather-trench")',
      },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'bodyHtml',
      type: 'textarea',
      admin: {
        description: 'Raw HTML description (legacy from Shopify)',
      },
    },
    {
      name: 'productType',
      type: 'text',
      admin: {
        description: 'e.g., Coats, Knitwear, Tailoring',
      },
    },
    {
      name: 'vendor',
      type: 'text',
      defaultValue: 'California Arts',
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Draft', value: 'draft' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    // Product Images
    {
      name: 'images',
      type: 'array',
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
        },
        {
          name: 'position',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
    // Product Options (e.g., Color, Size)
    {
      name: 'options',
      type: 'array',
      labels: {
        singular: 'Option',
        plural: 'Options',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: { description: 'e.g., Color, Size' },
        },
        {
          name: 'values',
          type: 'array',
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    // Product Variants
    {
      name: 'variants',
      type: 'array',
      labels: {
        singular: 'Variant',
        plural: 'Variants',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { description: 'e.g., "Black / M"' },
        },
        {
          name: 'sku',
          type: 'text',
        },
        {
          name: 'option1',
          type: 'text',
          admin: { description: 'Color value' },
        },
        {
          name: 'option2',
          type: 'text',
          admin: { description: 'Size value' },
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          admin: { description: 'Price in VND (e.g., 9594000)' },
        },
        {
          name: 'compareAtPrice',
          type: 'number',
          admin: { description: 'Original price for sale items' },
        },
        {
          name: 'available',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    // Product Accordions (Details, Size & Fit, etc.)
    {
      name: 'accordions',
      type: 'array',
      labels: {
        singular: 'Accordion',
        plural: 'Accordions',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { description: 'e.g., Details, Size & Fit, Sustainability' },
        },
        {
          name: 'content',
          type: 'richText',
        },
      ],
    },
    // Related Products (Style With)
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        description: '"Style With" section — related products',
      },
    },
    // SEO
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
  ],
}
