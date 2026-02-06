"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import BlogCard from '../../components/BlogSection/BlogCard';
import BlogHero from "./BlogHero";
import BlogSidebar from "./BlogSidebar";
import { Breadcrumb } from "@/components/ui/breadcrumb-custom";

interface BlogsClientProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialBlogs: any[];
}

const ITEMS_PER_PAGE = 12;

const BlogsClient: React.FC<BlogsClientProps> = ({ initialBlogs }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState(1);

    // Filter blogs based on search and category
    const filteredBlogs = useMemo(() => {
        return initialBlogs.filter((blog) => {
            const matchesSearch = searchQuery.trim()
                ? blog.title?.toLowerCase().includes(searchQuery.toLowerCase().trim())
                : true;

            const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [initialBlogs, searchQuery, selectedCategory]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
    const paginatedBlogs = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredBlogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredBlogs, currentPage]);

    // Reset pagination when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <BlogHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <div className="container mx-auto px-4 pb-20">
                <Breadcrumb items={[{ label: "Blogs" }]} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content (Articles) */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">
                                {selectedCategory === "All" ? "Latest Articles" : `${selectedCategory} Articles`}
                            </h2>
                            <span className="text-muted-foreground text-sm">
                                Showing {paginatedBlogs.length} of {filteredBlogs.length} result{filteredBlogs.length !== 1 && 's'}
                            </span>
                        </div>

                        {paginatedBlogs.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {paginatedBlogs.map((blog: any) => (
                                        <BlogCard key={blog._id} blog={blog} />
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
                                        No matching articles found
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Try adjusting your search terms or category.
                                    </p>
                                    <Button
                                        variant="link"
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSelectedCategory("All");
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
                        <BlogSidebar
                            blogs={initialBlogs}
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                        />
                    </aside>
                </div>
            </div>
        </>
    );
};

export default BlogsClient;
