'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import NovelEditor from '@/app/components/editor/NovelEditor';
import { toast } from 'sonner';

export default function CreatePostPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [slugTouched, setSlugTouched] = useState(false);
    const [content, setContent] = useState(''); // Stores JSON string
    const [featuredImage, setFeaturedImage] = useState('');
    const [seoTitle, setSeoTitle] = useState('');
    const [seoTitleTouched, setSeoTitleTouched] = useState(false);
    const [seoDescription, setSeoDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);

    // Projects handling
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [projectSearchQuery, setProjectSearchQuery] = useState("");

    // Posts handling
    const [posts, setPosts] = useState<any[]>([]);
    const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [postSearchQuery, setPostSearchQuery] = useState("");

    useEffect(() => {
        fetchProjects();
        fetchPosts();
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

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/posts?limit=100');
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts || []);
            }
        } catch (err) {
            console.error("Failed to fetch posts", err);
        } finally {
            setLoadingPosts(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
        let file: File | undefined;

        if ('dataTransfer' in e) {
            e.preventDefault();
            file = e.dataTransfer.files?.[0];
        } else {
            file = e.target.files?.[0];
        }

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image size should be less than 10MB');
            return;
        }

        setUploading(true);
        setImageError(false);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                const imageUrl = result.data.url;
                setFeaturedImage(imageUrl);
                setImagePreview(imageUrl);
                toast.success('Image uploaded successfully');
            } else {
                throw new Error(result.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Image upload error:', error);
            toast.error('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
            if (!('dataTransfer' in e) && e.target) {
                e.target.value = '';
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleImageUpload(e);
    };

    const clearFeaturedImage = () => {
        setFeaturedImage('');
        setImagePreview(null);
        setImageError(false);
    };

    const handleImageError = () => {
        setImageError(true);
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

    const togglePost = (postId: string) => {
        if (selectedPosts.includes(postId)) {
            setSelectedPosts(selectedPosts.filter(id => id !== postId));
        } else {
            if (selectedPosts.length >= 4) {
                toast.error("You can select up to 4 posts only");
                return;
            }
            setSelectedPosts([...selectedPosts, postId]);
        }
    };

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(projectSearchQuery.toLowerCase())
    );

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(postSearchQuery.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const postData = {
                title,
                slug,
                content,
                featuredImage,
                seoTitle: seoTitle || title,
                seoDescription: seoDescription,
                relatedProjects: selectedProjects,
                relatedPosts: selectedPosts
            };

            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (response.ok) {
                toast.success('Post created successfully!');
                router.push('/dashboard/admin/manage-posts');
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error('Failed to create post');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Create New Post</h1>
                    <p className="text-muted-foreground mt-2">
                        Add a new post to your collection
                    </p>
                </div>
                <button
                    onClick={() => router.push('/dashboard/admin/manage-posts')}
                    className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors"
                >
                    Back to Posts
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
                                        Post Title *
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
                                            setSlug(e.target.value);
                                            setSlugTouched(true);
                                        }}
                                        required
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                        placeholder="post-slug"
                                    />
                                    <div className="text-xs text-muted-foreground mt-1">
                                        URL-friendly identifier
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
                                onChange={(val) => setContent(JSON.stringify(val))}
                            />
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
                                            setSeoTitle(e.target.value);
                                            setSeoTitleTouched(true);
                                        }}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                        placeholder="SEO optimized title (max 60 characters)"
                                        maxLength={60}
                                    />
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {seoTitle.length}/60 characters
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
                            </div>
                        </div>

                        {/* Related Posts Selection */}
                        <div className="bg-card rounded-lg shadow p-6 border border-border">
                            <h3 className="text-lg font-semibold text-card-foreground mb-4">Related Posts</h3>
                            <div className="space-y-4">
                                {loadingPosts ? (
                                    <div className="text-sm text-muted-foreground">Loading posts...</div>
                                ) : (
                                    <>
                                        {/* Search Input */}
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Search posts..."
                                                value={postSearchQuery}
                                                onChange={(e) => setPostSearchQuery(e.target.value)}
                                                className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm text-foreground focus:ring-primary focus:border-primary"
                                            />
                                        </div>

                                        {/* Post Checkboxes */}
                                        <div className="border border-border rounded-md p-4 max-h-60 overflow-y-auto bg-muted/30">
                                            {filteredPosts.length > 0 ? (
                                                <div className="space-y-2">
                                                    {filteredPosts.map((post) => (
                                                        <label key={post._id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-accent rounded text-foreground">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedPosts.includes(post._id)}
                                                                onChange={() => togglePost(post._id)}
                                                                className="h-4 w-4 text-primary border bg-background rounded focus:ring-primary"
                                                            />
                                                            <span className="text-sm">{post.title}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted-foreground text-sm">No posts found</p>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Check the posts you want to display (max 4)</p>
                                    </>
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
                                            onDragOver={handleDragOver}
                                            onDrop={handleDrop}
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
                        onClick={() => router.push('/dashboard/admin/manage-posts')}
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
                        {submitting ? 'Creating...' : 'Create Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}
