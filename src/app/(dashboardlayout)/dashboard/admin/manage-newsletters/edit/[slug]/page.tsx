
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Image from 'next/image';
import NovelEditor from '@/app/components/editor/NovelEditor';

// Helper function to validate URL
const isValidUrl = (url: string): boolean => {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

const parseInitialContent = (content: string) => {
    if (!content) return undefined;
    try {
        return JSON.parse(content);
    } catch {
        return content; // Return as string (HTML) for legacy content
    }
};

interface NewsletterData {
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    authorName?: string;
    tags: string[];
    status: 'draft' | 'published' | 'archived';
    seoTitle?: string;
    seoDescription?: string;
    readTime: number;
    views: number;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    relatedProjects?: any[];
}

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default function EditNewsletterPage({ params }: PageProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newsletter, setNewsletter] = useState<NewsletterData | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);

    // Await params in useEffect
    const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null);

    useEffect(() => {
        async function resolveParams() {
            const resolved = await params;
            setResolvedParams(resolved);
        }
        resolveParams();
    }, [params]);

    useEffect(() => {
        if (resolvedParams?.slug) {
            fetchNewsletter(resolvedParams.slug);
        }
        fetchProjects();
    }, [resolvedParams]);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects?limit=100');
            if (res.ok) {
                const data = await res.json();
                setProjects(data.projects || []);
            }
        } catch (err) {
            console.error("Failed to fetch projects", err);
        }
    };

    const fetchNewsletter = async (slug: string) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/newsletters/${slug}`);

            if (!response.ok) {
                throw new Error('Failed to fetch newsletter');
            }

            const data = await response.json();
            if (data.success) {
                const newsletterData = data.newsletter;
                if (newsletterData.relatedProjects && newsletterData.relatedProjects.length > 0 && typeof newsletterData.relatedProjects[0] === 'object') {
                    newsletterData.relatedProjects = newsletterData.relatedProjects.map((p: any) => p._id);
                }

                setNewsletter(newsletterData);
                if (data.newsletter.featuredImage && isValidUrl(data.newsletter.featuredImage)) {
                    setImagePreview(data.newsletter.featuredImage);
                }
            } else {
                throw new Error(data.error || 'Failed to fetch newsletter');
            }
        } catch (error) {
            console.error('Error fetching newsletter:', error);
            alert('Failed to load newsletter');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!newsletter) return;

        const { name, value } = e.target;
        setNewsletter(prev => prev ? {
            ...prev,
            [name]: value
        } : null);

        // Handle image preview for featured image
        if (name === 'featuredImage') {
            setImageError(false);
            if (isValidUrl(value)) {
                setImagePreview(value);
            } else {
                setImagePreview(null);
            }
        }
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!newsletter) return;

        const tagsString = e.target.value;
        setNewsletter(prev => prev ? {
            ...prev,
            tags: tagsString.split(',').map(tag => tag.trim()).filter(tag => tag)
        } : null);
    };

    const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!newsletter) return;
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setNewsletter(prev => prev ? {
            ...prev,
            relatedProjects: selectedOptions
        } : null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletter) return;

        setSaving(true);

        try {
            // content is already updated in state by NovelEditor onChange
            const updatedNewsletter = { ...newsletter };

            const response = await fetch(`/api/newsletters/${newsletter.slug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedNewsletter),
            });

            if (response.ok) {
                const result = await response.json();
                alert('Newsletter updated successfully!');
                router.push('/dashboard/admin/manage-newsletters');
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to update newsletter');
            }
        } catch (error) {
            console.error('Error updating newsletter:', error);
            alert('Failed to update newsletter');
        } finally {
            setSaving(false);
        }
    };

    const clearFeaturedImage = () => {
        if (!newsletter) return;

        setNewsletter(prev => prev ? { ...prev, featuredImage: '' } : null);
        setImagePreview(null);
        setImageError(false);
    };

    const handleImageError = () => {
        setImageError(true);
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-12 bg-muted rounded"></div>
                    <div className="h-64 bg-muted rounded"></div>
                </div>
            </div>
        );
    }

    if (!newsletter) {
        return (
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-foreground mb-4">Newsletter Not Found</h1>
                    <button
                        onClick={() => router.push('/dashboard/admin/manage-newsletters')}
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg"
                    >
                        Back to Newsletters
                    </button>
                </div>
            </div>
        );
    }

    const tagsString = newsletter.tags.join(', ');

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Edit Newsletter</h1>
                    <p className="text-muted-foreground mt-2">
                        Update and manage your newsletter content
                    </p>
                </div>
                <button
                    onClick={() => router.push('/dashboard/admin/manage-newsletters')}
                    className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors"
                >
                    Back to Newsletters
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    {/* Main Content Column */}
                    <div className="space-y-6">
                        {/* Title */}
                        <div className="bg-card rounded-lg shadow p-6 border border-border">
                            <label htmlFor="title" className="block text-lg font-semibold text-card-foreground mb-3">
                                Newsletter Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={newsletter.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 text-lg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                placeholder="Enter title..."
                                maxLength={200}
                            />
                            <div className="text-sm text-muted-foreground mt-2">
                                {newsletter.title.length}/200 characters
                            </div>
                        </div>

                        {/* Content */}
                        <div className="bg-card rounded-lg shadow p-6 border border-border">
                            <label className="block text-lg font-semibold text-card-foreground mb-3">
                                Content *
                            </label>
                            <div className="min-h-[400px] border border-border rounded-lg bg-background">
                                <NovelEditor
                                    initialValue={parseInitialContent(newsletter.content) as any}
                                    onChange={(val) => setNewsletter((prev) => prev ? ({ ...prev, content: JSON.stringify(val) }) : null)}
                                />
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div className="bg-card rounded-lg shadow p-6 border border-border">
                            <label htmlFor="excerpt" className="block text-lg font-semibold text-card-foreground mb-3">
                                Excerpt
                            </label>
                            <textarea
                                id="excerpt"
                                name="excerpt"
                                value={newsletter.excerpt || ''}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                placeholder="Excerpt..."
                                maxLength={300}
                            />
                            <div className="text-sm text-muted-foreground mt-2">
                                {(newsletter.excerpt || '').length}/300 characters
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Publishing Settings */}
                        <div className="bg-card rounded-lg shadow p-6 border border-border">
                            <h3 className="text-lg font-semibold text-card-foreground mb-4">Publishing Settings</h3>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-card-foreground mb-2">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={newsletter.status}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="tags" className="block text-sm font-medium text-card-foreground mb-2">
                                        Tags
                                    </label>
                                    <input
                                        type="text"
                                        id="tags"
                                        name="tags"
                                        value={tagsString}
                                        onChange={handleTagsChange}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                        placeholder="Separate tags with commas"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Related Projects Selection */}
                        <div className="bg-card rounded-lg shadow p-6 border border-border">
                            <h3 className="text-lg font-semibold text-card-foreground mb-4">Related Projects</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="relatedProjects" className="block text-sm font-medium text-card-foreground mb-2">
                                        Select Projects (Hold Ctrl/Cmd to select multiple)
                                    </label>
                                    <select
                                        multiple
                                        id="relatedProjects"
                                        name="relatedProjects"
                                        value={newsletter.relatedProjects || []}
                                        onChange={handleProjectChange}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground h-40"
                                    >
                                        {projects.map((project) => (
                                            <option key={project._id} value={project._id}>
                                                {project.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="bg-card rounded-lg shadow p-6 border border-border">
                            <h3 className="text-lg font-semibold text-card-foreground mb-4">Featured Image</h3>

                            {imagePreview && isValidUrl(newsletter.featuredImage || '') ? (
                                <div className="space-y-3">
                                    <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                                        {!imageError ? (
                                            <Image
                                                src={newsletter.featuredImage || ''}
                                                alt="Featured image preview"
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 400px"
                                                onError={handleImageError}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                                                Failed to load image
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={clearFeaturedImage}
                                        className="w-full px-3 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors text-sm"
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div>
                                        <input
                                            type="url"
                                            name="featuredImage"
                                            value={newsletter.featuredImage || ''}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground text-sm"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SEO Settings */}
                        <div className="bg-card rounded-lg shadow p-6 border border-border">
                            <h3 className="text-lg font-semibold text-card-foreground mb-4">SEO Settings</h3>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="seoTitle" className="block text-sm font-medium text-card-foreground mb-2">
                                        SEO Title
                                    </label>
                                    <input
                                        type="text"
                                        id="seoTitle"
                                        name="seoTitle"
                                        value={newsletter.seoTitle || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                        placeholder="SEO optimized title"
                                        maxLength={60}
                                    />
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {(newsletter.seoTitle || '').length}/60 characters
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="seoDescription" className="block text-sm font-medium text-card-foreground mb-2">
                                        SEO Description
                                    </label>
                                    <textarea
                                        id="seoDescription"
                                        name="seoDescription"
                                        value={newsletter.seoDescription || ''}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                        placeholder="SEO optimized description"
                                        maxLength={160}
                                    />
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {(newsletter.seoDescription || '').length}/160 characters
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-border">
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/admin/manage-newsletters')}
                        disabled={saving}
                        className="px-6 py-3 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving || !newsletter.title || !newsletter.content}
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : newsletter.status === 'published' ? 'Update' : 'Save as Draft'}
                    </button>
                </div>
            </form>
        </div>
    );
}
