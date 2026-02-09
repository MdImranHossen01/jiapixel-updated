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

const parseInitialContent = (content: string) => {
    if (!content) return undefined;
    try {
        const parsed = JSON.parse(content);
        // Handle double-stringified JSON (legacy data fix)
        if (typeof parsed === 'string') {
            try {
                return JSON.parse(parsed);
            } catch {
                return parsed;
            }
        }
        return parsed;
    } catch {
        return content; // Return as string (HTML) for legacy content
    }
};

interface PostData {
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    authorName?: string;
    seoTitle?: string;
    seoDescription?: string;
    readTime: number;
    views: number;
    createdAt: string;
    updatedAt: string;
    relatedProjects?: any[];
    relatedPosts?: any[];
}

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default function EditPostPage({ params }: PageProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [post, setPost] = useState<PostData | null>(null);
    const [originalSlug, setOriginalSlug] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);

    const [projects, setProjects] = useState<any[]>([]);
    const [projectSearchQuery, setProjectSearchQuery] = useState("");

    const [posts, setPosts] = useState<any[]>([]);
    const [postSearchQuery, setPostSearchQuery] = useState("");

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
            fetchPost(resolvedParams.slug);
        }
        fetchProjects();
        fetchPosts();
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

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/posts?limit=100');
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts || []);
            }
        } catch (err) {
            console.error("Failed to fetch posts", err);
        }
    };

    const fetchPost = async (slug: string) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/posts/${slug}`);

            if (!response.ok) {
                throw new Error('Failed to fetch post');
            }

            const data = await response.json();
            if (data.success) {
                const postData = data.post;

                // Convert populated projects to IDs
                if (postData.relatedProjects && postData.relatedProjects.length > 0 && typeof postData.relatedProjects[0] === 'object') {
                    postData.relatedProjects = postData.relatedProjects.map((p: any) => p._id);
                }

                // Convert populated posts to IDs
                if (postData.relatedPosts && postData.relatedPosts.length > 0 && typeof postData.relatedPosts[0] === 'object') {
                    postData.relatedPosts = postData.relatedPosts.map((n: any) => n._id);
                }

                setPost(postData);
                setOriginalSlug(postData.slug);
                if (data.post.featuredImage && isValidUrl(data.post.featuredImage)) {
                    setImagePreview(data.post.featuredImage);
                }
            } else {
                throw new Error(data.error || 'Failed to fetch post');
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            toast.error('Failed to load post');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!post) return;

        const { name, value } = e.target;
        setPost(prev => prev ? {
            ...prev,
            [name]: value
        } : null);
    };

    const toggleProject = (projectId: string) => {
        if (!post) return;

        const currentSelected = post.relatedProjects || [];

        if (currentSelected.includes(projectId)) {
            setPost(prev => prev ? {
                ...prev,
                relatedProjects: currentSelected.filter(id => id !== projectId)
            } : null);
        } else {
            if (currentSelected.length >= 4) {
                toast.error("You can select up to 4 projects only");
                return;
            }
            setPost(prev => prev ? {
                ...prev,
                relatedProjects: [...currentSelected, projectId]
            } : null);
        }
    };

    const togglePost = (postId: string) => {
        if (!post) return;

        // Prevent self-selection
        if (postId === post._id) {
            toast.error("Cannot relate a post to itself");
            return;
        }

        const currentSelected = post.relatedPosts || [];

        if (currentSelected.includes(postId)) {
            setPost(prev => prev ? {
                ...prev,
                relatedPosts: currentSelected.filter(id => id !== postId)
            } : null);
        } else {
            if (currentSelected.length >= 4) {
                toast.error("You can select up to 4 posts only");
                return;
            }
            setPost(prev => prev ? {
                ...prev,
                relatedPosts: [...currentSelected, postId]
            } : null);
        }
    };

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(projectSearchQuery.toLowerCase())
    );

    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(postSearchQuery.toLowerCase()) && p._id !== post?._id
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
                setPost(prev => prev ? {
                    ...prev,
                    featuredImage: imageUrl
                } : null);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!post) return;

        setSaving(true);

        try {
            const updatedPost = { ...post };

            const response = await fetch(`/api/posts/${originalSlug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPost),
            });

            if (response.ok) {
                toast.success('Post updated successfully!');
                router.push('/dashboard/admin/manage-posts');
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to update post');
            }
        } catch (error) {
            console.error('Error updating post:', error);
            toast.error('Failed to update post');
        } finally {
            setSaving(false);
        }
    };

    const clearFeaturedImage = () => {
        if (!post) return;

        setPost(prev => prev ? { ...prev, featuredImage: '' } : null);
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

    if (!post) {
        return (
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-foreground mb-4">Post Not Found</h1>
                    <button
                        onClick={() => router.push('/dashboard/admin/manage-posts')}
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg"
                    >
                        Back to Posts
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Edit Post</h1>
                    <p className="text-muted-foreground mt-2">
                        Update and manage your post content
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
                                        name="title"
                                        value={post.title}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                        placeholder="Enter title..."
                                        maxLength={60}
                                    />
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {post.title.length}/60 characters
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="slug" className="block text-sm font-medium text-card-foreground mb-2">
                                        Slug *
                                    </label>
                                    <input
                                        type="text"
                                        id="slug"
                                        name="slug"
                                        value={post.slug}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                        placeholder="post-slug"
                                    />
                                    <div className="text-xs text-muted-foreground mt-1">
                                        URL-friendly identifier (editable)
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
                                initialValue={parseInitialContent(post.content) as any}
                                onChange={(val) => setPost((prev) => prev ? ({ ...prev, content: JSON.stringify(val) }) : null)}
                            />
                        </div>

                        {/* Excerpt */}
                        <div className="bg-card rounded-lg shadow p-6 border border-border">
                            <label htmlFor="excerpt" className="block text-lg font-semibold text-card-foreground mb-3">
                                Excerpt
                            </label>
                            <textarea
                                id="excerpt"
                                name="excerpt"
                                value={post.excerpt || ''}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                placeholder="Brief summary of the post..."
                                maxLength={300}
                            />
                            <div className="text-sm text-muted-foreground mt-2">
                                {(post.excerpt || '').length}/300 characters
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
                                        name="seoTitle"
                                        value={post.seoTitle || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                        placeholder="SEO optimized title (max 60 characters)"
                                        maxLength={60}
                                    />
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {(post.seoTitle || '').length}/60 characters
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="seoDescription" className="block text-sm font-medium text-card-foreground mb-2">
                                        Meta Description
                                    </label>
                                    <textarea
                                        id="seoDescription"
                                        name="seoDescription"
                                        value={post.seoDescription || ''}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                        placeholder="SEO optimized description (max 160 characters)"
                                        maxLength={160}
                                    />
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {(post.seoDescription || '').length}/160 characters
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
                                                        checked={(post.relatedProjects || []).includes(project._id)}
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
                                            {filteredPosts.map((p) => (
                                                <label key={p._id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-accent rounded text-foreground">
                                                    <input
                                                        type="checkbox"
                                                        checked={(post.relatedPosts || []).includes(p._id)}
                                                        onChange={() => togglePost(p._id)}
                                                        className="h-4 w-4 text-primary border bg-background rounded focus:ring-primary"
                                                    />
                                                    <span className="text-sm">{p.title}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-sm">No posts found</p>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">Check the posts you want to display (max 4)</p>
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="bg-card rounded-lg shadow p-6 border border-border">
                            <h3 className="text-lg font-semibold text-card-foreground mb-4">Featured Image</h3>

                            {imagePreview && isValidUrl(post.featuredImage || '') ? (
                                <div className="space-y-3">
                                    <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                                        {!imageError ? (
                                            <Image
                                                src={post.featuredImage || ''}
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
                        onClick={() => router.push('/dashboard/admin/manage-posts')}
                        disabled={saving || uploading}
                        className="px-6 py-3 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving || uploading || !post.title || !post.slug || !post.content}
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : 'Update Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}
