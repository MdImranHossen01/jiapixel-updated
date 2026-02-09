import Link from 'next/link';
import { Suspense } from 'react';
import ProjectsClient from './ProjectsClient';

// Helper function to get base URL
function getBaseUrl() {
    if (process.env.NODE_ENV === 'production') {
        return process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
}

async function getProjects() {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/projects?limit=1000`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return { projects: [], error: error instanceof Error ? error.message : String(error) };
    }
}

export default async function ManageProjectsPage() {
    const data = await getProjects();
    const projects = data.projects || [];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Manage Projects</h1>
                    <p className="text-muted-foreground mt-2">Create, edit, and manage your projects</p>
                </div>
                <Link
                    href="/dashboard/admin/manage-projects/create"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <span className="text-lg">+</span> Create New Project
                </Link>
            </div>

            <div className="container mx-auto py-10">
                {data.error ? (
                    <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg flex flex-col gap-2">
                        <div className="flex items-center gap-2 font-semibold">
                            <span>Error loading projects</span>
                        </div>
                        <p className="text-sm">{data.error}</p>
                        <Link
                            href="/dashboard/admin/manage-projects"
                            className="text-xs underline w-fit hover:opacity-80 text-foreground"
                        >
                            Try again
                        </Link>
                    </div>
                ) : (
                    <Suspense fallback={<div>Loading projects...</div>}>
                        <ProjectsClient data={projects} />
                    </Suspense>
                )}
            </div>
        </div>
    );
}
