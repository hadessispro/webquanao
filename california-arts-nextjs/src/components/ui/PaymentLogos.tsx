import Image from 'next/image'

const PAYMENT_LOGOS = ['visa', 'amex', 'mastercard', 'jcb', 'vnpay'] as const

type PaymentLogo = (typeof PAYMENT_LOGOS)[number]

type PaymentLogoStripProps = {
  className?: string
  compact?: boolean
  logos?: PaymentLogo[]
}

const PAYMENT_LOGO_META: Record<
  PaymentLogo,
  {
    alt: string
    height: number
    src: string
    width: number
  }
> = {
  visa: {
    alt: 'Visa',
    height: 24,
    src: '/media/payment/visa.svg',
    width: 74,
  },
  amex: {
    alt: 'American Express',
    height: 30,
    src: '/media/payment/american-express.svg',
    width: 30,
  },
  mastercard: {
    alt: 'Mastercard',
    height: 30,
    src: '/media/payment/mastercard.svg',
    width: 30,
  },
  jcb: {
    alt: 'JCB',
    height: 30,
    src: '/media/payment/jcb.svg',
    width: 30,
  },
  vnpay: {
    alt: 'VNPay',
    height: 24,
    src: '/media/payment/vnpay.svg',
    width: 79,
  },
}

export default function PaymentLogoStrip({
  compact = false,
  className = '',
  logos = [...PAYMENT_LOGOS],
}: PaymentLogoStripProps) {
  return (
    <div
      aria-label="logo thanh toán"
      className={`payment-logo-strip${compact ? ' payment-logo-strip--compact' : ''}${
        className ? ` ${className}` : ''
      }`}
    >
      {logos.map((logo) => {
        const logoMeta = PAYMENT_LOGO_META[logo]

        return (
          <span className={`payment-logo-item payment-logo-item--${logo}`} key={logo}>
            <Image
              alt={logoMeta.alt}
              className="payment-logo-image"
              height={logoMeta.height}
              src={logoMeta.src}
              unoptimized
              width={logoMeta.width}
            />
          </span>
        )
      })}
    </div>
  )
}
