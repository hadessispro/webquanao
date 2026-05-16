import Link from 'next/link'
import ContactIntakeForm from '@/components/page/ContactIntakeForm'
import { BRAND_CONTACT_EMAIL, BRAND_INSTAGRAM_PROFILE_URL } from '@/lib/brand'

const contactHighlights = [
  {
    label: 'email',
    value: BRAND_CONTACT_EMAIL,
    href: `mailto:${BRAND_CONTACT_EMAIL}`,
  },
  {
    label: 'instagram',
    value: '@dien.youalreadyknow',
    href: BRAND_INSTAGRAM_PROFILE_URL,
  },
  {
    label: 'hỗ trợ',
    value: 'thứ 2 - thứ 7 / 10:00 - 19:00',
  },
]

export default function AboutPage() {
  return (
    <section className="contact-page bg-primary-background text-primary-text">
      <div className="contact-page__hero">
        <div className="contact-page__hero-copy">
          <p>liên hệ</p>
          <h1>để lại thông tin để điển liên hệ lại, chốt nhu cầu hoặc hỗ trợ đơn hàng.</h1>
          <span>
            Chúng tôi ưu tiên phản hồi ngắn gọn, rõ ràng và giữ lại đúng các thông tin cần thiết để
            hỗ trợ bạn.
          </span>
        </div>
      </div>

      <div className="contact-page__layout">
        <aside className="contact-page__aside">
          <div className="contact-page__aside-block">
            <h2>giữ kết nối</h2>
            <p>
              Nếu bạn cần hỗ trợ về đơn hàng, đổi trả, lịch drop mới hay muốn để lại góp ý, hãy để
              lại thông tin ở form bên cạnh. Đội ngũ sẽ liên hệ lại qua email, điện thoại hoặc
              Instagram.
            </p>
          </div>

          <div className="contact-page__aside-list">
            {contactHighlights.map((item) => (
              <div className="contact-page__aside-item" key={item.label}>
                <span>{item.label}</span>
                {item.href ? (
                  <a href={item.href} rel="noreferrer" target="_blank">
                    {item.value}
                  </a>
                ) : (
                  <strong>{item.value}</strong>
                )}
              </div>
            ))}
          </div>

          <div className="contact-page__aside-note">
            <p>
              Với chính sách đổi trả và vận chuyển, xem thêm tại{' '}
              <Link href="/pages/returns-exchanges">trang câu hỏi thường gặp</Link>.
            </p>
          </div>
        </aside>

        <ContactIntakeForm />
      </div>
    </section>
  )
}
