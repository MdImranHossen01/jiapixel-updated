"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import PortfolioHero from "./PortfolioHero";
import PortfolioCard from "@/components/PortfolioCard";
import { GridSkeleton } from "@/components/CardSkeleton";

interface PortfoliosClientProps {
    initialPortfolios: any[];
}

const PortfoliosClient: React.FC<PortfoliosClientProps> = ({ initialPortfolios }) => {
    const [portfolios, setPortfolios] = useState<any[]>(initialPortfolios);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Filter portfolios based on search
    const filteredPortfolios = useMemo(() => {
        let filtered = portfolios;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter((portfolio) => {
                return (
                    portfolio.title?.toLowerCase().includes(query) ||
                    portfolio.content?.toLowerCase().includes(query)
                );
            });
        }

        return filtered;
    }, [portfolios, searchQuery]);

    return (
        <>
            <PortfolioHero
                title="Our Portfolio"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <section className="pb-8 pt-12">
                <div className="container mx-auto px-4">
                    {/* Results Count */}
                    {searchQuery && !isLoading && (
                        <div className="text-muted-foreground text-sm text-center mb-6">
                            Found {filteredPortfolios.length} project{filteredPortfolios.length !== 1 && 's'}
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading ? (
                        <GridSkeleton count={6} />
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
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    ) : filteredPortfolios.length === 0 ? (
                        /* No Results */
                        <div className="text-center py-16 bg-card/50 rounded-xl border border-border/50 border-dashed">
                            <div className="max-w-md mx-auto">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">
                                    No matching projects found
                                </h3>
                                <p className="text-muted-foreground">
                                    Try adjusting your search terms.
                                </p>
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="mt-4 text-primary hover:underline"
                                >
                                    Clear search
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {filteredPortfolios.map((portfolio: any) => (
                                <PortfolioCard key={portfolio._id} portfolio={portfolio} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};


export default PortfoliosClient;
