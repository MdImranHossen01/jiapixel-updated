/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import type { Metadata } from "next";
import ServicesStructuredData from "@/components/ServicesStructuredData";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import ServicesClient from "./components/ServicesClient";
import Link from 'next/link';

// Fetch all services directly from DB for initial render + search pool
async function getServices() {
  try {
    await connectDB();

    // Fetch all published services
    const services = await Project.find({ status: { $ne: 'draft' } }) // Assuming we show published and archived? Or just published.
      .sort({ createdAt: -1 })
      .lean();

    // Serialize for Client Component
    return JSON.parse(JSON.stringify(services));
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = "https://www.jiapixel.com";
  const canonicalUrl = `${baseUrl}/services`;

  return {
    title:
      "Our Services - Professional Web Development & Digital Marketing | Jiapixel",
    description:
      "Explore our professional services including web development, SEO, digital marketing, and more. Get custom solutions for your business growth.",
    keywords:
      "web development, SEO services, digital marketing, web design, e-commerce development, Bangladesh agency",

    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },

    // Open Graph
    openGraph: {
      title:
        "Our Services - Professional Web Development & Digital Marketing | Jiapixel",
      description:
        "Explore our professional services including web development, SEO, digital marketing, and more. Get custom solutions for your business growth.",
      url: canonicalUrl,
      siteName: "Jiapixel",
      images: [
        {
          url: "https://www.jiapixel.com/icon.png",
          width: 1200,
          height: 630,
          alt: "Jiapixel Services - Web Development & Digital Marketing",
        },
      ],
      locale: "en_US",
      type: "website",
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title:
        "Our Services - Professional Web Development & Digital Marketing | Jiapixel",
      description:
        "Explore our professional services including web development, SEO, digital marketing, and more.",
      images: ["https://www.jiapixel.com/icon.png"],
      creator: "@jiapixel",
    },
  };
}

const ServicesPage = async () => {
  const services = await getServices();

  // Generate structured data for services listing
  const servicesStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Jiapixel Services",
    description: "Professional web development and digital marketing services",
    url: "https://www.jiapixel.com/services",
    numberOfItems: services.length,
    itemListElement: services.map((service: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description:
          service.projectSummary?.replace(/<[^>]*>/g, "").substring(0, 200) ||
          service.tiers?.starter?.description,
        url: `https://www.jiapixel.com/services/${service.slug}`,
        offers: Object.values(service.tiers || {}).map((tier: any) => ({
          "@type": "Offer",
          name: tier.title,
          price: tier.price,
          priceCurrency: "USD",
        })),
      },
    })),
  };

  return (
    <>
      <ServicesStructuredData data={servicesStructuredData} />

      <div className="min-h-screen">


        {/* Services Client Component (Search, Filter, Grid) */}
        <ServicesClient initialServices={services} />

        {/* SEO Content Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-8 text-[12px] text-muted-foreground leading-relaxed">
              <div className="space-y-4">
                <h2 className="text-base font-bold text-foreground mb-2">
                  Your Trusted Digital Marketing Service Agency
                </h2>
                <p>
                  As a leading Digital Markeing Service Agency, we are committed to helping small businesses grow and succeed in the digital landscape. We understand that every business is unique, and we take the time to understand your specific needs and goals. Our team of experts is dedicated to delivering comprehensive digital solutions tailored to your unique needs. We are more than just a digital service provider; we are ensuring your long-term success in the digital landscape. Our approach involves a deep understanding of your brand's core values and market position, allowing us to craft strategies that resonate with your target audience. We believe in sustainable growth, leveraging data-driven insights to optimize every aspect of your digital footprint. From initial consultation to final execution, our team is dedicated to delivering excellence and measurable results that drive your business forward.
                </p>
                <p>
                  In today&apos;s competitive market, having a robust digital marketing strategy is essential. We offer a holistic suite of services that covers every angle of your online presence. Whether you are looking to build a new website, optimize your search engine rankings, or launch a targeted advertising campaign, we have the expertise to make it happen. Our commitment to quality and innovation ensures that you stay ahead of the curve, adapting to the ever-changing digital environment with ease and confidence.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Premium Web Design and Development Service
                </h3>
                <p>
                  Our expert team delivers top-tier <Link className='underline italic hover:text-primary' href="/web-development-for-small-business">web design and development services</Link> offerings that combine aesthetics with functionality. We build responsive, fast, and user-friendly websites that serve as the foundation of your online presence. A website is often the first point of contact for potential customers, and we ensure it makes a lasting impression. We focus on creating intuitive navigation, engaging visuals, and seamless user experiences that convert visitors into loyal customers. Our development process adheres to the latest web standards, ensuring your site is secure, scalable, and compatible across all devices and browsers.
                </p>
                <p>
                  Beyond just looks, we prioritize performance and technical excellence. Our websites are optimized for speed, ensuring fast load times that improve both user satisfaction and search engine rankings. We also provide ongoing maintenance and support, keeping your site secure and up-to-date. Whether you need a simple brochure site, a complex e-commerce platform like Shopify or WooCommerce, or a custom web application, our team has the skills and experience to bring your vision to life.
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Custom website design tailored to your brand identity and audience preferences</li>
                  <li>Responsive development for mobile and desktop to ensure seamless access</li>
                  <li>Performance optimization for fast loading speeds and improved SEO</li>
                  <li>Secure and scalable architecture to grow with your business</li>
                  <li>Integration with third-party tools and APIs for enhanced functionality</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Strategic Ads Marketing for Business Growth
                </h3>
                <p>
                  Accelerate your revenue with our data-driven Ads marketing for business growth. We create targeted campaigns across Google, Facebook, and Instagram to ensure every dollar spent yields a high return on investment. Our team of certified ad specialists analyzes market trends and user behavior to design campaigns that reach the right people at the right time. We utilize advanced targeting options, including demographic, psychographic, and behavioral data, to maximize the relevance and impact of your ads.
                </p>
                <p>
                  Continuous optimization is at the heart of our strategy. We rigorously A/B test ad creatives, copy, and landing pages to identify what works best. By constantly refining our approach based on real-time performance data, we drive lower costs per acquisition and higher conversion rates. Our detailed reporting provides you with complete transparency, showing exactly how your budget is being utilized and the results it is generating. From brand awareness to direct sales, our paid advertising strategies are designed to deliver tangible business outcomes.
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Targeted PPC campaigns for instant visibility and traffic generation</li>
                  <li>Social media advertising strategies on Facebook, Instagram, and LinkedIn</li>
                  <li>Conversion rate optimization (CRO) to maximize ad spend efficiency</li>
                  <li>Detailed analytics and performance reporting for full transparency</li>
                  <li>Retargeting campaigns to re-engage visitors and drive conversions</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Advanced SEO Service for Ranking on Google
                </h3>
                <p>
                  Visibility is key in the digital age. Our specialized SEO service for ranking on google employs the latest techniques to boost your organic search rankings. From technical SEO audits to content strategy and link building, we cover all aspects of search engine optimization. We understand that SEO is a long-term investment, and we build sustainable strategies that deliver lasting results. Our team stays updated with the latest algorithm changes to ensure your site remains compliant and competitive.
                </p>
                <p>
                  Whether you need a small business digital service or an enterprise-level strategy, we have the expertise to get you found. We conduct thorough keyword research to identify high-value opportunities and optimize your on-page elements for maximum relevance. Our off-page strategies focus on building high-quality backlinks that establish your site&apos;s authority. By improving your search visibility, we help you attract more organic traffic, generate quality leads, and establish your brand as an industry leader.
                </p>
                <p>
                  Learn more about the importance of search visibility from Google&apos;s <a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide" target="_blank" rel="noopener noreferrer" className="text-foreground underline">SEO Starter Guide</a>.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
                <a href="/contact" className="hover:text-foreground transition-colors">
                  Contact Us Today
                </a>
                <span>•</span>
                <a href="/about" className="hover:text-foreground transition-colors">
                  About Our Agency
                </a>
                <span>•</span>
                <a href="/blogs" className="hover:text-foreground transition-colors">
                  Read Our Insights
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicesPage;