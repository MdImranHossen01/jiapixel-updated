
import { Metadata } from 'next';
import NewslettersClient from './components/NewslettersClient';

export const metadata: Metadata = {
    title: 'Newsletters | Jia Pixel',
    description: 'Read our latest newsletters, updates, and curated content.',
};

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
            next: { revalidate: 3600, tags: ['newsletters'] }
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

export default async function NewslettersPage() {
    const data = await getNewsletters();
    const newsletters = data.newsletters || [];

    return <NewslettersClient initialNewsletters={newsletters} />;
}
