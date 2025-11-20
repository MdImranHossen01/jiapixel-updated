import React from "react";

// SEO services data array with comprehensive SEO features
const seoServices = [
  {
    title: "Keyword Research & Strategy",
    description:
      "Comprehensive keyword analysis to identify high-value opportunities, search intent mapping, and content gap analysis for maximum organic visibility.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" />
        <path d="M3 16.8V21m0 0h4.8M3 21l6-6" />
        <path d="M21 7.2V3m0 0h-4.8M21 3l-6 6" />
        <path d="M3 7.2V3m0 0h4.8M3 3l6 6" />
      </svg>
    ),
  },
  {
    title: "Competitor Analysis",
    description:
      "In-depth analysis of competitor SEO strategies, backlink profiles, content performance, and ranking factors to identify competitive advantages.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "On-Page SEO Optimization",
    description:
      "Complete on-page optimization including meta tags, header structure, content quality, internal linking, and semantic HTML markup for better crawlability.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    title: "Technical SEO Audit",
    description:
      "Comprehensive technical audits covering site speed, mobile optimization, XML sitemaps, robots.txt, structured data, and Core Web Vitals optimization.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Off-Page SEO & Link Building",
    description:
      "Strategic link building campaigns, digital PR, guest posting, and authority building to improve domain authority and search rankings.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    title: "Performance Monitoring & Analytics",
    description:
      "Continuous SEO performance tracking, ranking monitoring, analytics setup, and data-driven optimization strategies for sustained growth.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <line x1="3" y1="20" x2="21" y2="20" />
      </svg>
    ),
  },
];

const SEOFeatures = () => {
  return (
    <section className="text-foreground py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive <span className="text-primary">SEO Services</span> 
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Our data-driven SEO approach combines technical expertise with
            strategic marketing to deliver measurable results and long-term
            organic growth for your business.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-10 gap-6">
          {seoServices.map((service, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-8 
                                transition-shadow duration-300 
                                hover:shadow-xl hover:shadow-primary/50"
            >
              <div className="text-primary w-8 h-8 mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-card-foreground">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SEOFeatures;
