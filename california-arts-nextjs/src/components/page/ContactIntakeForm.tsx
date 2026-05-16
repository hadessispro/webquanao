'use client'

import React, { FormEvent, useState } from 'react'

type ContactFormState = {
  acceptsMarketing: boolean
  city: string
  email: string
  fullName: string
  instagramHandle: string
  notes: string
  phone: string
  purpose: string
}

const defaultState: ContactFormState = {
  acceptsMarketing: false,
  city: '',
  email: '',
  fullName: '',
  instagramHandle: '',
  notes: '',
  phone: '',
  purpose: 'đặt lịch tư vấn',
}

export default function ContactIntakeForm() {
  const [form, setForm] = useState<ContactFormState>(defaultState)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const update = (field: keyof ContactFormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.message || 'Không thể gửi thông tin.')
      }

      setStatus('success')
      setMessage('Thông tin của bạn đã được ghi nhận. Đội ngũ điển sẽ phản hồi sớm nhất có thể.')
      setForm(defaultState)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Không thể gửi thông tin.')
    }
  }

  return (
    <form className="contact-intake-form" onSubmit={handleSubmit}>
      <div className="contact-intake-form__head">
        <p>để lại thông tin</p>
        <h2>chúng tôi sẽ liên hệ lại để chốt nhu cầu của bạn.</h2>
      </div>

      <div className="contact-intake-form__grid">
        <label className="contact-intake-form__field contact-intake-form__field--full">
          <span>họ và tên</span>
          <input
            name="fullName"
            onChange={(event) => update('fullName', event.target.value)}
            placeholder="ví dụ: nguyễn minh anh"
            required
            type="text"
            value={form.fullName}
          />
        </label>

        <label className="contact-intake-form__field">
          <span>email</span>
          <input
            autoComplete="email"
            name="email"
            onChange={(event) => update('email', event.target.value)}
            placeholder="ban@domain.com"
            required
            type="email"
            value={form.email}
          />
        </label>

        <label className="contact-intake-form__field">
          <span>số điện thoại</span>
          <input
            autoComplete="tel"
            name="phone"
            onChange={(event) => update('phone', event.target.value)}
            placeholder="09xx xxx xxx"
            type="tel"
            value={form.phone}
          />
        </label>

        <label className="contact-intake-form__field">
          <span>thành phố</span>
          <input
            name="city"
            onChange={(event) => update('city', event.target.value)}
            placeholder="hồ chí minh"
            type="text"
            value={form.city}
          />
        </label>

        <label className="contact-intake-form__field">
          <span>instagram</span>
          <input
            name="instagramHandle"
            onChange={(event) => update('instagramHandle', event.target.value)}
            placeholder="@ten_cua_ban"
            type="text"
            value={form.instagramHandle}
          />
        </label>

        <label className="contact-intake-form__field contact-intake-form__field--full">
          <span>bạn cần gì từ điển?</span>
          <select
            name="purpose"
            onChange={(event) => update('purpose', event.target.value)}
            value={form.purpose}
          >
            <option value="đặt lịch tư vấn">đặt lịch tư vấn</option>
            <option value="theo dõi đơn hàng">theo dõi đơn hàng</option>
            <option value="đổi trả hoặc hỗ trợ">đổi trả hoặc hỗ trợ</option>
            <option value="góp ý hoặc hợp tác">góp ý hoặc hợp tác</option>
          </select>
        </label>

        <label className="contact-intake-form__field contact-intake-form__field--full">
          <span>mô tả ngắn</span>
          <textarea
            name="notes"
            onChange={(event) => update('notes', event.target.value)}
            placeholder="để lại vấn đề, mã đơn hàng, sản phẩm bạn đang quan tâm hoặc khung giờ tiện liên hệ."
            rows={5}
            value={form.notes}
          />
        </label>
      </div>

      <div className="contact-intake-form__actions">
        <label className="contact-intake-form__checkbox">
          <input
            checked={form.acceptsMarketing}
            onChange={(event) => update('acceptsMarketing', event.target.checked)}
            type="checkbox"
          />
          <span>nhận tin mới và đợt mở bán tiếp theo qua email</span>
        </label>

        <button className="contact-intake-form__submit" disabled={status === 'loading'} type="submit">
          {status === 'loading' ? 'đang gửi' : 'gửi thông tin'}
        </button>
      </div>

      {message && (
        <p
          className={
            status === 'error'
              ? 'contact-intake-form__message contact-intake-form__message--error'
              : 'contact-intake-form__message'
          }
        >
          {message}
        </p>
      )}
    </form>
  )
}
