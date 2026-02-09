import React from 'react';
import { Edit } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import ProjectCard from '@/components/ProjectCard';
import { ViewContent } from '@/app/components/editor/ViewContent';


// Reusing CategoryHero equivalent or just building it inline for now to avoid dependency hell if it's tightly coupled.
// Let's check CategoryHero import in CategoryPage. It was local: ./components/CategoryHero
// I'll build a simple hero section inline or create a new one if complex.
// The user asked for "banner user the same image as category page", likely meaning usage style.

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

const getCategory = async (slug: string) => {
    try {
        const baseUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com'
            : 'http://localhost:3000';

        const apiUrl = `${baseUrl}/api/local-categories/${slug}?populate=true`;

        console.log(`[LocalCategoryPage] Requesting: ${apiUrl}`);

        const response = await fetch(apiUrl, {
            cache: 'force-cache',
            next: {
                tags: ['local-categories', `local-category-${slug}`]
            }
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.category || null;

    } catch (error) {
        console.error("[LocalCategoryPage] Network/Fetch Error:", error);
        return null;
    }
};

export async function generateStaticParams() {
    try {
        const baseUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com'
            : 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/local-categories`, {
            cache: 'force-cache'
        });

        if (!response.ok) return [];

        const data = await response.json();
        return data.map((category: any) => ({
            slug: category.slug,
        })) || [];
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategory(slug);
    const url = process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com';

    if (!category) {
        return {
            title: 'Category Not Found',
        };
    }

    const title = category.seoTitle || category.title;
    const description = category.metaDescription || category.description?.replace(/<[^>]*>/g, '').substring(0, 160) || `Explore our ${category.title} projects.`;
    const canonicalUrl = `${url}/categories/${category.slug}`;
    const imageUrl = category.banner || `${url}/og-image.jpg`;

    return {
        title: title,
        description: description,
        keywords: category.tags || [],
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: title,
            description: description,
            url: canonicalUrl,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            type: 'website',
            siteName: 'Jiapixel',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [imageUrl],
        },
    };
}

const LocalCategoryPage = async ({ params }: PageProps) => {
    const { slug } = await params;
    const category = await getCategory(slug);

    if (!category) {
        notFound();
    }

    const projects = category.selectedProjects || [];
    const url = process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com';

    // Structured Data (JSON-LD)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": category.title,
        "description": category.metaDescription || category.description?.replace(/<[^>]*>/g, '').substring(0, 160),
        "url": `${url}/categories/${category.slug}`,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": projects.map((project: any, index: number) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `${url}/projects/${project.slug}`,
                "name": project.title
            }))
        }
    };

    return (
        <div className="min-h-screen bg-background pb-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Banner Section */}
            <div className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center bg-gray-100 overflow-hidden">
                {category.banner ? (
                    <Image
                        src={category.banner}
                        alt={category.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40" />

                <div className="relative z-10 text-center text-white px-4 max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.title}</h1>

                </div>

                {/* Admin Actions - Floating or Absolute */}
                <div className="absolute top-4 right-4 z-20">
                    <Link href={`/dashboard/admin/manage-local-categories/edit/${category.slug}`}>
                        <Button variant="outline" size="sm" className="bg-white/90 hover:bg-white text-black">
                            <Edit className="w-4 h-4 mr-2" /> Edit Category
                        </Button>
                    </Link>
                </div>
            </div>


            <div className="container mx-auto px-4 mt-8">

                {/* Description - Prioritized for SEO */}
                {category.description && (
                    <div className="bg-background rounded-xl shadow-sm p-8 mb-12">
                        <article className="prose max-w-none dark:prose-invert">
                            {/* Server-side rendered content for SEO/Crawlers */}
                            <div className="sr-only">
                                {(() => {
                                    try {
                                        let content = category.description;
                                        if (typeof content === 'string') {
                                            try {
                                                let parsed = JSON.parse(content);
                                                if (typeof parsed === 'string') {
                                                    parsed = JSON.parse(parsed);
                                                }
                                                content = parsed;
                                            } catch (e) {
                                                // content is string
                                            }
                                        }

                                        if (content?.content && Array.isArray(content.content)) {
                                            return content.content.map((node: any, i: number) => {
                                                if (node.type === 'heading') {
                                                    const rawLevel = Number(node.attrs?.level);
                                                    const level = isNaN(rawLevel) ? 2 : Math.min(Math.max(rawLevel, 1), 6);
                                                    const Level = `h${level}` as React.ElementType;
                                                    return <Level key={i}>{node.content?.map((c: any) => c.text).join('')}</Level>;
                                                }
                                                if (node.type === 'paragraph') {
                                                    return <p key={i}>{node.content?.map((c: any) => c.text).join('')}</p>;
                                                }
                                                return null;
                                            });
                                        }
                                        return typeof content === 'string' ? <p>{content}</p> : null;
                                    } catch (e) {
                                        return null;
                                    }
                                })()}
                            </div>

                            {/* Client-side rich editor view */}
                            <ViewContent content={category.description} />
                        </article>
                    </div>
                )}

                {/* Projects Section */}
                {projects.length > 0 ? (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Related Projects</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {projects.map((project: any) => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                        <p>No projects available in this category yet.</p>
                    </div>
                )}

                {/* FAQs Section */}
                {category.faqs && category.faqs.length > 0 && (
                    <div className="max-w-3xl mx-auto mt-16">
                        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {category.faqs.map((faq: any, index: number) => (
                                <div key={index} className="bg-background rounded-lg p-6 shadow-sm border border-border">
                                    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                                    <p className="text-muted-foreground">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocalCategoryPage;
