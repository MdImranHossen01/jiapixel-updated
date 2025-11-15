/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";

export default function ServiceCard({ service, category, subcategory }: any) {
  const mainTier = service.tiers?.starter;
  const featuredImage = service.images?.[0];

  return (
    <Link href={`/services/${service.slug}`} className="group">
      <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300 h-full flex flex-col">

        {/* IMAGE */}
        {featuredImage ? (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={featuredImage}
              alt={service.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3">
              <span className="bg-background/90 backdrop-blur-sm text-foreground px-2 py-1 rounded text-xs font-medium">
                {subcategory}
              </span>
            </div>
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <div className="text-4xl">⚡</div>
          </div>
        )}

        {/* CONTENT */}
        <div className="py-6 px-3 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
              {service.title}
            </h3>

          </div>

          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">
                  ${mainTier?.price || 0}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {mainTier?.deliveryDays || 3} day delivery
              </div>
            </div>

            {mainTier?.features && (
              <div className="flex flex-wrap gap-1">
                {Object.entries(mainTier.features)
                  .filter(([_, value]) => value)
                  .slice(0, 3)
                  .map(([feature]) => (
                    <span
                      key={feature}
                      className="bg-primary/10 text-primary px-2 py-1 rounded text-xs"
                    >
                      {feature.split(" ")[0]}
                    </span>
                  ))}
              </div>
            )}

            
          </div>
        </div>
      </div>
    </Link>
  );
}
