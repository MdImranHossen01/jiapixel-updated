import ServiceCard from "@/components/ServiceCard";
import React from "react";
import connectDB from "@/lib/db";
import Project from "@/models/Project";

import { unstable_cache } from 'next/cache';

const getFeaturedServices = unstable_cache(
    async () => {
        try {
            await connectDB();
            // Direct DB fetch - much faster than HTTP request to own API
            const services = await Project.find({ isFeatured: true })
                .sort({ createdAt: -1 })
                .limit(8)
                .lean();

            // Serialize MongoDB objects (convert _id to string)
            return JSON.parse(JSON.stringify(services));
        } catch (error) {
            console.error("Error fetching services:", error);
            return [];
        }
    },
    ['featured-services'],
    { revalidate: 300, tags: ['services'] }
);

export default async function FeaturedServiceSection() {
    const services = await getFeaturedServices();

    if (!services || services.length === 0) {
        return null;
    }

    return (
        <section className="py-12">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                        Featured <span className="text-primary">Services</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Explore our top-rated services designed to elevate your business and drive growth.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {services.map((service: any) => (
                        <ServiceCard key={service._id} service={service} />
                    ))}
                </div>
            </div>
        </section>
    );
}
