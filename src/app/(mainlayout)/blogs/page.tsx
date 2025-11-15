/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

async function getBlogs() {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com'
      : 'http://localhost:3000';
    
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
        description: blog.excerpt,
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog: any) => (
                <article 
                  key={blog._id} 
                  className="bg-card rounded-lg shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow duration-300 group"
                >
                  {blog.featuredImage && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={blog.featuredImage}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {blog.category}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {blog.readTime} min read
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-card-foreground mb-3 line-clamp-2">
                      <Link 
                        href={`/blogs/${blog.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {blog.title}
                      </Link>
                    </h2>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
                      </div>
                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}