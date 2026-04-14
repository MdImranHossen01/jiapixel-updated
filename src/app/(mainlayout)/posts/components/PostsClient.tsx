
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import PostHero from "./PostHero";
import PostSidebar from "./PostSidebar";
import { Breadcrumb } from "@/components/ui/breadcrumb-custom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { extractTextFromProjectDescription } from "@/lib/utils";

interface PostsClientProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialPosts: any[];
}

const ITEMS_PER_PAGE = 12;

const PostsClient: React.FC<PostsClientProps> = ({ initialPosts }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState(1);

    // Filter posts based on search and tag
    const filteredPosts = useMemo(() => {
        return initialPosts.filter((post) => {
            const matchesSearch = searchQuery.trim()
                ? post.title?.toLowerCase().includes(searchQuery.toLowerCase().trim())
                : true;

            const matchesTag = selectedTag === "All" || (post.tags && post.tags.includes(selectedTag));

            return matchesSearch && matchesTag;
        });
    }, [initialPosts, searchQuery, selectedTag]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
    const paginatedPosts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredPosts, currentPage]);

    // Reset pagination when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedTag]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <PostHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <div className="container mx-auto px-4 pb-20">
                <Breadcrumb items={[{ label: "Posts" }]} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content (List) */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">
                                {selectedTag === "All" ? "Latest Posts" : `${selectedTag} Posts`}
                            </h2>
                            <span className="text-muted-foreground text-sm">
                                Showing {paginatedPosts.length} of {filteredPosts.length} result{filteredPosts.length !== 1 && 's'}
                            </span>
                        </div>

                        {paginatedPosts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {paginatedPosts.map((post: any) => (
                                        <Card key={post._id} className="h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
                                            {post.featuredImage && (
                                                <div className="relative w-full aspect-video overflow-hidden rounded-t-xl">
                                                    <Image
                                                        src={post.featuredImage}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover hover:scale-105 transition-transform duration-500"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    />
                                                </div>
                                            )}
                                            <CardContent className="flex-1 p-6 flex flex-col">
                                                <div className="mb-4 flex flex-wrap gap-2">
                                                    {post.tags && post.tags.slice(0, 3).map((tag: string) => (
                                                        <Badge key={tag} variant="secondary" className="text-xs font-normal">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                                    <Link href={`/posts/${post.slug}`} prefetch={false}>
                                                        {post.title}
                                                    </Link>
                                                </h3>
                                                <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                                                    {post.seoDescription || (post.content ? extractTextFromProjectDescription(post.content).substring(0, 150) : "") + "..."}
                                                </p>
                                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(post.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <Link href={`/posts/${post.slug}`} className="text-primary text-sm font-medium hover:underline" prefetch={false}>
                                                        Read More &rarr;
                                                    </Link>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-12">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handlePageChange(page)}
                                                className="w-8 h-8 p-0"
                                            >
                                                {page}
                                            </Button>
                                        ))}

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Empty State */
                            <div className="text-center py-16 bg-card/50 rounded-xl border border-border/50 border-dashed">
                                <div className="max-w-md mx-auto">
                                    <div className="text-6xl mb-4">📝</div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2">
                                        No matching posts found
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Try adjusting your search terms or filters.
                                    </p>
                                    <Button
                                        variant="link"
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSelectedTag("All");
                                        }}
                                        className="mt-4"
                                    >
                                        Clear filters
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4">
                        <PostSidebar
                            posts={initialPosts}
                            selectedTag={selectedTag}
                            onSelectTag={setSelectedTag}
                        />
                    </aside>
                </div>
            </div>
        </>
    );
};

export default PostsClient;
