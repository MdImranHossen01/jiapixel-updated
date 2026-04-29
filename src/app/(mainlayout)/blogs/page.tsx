import type { Metadata } from 'next';
import BlogsClient from './components/BlogsClient';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://www.jiapixel.com';
  const canonicalUrl = `${baseUrl}/blogs`;

  return {
    title: 'Our Blog - Web Development Insights & Digital Marketing Tips | Jiapixel',
    description: 'Read our latest blog posts about web development, digital marketing, SEO strategies, and technology insights. Stay updated with industry trends and best practices.',
    keywords: 'blog, web development, digital marketing, SEO, technology, tutorials, insights',

    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },

    // Open Graph
    openGraph: {
      title: 'Our Blog - Web Development Insights & Digital Marketing Tips | Jiapixel',
      description: 'Read our latest blog posts about web development, digital marketing, SEO strategies, and technology insights.',
      url: canonicalUrl,
      siteName: 'Jiapixel',
      images: [
        {
          url: 'https://www.jiapixel.com/icon.png',
          width: 1200,
          height: 630,
          alt: 'Jiapixel Blog - Web Development & Digital Marketing Insights',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: 'Our Blog - Web Development Insights & Digital Marketing Tips | Jiapixel',
      description: 'Read our latest blog posts about web development, digital marketing, SEO strategies, and technology insights.',
      images: ['https://www.jiapixel.com/icon.png'],
      creator: '@jiapixel',
    },
  };
}


export default function BlogsPage() {
  const blogStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Jiapixel Blog',
    description: 'Web development insights and digital marketing tips',
    url: 'https://www.jiapixel.com/blogs',
    numberOfItems: 0,
    itemListElement: [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData).replace(/</g, '\\u003c') }}
      />
      <BlogsClient />
    </>
  );
}