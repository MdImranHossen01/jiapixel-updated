
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Folder, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WritingSidebarProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    writings: any[];
    selectedTag: string;
    onSelectTag: (tag: string) => void;
}

const WritingSidebar: React.FC<WritingSidebarProps> = ({
    writings,
    selectedTag,
    onSelectTag,
}) => {
    // 1. Get Popular Writings (Top 4 by views, fallback to sorted by date if no views)
    const popularWritings = useMemo(() => {
        // Clone to avoid mutating original array
        const sorted = [...writings].sort((a, b) => {
            const viewsDiff = (b.views || 0) - (a.views || 0);
            if (viewsDiff !== 0) return viewsDiff;
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
        return sorted.slice(0, 4);
    }, [writings]);

    // 2. Get Tags with counts
    const tags = useMemo(() => {
        const tagMap = new Map<string, number>();
        writings.forEach((writing) => {
            if (writing.tags && Array.isArray(writing.tags)) {
                writing.tags.forEach((tag: string) => {
                    tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
                });
            }
        });
        return Array.from(tagMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
    }, [writings]);

    // 3. Get Archive (Year-Month)
    const archives = useMemo(() => {
        const archiveMap = new Map<string, { count: number; dateValue: number }>();
        writings.forEach((writing) => {
            const date = new Date(writing.createdAt);
            const key = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
            const existing = archiveMap.get(key);
            if (existing) {
                existing.count += 1;
            } else {
                archiveMap.set(key, { count: 1, dateValue: date.getTime() });
            }
        });

        return Array.from(archiveMap.entries())
            .sort((a, b) => b[1].dateValue - a[1].dateValue)
            .slice(0, 5)
            .map(([date, data]) => [date, data.count] as [string, number]);
    }, [writings]);

    return (
        <div className="space-y-8 sticky top-24">
            {/* Popular Writings Widget */}
            <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-primary" />
                    Popular Writings
                </h3>
                <div className="space-y-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {popularWritings.map((writing: any) => (
                        <Link
                            key={writing._id}
                            href={`/writings/${writing.slug}`}
                            prefetch={false}
                            className="group flex gap-4 items-start"
                        >
                            {writing.featuredImage && (
                                <div className="relative w-20 h-16 shrink-0 rounded-md overflow-hidden bg-muted">
                                    <Image
                                        src={writing.featuredImage}
                                        alt={writing.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="80px"
                                    />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                    {writing.title}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(writing.createdAt).toLocaleDateString()} • {writing.views || 0} views
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>



            {/* Archive Widget */}
            <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
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

export default WritingSidebar;
