import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

async function getBlogs() {
  try {
    // Use relative URL for API calls in the same app
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/blogs`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    
    if (!response.ok) {
      console.error('API response not OK:', response.status, response.statusText);
      return { blogs: [], error: `Failed to fetch blogs: ${response.status}` };
    }
    
    const data = await response.json();
    
    if (!data.success) {
      console.error('API returned error:', data.error);
      return { blogs: [], error: data.error };
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return { 
      blogs: [], 
      error: error instanceof Error ? error.message : 'Failed to fetch blogs' 
    };
  }
}

export default async function BlogsPage() {
  const data = await getBlogs();
  const blogs = data.blogs || [];

  return (
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
              <button 
                onClick={() => window.location.reload()}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
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
  );
}