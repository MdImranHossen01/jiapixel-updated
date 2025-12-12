/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import ReadOnlyEditor from '@/components/tiptap-templates/simple/read-only-editor';

async function getBlog(slug: string) {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com'
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/blogs/${slug}`, {
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
        <p className="text-sm text-slate-500 mb-8">
          {new Date(blog.createdAt).toLocaleDateString()}
        </p>
        <ReadOnlyEditor content={blog.content} />
      </article>
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