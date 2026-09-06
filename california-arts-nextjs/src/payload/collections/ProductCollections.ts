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
  hooks: {
    afterChange: [
      async () => {
        try {
          const { resetStorefrontProductCache } = await import('../../lib/product-data')
          resetStorefrontProductCache()
        } catch (err) {
          console.error('Failed to reset storefront product cache:', err)
        }
        try {
          const { revalidatePath } = await import('next/cache')
          revalidatePath('/', 'layout')
        } catch (err) {
          console.error('Failed to revalidate storefront paths:', err)
        }
      },
    ],
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
      label: '21 Thanh phân mục dính (Sticky Bars - Xem tất cả)',
      defaultValue: VIEW_ALL_SECTION_BAR_DEFAULTS,
      admin: {
        condition: (data, siblingData) => (data?.handle || siblingData?.handle) === 'shop-all',
        description: 'Cấu hình 21 thanh phân mục dính (sticky category bars) cho trang Xem tất cả (/collections/shop-all). Bạn có thể đổi tiêu đề tiếng Việt và mô tả của từng danh mục tại đây.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'handle',
          type: 'text',
          required: true,
          admin: {
            description: 'Mã danh mục (ví dụ: coats, jackets, jeans, accessories).',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Tiêu đề tiếng Anh',
        },
        {
          name: 'titleVi',
          type: 'text',
          label: 'Tiêu đề tiếng Việt',
        },
        {
          name: 'barDescription',
          type: 'textarea',
          label: 'Mô tả ngắn thanh dính (Bar description)',
          admin: {
            description: 'Dòng chữ mô tả phong cách hiển thị trên thanh dính.',
          },
        },
        {
          name: 'barDescriptionHtml',
          type: 'textarea',
          label: 'Mô tả HTML (tùy chọn)',
          admin: {
            description: 'Để trống nếu không cần định dạng HTML đặc biệt.',
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
