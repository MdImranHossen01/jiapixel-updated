import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

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
        <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
        <Link
          href="/dashboard/blogs/create"
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Create New Blog
        </Link>
      </div>
      
      {data.error ? (
        <div className="bg-destructive/10 border border-destructive rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2 text-destructive">Error</h2>
          <p className="text-muted-foreground">{data.error}</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-card rounded-lg shadow p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">Your Blogs</h2>
          <p className="text-muted-foreground">No blogs yet. Create your first blog post!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-card-foreground">
              Your Blogs ({blogs.length})
            </h2>
          </div>
          
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

// Blog Card Component
function BlogCard({ blog }: { blog: any }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-yellow-100 text-yellow-800', label: 'Draft' },
      published: { color: 'bg-green-100 text-green-800', label: 'Published' },
      archived: { color: 'bg-gray-100 text-gray-800', label: 'Archived' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-card rounded-lg shadow border border-border p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            {blog.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {blog.excerpt || 'No excerpt provided'}
          </p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          {getStatusBadge(blog.status)}
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="capitalize">{blog.category}</span>
          <span>•</span>
          <span>{blog.readTime} min read</span>
          <span>•</span>
          <span>{blog.views} views</span>
          <span>•</span>
          <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link
            href={`/blogs/${blog.slug}`}
            target="_blank"
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            View
          </Link>
          <span className="text-border">|</span>
          <Link
            href={`/dashboard/blogs/edit/${blog.slug}`}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Edit
          </Link>
          <span className="text-border">|</span>
          <button className="text-sm text-destructive hover:text-destructive/80 font-medium">
            Delete
          </button>
        </div>
      </div>
      
      {blog.tags && blog.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {blog.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="inline-block bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}