import type { NextConfig } from "next";

// Pages that may embed this app in a frame (the class hub's dashboard). Space-separated CSP
// sources; read at build time, so a change needs a redeploy.
const frameAncestors =
  process.env.HUB_FRAME_ANCESTORS ||
  'https://preview.cbs-tech-strategy.com https://*.preview.cbs-tech-strategy.com';

const nextConfig: NextConfig = {
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors 'self' ${frameAncestors}`,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
