import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*', // Applies to all search engine crawlers
      allow: '/',      // Allows crawlers to access all pages
      disallow: '/private/', // Example: Disallows crawling of a /private/ directory
    },
    sitemap: 'https://www.jiapixel.com/sitemap.xml', // Location of your sitemap
  };
}