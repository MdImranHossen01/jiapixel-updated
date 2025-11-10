import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

async function getBlog(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/blogs/${slug}`, {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch blog');
    }
    
    return response.json();
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

export default async function BlogPostPage({ params }: PageProps) {
  // Await the params Promise in Next.js 16
  const { slug } = await params;
  const data = await getBlog(slug);
  
  if (!data || !data.blog) {
    notFound();
  }

  const { blog } = data;

  return (
    <div className="min-h-screen bg-background py-8">
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
                    Published on {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
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
    const response = await fetch(`${baseUrl}/api/blogs`);
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.blogs.map((blog: any) => ({
      slug: blog.slug,
    }));
  } catch (error) {
    return [];
  }
}