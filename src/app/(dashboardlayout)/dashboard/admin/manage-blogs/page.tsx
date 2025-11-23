/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { deleteBlog } from "@/app/actions/blog-actions";

async function getBlogs() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/blogs`, {
      cache: "no-store", // Don't cache for dashboard
    });

    if (!response.ok) {
      throw new Error("Failed to fetch blogs");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return { blogs: [], error: "Failed to load blogs" };
  }
}

export default async function DashboardBlogsPage() {
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated
  if (!session) {
    redirect("/login");
  }

  const data = await getBlogs();
  const blogs = data.blogs || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Blog Management
          </h1>
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
              <h2 className="text-xl font-semibold mb-2 text-destructive">
                Error
              </h2>
              <p className="text-muted-foreground">{data.error}</p>
            </div>
          </CardContent>
        </Card>
      ) : blogs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">
                No Blogs Yet
              </h2>
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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: {
        variant: "secondary" as const,
        label: "Draft",
      },
      published: {
        variant: "default" as const,
        label: "Published",
      },
      archived: {
        variant: "outline" as const,
        label: "Archived",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Delete action handler
  async function handleDelete(formData: FormData) {
    "use server";
    const slug = formData.get("slug") as string;
    const title = formData.get("title") as string;

    if (
      !confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    const result = await deleteBlog(slug);

    if (result.success) {
      // Revalidate the page or redirect
      redirect("/dashboard/admin/manage-blogs?deleted=true");
    } else {
      alert(result.error || "Failed to delete blog");
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
              </div>
              <div className="flex-shrink-0">{getStatusBadge(blog.status)}</div>
            </div>
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

          </div>
        </div>
      </CardContent>
    </Card>
  );
}
