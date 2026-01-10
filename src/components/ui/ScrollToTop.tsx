"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

            // Calculate progress percentage
            const scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setProgress(scrollProgress);

            // Show button after 300px
            if (scrollTop > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // SVG Cylinder configuration
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div
            className={cn(
                "fixed bottom-8 right-8 z-50 transition-all duration-300 transform",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
            )}
        >
            <button
                onClick={scrollToTop}
                className="relative flex items-center justify-center w-12 h-12 bg-background rounded-full shadow-lg hover:shadow-xl transition-shadow group"
                aria-label="Scroll to top"
            >
                {/* Progress Circle Background */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 text-muted-foreground/20">
                    <circle
                        cx="24"
                        cy="24"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                    />
                </svg>

                {/* Progress Circle Indicator */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 text-primary">
                    <circle
                        cx="24"
                        cy="24"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-100 ease-out"
                        strokeLinecap="round"
                    />
                </svg>

                {/* Arrow Icon */}
                <ArrowUp
                    size={20}
                    className="text-foreground group-hover:text-primary transition-colors z-10"
                />
            </button>
        </div>
    );
};
