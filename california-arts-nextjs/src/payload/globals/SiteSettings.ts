import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'California Arts',
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      defaultValue: 'California Minimalism. Accessible design by producing less & building better.',
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'VND',
    },
    {
      name: 'currencySymbol',
      type: 'text',
      defaultValue: '₫',
    },
    {
      name: 'productPhilosophy',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Our Product Philosophy:',
        },
        {
          name: 'subtitle',
          type: 'text',
          defaultValue: '"Less and More."',
        },
        {
          name: 'body',
          type: 'textarea',
          defaultValue: 'We re-imagine one garment at a time, combining intentional proportions with superior craftsmanship. We advocate for sustainability by producing less, building better & simplifying the way we get dressed.',
        },
      ],
    },
  ],
}
