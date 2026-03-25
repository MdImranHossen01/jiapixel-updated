"use client";

import { Search } from "lucide-react";
import Image from "next/image";

interface PortfolioHeroProps {
    title: string;
    description?: string;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const PortfolioHero: React.FC<PortfolioHeroProps> = ({
    title,
    description = "Explore our latest projects and see how we have helped businesses transform their digital presence.",
    searchQuery,
    setSearchQuery
}) => {
    return (
        <div className="relative bg-slate-900 overflow-hidden py-20 mb-12">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/Assets/banner/portfolio_bg.webp"
                    alt="Portfolio Hero Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>

            <div className="container relative mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                    {title}
                </h1>
                <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                    {description}
                </p>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-purple-600/50 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-12 pr-6 py-4 rounded-full bg-white/95 dark:bg-slate-950/90 border border-transparent focus:border-primary shadow-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioHero;
