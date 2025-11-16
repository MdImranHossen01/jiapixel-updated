// G:\jiapixel-updated\src\app\(mainlayout)\about\page.tsx
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BackgroundLines } from '@/components/ui/background-lines';
import { 
  Users, Target, Award, TrendingUp,
  HeartHandshake, Lightbulb, Rocket, Shield
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About JIA Pixel - Digital Agency | Our Story, Team & Values',
  description: 'Learn about JIA Pixel digital agency. Our story, team, values, and process for creating exceptional digital experiences that drive business growth.',
  keywords: 'digital agency about, web design company, development team, creative agency, JIA Pixel team',
  
  openGraph: {
    title: 'About JIA Pixel - Digital Agency',
    description: 'Learn about our story, team, and values at JIA Pixel digital agency',
    type: 'website',
    url: 'https://www.jiapixel.com/about',
    siteName: 'JIA Pixel',
    images: [
      {
        url: '/og-about.jpg',
        width: 1200,
        height: 630,
        alt: 'About JIA Pixel Digital Agency',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'About JIA Pixel - Digital Agency',
    description: 'Learn about our story, team, and values at JIA Pixel digital agency',
    images: ['/og-about.jpg'],
  },
  
  alternates: {
    canonical: 'https://www.jiapixel.com/about',
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
  '@type': 'AboutPage',
  name: 'About JIA Pixel',
  description: 'Digital agency specializing in web design, development, and digital marketing',
  url: 'https://www.jiapixel.com/about',
  publisher: {
    '@type': 'Organization',
    name: 'JIA Pixel',
    description: 'Digital agency creating exceptional digital experiences',
    url: 'https://www.jiapixel.com',
    logo: 'https://www.jiapixel.com/logo.png',
    foundingDate: '2021',
    founders: [
      {
        '@type': 'Person',
        name: 'Alex Chen',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Design Street',
      addressLocality: 'Creative District',
      addressRegion: 'CA',
      postalCode: '90210',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
      email: 'hello@jiapixel.com',
      areaServed: 'US',
      availableLanguage: 'en',
    },
  },
};



const AboutPage = () => {
  const stats = [
    { number: '50+', label: 'Projects Completed' },
    { number: '25+', label: 'Happy Clients' },
    { number: '3+', label: 'Years Experience' },
    { number: '98%', label: 'Client Satisfaction' }
  ];

  const values = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Innovation',
      description: 'We stay ahead of trends and leverage cutting-edge technologies to deliver forward-thinking solutions.'
    },
    {
      icon: <HeartHandshake className="w-8 h-8" />,
      title: 'Collaboration',
      description: 'Your success is our success. We work as an extension of your team to achieve shared goals.'
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Excellence',
      description: 'We never settle for mediocrity. Every project receives our utmost attention to detail and quality.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Integrity',
      description: 'Honest communication and transparent processes build the foundation of lasting partnerships.'
    }
  ];

  const team = [
    {
      name: 'Alex Chen',
      role: 'Creative Director',
      bio: 'With over 8 years in brand design, Alex leads our creative vision and ensures every project tells a compelling story.',
      expertise: ['Brand Strategy', 'UI/UX Design', 'Art Direction']
    },
    {
      name: 'Sarah Johnson',
      role: 'Lead Developer',
      bio: 'Sarah transforms beautiful designs into functional, high-performance digital experiences using modern technologies.',
      expertise: ['React/Next.js', 'Node.js', 'API Development']
    },
    {
      name: 'Mike Rodriguez',
      role: 'Project Manager',
      bio: 'Mike keeps projects on track and ensures seamless communication between our team and clients throughout the process.',
      expertise: ['Agile Methodology', 'Client Relations', 'Quality Assurance']
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Discovery & Strategy',
      description: 'We dive deep into your business goals, target audience, and market position to create a tailored strategy.'
    },
    {
      step: '02',
      title: 'Design & Development',
      description: 'Our team brings your vision to life with pixel-perfect designs and robust, scalable technical solutions.'
    },
    {
      step: '03',
      title: 'Testing & Refinement',
      description: 'We rigorously test every aspect and refine based on feedback to ensure flawless performance.'
    },
    {
      step: '04',
      title: 'Launch & Support',
      description: 'We deploy your project and provide ongoing support to ensure long-term success and growth.'
    }
  ];

  return (
   <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen">
        <BackgroundLines>
        {/* Hero Section */}
        <section className="pt-32 pb-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              We Create Digital
              <span className="text-primary block">Experiences That Matter</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Jiapixel is a creative agency dedicated to helping brands thrive in the digital landscape. 
              We combine strategic thinking with exceptional design and technology to deliver results that drive business growth.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Founded in 2021, Jiapixel emerged from a simple belief: every business deserves 
                    access to exceptional digital design and development, regardless of size or budget.
                  </p>
                  <p>
                    What started as a small team of passionate designers and developers has grown into 
                    a full-service agency serving clients across various industries. Our journey has been 
                    guided by our commitment to quality, innovation, and meaningful client relationships.
                  </p>
                  <p>
                    Today, we continue to push boundaries and challenge conventions, helping businesses 
                    transform their digital presence and achieve their strategic objectives through 
                    thoughtful design and robust technology solutions.
                  </p>
                </div>
                <Button className="mt-8" size="lg">
                  View Our Work
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center">
                    <Target className="w-12 h-12 text-primary" />
                  </div>
                  <div className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-12 h-12 text-primary" />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center">
                    <Award className="w-12 h-12 text-primary" />
                  </div>
                  <div className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-12 h-12 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                These principles guide everything we do and define how we work with our clients.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <Card key={index} className="text-center border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="text-primary mb-4 flex justify-center">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Our Process Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Process</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A structured approach that ensures quality, efficiency, and outstanding results.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {process.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Passionate professionals dedicated to bringing your vision to life.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {team.map((member, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                      <Users className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-4">{member.role}</p>
                    <p className="text-muted-foreground mb-4">{member.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, skillIndex) => (
                        <span 
                          key={skillIndex}
                          className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Work Together?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Let&apos;s discuss how we can help transform your digital presence and achieve your business goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/contact">Start a Project</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/portfolios">View Our Work</Link>
              </Button>
            </div>
          </div>
        </section>
      </BackgroundLines>
    </div>
    </>
  );
};

export default AboutPage;