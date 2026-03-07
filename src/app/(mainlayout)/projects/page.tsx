/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import type { Metadata } from "next";
import connectDB from "@/lib/db";
import ProjectModel from "@/models/Project";
import ProjectsClient from "./components/ProjectsClient";
import Link from 'next/link';

// Fetch all projects directly from DB for initial render + search pool
async function getProjects() {
    try {
        await connectDB();

        // Fetch all projects
        const projects = await ProjectModel.find({})
            .sort({ createdAt: -1 })
            .lean();

        // Serialize for Client Component
        return JSON.parse(JSON.stringify(projects));
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
}

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = "https://www.jiapixel.com";
    const canonicalUrl = `${baseUrl}/projects`;

    return {
        title:
            "Our Projects - Jia Pixel Portfolio",
        description:
            "Explore our diverse portfolio of successful web development, SEO, and digital marketing projects. See how we help businesses grow.",
        keywords:
            "web development projects, portfolio, SEO case studies, digital marketing success, web design examples, Bangladesh agency",

        // Canonical URL
        alternates: {
            canonical: canonicalUrl,
        },

        // Open Graph
        openGraph: {
            title:
                "Our Projects - Jia Pixel Portfolio",
            description:
                "Explore our diverse portfolio of successful web development, SEO, and digital marketing projects. See how we help businesses grow.",
            url: canonicalUrl,
            siteName: "Jiapixel",
            images: [
                {
                    url: "https://www.jiapixel.com/icon.png",
                    width: 1200,
                    height: 630,
                    alt: "Jiapixel Projects - Web Development & Digital Marketing Portfolio",
                },
            ],
            locale: "en_US",
            type: "website",
        },

        // Twitter Card
        twitter: {
            card: "summary_large_image",
            title:
                "Our Projects - Jia Pixel Portfolio",
            description:
                "Explore our diverse portfolio of successful web development, SEO, and digital marketing projects.",
            images: ["https://www.jiapixel.com/icon.png"],
            creator: "@jiapixel",
        },
    };
}

const ProjectsPage = async () => {
    const projects = await getProjects();

    // Generate structured data for projects listing
    const projectsStructuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Jiapixel Projects",
        description: "Portfolio of web development and digital marketing projects",
        url: "https://www.jiapixel.com/projects",
        numberOfItems: projects.length,
        itemListElement: projects.map((project: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
                "@type": "CreativeWork",
                name: project.title,
                description: project.metaDescription || project.description?.replace(/<[^>]*>/g, "").substring(0, 200),
                url: `https://www.jiapixel.com/projects/${project.slug}`,
            },
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsStructuredData) }}
            />

            <div className="min-h-screen">
                {/* Projects Client Component (Search, Filter, Grid) */}
                <ProjectsClient initialProjects={projects} />

                {/* SEO Content Section */}
                <section className="py-12 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto space-y-8 text-[12px] text-muted-foreground leading-relaxed">
                            <div className="space-y-4">
                                <h2 className="text-base font-bold text-foreground mb-2">
                                    Our Proven Track Record and Success Stories
                                </h2>
                                <p>
                                    At Jia Pixel, our portfolio reflects our dedication to excellence and client success. As a trusted digital service agency, we have collaborated with businesses across various industries to deliver transformative digital solutions. Whether it's building engaging web experiences, driving targeted traffic, or increasing conversions, our projects demonstrate our capability to meet diverse business challenges. We believe the results speak for themselves, and we are proud to share the milestones we've achieved with our partners.
                                </p>
                                <p>
                                    Every project represents a unique journey. From the initial discovery phase to launch and beyond, we ensure a tailored approach that aligns with our clients' objectives. Take a look at some of our recent work to see how we apply advanced strategies in web development, design, and digital marketing to create impactful and sustainable results.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-foreground">
                                    Transformative Web Development Projects
                                </h3>
                                <p>
                                    A strong digital presence starts with a robust platform. Our featured <Link className='underline italic hover:text-primary' href="/services">web design and development</Link> portfolio showcases modern, responsive, and highly functional websites crafted to elevate brand identity and user engagement. We've built platforms ranging from scalable eCommerce stores to custom corporate applications, each designed to perform seamlessly across devices.
                                </p>
                                <ul className="list-disc list-inside space-y-1 pl-2">
                                    <li>Custom architectures tailored to specific business needs</li>
                                    <li>Performant and responsive front-end designs</li>
                                    <li>Seamless integrations with essential third-party services</li>
                                    <li>Robust, secure, and scalable backend infrastructure</li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-foreground">
                                    Data-Driven Digital Marketing Campaigns
                                </h3>
                                <p>
                                    Building a great product is only half the battle; ensuring it reaches the right audience is crucial. Our digital marketing case studies highlight our expertise in crafting campaigns that deliver measurable ROI. Through strategic combinations of paid advertising, content marketing, and search engine optimization, we have consistently helped our clients improve visibility and increase customer acquisition.
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
                                <a href="/services" className="hover:text-foreground transition-colors">
                                    Explore Our Services
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default ProjectsPage;
