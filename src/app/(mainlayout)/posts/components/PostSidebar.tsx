
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Folder, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostSidebarProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    posts: any[];
    selectedTag: string;
    onSelectTag: (tag: string) => void;
}

const PostSidebar: React.FC<PostSidebarProps> = ({
    posts,
    selectedTag,
    onSelectTag,
}) => {
    // 1. Get Popular Posts (Top 4 by views, fallback to sorted by date if no views)
    const popularPosts = useMemo(() => {
        // Clone to avoid mutating original array
        const sorted = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0));
        return sorted.slice(0, 4);
    }, [posts]);

    // 2. Get Tags with counts
    const tags = useMemo(() => {
        const tagMap = new Map<string, number>();
        posts.forEach((post) => {
            if (post.tags && Array.isArray(post.tags)) {
                post.tags.forEach((tag: string) => {
                    tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
                });
            }
        });
        return Array.from(tagMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
    }, [posts]);

    // 3. Get Archive (Year-Month)
    const archives = useMemo(() => {
        const archiveMap = new Map<string, number>();
        posts.forEach((post) => {
            const date = new Date(post.createdAt);
            const key = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
            archiveMap.set(key, (archiveMap.get(key) || 0) + 1);
        });
        return Array.from(archiveMap.entries()).slice(0, 5); // Limit to top 5 recent months
    }, [posts]);

    return (
        <div className="space-y-8 sticky top-24">
            {/* Popular Posts Widget */}
            <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-primary" />
                    Popular Posts
                </h3>
                <div className="space-y-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {popularPosts.map((post: any) => (
                        <Link
                            key={post._id}
                            href={`/posts/${post.slug}`}
                            prefetch={false}
                            className="group flex gap-4 items-start"
                        >
                            {post.featuredImage && (
                                <div className="relative w-20 h-16 shrink-0 rounded-md overflow-hidden bg-muted">
                                    <Image
                                        src={post.featuredImage}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="80px"
                                    />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                    {post.title}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(post.createdAt).toLocaleDateString()} • {post.views || 0} views
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Tags Widget */}
            <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Folder size={18} className="text-primary" />
                    Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => onSelectTag("All")}
                        className={`text-xs px-3 py-1 rounded-full transition-colors border ${selectedTag === "All"
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-muted-foreground border-border hover:bg-accent"
                            }`}
                    >
                        All
                    </button>
                    {tags.map(([tag, count]) => (
                        <button
                            key={tag}
                            onClick={() => onSelectTag(tag)}
                            className={`text-xs px-3 py-1 rounded-full transition-colors border ${selectedTag === tag
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background text-muted-foreground border-border hover:bg-accent"
                                }`}
                        >
                            {tag} ({count})
                        </button>
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
                <h3 className="text-lg font-bold text-primary mb-2">Subscribe Today!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Get the latest updates directly to your inbox.
                </p>
                <Link href="/contact" prefetch={false}>
                    <Button className="w-full">Contact Us</Button>
                </Link>
            </div>
        </div>
    );
};

export default PostSidebar;
