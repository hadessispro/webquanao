'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

const LOADER_MIN_TIME = 520
const ROUTE_FLASH_TIME = 360

export default function BrandLoader() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(true)
  const hasMounted = useRef(false)

  useEffect(() => {
    let timer: number | undefined
    let loadTimer: number | undefined
    const startedAt = performance.now()

    const hide = () => {
      const remaining = Math.max(0, LOADER_MIN_TIME - (performance.now() - startedAt))
      timer = window.setTimeout(() => setVisible(false), remaining)
    }

    if (document.readyState === 'complete') {
      hide()
    } else {
      window.addEventListener('load', hide, { once: true })
      loadTimer = window.setTimeout(hide, 1600)
    }

    return () => {
      window.removeEventListener('load', hide)
      if (timer) window.clearTimeout(timer)
      if (loadTimer) window.clearTimeout(loadTimer)
    }
  }, [])

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }

    setVisible(true)
    const timer = window.setTimeout(() => setVisible(false), ROUTE_FLASH_TIME)

    return () => window.clearTimeout(timer)
  }, [pathname])

  return (
    <div aria-hidden="true" className={`brand-loader${visible ? ' brand-loader--visible' : ''}`}>
      <img alt="" className="brand-loader__mark" src="/media/dien-mark-loader.png" />
    </div>
  )
}
