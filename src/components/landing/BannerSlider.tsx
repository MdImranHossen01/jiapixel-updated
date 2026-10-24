"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerSliderProps {
    images: string[];
    interval?: number;
}

export const BannerSlider = ({ images, interval = 5000 }: BannerSliderProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [images.length, interval, currentIndex]);

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    return (
        <div className="relative w-full aspect-[1354/764] rounded-sm overflow-hidden border border-border bg-card shadow-xl group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.15 }}
                        transition={{ duration: interval / 1000 + 1.5, ease: "linear" }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src={images[currentIndex]}
                            alt={`Banner ${currentIndex + 1}`}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                            className="object-cover"
                        />
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md border border-white/10 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                aria-label="Previous banner"
            >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md border border-white/10 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                aria-label="Next banner"
            >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center flex-wrap gap-1.5 z-30 max-w-[90%] px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm border border-white/10">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => {
                            e.stopPropagation();
                            setCurrentIndex(index);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${index === currentIndex
                            ? "bg-primary w-5"
                            : "bg-white/40 hover:bg-white/70 w-1.5"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none z-10" />
        </div>
    );
};
