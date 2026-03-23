import React from 'react';
import Link from 'next/link';
import WritingCard from '../../writings/components/WritingCard';

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

// Helper to get base URL
function getBaseUrl() {
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    if (process.env.NODE_ENV === 'production') {
        return process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
}

async function getRecentWritings() {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/writings?limit=4`, {
            cache: 'force-cache',
            next: { tags: ['writings'] }
        });

        if (!response.ok) {
            console.error(`Failed to fetch recent writings: ${response.status}`);
            return [];
        }

        const data = await response.json();
        if (data.success && Array.isArray(data.writings)) {
            return data.writings;
        }
        return [];
    } catch (error) {
        console.error('Error fetching recent writings:', error);
        return [];
    }
}

export default async function WritingSection() {
    const writings = await getRecentWritings();

    if (writings.length === 0) {
        return null;
    }

    return (
        <section className="overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Latest <span className="text-primary">Writings & News</span></h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Discover our latest writings, essays, and stories.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {writings.map((writing: Writing) => (
                        <div key={writing._id} className="h-full">
                            <WritingCard writing={writing} />
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/writings"
                        className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors duration-300 font-medium"
                    >
                        View All Posts
                    </Link>
                </div>
            </div>
        </section>
    );
}
