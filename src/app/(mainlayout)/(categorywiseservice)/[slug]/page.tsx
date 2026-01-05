import React from 'react';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import Link from 'next/link';
import Service from '@/models/Product'; // Assuming 'Product' is where services are? Or 'Project'? 
// Wait, I saw models previously. 
// "g:\jiapixel-updated\src\models\Product.ts" - This looks like "Product".
// "g:\jiapixel-updated\src\models\Project.ts" - This looks like "Service" (it exports IService and mongoose.model('Service', ...)).
// So I should use `Project.ts` which exports `Service`.
import ServiceModel from '@/models/Project';
import ServiceCard from '@/components/ServiceCard';
import ReadOnlyEditor from '@/components/tiptap-templates/simple/read-only-editor';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Enable ISR
export const revalidate = 300; // Revalidate every 5 minutes
export const dynamicParams = true; // Allow dynamic params for categories not pre-rendered

// Generate Static Params for Pre-rendering
export async function generateStaticParams() {
    await dbConnect();
    const categories = await Category.find({}, { slug: 1 }).lean();
    return categories.map((category: any) => ({
        slug: category.slug,
    }));
}

import { Metadata } from 'next';

// ... imports

// Generate Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    await dbConnect();
    const resolvedParams = await params;
    const category = await Category.findOne({ slug: resolvedParams.slug });
    const url = process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com';

    if (!category) {
        return {
            title: 'Category Not Found',
        };
    }

    const title = category.seoTitle || category.title;
    const description = category.metaDescription || category.excerpt || `Explore our ${category.title} services.`;
    // Use relative path for canonical URL to avoid issues with incorrect NEXT_PUBLIC_API_URL
    const canonicalUrl = `/${category.slug}`;
    const categoryUrl = `${url}/${category.slug}`;
    const imageUrl = category.banner || `${url}/og-image.jpg`; // Fallback image

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
            url: categoryUrl,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            type: 'website',
            siteName: 'Jiapixel', // Replace with site name
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
    await dbConnect();

    const resolvedParams = await params;

    // Fetch Category with populated services
    // User requested manual selection.
    const category = await Category.findOne({ slug: resolvedParams.slug }).populate({
        path: 'selectedServices',
        model: ServiceModel,
        strictPopulate: false
    }).lean();

    if (!category) {
        notFound();
    }

    // Use manually selected services
    // If populating fails or is empty, it will be an empty array.
    // We need to ensure we handle the type safely.
    // Serialize to ensure it's plain JSON for Client Components (fixes ObjectId serialization error)
    const services = JSON.parse(JSON.stringify(category.selectedServices || []));

    const url = process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com';

    // Structured Data (JSON-LD)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": category.title,
        "description": category.metaDescription || category.description,
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
        <div className="min-h-screen bg-gray-50">
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
                    {services.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {services.map((service: any) => (
                                <ServiceCard key={service._id} service={service} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                            <p className="text-gray-500">No services found for this category.</p>
                        </div>
                    )}
                </div>

                {/* Description Section */}
                {category.description && (
                    <div className="bg-white rounded-xl shadow-sm p-8 mb-12">
                        <ReadOnlyEditor content={category.description} />
                    </div>
                )}

                {/* FAQs Section */}
                {category.faqs && category.faqs.length > 0 && (
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {category.faqs.map((faq: any, index: number) => (
                                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
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
