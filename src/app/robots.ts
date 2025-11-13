// G:\jiapixel-updated\src\app\robots.ts

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      // Allow Googlebot and all other bots access
      userAgent: '*',
      allow: '/',
      // Disallow access to the dashboard/admin areas
      disallow: ['/dashboard/', '/api/'],
    },
    sitemap: 'https://jiapixel.com/sitemap.xml', // Replace with your domain
  };
}