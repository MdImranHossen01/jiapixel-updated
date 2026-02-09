
import { Metadata } from 'next';
import WritingsClient from './components/WritingsClient';

export const metadata: Metadata = {
    title: 'Writings | Jia Pixel',
    description: 'Discover our latest writings, essays, and stories.',
};

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
            next: { revalidate: 3600, tags: ['writings'] }
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

export default async function WritingsPage() {
    const data = await getWritings();
    const writings = data.writings || [];

    return <WritingsClient initialWritings={writings} />;
}
