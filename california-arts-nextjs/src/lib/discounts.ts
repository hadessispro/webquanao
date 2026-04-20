type CustomerEmailEntry = {
  email?: string | null
}

export type DiscountCodeLike = {
  active?: boolean | null
  code?: string | null
  customerEligibility?: string | null
  customerEmails?: CustomerEmailEntry[] | null
  discountType?: string | null
  expiresAt?: string | null
  maximumDiscountAmount?: number | null
  minimumSubtotal?: number | null
  startsAt?: string | null
  usageLimit?: number | null
  usedCount?: number | null
  value?: number | null
}

export function normalizeDiscountCode(code: string) {
  return code.trim().toUpperCase()
}

export function getDiscountRejection(
  discount: DiscountCodeLike,
  subtotal: number,
  customerEmail?: string,
) {
  if (!discount.active) {
    return 'This code is not active.'
  }

  const now = Date.now()
  if (discount.startsAt && new Date(discount.startsAt).getTime() > now) {
    return 'This code is not active yet.'
  }

  if (discount.expiresAt && new Date(discount.expiresAt).getTime() < now) {
    return 'This code has expired.'
  }

  if (discount.minimumSubtotal && subtotal < discount.minimumSubtotal) {
    return 'Your cart does not meet the minimum subtotal for this code.'
  }

  if (
    typeof discount.usageLimit === 'number' &&
    discount.usageLimit > 0 &&
    typeof discount.usedCount === 'number' &&
    discount.usedCount >= discount.usageLimit
  ) {
    return 'This code has reached its usage limit.'
  }

  if (discount.customerEligibility === 'specific_emails') {
    const normalizedEmail = customerEmail?.trim().toLowerCase()
    const eligible = discount.customerEmails?.some(
      (entry) => entry.email?.trim().toLowerCase() === normalizedEmail,
    )

    if (!eligible) {
      return 'This code is not available for this email.'
    }
  }

  return ''
}

export function calculateDiscountAmount(discount: DiscountCodeLike, subtotal: number) {
  const value = Number(discount.value || 0)

  if (discount.discountType === 'percentage') {
    const rawAmount = Math.floor((subtotal * value) / 100)
    const cappedAmount = discount.maximumDiscountAmount
      ? Math.min(rawAmount, discount.maximumDiscountAmount)
      : rawAmount

    return Math.max(0, Math.min(cappedAmount, subtotal))
  }

  if (discount.discountType === 'fixed_amount') {
    return Math.max(0, Math.min(value, subtotal))
  }

  return 0
}
