"use client";

import React, { useState, useMemo } from "react";
import ServiceCard from "@/components/ServiceCard";
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
        <div className="space-y-8">
            {/* Search Control */}
            <div className="flex justify-center mb-8">
                <div className="relative w-full max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-12 py-4 border border-border rounded-full bg-card shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-lg placeholder:text-muted-foreground/70"
                        placeholder="Search for services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Results Count */}
            {searchQuery && (
                <div className="text-muted-foreground text-sm text-center">
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
    );
};

export default ServicesClient;
