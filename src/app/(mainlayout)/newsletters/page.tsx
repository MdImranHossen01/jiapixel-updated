
import { Metadata } from 'next';
import NewslettersClient from './components/NewslettersClient';

export const metadata: Metadata = {
    title: 'Newsletters | Jia Pixel',
    description: 'Read our latest newsletters, updates, and curated content.',
};

export default function NewslettersPage() {
    return <NewslettersClient />;
}
