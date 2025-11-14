import type { Metadata } from 'next';
import React from 'react';

// --- BASE CONFIGURATION ---
const BASE_URL = "https://www.jiapixel.com";
const PORTFOLIO_TITLE = "Portfolio | Featured Web Projects & Case Studies";
const PORTFOLIO_DESCRIPTION = "Explore the best web development and digital marketing case studies from Jia Pixel. See our results in React, Next.js, and SEO performance.";

interface LayoutProps {
  children: React.ReactNode;
  params: { slug?: string }; // 'slug' is optional because it's the parent of [slug]
}

// --- SEO METADATA CONFIGURATION ---
export const metadata: Metadata = {
  // A. Core Tags
  metadataBase: new URL(BASE_URL),
  title: {
    default: PORTFOLIO_TITLE,
    template: "%s | Jia Pixel Portfolios", // This template is crucial for individual portfolio detail pages
  },
  description: PORTFOLIO_DESCRIPTION,
  
  // B. Canonical Link (Base URL for the index page)
  alternates: {
    canonical: `${BASE_URL}/portfolios`,
  },
  
  // C. Open Graph (Social Sharing default)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${BASE_URL}/portfolios`,
    title: PORTFOLIO_TITLE,
    description: PORTFOLIO_DESCRIPTION,
    siteName: "Jia Pixel Portfolios",
    images: [
      {
        url: `${BASE_URL}/og-portfolio-default.png`, // Use a dedicated image
        width: 1200,
        height: 630,
        alt: "Jia Pixel Portfolio Showcase",
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
    "sameAs": [
        "https://www.linkedin.com/company/jiapixel",
        "https://www.facebook.com/jiapixel",
    ]
};

const PortfoliosLayout = ({ children }: LayoutProps) => {
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

export default PortfoliosLayout;