import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProjectCard from '@/components/ProjectCard';
import { generateHtml } from '@/lib/server-html';
import LocalCategoryAdminActions from '@/components/LocalCategoryAdminActions';
import CategoryHero from '@/components/CategoryHero';

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
            const errorText = await response.text();
            console.error(`[LocalCategoryPage] Failed. Status: ${response.status} ${response.statusText}. Body: ${errorText}`);
            return null;
        }

        const data = await response.json();
        console.log(`[LocalCategoryPage] Success. Category found: ${!!data.category}`);
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
    const imageUrl = category.banner || `${url}/Jia-pixel-your-partner-in-digital-transformation.png`;

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
        <div className="min-h-screen bg-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Banner Section */}
            <CategoryHero title={category.title}>
                <LocalCategoryAdminActions
                    categorySlug={category.slug}
                    categoryTitle={category.title}
                />
            </CategoryHero>

            <div className="container mx-auto px-4 mt-8">

                {/* Projects Section */}
                {projects.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Related Projects</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {projects.map((project: any) => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Description - Prioritized for SEO */}
                {category.description && (
                    <div className="bg-background rounded-xl shadow-sm p-8 mb-12">
                        <article className="prose max-w-none dark:prose-invert">
                            {/* Server-side rendered content for SEO/Crawlers */}
                            <div
                                className="prose prose-xl max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: generateHtml(category.description) }}
                            />
                        </article>
                    </div>
                )}

                {/* FAQs Section */}
                {category.faqs && category.faqs.length > 0 && (
                    <div className="max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {category.faqs.map((faq: any, index: number) => (
                                <div key={index} className="bg-background rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-800">
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
