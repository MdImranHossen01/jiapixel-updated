import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ServiceCard from '@/components/ServiceCard';
import CategoryHero from './components/CategoryHero';
import CategoryAdminActions from '@/components/CategoryAdminActions';
import { ViewContent } from '@/app/components/editor/ViewContent';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Enable ISR
export const revalidate = 86400; // 24 hours
export const dynamicParams = true;


const getCategory = async (slug: string) => {
    try {
        // Use relative URL for server-side fetches to avoid external requests
        const apiUrl = `/api/categories/${slug}?populate=true`;

        console.log(`[CategoryPage] Requesting: ${apiUrl}`);

        const response = await fetch(apiUrl, {
            next: { revalidate: 86400 } // Match page-level revalidation
        });

        console.log(`[CategoryPage] Response Status: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[CategoryPage] Failed. Status: ${response.status} ${response.statusText}. Body: ${errorText}`);
            return null;
        }

        const data = await response.json();
        console.log(`[CategoryPage] Success. Category found: ${!!data.category}`);
        return data.category || null;

    } catch (error) {
        console.error("[CategoryPage] Network/Fetch Error:", error);
        return null;
    }
};


export async function generateStaticParams() {
    try {
        const response = await fetch(`/api/categories`, {
            cache: 'force-cache'
        });

        if (!response.ok) return [];

        const data = await response.json();
        return data.categories?.map((category: any) => ({
            slug: category.slug,
        })) || [];
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

// Generate Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const category = await getCategory(resolvedParams.slug);
    const url = process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com';

    if (!category) {
        return {
            title: 'Category Not Found',
        };
    }

    const title = category.seoTitle || category.title;
    const description = category.metaDescription || category.description?.replace(/<[^>]*>/g, '').substring(0, 160) || `Explore our ${category.title} services.`;
    const canonicalUrl = `${url}/${category.slug}`;
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

const CategoryPage = async ({ params }: PageProps) => {
    const resolvedParams = await params;
    const category = await getCategory(resolvedParams.slug);

    if (!category) {
        notFound();
    }

    const services = category.selectedServices || [];
    const url = process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com';

    // Structured Data (JSON-LD)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": category.title,
        "description": category.metaDescription || category.description?.replace(/<[^>]*>/g, '').substring(0, 160),
        "url": `${url}/${category.slug}`,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": services.map((service: any, index: number) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `${url}/${service.slug}`,
                "name": service.title
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
            <CategoryHero
                title={category.title}
            />

            <div className="container mx-auto px-4">
                {/* Admin Actions */}
                <div className="flex justify-end mb-4">
                    <CategoryAdminActions
                        categorySlug={category.slug}
                        categoryTitle={category.title}
                    />
                </div>



                {/* Services Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Available Services</h2>
                    {services.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {services.map((service: any) => (
                                <ServiceCard key={service._id} service={service} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-background rounded-xl border border-dashed">
                            <p className="text-gray-500">
                                Browse our other available services or contact us for {category.title} related inquiries.
                            </p>
                        </div>
                    )}
                </div>
                {/* Description - Prioritized for SEO (moved above services) */}
                {category.description && (
                    <div className="bg-background rounded-xl shadow-sm p-8 mb-12">
                        <article className="prose max-w-none">
                            <ViewContent content={category.description} />
                        </article>
                    </div>
                )}

                {/* FAQs Section */}
                {category.faqs && category.faqs.length > 0 && (
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {category.faqs.map((faq: any, index: number) => (
                                <div key={index} className="bg-background rounded-lg p-6 shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                                    <p className="text-gray-600">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;