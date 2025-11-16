import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact JIA Pixel - Get in Touch | Digital Agency',
  description: 'Contact JIA Pixel digital agency. Let us discuss your project requirements and create amazing digital experiences together. Quick response guaranteed.',
  keywords: 'contact digital agency, web design contact, get quote, project inquiry, JIA Pixel contact',
  
  openGraph: {
    title: 'Contact JIA Pixel - Get in Touch',
    description: 'Get in touch with JIA Pixel digital agency to discuss your project requirements',
    type: 'website',
    url: 'https://www.jiapixel.com/contact',
    siteName: 'JIA Pixel',
    images: [
      {
        url: '/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact JIA Pixel Digital Agency',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Contact JIA Pixel - Get in Touch',
    description: 'Get in touch with JIA Pixel digital agency to discuss your project requirements',
    images: ['/og-contact.jpg'],
  },
  
  alternates: {
    canonical: 'https://www.jiapixel.com/contact',
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}