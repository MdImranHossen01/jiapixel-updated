"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import NewsletterHero from "./NewsletterHero";
import NewsletterSidebar from "./NewsletterSidebar";
import { Breadcrumb } from "@/components/ui/breadcrumb-custom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { extractTextFromProjectDescription } from "@/lib/utils";
import { GridSkeleton } from "@/components/CardSkeleton";

const ITEMS_PER_PAGE = 12;

const NewslettersClient: React.FC = () => {
    const [newsletters, setNewsletters] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchNewsletters = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch("/api/newsletters?limit=100");
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                if (data.success) {
                    setNewsletters(data.newsletters);
                } else {
                    throw new Error(data.message || "Failed to load newsletters");
                }
            } catch (err: any) {
                console.error("Error fetching newsletters:", err);
                setError(err.message || "An unexpected error occurred while fetching newsletters.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchNewsletters();
    }, []);

    // Filter newsletters based on search and tag
    const filteredNewsletters = useMemo(() => {
        return newsletters.filter((newsletter) => {
            const matchesSearch = searchQuery.trim()
                ? newsletter.title?.toLowerCase().includes(searchQuery.toLowerCase().trim())
                : true;

            const matchesTag = selectedTag === "All" || (newsletter.tags && newsletter.tags.includes(selectedTag));

            return matchesSearch && matchesTag;
        });
    }, [newsletters, searchQuery, selectedTag]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredNewsletters.length / ITEMS_PER_PAGE);
    const paginatedNewsletters = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredNewsletters.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredNewsletters, currentPage]);

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
            <NewsletterHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <div className="container mx-auto px-4 pb-20">
                <Breadcrumb items={[{ label: "Newsletters" }]} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content (List) */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">
                                {selectedTag === "All" ? "Latest Newsletters" : `${selectedTag} Newsletters`}
                            </h2>
                            {!isLoading && (
                                <span className="text-muted-foreground text-sm">
                                    Showing {paginatedNewsletters.length} of {filteredNewsletters.length} result{filteredNewsletters.length !== 1 && 's'}
                                </span>
                            )}
                        </div>

                        {isLoading ? (
                            <GridSkeleton count={6} />
                        ) : error ? (
                            /* Error State */
                            <div className="text-center py-16 bg-red-50/50 rounded-xl border border-red-100 border-dashed">
                                <div className="max-w-md mx-auto">
                                    <div className="text-6xl mb-4">⚠️</div>
                                    <h3 className="text-2xl font-bold text-red-900 mb-2">
                                        Something went wrong
                                    </h3>
                                    <p className="text-red-700/80 mb-6">
                                        {error}
                                    </p>
                                    <Button
                                        onClick={() => window.location.reload()}
                                        className="bg-red-600 text-white hover:bg-red-700"
                                    >
                                        Try again
                                    </Button>
                                </div>
                            </div>
                        ) : paginatedNewsletters.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {paginatedNewsletters.map((newsletter: any) => (
                                        <Card key={newsletter._id} className="h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
                                            {newsletter.featuredImage && (
                                                <div className="relative w-full aspect-video overflow-hidden rounded-t-xl">
                                                    <Image
                                                        src={newsletter.featuredImage}
                                                        alt={newsletter.title}
                                                        fill
                                                        className="object-cover hover:scale-105 transition-transform duration-500"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    />
                                                </div>
                                            )}
                                            <CardContent className="flex-1 p-6 flex flex-col">
                                                <div className="mb-4 flex flex-wrap gap-2">
                                                    {newsletter.tags && newsletter.tags.slice(0, 3).map((tag: string) => (
                                                        <Badge key={tag} variant="secondary" className="text-xs font-normal">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                                    <Link href={`/newsletters/${newsletter.slug}`} prefetch={false}>
                                                        {newsletter.title}
                                                    </Link>
                                                </h3>
                                                <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                                                    {newsletter.seoDescription || (newsletter.content ? extractTextFromProjectDescription(newsletter.content).substring(0, 150) : "") + "..."}
                                                </p>
                                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(newsletter.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <Link href={`/newsletters/${newsletter.slug}`} className="text-primary text-sm font-medium hover:underline" prefetch={false}>
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
                                        No matching newsletters found
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
                        <NewsletterSidebar
                            newsletters={newsletters}
                            selectedTag={selectedTag}
                            onSelectTag={setSelectedTag}
                        />
                    </aside>
                </div>
            </div>
        </>
    );
};

export default NewslettersClient;
