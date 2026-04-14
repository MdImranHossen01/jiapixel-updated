"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export interface Highlight {
    id: string;
    title: string;
    description: string;
    image: string;
    icon: React.ReactNode;
    header: string;
    bullets: string[];
    bgColor?: string;
    imageBgColor?: string;
    reverse?: boolean;
    headerBgCls?: string;
    headerTextCls?: string;
}

interface StackingHighlightsProps {
    highlights: Highlight[];
}

export function StackingHighlights({ highlights }: StackingHighlightsProps) {
    return (
        <div className="flex flex-col gap-20 py-20">
            {highlights.map((highlight, index) => (
                <Card 
                    key={highlight.id} 
                    highlight={highlight} 
                    index={index} 
                    total={highlights.length} 
                />
            ))}
        </div>
    );
}

function Card({ highlight, index, total }: { highlight: Highlight; index: number; total: number }) {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "start start"],
    });

    // Subtly scale down the card as it gets covered by the next one
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
    
    // Calculate sticky top offset - each card stops slightly lower if we want a "stacked" top edge
    // or same position if we want them to completely overlap.
    // The user image shows them completely overlapping or very slightly offset.
    const topOffset = 100 + (index * 20); // 100px from top, offset by 20px per card

    return (
        <div 
            ref={container} 
            className="h-auto min-h-[70vh] flex items-center justify-center sticky"
            style={{ top: `${topOffset}px`, zIndex: index + 1 }}
        >
            <motion.div
                style={{ 
                    scale,
                    boxShadow: "0 -20px 50px -20px rgba(0,0,0,0.3)"
                }}
                className={`w-full overflow-hidden bg-card border border-border rounded-[2.5rem] shadow-2xl relative transition-shadow duration-500 hover:shadow-primary/5`}
            >
                <div className={`grid grid-cols-1 lg:grid-cols-2 items-center min-h-[500px]`}>
                    {/* Content Column */}
                    <div className={`p-8 lg:p-16 space-y-6 ${highlight.reverse ? 'lg:order-2' : 'lg:order-1'}`}>
                        <div className={`inline-flex items-center rounded-lg px-3 py-1 text-sm font-medium border ${highlight.headerBgCls} ${highlight.headerTextCls}`}>
                            <div className="mr-2">{highlight.icon}</div>
                            <span>{highlight.header}</span>
                        </div>
                        
                        <h3 className="text-3xl md:text-4xl font-black tracking-tight">{highlight.title}</h3>
                        
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                            {highlight.description}
                        </p>
                        
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 pt-4">
                            {highlight.bullets.map((bullet, i) => (
                                <li key={i} className="flex items-center gap-3 group">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <CheckCircle2 className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="font-medium text-foreground/80">{bullet}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Image Column */}
                    <div className={`h-full min-h-[400px] flex items-center justify-center p-8 lg:p-12 relative overflow-hidden ${highlight.imageBgColor} ${highlight.reverse ? 'lg:order-1' : 'lg:order-2'}`}>
                        <div className="relative z-10 w-full max-w-lg">
                            <Image
                                src={highlight.image}
                                alt={highlight.title}
                                width={600}
                                height={450}
                                className="rounded-2xl shadow-2xl transition-transform duration-700 hover:scale-105"
                            />
                        </div>
                        {/* Decorative background circle */}
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
