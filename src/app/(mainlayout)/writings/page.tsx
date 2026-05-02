import { Metadata } from 'next';
import WritingsClient from './components/WritingsClient';
import { getWritings } from '@/lib/db-utils';

export const metadata: Metadata = {
    title: 'Writings | Jia Pixel',
    description: 'Discover our latest writings, essays, and stories.',
};

export default async function WritingsPage() {
    let initialWritings = [];
    try {
        initialWritings = await getWritings() || [];
    } catch (error) {
        console.error("Error fetching writings:", error);
        initialWritings = [];
    }

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Jiapixel Writings",
        description: "Latest essays and stories from Jiapixel",
        url: "https://www.jiapixel.com/writings",
        numberOfItems: initialWritings?.length || 0,
        itemListElement: initialWritings?.map((item: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `https://www.jiapixel.com/writings/${item.slug}`,
        })) || [],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
            />
            <WritingsClient initialWritings={initialWritings || []} />
        </>
    );
}
