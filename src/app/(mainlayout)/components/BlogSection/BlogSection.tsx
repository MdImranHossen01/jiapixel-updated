import React from 'react';
import Link from 'next/link';
import BlogCard from './BlogCard';

// Define the Blog interface
interface Blog {
    _id: string;
    title: string;
    slug: string;
    featuredImage?: string;
    category?: string;
    readTime?: number;
    publishedAt?: string;
    createdAt?: string;
}

import { getBlogs } from '@/lib/db-utils';

export default async function BlogSection() {
    const blogs = await getBlogs(4);

    if (blogs.length === 0) {
        return null;
    }

    return (
        <section className="overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Latest <span className="text-primary">Blog & News</span></h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Stay updated with our latest insights, tutorials, and industry news.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {blogs.map((blog: Blog) => (
                        <div key={blog._id} className="h-full">
                            <BlogCard blog={blog} />
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors duration-300 font-medium"
                        prefetch={false}
                    >
                        View All Posts
                    </Link>
                </div>
            </div>
        </section>
    );
}
