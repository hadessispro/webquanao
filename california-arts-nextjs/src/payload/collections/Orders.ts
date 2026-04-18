import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Order',
    plural: 'Orders',
  },
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerName', 'total', 'status', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: { readOnly: true },
    },
    // Customer Info
    {
      name: 'customerName',
      type: 'text',
      required: true,
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'customerPhone',
      type: 'text',
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'street', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'district', type: 'text' },
        { name: 'zipCode', type: 'text' },
        { name: 'country', type: 'text', defaultValue: 'Vietnam' },
      ],
    },
    // Order Items
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'productTitle', type: 'text', required: true },
        { name: 'variantTitle', type: 'text' },
        { name: 'sku', type: 'text' },
        { name: 'quantity', type: 'number', required: true, min: 1 },
        { name: 'price', type: 'number', required: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    // Totals
    {
      name: 'subtotal',
      type: 'number',
      required: true,
    },
    {
      name: 'shippingCost',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'total',
      type: 'number',
      required: true,
    },
    // Status
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'paymentMethod',
      type: 'select',
      options: [
        { label: 'COD', value: 'cod' },
        { label: 'Bank Transfer', value: 'bank_transfer' },
        { label: 'VNPay', value: 'vnpay' },
      ],
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
