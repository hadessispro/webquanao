import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-client'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const source = typeof body?.source === 'string' ? body.source.trim() : 'newsletter popup'

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'invalid email' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    const existing = await payload.find({
      collection: 'customers',
      limit: 1,
      where: {
        email: {
          equals: email,
        },
      },
    })

    const note = `marketing signup: ${source}`

    if (existing.docs[0]) {
      const customer = existing.docs[0] as { id: number | string; notes?: string }
      await payload.update({
        collection: 'customers',
        id: customer.id,
        data: {
          acceptsMarketing: true,
          notes: customer.notes?.includes(note) ? customer.notes : [customer.notes, note].filter(Boolean).join('\n'),
        },
      })

      return NextResponse.json({ ok: true })
    }

    await payload.create({
      collection: 'customers',
      data: {
        fullName: email,
        email,
        acceptsMarketing: true,
        notes: note,
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'could not subscribe' }, { status: 500 })
  }
}
