// Interactive / automated cleanup utility for media assets.
//
// Usage:
//   node scripts/cleanup-media.mjs           # Scan and display current media sizes & usage
//   node scripts/cleanup-media.mjs --clean   # Safely delete heavy/unreferenced media, keep 1-2 test assets
//   node scripts/cleanup-media.mjs --reset-all # Deep reset: keep ONLY core brand logos & 1-2 test files
//
import { readFileSync, existsSync, readdirSync, statSync, unlinkSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { createClient } from '@libsql/client'

function readEnvDatabaseUri() {
  for (const file of ['.env.production', '.env']) {
    if (!existsSync(file)) continue
    const content = readFileSync(file, 'utf8')
    const match = content.match(/^\s*DATABASE_URI\s*=\s*(.+)\s*$/m)
    if (match) return match[1].trim().replace(/^["']|["']$/g, '')
  }
  return undefined
}

const dbUrl = process.env.DATABASE_URI || readEnvDatabaseUri() || 'file:./database.db'
console.log(`[cleanup-media] Database: ${dbUrl}`)

const client = createClient({ url: dbUrl })
const mediaDir = resolve('media')

// Essential core brand assets that should NEVER be deleted
const CORE_PRESERVED_FILENAMES = new Set([
  'dien-logo-header.png',
  'dien-logo-black.png',
  'dien-mark-black.png',
  'dien-mark-loader.png',
  'd-brandmark.png',
  'd-brandmark-currency.png',
  'nha-trang-6h.webp',
  'nha-trang-6h-1920x1306.webp',
  'nha-trang-6h-600x800.webp',
  'nha-trang-6h-300x300.webp',
  'test_video.mov', // Keep 1 small video file for upload & playback testing
])

function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

async function getMediaReferences() {
  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'")
  const refs = new Map() // id -> array of 'table.column'

  for (const table of tables.rows) {
    const tname = String(table.name)
    if (tname === 'media' || tname.startsWith('_') || tname.startsWith('payload_')) continue
    const cols = await client.execute(`PRAGMA table_info("${tname}")`)
    for (const col of cols.rows) {
      const cname = String(col.name)
      if (
        cname.includes('media') ||
        cname.includes('image_id') ||
        cname.includes('video_id') ||
        cname.includes('featured_image') ||
        cname.includes('logo') ||
        cname.includes('poster')
      ) {
        try {
          const res = await client.execute(
            `SELECT DISTINCT "${cname}" as id FROM "${tname}" WHERE "${cname}" IS NOT NULL`
          )
          for (const row of res.rows) {
            const num = Number(row.id)
            if (!isNaN(num) && num > 0) {
              if (!refs.has(num)) refs.set(num, [])
              refs.get(num).push(`${tname}.${cname}`)
            }
          }
        } catch {
          // ignore
        }
      }
    }
  }

  return refs
}

async function statusReport() {
  const refs = await getMediaReferences()
  const mediaRows = await client.execute(
    'SELECT id, filename, filesize, mime_type FROM media ORDER BY filesize DESC'
  )

  let diskFiles = []
  let totalDiskBytes = 0
  if (existsSync(mediaDir)) {
    for (const f of readdirSync(mediaDir)) {
      try {
        const full = join(mediaDir, f)
        const s = statSync(full)
        if (s.isFile()) {
          diskFiles.push({ name: f, size: s.size })
          totalDiskBytes += s.size
        }
      } catch {}
    }
  }

  diskFiles.sort((a, b) => b.size - a.size)

  console.log('\n================== MEDIA STATUS REPORT ==================')
  console.log(`Database media records : ${mediaRows.rows.length}`)
  console.log(`Physical files in media/: ${diskFiles.length} (${formatBytes(totalDiskBytes)})`)
  console.log(`Distinct IDs in DB use : ${refs.size}`)

  console.log('\n--- TOP 10 LARGEST FILES ON DISK ---')
  for (const f of diskFiles.slice(0, 10)) {
    console.log(`  - ${f.name.padEnd(45)} : ${formatBytes(f.size)}`)
  }

  console.log('\n--- TOP 10 LARGEST MEDIA IN DATABASE ---')
  for (const m of mediaRows.rows.slice(0, 10)) {
    const refList = refs.get(Number(m.id))
    const refStr = refList ? `[Used in: ${refList.join(', ')}]` : '[UNREFERENCED]'
    console.log(
      `  - [ID ${String(m.id).padStart(3)}] ${String(m.filename).padEnd(45)} : ${formatBytes(
        Number(m.filesize)
      )} | ${refStr}`
    )
  }

  const siteSettings = await client.execute(
    'SELECT home_hero_desktop_image_id, home_hero_mobile_image_id FROM site_settings LIMIT 1'
  )
  if (siteSettings.rows.length > 0) {
    const s = siteSettings.rows[0]
    console.log('\n--- HOMEPAGE HERO MEDIA ---')
    console.log(`  Hero Desktop Media ID : ${s.home_hero_desktop_image_id || '(default fallback)'}`)
    console.log(`  Hero Mobile Media ID  : ${s.home_hero_mobile_image_id || '(default fallback)'}`)
  }

  console.log('\n========================================================')
  console.log('To clean up heavy media (> 1MB) & reset hero to fast default, run:')
  console.log('  node scripts/cleanup-media.mjs --clean\n')
}

async function cleanHeavyMedia(resetAll = false) {
  console.log(`\nStarting cleanup (Mode: ${resetAll ? 'FULL RESET (Core Only)' : 'CLEAN HEAVY MEDIA (> 1MB)'})...`)
  const refs = await getMediaReferences()

  // 1. Reset heavy hero images in site_settings so homepage loads instantly with fallback
  console.log('-> Resetting homepage hero images in site_settings to default...')
  await client.execute(`
    UPDATE site_settings
    SET home_hero_desktop_image_id = NULL,
        home_hero_mobile_image_id = NULL,
        home_hero_tablet_image_id = NULL
  `)

  // 2. Clear any test product videos
  console.log('-> Cleaning up test videos from products_videos...')
  await client.execute('DELETE FROM products_videos')

  // 3. Find media to delete from database
  const allMedia = await client.execute('SELECT id, filename, filesize, mime_type FROM media')
  const toDelete = []
  const toKeep = []

  for (const m of allMedia.rows) {
    const fname = String(m.filename || '')
    const size = Number(m.filesize || 0)
    const isCore = CORE_PRESERVED_FILENAMES.has(fname)

    if (isCore) {
      toKeep.push(m)
      continue
    }

    if (resetAll) {
      toDelete.push(m)
    } else {
      // Clean files larger than 1MB (1,048,576 bytes) or unreferenced videos
      const isVideo = String(m.mime_type).startsWith('video') || fname.match(/\.(mp4|mov|webm)$/i)
      const isHeavy = size >= 1024 * 1024
      const isUnreferenced = !refs.has(Number(m.id))

      if (isHeavy || (isVideo && isUnreferenced)) {
        toDelete.push(m)
      } else {
        toKeep.push(m)
      }
    }
  }

  console.log(`-> Found ${toDelete.length} media records to remove (keeping ${toKeep.length} records).`)

  // 4. Detach foreign keys safely
  if (toDelete.length > 0) {
    const idsToDelete = toDelete.map((m) => Number(m.id))
    const idChunks = []
    const chunkSize = 100
    for (let i = 0; i < idsToDelete.length; i += chunkSize) {
      idChunks.push(idsToDelete.slice(i, i + chunkSize))
    }

    for (const chunk of idChunks) {
      const inClause = chunk.join(',')
      // Nullify or delete references in dependent tables
      await client.execute(`UPDATE products_images SET image_id = NULL WHERE image_id IN (${inClause})`).catch(() => {})
      await client.execute(`UPDATE products_variants SET featured_image_id = NULL WHERE featured_image_id IN (${inClause})`).catch(() => {})
      await client.execute(`UPDATE products SET size_chart_image_id = NULL WHERE size_chart_image_id IN (${inClause})`).catch(() => {})
      await client.execute(`DELETE FROM media WHERE id IN (${inClause})`)
    }
  }

  // 5. Delete physical files from disk in media/
  let deletedFilesCount = 0
  let freedBytes = 0

  if (existsSync(mediaDir)) {
    const filesOnDisk = readdirSync(mediaDir)
    const toDeleteFilenames = new Set(toDelete.map((m) => String(m.filename)))

    for (const f of filesOnDisk) {
      if (CORE_PRESERVED_FILENAMES.has(f)) continue

      const full = join(mediaDir, f)
      let size = 0
      try {
        size = statSync(full).size
      } catch {
        continue
      }

      const shouldDelete =
        resetAll ||
        toDeleteFilenames.has(f) ||
        size >= 1024 * 1024 ||
        f.match(/\.(mov|mp4|webm)$/i)

      if (shouldDelete) {
        try {
          unlinkSync(full)
          deletedFilesCount++
          freedBytes += size
        } catch (e) {
          console.error(`  Warning: Could not remove file ${f}:`, e.message)
        }
      }
    }
  }

  // 6. VACUUM database to compact and optimize
  console.log('-> Compacting SQLite database (VACUUM)...')
  try {
    await client.execute('VACUUM')
  } catch (e) {
    console.log('  (VACUUM skipped:', e.message, ')')
  }

  console.log('\n================== CLEANUP COMPLETED ==================')
  console.log(`Database records deleted : ${toDelete.length}`)
  console.log(`Physical files removed   : ${deletedFilesCount}`)
  console.log(`Disk space freed         : ${formatBytes(freedBytes)}`)
  console.log(`Remaining media records  : ${toKeep.length}`)
  console.log('========================================================\n')
}

const arg = process.argv[2]
if (arg === '--clean') {
  cleanHeavyMedia(false).catch(console.error)
} else if (arg === '--reset-all') {
  cleanHeavyMedia(true).catch(console.error)
} else {
  statusReport().catch(console.error)
}
