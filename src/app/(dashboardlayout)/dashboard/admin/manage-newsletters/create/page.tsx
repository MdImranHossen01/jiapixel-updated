'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import NovelEditor from '@/app/components/editor/NovelEditor';
import { toast } from 'sonner';

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
    const [slug, setSlug] = useState('');
    const [slugTouched, setSlugTouched] = useState(false);
    const [content, setContent] = useState(''); // Stores JSON string
    const [excerpt, setExcerpt] = useState('');
    const [featuredImage, setFeaturedImage] = useState('');
    const [seoTitle, setSeoTitle] = useState('');
    const [seoTitleTouched, setSeoTitleTouched] = useState(false);
    const [seoDescription, setSeoDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);

    // Helper to get initial value (empty content)
    const initialValue = undefined;

    // Projects handling
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [projectSearchQuery, setProjectSearchQuery] = useState("");

    // Newsletters handling
    const [newsletters, setNewsletters] = useState<any[]>([]);
    const [selectedNewsletters, setSelectedNewsletters] = useState<string[]>([]);
    const [loadingNewsletters, setLoadingNewsletters] = useState(true);
    const [newsletterSearchQuery, setNewsletterSearchQuery] = useState("");

    useEffect(() => {
        fetchProjects();
        fetchNewsletters();
    }, []);

    // Auto-generate slug and SEO title from title
    useEffect(() => {
        if (!slugTouched && title) {
            setSlug(slugify(title));
        }
        if (!seoTitleTouched && title) {
            setSeoTitle(title);
        }
    }, [title, slugTouched, seoTitleTouched]);

    const slugify = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')        // Replace spaces with -
            .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
            .replace(/\-\-+/g, '-');     // Replace multiple - with single -
    };

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

    const fetchNewsletters = async () => {
        try {
            const res = await fetch('/api/newsletters?limit=100');
            if (res.ok) {
                const data = await res.json();
                setNewsletters(data.newsletters || []);
            }
        } catch (err) {
            console.error("Failed to fetch newsletters", err);
        } finally {
            setLoadingNewsletters(false);
        }
    };

    const toggleProject = (projectId: string) => {
        if (selectedProjects.includes(projectId)) {
            setSelectedProjects(selectedProjects.filter(id => id !== projectId));
        } else {
            if (selectedProjects.length >= 4) {
                toast.error("You can select up to 4 projects only");
                return;
            }
            setSelectedProjects([...selectedProjects, projectId]);
        }
    };

    const toggleNewsletter = (newsletterId: string) => {
        if (selectedNewsletters.includes(newsletterId)) {
            setSelectedNewsletters(selectedNewsletters.filter(id => id !== newsletterId));
        } else {
            if (selectedNewsletters.length >= 4) {
                toast.error("You can select up to 4 newsletters only");
                return;
            }
            setSelectedNewsletters([...selectedNewsletters, newsletterId]);
        }
    };

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(projectSearchQuery.toLowerCase())
    );

    const filteredNewsletters = newsletters.filter(newsletter =>
        newsletter.title.toLowerCase().includes(newsletterSearchQuery.toLowerCase())
    );

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
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
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('https://api.imgbb.com/1/upload?key=d08120f6a6e1af75c0d2755245d6dee1', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                const imageUrl = result.data.url;
                setFeaturedImage(imageUrl);
                setImagePreview(imageUrl);
                setImageError(false);
                toast.success('Image uploaded successfully');
            } else {
                throw new Error(result.error?.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Image upload error:', error);
            toast.error('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
            e.target.value = '';
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
            const newsletterData = {
                title,
                slug,
                content,
                excerpt,
                featuredImage,
                seoTitle: seoTitle || title,
                seoDescription: seoDescription || excerpt,
                relatedProjects: selectedProjects,
                relatedNewsletters: selectedNewsletters
            };

            const response = await fetch('/api/newsletters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newsletterData),
            });

            if (response.ok) {
                toast.success('Newsletter created successfully!');
                router.push('/dashboard/admin/manage-newsletters');
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to create newsletter');
            }
        } catch (error) {
            console.error('Error creating newsletter:', error);
            toast.error('Failed to create newsletter');
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
                        {/* Title and Slug */}
                        <div className="bg-card rounded-lg shadow p-6 border border-border">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-card-foreground mb-2">
                                        Newsletter Title *
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                        placeholder="Enter title..."
                                        maxLength={60}
                                    />
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {title.length}/60 characters
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="slug" className="block text-sm font-medium text-card-foreground mb-2">
                                        Slug *
                                    </label>
                                    <input
                                        type="text"
                                        id="slug"
                                        value={slug}
                                        onChange={(e) => {
                                            const newSlug = e.target.value;
                                            if (!slugTouched) {
                                                setSlugTouched(true);
                                            }
                                            setSlug(newSlug);
                                        }}
                                        required
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                        placeholder="auto-generated-slug"
                                    />
                                    <div className="text-xs text-muted-foreground mt-1">
                                        Auto-generated from title (editable)
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="bg-card rounded-lg shadow p-6 border border-border">
                            <label className="block text-lg font-semibold text-card-foreground mb-3">
                                Content *
                            </label>
                            <NovelEditor
                                initialValue={initialValue}
                                onChange={(val) => setContent(val as any)}
                            />
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
                        {/* SEO Settings */}
                        <div className="bg-card rounded-lg shadow p-6 border border-border">
                            <h3 className="text-lg font-semibold text-card-foreground mb-4">SEO Settings</h3>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="seoTitle" className="block text-sm font-medium text-card-foreground mb-2">
                                        Meta Title
                                    </label>
                                    <input
                                        type="text"
                                        id="seoTitle"
                                        value={seoTitle}
                                        onChange={(e) => {
                                            const newSeoTitle = e.target.value;
                                            if (!seoTitleTouched) {
                                                setSeoTitleTouched(true);
                                            }
                                            setSeoTitle(newSeoTitle);
                                        }}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                        placeholder="SEO optimized title (max 60 characters)"
                                        maxLength={60}
                                    />
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {seoTitle.length}/60 characters · Auto-generated from title (editable)
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="seoDescription" className="block text-sm font-medium text-card-foreground mb-2">
                                        Meta Description
                                    </label>
                                    <textarea
                                        id="seoDescription"
                                        value={seoDescription}
                                        onChange={(e) => setSeoDescription(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                        placeholder="SEO optimized description (max 160 characters)"
                                        maxLength={160}
                                    />
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {seoDescription.length}/160 characters
                                    </div>
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
                                    <>
                                        {/* Search Input */}
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Search projects..."
                                                value={projectSearchQuery}
                                                onChange={(e) => setProjectSearchQuery(e.target.value)}
                                                className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm text-foreground focus:ring-primary focus:border-primary"
                                            />
                                        </div>

                                        {/* Project Checkboxes */}
                                        <div className="border border-border rounded-md p-4 max-h-60 overflow-y-auto bg-muted/30">
                                            {filteredProjects.length > 0 ? (
                                                <div className="space-y-2">
                                                    {filteredProjects.map((project) => (
                                                        <label key={project._id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-accent rounded text-foreground">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedProjects.includes(project._id)}
                                                                onChange={() => toggleProject(project._id)}
                                                                className="h-4 w-4 text-primary border bg-background rounded focus:ring-primary"
                                                            />
                                                            <span className="text-sm">{project.title}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted-foreground text-sm">No projects found</p>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Check the projects you want to display (max 4)</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Related Newsletters Selection */}
                        <div className="bg-card rounded-lg shadow p-6 border border-border">
                            <h3 className="text-lg font-semibold text-card-foreground mb-4">Related Newsletters</h3>
                            <div className="space-y-4">
                                {loadingNewsletters ? (
                                    <div className="text-sm text-muted-foreground">Loading newsletters...</div>
                                ) : (
                                    <>
                                        {/* Search Input */}
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Search newsletters..."
                                                value={newsletterSearchQuery}
                                                onChange={(e) => setNewsletterSearchQuery(e.target.value)}
                                                className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm text-foreground focus:ring-primary focus:border-primary"
                                            />
                                        </div>

                                        {/* Newsletter Checkboxes */}
                                        <div className="border border-border rounded-md p-4 max-h-60 overflow-y-auto bg-muted/30">
                                            {filteredNewsletters.length > 0 ? (
                                                <div className="space-y-2">
                                                    {filteredNewsletters.map((newsletter) => (
                                                        <label key={newsletter._id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-accent rounded text-foreground">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedNewsletters.includes(newsletter._id)}
                                                                onChange={() => toggleNewsletter(newsletter._id)}
                                                                className="h-4 w-4 text-primary border bg-background rounded focus:ring-primary"
                                                            />
                                                            <span className="text-sm">{newsletter.title}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted-foreground text-sm">No newsletters found</p>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Check the newsletters you want to display (max 4)</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="bg-card rounded-lg shadow p-6 border border-border">
                            <h3 className="text-lg font-semibold text-card-foreground mb-4">Featured Image</h3>

                            {imagePreview && isValidUrl(featuredImage) ? (
                                <div className="space-y-3">
                                    <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                                        {!imageError ? (
                                            <Image
                                                src={featuredImage}
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
                                    {/* Upload Button */}
                                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                                        <input
                                            type="file"
                                            id="image-upload"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={uploading}
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className={`cursor-pointer block ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                                        Upload Featured Image
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
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-border">
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/admin/manage-newsletters')}
                        disabled={submitting || uploading}
                        className="px-6 py-3 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting || uploading || !title || !slug || !content}
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Creating...' : 'Create Newsletter'}
                    </button>
                </div>
            </form>
        </div>
    );
}
