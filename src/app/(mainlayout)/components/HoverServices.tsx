"use client";
import { HoverEffect } from "@/components/ui/card-hover-effect";

const HoverServices = () => {
  const services = [
    {
      title: "PWA Development",
      description:
        "Progressive Web Apps with offline functionality, push notifications, and app-like experience across all devices.",
      link: "/blogs/progressive-web-apps-pwas-the-future-of-mobile-first-web-development",
    },
    {
      title: "Dark/Light Theme",
      description:
        "Seamless theme switching with system preference detection and persistent user preferences for better UX.",
      link: "/blogs/dark-mode-implementation-a-complete-guide-to-theming-your-website",
    },
    {
      title: "Smooth Scrolling",
      description:
        "Buttery smooth Lenis scroll animations and parallax effects for enhanced user engagement and modern feel.",
      link: "/blogs/lenis-smooth-scrolling-elevate-your-web-animations-with-buttery-smoothness",
    },
    {
      title: "Live Chat Integration",
      description:
        "Real-time chat systems with AI-powered responses, file sharing, and multi-platform support for instant customer service.",
      link: "/blogs/live-chat-integration-transforming-customer-experience-with-real-time-support",
    },
    {
      title: "Live Analytics",
      description:
        "Real-time traffic monitoring, user behavior tracking, and performance metrics with beautiful dashboards.",
      link: "/blogs/live-traffic-analytics-transforming-real-time-data-into-business-intelligence",
    },
    {
      title: "AI Chatbot",
      description:
        "Intelligent AI assistants trained on your data for 24/7 customer support, lead generation, and user assistance.",
      link: "/blogs/beyond-simple-replies-how-ai-chatbots-are-revolutionizing-customer-engagement",
    },
    {
      title: "Advanced Animations",
      description:
        "Micro-interactions, page transitions, and scroll-triggered animations using Framer Motion and GSAP.",
      link: "/blogs/advanced-website-animations-creating-immersive-digital-experiences",
    },
    {
      title: "Authentication System",
      description:
        "Secure multi-provider auth (Google, GitHub, Email) with role-based access control and session management.",
      link: "/blogs/-website-authentication-systems-a-comprehensive-guide-to-secure-user-access",
    },
    {
      title: "Responsive Design",
      description:
        "Mobile-first, fully responsive designs that work perfectly on all devices from smartphones to 4K displays.",
      link: "/blogs/responsive-web-design-mastering-multi-device-experiences",
    },
    {
      title: "Advanced Dashboard",
      description:
        "Custom admin panels with data visualization, real-time updates, and comprehensive business insights.",
      link: "/blogs/advanced-website-dashboards-building-powerful-data-visualization-interfaces",
    },
    {
      title: "Conversion Rate Optimization (CRO)",
      description:
        "We follow 300+ conversion rate optimization best practices to boost conversion rates and drive more sales.",
      link: "/blogs/conversion-rate-optimization-cro-a-data-driven-guide-to-growing-your-business",
    },
    {
      title: "SEO Optimization",
      description:
        "Technical SEO, structured data, meta optimization, and content strategy for top search engine rankings.",
      link: "/blogs/what-is-search-engine-optimization-seo-the-ultimate-beginners-guide",
    },
  ];

  return (
    <section
      id="web-features"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Header Section */}
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Advanced <span className="text-primary">Web Features</span>
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Cutting-edge web technologies and modern features that elevate user
          experience, boost performance, and drive business growth.
        </p>
      </div>

      {/* Hover Effect Cards */}
      <HoverEffect items={services} />
    </section>
  );
};

export default HoverServices;
