/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import BlogsClient from "./BlogsClient";

async function getBlogs() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/blogs?limit=1000`, {
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
        <BlogsClient data={blogs} />
      )}
    </div>
  );
}
