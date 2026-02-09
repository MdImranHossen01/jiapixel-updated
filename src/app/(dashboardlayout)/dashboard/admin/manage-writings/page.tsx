
import Link from 'next/link';
import { Suspense } from 'react';
import WritingsClient from './WritingsClient';

// Helper function to get base URL
function getBaseUrl() {
    if (process.env.NODE_ENV === 'production') {
        return process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
}

async function getWritings() {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/writings?limit=100`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch writings');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching writings:', error);
        return { writings: [], error: 'Failed to load writings' };
    }
}

export default async function ManageWritingsPage() {
    const data = await getWritings();
    const writings = data.writings || [];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Manage Writings</h1>
                    <p className="text-muted-foreground mt-2">Create, edit, and manage your writings</p>
                </div>
                <Link
                    href="/dashboard/admin/manage-writings/create"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <span className="text-lg">+</span> Create New Writing
                </Link>
            </div>

            <div className="container mx-auto py-10">
                <Suspense fallback={<div>Loading writings...</div>}>
                    <WritingsClient data={writings} />
                </Suspense>
            </div>
        </div>
    );
}
