// G:\jiapixel-updated\src\app\(mainlayout)\refund-policy\page.tsx
import { Metadata } from 'next';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Refund Policy | JIA Pixel - Clear & Transparent Guidelines',
  description: 'JIA Pixel refund policy. Learn about our refund eligibility, process, and terms for digital design and development services. Clear, fair guidelines.',
  keywords: 'refund policy, money back guarantee, digital agency refund, web design refund, service cancellation',
  
  openGraph: {
    title: 'Refund Policy | JIA Pixel',
    description: 'Clear and transparent refund guidelines for JIA Pixel digital services',
    type: 'website',
    url: 'https://www.jiapixel.com/refund-policy',
    siteName: 'JIA Pixel',
    images: [
      {
        url: '/og-refund.jpg',
        width: 1200,
        height: 630,
        alt: 'JIA Pixel Refund Policy',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Refund Policy | JIA Pixel',
    description: 'Clear and transparent refund guidelines for JIA Pixel digital services',
    images: ['/og-refund.jpg'],
  },
  
  alternates: {
    canonical: 'https://www.jiapixel.com/refund-policy',
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

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Refund Policy',
  description: 'Refund policy and guidelines for JIA Pixel digital agency services',
  url: 'https://www.jiapixel.com/refund-policy',
  mainEntity: {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is your refund policy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer full refunds for projects cancelled before work begins, and pro-rated refunds for work in progress. No refunds for completed projects.',
        },
      },
    ],
  },
};

const RefundPolicyPage = () => {
  const refundScenarios = [
    {
      scenario: "Project cancellation before work begins",
      refund: "Full refund of deposit",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      notes: "Must be requested within 24 hours of payment"
    },
    {
      scenario: "Project cancellation after work has started",
      refund: "Pro-rated refund for work not completed",
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      notes: "Based on hours worked and materials used"
    },
    {
      scenario: "Project completed and delivered",
      refund: "No refund available",
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      notes: "All sales are final after project completion"
    },
    {
      scenario: "Client fails to provide required materials",
      refund: "No refund - project may be paused",
      icon: <AlertCircle className="w-5 h-5 text-blue-500" />,
      notes: "After 30 days of inactivity, project may be terminated"
    }
  ];

  const nonRefundableItems = [
    "Initial consultation and strategy sessions",
    "Research and discovery phase work",
    "Stock photography and font licenses",
    "Third-party plugin and software purchases",
    "Domain registration and hosting fees",
    "Rush service fees"
  ];

  const refundProcess = [
    {
      step: "1",
      title: "Submit Refund Request",
      description: "Contact us at refunds@jiapixel.com with your project details and reason for refund request"
    },
    {
      step: "2",
      title: "Review Period",
      description: "We'll review your request within 3-5 business days and assess eligibility"
    },
    {
      step: "3",
      title: "Decision & Processing",
      description: "If approved, refunds are processed within 10 business days to the original payment method"
    },
    {
      step: "4",
      title: "Confirmation",
      description: "You'll receive email confirmation once the refund has been processed"
    }
  ];

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Refund Policy</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Clear and transparent refund guidelines for our digital services
          </p>
          <div className="mt-6 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Overview Card */}
        <Card className="shadow-lg mb-12 border-l-4 border-l-primary">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Policy Overview</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              At JIA Pixel, we strive to deliver exceptional value and quality in all our projects. 
              This refund policy outlines the circumstances under which refunds may be granted and 
              our commitment to fair treatment for both our clients and our team.
            </p>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          
          {/* Refund Eligibility */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Refund Eligibility</h2>
              <div className="space-y-4">
                {refundScenarios.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {item.scenario}
                      </h3>
                      <p className="text-primary font-medium mb-1">
                        {item.refund}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.notes}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Info Sidebar */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Key Points</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>24-hour cooling off period for new projects</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Clock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>10 business days for refund processing</span>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Contact us before disputing with payment processor</span>
                </div>
                <div className="flex items-start space-x-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>No refunds for completed work</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Non-Refundable Items */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">Non-Refundable Items & Services</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {nonRefundableItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              * These items represent costs we incur on your behalf and cannot recover once purchased.
            </p>
          </CardContent>
        </Card>

        {/* Refund Process */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-8">Refund Request Process</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {refundProcess.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Special Circumstances */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">Special Circumstances</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-l-green-500 pl-4 py-2">
                <h3 className="font-semibold text-foreground mb-1">Service Quality Issues</h3>
                <p className="text-muted-foreground">
                  If you're unsatisfied with the quality of our work, we'll make every reasonable effort 
                  to correct the issues before considering a refund. Your satisfaction is our priority.
                </p>
              </div>
              <div className="border-l-4 border-l-amber-500 pl-4 py-2">
                <h3 className="font-semibold text-foreground mb-1">Project Delays</h3>
                <p className="text-muted-foreground">
                  Delays caused by circumstances beyond our control (client responsiveness, third-party 
                  dependencies, etc.) are not grounds for refunds.
                </p>
              </div>
              <div className="border-l-4 border-l-blue-500 pl-4 py-2">
                <h3 className="font-semibold text-foreground mb-1">Change of Mind</h3>
                <p className="text-muted-foreground">
                  We understand that requirements can change. Contact us as soon as possible to discuss 
                  project adjustments rather than cancellation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              If you have questions about our refund policy or need to request a refund, 
              please contact our support team. We're here to help.
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-primary">refunds@jiapixel.com</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Response Time</h3>
                <p className="text-muted-foreground">Within 24 hours</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Policy Footer */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>
            This refund policy is subject to change without notice. Please check this page periodically 
            for updates. By using our services, you acknowledge and agree to this refund policy.
          </p>
        </div>

      </div>
    </div>
    </>
  );
};

export default RefundPolicyPage;