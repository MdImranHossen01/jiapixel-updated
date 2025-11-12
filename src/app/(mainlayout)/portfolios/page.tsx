import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Portfolio {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  featuredImage: string;
  images: string[];
  technologies: string[];
  category: string;
  client: string;
  projectDate: string;
  projectUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

interface PortfoliosResponse {
  portfolios: Portfolio[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

async function getPortfolios(): Promise<PortfoliosResponse> {
  try {

    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_API_URL || 'https://jiapixel.com'
      : 'http://localhost:3000';
    
    
    const response = await fetch(`${baseUrl}/api/portfolios?status=published&limit=50`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { 
        revalidate: 60 // Revalidate every 60 seconds
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch portfolios');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    // Return empty data in case of error
    return {
      portfolios: [],
      pagination: {
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      }
    };
  }
}

async function PortfoliosPage() {
  const data = await getPortfolios();
  const portfolios = data.portfolios;

  // Extract unique categories from portfolios
  const categories = ['All', ...new Set(portfolios.map(p => p.category))].filter(Boolean);

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Our Portfolio
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our latest projects and see how we have helped businesses transform their digital presence.
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Category Filter - Note: This is static for now, needs client component for interactivity */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <span
                  key={category}
                  className="px-6 py-2 rounded-full border border-border bg-card text-foreground"
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          {/* Featured Projects */}
          {portfolios.filter(portfolio => portfolio.featured).length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Featured Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolios
                  .filter(portfolio => portfolio.featured)
                  .map((portfolio) => (
                    <PortfolioCard key={portfolio._id} portfolio={portfolio} />
                  ))}
              </div>
            </div>
          )}

          {/* All Projects */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              {portfolios.length === 0 ? 'No Projects Yet' : 'All Projects'}
            </h2>
            
            {portfolios.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No portfolio projects have been published yet. Please check back later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolios.map((portfolio) => (
                  <PortfolioCard key={portfolio._id} portfolio={portfolio} />
                ))}
              </div>
            )}
          </div>

          {/* Load More Button - Note: This needs client component for interactivity */}
          {data.pagination.hasNext && (
            <div className="text-center mt-12">
              <p className="text-muted-foreground text-sm">
                More projects available - pagination coming soon
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  return (
    <Link href={`/portfolios/${portfolio.slug}`}>
      <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] group cursor-pointer h-full flex flex-col">
        <div className="relative overflow-hidden flex-shrink-0">
          <Image
            src={portfolio.featuredImage || '/api/placeholder/400/300'}
            alt={portfolio.title}
            width={400}
            height={300}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {portfolio.featured && (
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </div>
          )}
        </div>
        
        <div className="p-6 flex-grow flex flex-col">
          <span className="text-sm text-primary font-medium mb-2 block">
            {portfolio.category}
          </span>
          
          <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {portfolio.title}
          </h3>
          
          <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
            {portfolio.description}
          </p>
          
          {portfolio.technologies && portfolio.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {portfolio.technologies.slice(0, 3).map((tech: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs"
                >
                  {tech}
                </span>
              ))}
              {portfolio.technologies.length > 3 && (
                <span className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs">
                  +{portfolio.technologies.length - 3} more
                </span>
              )}
            </div>
          )}
          
          <div className="text-sm text-muted-foreground mt-auto">
            {new Date(portfolio.projectDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PortfoliosPage;