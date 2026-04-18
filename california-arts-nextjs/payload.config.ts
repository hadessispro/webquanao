import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Collections
import { Media } from './src/payload/collections/Media'
import { Products } from './src/payload/collections/Products'
import { ProductCollections } from './src/payload/collections/ProductCollections'
import { Pages } from './src/payload/collections/Pages'
import { Orders } from './src/payload/collections/Orders'

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
    Products,
    ProductCollections,
    Pages,
    Orders,
  ],
  globals: [Header, Footer, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'default-secret-change-me',
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./database.db',
    },
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload/payload-types.ts'),
  },
})
