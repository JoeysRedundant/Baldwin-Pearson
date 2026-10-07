import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  serverExternalPackages: ['nodemailer'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/about-baldwinpearson', destination: '/about', permanent: true },
      { source: '/listings-active', destination: '/properties?status=sale', permanent: true },
      { source: '/listings-lease', destination: '/properties?status=lease', permanent: true },
      { source: '/listings-sold', destination: '/properties?status=closed', permanent: true },
      { source: '/listing/:slug', destination: '/properties/:slug', permanent: true },
    ];
  },
};
export default config;
