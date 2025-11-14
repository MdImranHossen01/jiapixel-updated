import type { Metadata } from 'next';
import React from 'react';

// --- BASE CONFIGURATION ---
const BASE_URL = "https://www.jiapixel.com";
const SERVICES_TITLE = "Services | Custom Web Development, SEO & Digital Marketing";
const SERVICES_DESCRIPTION = "View the full range of professional digital services offered by Jia Pixel, specializing in high-performance Next.js development, technical SEO, and scalable marketing solutions.";

interface LayoutProps {
  children: React.ReactNode;
}

// --- SEO METADATA CONFIGURATION ---
export const metadata: Metadata = {
  // A. Core Tags
  metadataBase: new URL(BASE_URL),
  title: {
    default: SERVICES_TITLE,
    template: "%s | Jia Pixel Services", // Individual service pages will use this template
  },
  description: SERVICES_DESCRIPTION,
  keywords: ["web development services", "seo agency bangladesh", "digital marketing services", "nextjs service", "ga4 setup"],
  
  // B. Canonical Link (Base URL for the index page)
  alternates: {
    canonical: `${BASE_URL}/services`,
  },
  
  // C. Open Graph (Social Sharing default)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${BASE_URL}/services`,
    title: SERVICES_TITLE,
    description: SERVICES_DESCRIPTION,
    siteName: "Jia Pixel Services",
    images: [
      {
        url: `${BASE_URL}/og-services-default.png`, // Use a dedicated image for social shares
        width: 1200,
        height: 630,
        alt: "Jia Pixel Professional Services",
      },
    ],
  },
  
  // D. Robots/Indexing
  robots: {
    index: true,
    follow: true,
  },
};

// --- ORGANIZATION SCHEMA (Applied globally to the section) ---
const OrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Jia Pixel",
    "url": BASE_URL,
    "logo": `${BASE_URL}/icon.png`,
};


const ServicesLayout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen">
            {/* Inject JSON-LD Organization Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(OrganizationSchema) }}
            />
            
            <main>{children}</main>
        </div>
    );
};

export default ServicesLayout;