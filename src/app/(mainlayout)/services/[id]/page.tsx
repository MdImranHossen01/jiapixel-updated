import React from 'react';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import RichTextRenderer from '@/components/RichTextRenderer';


interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getService(id: string) {
  try {
    await connectDB();
    const project = await Project.findById(id).exec();

    if (!project) {
      return null;
    }

    return JSON.parse(JSON.stringify(project));
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const service = await getService(id);
  
  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  // Create a plain text description from HTML
  const plainTextDescription = service.projectSummary
    ? service.projectSummary.replace(/<[^>]*>/g, '').substring(0, 160)
    : 'Professional service offering';

  return {
    title: `${service.title} - Jiapixel Services`,
    description: plainTextDescription,
  };
}

const ServiceDetailsPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    notFound();
  }

  const mainCategory = service.category.split(' > ')[0];
  const subcategory = service.category.split(' > ')[1] || 'General Service';

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
              {mainCategory} › {subcategory}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {service.title}
            </h1>
            <div className="text-xl text-muted-foreground mb-8 leading-relaxed">
              <RichTextRenderer
                content={service.projectSummary} 
                className="text-center"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>⭐</span>
                <span>Professional Service</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🚀</span>
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💼</span>
                <span>{service.maxProjects || 20} Active Projects</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Images */}
            {service.images && service.images.length > 0 && (
              <section className="bg-card rounded-lg border p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Service Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.images.map((image: string, index: number) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`Service image ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Service Description */}
            <section className="bg-card rounded-lg border p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Service Description</h2>
              <RichTextRenderer content={service.projectSummary} />
            </section>

            {/* Rest of your component remains the same... */}
            {/* Project Steps */}
            {service.projectSteps && service.projectSteps.length > 0 && (
              <section className="bg-card rounded-lg border p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">How It Works</h2>
                <div className="space-y-4">
                  {service.projectSteps.map((step: string, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQs */}
            {service.faqs && service.faqs.length > 0 && (
              <section className="bg-card rounded-lg border p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {service.faqs.map((faq: any, index: number) => (
                    <div key={index} className="border-b border-border pb-6 last:border-b-0">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Requirements */}
            {service.requirements && service.requirements.length > 0 && (
              <section className="bg-card rounded-lg border p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">What I Need From You</h2>
                <div className="space-y-3">
                  {service.requirements.map((requirement: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-foreground">{requirement}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Pricing & Action */}
          <div className="space-y-6">
            {/* Pricing Packages */}
            <section className="bg-card rounded-lg border p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Service Packages</h2>
              
              {service.pricingTiers === '1' ? (
                // Single Package
                <div className="space-y-4">
                  <div className="border-2 border-primary rounded-lg p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {service.tiers?.starter?.title || 'Complete Package'}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      {service.tiers?.starter?.description || 'Comprehensive service package'}
                    </p>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-3xl font-bold text-foreground">
                        ${service.tiers?.starter?.price || 0}
                      </span>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery Time</span>
                        <span className="text-foreground font-medium">
                          {service.tiers?.starter?.deliveryDays || 3} days
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Revisions</span>
                        <span className="text-foreground font-medium">
                          {service.tiers?.starter?.revisions || 1}
                        </span>
                      </div>
                    </div>
                    <button className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                      Get Started
                    </button>
                  </div>
                </div>
              ) : (
                // Three Packages
                <div className="space-y-4">
                  {(['starter', 'standard', 'advanced'] as const).map((tier) => {
                    const tierData = service.tiers?.[tier];
                    if (!tierData) return null;

                    return (
                      <div
                        key={tier}
                        className={`border rounded-lg p-6 ${
                          tier === 'standard' ? 'border-2 border-primary' : 'border-border'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-foreground capitalize">
                            {tier}
                          </h3>
                          {tier === 'standard' && (
                            <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-4 text-sm">
                          {tierData.description || `${tier} service package`}
                        </p>
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-2xl font-bold text-foreground">
                            ${tierData.price || 0}
                          </span>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Delivery</span>
                            <span className="text-foreground font-medium">
                              {tierData.deliveryDays || 3} days
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Revisions</span>
                            <span className="text-foreground font-medium">
                              {tierData.revisions || 1}
                            </span>
                          </div>
                        </div>
                        <button
                          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                            tier === 'standard'
                              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          }`}
                        >
                          Select Package
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Features Summary */}
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="font-semibold text-foreground mb-3">What's Included</h4>
                <div className="space-y-2">
                  {service.tiers?.starter?.features && 
                    Object.entries(service.tiers.starter.features)
                      .filter(([_, value]) => value)
                      .slice(0, 5)
                      .map(([feature]) => (
                        <div key={feature} className="flex items-center gap-2 text-sm">
                          <span className="text-primary">✓</span>
                          <span className="text-foreground">{feature}</span>
                        </div>
                      ))
                  }
                  {(!service.tiers?.starter?.features || Object.keys(service.tiers.starter.features).length === 0) && (
                    <p className="text-sm text-muted-foreground">No features specified</p>
                  )}
                </div>
              </div>
            </section>

            {/* Service Provider Info */}
            <section className="bg-card rounded-lg border p-6">
              <h3 className="font-semibold text-foreground mb-4">Service Provider</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">J</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Jiapixel Team</p>
                  <p className="text-sm text-muted-foreground">
                    Professional Service Provider
                  </p>
                </div>
              </div>
            </section>

            {/* Tags */}
            {service.searchTags && service.searchTags.length > 0 && (
              <section className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold text-foreground mb-4">Service Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {service.searchTags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Documents */}
            {service.documents && service.documents.length > 0 && (
              <section className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold text-foreground mb-4">Documents</h3>
                <div className="space-y-2">
                  {service.documents.map((doc: string, index: number) => (
                    <a
                      key={index}
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 border border-border rounded hover:bg-accent transition-colors"
                    >
                      <span className="text-primary">📄</span>
                      <span className="text-sm text-foreground">Document {index + 1}</span>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;