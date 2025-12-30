import ServiceCard from "@/components/ServiceCard";
import React from "react";

async function getFeaturedServices() {
    try {
        // Use environment-aware URL for API calls
        const baseUrl =
            process.env.NODE_ENV === "production"
                ? process.env.NEXT_PUBLIC_API_URL || "https://www.jiapixel.com"
                : "http://localhost:3000";

        const response = await fetch(`${baseUrl}/api/services?isFeatured=true&limit=8`, {
            next: { revalidate: 300 },
        });

        if (!response.ok) {
            console.error("Error fetching services:", response.status);
            return [];
        }

        const data = await response.json();
        return data.services || [];
    } catch (error) {
        console.error("Error fetching services:", error);
        return [];
    }
}

export default async function FeaturedServiceSection() {
    const services = await getFeaturedServices();

    if (!services || services.length === 0) {
        return null;
    }

    return (
        <section className="py-16 px-4 md:px-8 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                        Featured <span className="text-primary">Services</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Explore our top-rated services designed to elevate your business and drive growth.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service: any) => (
                        <ServiceCard key={service._id} service={service} />
                    ))}
                </div>
            </div>
        </section>
    );
}
