import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ShareButtons from './ShareButtons';
import type { Metadata } from 'next';
import { generateHtml } from '@/lib/server-html';
import { extractTextFromProjectDescription } from '@/lib/utils';

interface Portfolio {
  _id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage: string;
  featured: boolean;
  isIndexedInGoogle: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  projectUrl?: string;
  githubUrl?: string;
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPortfolio(slug: string): Promise<Portfolio | null> {
  try {
    const baseUrl = process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com'
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/portfolios/${slug}`, {
      cache: 'force-cache'
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch portfolio: ${response.status}`);
    }

    const data = await response.json();

    // REMOVE THIS STATUS CHECK - show all portfolios regardless of status
    // if (data.portfolio.status !== 'published') {
    //   return null;
    // }

    return data.portfolio;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await getPortfolio(slug);

  if (!portfolio) {
    return {
      title: 'Portfolio Not Found - Jiapixel',
    };
  }

  const baseUrl = 'https://www.jiapixel.com';
  const canonicalUrl = `${baseUrl}/portfolios/${portfolio.slug}`;

  const titleToUse = portfolio.metaTitle || portfolio.title;
  const plainTextTitle = titleToUse.length > 60
    ? `${titleToUse.substring(0, 57)}... - Jiapixel Portfolio`
    : `${titleToUse} - Jiapixel Portfolio`;

  const plainTextDescription = portfolio.metaDescription || extractTextFromProjectDescription(portfolio.content).substring(0, 160);

  return {
    title: plainTextTitle,
    description: plainTextDescription,
    keywords: `web development, portfolio, case studies`,

    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },

    // Open Graph
    openGraph: {
      title: plainTextTitle,
      description: plainTextDescription,
      url: canonicalUrl,
      siteName: 'Jiapixel',
      images: [
        {
          url: portfolio.featuredImage,
          width: 1200,
          height: 630,
          alt: portfolio.title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: plainTextTitle,
      description: plainTextDescription,
      images: [portfolio.featuredImage],
      creator: '@jiapixel',
    },
  };
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const portfolio = await getPortfolio(slug);

  if (!portfolio) {
    notFound();
  }

  // Generate structured data for individual portfolio
  const portfolioStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: portfolio.title,
    description: extractTextFromProjectDescription(portfolio.content).substring(0, 160),
    url: `https://www.jiapixel.com/portfolios/${portfolio.slug}`,
    image: portfolio.featuredImage,
    dateCreated: portfolio.createdAt,
    author: {
      '@type': 'Organization',
      name: 'Jiapixel',
      url: 'https://www.jiapixel.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Jiapixel',
      url: 'https://www.jiapixel.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.jiapixel.com/icon.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.jiapixel.com/portfolios/${portfolio.slug}`
    }
  };

  return (
    <>
      {/* Structured Data for Portfolio */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioStructuredData).replace(/<\/script>/g, '<\\/script>') }}
      />

      <div className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative bg-slate-900 overflow-hidden py-20">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/Assets/banner/portfolio_bg.webp"
              alt={portfolio.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
          </div>

          <div className="container relative mx-auto px-4">
            <Link
              href="/portfolios"
              className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors"
            >
              ← Back to Portfolio
            </Link>

            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                {portfolio.title}
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                {extractTextFromProjectDescription(portfolio.content).substring(0, 200)}
              </p>

              <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
                <div>
                  <strong className="text-white">Published:</strong>{' '}
                  {new Date(portfolio.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Details */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <div className="bg-card rounded-lg overflow-hidden shadow-lg mb-8">
                    <Image
                      src={portfolio.featuredImage}
                      alt={portfolio.title}
                      width={800}
                      height={600}
                      className="w-full h-auto max-h-[600px] object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="prose max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground font-sans leading-normal">
                    <div
                      className="ProseMirror p-0"
                      dangerouslySetInnerHTML={{ __html: generateHtml(portfolio.content) }}
                    />
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-card rounded-lg shadow-lg p-6 sticky top-24">
                    <h3 className="text-xl font-bold text-foreground mb-4">Project Details</h3>

                    {/* Project Links */}
                    <div className="space-y-3">
                      {portfolio.projectUrl && (
                        <Link
                          href={portfolio.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          View Live Project
                        </Link>
                      )}

                      {portfolio.githubUrl && (
                        <Link
                          href={portfolio.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center px-4 py-2 border border-border bg-background text-foreground rounded-lg hover:bg-accent transition-colors"
                        >
                          View Code
                        </Link>
                      )}
                    </div>

                    {/* Share Project - Client Component */}
                    <ShareButtons portfolio={portfolio} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}