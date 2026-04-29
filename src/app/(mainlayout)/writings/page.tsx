
import { Metadata } from 'next';
import WritingsClient from './components/WritingsClient';

export const metadata: Metadata = {
    title: 'Writings | Jia Pixel',
    description: 'Discover our latest writings, essays, and stories.',
};

export default function WritingsPage() {
    return <WritingsClient />;
}
