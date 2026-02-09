/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import ProjectForm from "../../components/ProjectForm";
import { useParams } from "next/navigation";

export default function EditProjectPage() {
    const params = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    // Use slug from params
    const slug = params.slug as string;

    useEffect(() => {
        if (slug) {
            fetchProject(slug);
        }
    }, [slug]);

    const fetchProject = async (slug: string) => {
        try {
            const response = await fetch(`/api/projects/${slug}`);
            const data = await response.json();
            if (data.success) {
                setProject(data.project);
            }
        } catch (error) {
            console.error("Failed to fetch project", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!project) return <div className="p-8 text-center">Project not found</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Edit Project - {slug}</h1>
            <ProjectForm initialData={project} isEdit={true} />
        </div>
    );
}
