/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
// import RichTextRenderer from "@/components/RichTextRenderer";
import PricingComponent from "../components/Pricing";
import HeroSection from "../components/HeroSection";
// import ReadOnlyEditor from "@/components/tiptap-templates/simple/read-only-editor";

import ServiceAdminActions from "@/components/ServiceAdminActions";
import { extractTextFromProjectDescription } from "@/lib/utils";
import { generateHtml } from "@/lib/server-html";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Fetch service via API for better caching control
async function getService(slug: string) {
  try {
    const baseUrl = process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com'
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/services/${slug}`, {
      cache: 'force-cache'
    } as RequestInit);

    if (!response.ok) {
      if (response.status === 404) return null;
      console.error('Error fetching service:', response.status);
      return null;
    }

    const data = await response.json();
    return data.service || null;
  } catch (error) {
    console.error("Error fetching service:", error);
    return null;
  }
}

// Generate static params for all services (SSG)
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com'
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/services?limit=1000`, {
      cache: 'force-cache'
    } as RequestInit);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.services?.map((service: any) => ({
      slug: service.slug,
    })) || [];
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return {
      title: "Service Not Found - Jiapixel",
    };
  }

  // Use relative path for canonical URL to avoid issues with incorrect NEXT_PUBLIC_API_URL
  const canonicalUrl = `/services/${service.slug}`;

  // Use custom meta title and description if provided, otherwise generate from service data
  const metaTitle = service.metaTitle
    ? service.metaTitle.length > 100
      ? `${service.metaTitle.substring(0, 97)}`
      : `${service.metaTitle}`
    : service.title.length > 100
      ? `${service.title.substring(0, 97)}`
      : `${service.title}`;

  const metaDescription = service.metaDescription
    ? service.metaDescription.substring(0, 300)
    : service.projectSummary
      ? extractTextFromProjectDescription(service.projectSummary).substring(0, 300)
      : `Professional ${service.title} service by Jiapixel. ${service.tiers?.starter?.description || "Get started today!"
      }`;

  // Featured image for social sharing
  const featuredImage = service.images?.[0] || "/icon.png";

  return {
    title: metaTitle,
    description: metaDescription,
    keywords:
      service.searchTags?.join(", ") ||
      `${service.category}, web development, digital services`,

    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },

    // Open Graph
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: "Jiapixel",
      images: [
        {
          url: featuredImage,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
      locale: "en_US",
      type: "website",
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [featuredImage],
      creator: "@jiapixel",
    },
  };
}

export default async function ServiceDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  const mainCategory = service.category?.split(" > ")[0] || "Service";
  const subcategory = service.category?.split(" > ")[1] || "General Service";

  // Generate structured data for this specific service page
  const serviceStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description:
      service.projectSummary?.replace(/<[^>]*>/g, "").substring(0, 200) ||
      service.tiers?.starter?.description,
    provider: {
      "@type": "Organization",
      name: "Jiapixel",
      url: "https://www.jiapixel.com",
      logo: "https://www.jiapixel.com/icon.png",
    },
    areaServed: "Worldwide",
    serviceType: service.category,
    offers: Object.values(service.tiers || {}).map((tier: any) => ({
      "@type": "Offer",
      name: tier.title,
      description: tier.description,
      price: tier.price,
      priceCurrency: "USD",
    })),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.jiapixel.com/services/${service.slug}`,
    },
  };

  return (
    <>
      {/* Service-specific Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceStructuredData),
        }}
      />

      <div className=" overflow-hidden py-8">
        <div className="container mx-auto px-4 w-full">
          {/* Admin Actions */}
          <div className="flex justify-end mb-4">
            <ServiceAdminActions
              serviceSlug={service.slug}
              serviceTitle={service.title}
            />
          </div>

          <section>
            <HeroSection
              service={service}
              mainCategory={mainCategory}
              subcategory={subcategory}
            />
          </section>
          {/* Service Description */}
          <section className="py-4">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">


                <p className="lg:text-2xl text-xl  font-bold py-2 text-foreground">
                  Service Details
                </p>

                {/* Server-side rendered content for SEO/Crawlers */}
                <div
                  className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-title font-sans leading-normal text-[16px] prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground tiptap"
                  dangerouslySetInnerHTML={{ __html: generateHtml(service.projectSummary) }}
                />
              </div>
            </div>
          </section>

          {/* Pricing Component - Only show if service has tiers */}
          {service.tiers && Object.keys(service.tiers).length > 0 && (
            <PricingComponent service={service} />
          )}
        </div>
      </div>
    </>
  );
}
