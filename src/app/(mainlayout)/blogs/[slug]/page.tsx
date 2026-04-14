import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import ReadOnlyEditor from '@/components/tiptap-templates/simple/read-only-editor';
import { SocialShare } from '@/components/blog/SocialShare';
import BlogCard from '@/app/(mainlayout)/components/BlogSection/BlogCard';
import CompactServiceCard from '@/components/CompactServiceCard';
import CompactBlogCard from '@/components/CompactBlogCard';
import BlogAdminActions from '@/components/BlogAdminActions';



import { getBlogBySlug, getBlogs } from '@/lib/db-utils';

async function getBlog(slug: string) {
  return await getBlogBySlug(slug);
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
  const plainTextDescription = blog.seoDescription ||
    blog.content?.replace(/<[^>]*>/g, "").substring(0, 160) ||
    `Read ${blog.title} on Jiapixel blog.`;

  const plainTextTitle = blog.seoTitle || (blog.title.length > 60
    ? `${blog.title.substring(0, 57)}`
    : `${blog.title}`);

  return {
    title: plainTextTitle,
    description: plainTextDescription,
    keywords: `web development, digital marketing, ${blog.title}`,

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

  let relatedBlogs = [];
  if (blog.relatedBlogs && blog.relatedBlogs.length > 0) {
    relatedBlogs = blog.relatedBlogs;
  }

  let services = [];
  if (blog.relatedServices && blog.relatedServices.length > 0) {
    services = blog.relatedServices;
  }

  // Generate structured data for individual blog post
  const blogStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.seoDescription || blog.content?.replace(/<[^>]*>/g, "").substring(0, 160) || '',
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
    }
  };

  return (
    <>
      {/* Structured Data for Blog Post */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData).replace(/</g, '\\u003c') }}
      />

      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <nav>
              <Link
                href="/blogs"
                prefetch={false}
                className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center space-x-2"
              >
                <span>←</span>
                <span>Back to Blogs</span>
              </Link>
            </nav>
            {/* Admin Actions */}
            <BlogAdminActions
              blogSlug={blog.slug}
              blogTitle={blog.title}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-8">
              <article className="border rounded-lg p-8 h-full">
                <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8 border-b">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(blog.createdAt).toLocaleDateString()} • {blog.readTime || 5} min read
                    </p>
                  </div>
                  <SocialShare title={blog.title} url={`https://www.jiapixel.com/blogs/${blog.slug}`} />
                </div>

                <ReadOnlyEditor content={blog.content} />
              </article>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              {/* Related Services Widget */}
              <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  {/* Simple SVG Icon for Services */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                  <h2 className="text-lg font-bold">Related Services</h2>
                </div>

                {services.filter((s: any) => s).length > 0 ? (
                  <div className="flex flex-col">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {services.filter((s: any) => s).map((service: any) => (
                      <div key={service?._id || Math.random()} className="border-b border-border last:border-0">
                        <CompactServiceCard service={service} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-sm text-muted-foreground bg-accent/30 rounded-lg">
                    No services found.
                  </div>
                )}
              </div>

              {/* Related Blogs Widget */}
              {relatedBlogs.filter((b: any) => b).length > 0 && (
                <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-6">
                    {/* Simple SVG Icon for Blogs/Trending */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                    <h2 className="text-lg font-bold">You might also like</h2>
                  </div>

                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <div className="flex flex-col">
                    {relatedBlogs.filter((b: any) => b).map((related: any) => (
                      <div key={related?._id || Math.random()} className="border-b border-border last:border-0">
                        <CompactBlogCard blog={related} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  try {
    const blogs = await getBlogs();
    return blogs.map((blog: any) => ({
      slug: blog.slug,
    }));
  } catch (error) {
    return [];
  }
}