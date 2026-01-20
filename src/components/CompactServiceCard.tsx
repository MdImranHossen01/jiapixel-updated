"use client";

import Image from "next/image";
import Link from "next/link";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function CompactServiceCard({ service }: { service: any }) {
    const featuredImage = service.images?.[0] || service.featuredImage || '/placeholder-service.jpg';

    return (
        <Link href={`/services/${service.slug}`} className="group block">
            <div className="flex items-center gap-4 py-3 hover:bg-accent/50 rounded-lg transition-colors">
                {/* IMAGE */}
                <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-md border border-border">
                    <Image
                        src={featuredImage}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="80px"
                    />
                </div>

                {/* CONTENT */}
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {service.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        View Service
                    </p>
                </div>
            </div>
        </Link>
    );
}
