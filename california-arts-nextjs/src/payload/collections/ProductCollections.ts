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
      labels: {
        singular: 'Phân mục',
        plural: 'Các phân mục',
      },
      fields: [
        {
          name: 'handle',
          type: 'select',
          required: true,
          label: 'Phân mục chuẩn (Handle)',
          admin: {
            description: 'Tìm kiếm hoặc chọn phân mục từ danh sách các nhóm hàng có sẵn.',
          },
          options: [
            { label: '01 Coats (Áo khoác dáng dài)', value: 'coats' },
            { label: '02 Jackets (Áo khoác)', value: 'jackets' },
            { label: '03 Denim Jackets (Áo khoác denim)', value: 'denim-jackets' },
            { label: '04 Blazers (Áo blazer)', value: 'blazers' },
            { label: '05 Crewneck Sweaters (Áo len cổ tròn)', value: 'crewneck-sweaters' },
            { label: '06 V-Neck Sweaters (Áo len cổ tim)', value: 'v-neck-sweaters' },
            { label: '07 Cardigans (Áo cardigan)', value: 'cardigans' },
            { label: '08 Polos (Áo polo)', value: 'polos' },
            { label: '09 Turtlenecks (Áo len cổ lọ)', value: 'turtlenecks' },
            { label: '10 Sweatshirts (Áo nỉ)', value: 'sweatshirts' },
            { label: '11 Long Sleeve Shirts (Áo sơ mi dài tay)', value: 'long-sleeve-shirts' },
            { label: '12 Short Sleeve Shirts (Áo sơ mi ngắn tay)', value: 'short-sleeve-shirts' },
            { label: '13 Long Sleeve Tees & Henleys (Áo thun dài tay & Henley)', value: 'long-sleeve-tees-henleys' },
            { label: '14 T-Shirts (Áo thun)', value: 't-shirts' },
            { label: '15 Vests (Áo gi-lê)', value: 'vests' },
            { label: '16 Tank Tops (Áo ba lỗ)', value: 'tank-tops' },
            { label: '17 Muscle Tanks (Áo tank)', value: 'muscle-tanks' },
            { label: '18 Pants & Trousers (Quần dài)', value: 'pants-trousers' },
            { label: '19 Jeans (Quần jeans)', value: 'jeans' },
            { label: '20 Shorts (Quần short)', value: 'shorts' },
            { label: '21 Accessories (Phụ kiện)', value: 'accessories' },
          ],
        },
        {
          name: 'collection',
          type: 'relationship',
          relationTo: 'product-collections',
          label: 'Gợi ý danh mục / Bộ sưu tập hiện có (Tìm kiếm danh mục)',
          admin: {
            description: 'Tìm kiếm gợi ý từ các danh mục/bộ sưu tập hiện có trong hệ thống (gõ từ khoá để tìm kiếm nhanh).',
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
        {
          name: 'products',
          type: 'relationship',
          relationTo: 'products',
          hasMany: true,
          label: 'Sản phẩm chỉ định (Tìm kiếm & Chọn sản phẩm)',
          admin: {
            description: 'Tìm kiếm và chọn các sản phẩm cụ thể muốn hiển thị trong mục này (gõ từ khoá để tìm và chọn nhiều sản phẩm, kéo thả sắp xếp). Nếu để trống, hệ thống sẽ tự động quét theo phân loại danh mục.',
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
