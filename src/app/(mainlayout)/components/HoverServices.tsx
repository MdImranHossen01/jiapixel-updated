"use client";
import { HoverEffect } from '@/components/ui/card-hover-effect';

const HoverServices = () => {
    const services = [
        {
            title: "PWA Development",
            description: "Progressive Web Apps with offline functionality, push notifications, and app-like experience across all devices.",
            link: "/blogs/pwa-development"
        },
        {
            title: "Dark/Light Theme",
            description: "Seamless theme switching with system preference detection and persistent user preferences for better UX.",
            link: "/blogs/theme-system"
        },
        {
            title: "Smooth Scrolling",
            description: "Buttery smooth Lenis scroll animations and parallax effects for enhanced user engagement and modern feel.",
            link: "/blogs/smooth-scroll"
        },
        {
            title: "Live Chat Integration",
            description: "Real-time chat systems with AI-powered responses, file sharing, and multi-platform support for instant customer service.",
            link: "/blogs/live-chat"
        },
        {
            title: "Live Analytics",
            description: "Real-time traffic monitoring, user behavior tracking, and performance metrics with beautiful dashboards.",
            link: "/blogs/analytics"
        },
        {
            title: "AI Chatbot",
            description: "Intelligent AI assistants trained on your data for 24/7 customer support, lead generation, and user assistance.",
            link: "/blogs/ai-chatbot"
        },
        {
            title: "Advanced Animations",
            description: "Micro-interactions, page transitions, and scroll-triggered animations using Framer Motion and GSAP.",
            link: "/blogs/animations"
        },
        {
            title: "Authentication System",
            description: "Secure multi-provider auth (Google, GitHub, Email) with role-based access control and session management.",
            link: "/blogs/NextAuth-authentication"
        },
        {
            title: "Responsive Design",
            description: "Mobile-first, fully responsive designs that work perfectly on all devices from smartphones to 4K displays.",
            link: "/blogs/responsive-page-design"
        },
        {
            title: "Advanced Dashboard",
            description: "Custom admin panels with data visualization, real-time updates, and comprehensive business insights.",
            link: "/blogs/advanced-dashboard"
        },
        {
            title: "Conversion Rate Optimization (CRO)",
            description: "We follow 300+ conversion rate optimization best practices to boost conversion rates and drive more sales.",
            link: "/blogs/performance"
        },
        {
            title: "SEO Optimization",
            description: "Technical SEO, structured data, meta optimization, and content strategy for top search engine rankings.",
            link: "/blogs/seo-optimization"
        }
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header Section */}
            <div className="text-center mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Advanced <span className="text-primary">Web Features</span>
                </h2>
                <p className="text-muted-foreground max-w-3xl mx-auto">
                    Cutting-edge web technologies and modern features that elevate user experience, 
                    boost performance, and drive business growth.
                </p>
            </div>

            {/* Hover Effect Cards */}
            <HoverEffect items={services} />
        </section>
    );
};

export default HoverServices;