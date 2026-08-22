const crypto = require('crypto')
const { createClient } = require('@libsql/client')

async function fixDatabase() {
  const db = createClient({ url: process.env.DATABASE_URI || 'file:database.db' })

  // 1. Ensure all missing columns exist in site_settings table
  const siteSettingsCols = [
    ['home_hero_tablet_image_id', 'INTEGER'],
    ['home_hero_tablet_source_url', 'TEXT'],
    ['home_hero_image_opacity', 'NUMERIC'],
  ]

  try {
    const tableInfo = await db.execute('PRAGMA table_info(site_settings)')
    const existing = new Set(tableInfo.rows.map((r) => String(r.name)))

    for (const [col, type] of siteSettingsCols) {
      if (!existing.has(col)) {
        try {
          await db.execute(`ALTER TABLE site_settings ADD COLUMN ${col} ${type}`)
          console.log(`[DB Fix] Added missing column to site_settings: ${col}`)
        } catch (e) {
          console.error(`[DB Fix] Error adding column ${col}:`, e.message)
        }
      }
    }
  } catch (err) {
    console.error('[DB Fix] Error inspecting site_settings table:', err.message)
  }

  // 2. Ensure missing columns exist in products table
  const productCols = [
    ['price', 'NUMERIC'],
    ['compare_at_price', 'NUMERIC'],
    ['size_chart_image_id', 'INTEGER'],
    ['size_chart_image_source_url', 'TEXT'],
  ]

  try {
    const tableInfo = await db.execute('PRAGMA table_info(products)')
    const existing = new Set(tableInfo.rows.map((r) => String(r.name)))

    for (const [col, type] of productCols) {
      if (!existing.has(col)) {
        try {
          await db.execute(`ALTER TABLE products ADD COLUMN ${col} ${type}`)
          console.log(`[DB Fix] Added missing column to products: ${col}`)
        } catch (e) {
          console.error(`[DB Fix] Error adding column ${col}:`, e.message)
        }
      }
    }
  } catch (err) {
    console.error('[DB Fix] Error inspecting products table:', err.message)
  }

  // 3. Ensure missing columns exist in products_color_options table
  const colorCols = [
    ['swatch_image_id', 'INTEGER'],
    ['swatch_image_source_url', 'TEXT'],
  ]

  try {
    const tableInfo = await db.execute('PRAGMA table_info(products_color_options)')
    const existing = new Set(tableInfo.rows.map((r) => String(r.name)))

    for (const [col, type] of colorCols) {
      if (!existing.has(col)) {
        try {
          await db.execute(`ALTER TABLE products_color_options ADD COLUMN ${col} ${type}`)
          console.log(`[DB Fix] Added missing column to products_color_options: ${col}`)
        } catch (e) {
          console.error(`[DB Fix] Error adding column ${col}:`, e.message)
        }
      }
    }
  } catch (err) {
    console.error('[DB Fix] Error inspecting products_color_options table:', err.message)
  }

  // 4. Ensure Admin user password is set to Admin123456@ with Payload v3 hash
  try {
    const passwordToSet = 'Admin123456@'
    const salt = crypto.randomBytes(32).toString('hex')
    const hashBuffer = crypto.pbkdf2Sync(passwordToSet, salt, 25000, 512, 'sha256')
    const hash = hashBuffer.toString('hex')

    await db.execute({
      sql: 'UPDATE users SET salt = ?, hash = ?, login_attempts = 0, lock_until = NULL WHERE id = 1',
      args: [salt, hash],
    })
    console.log('[DB Fix] Admin password updated successfully to Admin123456@')
  } catch (err) {
    console.error('[DB Fix] Error updating admin password:', err.message)
  }

  console.log('[DB Fix] Database repair and sync complete!')
}

fixDatabase()
