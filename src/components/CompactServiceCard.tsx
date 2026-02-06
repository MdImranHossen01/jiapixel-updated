"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function CompactServiceCard({ service }: { service: any }) {
    const [imageError, setImageError] = useState(false);

    if (!service) return null;

    const featuredImage = service?.images?.[0] || service?.featuredImage || service?.image || '/placeholder-service.jpg';
    const title = service?.title || 'Untitled Service';
    const slug = service?.slug || '#';

    return (
        <Link href={`/services/${slug}`} className="group block">
            <div className="flex items-center gap-4 py-3 hover:bg-accent/50 rounded-lg transition-colors">
                {/* IMAGE */}
                <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                    {!imageError && featuredImage && featuredImage !== '/placeholder-service.jpg' ? (
                        <Image
                            src={featuredImage}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="80px"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-2xl">
                            📦
                        </div>
                    )}
                </div>

                {/* CONTENT */}
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        View Service
                    </p>
                </div>
            </div>
        </Link>
    );
}
