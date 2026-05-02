import { Metadata } from 'next';
import NewslettersClient from './components/NewslettersClient';
import { getNewsletters } from '@/lib/db-utils';

export const metadata: Metadata = {
    title: 'Newsletters | Jia Pixel',
    description: 'Read our latest newsletters, updates, and curated content.',
};

export default async function NewslettersPage() {
    let initialNewsletters = [];
    try {
        initialNewsletters = await getNewsletters() || [];
    } catch (error) {
        console.error("Error fetching newsletters:", error);
        initialNewsletters = [];
    }

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Jiapixel Newsletters",
        description: "Latest updates and insights from Jiapixel",
        url: "https://www.jiapixel.com/newsletters",
        numberOfItems: initialNewsletters?.length || 0,
        itemListElement: initialNewsletters?.map((item: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `https://www.jiapixel.com/newsletters/${item.slug}`,
        })) || [],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
            />
            <NewslettersClient initialNewsletters={initialNewsletters || []} />
        </>
    );
}
