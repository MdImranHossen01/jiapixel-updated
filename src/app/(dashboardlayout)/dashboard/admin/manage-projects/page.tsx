/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";


export default function ManageProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch("/api/projects?limit=100");
            const data = await response.json();
            if (data.success) {
                setProjects(data.projects);
            }
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (slug: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            const response = await fetch(`/api/projects/${slug}`, {
                method: "DELETE",
            });
            const data = await response.json();

            if (data.success) {
                toast.success("Project deleted successfully");
                fetchProjects(); // Refresh list
            } else {
                toast.error(data.message || "Failed to delete project");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading projects...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Projects</h1>
                <Link
                    href="/dashboard/admin/manage-projects/create"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                    + Create Project
                </Link>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted text-muted-foreground border-b">
                        <tr>
                            <th className="p-4 font-medium">Title</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {projects.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-muted-foreground">No projects found. Create one to get started.</td>
                            </tr>
                        ) : projects.map((project) => (
                            <tr key={project._id} className="hover:bg-accent/50">
                                <td className="p-4">
                                    <div className="font-medium">{project.title}</div>
                                    <div className="text-xs text-muted-foreground">/{project.slug}</div>
                                </td>
                                <td className="p-4">
                                    <span
                                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${project.status === "published"
                                            ? "bg-green-100 text-green-700"
                                            : project.status === "draft"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {project.status}
                                    </span>
                                </td>
                                <td className="p-4 text-muted-foreground">
                                    {new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <Link
                                        href={`/dashboard/admin/manage-projects/edit/${project.slug}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(project.slug)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
