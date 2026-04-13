
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

import { generateHtml } from '@/lib/server-html';
import { SocialShare } from '@/components/blog/SocialShare';
import ProjectCard from '@/components/ProjectCard';
import NewsletterAdminActions from '@/components/NewsletterAdminActions';


const extractText = (content: any): string => {
    if (!content) return '';
    if (typeof content === 'string') {
        // Try to parse as JSON first, in case it's a JSON string
        try {
            const parsed = JSON.parse(content);
            return extractTextFromJSON(parsed);
        } catch {
            // It's HTML or plain text
            return content.replace(/<[^>]*>/g, ' ');
        }
    }
    return extractTextFromJSON(content);
};

const extractTextFromJSON = (json: any): string => {
    if (!json) return '';
    if (Array.isArray(json)) {
        return json.map(extractTextFromJSON).join(' ');
    }
    if (json.text) return json.text;
    if (json.content) return extractTextFromJSON(json.content);
    return '';
};

// Helper function to get base URL
function getBaseUrl() {
    if (process.env.NODE_ENV === 'production') {
        return process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
}

async function getNewsletter(slug: string) {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/newsletters/${slug}`, {
            cache: 'force-cache',
            next: { tags: [`newsletter-${slug}`] }
        });

        if (!response.ok) {
            if (response.status === 404) return null;
            console.error('Error fetching newsletter:', response.status);
            return null;
        }

        const data = await response.json();
        return data.newsletter || null;
    } catch (error) {
        console.error('Error fetching newsletter:', error);
        return null;
    }
}

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

const isJsonString = (str: string) => {
    try {
        const json = JSON.parse(str);
        return (typeof json === 'object' && json !== null);
    } catch (e) {
        return false;
    }
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const newsletter = await getNewsletter(slug);

    if (!newsletter) {
        return {
            title: 'Newsletter Not Found - Jiapixel',
        };
    }

    const baseUrl = 'https://www.jiapixel.com';
    const canonicalUrl = `${baseUrl}/newsletters/${newsletter.slug}`;

    const plainTextTitle = newsletter.seoTitle || newsletter.title;
    const plainTextDescription = newsletter.seoDescription || '';

    return {
        title: plainTextTitle,
        description: plainTextDescription,
        keywords: newsletter.tags?.join(', ') || 'newsletter, updates, jiapixel',
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
                    url: newsletter.featuredImage || 'https://www.jiapixel.com/icon.png',
                    width: 1200,
                    height: 630,
                    alt: newsletter.title,
                },
            ],
            type: 'article',
            publishedTime: newsletter.createdAt,
        },
        twitter: {
            card: 'summary_large_image',
            title: plainTextTitle,
            description: plainTextDescription,
            images: [newsletter.featuredImage || 'https://www.jiapixel.com/icon.png'],
        },
    };
}

export default async function NewsletterPage({ params }: PageProps) {
    const { slug } = await params;
    const newsletter = await getNewsletter(slug);

    if (!newsletter) {
        notFound();
    }

    const relatedNewsletters = newsletter.relatedNewsletters || [];

    const relatedProjects = newsletter.relatedProjects || [];

    const isJson = isJsonString(newsletter.content);

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex items-center justify-between mb-8">
                    <nav>
                        <Link
                            href="/newsletters"
                            className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center space-x-2"
                        >
                            <span>←</span>
                            <span>Back to Newsletters</span>
                        </Link>
                    </nav>
                    <NewsletterAdminActions
                        newsletterSlug={newsletter.slug}
                        newsletterTitle={newsletter.title}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <article className="border rounded-lg p-8 h-full bg-card">
                            <h1 className="text-4xl font-bold mb-4">{newsletter.title}</h1>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8 border-b">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(newsletter.createdAt).toLocaleDateString()}
                                    </p>
                                    {newsletter.tags && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {newsletter.tags.map((tag: string) => (
                                                <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <SocialShare title={newsletter.title} url={`https://www.jiapixel.com/newsletters/${newsletter.slug}`} />
                            </div>

                            {/* Server-side rendered content for SEO/Crawlers */}
                            <div
                                className="prose max-w-none dark:prose-invert prose-headings:font-title font-sans leading-normal prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground ProseMirror p-0"
                                dangerouslySetInnerHTML={{ __html: generateHtml(newsletter.content) }}
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

                        {/* More Newsletters Widget */}
                        {relatedNewsletters.length > 0 && (
                            <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z" /><polyline points="15,9 18,9 18,11" /><path d="M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2v0" /></svg>
                                    <h2 className="text-lg font-bold">More Newsletters</h2>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {/* Reuse CompactBlogCard if suitable or create CompactNewsletterCard. CompactBlogCard is generic enough? */}
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {relatedNewsletters.map((item: any) => (
                                        <Link key={item._id} href={`/newsletters/${item.slug}`} className="group flex gap-3 items-start">
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
        const baseUrl = getBaseUrl();

        const response = await fetch(`${baseUrl}/api/newsletters`, {
            cache: 'force-cache'
        });

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return data.newsletters?.map((newsletter: any) => ({
            slug: newsletter.slug
        })) || [];
    } catch (error) {
        return [];
    }
}
