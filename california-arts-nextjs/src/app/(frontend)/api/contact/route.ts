import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-client'

export const dynamic = 'force-dynamic'

type ContactRequestBody = {
  acceptsMarketing?: boolean
  city?: string
  email?: string
  fullName?: string
  instagramHandle?: string
  notes?: string
  phone?: string
  purpose?: string
}

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function mergeNotes(...sections: string[]) {
  return sections
    .map((section) => section.trim())
    .filter(Boolean)
    .join('\n\n')
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactRequestBody
    const payload = await getPayloadClient()

    const email = asText(body.email).toLowerCase()
    const fullName = asText(body.fullName)
    const phone = asText(body.phone)
    const city = asText(body.city)
    const instagramHandle = asText(body.instagramHandle)
    const purpose = asText(body.purpose)
    const notes = asText(body.notes)

    if (!fullName || !email) {
      return NextResponse.json({ message: 'Vui lòng nhập họ tên và email.' }, { status: 400 })
    }

    const result = await payload.find({
      collection: 'customers',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
      overrideAccess: true,
    })

    const noteBlock = mergeNotes(
      purpose ? `Nhu cầu: ${purpose}` : '',
      instagramHandle ? `Instagram: ${instagramHandle}` : '',
      city ? `Thành phố: ${city}` : '',
      notes ? `Ghi chú:\n${notes}` : '',
    )

    const customerData = {
      acceptsMarketing: Boolean(body.acceptsMarketing),
      email,
      fullName,
      notes: noteBlock,
      phone,
    }

    if (result.docs?.[0]) {
      const current = result.docs[0] as { id: string | number; notes?: string | null }
      const merged = mergeNotes(String(current.notes || ''), noteBlock)

      const customer = await payload.update({
        collection: 'customers',
        id: current.id,
        data: {
          ...customerData,
          notes: merged,
        },
        overrideAccess: true,
      })

      return NextResponse.json({ customer, status: 'updated' })
    }

    const customer = await payload.create({
      collection: 'customers',
      data: customerData,
      overrideAccess: true,
    })

    return NextResponse.json({ customer, status: 'created' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Không thể gửi thông tin liên hệ.' }, { status: 500 })
  }
}
