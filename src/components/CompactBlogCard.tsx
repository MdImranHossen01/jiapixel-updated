"use client";

import Image from "next/image";
import Link from "next/link";
import { formatBlogDate } from '@/lib/utils';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function CompactBlogCard({ blog }: { blog: any }) {
    // Use a fallback image if strictly needed, or handle empty image visually
    const imageSrc = blog.featuredImage || '/icon.png';

    return (
        <Link href={`/blogs/${blog.slug}`} className="group block">
            <div className="flex items-start gap-4 py-3 hover:bg-accent/50 rounded-lg transition-colors">
                {/* IMAGE */}
                <div className="relative w-20 h-16 shrink-0 overflow-hidden rounded-md border border-border mt-1">
                    <Image
                        src={imageSrc}
                        alt={blog.title || 'Blog post thumbnail'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="80px"
                    />                </div>

                {/* CONTENT */}
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-1">
                        {blog.title}
                    </h3>
                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                        <span>{formatBlogDate(blog.publishedAt || blog.createdAt)}</span>
                        {blog.views > 0 && (
                            <>
                                <span>•</span>
                                <span>{blog.views} views</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
