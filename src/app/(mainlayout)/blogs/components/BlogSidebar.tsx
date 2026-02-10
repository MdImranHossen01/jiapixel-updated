"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogSidebarProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blogs: any[];
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({
    blogs,
}) => {
    // 1. Get Popular Articles (Top 4 by views, fallback to sorted by date if no views)
    const popularArticles = useMemo(() => {
        // Clone to avoid mutating original array
        const sorted = [...blogs].sort((a, b) => (b.views || 0) - (a.views || 0));
        return sorted.slice(0, 4);
    }, [blogs]);

    // 3. Get Archive (Year-Month)
    const archives = useMemo(() => {
        const archiveMap = new Map<string, number>();
        blogs.forEach((blog) => {
            const date = new Date(blog.createdAt);
            const key = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
            archiveMap.set(key, (archiveMap.get(key) || 0) + 1);
        });
        return Array.from(archiveMap.entries()).slice(0, 5); // Limit to top 5 recent months
    }, [blogs]);

    return (
        <div className="space-y-8 sticky top-24">
            {/* Popular Articles Widget */}
            <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-primary" />
                    Popular Articles
                </h3>
                <div className="space-y-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {popularArticles.map((article: any) => (
                        <Link
                            key={article._id}
                            href={`/blogs/${article.slug}`}
                            className="group flex gap-4 items-start"
                        >
                            {article.featuredImage && (
                                <div className="relative w-20 h-16 shrink-0 rounded-md overflow-hidden bg-muted">
                                    <Image
                                        src={article.featuredImage}
                                        alt={article.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="80px"
                                    />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                    {article.title}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(article.createdAt).toLocaleDateString()} • {article.views || 0} views
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Archive Widget */}
            <div className="bg-card rounded-xl border-border p-4 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-primary" />
                    Archive
                </h3>
                <ul className="space-y-3">
                    {archives.map(([date, count]) => (
                        <li key={date} className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{date}</span>
                            <span className="text-xs bg-secondary px-2 py-1 rounded-full">{count}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* CTA Widget */}
            <div className="bg-primary/5 rounded-xl border border-primary/10 p-6 text-center">
                <h3 className="text-lg font-bold text-primary mb-2">Need a Website?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Get a custom quote for your next project in seconds.
                </p>
                <Link href="/estimate">
                    <Button className="w-full">Get Estimate</Button>
                </Link>
            </div>
        </div>
    );
};

export default BlogSidebar;
