import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

import path from "node:path";
import fs from "node:fs";

const turbopackRoot = (() => {
  if (process.env.TURBOPACK_ROOT) return path.resolve(process.env.TURBOPACK_ROOT);
  if (process.platform !== 'win32' && fs.existsSync('/var/www/dien-web')) {
    return '/var/www/dien-web';
  }
  return path.resolve(process.cwd());
})();

const nextConfig: NextConfig = {
  ...(turbopackRoot ? { turbopack: { root: turbopackRoot } } : {}),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'california-arts.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/api/fonts/file/:filename*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/media/:filename*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/css/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/js/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '250mb',
    },
  },
};

export default withPayload(nextConfig);
