"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import NovelEditor from "@/app/components/editor/NovelEditor";

// Helper function to validate URL
const isValidUrl = (url: string): boolean => {
    if (!url || !url.trim()) return false;
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
        return false;
    }
};

interface LocalCategoryFormProps {
    initialData?: any;
    isEdit?: boolean;
}

const LocalCategoryForm = ({ initialData, isEdit }: LocalCategoryFormProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        banner: "",
        seoTitle: "",
        metaDescription: "",
        description: "",

        selectedProjects: [] as string[],
    });

    const [slugTouched, setSlugTouched] = useState(false);

    // Helper to parse description safely
    const getInitialDescription = (desc: any) => {
        if (!desc) return undefined;
        if (typeof desc === 'object') return desc;

        try {
            let parsed = JSON.parse(desc);
            // Handle double-stringified JSON
            if (typeof parsed === 'string') {
                try {
                    parsed = JSON.parse(parsed);
                } catch (e) {
                    // content is a string but not double stringified JSON
                }
            }
            return parsed;
        } catch (e) {
            // If parsing fails, assume it's legacy HTML string or plain text
            return desc;
        }
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                selectedProjects: initialData.selectedProjects || [],
            });
        }
    }, [initialData]);

    const slugify = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')        // Replace spaces with -
            .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
            .replace(/\-\-+/g, '-');     // Replace multiple - with single -
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const updates = { ...prev, [name]: value };

            // Auto-generate slug from title if:
            // 1. We are changing the title
            // 2. We are NOT in edit mode (to prevent breaking existing URLs)
            // 3. The user hasn't manually touched the slug field
            if (name === 'title' && !isEdit && !slugTouched) {
                updates.slug = slugify(value);
            }

            return updates;
        });

        if (name === 'slug') {
            setSlugTouched(true);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // formData.description is already updated by NovelEditor's onChange

            const submissionData = {
                ...formData,
            };

            const url = isEdit
                ? `/api/local-categories/${initialData.slug}` // Use Slug for update
                : "/api/local-categories";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submissionData),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(`Category ${isEdit ? "updated" : "created"} successfully`);
                router.push("/dashboard/admin/manage-local-categories");
            } else {
                toast.error(data.error || "Something went wrong");
            }
        } catch (error) {
            toast.error("Failed to save category");
        } finally {
            setLoading(false);
        }
    };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
        let file: File | undefined;

        if ('dataTransfer' in e) {
            e.preventDefault();
            e.stopPropagation();
            file = e.dataTransfer.files?.[0];
        } else {
            file = e.target.files?.[0];
        }

        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image size should be less than 10MB');
            return;
        }

        setUploading(true);

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('image', file);

            const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: formDataUpload,
            });

            if (!response.ok) {
                const errorText = await response.text();
                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.error?.message || `Upload failed with status: ${response.status}`);
                } catch {
                    throw new Error(errorText || `Upload failed with status: ${response.status}`);
                }
            }

            const result = await response.json();

            if (result.success && result.data?.url) {
                const imageUrl = result.data.url;
                setFormData(prev => ({
                    ...prev,
                    banner: imageUrl
                }));
                toast.success('Image uploaded successfully');
            } else {
                throw new Error(result.error?.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Image upload error:', error);
            toast.error('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
            if (!('dataTransfer' in e) && e.target) {
                (e.target as HTMLInputElement).value = '';
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const clearBanner = () => {
        setFormData(prev => ({ ...prev, banner: '' }));
    };

    // Fetch all projects
    const [availableProjects, setAvailableProjects] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/projects?limit=100'); // Fetch all
                const data = await res.json();
                if (data.success) {
                    setAvailableProjects(data.projects);
                }
            } catch (error) {
                console.error("Failed to fetch projects", error);
            }
        };
        fetchProjects();
    }, []);

    const toggleProject = (projectId: string) => {
        const currentSelected = formData.selectedProjects || [];

        if (currentSelected.includes(projectId)) {
            setFormData({ ...formData, selectedProjects: currentSelected.filter((id: string) => id !== projectId) });
        } else {
            // Limit selection if needed, keeping same limit as services for now or removing it? 
            // Services had 4 limit, user didn't specify limit for projects but let's keep it flexible or maybe increase it.
            // Let's remove the limit for projects as they might want more showcases.
            setFormData({ ...formData, selectedProjects: [...currentSelected, projectId] });
        }
    };

    const filteredProjects = availableProjects.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg shadow space-y-6 text-card-foreground">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full border bg-background rounded-lg px-3 py-2 text-foreground focus:ring-ring focus:border-ring"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Slug</label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="Auto-generated if empty"
                        className="w-full border bg-background rounded-lg px-3 py-2 text-foreground focus:ring-ring focus:border-ring"
                    />
                </div>
            </div>

            {/* Manual Project Selection */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">Select Projects to Display on Page</label>

                {/* Search Input */}
                <div className="mb-2">
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border bg-background rounded-lg px-3 py-2 text-sm text-foreground focus:ring-ring focus:border-ring"
                    />
                </div>

                <div className="border border-border rounded-md p-4 max-h-60 overflow-y-auto bg-muted/30">
                    {filteredProjects.length > 0 ? (
                        <div className="space-y-2">
                            {filteredProjects.map((project) => (
                                <label key={project._id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-accent rounded text-foreground">
                                    <input
                                        type="checkbox"
                                        checked={(formData.selectedProjects || []).includes(project._id)}
                                        onChange={() => toggleProject(project._id)}
                                        className="h-4 w-4 text-primary border bg-background rounded focus:ring-primary"
                                    />
                                    <span className="text-sm">{project.title}</span>
                                </label>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm">Loading projects or no projects found...</p>
                    )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Check the projects you want to appear on this category page.</p>
            </div>

            {/* Banner Upload */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">Banner Image</label>

                {formData.banner && isValidUrl(formData.banner) ? (
                    <div className="space-y-3">
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-border h-48 w-full md:w-1/2">
                            <Image
                                src={formData.banner}
                                alt="Banner preview"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 400px"
                                unoptimized
                            />
                        </div>
                        <button
                            type="button"
                            onClick={clearBanner}
                            className="px-3 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors text-sm"
                        >
                            Remove Image
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Upload Button */}
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/30 transition-colors">
                            <input
                                type="file"
                                id="banner-upload"
                                accept="image/*"
                                onChange={handleBannerUpload}
                                className="hidden"
                                disabled={uploading}
                            />
                            <label
                                htmlFor="banner-upload"
                                className={`cursor-pointer block ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onDragOver={handleDragOver}
                                onDrop={handleBannerUpload}
                                onDragEnter={handleDragOver}
                                onDragLeave={handleDragOver}
                            >
                                {uploading ? (
                                    <div className="flex flex-col items-center space-y-2">
                                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        <span className="text-sm text-muted-foreground">Uploading...</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-2xl mb-2">📁</div>
                                        <div className="text-sm font-medium text-foreground mb-1">
                                            Upload Banner Image
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Click to upload or drag and drop
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            PNG, JPG, GIF up to 10MB
                                        </div>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-3">Description</label>
                {/* Use NovelEditor with parsed initial value */}
                <NovelEditor
                    initialValue={getInitialDescription(initialData?.description || "") as any}
                    onChange={(val) => setFormData(prev => ({ ...prev, description: JSON.stringify(val) }))}
                />
            </div>

            {/* ... (rest of the form) ... */}


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">SEO Title</label>
                    <input
                        type="text"
                        name="seoTitle"
                        value={formData.seoTitle}
                        onChange={handleChange}
                        className="w-full border bg-background rounded-lg px-3 py-2 text-foreground focus:ring-ring focus:border-ring"
                    />
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1">Meta Description</label>
                    <textarea
                        name="metaDescription"
                        value={formData.metaDescription}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border bg-background rounded-lg px-3 py-2 text-foreground focus:ring-ring focus:border-ring"
                    />
                </div>
            </div>

            {/* Tags and FAQs removed */}\n

            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-muted-foreground hover:bg-accent rounded-lg"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg disabled:opacity-50 hover:bg-primary/90"
                >
                    {loading ? "Saving..." : isEdit ? "Update Category" : "Create Category"}
                </button>
            </div>
        </form>
    );
};

export default LocalCategoryForm;
