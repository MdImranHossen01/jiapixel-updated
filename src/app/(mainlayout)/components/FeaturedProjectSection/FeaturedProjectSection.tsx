import ProjectCard from "@/components/ProjectCard";
import React from "react";

import { getProjects } from "@/lib/db-utils";

export default async function FeaturedProjectSection() {
    const projects = await getProjects(8);

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
