'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import Image from 'next/image';
import { SimpleEditor, SimpleEditorRef } from '@/components/tiptap-templates/simple/simple-editor';



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

interface BlogData {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  authorName?: string;
  tags: string[];
  category: string;
  status: 'draft' | 'published' | 'archived';
  seoTitle?: string;
  seoDescription?: string;
  readTime: number;
  views: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function EditBlogPage({ params }: PageProps) {
  const editorRef = useRef<SimpleEditorRef>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

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
      fetchBlog(resolvedParams.slug);
    }
  }, [resolvedParams]);

  const fetchBlog = async (slug: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blogs/${slug}`);

      if (!response.ok) {
        throw new Error('Failed to fetch blog');
      }

      const data = await response.json();
      if (data.success) {
        setBlog(data.blog);
        if (data.blog.featuredImage && isValidUrl(data.blog.featuredImage)) {
          setImagePreview(data.blog.featuredImage);
        }
      } else {
        throw new Error(data.error || 'Failed to fetch blog');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      alert('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!blog) return;

    const { name, value } = e.target;
    setBlog(prev => prev ? {
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
    if (!blog) return;

    const tagsString = e.target.value;
    setBlog(prev => prev ? {
      ...prev,
      tags: tagsString.split(',').map(tag => tag.trim()).filter(tag => tag)
    } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog) return;

    setSaving(true);

    try {
      // Get latest content from editor
      let content = blog.content;
      if (editorRef.current) {
        content = editorRef.current.getContent();
      }

      const updatedBlog = { ...blog, content };

      const response = await fetch(`/api/blogs/${blog.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBlog),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Blog updated successfully!');
        router.push('/dashboard/admin/manage-blogs');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update blog');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Failed to update blog');
    } finally {
      setSaving(false);
    }
  };

  const clearFeaturedImage = () => {
    if (!blog) return;

    setBlog(prev => prev ? { ...prev, featuredImage: '' } : null);
    setImagePreview(null);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Blog</h1>
            <p className="text-muted-foreground mt-2">Loading blog post...</p>
          </div>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">Blog Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push('/dashboard/admin/manage-blogs')}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  const tagsString = blog.tags.join(', ');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Blog</h1>
          <p className="text-muted-foreground mt-2">
            Update and manage your blog content with our rich text editor
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/admin/manage-blogs')}
          className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors"
        >
          Back to Blogs
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Blog Title */}
            <div className="bg-card rounded-lg shadow p-6 border border-border">
              <label htmlFor="title" className="block text-lg font-semibold text-card-foreground mb-3">
                Blog Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={blog.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-lg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                placeholder="Enter a compelling blog title..."
                maxLength={200}
              />
              <div className="text-sm text-muted-foreground mt-2">
                {blog.title.length}/200 characters
              </div>
            </div>

            {/* Blog Content */}
            <div className="bg-card rounded-lg shadow p-6 border border-border">
              <label className="block text-lg font-semibold text-card-foreground mb-3">
                Blog Content *
              </label>
              <SimpleEditor ref={editorRef} initialContent={blog.content} />
            </div>

            {/* Excerpt */}
            <div className="bg-card rounded-lg shadow p-6 border border-border">
              <label htmlFor="excerpt" className="block text-lg font-semibold text-card-foreground mb-3">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={blog.excerpt || ''}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                placeholder="Write a brief description of your blog post for search engines and social media..."
                maxLength={300}
              />
              <div className="text-sm text-muted-foreground mt-2">
                {(blog.excerpt || '').length}/300 characters
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
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
                    value={blog.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-card-foreground mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={blog.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder="e.g., Technology, Business, Design"
                  />
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
                    placeholder="Separate tags with commas (nextjs, react, web)"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Separate multiple tags with commas
                  </div>
                </div>

                <div>
                  <label htmlFor="authorName" className="block text-sm font-medium text-card-foreground mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    id="authorName"
                    name="authorName"
                    value={blog.authorName || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder="Author name"
                  />
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-card rounded-lg shadow p-6 border border-border">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Featured Image</h3>

              {imagePreview && isValidUrl(blog.featuredImage || '') ? (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                    {!imageError ? (
                      <Image
                        src={blog.featuredImage || ''}
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
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <div className="text-muted-foreground mb-2">
                      No featured image selected
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Add a valid URL to display a featured image
                    </div>
                  </div>
                  <div>
                    <input
                      type="url"
                      name="featuredImage"
                      value={blog.featuredImage || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground text-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                    {blog.featuredImage && !isValidUrl(blog.featuredImage) && (
                      <div className="text-xs text-destructive mt-1">
                        Please enter a valid URL
                      </div>
                    )}
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
                    value={blog.seoTitle || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder="SEO optimized title (max 60 characters)"
                    maxLength={60}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {(blog.seoTitle || '').length}/60 characters
                  </div>
                </div>

                <div>
                  <label htmlFor="seoDescription" className="block text-sm font-medium text-card-foreground mb-2">
                    SEO Description
                  </label>
                  <textarea
                    id="seoDescription"
                    name="seoDescription"
                    value={blog.seoDescription || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder="SEO optimized description (max 160 characters)"
                    maxLength={160}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {(blog.seoDescription || '').length}/160 characters
                  </div>
                </div>
              </div>
            </div>

            {/* Blog Statistics */}
            <div className="bg-card rounded-lg shadow p-6 border border-border">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Blog Statistics</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Read Time:</span>
                  <span className="text-foreground font-medium">{blog.readTime} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Views:</span>
                  <span className="text-foreground font-medium">{blog.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="text-foreground font-medium">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="text-foreground font-medium">
                    {new Date(blog.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                {blog.publishedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Published:</span>
                    <span className="text-foreground font-medium">
                      {new Date(blog.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-border">
          <button
            type="button"
            onClick={() => router.push('/dashboard/admin/manage-blogs')}
            disabled={saving}
            className="px-6 py-3 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !blog.title || !blog.content || !blog.category}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </span>
            ) : (
              blog.status === 'published' ? 'Update Blog' : 'Save as Draft'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}