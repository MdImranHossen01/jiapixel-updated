// G:\jiapixel-updated\src\app\(mainlayout)\privacy-policy\page.tsx
import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Eye, User, Database, Lock, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read JIA Pixel Privacy Policy. Learn how we collect, use, and protect your personal data. Your privacy and data security are our top priorities.',
  keywords: 'privacy policy, data protection, GDPR, personal data, privacy policy digital agency, data security',

  openGraph: {
    title: 'Privacy Policy | JIA Pixel',
    description: 'Learn how JIA Pixel collects, uses, and protects your personal data',
    type: 'website',
    url: 'https://www.jiapixel.com/privacy-policy',
    siteName: 'JIA Pixel',
    images: [
      {
        url: '/og-privacy.jpg',
        width: 1200,
        height: 630,
        alt: 'JIA Pixel Privacy Policy',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | JIA Pixel',
    description: 'Learn how JIA Pixel collects, uses, and protects your personal data',
    images: ['/og-privacy.jpg'],
  },

  alternates: {
    canonical: 'https://www.jiapixel.com/privacy-policy',
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
  name: 'Privacy Policy',
  description: 'Privacy Policy for JIA Pixel digital agency',
  url: 'https://www.jiapixel.com/privacy-policy',
  publisher: {
    '@type': 'Organization',
    name: 'JIA Pixel',
  },
};

const PrivacyPolicyPage = () => {
  const dataCollectionPoints = [
    {
      icon: <User className="w-5 h-5" />,
      point: 'Contact forms and inquiry submissions',
    },
    {
      icon: <Eye className="w-5 h-5" />,
      point: 'Website usage analytics and cookies',
    },
    {
      icon: <Mail className="w-5 h-5" />,
      point: 'Email communications and newsletters',
    },
    {
      icon: <Database className="w-5 h-5" />,
      point: 'Project management and client portals',
    },
  ];

  const dataRights = [
    'Right to access your personal data',
    'Right to correct inaccurate data',
    'Right to request data deletion',
    'Right to restrict processing',
    'Right to data portability',
    'Right to object to processing',
  ];

  const securityMeasures = [
    'Encrypted data transmission (SSL/TLS)',
    'Secure server infrastructure',
    'Regular security audits',
    'Access control and authentication',
    'Data backup and recovery',
    'Employee privacy training',
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen  py-20">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
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
                At JIA Pixel, we are committed to protecting your privacy and ensuring the security of your personal data.
                This Privacy Policy outlines how we collect, use, store, and protect your information when you use our services.
              </p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">

              {/* Information We Collect */}
              <section>
                <h2 className="text-2xl font-bold mb-6">1. Information We Collect</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                    <p className="text-muted-foreground mb-4">
                      We may collect personal information that you voluntarily provide to us, including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Name, email address, and phone number</li>
                      <li>Company name and job title</li>
                      <li>Project requirements and business information</li>
                      <li>Billing and payment information</li>
                      <li>Communication preferences</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Automatically Collected Information</h3>
                    <p className="text-muted-foreground">
                      When you visit our website, we may automatically collect certain information about your device and usage patterns,
                      including IP address, browser type, pages visited, and time spent on our site.
                    </p>
                  </div>
                </div>
              </section>

              {/* How We Use Your Information */}
              <section>
                <h2 className="text-2xl font-bold mb-6">2. How We Use Your Information</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>We use the information we collect for various purposes, including:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Providing and maintaining our services</li>
                    <li>Communicating with you about projects and updates</li>
                    <li>Processing payments and managing accounts</li>
                    <li>Improving our website and services</li>
                    <li>Sending marketing communications (with your consent)</li>
                    <li>Complying with legal obligations</li>
                  </ul>
                </div>
              </section>

              {/* Data Collection Points */}
              <section>
                <h2 className="text-2xl font-bold mb-6">3. Data Collection Points</h2>
                <div className="grid gap-4">
                  {dataCollectionPoints.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="text-primary mt-0.5 flex-shrink-0">
                        {item.icon}
                      </div>
                      <p className="text-muted-foreground">{item.point}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Data Sharing */}
              <section>
                <h2 className="text-2xl font-bold mb-6">4. Data Sharing and Disclosure</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We do not sell, trade, or rent your personal information to third parties. We may share your information with:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Service providers who assist in our operations</li>
                    <li>Legal authorities when required by law</li>
                    <li>Professional advisors (lawyers, accountants)</li>
                    <li>Business partners with your explicit consent</li>
                  </ul>
                  <p>
                    All third-party service providers are required to maintain the confidentiality and security of your information.
                  </p>
                </div>
              </section>

              {/* Data Security */}
              <section>
                <h2 className="text-2xl font-bold mb-6">5. Data Security</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    We implement appropriate technical and organizational security measures to protect your personal data
                    against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {securityMeasures.map((measure, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Lock className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">{measure}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Your Rights */}
              <section>
                <h2 className="text-2xl font-bold mb-6">6. Your Data Protection Rights</h2>
                <p className="text-muted-foreground mb-4">
                  Depending on your location, you may have the following rights regarding your personal data:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {dataRights.map((right, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">{right}</span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground mt-4 text-sm">
                  To exercise any of these rights, please contact us using the information provided below.
                </p>
              </section>

              {/* Cookies */}
              <section>
                <h2 className="text-2xl font-bold mb-6">7. Cookies and Tracking Technologies</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We use cookies and similar tracking technologies to enhance your experience on our website.
                    Cookies are small text files stored on your device that help us:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze website traffic and usage patterns</li>
                    <li>Improve our website functionality</li>
                    <li>Provide personalized content</li>
                  </ul>
                  <p>
                    You can control cookie preferences through your browser settings. However, disabling cookies
                    may affect your experience on our website.
                  </p>
                </div>
              </section>

              {/* Data Retention */}
              <section>
                <h2 className="text-2xl font-bold mb-6">8. Data Retention</h2>
                <p className="text-muted-foreground">
                  We retain personal data only for as long as necessary to fulfill the purposes for which it was collected,
                  including for the purposes of satisfying any legal, accounting, or reporting requirements. Typically,
                  we retain client data for 7 years after the completion of services, unless a longer retention period is
                  required by law.
                </p>
              </section>

              {/* International Transfers */}
              <section>
                <h2 className="text-2xl font-bold mb-6">9. International Data Transfers</h2>
                <p className="text-muted-foreground">
                  Your information may be transferred to and maintained on computers located outside of your state, province,
                  country, or other governmental jurisdiction where the data protection laws may differ. We ensure appropriate
                  safeguards are in place to protect your data during international transfers.
                </p>
              </section>

              {/* Children's Privacy */}
              <section>
                <h2 className="text-2xl font-bold mb-6">10. Children&apos;s Privacy</h2>
                <p className="text-muted-foreground">
                  Our services are not intended for individuals under the age of 16. We do not knowingly collect personal
                  information from children under 16. If you become aware that a child has provided us with personal data,
                  please contact us immediately.
                </p>
              </section>

              {/* Policy Updates */}
              <section>
                <h2 className="text-2xl font-bold mb-6">11. Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
                  Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this Privacy
                  Policy periodically for any changes.
                </p>
              </section>

            </div>

            {/* Quick Info Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                  <div className="space-y-3 text-sm">
                    <a href="#information-collected" className="block text-primary hover:underline">Information We Collect</a>
                    <a href="#data-usage" className="block text-primary hover:underline">How We Use Data</a>
                    <a href="#your-rights" className="block text-primary hover:underline">Your Rights</a>
                    <a href="#contact" className="block text-primary hover:underline">Contact Us</a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Key Principles</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start space-x-2">
                      <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>We never sell your personal data</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Lock className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Industry-standard security measures</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Eye className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Transparent data practices</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <User className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>You control your data</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Information */}
          <Card id="contact">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                If you have any questions about this Privacy Policy or wish to exercise your data protection rights,
                please contact our Data Protection Officer.
              </p>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-primary">privacy@jiapixel.com</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Response Time</h3>
                  <p className="text-muted-foreground">Within 48 hours</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p className="text-muted-foreground">123 Design Street, Creative District, CA 90210</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policy Footer */}
          <div className="text-center mt-12 text-sm text-muted-foreground">
            <p>
              This Privacy Policy is compliant with GDPR, CCPA, and other applicable data protection regulations.
              By using our services, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;