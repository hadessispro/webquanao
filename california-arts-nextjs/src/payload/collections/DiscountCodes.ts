import type { CollectionConfig } from 'payload'

export const DiscountCodes: CollectionConfig = {
  slug: 'discount-codes',
  labels: {
    singular: 'Discount Code',
    plural: 'Discount Codes',
  },
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'discountType', 'value', 'active', 'startsAt', 'expiresAt'],
    group: 'Commerce',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.code && typeof data.code === 'string') {
          data.code = data.code.trim().toUpperCase()
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Customer-facing code, for example WELCOME10.',
      },
    },
    {
      name: 'label',
      type: 'text',
      admin: {
        description: 'Internal name shown in Payload.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'discountType',
      type: 'select',
      required: true,
      defaultValue: 'percentage',
      options: [
        { label: 'Percentage', value: 'percentage' },
        { label: 'Fixed amount', value: 'fixed_amount' },
        { label: 'Free shipping', value: 'free_shipping' },
      ],
    },
    {
      name: 'value',
      type: 'number',
      min: 0,
      admin: {
        condition: (_, siblingData) => siblingData?.discountType !== 'free_shipping',
        description: 'Percentage value or fixed amount, depending on discount type.',
      },
    },
    {
      name: 'currency',
      type: 'select',
      defaultValue: 'VND',
      options: [
        { label: 'VND', value: 'VND' },
        { label: 'USD', value: 'USD' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.discountType === 'fixed_amount',
      },
    },
    {
      name: 'minimumSubtotal',
      type: 'number',
      min: 0,
      admin: {
        description: 'Optional minimum cart subtotal required to use this code.',
      },
    },
    {
      name: 'maximumDiscountAmount',
      type: 'number',
      min: 0,
      admin: {
        condition: (_, siblingData) => siblingData?.discountType === 'percentage',
        description: 'Optional cap for percentage discounts.',
      },
    },
    {
      name: 'appliesTo',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'All products', value: 'all' },
        { label: 'Selected products', value: 'products' },
        { label: 'Selected collections', value: 'collections' },
      ],
    },
    {
      name: 'eligibleProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.appliesTo === 'products',
      },
    },
    {
      name: 'eligibleCollections',
      type: 'relationship',
      relationTo: 'product-collections',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.appliesTo === 'collections',
      },
    },
    {
      name: 'startsAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'usageLimit',
      type: 'number',
      min: 0,
      admin: {
        position: 'sidebar',
        description: 'Total number of times this code can be used. Leave empty for no limit.',
      },
    },
    {
      name: 'perCustomerLimit',
      type: 'number',
      min: 0,
      defaultValue: 1,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'usedCount',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'customerEligibility',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'All customers', value: 'all' },
        { label: 'Specific emails', value: 'specific_emails' },
      ],
    },
    {
      name: 'customerEmails',
      type: 'array',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
        },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.customerEligibility === 'specific_emails',
      },
    },
    {
      name: 'combinable',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Allow this code to combine with another promotion later.',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
