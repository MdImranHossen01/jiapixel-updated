"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import PortfolioHero from "./PortfolioHero";
import { extractTextFromProjectDescription } from "@/lib/utils";

interface Portfolio {
    _id: string;
    title: string;
    slug: string;
    content: string;
    featuredImage: string;
    featured: boolean;
    createdAt: string;
}

interface PortfoliosClientProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialPortfolios: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pagination: any;
}

const PortfoliosClient: React.FC<PortfoliosClientProps> = ({ initialPortfolios, pagination }) => {
    const [searchQuery, setSearchQuery] = useState("");

    // Extract unique categories from portfolios
    const categories = useMemo(() => {
        return ['All', ...Array.from(new Set(initialPortfolios.map((p: any) => p.category)))].filter(Boolean);
    }, [initialPortfolios]);

    // Filter portfolios based on search
    const filteredPortfolios = useMemo(() => {
        let filtered = initialPortfolios;

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
    }, [initialPortfolios, searchQuery]);

    return (
        <>
            <PortfolioHero
                title="Our Portfolio"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <section className="py-16">
                <div className="container mx-auto px-4">
                    {/* Results Count */}
                    {searchQuery && (
                        <div className="text-muted-foreground text-sm text-center mb-6">
                            Found {filteredPortfolios.length} project{filteredPortfolios.length !== 1 && 's'}
                        </div>
                    )}

                    {/* Category Filter (Display Only) */}
                    {categories.length > 0 && !searchQuery && (
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {categories.map((category: any) => (
                                <span
                                    key={category}
                                    className="px-6 py-2 rounded-full border border-border bg-card text-foreground"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {filteredPortfolios.length === 0 ? (
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

                    {/* Load More Button (only show if not searching and has next page) */}
                    {!searchQuery && pagination.hasNext && (
                        <div className="text-center mt-12">
                            <p className="text-muted-foreground text-sm">
                                More projects available - pagination coming soon
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PortfolioCard({ portfolio }: { portfolio: any }) {
    return (
        <Link href={`/portfolios/${portfolio.slug}`}>
            <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] group cursor-pointer h-full flex flex-col">
                <div className="relative overflow-hidden flex-shrink-0">
                    <Image
                        src={portfolio.featuredImage || '/api/placeholder/400/300'}
                        alt={portfolio.title}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {portfolio.featured && (
                        <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                            Featured
                        </div>
                    )}
                </div>

                <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {portfolio.title}
                    </h3>

                    <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
                        {extractTextFromProjectDescription(portfolio.content)}
                    </p>

                    <div className="text-sm text-muted-foreground mt-auto">
                        {new Date(portfolio.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default PortfoliosClient;
