import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import PortfoliosClient from './components/PortfoliosClient';

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
      ? process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com'
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/portfolios?status=published&limit=50`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 86400
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch portfolios');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching portfolios:', error);
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

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://www.jiapixel.com';
  const canonicalUrl = `${baseUrl}/portfolios`;

  return {
    title: 'Our Portfolio - Web Development Projects & Case Studies | Jiapixel',
    description: 'Explore our portfolio of web development projects, mobile apps, and digital solutions. See how we help businesses succeed with custom technology solutions.',
    keywords: 'portfolio, web development projects, case studies, web design, mobile apps, Bangladesh',

    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },

    // Open Graph
    openGraph: {
      title: 'Our Portfolio - Web Development Projects & Case Studies | Jiapixel',
      description: 'Explore our portfolio of web development projects, mobile apps, and digital solutions.',
      url: canonicalUrl,
      siteName: 'Jiapixel',
      images: [
        {
          url: 'https://www.jiapixel.com/icon.png',
          width: 1200,
          height: 630,
          alt: 'Jiapixel Portfolio - Web Development Projects',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: 'Our Portfolio - Web Development Projects & Case Studies | Jiapixel',
      description: 'Explore our portfolio of web development projects, mobile apps, and digital solutions.',
      images: ['https://www.jiapixel.com/icon.png'],
      creator: '@jiapixel',
    },
  };
}

async function PortfoliosPage() {
  const data = await getPortfolios();
  const portfolios = data.portfolios;

  // Extract unique categories from portfolios
  // const categories = ['All', ...new Set(portfolios.map(p => p.category))].filter(Boolean);

  const portfolioStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Jiapixel Portfolio',
    description: 'Web development projects and case studies',
    url: 'https://www.jiapixel.com/portfolios',
    numberOfItems: portfolios.length,
    itemListElement: portfolios.map((portfolio: Portfolio, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: portfolio.title,
        description: portfolio.description,
        url: `https://www.jiapixel.com/portfolios/${portfolio.slug}`,
        image: portfolio.featuredImage,
        dateCreated: portfolio.projectDate,
        author: {
          '@type': 'Organization',
          name: 'Jiapixel',
          url: 'https://www.jiapixel.com'
        }
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioStructuredData) }}
      />
      <div className="min-h-screen bg-background">
        <PortfoliosClient initialPortfolios={portfolios} pagination={data.pagination} />
      </div>
    </>
  );
}

export default PortfoliosPage;