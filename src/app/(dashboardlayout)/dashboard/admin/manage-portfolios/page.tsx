import Link from 'next/link';
import { Suspense } from 'react';
import PortfoliosClient from './PortfoliosClient';
import { getCurrentUser } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';

// Helper function to get base URL
function getBaseUrl() {
    if (process.env.NODE_ENV === 'production') {
        return process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
}

async function getPortfolios() {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/portfolios?limit=1000`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch portfolios');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching portfolios:', error);
        return { portfolios: [], error: error instanceof Error ? error.message : String(error) };
    }
}

export default async function ManagePortfoliosPage() {
    const user = await getCurrentUser();
    
    // Server-side authentication check
    if (!user || user.role !== 'admin') {
        redirect('/login');
    }

    const data = await getPortfolios();
    const portfolios = data.portfolios || [];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Manage Portfolios</h1>
                    <p className="text-muted-foreground mt-2">Create and manage your portfolio projects</p>
                </div>
                <Link
                    href="/dashboard/admin/manage-portfolios/create"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <span className="text-lg">+</span> Create New Portfolio
                </Link>
            </div>

            <div className="container mx-auto py-10">
                {data.error ? (
                    <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg flex flex-col gap-2">
                        <div className="flex items-center gap-2 font-semibold">
                            <span>Error loading portfolios</span>
                        </div>
                        <p className="text-sm">{data.error}</p>
                        <Link
                            href="/dashboard/admin/manage-portfolios"
                            className="text-xs underline w-fit hover:opacity-80 text-foreground"
                        >
                            Try again
                        </Link>
                    </div>
                ) : (
                    <Suspense fallback={<div>Loading portfolios...</div>}>
                        <PortfoliosClient data={portfolios} />
                    </Suspense>
                )}
            </div>
        </div>
    );
}