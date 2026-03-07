/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import NovelEditor from "@/app/components/editor/NovelEditor";
import { extractTextFromProjectDescription } from "@/lib/utils";

interface ProjectData {
    title: string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    images: (File | string)[];
    description: string;
    isIndexedInGoogle: boolean;
    relatedProjects?: string[];
}

interface ProjectFormProps {
    initialData?: ProjectData;
    isEdit?: boolean;
}

export default function ProjectForm({ initialData, isEdit }: ProjectFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const [data, setData] = useState<ProjectData>(initialData ? {
        ...initialData,
        relatedProjects: initialData.relatedProjects?.map((rp: any) =>
            typeof rp === 'string' ? rp : (rp._id || rp.id)
        ).filter(Boolean) || []
    } : {
        title: "",
        slug: "",
        metaTitle: "",
        metaDescription: "",
        images: [],
        description: "",
        isIndexedInGoogle: false,
        relatedProjects: [] as string[],
    });

    const [slugTouched, setSlugTouched] = useState(false);
    const [metaTitleTouched, setMetaTitleTouched] = useState(false);

    // Projects and writings for selection
    const [allProjects, setAllProjects] = useState<any[]>([]);
    const [loadingRelated, setLoadingRelated] = useState(true);
    const [projectSearchQuery, setProjectSearchQuery] = useState("");

    useEffect(() => {
        const fetchRelatedData = async () => {
            try {
                const [projectsRes] = await Promise.all([
                    fetch('/api/projects?limit=100'),
                ]);

                if (projectsRes.ok) {
                    const projectsData = await projectsRes.json();
                    setAllProjects(projectsData.projects || []);
                }
            } catch (err) {
                console.error("Failed to fetch related data", err);
            } finally {
                setLoadingRelated(false);
            }
        };

        fetchRelatedData();
    }, []);

    const slugify = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')        // Replace spaces with -
            .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
            .replace(/\-\-+/g, '-');     // Replace multiple - with single -
    };

    // Auto-generate slug and meta title from title
    useEffect(() => {
        if (!isEdit) {
            if (!slugTouched && data.title) {
                updateData("slug", slugify(data.title));
            }
            if (!metaTitleTouched && data.title) {
                updateData("metaTitle", data.title);
            }
        }
    }, [data.title, slugTouched, metaTitleTouched, isEdit]);

    const toggleRelatedProject = (projectId: string) => {
        const current = data.relatedProjects || [];
        if (current.includes(projectId)) {
            updateData("relatedProjects", current.filter(id => id !== projectId));
        } else {
            if (current.length >= 4) {
                toast.error("You can select up to 4 projects only");
                return;
            }
            updateData("relatedProjects", [...current, projectId]);
        }
    };

    const filteredProjects = allProjects.filter(project =>
        project.title.toLowerCase().includes(projectSearchQuery.toLowerCase()) && project.slug !== data.slug
    );

    const updateData = (field: keyof ProjectData, value: any) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = (files: FileList) => {
        const fileArray = Array.from(files);
        if (data.images.length + fileArray.length > 5) {
            toast.error("Maximum 5 images allowed");
            return;
        }

        updateData("images", [...data.images, ...fileArray]);
    };

    const removeFile = (index: number) => {
        const updatedFiles = data.images.filter((_, i) => i !== index);
        updateData("images", updatedFiles);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!data.title) {
            toast.error("Title is required");
            return;
        }
        if (!data.description) {
            toast.error("Description is required");
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();

            // Separate Files and URL strings
            const imageFiles = data.images.filter((img): img is File => img instanceof File);
            const existingImages = data.images.filter((img): img is string => typeof img === 'string');

            // Append new files
            imageFiles.forEach((file) => {
                formData.append("images", file);
            });

            // Prepare data JSON
            const projectDataToSubmit = {
                ...data,
                images: existingImages, // Send existing URLs
                relatedProjects: data.relatedProjects || [],
                isIndexedInGoogle: data.isIndexedInGoogle,
            };

            formData.append("projectData", JSON.stringify(projectDataToSubmit));

            const url = isEdit
                ? `/api/projects/${initialData?.slug || data.slug}`
                : "/api/projects";

            const method = isEdit ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(`Project ${isEdit ? 'updated' : 'created'} successfully!`);
                router.push('/dashboard/admin/manage-projects');
                router.refresh();
            } else {
                throw new Error(result.message || "Operation failed");
            }
        } catch (error: any) {
            console.error("Project submission error:", error);
            toast.error(`Failed to ${isEdit ? 'update' : 'create'} project: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to parse description safely for editor
    const getInitialDescription = (desc: any) => {
        if (!desc) return undefined;
        if (typeof desc === 'object') return desc;

        try {
            let parsed = JSON.parse(desc);
            if (typeof parsed === 'string') {
                try {
                    parsed = JSON.parse(parsed);
                } catch (e) {
                    // content is a string but not double stringified JSON
                }
            }
            return parsed;
        } catch (e) {
            return desc;
        }
    };

    // Auto-generate meta description from description if empty
    const handleDescriptionChange = (val: any) => {
        const jsonString = JSON.stringify(val);
        updateData('description', jsonString);
    };


    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-4">

            {/* Basic Info */}
            <div className="bg-card rounded-lg border p-6 space-y-6">
                <h2 className="text-xl font-semibold">Basic Information</h2>

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => {
                            const newTitle = e.target.value;
                            if (newTitle.length <= 60) {
                                updateData("title", newTitle);
                            }
                        }}
                        className="w-full px-3 py-2 border rounded-md bg-background"
                        placeholder="Project Title (max 60 chars)"
                    />
                    <div className="text-xs text-muted-foreground mt-1 text-right">{data.title.length}/60</div>
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-sm font-medium mb-2">Slug</label>
                    <input
                        type="text"
                        value={data.slug}
                        onChange={(e) => {
                            updateData("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                            if (!slugTouched) {
                                setSlugTouched(true);
                            }
                        }}
                        className="w-full px-3 py-2 border rounded-md bg-background"
                        placeholder="url-slug"
                    />
                    <div className="text-xs text-muted-foreground mt-1 text-right">Auto-generated from title (editable)</div>
                </div>
            </div>

            {/* SEO */}
            <div className="bg-card rounded-lg border p-6 space-y-6">
                <h2 className="text-xl font-semibold">SEO & Metadata</h2>

                {/* Meta Title */}
                <div>
                    <label className="block text-sm font-medium mb-2">Meta Title</label>
                    <input
                        type="text"
                        value={data.metaTitle}
                        onChange={(e) => {
                            updateData("metaTitle", e.target.value);
                            if (!metaTitleTouched) {
                                setMetaTitleTouched(true);
                            }
                        }}
                        className="w-full px-3 py-2 border rounded-md bg-background"
                        placeholder="Meta Title (auto-generated if empty)"
                    />
                    <div className="text-xs text-muted-foreground mt-1 text-right">Auto-generated from title (editable)</div>
                </div>

                {/* Meta Description */}
                <div>
                    <label className="block text-sm font-medium mb-2">Meta Description</label>
                    <textarea
                        value={data.metaDescription}
                        onChange={(e) => {
                            if (e.target.value.length <= 160) {
                                updateData("metaDescription", e.target.value);
                            }
                        }}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-md bg-background resize-none"
                        placeholder="Meta Description (max 160 chars)"
                    />
                    <div className="text-xs text-muted-foreground mt-1 text-right">{data.metaDescription.length}/160</div>
                </div>
            </div>

            {/* Images */}
            <div className="bg-card rounded-lg border p-6 space-y-6">
                <h2 className="text-xl font-semibold">Gallery (Max 5)</h2>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {data.images.map((file, index) => {
                        const isUrl = typeof file === 'string';
                        const previewUrl = isUrl ? file : URL.createObjectURL(file);

                        return (
                            <div key={index} className="relative aspect-square border rounded-md overflow-hidden group">
                                <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>
                        )
                    })}

                    {data.images.length < 5 && (
                        <div
                            onClick={() => imageInputRef.current?.click()}
                            className="aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors"
                        >
                            <span className="text-2xl text-muted-foreground">+</span>
                            <span className="text-sm text-muted-foreground">Add Image</span>
                        </div>
                    )}
                </div>
                <input
                    type="file"
                    ref={imageInputRef}
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    multiple
                    accept=".jpg,.jpeg,.png,.webp"
                    className="hidden"
                />
                <p className="text-xs text-muted-foreground">Supported: JPG, PNG, WebP. Max 5MB per image.</p>
            </div>

            {/* Related Items Selection */}
            <div className="grid grid-cols-1 gap-6">
                {/* Related Projects */}
                <div className="bg-card rounded-lg border p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Related Projects</h3>
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={projectSearchQuery}
                        onChange={(e) => setProjectSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                    />
                    <div className="border rounded-md p-4 max-h-60 overflow-y-auto bg-muted/30">
                        {loadingRelated ? (
                            <div className="text-sm text-muted-foreground">Loading...</div>
                        ) : filteredProjects.length > 0 ? (
                            <div className="space-y-2">
                                {filteredProjects.map((project) => (
                                    <label key={project._id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-accent rounded">
                                        <input
                                            type="checkbox"
                                            checked={(data.relatedProjects || []).includes(project._id)}
                                            onChange={() => toggleRelatedProject(project._id)}
                                            className="h-4 w-4 text-primary border rounded"
                                        />
                                        <span className="text-sm">{project.title}</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm">No projects found</p>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">Select up to 4 related projects</p>
                </div>
            </div>

            {/* Description */}
            <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Project Description</h2>
                <NovelEditor
                    initialValue={getInitialDescription(data.description)}
                    onChange={handleDescriptionChange}
                />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 border rounded-md hover:bg-accent"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                    {isSubmitting ? "Saving..." : (isEdit ? "Update Project" : "Create Project")}
                </button>
            </div>

        </form>
    );
}
