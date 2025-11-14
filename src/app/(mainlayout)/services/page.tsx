/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import RichTextRenderer from '@/components/RichTextRenderer';
import type { Metadata } from 'next';

// Service category icons
const categoryIcons = {
  'Web Development': '💻',
  'SEO Services': '🔍',
  'Digital Marketing': '📈',
};

async function getServices() {
  try {
    // Use environment-aware URL for API calls
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com'
      : 'http://localhost:3000';    
    const response = await fetch(`${baseUrl}/api/services`, {
       next: { revalidate: 300 }
    });

    if (!response.ok) {
      console.error('Error fetching services:', response.status);
      return [];
    }

    const data = await response.json();
    return data.services || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://www.jiapixel.com';
  const canonicalUrl = `${baseUrl}/services`;

  return {
    title: 'Our Services - Professional Web Development & Digital Marketing | Jiapixel',
    description: 'Explore our professional services including web development, SEO, digital marketing, and more. Get custom solutions for your business growth.',
    keywords: 'web development, SEO services, digital marketing, web design, e-commerce development, Bangladesh agency',
    
    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },
    
    // Open Graph
    openGraph: {
      title: 'Our Services - Professional Web Development & Digital Marketing | Jiapixel',
      description: 'Explore our professional services including web development, SEO, digital marketing, and more. Get custom solutions for your business growth.',
      url: canonicalUrl,
      siteName: 'Jiapixel',
      images: [
        {
          url: 'https://www.jiapixel.com/icon.png',
          width: 1200,
          height: 630,
          alt: 'Jiapixel Services - Web Development & Digital Marketing',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: 'Our Services - Professional Web Development & Digital Marketing | Jiapixel',
      description: 'Explore our professional services including web development, SEO, digital marketing, and more.',
      images: ['https://www.jiapixel.com/icon.png'],
      creator: '@jiapixel',
    },
  };
}

const ServicesPage = async () => {
  const services = await getServices();

  // Generate structured data for services listing
  const servicesStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Jiapixel Services',
    description: 'Professional web development and digital marketing services',
    url: 'https://www.jiapixel.com/services',
    numberOfItems: services.length,
    itemListElement: services.map((service: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.title,
        description: service.projectSummary?.replace(/<[^>]*>/g, "").substring(0, 200) || service.tiers?.starter?.description,
        url: `https://www.jiapixel.com/services/${service.slug}`,
        offers: Object.values(service.tiers || {}).map((tier: any) => ({
          '@type': 'Offer',
          name: tier.title,
          price: tier.price,
          priceCurrency: 'USD',
        })),
      },
    })),
  };

  // Group services by category
  const servicesByCategory = services.reduce((acc: any, service: any) => {
    const mainCategory = service.category?.split(' > ')[0] || 'Other';
    if (!acc[mainCategory]) {
      acc[mainCategory] = [];
    }
    acc[mainCategory].push(service);
    return acc;
  }, {});

  const categories = Object.keys(servicesByCategory);

  return (
    <>
      {/* Structured Data for Services Listing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesStructuredData) }}
      />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Our Professional Services
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Discover our comprehensive range of digital services designed to elevate your business. 
                From web development to digital marketing, we&apos;ve got you covered.
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
                  <div key={category} id={category.toLowerCase().replace(' ', '-')}>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="text-3xl">
                        {categoryIcons[category as keyof typeof categoryIcons] || '⚡'}
                      </div>
                      <h2 className="text-3xl font-bold text-foreground">{category}</h2>
                      <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {servicesByCategory[category].length} services
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {servicesByCategory[category].map((service: any) => {
                        const subcategory = service.category?.split(' > ')[1] || 'General Service';
                        const mainTier = service.tiers?.starter;
                        const featuredImage = service.images?.[0];

                        return (
                          <Link
                            key={service._id}
                            href={`/services/${service.slug}`}
                            className="group"
                          >
                            <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                            
                              {/* Service Image */}
                              {featuredImage ? (
                                <div className="relative h-48 overflow-hidden">
                                  <Image
                                    src={featuredImage}
                                    alt={service.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute top-3 left-3">
                                    <span className="bg-background/90 backdrop-blur-sm text-foreground px-2 py-1 rounded text-xs font-medium">
                                      {subcategory}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                  <div className="text-4xl">
                                    {categoryIcons[category as keyof typeof categoryIcons] || '⚡'}
                                  </div>
                                </div>
                              )}

                              {/* Service Content */}
                              <div className="p-6 flex-1 flex flex-col">
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                    {service.title}
                                  </h3>
                                  <div className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
                                    <RichTextRenderer 
                                      content={service.projectSummary} 
                                      className="line-clamp-3"
                                    />
                                  </div>
                                </div>

                                {/* Service Meta */}
                                <div className="space-y-3 mt-4">
                                  {/* Price & Delivery */}
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-2xl font-bold text-foreground">
                                        ${mainTier?.price || 0}
                                      </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {mainTier?.deliveryDays || 3} day delivery
                                    </div>
                                  </div>

                                  {/* Features Preview */}
                                  {mainTier?.features && (
                                    <div className="flex flex-wrap gap-1">
                                      {Object.entries(mainTier.features)
                                        .filter(([_, value]) => value)
                                        .slice(0, 3)
                                        .map(([feature]) => (
                                          <span
                                            key={feature}
                                            className="bg-primary/10 text-primary px-2 py-1 rounded text-xs"
                                          >
                                            {feature.split(' ')[0]}
                                          </span>
                                        ))}
                                    </div>
                                  )}

                                  {/* Service Provider */}
                                  <div className="flex items-center justify-between pt-3 border-t border-border">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span className="text-primary text-xs font-semibold">
                                          J
                                        </span>
                                      </div>
                                      <span className="text-sm text-muted-foreground">
                                        Jiapixel Team
                                      </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {service.maxProjects || 20} slots
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
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
                    We&apos;re currently setting up our services. Please check back soon for amazing offers!
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