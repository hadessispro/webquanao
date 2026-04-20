import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: {
    singular: 'Customer',
    plural: 'Customers',
  },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'phone', 'orderCount', 'totalSpent', 'lastOrderAt'],
    group: 'Commerce',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        if (typeof data.email === 'string') {
          data.email = data.email.trim().toLowerCase()
        }

        if (!data.fullName) {
          data.fullName = [data.firstName, data.lastName].filter(Boolean).join(' ').trim()
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      admin: {
        description: 'Used to match returning checkout customers.',
      },
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'defaultAddress',
      type: 'group',
      fields: [
        { name: 'street', type: 'text' },
        { name: 'apartment', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'district', type: 'text' },
        { name: 'zipCode', type: 'text' },
        { name: 'country', type: 'text', defaultValue: 'Vietnam' },
      ],
    },
    {
      name: 'acceptsMarketing',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'orderCount',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'totalSpent',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'lastOrderAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
