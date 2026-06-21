import { BRAND_CONTACT_EMAIL, BRAND_INSTAGRAM_HANDLE, BRAND_INSTAGRAM_PROFILE_URL } from '@/lib/brand'

export default function AboutPage() {
  return (
    <article className="cms-page cms-page--contact-static contact-page contact-page--static bg-primary-background text-primary-text">
      <section className="cms-page__section cms-page__section--intro contact-page__static">
        <div className="cms-page__inner cms-page__narrow contact-page__static-inner">
          <h1>liên hệ cùng điển</h1>
          <p>
            nếu cần hỗ trợ về đơn hàng, đổi trả, lịch drop mới hoặc những thông tin cần xác nhận
            trước khi mua, bạn có thể liên hệ trực tiếp với điển qua email hoặc instagram.
          </p>
          <p>
            email:{' '}
            <a href={`mailto:${BRAND_CONTACT_EMAIL}`}>{BRAND_CONTACT_EMAIL}</a>
          </p>
          <p>
            instagram:{' '}
            <a href={BRAND_INSTAGRAM_PROFILE_URL} rel="noreferrer" target="_blank">
              @{BRAND_INSTAGRAM_HANDLE}
            </a>
          </p>
          <p>
            phần biểu mẫu nhận thông tin khách hàng đang được ẩn tạm thời. nội dung chi tiết của
            trang liên hệ sẽ được cập nhật lại sau.
          </p>
        </div>
      </section>
    </article>
  )
}
