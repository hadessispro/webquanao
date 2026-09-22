// Idempotent schema guard for the SQLite database.
//
// Payload only auto-syncs new columns in dev "push" mode. In production (and on
// the VPS, which uses a separate shared/database.db) new fields added to the CMS
// config are NOT created automatically, so Payload's generated SELECTs and INSERTs
// hit "no such column" or "no such table" and fail with 500 "Something went wrong".
//
// This script ensures all tables, columns, and indexes for all CMS collections
// exist on deploy. Safe to run repeatedly.
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

async function run() {
  let added = 0

  // 1. Ensure table products_videos exists (for product detail videos)
  if (await tableExists('products') && !(await tableExists('products_videos'))) {
    await client.execute(`
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
        FOREIGN KEY (_parent_id) REFERENCES products(id) ON UPDATE no action ON DELETE cascade
      )
    `)
    console.log('[ensure-schema] created table products_videos')
  }

  // 1b. Check if products_videos exists and has legacy foreign keys to media table
  if (await tableExists('products_videos')) {
    try {
      const fks = await client.execute('PRAGMA foreign_key_list(products_videos)')
      const hasMediaFk = fks.rows.some((r) => r.table === 'media')
      if (hasMediaFk) {
        console.log('[ensure-schema] migrating products_videos to remove strict foreign key constraints to media...')
        await client.execute('PRAGMA foreign_keys = OFF')
        await client.execute(`
          CREATE TABLE products_videos_temp (
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
            FOREIGN KEY (_parent_id) REFERENCES products(id) ON UPDATE no action ON DELETE cascade
          )
        `)
        await client.execute(`
          INSERT INTO products_videos_temp (
            _order, _parent_id, id, video_id, source_url, poster_id, poster_source_url,
            alt, color, position, placement, autoplay, loop, muted, controls
          )
          SELECT 
            _order, _parent_id, id, video_id, source_url, poster_id, poster_source_url,
            alt, color, position, placement, autoplay, loop, muted, controls
          FROM products_videos
        `)
        await client.execute('DROP TABLE products_videos')
        await client.execute('ALTER TABLE products_videos_temp RENAME TO products_videos')
        await client.execute('CREATE INDEX IF NOT EXISTS products_videos_order_idx ON products_videos (_order)')
        await client.execute('CREATE INDEX IF NOT EXISTS products_videos_parent_id_idx ON products_videos (_parent_id)')
        await client.execute('CREATE INDEX IF NOT EXISTS products_videos_video_idx ON products_videos (video_id)')
        await client.execute('CREATE INDEX IF NOT EXISTS products_videos_poster_idx ON products_videos (poster_id)')
        await client.execute('PRAGMA foreign_keys = ON')
        console.log('[ensure-schema] successfully migrated products_videos without strict foreign key constraints!')
      }
    } catch (err) {
      console.warn('[ensure-schema] error checking/migrating products_videos foreign keys:', err.message)
    }
  }

  // 2. Ensure table product_videos exists (for ProductVideos collection)
  if (!(await tableExists('product_videos'))) {
    await client.execute(`
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
    console.log('[ensure-schema] created table product_videos')
  }

  // 3. Ensure table products_size_finder_size_rules exists
  if (await tableExists('products') && !(await tableExists('products_size_finder_size_rules'))) {
    await client.execute(`
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
    console.log('[ensure-schema] created table products_size_finder_size_rules')
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
    header_navigation_mega_menu_columns: [
      { name: 'hide_heading', ddl: 'hide_heading INTEGER DEFAULT 0' },
    ],
  }

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
      try {
        await client.execute(`ALTER TABLE ${table} ADD COLUMN ${col.ddl}`)
        console.log(`[ensure-schema] added ${table}.${col.name}`)
        added += 1
      } catch (err) {
        console.warn(`[ensure-schema] could not add ${table}.${col.name}: ${err.message}`)
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
        await client.execute(idx)
      } catch (err) {
        // Index may already exist
      }
    }

    // If product_videos_id exists in products_videos (legacy column), copy to video_id if null
    try {
      const pCols = await columnNames('products_videos')
      if (pCols.has('product_videos_id') && pCols.has('video_id')) {
        await client.execute(`
          UPDATE products_videos
          SET video_id = product_videos_id
          WHERE video_id IS NULL AND product_videos_id IS NOT NULL
        `)
      }
    } catch {}
  }

  // 6. Ensure default site_settings row
  if (await tableExists('site_settings')) {
    const r = await client.execute('SELECT count(*) as count FROM site_settings')
    if (Number(r.rows[0].count) === 0) {
      await client.execute(`
        INSERT INTO site_settings (
          site_name,
          site_description,
          currency,
          currency_symbol,
          country,
          free_shipping_threshold,
          default_product_image_behavior,
          created_at,
          updated_at
        ) VALUES (
          'Điển',
          'Điển. Accessible design by producing less & building better.',
          'VND',
          '₫',
          'Vietnam',
          6578950,
          'payload',
          datetime('now'),
          datetime('now')
        )
      `)
      console.log('[ensure-schema] initialized default site_settings row')
    }
  }

  // 7. Ensure essential upload directories exist and sync files
  const { mkdirSync, copyFileSync, readdirSync, statSync } = await import('node:fs')
  const { join } = await import('node:path')

  for (const dir of ['media', 'product-videos']) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
      console.log(`[ensure-schema] created upload directory ${dir}/`)
    }
  }

  const publicMediaDir = 'public/media'
  const mediaDir = 'media'
  if (existsSync(publicMediaDir)) {
    if (!existsSync(mediaDir)) mkdirSync(mediaDir, { recursive: true })
    for (const f of readdirSync(publicMediaDir)) {
      const src = join(publicMediaDir, f)
      const dst = join(mediaDir, f)
      if (statSync(src).isFile() && !existsSync(dst)) {
        copyFileSync(src, dst)
        console.log(`[ensure-schema] synced ${f} to media/`)
      }
    }
  }

  // Cross-sync files between product-videos and media folders so uploads in either collection resolve
  const pvDir = 'product-videos'
  if (existsSync(pvDir) && existsSync(mediaDir)) {
    for (const f of readdirSync(pvDir)) {
      const src = join(pvDir, f)
      const dst = join(mediaDir, f)
      if (statSync(src).isFile() && !existsSync(dst)) {
        try {
          copyFileSync(src, dst)
          console.log(`[ensure-schema] cross-synced ${f} from product-videos/ to media/`)
        } catch {}
      }
    }
    for (const f of readdirSync(mediaDir)) {
      const src = join(mediaDir, f)
      const dst = join(pvDir, f)
      if (statSync(src).isFile() && !existsSync(dst)) {
        try {
          copyFileSync(src, dst)
          console.log(`[ensure-schema] cross-synced ${f} from media/ to product-videos/`)
        } catch {}
      }
    }
  }

  // 8. Ensure product_videos table rows also exist in media table
  if ((await tableExists('product_videos')) && (await tableExists('media'))) {
    try {
      const pvRows = await client.execute('SELECT * FROM product_videos')
      for (const row of pvRows.rows) {
        if (!row.id) continue
        const inMedia = await client.execute({
          sql: 'SELECT id FROM media WHERE id = ?',
          args: [row.id],
        })
        if (inMedia.rows.length === 0) {
          await client.execute({
            sql: `
              INSERT INTO media (
                id, alt, source, source_url, updated_at, created_at,
                url, thumbnail_u_r_l, filename, mime_type, filesize, width, height, focal_x, focal_y
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            args: [
              row.id,
              row.alt || row.filename || 'Product video',
              row.source || 'manual',
              row.source_url || null,
              row.updated_at || new Date().toISOString(),
              row.created_at || new Date().toISOString(),
              row.url || (row.filename ? `/product-videos/${row.filename}` : null),
              row.thumbnail_u_r_l || null,
              row.filename || null,
              row.mime_type || 'video/mp4',
              row.filesize || null,
              row.width || null,
              row.height || null,
              row.focal_x || null,
              row.focal_y || null,
            ],
          })
          console.log(`[ensure-schema] synced product_video id=${row.id} (${row.filename}) to media table`)
        }
      }
    } catch (err) {
      console.warn('[ensure-schema] note on product_videos to media sync:', err.message)
    }
  }

  // 9. Auto-heal: Ensure any products with missing variants are automatically restored
  if ((await tableExists('products')) && (await tableExists('products_variants'))) {
    try {
      const backupPath = 'scripts/product-variants-backup.json'
      if (existsSync(backupPath)) {
        const backup = JSON.parse(readFileSync(backupPath, 'utf8'))
        const emptyProducts = await client.execute(`
          SELECT p.id, p.title
          FROM products p
          LEFT JOIN products_variants v ON p.id = v._parent_id
          GROUP BY p.id
          HAVING count(v.id) = 0
        `)
        if (emptyProducts.rows.length > 0) {
          console.log(`[ensure-schema] Found ${emptyProducts.rows.length} product(s) missing variants. Restoring...`)
          for (const p of emptyProducts.rows) {
            const pId = Number(p.id)
            const pVars = backup.variants.filter((v) => Number(v._parent_id) === pId)
            const pOpts = backup.options.filter((o) => Number(o._parent_id) === pId)
            const pOptVals = backup.optionValues.filter((ov) => Number(ov._parent_id) === pId)

            for (const v of pVars) {
              await client.execute({
                sql: `INSERT OR REPLACE INTO products_variants (
                  _order, _parent_id, id, shopify_variant_id, title, sku,
                  option1, option2, option3, price, compare_at_price, available,
                  featured_image_id, featured_image_source_url
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [
                  v._order,
                  v._parent_id,
                  v.id,
                  v.shopify_variant_id,
                  v.title,
                  v.sku,
                  v.option1,
                  v.option2,
                  v.option3,
                  v.price,
                  v.compare_at_price,
                  v.available,
                  v.featured_image_id,
                  v.featured_image_source_url,
                ],
              })
            }

            for (const o of pOpts) {
              await client.execute({
                sql: `INSERT OR REPLACE INTO products_options (_order, _parent_id, id, name, position) VALUES (?, ?, ?, ?, ?)`,
                args: [o._order, o._parent_id, o.id, o.name, o.position],
              })
            }

            for (const ov of pOptVals) {
              await client.execute({
                sql: `INSERT OR REPLACE INTO products_options_values (_order, _parent_id, id, value) VALUES (?, ?, ?, ?)`,
                args: [ov._order, ov._parent_id, ov.id, ov.value],
              })
            }
            console.log(`[ensure-schema] Restored ${pVars.length} variants and ${pOpts.length} options for Product ${pId} (${p.title})`)
          }
        }
      }
    } catch (err) {
      console.warn('[ensure-schema] note on auto-variant restore:', err.message)
    }
  }

  console.log(`[ensure-schema] done (${added} column(s) added)`)
}

run().catch((err) => {
  console.error('[ensure-schema] failed:', err)
  process.exit(1)
})
