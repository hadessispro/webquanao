/**
 * Seed script: Import products from products-json.json into Payload CMS
 *
 * Usage (PowerShell): npx tsx scripts/seed-products.ts
 *
 * This script reads the Shopify-exported JSON and creates
 * corresponding records in the Payload CMS Products collection.
 *
 * Prerequisites:
 *   1. Run `npm run dev` first so Payload initializes the DB
 *   2. Create an admin user at /admin
 *   3. Then run this script
 */

import { getPayload } from "payload";
import config from "../payload.config";
import productsData from "../json/products-json.json";

interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  vendor: string;
  product_type: string;
  tags: string[];
  variants: Array<{
    id: number;
    title: string;
    option1: string | null;
    option2: string | null;
    option3: string | null;
    sku: string;
    price: string;
    compare_at_price: string | null;
    available: boolean;
    featured_image: {
      src: string;
      alt: string | null;
    } | null;
  }>;
  images: Array<{
    id: number;
    src: string;
    position: number;
    width: number;
    height: number;
  }>;
  options: Array<{
    name: string;
    position: number;
    values: string[];
  }>;
}

async function seed() {
  console.log("🌱 Starting product seed...");

  const payload = await getPayload({ config });

  const products = (productsData as { products: ShopifyProduct[] }).products;
  console.log(`📦 Found ${products.length} products to import`);

  for (const product of products) {
    try {
      // Check if product already exists
      const existing = await payload.find({
        collection: "products",
        where: { handle: { equals: product.handle } },
        limit: 1,
      });

      if (existing.docs.length > 0) {
        console.log(`⏭️  Skipping "${product.title}" (already exists)`);
        continue;
      }

      // Create product in Payload CMS
      await payload.create({
        collection: "products",
        data: {
          title: product.title,
          handle: product.handle,
          bodyHtml: product.body_html || "",
          productType: product.product_type || "",
          vendor: product.vendor || "California Arts",
          status: "active",
          tags: product.tags.map((tag) => ({ tag })),
          options: product.options.map((opt) => ({
            name: opt.name,
            values: opt.values.map((v) => ({ value: v })),
          })),
          variants: product.variants.map((v) => ({
            title: v.title,
            sku: v.sku || "",
            option1: v.option1 || "",
            option2: v.option2 || "",
            price: parseInt(v.price, 10),
            compareAtPrice: v.compare_at_price
              ? parseInt(v.compare_at_price, 10)
              : undefined,
            available: v.available,
          })),
          // Note: Images need to be uploaded to Media collection first
          // For now, we store the external URLs in bodyHtml as reference
        },
      });

      console.log(`✅ Created "${product.title}"`);
    } catch (error) {
      console.error(`❌ Error creating "${product.title}":`, error);
    }
  }

  console.log("🎉 Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
