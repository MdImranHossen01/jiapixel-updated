/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";

export default function ServiceCard({ service }: any) {
  const featuredImage = service.images?.[0];

  return (
    <Link href={`/services/${service.slug}`} className="group">
      <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
        {/* IMAGE */}

        <div className="relative h-48 overflow-hidden">
          <Image
            src={featuredImage}
            alt={service.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* CONTENT */}
        <div className="py-6 px-3 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
              {service.title}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
}
