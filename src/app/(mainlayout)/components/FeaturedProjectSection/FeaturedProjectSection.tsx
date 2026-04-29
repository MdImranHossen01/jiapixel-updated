"use client";

import ProjectCard from "@/components/ProjectCard";
import React, { useState, useEffect } from "react";
import { GridSkeleton } from "@/components/CardSkeleton";

export default function FeaturedProjectSection() {
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch("/api/projects?limit=8");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.success) {
                    setProjects(data.projects);
                } else {
                    throw new Error(data.message || "Failed to load projects");
                }
            } catch (err: any) {
                console.error("Error fetching featured projects:", err);
                setError(err.message || "Could not load featured projects.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (!isLoading && projects.length === 0) {
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

                {isLoading ? (
                    <GridSkeleton count={8} />
                ) : error ? (
                    <div className="text-center py-10 bg-red-50/30 rounded-xl border border-red-100/50 border-dashed">
                        <p className="text-red-600 text-sm mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-xs font-medium text-red-700 underline hover:no-underline"
                        >
                            Try again
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {projects.map((project: any) => (
                            <ProjectCard key={project._id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
