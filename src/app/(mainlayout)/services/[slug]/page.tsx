import React from "react";
import connectDB from "@/lib/db";
import Service from "@/models/Project"; // Import Service model
import { notFound } from "next/navigation";
import Image from "next/image";
import RichTextRenderer from "@/components/RichTextRenderer";
import PricingComponent from "../components/Pricing";
import { FAQSection } from "../components/Faq";
import ServiceSteps from "../components/ServiceSteps"; // Import the ServiceSteps component
import AuthorQuote from "../components/AuthorQuote";


interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getService(slug: string) {
  try {
    await connectDB();
    const service = await Service.findOne({ slug: slug }).exec();

    if (!service) {
      return null;
    }

    return JSON.parse(JSON.stringify(service));
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
      title: "Service Not Found",
    };
  }

  // Create a plain text description from HTML
  const plainTextDescription = service.projectSummary
    ? service.projectSummary.replace(/<[^>]*>/g, "").substring(0, 160)
    : "Professional service offering";

  return {
    title: `${service.title} - Jiapixel Services`,
    description: plainTextDescription,
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

  return (
    <div className="min-h-screen bg-background py-20">
      {/* Hero Section */}
      <div className="container mx-auto px-4">
        <div>
          <span className="inline-block px-4 text-sm font-medium mb-4">
            {mainCategory} › {subcategory}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            {service.title}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div>
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            {/* Service Images */}
            {service.images && service.images.length > 0 && (
              <div>
                {service.images.map((image: string, index: number) => (
                  <div
                    key={index}
                    className="relative items-center aspect-video rounded-lg overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={service.title}
                      width={400}
                      height={300}
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Service Description */}
            <section className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Service Details
              </h2>
              <RichTextRenderer content={service.projectSummary} />
            </section>

            {/* Author Quote Component  */}
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
      </div>
    </div>
  );
}
