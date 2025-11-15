import React from 'react';
import { FiLayout, FiSidebar, FiCode, FiGrid, FiFeather, FiLayers, FiZap, FiMenu, FiArchive, FiImage, FiMoon, FiMousePointer, FiType, FiGlobe, FiTarget } from 'react-icons/fi';

const featuresData = [
    {
        title: "Fully Responsive Layouts",
        description: "Optimized for seamless display across all screen sizes (mobile, tablet, desktop).",
        icon: <FiLayout className="w-8 h-8" />,
    },
    {
        title: "Advanced Header and Footer",
        description: "Customizable components with sticky, transparent, and multi-layout options.",
        icon: <FiSidebar className="w-8 h-8" />,
    },
    {
        title: "Pre-Built Offcanvas Menu",
        description: "Ready-to-use slide-out navigation for mobile and complex menu requirements.",
        icon: <FiMenu className="w-8 h-8" />,
    },
    {
        title: "Creative CMS Sliders",
        description: "Dynamic, modern sliders that easily integrate with your database content (PostgreSQL).",
        icon: <FiLayers className="w-8 h-8" />,
    },
    {
        title: "Animation Builder (GSAP)",
        description: "Integration with GSAP for high-performance, complex user interface animations.",
        icon: <FiTarget className="w-8 h-8" />,
    },
    {
        title: "CSS with Superpowers (Tailwind)",
        description: "Built using Tailwind CSS for rapid styling, consistency, and easy customization.",
        icon: <FiCode className="w-8 h-8" />,
    },
    {
        title: "Unique Mega Menu",
        description: "Multi-column navigation structures designed for large e-commerce or content sites.",
        icon: <FiGrid className="w-8 h-8" />,
    },
    {
        title: "Unique Blog Styles",
        description: "Customizable layouts and reading experiences for optimal user engagement.",
        icon: <FiFeather className="w-8 h-8" />,
    },
    {
        title: "Unique Archive Page",
        description: "Filterable and sortable archive layouts for services, projects, or blog categories.",
        icon: <FiArchive className="w-8 h-8" />,
    },
    {
        title: "Powerful Marketing Popup",
        description: "High-converting, customizable pop-up modals for lead capture and promotions.",
        icon: <FiImage className="w-8 h-8" />,
    },
    {
        title: "Dark and Light Version",
        description: "Seamless support for both dark and light themes using CSS variables (like your setup).",
        icon: <FiMoon className="w-8 h-8" />,
    },
    {
        title: "Smooth Page Scrolling",
        description: "Enhanced scroll performance for a professional and fluid user experience.",
        icon: <FiMousePointer className="w-8 h-8" />,
    },
    {
        title: "Custom Font Uploader",
        description: "Easily integrate and manage custom brand typography across the entire site.",
        icon: <FiType className="w-8 h-8" />,
    },
    {
        title: "Browser Friendly Code",
        description: "Fully tested and compatible across all major modern browsers for reliability.",
        icon: <FiGlobe className="w-8 h-8" />,
    },
    {
        title: "Animated Particles (Optional)",
        description: "Subtle background animations to add a modern, dynamic feel to sections.",
        icon: <FiZap className="w-8 h-8" />,
    },
];

const WebFeatures = () => {
    return (
        // Section container using theme colors (assuming dark/high-contrast background)
        <section className="text-foreground py-20">
            <div className="container mx-auto px-4 max-w-7xl">
                
                {/* Header Section */}
                <div className="text-center mb-16">
                    <p className="text-sm font-semibold uppercase text-primary mb-2 tracking-widest">
                        Features Included
                    </p>
                    <h2 className="text-5xl md:text-6xl font-extrabold uppercase leading-none" style={{ color: 'var(--destructive)' }}>
                        TOP-NOTCH
                    </h2>
                    <h2 className="text-5xl md:text-6xl font-extrabold uppercase leading-none" style={{ color: 'var(--primary)' }}>
                        FEATURES INCLUDED
                    </h2>
                </div>

            

                {/* Features Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                    {featuresData.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-card border border-border rounded-lg p-6 text-center 
                                transition-all duration-300 transform hover:scale-[1.03] hover:shadow-lg hover:border-primary"
                        >
                            <div className="flex justify-center mb-3 text-primary">
                                {feature.icon}
                            </div>
                            <h3 className="text-base font-semibold text-card-foreground mb-1">
                                {feature.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                {feature.description.split(' ').slice(0, 5).join(' ')}...
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WebFeatures;