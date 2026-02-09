"use client";

import ProjectForm from "../components/ProjectForm";

export default function CreateProjectPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Create New Project</h1>
            <ProjectForm />
        </div>
    );
}
