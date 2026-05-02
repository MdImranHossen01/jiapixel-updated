import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import PortfoliosClient from './components/PortfoliosClient';
import { extractTextFromProjectDescription } from '@/lib/utils';
import { getPortfolios } from '@/lib/db-utils';

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
  let initialPortfolios = [];
  try {
    initialPortfolios = await getPortfolios() || [];
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    initialPortfolios = [];
  }

  const portfolioStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Jiapixel Portfolio',
    description: 'Web development projects and case studies',
    url: 'https://www.jiapixel.com/portfolios',
    numberOfItems: initialPortfolios?.length || 0,
    itemListElement: initialPortfolios?.map((item: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://www.jiapixel.com/portfolios/${item.slug}`,
    })) || [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioStructuredData).replace(/</g, '\\u003c') }}
      />
      <div className="min-h-screen bg-background">
        <PortfoliosClient initialPortfolios={initialPortfolios || []} />
      </div>
    </>
  );
}

export default PortfoliosPage;

