/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import RichTextRenderer from "@/components/RichTextRenderer";
import PricingComponent from "../components/Pricing";
import { FAQSection } from "../components/Faq";
import ServiceSteps from "../components/ServiceSteps";
import AuthorQuote from "../components/AuthorQuote";
import HeroSection from "../components/HeroSection";
import FeaturedCard from "../components/FeaturedCard";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getService(slug: string) {
  try {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_API_URL || "https://jiapixel.com"
        : "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/services/${slug}`, {
      cache: "force-cache",
    });

    if (!response.ok) {
      console.error("Error fetching service:", response.status);
      return null;
    }

    const data = await response.json();
    return data.service || null;
  } catch (error) {
    console.error("Error fetching service:", error);
    return null;
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

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://jiapixel.com";
  const canonicalUrl = `${baseUrl}/services/${service.slug}`;

  // Create plain text descriptions
  const plainTextDescription = service.projectSummary
    ? service.projectSummary.replace(/<[^>]*>/g, "").substring(0, 160)
    : `Professional ${service.title} service by Jiapixel. ${
        service.tiers?.starter?.description || "Get started today!"
      }`;

  const plainTextTitle =
    service.title.length > 60
      ? `${service.title.substring(0, 57)}... - Jiapixel`
      : `${service.title} - Jiapixel Services`;

  // Featured image for social sharing
  const featuredImage = service.images?.[0] || "/icon.png";

  return {
    title: plainTextTitle,
    description: plainTextDescription,
    keywords:
      service.searchTags?.join(", ") ||
      `${service.category}, web development, digital services`,

    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },

    // Open Graph
    openGraph: {
      title: plainTextTitle,
      description: plainTextDescription,
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
      title: plainTextTitle,
      description: plainTextDescription,
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

  // Generate FAQ structured data if FAQs exist
  const faqStructuredData =
    service.faqs && service.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: service.faqs.map((faq: any) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {/* Service-specific Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceStructuredData),
        }}
      />

      {/* FAQ Structured Data if available */}
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData),
          }}
        />
      )}

      <div className="bg-background overflow-hidden py-20">
         
        <div className="container mx-auto px-4 w-full">
         <section>
           <HeroSection
            service={service}
            mainCategory={mainCategory}
            subcategory={subcategory}
          />
         </section>

          {/* Service Description */}
          <section className="py-16">
  
  <div className="container mx-auto px-4">
    <div className="max-w-3xl mx-auto">
      <div className="mb-10">
        <span className="text-primary font-semibold text-lg mb-2 block">Overview</span>
        <h2 className="text-4xl font-bold text-foreground">Service Details</h2>
      </div>
      <div className="prose prose-xl max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground">
        <RichTextRenderer content={service.projectSummary} />
      </div>
    </div>
  </div>
</section>

          {/* featured card section  */}
         
            
              <FeaturedCard />
          
          

          {/* Author Quote Component */}
          <AuthorQuote
            author={service.author}
            authorQuote={service.authorQuote}
          />

          {/* Pricing Component - Only show if service has tiers */}
          {service.tiers && Object.keys(service.tiers).length > 0 && (
            <PricingComponent service={service} />
          )}

          <div>
            <FAQSection faqs={service.faqs} />
          </div>

          {/* Service Steps */}
          {service.projectSteps && service.projectSteps.length > 0 && (
            <ServiceSteps steps={service.projectSteps} />
          )}

          {/* Requirements */}
          {service.requirements && service.requirements.length > 0 && (
            <section className="bg-card rounded-lg border p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                What I Need From You
              </h2>
              <div className="space-y-3">
                {service.requirements.map(
                  (requirement: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-foreground">{requirement}</span>
                    </div>
                  )
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
