"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
    }, [images.length, interval]);

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
                        className="w-full h-full"
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

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                            ? "bg-primary w-6"
                            : "bg-primary/30 hover:bg-primary/50"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />
        </div>
    );
};
