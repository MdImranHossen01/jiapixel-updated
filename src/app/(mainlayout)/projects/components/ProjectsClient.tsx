"use client";

import React, { useState, useMemo, useEffect } from "react";
import ProjectCard from "@/components/ProjectCard";
import ProjectHero from "./ProjectHero";
import { Button } from "@/components/ui/button";
import { GridSkeleton } from "@/components/CardSkeleton";

const ProjectsClient: React.FC = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch("/api/projects?limit=100");
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                if (data.success) {
                    setProjects(data.projects);
                } else {
                    throw new Error(data.message || "Failed to load projects");
                }
            } catch (err: any) {
                console.error("Error fetching projects:", err);
                setError(err.message || "An unexpected error occurred while fetching projects.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Filter projects based on search
    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            // Search Filter (Partial Match on Title or Description)
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase().trim();

                return (
                    project.title?.toLowerCase().includes(query) ||
                    project.description?.toLowerCase().includes(query)
                );
            }

            return true;
        });
    }, [projects, searchQuery]);

    return (
        <>
            <ProjectHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <div className="container mx-auto px-4">
                {/* Results Count */}
                {searchQuery && !isLoading && (
                    <div className="text-muted-foreground text-sm text-center mb-6">
                        Found {filteredProjects.length} result{filteredProjects.length !== 1 && 's'}
                    </div>
                )}

                {isLoading ? (
                    <GridSkeleton count={8} />
                ) : error ? (
                    /* Error State */
                    <div className="text-center py-16 bg-red-50/50 rounded-xl border border-red-100 border-dashed">
                        <div className="max-w-md mx-auto">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h3 className="text-2xl font-bold text-red-900 mb-2">
                                Something went wrong
                            </h3>
                            <p className="text-red-700/80 mb-6">
                                {error}
                            </p>
                            <Button
                                onClick={() => window.location.reload()}
                                className="bg-red-600 text-white hover:bg-red-700"
                            >
                                Try again
                            </Button>
                        </div>
                    </div>
                ) : filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {filteredProjects.map((project: any) => (
                            <ProjectCard key={project._id} project={project} />
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16 bg-card/50 rounded-xl border border-border/50 border-dashed">
                        <div className="max-w-md mx-auto">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">
                                No matching projects found
                            </h3>
                            <p className="text-muted-foreground">
                                Try adjusting your search terms.
                            </p>
                            <Button
                                variant="link"
                                onClick={() => setSearchQuery("")}
                                className="mt-4"
                            >
                                Clear search
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ProjectsClient;
