/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const BASE_URL = "https://www.jiapixel.com";

// --- ডেটা ফেচিং ফাংশন ---
async function getBlog(slug: string) {
  try {
    // Server-side fetching should use internal API URL if available
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${apiUrl}/api/blogs/${slug}`, {
      cache: 'force-cache'
    });

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
  params: {
    slug: string;
  };
}

// --- ১. ডাইনামিক মেটাডাটা জেনারেশন (SEO) ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const blog = await getBlog(params.slug);

  if (!blog) {
    return {}; 
  }

  const blogUrl = `${BASE_URL}/blogs/${blog.slug}`;
  const description = blog.summary ? blog.summary.substring(0, 160) : blog.title;
  const featuredImageUrl = blog.featuredImage || `${BASE_URL}/og-default.png`;


  return {
    title: blog.title,
    description: description,
    
    // ক্যানোনিক্যাল লিংক (Self-Referencing)
    alternates: {
      canonical: blogUrl,
    },
    
    // ওপেন গ্রাফ (OG) ট্যাগস
    openGraph: {
      type: 'article',
      url: blogUrl,
      title: blog.title,
      description: description,
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt || blog.publishedAt,
      images: [
        {
          url: featuredImageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    
    // টুইটার কার্ড ট্যাগস
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: description,
      images: [featuredImageUrl],
    },
    
    // Robots (Layout-এর থেকে Inherit করবে, কিন্তু এখানে আমরা নিশ্চিত করছি)
    robots: {
      index: true,
      follow: true,
    }
  };
}


export default async function BlogDetailsPage({ params }: PageProps) {
  const { slug } = params;
  const blog = await getBlog(slug); 
  
  if (!blog) {
    notFound();
  }

  // ডেট ফরম্যাটিং
  const publishedDate = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
  });
  const updatedDate = blog.updatedAt 
    ? new Date(blog.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : publishedDate;


  // --- ২. JSON-LD BlogPosting Schema (Structured Data) ---
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blogs/${blog.slug}`
    },
    "headline": blog.title,
    "description": blog.summary,
    "image": blog.featuredImage ? [`${blog.featuredImage}`] : [],
    "author": {
      "@type": "Person",
      "name": blog.authorName || "Jia Pixel Team",
      "url": BASE_URL // Author page URL can be added here if available
    },
    "publisher": {
      "@type": "Organization",
      "name": "Jia Pixel",
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/icon.png`
      }
    },
    "datePublished": blog.publishedAt || blog.createdAt,
    "dateModified": blog.updatedAt || blog.createdAt,
    "keywords": blog.tags?.join(', ')
  };


  return (
    <div className="min-h-screen bg-background py-8">
      {/* স্কিমা ইনজেকশন */}
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />

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

        <article className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
          {blog.featuredImage && (
            <div className="relative h-64 md:h-96 overflow-hidden">
              <Image
                src={blog.featuredImage}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority
              />
            </div>
          )}
          
          <div className="p-8">
            <header className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {blog.category}
                </span>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>{blog.readTime} min read</span>
                  <span>•</span>
                  <span>{blog.views} views</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4 leading-tight">
                {blog.title}
              </h1>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {blog.authorName && (
                    <span className="mr-4">By {blog.authorName}</span>
                  )}
                  <span>
                    Published on {publishedDate}
                    {blog.updatedAt && (
                        <span className="ml-2">(Updated: {updatedDate})</span>
                    )}
                  </span>
                </div>
              </div>
            </header>

            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div 
              className="prose prose-lg max-w-none text-card-foreground"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}

// Generate static params for better performance
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/blogs`, {
      cache: 'force-cache'
    });
    
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