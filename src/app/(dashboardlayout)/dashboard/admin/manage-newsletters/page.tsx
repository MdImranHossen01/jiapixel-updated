
import Link from 'next/link';
import { Suspense } from 'react';
import NewsletterCardClient from './NewsletterCardClient';

// Helper function to get base URL
function getBaseUrl() {
    if (process.env.NODE_ENV === 'production') {
        return process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
}

async function getNewsletters() {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/newsletters?limit=100`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch newsletters');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching newsletters:', error);
        return { newsletters: [], error: 'Failed to load newsletters' };
    }
}

export default async function ManageNewslettersPage() {
    const data = await getNewsletters();
    const newsletters = data.newsletters || [];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Manage Newsletters</h1>
                    <p className="text-muted-foreground mt-2">Create, edit, and manage your newsletters</p>
                </div>
                <Link
                    href="/dashboard/admin/manage-newsletters/create"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <span className="text-lg">+</span> Create New Newsletter
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <Suspense fallback={<div>Loading newsletters...</div>}>
                    {newsletters.length === 0 ? (
                        <div className="text-center py-12 bg-card rounded-lg border border-border">
                            <p className="text-muted-foreground text-lg">No newsletters found</p>
                            <p className="text-sm text-muted-foreground mt-2">Get started by creating your first newsletter</p>
                        </div>
                    ) : (
                        newsletters.map((newsletter: any) => (
                            <NewsletterCardClient key={newsletter._id} newsletter={newsletter} />
                        ))
                    )}
                </Suspense>
            </div>
        </div>
    );
}
