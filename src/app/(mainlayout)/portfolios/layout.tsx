import type { Metadata } from 'next';
import React from 'react';

// --- BASE CONFIGURATION ---
const BASE_URL = "https://www.jiapixel.com";
const PORTFOLIO_TITLE = "Portfolio | Featured Web Projects & Case Studies";
const PORTFOLIO_DESCRIPTION = "Explore the best web development and digital marketing case studies from Jia Pixel. See our results in React, Next.js, and SEO performance.";

// --- LAYOUT INTERFACE (KEEP AS IS FOR FRAMEWORK) ---
interface LayoutProps {
  children: React.ReactNode;
  params?: { slug?: string }; 
}

// --- SEO METADATA CONFIGURATION (No changes needed) ---
export const metadata: Metadata = {
// ... (Metadata content is correct)
  metadataBase: new URL(BASE_URL),
  title: {
    default: PORTFOLIO_TITLE,
    template: "%s | Jia Pixel Portfolios", 
  },
  description: PORTFOLIO_DESCRIPTION,
  alternates: {
    canonical: `${BASE_URL}/portfolios`,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${BASE_URL}/portfolios`,
    title: PORTFOLIO_TITLE,
    description: PORTFOLIO_DESCRIPTION,
    siteName: "Jia Pixel Portfolios",
    images: [
      {
        url: `${BASE_URL}/og-portfolio-default.png`,
        width: 1200,
        height: 630,
        alt: "Jia Pixel Portfolio Showcase",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// --- ORGANIZATION SCHEMA (No changes needed) ---
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

// --- FINAL FIX: Remove 'params' from function destructuring to prevent the type error. ---
// The component is still typed by LayoutProps but only uses the 'children' prop.
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