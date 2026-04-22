export function formatVndAmount(value?: number | string | null): string {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('vi-VN').format(Number.isNaN(value) ? 0 : value)
  }

  const digits = String(value ?? '')
    .replace(/[^\d-]/g, '')
    .trim()
  const amount = Number.parseInt(digits || '0', 10)

  return new Intl.NumberFormat('vi-VN').format(Number.isNaN(amount) ? 0 : amount)
}
