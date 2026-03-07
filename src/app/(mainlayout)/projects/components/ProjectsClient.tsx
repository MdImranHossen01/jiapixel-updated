"use client";

import React, { useState, useMemo } from "react";
import ProjectCard from "@/components/ProjectCard";
import ProjectHero from "./ProjectHero";
import { Button } from "@/components/ui/button";

interface ProjectsClientProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialProjects: any[];
}

const ProjectsClient: React.FC<ProjectsClientProps> = ({ initialProjects }) => {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter projects based on search
    const filteredProjects = useMemo(() => {
        return initialProjects.filter((project) => {
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
    }, [initialProjects, searchQuery]);

    return (
        <>
            <ProjectHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <div className="container mx-auto px-4">
                {/* Results Count */}
                {searchQuery && (
                    <div className="text-muted-foreground text-sm text-center mb-6">
                        Found {filteredProjects.length} result{filteredProjects.length !== 1 && 's'}
                    </div>
                )}

                {/* Projects Grid */}
                {filteredProjects.length > 0 ? (
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
