import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Collections
import { Media } from './src/payload/collections/Media'
import { Fonts } from './src/payload/collections/Fonts'
import { ProductVideos } from './src/payload/collections/ProductVideos'
import { Products } from './src/payload/collections/Products'
import { ProductCollections } from './src/payload/collections/ProductCollections'
import { Pages } from './src/payload/collections/Pages'
import { Orders } from './src/payload/collections/Orders'
import { DiscountCodes } from './src/payload/collections/DiscountCodes'
import { Customers } from './src/payload/collections/Customers'

// Globals
import { Header } from './src/payload/globals/Header'
import { Footer } from './src/payload/globals/Footer'
import { SiteSettings } from './src/payload/globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname, 'src'),
    },
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'role',
          type: 'select',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
          ],
          defaultValue: 'editor',
        },
      ],
    },
    Media,
    Fonts,
    ProductVideos,
    Products,
    ProductCollections,
    Pages,
    DiscountCodes,
    Customers,
    Orders,
  ],
  globals: [Header, Footer, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'default-secret-change-me',
  db: sqliteAdapter({
    // Dev auto-push can conflict with an existing schema when Payload is booted
    // from a standalone script (e.g. seeds). Allow disabling it via env without
    // affecting the normal dev server or production.
    ...(process.env.PAYLOAD_DISABLE_PUSH === 'true' ? { push: false } : {}),
    busyTimeout: 5000,
    client: {
      url: process.env.DATABASE_URI || 'file:./database.db',
    },
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload/payload-types.ts'),
  },
})
