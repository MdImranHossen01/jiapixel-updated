"use client";

import React, { useState, useMemo } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Helper function to safely format dates
function formatBlogDate(dateString?: string): string {
    if (!dateString) {
        return 'Recently';
    }

    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return 'Recently';
    }
}

// Helper function to create plain text excerpt from HTML
function createPlainTextExcerpt(html: string, maxLength: number = 150): string {
    if (!html) return '';

    // Remove HTML tags and trim
    const plainText = html.replace(/<[^>]*>/g, '').trim();

    // Return truncated text with ellipsis if needed
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + '...';
}

interface BlogsClientProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialBlogs: any[];
}

const BlogsClient: React.FC<BlogsClientProps> = ({ initialBlogs }) => {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter blogs based on search
    const filteredBlogs = useMemo(() => {
        return initialBlogs.filter((blog) => {
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase().trim();

                return blog.title?.toLowerCase().includes(query);
            }

            return true;
        });
    }, [initialBlogs, searchQuery]);

    return (
        <div className="space-y-8">
            {/* Search Control */}
            <div className="flex justify-center mb-8">
                <div className="relative w-full max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-12 py-4 border border-border rounded-full bg-card shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-lg placeholder:text-muted-foreground/70"
                        placeholder="Search blogs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Results Count */}
            {searchQuery && (
                <div className="text-muted-foreground text-sm text-center">
                    Found {filteredBlogs.length} article{filteredBlogs.length !== 1 && 's'}
                </div>
            )}

            {/* Blogs Grid */}
            {filteredBlogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {filteredBlogs.map((blog: any) => (
                        <article
                            key={blog._id}
                            className="bg-card rounded-lg shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow duration-300 group"
                        >
                            {blog.featuredImage && (
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={blog.featuredImage}
                                        alt={blog.title || 'Blog post image'}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                        {blog.category || 'Uncategorized'}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {blog.readTime || 5} min read
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold text-card-foreground mb-3 line-clamp-2">
                                    <Link
                                        href={`/blogs/${blog.slug}`}
                                        className="hover:text-primary transition-colors"
                                    >
                                        {blog.title || 'Untitled Blog Post'}
                                    </Link>
                                </h2>

                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        {formatBlogDate(blog.publishedAt || blog.createdAt)}
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
            ) : (
                /* Empty State */
                <div className="text-center py-16 bg-card/50 rounded-xl border border-border/50 border-dashed">
                    <div className="max-w-md mx-auto">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">
                            No matching articles found
                        </h3>
                        <p className="text-muted-foreground">
                            Try adjusting your search terms.
                        </p>
                        <Button
                            variant="link"
                            onClick={() => setSearchQuery("")}
                            className="mt-4"
                        >
                            Clear search
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogsClient;
