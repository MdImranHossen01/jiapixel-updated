"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Pagination from "@/components/ui/Pagination";
import BlogCardClient from "./BlogCardClient";

interface ManageBlogsClientProps {
    blogs: any[];
}

const ITEMS_PER_PAGE = 10;

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
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
