/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import type { Metadata } from "next";
import ServicesStructuredData from "@/components/ServicesStructuredData";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import ServicesClient from "./components/ServicesClient";

// Fetch all services directly from DB for initial render + search pool
async function getServices() {
  try {
    await connectDB();

    // Fetch all published services
    const services = await Project.find({ status: { $ne: 'draft' } }) // Assuming we show published and archived? Or just published.
      .sort({ createdAt: -1 })
      .lean();

    // Serialize for Client Component
    return JSON.parse(JSON.stringify(services));
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = "https://www.jiapixel.com";
  const canonicalUrl = `${baseUrl}/services`;

  return {
    title:
      "Our Services - Professional Web Development & Digital Marketing | Jiapixel",
    description:
      "Explore our professional services including web development, SEO, digital marketing, and more. Get custom solutions for your business growth.",
    keywords:
      "web development, SEO services, digital marketing, web design, e-commerce development, Bangladesh agency",

    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },

    // Open Graph
    openGraph: {
      title:
        "Our Services - Professional Web Development & Digital Marketing | Jiapixel",
      description:
        "Explore our professional services including web development, SEO, digital marketing, and more. Get custom solutions for your business growth.",
      url: canonicalUrl,
      siteName: "Jiapixel",
      images: [
        {
          url: "https://www.jiapixel.com/icon.png",
          width: 1200,
          height: 630,
          alt: "Jiapixel Services - Web Development & Digital Marketing",
        },
      ],
      locale: "en_US",
      type: "website",
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title:
        "Our Services - Professional Web Development & Digital Marketing | Jiapixel",
      description:
        "Explore our professional services including web development, SEO, digital marketing, and more.",
      images: ["https://www.jiapixel.com/icon.png"],
      creator: "@jiapixel",
    },
  };
}

const ServicesPage = async () => {
  const services = await getServices();

  // Generate structured data for services listing
  const servicesStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Jiapixel Services",
    description: "Professional web development and digital marketing services",
    url: "https://www.jiapixel.com/services",
    numberOfItems: services.length,
    itemListElement: services.map((service: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description:
          service.projectSummary?.replace(/<[^>]*>/g, "").substring(0, 200) ||
          service.tiers?.starter?.description,
        url: `https://www.jiapixel.com/services/${service.slug}`,
        offers: Object.values(service.tiers || {}).map((tier: any) => ({
          "@type": "Offer",
          name: tier.title,
          price: tier.price,
          priceCurrency: "USD",
        })),
      },
    })),
  };

  return (
    <>
      <ServicesStructuredData data={servicesStructuredData} />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className=" py-4">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold py-4 text-foreground">
                Our Professional Services
              </h1>
              <p className="text-xl text-muted-foreground  leading-relaxed">
                Discover our comprehensive range of digital services designed to
                elevate your business. From web development to digital
                marketing, we&apos;ve got you covered.
              </p>

            </div>
          </div>
        </section>

        {/* Services Client Component (Search, Filter, Grid) */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <ServicesClient initialServices={services} />
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicesPage;