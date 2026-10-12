import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Next.js 16 — React 19 compatible
  reactStrictMode: true,

  images: {
    // Explicit remote patterns (Next.js 16 — domains is deprecated)
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },

  // Expose to browser (server-only vars go in process.env directly)
  env: {
    NEXT_PUBLIC_APP_NAME: 'The Builder',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api',
  },

  // Keep Turbopack scoped to this application. A separate lockfile exists in
  // the Windows user profile and must not influence dependency discovery.
  turbopack: {
    root: process.cwd(),
  },

  // Experimental features available in Next.js 16
  experimental: {
    // Optimise package imports to reduce bundle size
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/industries', destination: '/category/fintech', permanent: false },
      { source: '/industries/:slug', destination: '/category/:slug', permanent: false },
      { source: '/team', destination: '/about#team', permanent: false },
      { source: '/careers', destination: '/about#careers', permanent: false },
    ]
  },
}

export default nextConfig
