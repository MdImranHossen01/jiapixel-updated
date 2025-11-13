// G:\jiapixel-updated\src\app\sitemap.ts

import { MetadataRoute } from 'next';
// NOTE: You need to implement database fetching functions for your models (Blog, Portfolios, Project)
// Assuming a fetch function exists in lib/db or lib/utils that retrieves all public slugs.
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import Project from '@/models/Project'; // Used for services
import Portfolio from '@/models/Portfolios';

const BASE_URL = 'https://jiapixel.com'; // Replace with your domain

// Helper to get dynamic routes
async function getDynamicRoutes(): Promise<MetadataRoute.Sitemap> {
  await connectDB();
  
  // 1. Fetch Blog Slugs
  const blogs = await Blog.find({}, 'slug updatedAt').lean();
  const blogRoutes: MetadataRoute.Sitemap = blogs.map(item => ({
    url: `${BASE_URL}/blogs/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 2. Fetch Service Slugs (from Project model)
  const services = await Project.find({}, 'slug updatedAt').lean();
  const serviceRoutes: MetadataRoute.Sitemap = services.map(item => ({
    url: `${BASE_URL}/services/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: 'weekly',
    priority: 1.0, // High priority for core services
  }));

  // 3. Fetch Portfolio Slugs
  const portfolios = await Portfolio.find({}, 'slug updatedAt').lean();
  const portfolioRoutes: MetadataRoute.Sitemap = portfolios.map(item => ({
    url: `${BASE_URL}/portfolios/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...blogRoutes, ...serviceRoutes, ...portfolioRoutes];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicRoutes = await getDynamicRoutes();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'always',
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
    // Add other static top-level pages here
  ];

  return [...staticRoutes, ...dynamicRoutes];
}