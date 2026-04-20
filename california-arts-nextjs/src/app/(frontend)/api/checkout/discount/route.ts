import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-client'
import {
  calculateDiscountAmount,
  getDiscountRejection,
  normalizeDiscountCode,
  type DiscountCodeLike,
} from '@/lib/discounts'

export const dynamic = 'force-dynamic'

type DiscountRecord = DiscountCodeLike & {
  code?: string | null
  discountType?: string | null
  id: string | number
  label?: string | null
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const code = normalizeDiscountCode(String(body?.code || ''))
    const subtotal = Number(body?.subtotal || 0)
    const customerEmail = String(body?.customerEmail || '')

    if (!code) {
      return NextResponse.json({ message: 'Enter a discount code.' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'discount-codes',
      where: {
        code: {
          equals: code,
        },
      },
      limit: 1,
      overrideAccess: true,
    })
    const discount = result.docs?.[0] as DiscountRecord | undefined

    if (!discount) {
      return NextResponse.json({ message: 'Discount code was not found.' }, { status: 404 })
    }

    const rejection = getDiscountRejection(discount, subtotal, customerEmail)

    if (rejection) {
      return NextResponse.json({ message: rejection }, { status: 400 })
    }

    return NextResponse.json({
      code: discount.code,
      discountAmount: calculateDiscountAmount(discount, subtotal),
      discountType: discount.discountType,
      id: discount.id,
      label: discount.label,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Discount code could not be applied.' }, { status: 500 })
  }
}
