import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ReadOnlyEditor from '@/components/tiptap-templates/simple/read-only-editor';

interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  detailedDescription: string;
  featuredImage: string;
  images: string[];
  category: string;
  tags: string[];
  price: {
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  features: string[];
  specifications: {
    name: string;
    value: string;
  }[];
  demoUrl?: string;
  documentationUrl?: string;
  supportIncluded: boolean;
  updatesIncluded: boolean;
  createdAt: string;
  updatedAt: string;
}

import { getProductBySlug, getProducts } from '@/lib/db-utils';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug) as Product;

  if (!product) {
    return {
      title: 'Product Not Found - Jiapixel',
    };
  }

  const baseUrl = 'https://www.jiapixel.com';
  const canonicalUrl = `${baseUrl}/products/${product.slug}`;

  return {
    title: product.title,
    description: product.shortDescription,
    keywords: `${product.category}, ${product.tags?.join(', ')}, digital product, SaaS`,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: product.title,
      description: product.shortDescription,
      url: canonicalUrl,
      siteName: 'Jiapixel',
      images: [
        {
          url: product.featuredImage,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.shortDescription,
      images: [product.featuredImage],
      creator: '@jiapixel',
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug) as Product;

  if (!product) {
    notFound();
  }

  const calculateSavings = (monthly: number, yearly: number) => {
    if (!monthly || monthly <= 0) return 0;
    const yearlyCostMonthly = yearly / 12;
    const savings = ((monthly - yearlyCostMonthly) / monthly) * 100;
    return Math.round(savings);
  };

  const savings = calculateSavings(product.price.monthly, product.price.yearly);

  // Generate structured data
  const productStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.shortDescription,
    image: product.featuredImage,
    offers: {
      '@type': 'AggregateOffer',
      offerCount: 3,
      lowPrice: Math.min(product.price.monthly, product.price.quarterly, product.price.yearly),
      highPrice: Math.max(product.price.monthly, product.price.quarterly, product.price.yearly),
      priceCurrency: 'USD',
      offers: [
        {
          '@type': 'Offer',
          price: product.price.monthly,
          priceCurrency: 'USD',
          priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          description: 'Monthly subscription'
        },
        {
          '@type': 'Offer',
          price: product.price.quarterly,
          priceCurrency: 'USD',
          priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          description: 'Quarterly subscription'
        },
        {
          '@type': 'Offer',
          price: product.price.yearly,
          priceCurrency: 'USD',
          priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          description: 'Yearly subscription'
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData).replace(/<\s*\/script\s*>/gi, '<\\/script>') }}
      />

      <div className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="bg-linear-to-br from-primary/10 to-secondary/10 py-16">
          <div className="container mx-auto px-4">
            <Link
              href="/products"
              className="inline-flex items-center text-primary hover:text-primary/80 mb-6 transition-colors"
            >
              ← Back to Products
            </Link>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Product Image */}
                <div className="relative">
                  <div className="bg-card rounded-2xl shadow-xl overflow-hidden">
                    <Image
                      src={product.featuredImage}
                      alt={product.title}
                      width={600}
                      height={400}
                      className="w-full h-auto"
                    />
                  </div>

                  {/* Additional Images */}
                  {product.images && product.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {product.images.map((image, index) => (
                        <div key={index} className="bg-card rounded-lg overflow-hidden shadow">
                          <Image
                            src={image}
                            alt={`${product.title} - Image ${index + 1}`}
                            width={200}
                            height={150}
                            className="w-full h-24 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  <div>
                    <span className="text-primary font-medium mb-2 block">
                      {product.category}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                      {product.title}
                    </h1>
                    <p className="text-xl text-muted-foreground">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Monthly */}
                    <div className="bg-card border border-border rounded-xl p-6 text-center">
                      <h3 className="font-semibold text-foreground mb-2">Monthly</h3>
                      <div className="text-2xl font-bold text-foreground mb-2">
                        ${product.price.monthly}
                        <span className="text-sm text-muted-foreground font-normal">/mo</span>
                      </div>
                      <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                        Get Started
                      </button>
                    </div>

                    {/* Quarterly */}
                    <div className="bg-card border border-border rounded-xl p-6 text-center">
                      <h3 className="font-semibold text-foreground mb-2">3 Months</h3>
                      <div className="text-2xl font-bold text-foreground mb-2">
                        ${product.price.quarterly}
                        <span className="text-sm text-muted-foreground font-normal">/3mo</span>
                      </div>
                      <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                        Get Started
                      </button>
                    </div>

                    {/* Yearly - Featured */}
                    <div className="bg-primary/10 border-2 border-primary rounded-xl p-6 text-center relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                          Best Value
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">Yearly</h3>
                      <div className="text-2xl font-bold text-primary mb-1">
                        ${product.price.yearly}
                        <span className="text-sm text-muted-foreground font-normal">/year</span>
                      </div>
                      {savings > 0 && (
                        <div className="text-sm text-green-600 font-medium mb-2">
                          Save {savings}%
                        </div>
                      )}
                      <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                        Get Started
                      </button>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-4">
                    {product.supportIncluded && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Support Included</span>
                      </div>
                    )}
                    {product.updatesIncluded && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Updates Included</span>
                      </div>
                    )}
                  </div>

                  {/* Action Links */}
                  <div className="flex gap-4">
                    {product.demoUrl && (
                      <Link
                        href={product.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-secondary text-secondary-foreground py-3 px-4 rounded-lg font-semibold hover:bg-secondary/80 transition-colors text-center"
                      >
                        View Demo
                      </Link>
                    )}
                    {product.documentationUrl && (
                      <Link
                        href={product.documentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 border border-border bg-background text-foreground py-3 px-4 rounded-lg font-semibold hover:bg-accent transition-colors text-center"
                      >
                        Documentation
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Detailed Description - Using ReadOnlyEditor like blog */}
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-6">Product Details</h2>
                    <div className="bg-card rounded-xl p-6 border border-border">
                      <ReadOnlyEditor content={product.detailedDescription} />
                    </div>
                  </div>

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div>
                      <h2 className="text-3xl font-bold text-foreground mb-6">Features</h2>
                      <div className="bg-card rounded-xl p-6 border border-border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {product.features.map((feature, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></span>
                              <span className="text-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Specifications */}
                  {product.specifications && product.specifications.length > 0 && (
                    <div className="bg-card rounded-xl p-6 border border-border">
                      <h3 className="text-xl font-bold text-foreground mb-4">Specifications</h3>
                      <div className="space-y-3">
                        {product.specifications.map((spec, index) => (
                          <div key={index} className="flex justify-between border-b border-border pb-2">
                            <span className="text-muted-foreground font-medium">{spec.name}:</span>
                            <span className="text-foreground">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="bg-card rounded-xl p-6 border border-border">
                      <h3 className="text-xl font-bold text-foreground mb-4">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((product: any) => ({
      slug: product.slug,
    }));
  } catch (error) {
    return [];
  }
}