import { createClient } from '@libsql/client'

const databaseUrl = process.env.DATABASE_URI || 'file:./database.db'
const client = createClient({ url: databaseUrl })

type ColumnInfo = {
  name: string
}

async function getColumnNames(table: string) {
  const result = await client.execute(`PRAGMA table_info("${table}")`)
  return new Set(result.rows.map((row) => String((row as unknown as ColumnInfo).name)))
}

async function addColumn(table: string, name: string, definition: string) {
  const columns = await getColumnNames(table)

  if (!columns.has(name)) {
    await client.execute(`ALTER TABLE "${table}" ADD COLUMN "${name}" ${definition}`)
    console.log(`Added ${table}.${name}`)
  }
}

async function migrate() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "fonts" (
      "id" integer PRIMARY KEY NOT NULL,
      "font_family" text NOT NULL,
      "weight" text DEFAULT '400' NOT NULL,
      "style" text DEFAULT 'normal' NOT NULL,
      "fallback" text DEFAULT 'sans-serif' NOT NULL,
      "updated_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      "created_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      "url" text,
      "thumbnail_u_r_l" text,
      "filename" text,
      "mime_type" text,
      "filesize" numeric,
      "width" numeric,
      "height" numeric,
      "focal_x" numeric,
      "focal_y" numeric
    )
  `)

  await client.execute(
    'CREATE INDEX IF NOT EXISTS "fonts_updated_at_idx" ON "fonts" ("updated_at")',
  )
  await client.execute(
    'CREATE INDEX IF NOT EXISTS "fonts_created_at_idx" ON "fonts" ("created_at")',
  )
  await client.execute(
    'CREATE UNIQUE INDEX IF NOT EXISTS "fonts_filename_idx" ON "fonts" ("filename")',
  )

  await addColumn(
    'site_settings',
    'design_system_typography_body_font_id',
    'integer',
  )
  await addColumn(
    'site_settings',
    'design_system_typography_heading_font_id',
    'integer',
  )
  await addColumn(
    'site_settings',
    'design_system_typography_ui_font_id',
    'integer',
  )
  await addColumn(
    'site_settings',
    'design_system_typography_heading_size',
    'numeric DEFAULT 22',
  )
  await addColumn(
    'site_settings',
    'design_system_typography_subheading_size',
    'numeric DEFAULT 17',
  )
  await addColumn(
    'site_settings',
    'design_system_typography_body_size',
    'numeric DEFAULT 16',
  )
  await addColumn(
    'site_settings',
    'design_system_typography_line_height',
    'numeric DEFAULT 1.5',
  )
  await addColumn(
    'site_settings',
    'design_system_typography_letter_spacing',
    'numeric DEFAULT 0',
  )
  await addColumn(
    'site_settings',
    'design_system_spacing_scale',
    'numeric DEFAULT 1',
  )
  await addColumn(
    'site_settings',
    'design_system_spacing_page_padding_mobile',
    'numeric DEFAULT 16',
  )
  await addColumn(
    'site_settings',
    'design_system_spacing_page_padding_desktop',
    'numeric DEFAULT 28',
  )
  await addColumn(
    'site_settings',
    'design_system_spacing_grid_gap',
    'numeric DEFAULT 16',
  )

  await client.execute(`
    CREATE INDEX IF NOT EXISTS
      "site_settings_design_system_typography_design_system_typ_idx"
    ON "site_settings" ("design_system_typography_body_font_id")
  `)
  await client.execute(`
    CREATE INDEX IF NOT EXISTS
      "site_settings_design_system_typography_design_system_t_1_idx"
    ON "site_settings" ("design_system_typography_heading_font_id")
  `)
  await client.execute(`
    CREATE INDEX IF NOT EXISTS
      "site_settings_design_system_typography_design_system_t_2_idx"
    ON "site_settings" ("design_system_typography_ui_font_id")
  `)

  await addColumn('payload_locked_documents_rels', 'fonts_id', 'integer')
  await client.execute(`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_fonts_id_idx"
    ON "payload_locked_documents_rels" ("fonts_id")
  `)

  console.log(`Design-system migration complete: ${databaseUrl}`)
}

async function main() {
  try {
    await migrate()
  } finally {
    client.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
