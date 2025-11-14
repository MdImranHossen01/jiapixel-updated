import { Metadata } from 'next'; // Added Metadata import
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ShareButtons from './ShareButtons'; 

const BASE_URL = "https://www.jiapixel.com"; // Define BASE_URL for canonical links

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

interface PageProps {
  params: {
    slug: string;
  };
}

async function getPortfolio(slug: string): Promise<Portfolio | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/portfolios/${slug}`, {
      cache: 'force-cache'
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch portfolio: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.portfolio.status !== 'published') {
      return null;
    }
    
    return data.portfolio;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }
}

// --- ১. ডাইনামিক মেটাডাটা জেনারেশন (SEO Best Practice) ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const portfolio = await getPortfolio(params.slug);

  if (!portfolio) {
    return {
      title: 'Portfolio Not Found',
    };
  }
  
  const currentUrl = `${BASE_URL}/portfolios/${portfolio.slug}`;
  const title = portfolio.metaTitle || `${portfolio.title} | Case Study by Jia Pixel`;
  const description = portfolio.metaDescription || portfolio.description.substring(0, 160);
  const featuredImage = portfolio.featuredImage || `${BASE_URL}/og-default-portfolio.png`;
  const projectDate = portfolio.projectDate ? new Date(portfolio.projectDate).toISOString() : new Date().toISOString();


  return {
    // A. কোর ট্যাগস
    title: title,
    description: description,
    keywords: [portfolio.category, ...portfolio.technologies, 'portfolio', 'case study'].join(', '),

    // B. ক্যানোনিক্যাল লিংক (Self-Referencing)
    alternates: {
        canonical: currentUrl,
    },

    // C. Open Graph (Social Sharing)
    openGraph: {
      title: title,
      description: description,
      url: currentUrl,
      type: 'article', // বা 'website', তবে 'article' বা 'website' পোর্টফোলিওর জন্য সঠিক।
      publishedTime: projectDate,
      modifiedTime: portfolio.updatedAt || projectDate,
      images: [
        {
            url: featuredImage,
            width: 1200,
            height: 630,
            alt: portfolio.title,
        }
      ],
    },

    // D. Twitter Card
    twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: [featuredImage],
        creator: '@jiapixel',
    },
    
    // E. Indexing (Inherited from layout, but explicitly confirmed)
    robots: {
        index: true,
        follow: true,
    }
  };
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { slug } = params;
  const portfolio = await getPortfolio(slug);

  if (!portfolio) {
    notFound();
  }
  
  // --- ২. JSON-LD Schema Markup (Project Schema) ---
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork", // অথবা Project/WebPage ব্যবহার করা যায়
    "name": portfolio.title,
    "description": portfolio.description,
    "url": `${BASE_URL}/portfolios/${portfolio.slug}`,
    "image": portfolio.featuredImage,
    "dateCreated": portfolio.createdAt,
    "keywords": portfolio.technologies.join(', '),
    "publisher": {
      "@type": "Organization",
      "name": "Jia Pixel",
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/icon.png`
      }
    }
  };


  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Schema Injection */}
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <Link 
            href="/portfolios"
            className="inline-flex items-center text-primary hover:text-primary/80 mb-6 transition-colors"
          >
            ← Back to Portfolio
          </Link>
          
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary font-medium mb-4 block">
              {portfolio.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {portfolio.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {portfolio.description}
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div>
                <strong className="text-foreground">Client:</strong> {portfolio.client}
              </div>
              <div>
                <strong className="text-foreground">Date:</strong>{' '}
                {new Date(portfolio.projectDate).toLocaleDateString('en-US', {
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

                {/* Additional Images */}
                {portfolio.images && portfolio.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {portfolio.images.map((image, index) => (
                      <div key={index} className="bg-card rounded-lg overflow-hidden shadow">
                        <Image
                          src={image}
                          alt={`${portfolio.title} - Image ${index + 1}`}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Content */}
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground"
                  dangerouslySetInnerHTML={{ __html: portfolio.content }}
                />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg shadow-lg p-6 sticky top-24">
                  <h3 className="text-xl font-bold text-foreground mb-4">Project Details</h3>
                  
                  {/* Technologies */}
                  {portfolio.technologies && portfolio.technologies.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-foreground mb-3">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {portfolio.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

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
  );
}