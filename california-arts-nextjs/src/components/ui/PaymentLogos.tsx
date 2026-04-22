const PAYMENT_LOGOS = [
  { label: 'VNPay', modifier: 'vnpay' },
  { label: 'Visa', modifier: 'visa' },
  { label: 'Mastercard', modifier: 'mastercard' },
  { label: 'JCB', modifier: 'jcb' },
  { label: 'Amex', modifier: 'amex' },
  { label: 'Napas', modifier: 'napas' },
  { label: 'ATM', modifier: 'atm' },
  { label: 'Bank', modifier: 'bank' },
  { label: 'COD', modifier: 'cod' },
]

type PaymentLogoStripProps = {
  compact?: boolean
  className?: string
}

export default function PaymentLogoStrip({ compact = false, className = '' }: PaymentLogoStripProps) {
  return (
    <div
      aria-label="logo thanh toán"
      className={`payment-logo-strip${compact ? ' payment-logo-strip--compact' : ''}${
        className ? ` ${className}` : ''
      }`}
    >
      {PAYMENT_LOGOS.map((logo) => (
        <span
          aria-label={logo.label}
          className={`payment-mark payment-mark--${logo.modifier}`}
          key={logo.modifier}
          title={logo.label}
        >
          <span>{logo.label}</span>
        </span>
      ))}
    </div>
  )
}
