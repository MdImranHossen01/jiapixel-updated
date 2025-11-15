import React from 'react';

// Benefit data array with content tailored for Fullstack Web Dev & Digital Marketing
const benefits = [
    {
        title: "Full-Stack Performance & Scale",
        description: "We build on Next.js and React using PostgreSQL, guaranteeing high performance, robust data integrity, and future-proof scalability for enterprise growth.",
        icon: (
            // Placeholder for Chart/Revenue Icon (Represents Growth)
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="3" y1="20" x2="21" y2="20"/></svg>
        ),
    },
    {
        title: "Guaranteed SEO Visibility",
        description: "We implement advanced Technical SEO from day one, ensuring your Next.js application is indexed correctly and ranks competitively for core keywords.",
        icon: (
            // Placeholder for Checkmark/Shield Icon (Represents Trust/Quality)
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
        ),
    },
    {
        title: "Data-Driven Digital Campaigns",
        description: "Our digital marketing services focus on high-ROI strategies, using campaign data to reduce spend and acquire qualified leads efficiently.",
        icon: (
            // Placeholder for Hourglass/Time Icon (Represents Efficiency)
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v6h2l-2 3v3h-2v-3l-2-3h2V2z"/></svg>
        ),
    },
    {
        title: "Integrated Development & Marketing",
        description: "We align your codebase (Next.js) with marketing requirements (analytics, tracking) seamlessly, eliminating friction between design and performance teams.",
        icon: (
            // Placeholder for Funnel/Pipe Icon (Represents Integration)
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2h2v14h-2V2zM7 6h10L14 2H10zM5 16h14L16 20H8z"/></svg>
        ),
    },
    {
        title: "Competitor Analysis Advantage",
        description: "We analyze competitor SEO and digital strategies to find untapped niches, giving your project a critical advantage in market adoption and visibility.",
        icon: (
            // Placeholder for Star/Performance Icon (Represents Outperformance)
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        ),
    },
    {
        title: "Transparent, Agile Delivery",
        description: "Benefit from a clear, weekly agile process that provides full visibility into development sprints and immediate feedback on marketing performance.",
        icon: (
            // Placeholder for Piggy Bank/Guarantee Icon (Represents Transparency/Safety)
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M8 2v4"/><path d="M16 2v4"/><path d="M12 15a4 4 0 0 1-4-4v-1h8v1a4 4 0 0 1-4 4z"/></svg>
        ),
    },
];

const WhyChooseUs = () => {
    return (
        <section className="text-foreground py-20">
            <div className="container mx-auto px-4 max-w-7xl">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                        Launch Your Project with <span className="text-primary">Reliable Technology</span> and <br />
                        <span className="text-primary">Growth-Focused Strategy</span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        We are a full-stack agency specializing in modern web development (Next.js, React, PostgreSQL) integrated with advanced SEO and Digital Marketing for maximum ROI.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="bg-card border border-border rounded-xl p-8 
                                transition-shadow duration-300 
                                hover:shadow-xl hover:shadow-primary/50"
                        >
                            <div className="text-primary w-8 h-8 mb-4">
                                {benefit.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-card-foreground">
                                {benefit.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;