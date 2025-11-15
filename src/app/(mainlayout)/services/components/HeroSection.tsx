"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroSectionProps {
  service: {
    title: string;
    images?: string[];
  };
  mainCategory: string;
  subcategory: string;
}

const HeroSection = ({
  service,
  mainCategory,
  subcategory,
}: HeroSectionProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    // Only set up interval if there are multiple images
    if (service.images && service.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === service.images!.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Change image every 5 seconds

      // Clean up the interval when the component unmounts
      return () => clearInterval(interval);
    }
  }, [service.images]);

  return (
    <section>
      {/* Hero Section - Text and Title */}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 items-start md:items-center justify-between mb-4">
        <div>
          {/* Category and Subcategory */}
          <span className="inline-block text-sm font-small mb-2">
            {mainCategory} › {subcategory}
          </span>
          {/* Service Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            {service.title}
          </h1>
          <Link href="#pricing"><Button variant="default" size="lg">Order</Button></Link>
        </div>

        {/* Main Content - Service Images */}
        <div className="container mx-auto px-4 py-12">
          <div>
            <div className="space-y-8">
              {/* Service Images Slider */}
              {service.images && service.images.length > 0 && (
                <div className="relative">
                  {/* Main Image Display */}
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src={service.images[currentImageIndex]}
                      alt={`${service.title} image ${currentImageIndex + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 75vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
