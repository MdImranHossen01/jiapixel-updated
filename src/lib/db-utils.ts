import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import connectDB from './db';
import Writing from '@/models/Writing';
import Project from '@/models/Project';
import Blog from '@/models/Blog';
import Portfolio from '@/models/Portfolios';
import Post from '@/models/Post';
import Service from '@/models/Service';

// Revalidate time in seconds (1 year) - Using on-demand revalidation instead
export const DEFAULT_REVALIDATE = 31536000;

export const getWritings = cache(async (limit?: number) => {
  return unstable_cache(
    async () => {
      await connectDB();
      const query = Writing.find().sort({ createdAt: -1 });
      if (limit) query.limit(limit);
      return JSON.parse(JSON.stringify(await query));
    },
    ['writings', limit?.toString() || 'all'],
    { revalidate: DEFAULT_REVALIDATE, tags: ['writings'] }
  )();
});

export const getWritingBySlug = cache(async (slug: string) => {
  return unstable_cache(
    async () => {
      await connectDB();
      return JSON.parse(JSON.stringify(await Writing.findOne({ slug })));
    },
    ['writing', slug],
    { revalidate: DEFAULT_REVALIDATE, tags: [`writing-${slug}`, 'writings'] }
  )();
});

export const getProjects = cache(async (limit?: number) => {
  return unstable_cache(
    async () => {
      await connectDB();
      const query = Project.find().sort({ createdAt: -1 });
      if (limit) query.limit(limit);
      return JSON.parse(JSON.stringify(await query));
    },
    ['projects', limit?.toString() || 'all'],
    { revalidate: DEFAULT_REVALIDATE, tags: ['projects'] }
  )();
});

export const getProjectBySlug = cache(async (slug: string) => {
  return unstable_cache(
    async () => {
      await connectDB();
      return JSON.parse(JSON.stringify(await Project.findOne({ slug })));
    },
    ['project', slug],
    { revalidate: DEFAULT_REVALIDATE, tags: [`project-${slug}`, 'projects'] }
  )();
});

export const getBlogs = cache(async (limit?: number) => {
  return unstable_cache(
    async () => {
      await connectDB();
      const query = Blog.find().sort({ createdAt: -1 });
      if (limit) query.limit(limit);
      return JSON.parse(JSON.stringify(await query));
    },
    ['blogs', limit?.toString() || 'all'],
    { revalidate: DEFAULT_REVALIDATE, tags: ['blogs'] }
  )();
});

export const getBlogBySlug = cache(async (slug: string) => {
  return unstable_cache(
    async () => {
      await connectDB();
      return JSON.parse(JSON.stringify(await Blog.findOne({ slug })
        .populate('relatedBlogs')
        .populate('relatedServices')));
    },
    ['blog', slug],
    { revalidate: DEFAULT_REVALIDATE, tags: [`blog-${slug}`, 'blogs'] }
  )();
});

export const getPortfolios = cache(async (limit?: number) => {
  return unstable_cache(
    async () => {
      await connectDB();
      const query = Portfolio.find({ status: 'published' }).sort({ createdAt: -1 });
      if (limit) query.limit(limit);
      return JSON.parse(JSON.stringify(await query));
    },
    ['portfolios', limit?.toString() || 'all'],
    { revalidate: DEFAULT_REVALIDATE, tags: ['portfolios'] }
  )();
});

export const getPortfolioBySlug = cache(async (slug: string) => {
  return unstable_cache(
    async () => {
      await connectDB();
      return JSON.parse(JSON.stringify(await Portfolio.findOne({ slug, status: 'published' })));
    },
    ['portfolio', slug],
    { revalidate: DEFAULT_REVALIDATE, tags: [`portfolio-${slug}`, 'portfolios'] }
  )();
});

export const getPosts = cache(async (limit?: number) => {
  return unstable_cache(
    async () => {
      await connectDB();
      const query = Post.find().sort({ createdAt: -1 });
      if (limit) query.limit(limit);
      return JSON.parse(JSON.stringify(await query));
    },
    ['posts', limit?.toString() || 'all'],
    { revalidate: DEFAULT_REVALIDATE, tags: ['posts'] }
  )();
});

export const getServices = cache(async (limit?: number) => {
  return unstable_cache(
    async () => {
      await connectDB();
      const query = Service.find().sort({ title: 1 });
      if (limit) query.limit(limit);
      return JSON.parse(JSON.stringify(await query));
    },
    ['services', limit?.toString() || 'all'],
    { revalidate: DEFAULT_REVALIDATE, tags: ['services'] }
  )();
});
