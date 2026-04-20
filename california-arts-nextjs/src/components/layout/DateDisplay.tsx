'use client'

function formatDate() {
  const d = new Date()
  const date = d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const time = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })

  return `${date}. ${time}`
}

export default function DateDisplay() {
  return <p suppressHydrationWarning>{formatDate()}</p>
}
