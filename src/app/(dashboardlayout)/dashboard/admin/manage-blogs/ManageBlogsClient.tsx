"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import BlogCardClient from "./BlogCardClient";

interface ManageBlogsClientProps {
    blogs: any[];
}

const ITEMS_PER_PAGE = 12;

export default function ManageBlogsClient({ blogs }: ManageBlogsClientProps) {
    const [currentPage, setCurrentPage] = useState(1);

    // Pagination Logic
    const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedBlogs = blogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-card-foreground">
                        Your Blogs ({blogs.length})
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Manage all your blog posts from one place
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Results count */}
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                    Showing {paginatedBlogs.length} of {blogs.length} result{blogs.length !== 1 && 's'}
                </span>
            </div>

            {/* Blog Cards */}
            <div className="grid gap-6">
                {paginatedBlogs.map((blog: any) => (
                    <BlogCardClient key={blog._id} blog={blog} />
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
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
        </div>
    );
}
