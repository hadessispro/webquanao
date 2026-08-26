// Idempotent schema guard for the SQLite database.
//
// Payload only auto-syncs new columns in dev "push" mode. In production (and on
// the VPS, which uses a separate shared/database.db) new fields added to the CMS
// config are NOT created automatically, so Payload's generated SELECTs would hit
// "no such column" and silently fall back to stale data.
//
// This script adds any missing columns for the CMS fields we introduced. It is
// safe to run repeatedly: existing columns are skipped. Run it on deploy AFTER
// `npm ci` and BEFORE `npm run build` / app reload.
//
// DB location resolution order:
//   1. process.env.DATABASE_URI
//   2. DATABASE_URI in .env.production (VPS) then .env (local)
//   3. file:./database.db
import { readFileSync, existsSync } from 'node:fs'
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

const url = process.env.DATABASE_URI || readEnvDatabaseUri() || 'file:./database.db'
console.log(`[ensure-schema] using DATABASE_URI=${url}`)

const client = createClient({ url })

// table -> [ { name, ddl } ]
const REQUIRED_COLUMNS = {
  products: [
    { name: 'info_tabs_details', ddl: 'info_tabs_details TEXT' },
    { name: 'info_tabs_shipping', ddl: 'info_tabs_shipping TEXT' },
    { name: 'info_tabs_exchange', ddl: 'info_tabs_exchange TEXT' },
  ],
  products_videos: [{ name: 'color', ddl: 'color TEXT' }],
  site_settings: [
    { name: 'home_hero_flip_horizontal', ddl: 'home_hero_flip_horizontal INTEGER DEFAULT false' },
  ],
}

async function tableExists(table) {
  const r = await client.execute({
    sql: "SELECT name FROM sqlite_master WHERE type='table' AND name = ?",
    args: [table],
  })
  return r.rows.length > 0
}

async function columnNames(table) {
  const r = await client.execute(`PRAGMA table_info(${table})`)
  return new Set(r.rows.map((row) => String(row.name)))
}

let added = 0
for (const [table, columns] of Object.entries(REQUIRED_COLUMNS)) {
  if (!(await tableExists(table))) {
    console.log(`[ensure-schema] table ${table} not found yet, skipping`)
    continue
  }
  const existing = await columnNames(table)
  for (const col of columns) {
    if (existing.has(col.name)) {
      continue
    }
    await client.execute(`ALTER TABLE ${table} ADD COLUMN ${col.ddl}`)
    console.log(`[ensure-schema] added ${table}.${col.name}`)
    added += 1
  }
}

console.log(`[ensure-schema] done (${added} column(s) added)`) 
