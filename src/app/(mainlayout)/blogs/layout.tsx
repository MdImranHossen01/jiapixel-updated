import type { Metadata } from 'next';
import React from 'react';

const BASE_URL = "https://www.jiapixel.com";
const BLOG_TITLE = "Blog | Web Development, SEO & Digital Marketing Insights";
const BLOG_DESCRIPTION = "Explore the Jia Pixel Blog for expert articles on Next.js development, cutting-edge SEO strategies, GA4/GTM implementation, and scalable digital marketing tips.";

// --- SEO METADATA CONFIGURATION ---
export const metadata: Metadata = {
  // 1. Canonical & Core Tags
  metadataBase: new URL(BASE_URL),
  title: {
    default: BLOG_TITLE,
    template: "%s | Jia Pixel Blog", // This template is crucial for post titles
  },
  description: BLOG_DESCRIPTION,
  keywords: ["NextJS blog", "SEO tips", "Digital Marketing agency", "Bangladesh web dev", "GA4 GTM"],
  
  // 2. Canonical Link
  alternates: {
    canonical: `${BASE_URL}/blogs`, // Canonical link for the main blog index page
  },
  
  // 3. Robots/Indexing
  robots: {
    index: true,
    follow: true,
  },

  // 4. Open Graph (Social Sharing)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${BASE_URL}/blogs`,
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    siteName: "Jia Pixel Blog",
    images: [
      {
        url: `${BASE_URL}/og-blog-default.png`, // Use a dedicated image for social shares
        width: 1200,
        height: 630,
        alt: "Jia Pixel Blog - Web Development and SEO Insights",
      },
    ],
  },
  
  // 5. Twitter Card
  twitter: {
    card: "summary_large_image",
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    creator: "@jiapixel", // Replace with your Twitter handle
    images: [`${BASE_URL}/og-blog-default.png`],
  },

  // 6. Schema/Structured Data (Applied via Metadata injection)
  // For the blog layout, we define a default Organization schema.
  // Individual blog posts (pages) should override this with a BlogPosting schema.
  applicationName: 'Jia Pixel',
};

// --- SCHEMA STRUCTURED DATA (for Blog Index Page) ---
// Note: We use the <script> tag method within the layout component for organization schema.
const OrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Jia Pixel",
    "url": BASE_URL,
    "logo": `${BASE_URL}/icon.png`,
    "sameAs": [
        "https://www.facebook.com/jiapixel",
        "https://www.linkedin.com/company/jiapixel",
    ]
};


const BlogsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 7. Inject JSON-LD Schema in the <head> using a standard script tag */}
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(OrganizationSchema) }}
      />
      
      <main className="grow">{children}</main>
      
    </div>
  );
};

export default BlogsLayout;