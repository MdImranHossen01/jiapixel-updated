"use client";

import React, { useState, useMemo, useEffect } from "react";
import ServiceCard from "@/components/ServiceCard";
import ServiceHero from "./ServiceHero";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GridSkeleton } from "@/components/CardSkeleton";

const ServicesClient: React.FC = () => {
    const [services, setServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchServices = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch("/api/services?limit=100");
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                if (data.success) {
                    setServices(data.services);
                } else {
                    throw new Error(data.message || "Failed to load services");
                }
            } catch (err: any) {
                console.error("Error fetching services:", err);
                setError(err.message || "An unexpected error occurred while fetching services.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Filter services based on search
    const filteredServices = useMemo(() => {
        return services.filter((service) => {
            // Search Filter (Partial Match on Title, Description, Tags)
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase().trim();

                return service.title?.toLowerCase().includes(query);
            }

            return true;
        });
    }, [services, searchQuery]);

    return (
        <>
            <ServiceHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <div className="container mx-auto px-4">
                {/* Results Count */}
                {searchQuery && !isLoading && (
                    <div className="text-muted-foreground text-sm text-center mb-6">
                        Found {filteredServices.length} result{filteredServices.length !== 1 && 's'}
                    </div>
                )}

                {isLoading ? (
                    <GridSkeleton count={8} />
                ) : error ? (
                    /* Error State */
                    <div className="text-center py-16 bg-red-50/50 rounded-xl border border-red-100 border-dashed">
                        <div className="max-w-md mx-auto">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h3 className="text-2xl font-bold text-red-900 mb-2">
                                Something went wrong
                            </h3>
                            <p className="text-red-700/80 mb-6">
                                {error}
                            </p>
                            <Button
                                onClick={() => window.location.reload()}
                                className="bg-red-600 text-white hover:bg-red-700"
                            >
                                Try again
                            </Button>
                        </div>
                    </div>
                ) : filteredServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {filteredServices.map((service: any) => (
                            <ServiceCard key={service._id} service={service} />
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16 bg-card/50 rounded-xl border border-border/50 border-dashed">
                        <div className="max-w-md mx-auto">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">
                                No matching services found
                            </h3>
                            <p className="text-muted-foreground">
                                Try adjusting your search terms.
                            </p>
                            <Button
                                variant="link"
                                onClick={() => setSearchQuery("")}
                                className="mt-4"
                            >
                                Clear search
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ServicesClient;
