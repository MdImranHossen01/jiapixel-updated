import { FAQCategory, FAQItem } from './types';

export const FAQ_DATA: FAQItem[] = [
  // GENERAL Questions (5)
  {
    id: '1',
    category: FAQCategory.GENERAL,
    question: "What services does Jia Pixel offer?",
    answer: "Jia Pixel is a full-service digital agency specializing in web development using Next.js, React.js, TypeScript, Tailwind CSS, and Shadcn UI. We also provide SEO optimization, digital marketing campaigns, and database solutions with MongoDB, PostgreSQL, Prisma, and Mongoose."
  },
  {
    id: '2',
    category: FAQCategory.GENERAL,
    question: "What makes Jia Pixel different from other agencies?",
    answer: "We combine cutting-edge technology with strategic digital marketing. Our expertise in Next.js and React.js ensures blazing-fast, SEO-friendly websites, while our digital marketing team drives measurable results through targeted campaigns and data-driven strategies."
  },
  {
    id: '3',
    category: FAQCategory.GENERAL,
    question: "Do you work with startups and small businesses?",
    answer: "Absolutely! We work with businesses of all sizes. For startups, we offer scalable solutions that grow with your business, ensuring you get the right technology stack from day one without overpaying for features you don't need yet."
  },
  {
    id: '4',
    category: FAQCategory.GENERAL,
    question: "What industries do you specialize in?",
    answer: "We have experience across multiple industries including e-commerce, SaaS platforms, healthcare, education, and professional services. Our technical expertise allows us to adapt to any industry's specific needs and compliance requirements."
  },
  {
    id: '5',
    category: FAQCategory.GENERAL,
    question: "How do I get started with Jia Pixel?",
    answer: "Start with a free consultation where we discuss your project requirements, goals, and timeline. We'll provide a detailed proposal outlining our approach, technology stack recommendations, and transparent pricing. No commitment required for the initial consultation.",
  },

  // WEB DEVELOPMENT Questions (5)
  {
    id: '6',
    category: FAQCategory.WEB_DEVELOPMENT,
    question: "Why do you recommend Next.js for web development?",
    answer: "Next.js offers superior performance with server-side rendering, excellent SEO capabilities, and seamless React integration. It provides faster page loads, better user experience, and higher search engine rankings compared to traditional React applications."
  },
  {
    id: '7',
    category: FAQCategory.WEB_DEVELOPMENT,
    question: "What's included in your web development package?",
    answer: "Our comprehensive package includes: responsive design with Tailwind CSS, component library with Shadcn UI, database integration (MongoDB/PostgreSQL), API development, performance optimization, SEO setup, and ongoing maintenance support. We also include training for your team."
  },
  {
    id: '8',
    category: FAQCategory.WEB_DEVELOPMENT,
    question: "How long does a typical website development take?",
    answer: "Timeline varies by project complexity: Basic websites (4-6 weeks), E-commerce platforms (8-12 weeks), Custom web applications (12-16 weeks). We provide detailed project timelines during our initial consultation and maintain transparent communication throughout."
  },
  {
    id: '9',
    category: FAQCategory.WEB_DEVELOPMENT,
    question: "Do you provide ongoing maintenance and support?",
    answer: "Yes, we offer flexible maintenance plans including security updates, performance monitoring, bug fixes, and feature enhancements. Our support team is available to ensure your website remains secure, fast, and up-to-date with the latest technologies."
  },
  {
    id: '10',
    category: FAQCategory.WEB_DEVELOPMENT,
    question: "Can you work with our existing design or brand guidelines?",
    answer: "Absolutely! We can implement your existing designs or create new ones that align with your brand identity. Our design team ensures consistency across all platforms while maintaining usability and conversion optimization best practices.",
  },

  // SEO & DIGITAL MARKETING Questions (5)
  {
    id: '11',
    category: FAQCategory.SEO_MARKETING,
    question: "What SEO services do you provide?",
    answer: "Our SEO services include: comprehensive technical audits, on-page optimization, content strategy, keyword research, link building, local SEO, performance tracking with Google Analytics, and monthly progress reports with actionable insights."
  },
  {
    id: '12',
    category: FAQCategory.SEO_MARKETING,
    question: "How long does it take to see SEO results?",
    answer: "SEO is a long-term strategy. Typically, you'll see initial improvements in 3-6 months, with significant results in 6-12 months. We focus on sustainable growth rather than quick fixes that violate search engine guidelines."
  },
  {
    id: '13',
    category: FAQCategory.SEO_MARKETING,
    question: "Do you manage Google Ads and social media campaigns?",
    answer: "Yes, we manage comprehensive digital advertising campaigns including Google Ads, Facebook/Instagram Ads, LinkedIn campaigns, and remarketing. We create targeted strategies based on your audience and business objectives with regular performance optimization."
  },
  {
    id: '14',
    category: FAQCategory.SEO_MARKETING,
    question: "How do you measure marketing campaign success?",
    answer: "We track KPIs including: conversion rates, cost per acquisition, return on ad spend, organic traffic growth, keyword rankings, and engagement metrics. You'll receive detailed monthly reports with insights and recommendations for improvement."
  },
  {
    id: '15',
    category: FAQCategory.SEO_MARKETING,
    question: "Can you help with content marketing and blogging?",
    answer: "Absolutely! Our content team creates SEO-optimized blog posts, articles, and landing pages that drive traffic and conversions. We develop content strategies aligned with your target audience and business goals.",
  },

  // TECHNICAL Questions (5)
  {
    id: '16',
    category: FAQCategory.TECHNICAL,
    question: "What database solutions do you recommend?",
    answer: "We recommend MongoDB for flexible, scalable applications and PostgreSQL for complex relational data. We use Prisma as our ORM for type-safe database access and Mongoose for MongoDB object modeling, ensuring robust and maintainable code."
  },
  {
    id: '17',
    category: FAQCategory.TECHNICAL,
    question: "Do you implement state management with Redux?",
    answer: "Yes, we implement Redux for complex state management in large applications. For simpler projects, we use React Context API or Zustand. We choose the right state management solution based on your application's complexity and scalability needs."
  },
  {
    id: '18',
    category: FAQCategory.TECHNICAL,
    question: "How do you ensure website security?",
    answer: "We implement multiple security layers: HTTPS encryption, input validation, SQL injection prevention, XSS protection, secure authentication, regular security audits, and dependency updates. All our code undergoes security review before deployment."
  },
  {
    id: '19',
    category: FAQCategory.TECHNICAL,
    question: "Do you provide hosting and deployment services?",
    answer: "Yes, we offer hosting solutions on Vercel (for Next.js), AWS, or your preferred platform. We handle deployment, SSL certificates, domain setup, and ensure optimal performance and uptime for your application."
  },
  {
    id: '20',
    category: FAQCategory.TECHNICAL,
    question: "Can you migrate our existing website to a new stack?",
    answer: "We specialize in website migrations and modernizations. Whether you're moving from WordPress, legacy systems, or other platforms to Next.js and modern technologies, we ensure a smooth transition with minimal downtime and data integrity.",
  },

  // PRICING & BILLING Questions (5)
  {
    id: '21',
    category: FAQCategory.PRICING_BILLING,
    question: "What's your pricing structure for web development?",
    answer: "We offer project-based pricing for defined scopes and hourly rates for ongoing work. Web development projects typically range from $5,000 for basic sites to $50,000+ for complex applications. We provide detailed quotes after understanding your requirements."
  },
  {
    id: '22',
    category: FAQCategory.PRICING_BILLING,
    question: "Do you offer monthly retainer packages?",
    answer: "Yes, we offer monthly retainer packages for ongoing development, maintenance, and marketing services. Retainers provide cost savings and priority support. Packages start at $1,500/month depending on services required."
  },
  {
    id: '23',
    category: FAQCategory.PRICING_BILLING,
    question: "What's included in your SEO and marketing packages?",
    answer: "Our SEO packages start at $1,000/month and include technical optimization, content creation, link building, and monthly reporting. Digital marketing campaigns are priced based on ad spend and management fees, typically 15-20% of ad spend."
  },
  {
    id: '24',
    category: FAQCategory.PRICING_BILLING,
    question: "Do you require long-term contracts?",
    answer: "No long-term contracts required for project work. For ongoing services, we typically work with 3-6 month agreements to ensure we can deliver meaningful results. Month-to-month options are available for some services."
  },
  {
    id: '25',
    category: FAQCategory.PRICING_BILLING,
    question: "What payment methods do you accept?",
    answer: "We accept bank transfers, credit cards, and online payments. For larger projects, we typically work with a 50% deposit to start, 25% at milestone, and 25% upon completion. We're happy to discuss payment plans that work for your business.",
  }
];