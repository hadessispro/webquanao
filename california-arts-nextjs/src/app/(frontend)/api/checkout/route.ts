import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-client'
import {
  calculateDiscountAmount,
  getDiscountRejection,
  type DiscountCodeLike,
} from '@/lib/discounts'

export const dynamic = 'force-dynamic'

type DiscountRecord = DiscountCodeLike & {
  id: string | number
  usedCount?: number | null
}

type CustomerRecord = {
  id: string | number
  orderCount?: number | null
  totalSpent?: number | null
}

type CheckoutItemInput = {
  price?: number
  productTitle?: string
  quantity?: number
  sku?: string
  variantTitle?: string
}

type CheckoutRequestBody = {
  acceptsMarketing?: boolean
  customerEmail?: string
  customerName?: string
  customerPhone?: string
  discountCode?: string | number
  firstName?: string
  items?: CheckoutItemInput[]
  lastName?: string
  notes?: string
  orderNumber?: string
  paymentMethod?: string
  shippingAddress?: {
    apartment?: string
    city?: string
    country?: string
    district?: string
    street?: string
    zipCode?: string
  }
  shippingCost?: number
  subtotal?: number
}

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function asNumber(value: unknown) {
  const nextValue = Number(value || 0)
  return Number.isFinite(nextValue) ? nextValue : 0
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutRequestBody
    const payload = await getPayloadClient()

    const customerEmail = asText(body.customerEmail).toLowerCase()
    const firstName = asText(body.firstName)
    const lastName = asText(body.lastName)
    const customerName =
      asText(body.customerName) || [firstName, lastName].filter(Boolean).join(' ').trim()
    const customerPhone = asText(body.customerPhone)
    const subtotal = asNumber(body.subtotal)
    const shippingCost = asNumber(body.shippingCost)
    const shippingAddress = {
      street: asText(body.shippingAddress?.street),
      apartment: asText(body.shippingAddress?.apartment),
      city: asText(body.shippingAddress?.city),
      district: asText(body.shippingAddress?.district),
      zipCode: asText(body.shippingAddress?.zipCode),
      country: asText(body.shippingAddress?.country) || 'Vietnam',
    }

    if (!customerName || !customerEmail) {
      return NextResponse.json({ message: 'Customer name and email are required.' }, { status: 400 })
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ message: 'Cart is empty.' }, { status: 400 })
    }

    const items = body.items.map((item) => ({
      productTitle: asText(item.productTitle),
      variantTitle: asText(item.variantTitle),
      sku: asText(item.sku),
      quantity: Math.max(1, Math.floor(asNumber(item.quantity))),
      price: asNumber(item.price),
    }))

    let discountCode: string | number | undefined
    let discountAmount = 0

    if (body.discountCode) {
      const discount = (await payload.findByID({
        collection: 'discount-codes',
        id: body.discountCode,
        overrideAccess: true,
      })) as DiscountRecord
      const rejection = getDiscountRejection(discount, subtotal, customerEmail)

      if (!rejection) {
        discountCode = discount.id
        discountAmount = calculateDiscountAmount(discount, subtotal)
      }
    }

    const total = Math.max(0, subtotal + shippingCost - discountAmount)
    const existingCustomers = await payload.find({
      collection: 'customers',
      where: {
        email: {
          equals: customerEmail,
        },
      },
      limit: 1,
      overrideAccess: true,
    })
    const existingCustomer = existingCustomers.docs?.[0] as CustomerRecord | undefined
    const customerData = {
      acceptsMarketing: Boolean(body.acceptsMarketing),
      defaultAddress: shippingAddress,
      email: customerEmail,
      firstName,
      fullName: customerName,
      lastName,
      lastOrderAt: new Date().toISOString(),
      notes: asText(body.notes),
      phone: customerPhone,
      orderCount: Number(existingCustomer?.orderCount || 0) + 1,
      totalSpent: Number(existingCustomer?.totalSpent || 0) + total,
    }

    const customer = existingCustomer
      ? await payload.update({
          collection: 'customers',
          id: existingCustomer.id,
          data: customerData,
          overrideAccess: true,
        })
      : await payload.create({
          collection: 'customers',
          data: customerData,
          overrideAccess: true,
        })

    const order = await payload.create({
      collection: 'orders',
      data: {
        orderNumber: asText(body.orderNumber) || undefined,
        customer: customer.id,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        items,
        subtotal,
        shippingCost,
        discountCode,
        discountAmount,
        total,
        status: 'pending',
        paymentMethod: asText(body.paymentMethod) || 'cod',
        paymentStatus: 'pending',
        notes: asText(body.notes),
      },
      overrideAccess: true,
    })

    if (discountCode) {
      const discount = (await payload.findByID({
        collection: 'discount-codes',
        id: discountCode,
        overrideAccess: true,
      })) as DiscountRecord

      await payload.update({
        collection: 'discount-codes',
        id: discountCode,
        data: {
          usedCount: Number(discount.usedCount || 0) + 1,
        },
        overrideAccess: true,
      })
    }

    return NextResponse.json({ customer, order })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Checkout could not be completed.' }, { status: 500 })
  }
}
