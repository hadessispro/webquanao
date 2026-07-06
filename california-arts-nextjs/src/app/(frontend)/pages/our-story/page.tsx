import Image from 'next/image'

const storySections = [
  {
    body: [
      'điển bắt đầu từ mong muốn đưa quần áo đẹp quay lại đúng nhịp sống hằng ngày. chúng tôi không chạy theo quá nhiều bộ sưu tập hay nhịp phát hành dồn dập, mà muốn mỗi món đồ đứng được lâu, mặc được nhiều và gợi đúng cảm giác sống cùng nó.',
      'điều chúng tôi theo đuổi là sự rõ ràng trong phom, vật liệu và cảm xúc sử dụng. một chiếc áo, một chiếc quần hay một lớp ngoài đều cần đủ đẹp để giữ lại, nhưng cũng đủ bình tĩnh để không lỗi thời sau một mùa.',
    ],
    label: '01 câu chuyện điển',
    media: {
      alt: 'điển campaign on the coast',
      src: '/media/nha-trang-6h.webp',
    },
    title: 'mỗi sản phẩm được làm ra để sống cùng đời thường, không chỉ để trưng bày trong một mùa.',
  },
  {
    body: [
      'chúng tôi làm theo hướng ít hơn nhưng chặt hơn: chọn lọc vật liệu, giữ bộ khung màu gọn, cắt giảm những chi tiết trang trí dư thừa và ưu tiên các tỉ lệ mặc được lâu. cách tiếp cận đó giúp mỗi sản phẩm dễ phối, dễ lặp lại trong tủ đồ và không bị trôi quá nhanh khỏi đời sống thực tế.',
      'thay vì mở rộng vô hạn, điển giữ nhịp phát triển vừa phải để đội ngũ có thể nhìn kỹ từng bản fit, từng ảnh chụp và từng phản hồi của khách hàng trước khi đưa ra đợt tiếp theo.',
    ],
    label: '02 cách chúng tôi làm',
    title: 'thiết kế của điển hướng tới sự mạch lạc: ít chi tiết hơn, cân đối hơn và bền hơn trong cách mặc.',
  },
  {
    body: [
      'điển không cố tạo khoảng cách với người mặc. chúng tôi muốn thương hiệu có thể nói chuyện trực tiếp, nhận góp ý nhanh, sửa những gì còn cấn và giữ mối liên hệ đủ gần để mỗi lần cập nhật đều có lý do rõ ràng.',
      'nếu bạn cần hỗ trợ, muốn góp ý hoặc chỉ đơn giản là muốn hỏi thêm về một món đồ, cứ để lại thông tin hoặc nhắn trực tiếp qua instagram. chúng tôi sẽ trả lời như một cuộc hội thoại thực sự.',
    ],
    label: '03 ghi chú từ người sáng lập',
    title: 'một thương hiệu tốt không chỉ làm ra sản phẩm đúng, mà còn phải phản hồi đúng lúc và đủ gần với người mặc.',
  },
]

export default function OurStoryPage() {
  return (
    <section className="story-page bg-primary-background text-primary-text">
      <div className="story-page__sections">
        {storySections.map((section, index) => (
          <section
            className={
              section.media
                ? 'story-page__section story-page__section--has-media'
                : 'story-page__section'
            }
            key={section.label}
          >


            <div className="story-page__content story-page__content--right">
              <div className="story-page__copy">
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            {section.media && (
              <div className="story-page__media">
                <Image
                  alt={section.media.alt}
                  className="story-page__media-image"
                  height={1080}
                  priority={index === 0}
                  src={section.media.src}
                  width={5120}
                />
              </div>
            )}
          </section>
        ))}
      </div>
    </section>
  )
}
