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

  // Experimental features available in Next.js 16
  experimental: {
    // Optimise package imports to reduce bundle size
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

export default nextConfig
