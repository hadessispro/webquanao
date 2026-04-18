/**
 * Format a number as Vietnamese Dong currency
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + '₫'
}

/**
 * Generate a URL-friendly slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

/**
 * Truncate text to a specified length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}
