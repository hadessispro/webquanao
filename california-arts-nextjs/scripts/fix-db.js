const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const { createClient } = require('@libsql/client')

function readEnvDatabaseUri() {
  for (const file of ['.env.production', '.env']) {
    if (!fs.existsSync(file)) continue
    const content = fs.readFileSync(file, 'utf8')
    const match = content.match(/^\s*DATABASE_URI\s*=\s*(.+)\s*$/m)
    if (match) return match[1].trim().replace(/^["']|["']$/g, '')
  }
  return undefined
}

async function fixDatabase() {
  const url = process.env.DATABASE_URI || readEnvDatabaseUri() || 'file:database.db'
  console.log(`[DB Fix] Connecting to ${url}...`)
  const db = createClient({ url })

  async function tableExists(table) {
    const r = await db.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' AND name = ?",
      args: [table],
    })
    return r.rows.length > 0
  }

  async function columnNames(table) {
    const r = await db.execute(`PRAGMA table_info(${table})`)
    return new Set(r.rows.map((row) => String(row.name)))
  }

  let addedCols = 0

  // 1. Ensure table products_videos exists (for product detail videos)
  if (await tableExists('products') && !(await tableExists('products_videos'))) {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS products_videos (
        _order INTEGER NOT NULL DEFAULT 0,
        _parent_id INTEGER NOT NULL,
        id TEXT PRIMARY KEY NOT NULL,
        video_id INTEGER,
        source_url TEXT,
        poster_id INTEGER,
        poster_source_url TEXT,
        alt TEXT,
        color TEXT,
        position NUMERIC DEFAULT 999,
        placement TEXT DEFAULT 'inherit',
        autoplay INTEGER DEFAULT 1,
        loop INTEGER DEFAULT 1,
        muted INTEGER DEFAULT 1,
        controls INTEGER DEFAULT 0,
        FOREIGN KEY (video_id) REFERENCES media(id) ON UPDATE no action ON DELETE set null,
        FOREIGN KEY (poster_id) REFERENCES media(id) ON UPDATE no action ON DELETE set null,
        FOREIGN KEY (_parent_id) REFERENCES products(id) ON UPDATE no action ON DELETE cascade
      )
    `)
    console.log('[DB Fix] Created table products_videos')
  }

  // 2. Ensure table product_videos exists (for ProductVideos collection)
  if (!(await tableExists('product_videos'))) {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS product_videos (
        id INTEGER PRIMARY KEY NOT NULL,
        alt TEXT NOT NULL DEFAULT '',
        source TEXT DEFAULT 'manual',
        source_url TEXT,
        poster_id INTEGER,
        updated_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
        created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
        url TEXT,
        thumbnail_u_r_l TEXT,
        filename TEXT,
        mime_type TEXT,
        filesize NUMERIC,
        width NUMERIC,
        height NUMERIC,
        focal_x NUMERIC,
        focal_y NUMERIC,
        FOREIGN KEY (poster_id) REFERENCES media(id) ON UPDATE no action ON DELETE set null
      )
    `)
    console.log('[DB Fix] Created table product_videos')
  }

  // 3. Ensure table products_size_finder_size_rules exists
  if (await tableExists('products') && !(await tableExists('products_size_finder_size_rules'))) {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS products_size_finder_size_rules (
        _order INTEGER NOT NULL,
        _parent_id INTEGER NOT NULL,
        id TEXT PRIMARY KEY NOT NULL,
        height TEXT,
        weight TEXT,
        fit TEXT DEFAULT 'all',
        size TEXT,
        FOREIGN KEY (_parent_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `)
    console.log('[DB Fix] Created table products_size_finder_size_rules')
  }

  // 4. Ensure all required columns exist in tables
  const REQUIRED_COLUMNS = {
    products: [
      { name: 'price', ddl: 'price NUMERIC' },
      { name: 'compare_at_price', ddl: 'compare_at_price NUMERIC' },
      { name: 'subtitle', ddl: 'subtitle TEXT' },
      { name: 'size_chart_image_id', ddl: 'size_chart_image_id INTEGER' },
      { name: 'size_chart_image_source_url', ddl: 'size_chart_image_source_url TEXT' },
      { name: 'media_layout_video_placement', ddl: "media_layout_video_placement TEXT DEFAULT 'after-images'" },
      { name: 'size_selector_style', ddl: "size_selector_style TEXT DEFAULT 'auto'" },
      { name: 'care', ddl: 'care TEXT' },
      { name: 'size_fit', ddl: 'size_fit TEXT' },
      { name: 'shipping_returns', ddl: 'shipping_returns TEXT' },
      { name: 'material', ddl: 'material TEXT' },
      { name: 'published_at', ddl: 'published_at TEXT' },
      { name: 'shopify_created_at', ddl: 'shopify_created_at TEXT' },
      { name: 'shopify_updated_at', ddl: 'shopify_updated_at TEXT' },
      { name: 'seo_title', ddl: 'seo_title TEXT' },
      { name: 'seo_description', ddl: 'seo_description TEXT' },
      { name: 'info_tabs_details', ddl: 'info_tabs_details TEXT' },
      { name: 'info_tabs_material', ddl: 'info_tabs_material TEXT' },
      { name: 'info_tabs_shipping', ddl: 'info_tabs_shipping TEXT' },
      { name: 'info_tabs_exchange', ddl: 'info_tabs_exchange TEXT' },
      { name: 'size_finder_mode', ddl: "size_finder_mode TEXT DEFAULT 'inherit'" },
      { name: 'size_finder_fit_preference', ddl: "size_finder_fit_preference TEXT DEFAULT 'auto'" },
      { name: 'size_finder_custom_heights', ddl: 'size_finder_custom_heights TEXT' },
      { name: 'size_finder_custom_weights', ddl: 'size_finder_custom_weights TEXT' },
      { name: 'size_finder_custom_weights_comfort', ddl: 'size_finder_custom_weights_comfort TEXT' },
      { name: 'size_finder_custom_matrix_text', ddl: 'size_finder_custom_matrix_text TEXT' },
    ],
    products_videos: [
      { name: 'video_id', ddl: 'video_id INTEGER' },
      { name: 'source_url', ddl: 'source_url TEXT' },
      { name: 'poster_id', ddl: 'poster_id INTEGER' },
      { name: 'poster_source_url', ddl: 'poster_source_url TEXT' },
      { name: 'alt', ddl: 'alt TEXT' },
      { name: 'color', ddl: 'color TEXT' },
      { name: 'position', ddl: 'position NUMERIC DEFAULT 999' },
      { name: 'placement', ddl: "placement TEXT DEFAULT 'inherit'" },
      { name: 'autoplay', ddl: 'autoplay INTEGER DEFAULT 1' },
      { name: 'loop', ddl: 'loop INTEGER DEFAULT 1' },
      { name: 'muted', ddl: 'muted INTEGER DEFAULT 1' },
      { name: 'controls', ddl: 'controls INTEGER DEFAULT 0' },
    ],
    products_color_options: [
      { name: 'swatch_image_id', ddl: 'swatch_image_id INTEGER' },
      { name: 'swatch_image_source_url', ddl: 'swatch_image_source_url TEXT' },
    ],
    products_rels: [
      { name: 'media_id', ddl: 'media_id INTEGER' },
      { name: 'product_videos_id', ddl: 'product_videos_id INTEGER' },
    ],
    site_settings: [
      { name: 'home_hero_tablet_image_id', ddl: 'home_hero_tablet_image_id INTEGER' },
      { name: 'home_hero_tablet_source_url', ddl: 'home_hero_tablet_source_url TEXT' },
      { name: 'home_hero_image_opacity', ddl: 'home_hero_image_opacity NUMERIC' },
      { name: 'home_hero_flip_horizontal', ddl: 'home_hero_flip_horizontal INTEGER DEFAULT 0' },
      { name: 'size_finder', ddl: 'size_finder TEXT' },
    ],
    product_collections_view_all_sections: [
      { name: 'collection_id', ddl: 'collection_id INTEGER' },
    ],
    product_collections: [
      { name: 'bottom_cta_hide_cta', ddl: 'bottom_cta_hide_cta INTEGER DEFAULT 0' },
      { name: 'bottom_cta_eyebrow', ddl: 'bottom_cta_eyebrow TEXT' },
      { name: 'bottom_cta_eyebrow_vi', ddl: 'bottom_cta_eyebrow_vi TEXT' },
      { name: 'bottom_cta_button_label', ddl: 'bottom_cta_button_label TEXT' },
      { name: 'bottom_cta_button_label_vi', ddl: 'bottom_cta_button_label_vi TEXT' },
      { name: 'bottom_cta_link_collection_id', ddl: 'bottom_cta_link_collection_id INTEGER' },
      { name: 'bottom_cta_custom_url', ddl: 'bottom_cta_custom_url TEXT' },
    ],
  }

  for (const [table, columns] of Object.entries(REQUIRED_COLUMNS)) {
    if (!(await tableExists(table))) {
      continue
    }
    const existing = await columnNames(table)
    for (const col of columns) {
      if (existing.has(col.name)) continue
      try {
        await db.execute(`ALTER TABLE ${table} ADD COLUMN ${col.ddl}`)
        console.log(`[DB Fix] Added ${table}.${col.name}`)
        addedCols++
      } catch (err) {
        console.warn(`[DB Fix] Warning adding ${table}.${col.name}: ${err.message}`)
      }
    }
  }

  // 5. Ensure indexes on products_videos
  if (await tableExists('products_videos')) {
    const indexes = [
      'CREATE INDEX IF NOT EXISTS products_videos_order_idx ON products_videos (_order)',
      'CREATE INDEX IF NOT EXISTS products_videos_parent_id_idx ON products_videos (_parent_id)',
      'CREATE INDEX IF NOT EXISTS products_videos_video_idx ON products_videos (video_id)',
      'CREATE INDEX IF NOT EXISTS products_videos_poster_idx ON products_videos (poster_id)',
    ]
    for (const idx of indexes) {
      try {
        await db.execute(idx)
      } catch {}
    }

    try {
      const pCols = await columnNames('products_videos')
      if (pCols.has('product_videos_id') && pCols.has('video_id')) {
        await db.execute(`
          UPDATE products_videos
          SET video_id = product_videos_id
          WHERE video_id IS NULL AND product_videos_id IS NOT NULL
        `)
      }
    } catch {}
  }

  // 6. Ensure default site_settings row exists
  if (await tableExists('site_settings')) {
    const r = await db.execute('SELECT count(*) as count FROM site_settings')
    if (Number(r.rows[0].count) === 0) {
      await db.execute(`
        INSERT INTO site_settings (
          site_name, site_description, currency, currency_symbol, country,
          free_shipping_threshold, default_product_image_behavior, created_at, updated_at
        ) VALUES (
          'Điển', 'Điển. Accessible design by producing less & building better.',
          'VND', '₫', 'Vietnam', 6578950, 'payload', datetime('now'), datetime('now')
        )
      `)
      console.log('[DB Fix] Initialized default site_settings row')
    }
  }

  // 7. Ensure upload directories exist
  for (const dir of ['media', 'product-videos']) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
      console.log(`[DB Fix] Created upload directory ${dir}/`)
    }
  }

  // 8. Ensure Admin user password is set to Admin123456@ with Payload v3 hash
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

  console.log(`[DB Fix] Database repair complete! (${addedCols} column(s) added)`)
}

fixDatabase().catch((err) => {
  console.error('[DB Fix] Fatal error:', err)
  process.exit(1)
})

