/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { deleteBlog } from '@/app/actions/blog-actions';
import RichTextRenderer from '@/components/RichTextRenderer';

async function getBlogs() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/blogs`, {
      cache: 'no-store', // Don't cache for dashboard
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return { blogs: [], error: 'Failed to load blogs' };
  }
}

export default async function DashboardBlogsPage() {
  const session = await getServerSession(authOptions);
  
  // Redirect if not authenticated
  if (!session) {
    redirect('/login');
  }

  const data = await getBlogs();
  const blogs = data.blogs || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
          <p className="text-muted-foreground mt-2">
            Create, edit, and manage your blog posts
          </p>
        </div>
        <Link href="/dashboard/admin/manage-blogs/create">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Create New Blog
          </Button>
        </Link>
      </div>
      
      {data.error ? (
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2 text-destructive">Error</h2>
              <p className="text-muted-foreground">{data.error}</p>
            </div>
          </CardContent>
        </Card>
      ) : blogs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">No Blogs Yet</h2>
              <p className="text-muted-foreground mb-6">
                Create your first blog post to get started
              </p>
              <Link href="/dashboard/admin/manage-blogs/create">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Create Your First Blog
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground">
                Your Blogs ({blogs.length})
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage all your blog posts from one place
              </CardDescription>
            </CardHeader>
          </Card>
          
          <div className="grid gap-6">
            {blogs.map((blog: any) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Blog Card Component - Server Component
async function BlogCard({ blog }: { blog: any }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { 
        variant: 'secondary' as const, 
        label: 'Draft' 
      },
      published: { 
        variant: 'default' as const, 
        label: 'Published' 
      },
      archived: { 
        variant: 'outline' as const, 
        label: 'Archived' 
      },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  // Function to generate excerpt from content if no excerpt is provided
  const generateExcerpt = (content: string, maxLength: number = 150) => {
    if (!content) return 'No content available';
    
    // Remove HTML tags and get plain text
    const plainText = content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
    
    // Truncate to max length
    if (plainText.length <= maxLength) return plainText;
    
    return plainText.substring(0, maxLength) + '...';
  };

  // Function to check if content contains images
  const hasImages = (content: string) => {
    return content && content.includes('<img');
  };

  // Get the excerpt or generate one from content
  const displayExcerpt = blog.excerpt || generateExcerpt(blog.content);

  // Delete action handler
  async function handleDelete(formData: FormData) {
    'use server';
    const slug = formData.get('slug') as string;
    const title = formData.get('title') as string;
    
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    const result = await deleteBlog(slug);
    
    if (result.success) {
      // Revalidate the page or redirect
      redirect('/dashboard/admin/manage-blogs?deleted=true');
    } else {
      alert(result.error || 'Failed to delete blog');
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                
                {/* Use RichTextRenderer for excerpt with max lines */}
                <div className="text-muted-foreground text-sm mb-3">
                  <RichTextRenderer 
                    content={displayExcerpt}
                    maxLines={2}
                    className="text-sm text-muted-foreground"
                  />
                </div>

                {/* Show image indicator if content has images */}
                {hasImages(blog.content) && (
                  <div className="flex items-center gap-1 mb-2">
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      className="text-muted-foreground"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span className="text-xs text-muted-foreground">Contains images</span>
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                {getStatusBadge(blog.status)}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="capitalize bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
                {blog.category}
              </span>
              <span>•</span>
              <span>{blog.readTime || 0} min read</span>
              <span>•</span>
              <span>{blog.views || 0} views</span>
              <span>•</span>
              <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {blog.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-block bg-muted text-muted-foreground px-2 py-1 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 lg:flex-col lg:items-end">
            <div className="flex items-center gap-2 text-sm">
              <Link
                href={`/blogs/${blog.slug}`}
                target="_blank"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                View
              </Link>
              <span className="text-border">|</span>
              <Link
                href={`/dashboard/admin/manage-blogs/edit/${blog.slug}`}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Edit
              </Link>
              <span className="text-border">|</span>
              <form action={handleDelete}>
                <input type="hidden" name="slug" value={blog.slug} />
                <input type="hidden" name="title" value={blog.title} />
                <button 
                  type="submit"
                  className="text-destructive hover:text-destructive/80 font-medium transition-colors"
                >
                  Delete
                </button>
              </form>
            </div>
            
            {blog.authorName && (
              <div className="text-xs text-muted-foreground lg:text-right">
                By {blog.authorName}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}