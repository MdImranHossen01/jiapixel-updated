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
      // Remove this duplicate - it's incorrect
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
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
      // Add imgBB domains for your image uploads
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https", 
        hostname: "*.ibb.co",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    // Add these for better image optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Add these for better performance and security
  experimental: {
    optimizeCss: true,
  },
  
  // Enable SWC minification (faster than Terser)
  swcMinify: true,
  
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

export default nextConfig;