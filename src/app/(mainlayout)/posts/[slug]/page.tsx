
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

import { SocialShare } from '@/components/blog/SocialShare';
import ProjectCard from '@/components/ProjectCard';
import PostAdminActions from '@/components/PostAdminActions';
import { generateHtml } from '@/lib/server-html';
import connectDB from '@/lib/db';
import Post from '@/models/Post';

// Helper function to get base URL
function getBaseUrl() {
    if (process.env.NODE_ENV === 'production') {
        return process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
}

// Helper to check if string is JSON
const isJsonString = (str: string) => {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
};

// Helper to extract text from JSON content for SEO
const extractText = (content: any): string => {
    if (typeof content === 'string') return content.replace(/<[^>]*>/g, '');
    if (Array.isArray(content)) return content.map(extractText).join(' ');
    if (typeof content === 'object' && content !== null) {
        if (content.text) return content.text;
        if (content.content) return extractText(content.content);
    }
    return '';
};

async function getPost(slug: string) {
    try {
        await connectDB();
        const post = await Post.findOne({ slug }).lean();
        if (!post) return null;
        return JSON.parse(JSON.stringify(post));
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

async function getRelatedPosts(postSlug: string) {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/posts?limit=3`, {
            next: { revalidate: 3600 }
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data.posts.filter((n: any) => n.slug !== postSlug).slice(0, 3) || [];
    } catch (error) {
        return [];
    }
}

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        return {
            title: 'Post Not Found - Jiapixel',
        };
    }

    const baseUrl = 'https://www.jiapixel.com';
    const canonicalUrl = `${baseUrl}/posts/${post.slug}`;

    const plainTextTitle = post.seoTitle || post.title;
    const plainTextDescription = post.seoDescription ||
        (post.excerpt ? post.excerpt :
            (post.content ?
                (isJsonString(post.content)
                    ? extractText(JSON.parse(post.content)).substring(0, 160)
                    : post.content.replace(/<[^>]*>/g, '').substring(0, 160)
                ) + '...'
                : ''));

    return {
        title: plainTextTitle,
        description: plainTextDescription,
        keywords: post.tags?.join(', ') || 'post, article, jiapixel',
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: plainTextTitle,
            description: plainTextDescription,
            url: canonicalUrl,
            siteName: 'Jiapixel',
            images: [
                {
                    url: post.featuredImage || 'https://www.jiapixel.com/icon.png',
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
            type: 'article',
            publishedTime: post.createdAt,
        },
        twitter: {
            card: 'summary_large_image',
            title: plainTextTitle,
            description: plainTextDescription,
            images: [post.featuredImage || 'https://www.jiapixel.com/icon.png'],
        },
    };
}

export default async function PostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const relatedPosts = await getRelatedPosts(slug);
    const relatedProjects = post.relatedProjects || [];
    const isJson = isJsonString(post.content);

    // Extract text for SEO crawlability if JSON
    const seoContent = isJson ? extractText(JSON.parse(post.content)) : '';

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-7xl">


                <div className="flex items-center justify-between mb-8">
                    <nav>
                        <Link
                            href="/posts"
                            className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center space-x-2"
                        >
                            <span>←</span>
                            <span>Back to Posts</span>
                        </Link>
                    </nav>
                    <PostAdminActions
                        postSlug={post.slug}
                        postTitle={post.title}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <article className="border rounded-lg p-8 h-full bg-card">
                            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8 border-b">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                    {post.tags && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {post.tags.map((tag: string) => (
                                                <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <SocialShare title={post.title} url={`https://www.jiapixel.com/posts/${post.slug}`} />
                            </div>

                            {/* Server-side rendered content for SEO/Crawlers */}
                            <div
                                className="prose prose-xl max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: generateHtml(post.content) }}
                            />
                        </article>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Related Projects Widget */}
                        {relatedProjects.length > 0 && (
                            <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
                                    <h2 className="text-lg font-bold">Related Projects</h2>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {relatedProjects.map((project: any) => (
                                        <ProjectCard key={project._id} project={project} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* More Posts Widget */}
                        {relatedPosts.length > 0 && (
                            <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M2 12a10 10 0 1 1 10 10A10 10 0 0 1 2 12Zm10-8a8 8 0 1 0 8 8 8 8 0 0 0-8-8Zm1 4v4h4v2h-6V8Z" /></svg>
                                    <h2 className="text-lg font-bold">More Posts</h2>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {relatedPosts.map((item: any) => (
                                        <Link key={item._id} href={`/posts/${item.slug}`} className="group flex gap-3 items-start">
                                            {item.featuredImage && (
                                                <div className="relative w-16 h-12 shrink-0 rounded overflow-hidden bg-muted">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={item.featuredImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h4>
                                                <p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Generate static params
export async function generateStaticParams() {
    try {
        await connectDB();
        const posts = await Post.find({}).select('slug').lean();
        return posts.map((n: any) => ({ slug: n.slug }));
    } catch (error) {
        return [];
    }
}
