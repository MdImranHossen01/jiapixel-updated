import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import ReadOnlyEditor from '@/components/tiptap-templates/simple/read-only-editor';
import { SocialShare } from '@/components/blog/SocialShare';
import BlogCard from '@/app/(mainlayout)/components/BlogSection/BlogCard';

async function getRelatedBlogs(category: string, currentSlug: string) {
  try {
    const baseUrl = process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com'
      : 'http://localhost:3000';

    // Ideally this should be a specific API endpoint, but fetching all and filtering works for small scale
    const response = await fetch(`${baseUrl}/api/blogs`, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) return [];

    const data = await response.json();
    const allBlogs = data.blogs || [];

    return allBlogs
      .filter((b: any) => b.category === category && b.slug !== currentSlug)
      .slice(0, 3);
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    return [];
  }
}

async function getBlog(slug: string) {
  try {
    const baseUrl = process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com'
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/blogs/${slug}`, {
      cache: 'force-cache'
    } as RequestInit);

    if (!response.ok) {
      if (response.status === 404) return null;
      console.error('Error fetching blog:', response.status);
      return null;
    }

    const data = await response.json();
    return data.blog || null;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: 'Blog Post Not Found - Jiapixel',
    };
  }

  const baseUrl = 'https://www.jiapixel.com';
  const canonicalUrl = `${baseUrl}/blogs/${blog.slug}`;

  // Create plain text descriptions
  const plainTextDescription = blog.excerpt ||
    blog.content?.replace(/<[^>]*>/g, "").substring(0, 160) ||
    `Read ${blog.title} on Jiapixel blog.`;

  const plainTextTitle = blog.title.length > 60
    ? `${blog.title.substring(0, 57)}`
    : `${blog.title}`;

  return {
    title: plainTextTitle,
    description: plainTextDescription,
    keywords: blog.tags?.join(', ') || `${blog.category}, web development, digital marketing`,

    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },

    // Open Graph
    openGraph: {
      title: plainTextTitle,
      description: plainTextDescription,
      url: canonicalUrl,
      siteName: 'Jiapixel',
      images: [
        {
          url: blog.featuredImage || 'https://www.jiapixel.com/icon.png',
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: blog.publishedAt || blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.authorName || 'Md Imran Hossen'],
      tags: blog.tags || [],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: plainTextTitle,
      description: plainTextDescription,
      images: [blog.featuredImage || 'https://www.jiapixel.com/icon.png'],
      creator: '@jiapixel',
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  const relatedBlogs = await getRelatedBlogs(blog.category, slug);

  if (!blog) {
    notFound();
  }

  // Generate structured data for individual blog post
  const blogStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.featuredImage || 'https://www.jiapixel.com/icon.png',
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
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.jiapixel.com/blogs/${blog.slug}`
    },
    articleSection: blog.category,
    keywords: blog.tags?.join(', ')
  };

  return (
    <>
      {/* Structured Data for Blog Post */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />

      <div className="min-h-screen  py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <nav className="mb-8">
            <Link
              href="/blogs"
              className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back to Blogs</span>
            </Link>
          </nav>

          <article className="border rounded-lg p-8">
            <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8 border-b">
              <div>
                <p className="text-sm text-muted-foreground">
                  {new Date(blog.createdAt).toLocaleDateString()} • {blog.readTime || 5} min read
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {blog.category}
                  </span>
                </div>
              </div>
              <SocialShare title={blog.title} url={`https://www.jiapixel.com/blogs/${blog.slug}`} />
            </div>

            <ReadOnlyEditor content={blog.content} />
          </article>

          {/* Related Blogs Section */}
          {relatedBlogs.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">You might also like</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {relatedBlogs.map((related: any) => (
                  <BlogCard key={related._id} blog={related} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Generate static params for better performance
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com'
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/blogs`, {
      cache: 'force-cache'
    } as RequestInit);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.blogs?.map((blog: any) => ({
      slug: blog.slug,
    })) || [];
  } catch (error) {
    return [];
  }
}