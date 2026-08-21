import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'handle', 'productType', 'status', 'updatedAt'],
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
      defaultValue: 'điển',
    },
    {
      name: 'collections',
      type: 'relationship',
      relationTo: 'product-collections',
      hasMany: true,
      admin: {
        description: 'Collections this product belongs to.',
      },
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
    // Product Media
    {
      name: 'mediaLayout',
      type: 'group',
      admin: {
        description:
          'Controls how product detail media is ordered. Default keeps videos after all selected color images.',
      },
      fields: [
        {
          name: 'videoPlacement',
          type: 'select',
          defaultValue: 'after-images',
          options: [
            { label: 'After all product images', value: 'after-images' },
            { label: 'Manual by position', value: 'manual' },
          ],
        },
      ],
    },
    {
      name: 'images',
      type: 'array',
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        {
          name: 'shopifyImageId',
          type: 'number',
          admin: {
            hidden: true,
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'sourceUrl',
          type: 'text',
          admin: {
            hidden: true,
            description: 'Original Shopify CDN URL. Used as a fallback while media is importing.',
          },
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
        {
          name: 'width',
          type: 'number',
        },
        {
          name: 'height',
          type: 'number',
        },
        {
          name: 'variantIds',
          type: 'array',
          fields: [
            {
              name: 'shopifyVariantId',
              type: 'number',
              admin: {
                hidden: true,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'videos',
      type: 'array',
      labels: {
        singular: 'Video',
        plural: 'Videos',
      },
      admin: {
        description:
          'Product detail videos. Upload to Product Videos or use an external MP4/WebM URL. By default videos render after product images.',
      },
      fields: [
        {
          name: 'video',
          type: 'upload',
          relationTo: 'product-videos',
          admin: {
            description: 'Managed video file in Payload.',
          },
        },
        {
          name: 'sourceUrl',
          type: 'text',
          admin: {
            description: 'External MP4/WebM/CDN URL fallback when no Payload video is selected.',
          },
        },
        {
          name: 'poster',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Overrides the poster image from the Product Video asset.',
          },
        },
        {
          name: 'posterSourceUrl',
          type: 'text',
          admin: {
            description: 'External poster image URL fallback.',
          },
        },
        {
          name: 'alt',
          type: 'text',
        },
        {
          name: 'position',
          type: 'number',
          defaultValue: 999,
          admin: {
            description:
              'Used when video placement is manual. Smaller numbers appear earlier in the media column.',
          },
        },
        {
          name: 'placement',
          type: 'select',
          defaultValue: 'inherit',
          options: [
            { label: 'Use product media layout', value: 'inherit' },
            { label: 'After images', value: 'after-images' },
            { label: 'Manual by position', value: 'manual' },
          ],
        },
        {
          name: 'autoplay',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'loop',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'muted',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'controls',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    // Storefront Option Controls
    {
      name: 'colorOptions',
      type: 'array',
      labels: {
        singular: 'Color',
        plural: 'Colors',
      },
      admin: {
        description:
          'Manage storefront color swatches. The value should match the color value used by variants.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Display label, for example Black or Brown Melange.',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            description: 'Variant value this color controls. Usually the same as the label.',
          },
        },
        {
          name: 'swatch',
          type: 'text',
          admin: {
            description: 'Hex color for the swatch, for example #111111.',
          },
        },
        {
          name: 'position',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'available',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Hide this color from the storefront when disabled.',
          },
        },
      ],
    },
    {
      name: 'sizeOptions',
      type: 'array',
      labels: {
        singular: 'Size',
        plural: 'Sizes',
      },
      admin: {
        description:
          'Manage storefront size order and visibility. The value should match the size value used by variants.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Display label, for example XS, M, 30, or 36.',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            description: 'Variant value this size controls. Usually the same as the label.',
          },
        },
        {
          name: 'position',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'available',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Hide this size from the storefront when disabled.',
          },
        },
      ],
    },
    {
      name: 'sizeSelectorStyle',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Auto', value: 'auto' },
        { label: 'Text underline', value: 'text' },
        { label: 'Box buttons', value: 'box' },
      ],
      admin: {
        description:
          'Controls storefront size picker style. Auto follows the California Arts template: text labels with underline on the active size.',
      },
    },
    // Legacy product options imported from Shopify.
    {
      name: 'options',
      type: 'array',
      labels: {
        singular: 'Option',
        plural: 'Options',
      },
      admin: {
        description:
          'Legacy option mapping used by imported variants. Prefer Colors and Sizes above for storefront ordering.',
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
        {
          name: 'position',
          type: 'number',
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
          name: 'shopifyVariantId',
          type: 'number',
          admin: {
            hidden: true,
          },
        },
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
          name: 'option3',
          type: 'text',
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
        {
          name: 'featuredImageSourceUrl',
          type: 'text',
          admin: {
            hidden: true,
          },
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
    {
      name: 'care',
      type: 'richText',
    },
    {
      name: 'sizeFit',
      type: 'richText',
    },
    {
      name: 'shippingReturns',
      type: 'richText',
    },
    {
      name: 'material',
      type: 'text',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'shopifyCreatedAt',
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
        hidden: true,
        position: 'sidebar',
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
