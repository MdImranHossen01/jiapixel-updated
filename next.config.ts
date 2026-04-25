/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      // Add imgBB domains for your image uploads
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "*.ibb.co",
      },
      {
        protocol: "https",
        hostname: "www.livelearnleverage.org",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    // Optimized device sizes to reduce CPU-intensive transformations
    deviceSizes: [640, 750, 1080, 1920],
    imageSizes: [16, 32, 64, 128, 256],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // Add these for better performance and security
  experimental: {
    optimizeCss: true,
  },



  // Only enable these optimizations in production
  compiler:
    process.env.NODE_ENV === "production"
      ? {
        removeConsole: {
          exclude: ['error', 'warn'],
        },
      }
      : undefined,

  // Add headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ],
      },
    ]
  },
};

// @ts-ignore
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  buildExcludes: [/app\/api\/debug\/.*/],
});

export default withPWA(nextConfig);