
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import WritingHero from "./WritingHero";
import WritingSidebar from "./WritingSidebar";
import WritingCard from "./WritingCard";
import { Breadcrumb } from "@/components/ui/breadcrumb-custom";

interface WritingsClientProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialWritings: any[];
}

const ITEMS_PER_PAGE = 12;

const WritingsClient: React.FC<WritingsClientProps> = ({ initialWritings }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState(1);

    // Filter writings based on search and tag
    const filteredWritings = useMemo(() => {
        return initialWritings.filter((writing) => {
            const matchesSearch = searchQuery.trim()
                ? writing.title?.toLowerCase().includes(searchQuery.toLowerCase().trim())
                : true;

            const matchesTag = selectedTag === "All" || (writing.tags && writing.tags.includes(selectedTag));

            return matchesSearch && matchesTag;
        });
    }, [initialWritings, searchQuery, selectedTag]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredWritings.length / ITEMS_PER_PAGE);
    const paginatedWritings = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredWritings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredWritings, currentPage]);

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
            <WritingHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <div className="container mx-auto px-4 pb-20">
                <Breadcrumb items={[{ label: "Writings" }]} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content (List) */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">
                                Latest Writings
                            </h2>
                            <span className="text-muted-foreground text-sm">
                                Showing {paginatedWritings.length} of {filteredWritings.length} result{filteredWritings.length !== 1 && 's'}
                            </span>
                        </div>

                        {paginatedWritings.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {paginatedWritings.map((writing: any) => (
                                        <WritingCard key={writing._id} writing={writing} />
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
                                        No matching writings found
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
                        <WritingSidebar
                            writings={initialWritings}
                            selectedTag={selectedTag}
                            onSelectTag={setSelectedTag}
                        />
                    </aside>
                </div>
            </div>
        </>
    );
};

export default WritingsClient;
