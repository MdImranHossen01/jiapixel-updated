"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Feature {
    title: string;
    description: string;
    link: string;
}

interface FeaturesGridProps {
    features: Feature[];
}

export function FeaturesGrid({ features }: FeaturesGridProps) {
    const [visibleCount, setVisibleCount] = useState(6);
    const hasMore = visibleCount < features.length;

    const showMore = () => {
        setVisibleCount((prev) => Math.min(prev + 6, features.length));
    };

    const visibleFeatures = features.slice(0, visibleCount);

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10">
                <AnimatePresence mode="popLayout">
                    {visibleFeatures.map((item, idx) => (
                        <motion.div
                            key={item.title} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                                duration: 0.5, 
                                delay: (idx % 6) * 0.1,
                                ease: "easeOut"
                            }}
                            className="p-8 rounded-3xl border border-primary/40 bg-card shadow-[inset_0_0_30px_rgba(100,255,100,0.05)] transition-all duration-300 flex flex-col gap-4 group relative overflow-hidden"
                        >
                            {/* Constant inner glow effect using primary property */}
                            <div className="absolute inset-0 shadow-[inset_0_0_25px_var(--primary)] opacity-20 pointer-events-none" />
                            
                            <span className="text-xs font-black tracking-widest text-primary/60 mb-2">{(idx + 1).toString().padStart(3, '0')}</span>
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{item.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {hasMore && (
                <div className="flex justify-center pt-8">
                    <Button
                        onClick={showMore}
                        size="lg"
                        variant="outline"
                        className="rounded-full px-8 h-14 text-lg font-bold border-primary/20 hover:border-primary hover:bg-primary/5 transition-all group shadow-xl shadow-primary/5"
                    >
                        <span>আরও ফিচার দেখুন</span>
                        <ChevronDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
                    </Button>
                </div>
            )}
        </div>
    );
}
