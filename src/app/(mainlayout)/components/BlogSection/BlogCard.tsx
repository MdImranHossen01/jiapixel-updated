import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatBlogDate } from '@/lib/utils';

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

interface BlogCardProps {
    blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
    return (
        <article
            className="bg-card rounded-sm lg:rounded-md  shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow duration-300 group h-full flex flex-col"
        >
            {blog.featuredImage && (
                <div className="relative h-48 overflow-hidden shrink-0">
                    <Image
                        src={blog.featuredImage}
                        alt={blog.title || 'Blog post image'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            )}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-3">

                    <span className="text-sm text-muted-foreground">
                        {blog.readTime || 5} min read
                    </span>
                </div>

                <h2 className="font-bold text-card-foreground mb- line-clamp-2">
                    <Link
                        href={`/blogs/${blog.slug}`}
                        className="hover:text-primary transition-colors"
                    >
                        {blog.title || 'Untitled Blog Post'}
                    </Link>
                </h2>
                <div className="text-sm text-muted-foreground">
                    {formatBlogDate(blog.publishedAt || blog.createdAt)}
                </div>

                <div className="mt-auto flex items-center justify-end pt-4 border-t border-border">

                    <Link
                        href={`/blogs/${blog.slug}`}
                        className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                    >
                        Read More →
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default BlogCard;
