"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatBlogDate } from '@/lib/utils';
import { useSession } from "next-auth/react";
import { MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Blog {
    _id: string;
    title: string;
    slug: string;
    featuredImage?: string;
    category?: string;
    readTime?: number;
    publishedAt?: string;
    createdAt?: string;
}

interface BlogCardProps {
    blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const isAdmin = session?.user?.role === "admin";

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm(`Are you sure you want to delete "${blog.title}"?`)) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/blogs/${blog.slug}`, {
                method: "DELETE",
            });

            if (response.ok) {
                router.refresh();
            } else {
                alert("Failed to delete blog");
            }
        } catch (error) {
            console.error("Error deleting blog:", error);
            alert("Error deleting blog");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <article
            className="bg-card rounded-sm lg:rounded-md shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow duration-300 group h-full flex flex-col relative"
        >
            {blog.featuredImage && (
                <div className="relative h-48 overflow-hidden shrink-0">
                    <Image
                        src={blog.featuredImage}
                        alt={blog.title || 'Blog post image'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            )}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">
                        {blog.readTime || 5} min read
                    </span>
                </div>

                <h2 className="font-bold text-card-foreground mb- line-clamp-2">
                    <Link
                        href={`/blogs/${blog.slug}`}
                        className="hover:text-primary transition-colors"
                        prefetch={false}
                    >
                        {blog.title || 'Untitled Blog Post'}
                    </Link>
                </h2>
                <div className="text-sm text-muted-foreground">
                    {formatBlogDate(blog.publishedAt || blog.createdAt)}
                </div>

                <div className="mt-auto flex items-center justify-end pt-4 border-t border-border">
                    <Link
                        href={`/blogs/${blog.slug}`}
                        className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                        prefetch={false}
                    >
                        Read More →
                    </Link>
                </div>
            </div>

            {/* Admin Actions - 3 Dot Menu */}
            {isAdmin && (
                <div className="absolute top-2 right-2 z-10">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-background/80"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-0 shadow-lg">
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    router.push(`/blogs/${blog.slug}`);
                                }}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    router.push(`/dashboard/admin/manage-blogs/edit/${blog.slug}`);
                                }}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {isDeleting ? "Deleting..." : "Delete"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </article>
    );
};

export default BlogCard;
