'use client'

import { useState, useEffect } from 'react'

export default function DateDisplay() {
  const [dateStr, setDateStr] = useState('')

  useEffect(() => {
    const d = new Date()
    const date = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })
    setDateStr(`${date}. ${time}`)
  }, [])

  return <p>{dateStr}</p>
}
