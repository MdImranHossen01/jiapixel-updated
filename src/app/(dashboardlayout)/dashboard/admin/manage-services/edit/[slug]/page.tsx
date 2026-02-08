"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import ServiceWizard, { ServiceData } from "@/app/(dashboardlayout)/dashboard/components/ServiceWizard";

export default function EditServicePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const [serviceData, setServiceData] = useState<ServiceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await fetch(`/api/services/${slug}`);
                const result = await response.json();

                if (response.ok && result.success) {
                    // Properly map API data to ServiceData interface
                    // Ensure arrays are arrays, handle potential nulls
                    const data = result.service;

                    const mappedData: ServiceData = {
                        title: data.title || "",
                        slug: data.slug || "",
                        category: data.category || "",
                        searchTags: data.searchTags || [],
                        author: data.author || "Md Imran Hossen",

                        metaTitle: data.metaTitle || "",
                        metaDescription: data.metaDescription || "",

                        pricingTiers: data.pricingTiers || "3",
                        tiers: data.tiers || {
                            starter: { title: "", description: "", deliveryDays: 0, revisions: 0, price: 0, features: {} },
                        },

                        // API returns string[], we pass them as is. ServiceWizard expects (File | string)[].
                        images: data.images || [],
                        documents: data.documents || [],

                        requirements: data.requirements || [],
                        projectSummary: data.projectSummary || "",
                        isFeatured: data.isFeatured !== undefined ? data.isFeatured : true,
                    };

                    setServiceData(mappedData);
                } else {
                    setError(result.message || "Failed to fetch service");
                }
            } catch (err: any) {
                console.error("Fetch error:", err);
                setError("An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground animate-pulse">Loading service...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-destructive/10 border border-destructive rounded-lg text-center">
                <h3 className="text-destructive text-lg font-semibold mb-2">Error</h3>
                <p className="text-muted-foreground">{error}</p>
                <button
                    onClick={() => router.back()}
                    className="mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Edit Service</h1>
                <p className="text-muted-foreground mt-2">
                    Update service details, pricing, and media.
                </p>
            </div>

            {serviceData && (
                <ServiceWizard
                    initialData={serviceData}
                    isEdit={true}
                    serviceSlug={slug}
                />
            )}
        </div>
    );
}
