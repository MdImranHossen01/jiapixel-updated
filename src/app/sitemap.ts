/* eslint-disable @typescript-eslint/no-explicit-any */
// G:\jiapixel-updated\src\app\sitemap.ts

import { MetadataRoute } from "next";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

import Blog from "@/models/Blog";
import Service from "@/models/Service";
import Portfolio from "@/models/Portfolios";

export const dynamic = "force-dynamic";

const BASE_URL = "https://www.jiapixel.com";

const getDynamicRoutes = async (): Promise<MetadataRoute.Sitemap> => {
  try {
    await connectDB();

    const [blogs, services, portfolios, categories] = await Promise.all([
      Blog.find({}, "slug updatedAt")
        .lean()
        .exec(),

      Service.find(
        { status: { $in: ["published", "draft"] } },
        "slug updatedAt"
      )
        .lean()
        .exec(),

      Portfolio.find({}, "slug updatedAt").lean().exec(),

      Category.find({}, "slug updatedAt").lean().exec(),
    ]);

    const blogRoutes: MetadataRoute.Sitemap = blogs.map((item: any) => ({
      url: `${BASE_URL}/blogs/${item.slug}`,
      lastModified: item.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const serviceRoutes: MetadataRoute.Sitemap = services.map((item: any) => ({
      url: `${BASE_URL}/services/${item.slug}`,
      lastModified: item.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    }));

    const portfolioRoutes: MetadataRoute.Sitemap = portfolios.map(
      (item: any) => ({
        url: `${BASE_URL}/portfolios/${item.slug}`,
        lastModified: item.updatedAt || new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      })
    );

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((item: any) => ({
      url: `${BASE_URL}/${item.slug}`,
      lastModified: item.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    return [...blogRoutes, ...serviceRoutes, ...portfolioRoutes, ...categoryRoutes];
  } catch (error) {
    console.error("Error generating dynamic sitemap routes:", error);
    return [];
  }
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicRoutes = await getDynamicRoutes();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/portfolios`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/best-web-design-and-development-services`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
