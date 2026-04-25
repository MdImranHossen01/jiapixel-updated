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
        <div className="flex flex-col gap-0 md:gap-12 py-12">
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

    // Calculate sticky top offset
    const topOffset = 50 + (index * 20);

    return (
        <div
            ref={container}
            className="h-auto min-h-[calc(100vh-50px)] md:min-h-[40vh] flex justify-center sticky py-1 md:py-4"
            style={{ top: `${topOffset}px`, zIndex: index + 1 }}
        >
            <motion.div
                style={{
                    scale,
                    boxShadow: "0 -10px 40px -15px rgba(0,0,0,0.1)"
                }}
                className={`w-full h-full md:h-auto overflow-hidden bg-card md:bg-card/80 md:backdrop-blur-xl border border-border/50 rounded-2xl md:rounded-[2.5rem] shadow-2xl relative transition-all duration-500 hover:shadow-primary/10 hover:border-primary/20`}
            >
                <div className={`flex flex-col md:flex-row items-stretch h-full`}>
                    {/* Image Column - Top on mobile */}
                    <div className={`w-full h-[35%] md:h-auto md:w-1/2 flex items-center justify-center p-3 md:p-6 lg:p-8 relative overflow-hidden order-1 ${highlight.reverse ? 'md:order-2' : 'md:order-1'}`}>
                        {/* Soft glow behind image */}
                        <div className={`absolute inset-0 opacity-20 ${highlight.imageBgColor || 'bg-primary/10'} blur-3xl`}></div>

                        <div className="relative z-10 w-full h-full md:h-[320px] flex items-center justify-center">
                            <Image
                                src={highlight.image}
                                alt={highlight.title}
                                width={600}
                                height={450}
                                className="rounded-xl shadow-xl transition-transform duration-700 hover:scale-105 object-contain max-h-full"
                            />
                        </div>
                    </div>

                    {/* Content Column - Bottom on mobile */}
                    <div className={`w-full flex-1 md:w-1/2 p-4 md:p-10 lg:p-12 space-y-3 md:space-y-4 flex flex-col justify-center order-2 ${highlight.reverse ? 'md:order-1' : 'md:order-2'}`}>
                        <div className={`hidden md:inline-flex items-center rounded-full px-2 py-0.5 text-[9px] md:text-xs font-bold border ${highlight.headerBgCls} ${highlight.headerTextCls} w-fit shadow-sm`}>
                            <div className="mr-1 md:mr-2 scale-75 md:scale-110">{highlight.icon}</div>
                            <span className="tracking-wide">{highlight.header}</span>
                        </div>

                        <h3 className="text-xl md:text-3xl lg:text-4xl font-black tracking-tight leading-[1.1]">{highlight.title}</h3>

                        <p className="text-muted-foreground text-xs md:text-base lg:text-lg leading-tight max-w-xl">
                            {highlight.description}
                        </p>

                        <ul className="grid grid-cols-1 gap-2 md:gap-4 pt-1 md:pt-4">
                            {highlight.bullets.map((bullet, i) => (
                                <li key={i} className="flex items-center gap-2 md:gap-3 group">
                                    <div className="flex-shrink-0 w-4 h-4 md:w-6 md:h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all group-hover:scale-110">
                                        <CheckCircle2 className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-primary" />
                                    </div>
                                    <span className="font-semibold text-foreground/90 text-[11px] md:text-sm lg:text-base">{bullet}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
