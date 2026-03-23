import ProjectCard from "@/components/ProjectCard";
import React from "react";

// Helper to get base URL
function getBaseUrl() {
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    if (process.env.NODE_ENV === 'production') {
        return process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
}

async function getFeaturedProjects() {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/projects?limit=8`, {
            cache: 'force-cache',
            next: { tags: ['projects'] }
        });

        if (!response.ok) {
            console.error(`Failed to fetch projects: ${response.status}`);
            return [];
        }

        const data = await response.json();
        if (data.success && Array.isArray(data.projects)) {
            return data.projects;
        }
        return [];
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
}

export default async function FeaturedProjectSection() {
    const projects = await getFeaturedProjects();

    console.log(`[FeaturedProjectSection] Fetched ${projects?.length || 0} projects`);

    if (!projects || projects.length === 0) {
        return null;
    }

    return (
        <section className="py-12">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                        Featured <span className="text-primary">Projects</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Explore our top-rated projects designed to elevate your business and drive growth.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {projects.map((project: any) => (
                        <ProjectCard key={project._id} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
}
