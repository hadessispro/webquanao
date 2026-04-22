import React from 'react'
import { formatVndAmount } from '@/lib/price'

function classNames(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(' ')
}

function renderToken(token: string, key: string) {
  if (/^VND\s*[₫đĐ]$/i.test(token.trim())) {
    return (
      <span className="brand-currency-code" key={key}>
        <span>VND</span>
        <span aria-hidden="true" className="brand-currency-mark" />
      </span>
    )
  }

  const amount = token.match(/\d[\d.,]*/)?.[0]
  if (amount) {
    return <BrandPrice amount={amount} key={key} />
  }

  return token
}

export function BrandPrice({
  amount,
  className,
  prefix,
}: {
  amount?: number | string | null
  className?: string
  prefix?: string
}) {
  return (
    <span className={classNames('brand-price', className)}>
      <span>{`${prefix || ''}${formatVndAmount(amount)}`}</span>
      <span aria-hidden="true" className="brand-currency-mark" />
    </span>
  )
}

export function BrandCurrencyText({
  as,
  className,
  text,
}: {
  as?: React.ElementType
  className?: string
  text?: string
}) {
  const Component = as || 'span'

  if (!text) return null

  const parts: React.ReactNode[] = []
  const pattern = /(₫\s*[\d.,]+|[\d.,]+\s*[₫đĐ]|VND\s*[₫đĐ])/gi
  let cursor = 0
  let match: RegExpExecArray | null = pattern.exec(text)

  while (match) {
    if (match.index > cursor) {
      parts.push(text.slice(cursor, match.index))
    }

    parts.push(renderToken(match[0], `token-${match.index}`))
    cursor = match.index + match[0].length
    match = pattern.exec(text)
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor))
  }

  return <Component className={className}>{parts}</Component>
}
