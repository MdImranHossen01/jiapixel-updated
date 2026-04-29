import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import PortfoliosClient from './components/PortfoliosClient';
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

function PortfoliosPage() {
  const portfolioStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Jiapixel Portfolio',
    description: 'Web development projects and case studies',
    url: 'https://www.jiapixel.com/portfolios',
    numberOfItems: 0,
    itemListElement: [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioStructuredData).replace(/<\/script>/g, '<\\/script>') }}
      />
      <div className="min-h-screen bg-background">
        <PortfoliosClient />
      </div>
    </>
  );
}

export default PortfoliosPage;

