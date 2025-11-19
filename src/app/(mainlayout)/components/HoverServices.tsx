"use client";
import { HoverEffect } from '@/components/ui/card-hover-effect';

const HoverServices = () => {
    const services = [
        {
            title: "Web Development",
            description: "Custom websites and web applications built with modern technologies like React, Next.js, and Node.js.",
            link: "/services/web-development"
        },
        {
            title: "Mobile App Development",
            description: "Cross-platform mobile applications for iOS and Android using React Native and Flutter, delivering native-like performance.",
            link: "/services/mobile-development"
        },
        {
            title: "UI/UX Design",
            description: "User-centered design solutions that create intuitive, engaging, and beautiful interfaces that drive user satisfaction and conversion.",
            link: "/services/ui-ux-design"
        },
        {
            title: "E-Commerce Solutions",
            description: "Complete online store development with secure payment gateways, inventory management, and seamless shopping experiences.",
            link: "/services/ecommerce"
        },
        {
            title: "SEO Optimization",
            description: "Boost your online visibility with comprehensive SEO strategies, keyword research, and technical optimization for higher search rankings.",
            link: "/services/seo"
        },
        {
            title: "Digital Marketing",
            description: "Data-driven marketing campaigns including social media marketing, PPC advertising, and content strategy to grow your business.",
            link: "/services/digital-marketing"
        },
        {
            title: "Cloud Solutions",
            description: "Scalable cloud infrastructure setup and migration using AWS, Google Cloud, and Azure for reliable and cost-effective operations.",
            link: "/services/cloud"
        },
        {
            title: "Maintenance & Support",
            description: "Ongoing technical support, updates, and maintenance services to keep your digital products running smoothly and securely.",
            link: "/services/support"
        },
        {
            title: "Consulting",
            description: "Expert technology consulting to help you make informed decisions about your digital strategy and technology stack.",
            link: "/services/consulting"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header Section */}
            <div className="text-center mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Our <span className="text-primary">Services</span>
                </h2>
                <p className=" text-muted-foreground max-w-3xl mx-auto">
                    Comprehensive digital solutions tailored to your business needs. 
                    From concept to deployment, we deliver excellence at every step.
                </p>
            </div>

            {/* Hover Effect Cards */}
            <HoverEffect items={services} />
            
           
           
        </div>
    );
};

export default HoverServices;