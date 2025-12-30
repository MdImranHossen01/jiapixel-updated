import type { Metadata } from 'next';
import BlogsClient from './components/BlogsClient';

// Helper function to get base URL
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
}

async function getBlogs() {
  try {
    const baseUrl = getBaseUrl();

    const response = await fetch(`${baseUrl}/api/blogs`, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      return { blogs: [], error: `Failed to fetch blogs: ${response.status}` };
    }

    const data = await response.json();

    if (!data.success) {
      return { blogs: [], error: data.error };
    }

    return data;
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
  const data = await getBlogs();
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
        description: blog.excerpt ? createPlainTextExcerpt(blog.excerpt) : '',
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
      {/* Structured Data for Blog Listing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />

      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Our Blog</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Latest insights, tutorials, and updates from our team
            </p>
          </div>

          {data.error ? (
            <div className="text-center py-12">
              <div className="bg-destructive/10 border border-destructive rounded-lg p-6 max-w-md mx-auto">
                <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Blogs</h2>
                <p className="text-muted-foreground mb-4">{data.error}</p>
                <p className="text-sm text-muted-foreground">Please try refreshing the page in your browser.</p>
              </div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4">No blog posts yet</h2>
              <p className="text-muted-foreground">Check back later for new content!</p>
            </div>
          ) : (
            <BlogsClient initialBlogs={blogs} />
          )}
        </div>
      </div>
    </>
  );
}