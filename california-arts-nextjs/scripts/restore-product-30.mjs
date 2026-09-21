import { createClient } from '@libsql/client';
import fs from 'node:fs';
import crypto from 'node:crypto';

const client = createClient({ url: 'file:./database.db' });

function randomHex(bytes = 12) {
  return crypto.randomBytes(bytes).toString('hex');
}

function normalizeUrl(src) {
  if (!src) return '';
  return src.startsWith('//') ? `https:${src}` : src;
}

async function restore() {
  const json = JSON.parse(fs.readFileSync('json/products-json.json', 'utf8'));
  const p30 = json.products.find(p => p.handle === 'hammer90sfitvnecksweater' || p.id === 9953729773848);

  if (!p30) {
    throw new Error('Product hammer90sfitvnecksweater not found in products-json.json');
  }

  console.log(`Found product: ${p30.title} (Shopify ID: ${p30.id})`);

  // Clear existing empty or corrupted options & variants for product 30
  await client.execute({
    sql: "DELETE FROM products_options_values WHERE _parent_id IN (SELECT id FROM products_options WHERE _parent_id = 30)",
    args: []
  });
  await client.execute({
    sql: "DELETE FROM products_options WHERE _parent_id = 30",
    args: []
  });
  await client.execute({
    sql: "DELETE FROM products_variants WHERE _parent_id = 30",
    args: []
  });

  // Restore options
  for (let oIdx = 0; oIdx < p30.options.length; oIdx++) {
    const opt = p30.options[oIdx];
    const optionId = randomHex();

    await client.execute({
      sql: `INSERT INTO products_options (_order, _parent_id, id, name, position) VALUES (?, ?, ?, ?, ?)`,
      args: [oIdx + 1, 30, optionId, opt.name, opt.position]
    });

    for (let vIdx = 0; vIdx < opt.values.length; vIdx++) {
      const val = opt.values[vIdx];
      const valId = randomHex();
      await client.execute({
        sql: `INSERT INTO products_options_values (_order, _parent_id, id, value) VALUES (?, ?, ?, ?)`,
        args: [vIdx + 1, optionId, valId, val]
      });
    }
  }

  console.log(`Restored ${p30.options.length} options`);

  // Pre-fetch media map
  const mediaRows = await client.execute("SELECT id, source_url FROM media WHERE source_url IS NOT NULL");
  const mediaMap = new Map();
  for (const m of mediaRows.rows) {
    if (m.source_url) {
      mediaMap.set(normalizeUrl(m.source_url), m.id);
    }
  }

  // Restore variants
  for (let vIdx = 0; vIdx < p30.variants.length; vIdx++) {
    const v = p30.variants[vIdx];
    const variantId = randomHex();
    const featuredSrc = normalizeUrl(v.featured_image?.src);
    const mediaId = featuredSrc ? mediaMap.get(featuredSrc) || null : null;

    await client.execute({
      sql: `INSERT INTO products_variants (
        _order, _parent_id, id, shopify_variant_id, title, sku,
        option1, option2, option3, price, compare_at_price, available,
        featured_image_id, featured_image_source_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        vIdx + 1,
        30,
        variantId,
        v.id,
        v.title,
        v.sku || '',
        v.option1 || '',
        v.option2 || '',
        v.option3 || '',
        parseInt(v.price, 10),
        v.compare_at_price ? parseInt(v.compare_at_price, 10) : null,
        v.available ? 1 : 0,
        mediaId,
        featuredSrc || null
      ]
    });
  }

  console.log(`Restored ${p30.variants.length} variants`);

  // Verify
  const optCount = await client.execute({ sql: "SELECT count(*) as count FROM products_options WHERE _parent_id = 30", args: [] });
  const varCount = await client.execute({ sql: "SELECT count(*) as count FROM products_variants WHERE _parent_id = 30", args: [] });

  console.log(`Verification: product 30 has ${optCount.rows[0].count} options, ${varCount.rows[0].count} variants`);
}

restore().catch(err => {
  console.error('Error during restore:', err);
  process.exit(1);
});
