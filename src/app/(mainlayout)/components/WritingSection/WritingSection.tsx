"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import WritingCard from '../../writings/components/WritingCard';
import { GridSkeleton } from "@/components/CardSkeleton";

// Define the Writing interface
interface Writing {
    _id: string;
    title: string;
    slug: string;
    featuredImage?: string;
    category?: string;
    readTime?: number;
    publishedAt?: string;
    createdAt?: string;
}

export default function WritingSection() {
    const [writings, setWritings] = useState<Writing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWritings = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch("/api/writings?limit=4");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.success) {
                    setWritings(data.writings);
                } else {
                    throw new Error(data.message || "Failed to load writings");
                }
            } catch (err: any) {
                console.error("Error fetching writings:", err);
                setError(err.message || "Could not load latest writings.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchWritings();
    }, []);

    if (!isLoading && writings.length === 0) {
        return null;
    }

    return (
        <section className="overflow-hidden py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Latest <span className="text-primary">Writings & News</span></h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Discover our latest writings, essays, and stories.
                    </p>
                </div>

                {isLoading ? (
                    <GridSkeleton count={4} />
                ) : error ? (
                    <div className="text-center py-10 bg-red-50/30 rounded-xl border border-red-100/50 border-dashed">
                        <p className="text-red-600 text-sm mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-xs font-medium text-red-700 underline hover:no-underline"
                        >
                            Try again
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {writings.map((writing: Writing) => (
                            <div key={writing._id} className="h-full">
                                <WritingCard writing={writing} />
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-12">
                    <Link
                        href="/writings"
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
