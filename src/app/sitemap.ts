// G:\jiapixel-updated\src\app\sitemap.ts

import { MetadataRoute } from 'next';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import Project from '@/models/Project';
import Portfolio from '@/models/Portfolios';

const BASE_URL = 'https://www.jiapixel.com';

// Simple caching using native fetch caching
const getDynamicRoutes = async (): Promise<MetadataRoute.Sitemap> => {
  try {
    await connectDB();

    // 1. Run all queries concurrently for maximum speed
    const [blogs, services, portfolios] = await Promise.all([
      Blog.find({}, 'slug updatedAt').lean().exec(),
      Project.find({}, 'slug updatedAt').lean().exec(),
      Portfolio.find({}, 'slug updatedAt').lean().exec(),
    ]);

    // 2. Map all routes
    const blogRoutes: MetadataRoute.Sitemap = blogs.map(item => ({
      url: `${BASE_URL}/blogs/${item.slug}`,
      lastModified: item.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const serviceRoutes: MetadataRoute.Sitemap = services.map(item => ({
      url: `${BASE_URL}/services/${item.slug}`,
      lastModified: item.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    }));

    const portfolioRoutes: MetadataRoute.Sitemap = portfolios.map(item => ({
      url: `${BASE_URL}/portfolios/${item.slug}`,
      lastModified: item.updatedAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    return [...blogRoutes, ...serviceRoutes, ...portfolioRoutes];
  } catch (error) {
    console.error('Error generating dynamic sitemap routes:', error);
    return []; // Return empty array on error
  }
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicRoutes = await getDynamicRoutes();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily', // Changed from 'always' to 'daily'
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/portfolios`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }
  ];

  return [...staticRoutes, ...dynamicRoutes];
}