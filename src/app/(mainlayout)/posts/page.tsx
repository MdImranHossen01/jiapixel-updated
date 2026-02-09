
import { Metadata } from 'next';
import PostsClient from './components/PostsClient';

export const metadata: Metadata = {
    title: 'Posts | Jia Pixel',
    description: 'Read our latest posts, articles, and updates.',
};

// Helper function to get base URL
function getBaseUrl() {
    if (process.env.NODE_ENV === 'production') {
        return process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
}

async function getPosts() {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/posts?limit=100`, {
            next: { revalidate: 3600, tags: ['posts'] }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching posts:', error);
        return { posts: [], error: 'Failed to load posts' };
    }
}

export default async function PostsPage() {
    const data = await getPosts();
    const posts = data.posts || [];

    return <PostsClient initialPosts={posts} />;
}
