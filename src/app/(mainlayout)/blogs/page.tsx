import type { Metadata } from 'next';
import BlogsClient from './components/BlogsClient';

import { getBlogs as fetchBlogs } from '@/lib/db-utils';

async function getBlogsData() {
  try {
    const blogs = await fetchBlogs(1000);
    return { success: true, blogs };
  } catch (error) {
    return {
      blogs: [],
      error: error instanceof Error ? error.message : 'Failed to fetch blogs'
    };
  }
}

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://www.jiapixel.com';
  const canonicalUrl = `${baseUrl}/blogs`;

  return {
    title: 'Our Blog - Web Development Insights & Digital Marketing Tips | Jiapixel',
    description: 'Read our latest blog posts about web development, digital marketing, SEO strategies, and technology insights. Stay updated with industry trends and best practices.',
    keywords: 'blog, web development, digital marketing, SEO, technology, tutorials, insights',

    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },

    // Open Graph
    openGraph: {
      title: 'Our Blog - Web Development Insights & Digital Marketing Tips | Jiapixel',
      description: 'Read our latest blog posts about web development, digital marketing, SEO strategies, and technology insights.',
      url: canonicalUrl,
      siteName: 'Jiapixel',
      images: [
        {
          url: 'https://www.jiapixel.com/icon.png',
          width: 1200,
          height: 630,
          alt: 'Jiapixel Blog - Web Development & Digital Marketing Insights',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: 'Our Blog - Web Development Insights & Digital Marketing Tips | Jiapixel',
      description: 'Read our latest blog posts about web development, digital marketing, SEO strategies, and technology insights.',
      images: ['https://www.jiapixel.com/icon.png'],
      creator: '@jiapixel',
    },
  };
}

// Helper function to create plain text excerpt from HTML (replicated here only for structured data if needed, or we can just remove it if structured data is not critical to keep exactly as is, but assuming we want to keep structured data)
function createPlainTextExcerpt(html: string, maxLength: number = 150): string {
  if (!html) return '';
  const plainText = html.replace(/<[^>]*>/g, '').trim();
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + '...';
}

export default async function BlogsPage() {
  const data = await getBlogsData();
  const blogs = data.blogs || [];

  // Generate structured data for blog listing
  const blogStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Jiapixel Blog',
    description: 'Web development insights and digital marketing tips',
    url: 'https://www.jiapixel.com/blogs',
    numberOfItems: blogs.length,
    itemListElement: blogs.map((blog: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'BlogPosting',
        headline: blog.title,
        description: blog.seoDescription || createPlainTextExcerpt(blog.content) || '',
        url: `https://www.jiapixel.com/blogs/${blog.slug}`,
        image: blog.featuredImage,
        datePublished: blog.publishedAt || blog.createdAt,
        dateModified: blog.updatedAt,
        author: {
          '@type': 'Person',
          name: blog.authorName || 'Md Imran Hossen'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Jiapixel',
          url: 'https://www.jiapixel.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.jiapixel.com/icon.png'
          }
        }
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData).replace(/</g, '\\u003c') }}
      />

      {data.error ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Blogs</h2>
            <p className="text-muted-foreground">{data.error}</p>
          </div>
        </div>
      ) : (
        <BlogsClient initialBlogs={blogs} />
      )}
    </>
  );
}