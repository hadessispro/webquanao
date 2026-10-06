function escapeHtml(str: string): string {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function formatInlineMarkdown(text: string): string {
  if (!text) return ''

  // Replace markdown links: [label](url)
  let formatted = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, url) => {
    const isExternal = url.startsWith('http://') || url.startsWith('https://')
    const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''
    return `<a href="${url}"${target} class="cms-link">${label}</a>`
  })

  // Replace bold: **text**
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

  // Replace italic: *text* (when not inside bold)
  formatted = formatted.replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, '$1<em>$2</em>$3')

  // Replace inline code: `text`
  formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Replace strikethrough: ~~text~~
  formatted = formatted.replace(/~~([^~]+)~~/g, '<s>$1</s>')

  // Replace underline: __text__
  formatted = formatted.replace(/__([^_]+)__/g, '<u>$1</u>')

  return formatted
}

export function richTextToHtml(value: unknown): string {
  if (!value) return ''

  // If string, handle JSON string or raw text / markdown / HTML
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return ''

    if (trimmed.startsWith('{') && trimmed.includes('"root"')) {
      try {
        const parsed = JSON.parse(trimmed)
        return richTextToHtml(parsed)
      } catch {
        // Fallthrough to plain text / markdown
      }
    }

    if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
      return trimmed
    }

    const paragraphs = trimmed.split(/\r?\n\r?\n/)
    if (paragraphs.length > 1) {
      return paragraphs
        .map((p) => `<p>${formatInlineMarkdown(p.replace(/\r?\n/g, '<br />'))}</p>`)
        .join('')
    }
    return formatInlineMarkdown(trimmed.replace(/\r?\n/g, '<br />'))
  }

  if (typeof value !== 'object') return ''

  const node = value as Record<string, any>

  if (node.root?.children && Array.isArray(node.root.children)) {
    return node.root.children.map(richTextToHtml).join('')
  }

  if (node.type === 'text' || typeof node.text === 'string') {
    let text = escapeHtml(node.text || '')
    if (!text) return ''

    const format = typeof node.format === 'number' ? node.format : 0
    const isBold = Boolean(node.bold || (format & 1))
    const isItalic = Boolean(node.italic || (format & 2))
    const isStrikethrough = Boolean(node.strikethrough || (format & 4))
    const isUnderline = Boolean(node.underline || (format & 8))
    const isCode = Boolean(node.code || (format & 16))
    const isSub = Boolean(node.subscript || (format & 32))
    const isSuper = Boolean(node.superscript || (format & 64))
    const isHighlight = Boolean(node.highlight || (format & 128))

    // Parse markdown inside text if not already formatted as code
    if (!isCode) {
      text = formatInlineMarkdown(text)
    }

    if (isCode) text = `<code>${text}</code>`
    if (isBold) text = `<strong>${text}</strong>`
    if (isItalic) text = `<em>${text}</em>`
    if (isUnderline) text = `<u>${text}</u>`
    if (isStrikethrough) text = `<s>${text}</s>`
    if (isSub) text = `<sub>${text}</sub>`
    if (isSuper) text = `<sup>${text}</sup>`
    if (isHighlight) text = `<mark>${text}</mark>`

    return text
  }

  if (node.type === 'linebreak') {
    return '<br />'
  }

  if (node.type === 'horizontalrule' || node.type === 'horizontal-rule') {
    return '<hr />'
  }

  if (node.type === 'upload') {
    const val = node.value
    if (val && typeof val === 'object') {
      const src = val.url || val.sourceUrl || val.source_url
      if (src) {
        const alt = escapeHtml(val.alt || '')
        return `<figure class="cms-rich-text__upload"><img src="${escapeHtml(src)}" alt="${alt}" loading="lazy" /></figure>`
      }
    }
    return ''
  }

  const children = Array.isArray(node.children) ? node.children.map(richTextToHtml).join('') : ''

  if (node.type === 'link' || node.type === 'autolink') {
    const fields = node.fields || {}
    let href = fields.url || node.url || fields.href || node.href || ''

    if (!href && fields.linkType === 'internal' && fields.doc) {
      const doc = typeof fields.doc === 'object' ? fields.doc.value || fields.doc : fields.doc
      if (doc && typeof doc === 'object') {
        const slug = doc.slug || doc.handle
        const rel = fields.doc.relationTo || ''
        if (rel === 'pages') href = slug ? `/pages/${slug}` : '/'
        else if (rel === 'products') href = slug ? `/products/${slug}` : '/'
        else if (rel === 'product-collections') href = slug ? `/collections/${slug}` : '/'
        else if (slug) href = `/${slug}`
      }
    }

    const isExternal = href.startsWith('http://') || href.startsWith('https://')
    const newTab = Boolean(fields.newTab ?? node.newTab ?? isExternal)
    const targetAttr = newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
    const hrefAttr = href ? ` href="${escapeHtml(href)}"` : ''

    return `<a${hrefAttr}${targetAttr} class="cms-link">${children || escapeHtml(href)}</a>`
  }

  const align = typeof node.format === 'string' && ['left', 'center', 'right', 'justify'].includes(node.format)
    ? ` style="text-align: ${node.format};"`
    : ''

  switch (node.type) {
    case 'paragraph':
      return `<p${align}>${children || '<br />'}</p>`
    case 'heading': {
      const tag = node.tag || 'h2'
      return `<${tag}${align}>${children}</${tag}>`
    }
    case 'list': {
      const tag = node.listType === 'number' || node.tag === 'ol' ? 'ol' : 'ul'
      return `<${tag}>${children}</${tag}>`
    }
    case 'listitem':
      return `<li>${children}</li>`
    case 'quote':
      return `<blockquote>${children}</blockquote>`
    case 'code':
      return `<pre><code>${children}</code></pre>`
    default:
      return children
  }
}
