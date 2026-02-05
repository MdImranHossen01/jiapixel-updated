"use client";

import React, { useState, useMemo } from "react";
import ServiceCard from "@/components/ServiceCard";
import ServiceHero from "./ServiceHero";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServicesClientProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialServices: any[];
}

const ServicesClient: React.FC<ServicesClientProps> = ({ initialServices }) => {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter services based on search
    const filteredServices = useMemo(() => {
        return initialServices.filter((service) => {
            // Search Filter (Partial Match on Title, Description, Tags)
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase().trim();

                return service.title?.toLowerCase().includes(query);
            }

            return true;
        });
    }, [initialServices, searchQuery]);

    return (
        <>
            <ServiceHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <div className="container mx-auto px-4">
                {/* Results Count */}
                {searchQuery && (
                    <div className="text-muted-foreground text-sm text-center mb-6">
                        Found {filteredServices.length} result{filteredServices.length !== 1 && 's'}
                    </div>
                )}

                {/* Services Grid */}
                {filteredServices.length > 0 ? (
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
