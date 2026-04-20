'use client'

import { useEffect } from 'react'

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max))
}

function canElementScroll(element: Element) {
  const style = window.getComputedStyle(element)
  const overflowY = style.overflowY

  return (
    (overflowY === 'auto' || overflowY === 'scroll') &&
    element.scrollHeight > element.clientHeight
  )
}

function isInteractiveScrollTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false

  if (target.closest('input, textarea, select, [contenteditable="true"], .art-menu, .drawer-panel')) {
    return true
  }

  let element: Element | null = target
  while (element && element !== document.body && element !== document.documentElement) {
    if (canElementScroll(element)) return true
    element = element.parentElement
  }

  return false
}

export default function SmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches

    if (prefersReducedMotion || coarsePointer) return undefined

    let current = window.scrollY
    let target = window.scrollY
    let frame = 0
    let isAnimating = false

    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight

    const stop = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      isAnimating = false
    }

    const animate = () => {
      current += (target - current) * 0.58

      if (Math.abs(target - current) < 1.1) {
        current = target
        window.scrollTo(0, current)
        stop()
        return
      }

      window.scrollTo(0, current)
      frame = requestAnimationFrame(animate)
    }

    const start = () => {
      if (isAnimating) return
      isAnimating = true
      frame = requestAnimationFrame(animate)
    }

    const handleWheel = (event: WheelEvent) => {
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.defaultPrevented ||
        event.deltaMode !== 0 ||
        document.documentElement.classList.contains('art-menu-lock') ||
        isInteractiveScrollTarget(event.target)
      ) {
        return
      }

      event.preventDefault()
      if (!isAnimating) {
        current = window.scrollY
        target = current
      }

      target = clamp(target + event.deltaY * 1.58, 0, maxScroll())
      start()
    }

    const handleNativeScroll = () => {
      if (isAnimating) return
      current = window.scrollY
      target = current
    }

    const handleResize = () => {
      target = clamp(target, 0, maxScroll())
      current = clamp(current, 0, maxScroll())
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('scroll', handleNativeScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      stop()
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('scroll', handleNativeScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return null
}
