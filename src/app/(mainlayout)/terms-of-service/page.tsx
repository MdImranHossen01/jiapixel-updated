// G:\jiapixel-updated\src\app\(mainlayout)\terms-of-service\page.tsx
import { Metadata } from 'next';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Terms of Service | JIA Pixel - Digital Agency',
  description: 'Read JIA Pixel Terms of Service. Learn about our policies for website usage, services, intellectual property, payments, and client agreements.',
  keywords: 'terms of service, legal agreement, digital agency terms, web design terms, development agreement',
  
  // Open Graph
  openGraph: {
    title: 'Terms of Service | JIA Pixel',
    description: 'Legal terms and conditions for JIA Pixel digital agency services',
    type: 'website',
    url: 'https://www.jiapixel.com/terms-of-service',
    siteName: 'JIA Pixel',
    locale: 'en_US',
    images: [
      {
        url: '/og-terms.jpg',
        width: 1200,
        height: 630,
        alt: 'JIA Pixel Terms of Service',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | JIA Pixel',
    description: 'Legal terms and conditions for JIA Pixel digital agency services',
    images: ['/og-terms.jpg'],
  },
  
  // Canonical
  alternates: {
    canonical: 'https://www.jiapixel.com/terms-of-service',
  },
  
  // Robots
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
  
  // Additional Meta
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console code
  },
};

// Add structured data
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Terms of Service',
  description: 'Terms of Service for JIA Pixel digital agency',
  url: 'https://www.jiapixel.com/terms-of-service',
  publisher: {
    '@type': 'Organization',
    name: 'JIA Pixel',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.jiapixel.com/logo.png',
    },
  },
};

const TermsOfServicePage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground">
              
              {/* Introduction */}
              <section className="mb-12">
                <p className="text-lg leading-relaxed">
                  Welcome to JIA Pixel. These Terms of Service govern your use of our website and services. 
                  By accessing or using our services, you agree to be bound by these terms.
                </p>
              </section>

              {/* Services Description */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">1. Services Overview</h2>
                <p className="mb-4">
                  JIA Pixel provides digital design and development services including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                  <li>Website design and development</li>
                  <li>UI/UX design services</li>
                  <li>Brand identity design</li>
                  <li>Digital marketing services</li>
                  <li>Consulting and strategy services</li>
                </ul>
              </section>

              {/* User Responsibilities */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">2. User Responsibilities</h2>
                <p className="mb-4">When using our services, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the confidentiality of your account</li>
                  <li>Not use our services for any illegal or unauthorized purpose</li>
                  <li>Not interfere with or disrupt the service or servers</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </section>

              {/* Intellectual Property */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">3. Intellectual Property</h2>
                <p className="mb-4">
                  All content, features, and functionality on our website, including but not limited to text, 
                  graphics, logos, and software, are the exclusive property of JIA Pixel and are protected by 
                  international copyright, trademark, and other intellectual property laws.
                </p>
                <p className="mb-4">
                  Upon full payment, clients receive ownership of the final delivered work, while JIA Pixel 
                  retains the right to display the work in our portfolio and marketing materials.
                </p>
              </section>

              {/* Payments and Refunds */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">4. Payments and Refunds</h2>
                <p className="mb-4">
                  <strong>Payment Terms:</strong> Projects require a 50% deposit to begin work, with the 
                  balance due upon project completion unless otherwise agreed in writing.
                </p>
                <p className="mb-4">
                  <strong>Refund Policy:</strong> Deposits are non-refundable once work has commenced. 
                  If a project is canceled after work has begun, clients will be billed for work completed 
                  up to the cancellation date.
                </p>
                <p className="mb-4">
                  <strong>Late Payments:</strong> Accounts overdue by more than 30 days may be subject to 
                  late fees and suspension of services.
                </p>
              </section>

              {/* Project Timelines */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">5. Project Timelines</h2>
                <p className="mb-4">
                  Project timelines are estimates and may be affected by client responsiveness, scope changes, 
                  and other factors. JIA Pixel will make reasonable efforts to meet agreed-upon deadlines but 
                  cannot guarantee specific completion dates.
                </p>
              </section>

              {/* Client Content */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">6. Client Content</h2>
                <p className="mb-4">
                  Clients are responsible for providing all necessary content, images, and materials in a 
                  timely manner. JIA Pixel is not responsible for delays caused by late content delivery.
                </p>
                <p className="mb-4">
                  Clients must ensure they have proper rights and permissions for all materials provided 
                  to JIA Pixel for use in projects.
                </p>
              </section>

              {/* Revisions */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">7. Revisions and Changes</h2>
                <p className="mb-4">
                  Each project includes a specified number of revision rounds as outlined in the project proposal. 
                  Additional revisions may be subject to additional charges.
                </p>
                <p className="mb-4">
                  Significant changes to project scope after work has commenced may require a new proposal 
                  and adjusted pricing.
                </p>
              </section>

              {/* Termination */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">8. Termination</h2>
                <p className="mb-4">
                  Either party may terminate a project with written notice. Upon termination, the client 
                  will be responsible for payment for all work completed up to the termination date.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">9. Limitation of Liability</h2>
                <p className="mb-4">
                  JIA Pixel's total liability for any claim arising out of or relating to our services shall 
                  not exceed the total amount paid by the client for the specific project in question.
                </p>
                <p className="mb-4">
                  JIA Pixel shall not be liable for any indirect, special, or consequential damages arising 
                  from the use of our services.
                </p>
              </section>

              {/* Indemnification */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">10. Indemnification</h2>
                <p className="mb-4">
                  You agree to indemnify and hold harmless JIA Pixel and its employees from any claims, 
                  damages, or expenses arising from your use of our services or violation of these terms.
                </p>
              </section>

              {/* Governing Law */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">11. Governing Law</h2>
                <p className="mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of the State 
                  of California, without regard to its conflict of law provisions.
                </p>
              </section>

              {/* Changes to Terms */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">12. Changes to Terms</h2>
                <p className="mb-4">
                  We reserve the right to modify these terms at any time. We will notify users of any 
                  material changes by posting the new Terms of Service on this page and updating the 
                  "Last updated" date.
                </p>
              </section>

              {/* Contact Information */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">13. Contact Information</h2>
                <p className="mb-4">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="mb-2"><strong>Email:</strong> legal@jiapixel.com</p>
                  <p className="mb-2"><strong>Address:</strong> 123 Design Street, Creative District, CA 90210</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                </div>
              </section>

              {/* Acceptance */}
              <section>
                <h2 className="text-2xl font-bold mb-6">14. Acceptance of Terms</h2>
                <p className="mb-4">
                  By using our website and services, you signify your acceptance of these terms. 
                  If you do not agree to these terms, please do not use our services.
                </p>
                <p>
                  Your continued use of the website following the posting of changes to these terms 
                  will be deemed your acceptance of those changes.
                </p>
              </section>

            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-12 text-muted-foreground">
          <p>
            This document constitutes the entire agreement between you and JIA Pixel regarding 
            the use of our services.
          </p>
        </div>
      </div>
    </div>
     </>
  );
};

export default TermsOfServicePage;