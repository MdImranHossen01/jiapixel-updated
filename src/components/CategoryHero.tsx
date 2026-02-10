"use client";

import React from "react";
import Image from "next/image";

interface CategoryHeroProps {
    title: string;
    children?: React.ReactNode;
}

const CategoryHero: React.FC<CategoryHeroProps> = ({ title, children }) => {
    return (
        <div className="relative bg-slate-900 overflow-hidden lg:py-40 py-20">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/Assets/banner/service-banner-jia-pixel.webp"
                    alt="Category Hero Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>

            <div className="container relative mx-auto px-4 text-center flex flex-col justify-center h-full">
                <h1 className="text-2xl lg:text-5xl font-bold text-white tracking-tight">
                    {title}
                </h1>
            </div>

            {/* Admin Actions / Children */}
            {children && (
                <div className="absolute bottom-4 right-4 z-10">
                    {children}
                </div>
            )}
        </div>
    );
};

export default CategoryHero;
