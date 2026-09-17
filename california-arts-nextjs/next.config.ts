import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

import path from "node:path";
import fs from "node:fs";

const turbopackRoot = (() => {
  if (process.env.TURBOPACK_ROOT) return path.resolve(process.env.TURBOPACK_ROOT);
  if (process.platform !== 'win32' && fs.existsSync('/var/www/dien-web')) {
    return '/var/www/dien-web';
  }
  return undefined;
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
};

export default withPayload(nextConfig);
