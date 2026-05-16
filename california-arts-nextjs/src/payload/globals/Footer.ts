import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'desktopLogo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'mobileLogo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'columns',
      type: 'array',
      maxRows: 5,
      admin: {
        description: 'Footer menu columns shown before the newsletter block.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'titleVi',
          type: 'text',
          label: 'Vietnamese title',
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'labelVi', type: 'text', label: 'Vietnamese label' },
            { name: 'url', type: 'text', required: true },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Subscribe to West Coast Living',
        },
        {
          name: 'titleVi',
          type: 'text',
          label: 'Vietnamese title',
          defaultValue: 'Đăng ký West Coast Living',
        },
        {
          name: 'description',
          type: 'text',
          defaultValue: 'Stay connected for product launches, restocks and events from Southern California.',
        },
        {
          name: 'descriptionVi',
          type: 'text',
          label: 'Vietnamese description',
          defaultValue:
            'Theo dõi các đợt ra mắt sản phẩm, restock và sự kiện từ Southern California.',
        },
        {
          name: 'placeholder',
          type: 'text',
          defaultValue: 'Email',
        },
        {
          name: 'placeholderVi',
          type: 'text',
          label: 'Vietnamese placeholder',
          defaultValue: 'Email',
        },
        {
          name: 'buttonLabel',
          type: 'text',
          defaultValue: 'Subscribe',
        },
        {
          name: 'buttonLabelVi',
          type: 'text',
          label: 'Vietnamese button label',
          defaultValue: 'Đăng ký',
        },
        {
          name: 'privacyText',
          type: 'text',
          defaultValue: 'By subscribing, you agree to the privacy policy',
        },
        {
          name: 'privacyTextVi',
          type: 'text',
          label: 'Vietnamese privacy text',
          defaultValue: 'Khi đăng ký, bạn đồng ý với chính sách bảo mật',
        },
        {
          name: 'privacyHref',
          type: 'text',
          defaultValue: '/pages/privacy-policy',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Twitter/X', value: 'twitter' },
          ],
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      defaultValue: 'điển © 2026.',
    },
    {
      name: 'locationText',
      type: 'text',
      defaultValue: 'Southern California',
    },
  ],
}
