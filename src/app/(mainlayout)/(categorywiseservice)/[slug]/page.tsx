import React, { cache } from 'react';
import { notFound } from 'next/navigation';
import ServiceCard from '@/components/ServiceCard';
import ReadOnlyEditor from '@/components/tiptap-templates/simple/read-only-editor';
import { Metadata } from 'next';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import ServiceModel from '@/models/Project';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Enable ISR
export const revalidate = 86400; // 24 hours
export const dynamicParams = true;

// Cached DB Fetch to ensure reliable data access without API overhead
// Using React cache() to dedup requests during rendering
const getCategoryFromDB = cache(async (slug: string) => {
    try {
        await dbConnect();

        let category;

        // 1. Try finding by slug (exact match)
        category = await Category.findOne({ slug }).lean();

        // 2. Fallback: Check for encoded slug or ID
        if (!category) {
            // Try explicit ID match if it looks like an ObjectId
            if (slug.match(/^[0-9a-fA-F]{24}$/)) {
                category = await Category.findById(slug).lean();
            }
        }

        if (!category) return null;

        // 3. Populate selectedServices manually
        // We use manual population to ensure we get lean objects and handle missing references gracefully
        let selectedServices: any[] = [];
        if (category.selectedServices && category.selectedServices.length > 0) {
            // Filter out any potential invalid IDs first
            const validIds = category.selectedServices.filter((id: any) => id);

            if (validIds.length > 0) {
                const services = await ServiceModel.find({
                    '_id': { $in: validIds }
                })
                    .select('title slug images') // Select minimum fields needed for the card
                    .lean();

                // Preserve order if needed, or just use the results
                selectedServices = services;
            }
        }

        // 4. Return serialized data (to avoid "Cannot pass function to client" warnings if any)
        return {
            ...category,
            _id: category._id.toString(),
            createdAt: category.createdAt ? new Date(category.createdAt).toISOString() : null,
            updatedAt: category.updatedAt ? new Date(category.updatedAt).toISOString() : null,
            selectedServices: JSON.parse(JSON.stringify(selectedServices))
        };

    } catch (error) {
        console.error("Error fetching category from DB:", error);
        return null;
    }
});

// Generate Static Params (Direct DB)
export async function generateStaticParams() {
    try {
        await dbConnect();
        // Select only slug to be lightweight
        const categories = await Category.find({}, { slug: 1 }).lean();

        return categories.map((category: any) => ({
            slug: category.slug,
        }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

// Generate Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const category = await getCategoryFromDB(resolvedParams.slug);
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
    const category = await getCategoryFromDB(resolvedParams.slug);

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
            <div className="relative bg-gray-900 text-white py-20">
                {category.banner && (
                    <div className="absolute inset-0 z-0">
                        <img src={category.banner} alt={category.title} className="w-full h-full object-cover opacity-50" />
                    </div>
                )}
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.title}</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">



                {/* Services Section */}
                <div className="mb-16">
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
                            <ReadOnlyEditor content={category.description} />
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