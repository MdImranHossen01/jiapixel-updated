/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import type { Metadata } from "next";
import ServiceCard from "@/components/ServiceCard";
import ServicesStructuredData from "@/components/ServicesStructuredData";

// Service category icons
const categoryIcons = {
  "Web Development": "💻",
  "SEO Services": "🔍",
  "Digital Marketing": "📈",
};

async function getServices() {
  try {
    // Use environment-aware URL for API calls
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_API_URL || "https://www.jiapixel.com"
        : "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/services?isFeatured=true`, {
      // ← ADD FILTER
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error("Error fetching services:", response.status);
      return [];
    }

    const data = await response.json();
    return data.services || [];
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

  // Group services by category
  const servicesByCategory = services.reduce((acc: any, service: any) => {
    const mainCategory = service.category?.split(" > ")[0] || "Other";
    if (!acc[mainCategory]) {
      acc[mainCategory] = [];
    }
    acc[mainCategory].push(service);
    return acc;
  }, {});

  const categories = Object.keys(servicesByCategory);

  return (
    <>
      <ServicesStructuredData data={servicesStructuredData} />


      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Our Professional Services
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Discover our comprehensive range of digital services designed to
                elevate your business. From web development to digital
                marketing, we&apos;ve got you covered.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Services by Category */}
            {categories.length > 0 ? (
              <div className="space-y-16">
                {categories.map((category) => (
                  <div
                    key={category}
                    id={category.toLowerCase().replace(" ", "-")}
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="text-3xl">
                        {categoryIcons[
                          category as keyof typeof categoryIcons
                        ] || "⚡"}
                      </div>
                      <h2 className="text-3xl font-bold text-foreground">
                        {category}
                      </h2>
                      <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {servicesByCategory[category].length} services
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {servicesByCategory[category].map((service: any) => {
                        const subcategory =
                          service.category?.split(" > ")[1] ||
                          "General Service";

                        return (
                          <ServiceCard
                            key={service._id}
                            service={service}
                            category={category}
                            subcategory={subcategory}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    No Services Available
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    We&apos;re currently setting up our services. Please check
                    back soon for amazing offers!
                  </p>
                  <Link
                    href="/dashboard/services/create"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Create Your First Service
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicesPage;
