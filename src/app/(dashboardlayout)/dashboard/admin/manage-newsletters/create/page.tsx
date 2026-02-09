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

export default function CreateNewsletterPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); // Stores JSON string
    const [excerpt, setExcerpt] = useState('');
    const [featuredImage, setFeaturedImage] = useState('');
    const [status, setStatus] = useState('draft');
    const [tags, setTags] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);

    // Helper to get initial value (empty content)
    // cast to any because NovelEditor expects generic structure but we pass undefined for new props
    const initialValue = undefined;

    // Projects handling
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects?limit=100');
            if (res.ok) {
                const data = await res.json();
                setProjects(data.projects || []);
            }
        } catch (err) {
            console.error("Failed to fetch projects", err);
        } finally {
            setLoadingProjects(false);
        }
    };

    const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedProjects(selectedOptions);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setFeaturedImage(url);
        setImageError(false);
        if (isValidUrl(url)) {
            setImagePreview(url);
        } else {
            setImagePreview(null);
        }
    };

    const clearFeaturedImage = () => {
        setFeaturedImage('');
        setImagePreview(null);
        setImageError(false);
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Content is already updated via onChange in NovelEditor
            const newsletterData = {
                title,
                content,
                excerpt,
                featuredImage,
                status,
                tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                relatedProjects: selectedProjects
            };

            const response = await fetch('/api/newsletters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newsletterData),
            });

            if (response.ok) {
                alert('Newsletter created successfully!');
                router.push('/dashboard/admin/manage-newsletters');
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to create newsletter');
            }
        } catch (error) {
            console.error('Error creating newsletter:', error);
            alert('Failed to create newsletter');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Create New Newsletter</h1>
                    <p className="text-muted-foreground mt-2">
                        Draft a new newsletter for your subscribers
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
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full px-4 py-3 text-lg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                placeholder="Enter title..."
                                maxLength={200}
                            />
                            <div className="text-sm text-muted-foreground mt-2">
                                {title.length}/200 characters
                            </div>
                        </div>

                        {/* Content */}
                        <div className="bg-card rounded-lg shadow p-6 border border-border">
                            <label className="block text-lg font-semibold text-card-foreground mb-3">
                                Content *
                            </label>
                            <div className="min-h-[400px] border border-border rounded-lg bg-background">
                                <NovelEditor
                                    initialValue={initialValue}
                                    onChange={(val) => setContent(val as any)}
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
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                placeholder="Brief summary of the newsletter..."
                                maxLength={300}
                            />
                            <div className="text-sm text-muted-foreground mt-2">
                                {excerpt.length}/300 characters
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
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
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
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
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
                                {loadingProjects ? (
                                    <div className="text-sm text-muted-foreground">Loading projects...</div>
                                ) : (
                                    <div>
                                        <label htmlFor="relatedProjects" className="block text-sm font-medium text-card-foreground mb-2">
                                            Select Projects (Hold Ctrl/Cmd to select multiple)
                                        </label>
                                        <select
                                            multiple
                                            id="relatedProjects"
                                            value={selectedProjects}
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
                                )}
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="bg-card rounded-lg shadow p-6 border border-border">
                            <h3 className="text-lg font-semibold text-card-foreground mb-4">Featured Image</h3>

                            {imagePreview ? (
                                <div className="space-y-3">
                                    <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                                        {!imageError ? (
                                            <Image
                                                src={imagePreview}
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
                                            value={featuredImage}
                                            onChange={handleImageChange}
                                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground text-sm"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-border">
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/admin/manage-newsletters')}
                        disabled={submitting}
                        className="px-6 py-3 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting || !title || !content}
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Creating...' : status === 'published' ? 'Publish Newsletter' : 'Save as Draft'}
                    </button>
                </div>
            </form>
        </div>
    );
}
