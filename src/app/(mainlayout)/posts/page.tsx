import { Metadata } from 'next';
import PostsClient from './components/PostsClient';
import { getPosts } from '@/lib/db-utils';

export const metadata: Metadata = {
    title: 'Posts | Jia Pixel',
    description: 'Read our latest posts, articles, and updates.',
};

export default async function PostsPage() {
    const posts = await getPosts();
    return <PostsClient initialPosts={posts || []} />;
}
