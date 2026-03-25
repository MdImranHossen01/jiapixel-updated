"use client";

import React, { useEffect, useState } from "react";
import { IClientProject } from "@/models/ClientProject";
import ProjectCard from "@/components/ProjectCard";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ClientDashboardPage() {
    const [projects, setProjects] = useState<IClientProject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch("/api/client/projects");
                const data = await res.json();
                if (data.success) {
                    setProjects(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Client Portal</h1>
                    <p className="text-muted-foreground">Track your ongoing projects and invoices.</p>
                </div>
                <Link href="/estimate">
                    <Button>Get New Quote</Button>
                </Link>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-12 bg-card border border-dashed border-border rounded-xl">
                    <h3 className="text-lg font-semibold mb-2">No Active Projects</h3>
                    <p className="text-muted-foreground mb-6">Looks like you don't have any projects with us yet.</p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/services">
                            <Button variant="outline">Browse Services</Button>
                        </Link>
                        <Link href="/estimate">
                            <Button>Start a Project</Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {projects.map((project) => (
                        // @ts-ignore - _id exists on mongoose doc
                        <ProjectCard key={project._id} project={project} clientMode={true} />
                    ))}
                </div>
            )}
        </div>
    );
}
