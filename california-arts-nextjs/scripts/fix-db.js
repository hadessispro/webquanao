const { createClient } = require('@libsql/client')

async function fixDatabase() {
  const db = createClient({ url: process.env.DATABASE_URI || 'file:database.db' })
  const cols = [
    ['home_hero_tablet_image_id', 'INTEGER'],
    ['home_hero_tablet_source_url', 'TEXT'],
    ['home_hero_image_opacity', 'NUMERIC'],
  ]

  try {
    const tableInfo = await db.execute('PRAGMA table_info(site_settings)')
    const existing = new Set(tableInfo.rows.map((r) => r.name))

    for (const [col, type] of cols) {
      if (!existing.has(col)) {
        try {
          await db.execute(`ALTER TABLE site_settings ADD COLUMN ${col} ${type}`)
          console.log(`[DB Fix] Added missing column: ${col}`)
        } catch (e) {
          console.error(`[DB Fix] Error adding column ${col}:`, e.message)
        }
      }
    }
    console.log('[DB Fix] Database schema sync complete!')
  } catch (err) {
    console.error('[DB Fix] Error inspecting table:', err.message)
  }
}

fixDatabase()
