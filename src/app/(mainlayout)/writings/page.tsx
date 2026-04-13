
import { Metadata } from 'next';
import WritingsClient from './components/WritingsClient';

export const metadata: Metadata = {
    title: 'Writings | Jia Pixel',
    description: 'Discover our latest writings, essays, and stories.',
};

import { getWritings as fetchWritings } from '@/lib/db-utils';

export default async function WritingsPage() {
    const writings = await fetchWritings(100);

    return <WritingsClient initialWritings={writings} />;
}
