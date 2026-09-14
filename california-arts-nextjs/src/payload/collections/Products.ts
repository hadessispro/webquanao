import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'handle', 'price', 'productType', 'status', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.price !== undefined && data.price !== null && data.price !== '') {
          const numericPrice = Number(data.price)
          const numericCompareAt = data.compareAtPrice !== undefined && data.compareAtPrice !== null && data.compareAtPrice !== '' ? Number(data.compareAtPrice) : null

          if (!Array.isArray(data.variants) || data.variants.length === 0) {
            data.variants = [
              {
                title: 'Default Title',
                price: numericPrice,
                compareAtPrice: numericCompareAt,
                available: true,
              },
            ]
          } else {
            data.variants.forEach((v: Record<string, unknown>) => {
              v.price = numericPrice
              if (numericCompareAt !== null) {
                v.compareAtPrice = numericCompareAt
              }
            })
          }
        }
        return data
      },
    ],
    afterChange: [
      async () => {
        // Make edits (price, images, colours, videos, text) show on the storefront
        // right away instead of waiting for the in-memory cache TTL.
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
    afterDelete: [
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
      name: 'price',
      type: 'number',
      admin: {
        description: 'Giá bán sản phẩm (VND). Ví dụ: 9594000',
        position: 'sidebar',
      },
    },
    {
      name: 'compareAtPrice',
      type: 'number',
      admin: {
        description: 'Giá gốc / Giá cũ chưa giảm (VND). Ví dụ: 12000000',
        position: 'sidebar',
      },
    },
    {
      name: 'sizeChartImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Bảng size / Gợi ý size (Hình ảnh). Tải ảnh bảng size của sản phẩm lên đây.',
        position: 'sidebar',
      },
    },
    {
      name: 'sizeChartImageSourceUrl',
      type: 'text',
      admin: {
        description: 'URL ảnh bảng size ngoài (nếu không tải trực tiếp từ máy).',
        position: 'sidebar',
      },
    },
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
      name: 'subtitle',
      type: 'textarea',
      admin: {
        description: 'Mô tả ngắn / ghi chú sản phẩm hiển thị ở thanh tiêu đề danh mục (ví dụ: a vintage inspired vegan leather blouson...).',
      },
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
          relationTo: 'media',
          admin: {
            description: 'File Video (Tải trực tiếp file MP4/WebM từ máy lên Media hoặc dán URL ở ô dưới).',
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
          name: 'color',
          type: 'text',
          admin: {
            description:
              'Màu áp dụng cho video này (ví dụ: black, white, đen, trắng). Nhập ĐÚNG giá trị màu (value) của biến thể để video chỉ hiện khi khách chọn màu đó. Để trống nếu muốn video hiển thị cho mọi màu.',
          },
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
          name: 'swatchImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Ảnh mẫu màu (File hình ảnh). Tải ảnh mẫu vải/màu của biến thể lên đây.',
          },
        },
        {
          name: 'swatchImageSourceUrl',
          type: 'text',
          admin: {
            description: 'URL ảnh mẫu màu ngoài (nếu không tải trực tiếp từ máy).',
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
    {
      name: 'sizeFinder',
      type: 'group',
      label: 'Công cụ "Tìm size" (Size Finder)',
      admin: {
        description:
          'Cấu hình gợi ý size riêng cho sản phẩm này. Có thể dùng chung từ Site Settings, hoặc tùy chỉnh format size (S/M/L hoặc 28/30/32), dáng Ôm / Thoải mái và bảng gợi ý.',
      },
      fields: [
        {
          name: 'mode',
          type: 'select',
          label: 'Chế độ hoạt động',
          defaultValue: 'inherit',
          options: [
            { label: 'Dùng cấu hình chung từ Cài đặt website (Mặc định)', value: 'inherit' },
            { label: 'Tùy chỉnh riêng cho sản phẩm này', value: 'custom' },
            { label: 'Tắt tính năng tìm size cho sản phẩm này', value: 'disabled' },
          ],
        },
        {
          name: 'fitPreference',
          type: 'select',
          label: 'Lựa chọn dáng sản phẩm (Fit)',
          defaultValue: 'auto',
          admin: {
            condition: (data, siblingData) => siblingData?.mode === 'custom',
            description:
              'Chọn cách hiển thị nút chọn dáng: Tự động (Áo có Ôm/Thoải mái; Quần chỉ có 1 dáng), Có cả 2 lựa chọn, hoặc Chỉ 1 dáng chung.',
          },
          options: [
            { label: 'Tự động (Áo có Ôm/Thoải mái; Quần chỉ 1 dáng)', value: 'auto' },
            { label: 'Có cả 2 lựa chọn: Ôm & Thoải mái', value: 'both' },
            { label: 'Chỉ có 1 dáng chung (Không hiện nút chọn dáng)', value: 'single' },
          ],
        },
        {
          name: 'customHeights',
          type: 'textarea',
          label: 'Danh sách chiều cao (mỗi dòng 1 mức)',
          admin: {
            condition: (data, siblingData) => siblingData?.mode === 'custom',
            description:
              'Ví dụ:\n≤1m66\n1m68–1m70\n1m71–1m75\n1m76–1m78\n1m80–1m87\n(Để trống sẽ lấy danh sách chiều cao mặc định)',
          },
        },
        {
          name: 'customWeights',
          type: 'textarea',
          label: 'Danh sách cân nặng (mỗi dòng 1 mức)',
          admin: {
            condition: (data, siblingData) => siblingData?.mode === 'custom',
            description:
              'Ví dụ:\n≤53 kg\n54–58 kg\n59–61 kg\n62–64 kg\n65–69 kg\n70–74 kg\n75–81 kg\n82–86 kg\n(Để trống sẽ lấy danh sách cân nặng mặc định)',
          },
        },
        {
          name: 'customWeightsComfort',
          type: 'textarea',
          label: 'Danh sách cân nặng cho dáng Thoải mái (nếu khác)',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.mode === 'custom' && siblingData?.fitPreference !== 'single',
            description:
              'Chỉ cần nhập nếu dáng Thoải mái có các mốc cân nặng khác với dáng Ôm/Chung ở trên.',
          },
        },
        {
          name: 'sizeRules',
          type: 'array',
          label: 'Quy tắc gợi ý size (Thêm từng dòng trực tiếp)',
          admin: {
            condition: (data, siblingData) => siblingData?.mode === 'custom',
            description:
              'Thêm quy tắc: Chiều cao + Cân nặng + (Dáng) => Size gợi ý (S, M, L, XL hoặc 28, 29, 30, 31, 32...). Form thân thiện, không cần viết JSON!',
          },
          fields: [
            {
              name: 'height',
              type: 'text',
              label: 'Chiều cao (VD: 1m71–1m75)',
            },
            {
              name: 'weight',
              type: 'text',
              label: 'Cân nặng (VD: 62–64 kg)',
            },
            {
              name: 'fit',
              type: 'select',
              label: 'Dáng áp dụng',
              defaultValue: 'all',
              options: [
                { label: 'Tất cả / Dáng chung', value: 'all' },
                { label: 'Ôm', value: 'ôm' },
                { label: 'Thoải mái', value: 'thoải mái' },
              ],
            },
            {
              name: 'size',
              type: 'text',
              label: 'Size gợi ý (VD: S, M, L hoặc 28, 29, 30, 31, 32...)',
              required: true,
            },
          ],
        },
        {
          name: 'customMatrixText',
          type: 'textarea',
          label: 'Hoặc dán nhanh ma trận size (Tùy chọn phụ trợ)',
          admin: {
            condition: (data, siblingData) => siblingData?.mode === 'custom',
            description:
              'Tùy chọn: Thay vì thêm từng dòng ở trên, bạn có thể dán nhanh từng hàng theo mẫu:\n≤1m66 | 28, 28, 29, 30, 31\n1m68–1m70 | 28, 29, 30, 31, 32',
          },
        },
      ],
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
    // Storefront info tabs shown under the Add-to-bag button (chi tiết / giao hàng / đổi size).
    // These are the easiest way to control that text. When left empty the storefront
    // falls back to the Accordions below (matched by title) and then to sensible defaults.
    {
      name: 'infoTabs',
      type: 'group',
      label: 'Info tabs (chi tiết / giao hàng / đổi size)',
      admin: {
        description:
          'Nội dung 3 tab dưới nút đặt hàng ở trang chi tiết sản phẩm. Nhập trực tiếp tại đây để chỉnh chữ. Bỏ trống nếu muốn dùng nội dung mặc định.',
      },
      fields: [
        {
          name: 'details',
          type: 'richText',
          label: 'Tab "chi tiết"',
        },
        {
          name: 'shipping',
          type: 'richText',
          label: 'Tab "giao hàng"',
        },
        {
          name: 'exchange',
          type: 'richText',
          label: 'Tab "đổi size"',
        },
      ],
    },
    // Product Accordions (Details, Size & Fit, etc.) — legacy source for the info tabs.
    {
      name: 'accordions',
      type: 'array',
      labels: {
        singular: 'Accordion',
        plural: 'Accordions',
      },
      admin: {
        description:
          'Nội dung cũ theo từng mục. Chỉ dùng khi để trống "Info tabs" ở trên. Tiêu đề phải đúng: Details, Size & Fit, Sustainability, Shipping & Returns, Need Assistance?',
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
