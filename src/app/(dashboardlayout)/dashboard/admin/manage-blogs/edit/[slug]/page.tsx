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
  // tags: string[];
  // category: string;
  // status: 'draft' | 'published' | 'archived';
  seoTitle?: string;
  seoDescription?: string;
  readTime: number;
  views: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  relatedServices?: any[]; // Allow population or array of IDs
  relatedBlogs?: any[]; // Added
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
  const [uploading, setUploading] = useState(false);
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]); // New state for blogs
  const [blogSearch, setBlogSearch] = useState("");

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
    fetchServicesAndBlogs();
  }, [resolvedParams]);

  const fetchServicesAndBlogs = async () => {
    try {
      const [servicesRes, blogsRes] = await Promise.all([
        fetch('/api/services?limit=100'),
        fetch('/api/blogs?limit=100')
      ]);

      if (servicesRes.ok) {
        const data = await servicesRes.json();
        setServices(data.services || []);
      }

      if (blogsRes.ok) {
        const data = await blogsRes.json();
        setBlogs(data.blogs || []);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  const fetchBlog = async (slug: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blogs/${slug}`);

      if (!response.ok) {
        throw new Error('Failed to fetch blog');
      }

      const data = await response.json();
      if (data.success) {
        // Ensure relatedServices is an array of IDs for the select input
        const blogData = data.blog;
        if (blogData.relatedServices && blogData.relatedServices.length > 0 && typeof blogData.relatedServices[0] === 'object') {
          blogData.relatedServices = blogData.relatedServices.map((s: any) => s._id);
        }
        // Ensure relatedBlogs is an array of IDs
        if (blogData.relatedBlogs && blogData.relatedBlogs.length > 0 && typeof blogData.relatedBlogs[0] === 'object') {
          blogData.relatedBlogs = blogData.relatedBlogs.map((b: any) => b._id);
        } else if (!blogData.relatedBlogs) {
          blogData.relatedBlogs = [];
        }

        setBlog(blogData);
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

  // Handle image upload to ImgBB
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB');
      return;
    }

    setUploading(true);

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
        setBlog(prev => prev ? {
          ...prev,
          featuredImage: imageUrl
        } : null);
        setImagePreview(imageUrl);
        setImageError(false);
      } else {
        throw new Error(result.error?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      // Reset the file input
      e.target.value = '';
    }
  };




  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!blog) return;
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setBlog(prev => prev ? {
      ...prev,
      relatedServices: selectedOptions
    } : null);
  };

  const toggleRelatedBlog = (blogId: string) => {
    if (!blog) return;
    setBlog(prev => {
      if (!prev) return null;
      const current = prev.relatedBlogs || [];
      if (current.includes(blogId)) {
        return { ...prev, relatedBlogs: current.filter(id => id !== blogId) };
      } else {
        if (current.length >= 4) {
          alert("You can verify select up to 4 related blogs.");
          return prev;
        }
        return { ...prev, relatedBlogs: [...current, blogId] };
      }
    });
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
        <div className="grid grid-cols-1 gap-6">
          {/* Main Content Column */}
          <div className="space-y-6">
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

          <div className="space-y-6">
            {/* Publishing Settings */}
            {/* Related Blogs Selection */}
            <div className="bg-card rounded-lg shadow p-6 border">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Related Blogs</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="blogSearch" className="block text-sm font-medium text-card-foreground mb-2">
                    Search Blogs
                  </label>
                  <input
                    type="text"
                    id="blogSearch"
                    value={blogSearch}
                    onChange={(e) => setBlogSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder="Search by title..."
                  />
                </div>

                <div className="border border-border rounded-lg max-h-60 overflow-y-auto p-2 space-y-2">
                  {blogs.filter(b => b.title.toLowerCase().includes(blogSearch.toLowerCase()) && b._id !== blog._id).map(b => (
                    <div key={b._id} className="flex items-center space-x-2 p-2 hover:bg-accent rounded">
                      <input
                        type="checkbox"
                        id={`blog-${b._id}`}
                        checked={(blog.relatedBlogs || []).includes(b._id)}
                        onChange={() => toggleRelatedBlog(b._id)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor={`blog-${b._id}`} className="text-sm cursor-pointer flex-1">
                        {b.title}
                      </label>
                    </div>
                  ))}
                  {blogs.length === 0 && <p className="text-muted-foreground text-sm p-2">No blogs found.</p>}
                </div>
                <div className="text-xs text-muted-foreground">
                  Selected: {(blog.relatedBlogs || []).length} / 4
                </div>
              </div>
            </div>

            {/* Related Services Selection */}
            <div className="bg-card rounded-lg shadow p-6 border border-border">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Related Services</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="relatedServices" className="block text-sm font-medium text-card-foreground mb-2">
                    Select Services (Hold Ctrl/Cmd to select multiple)
                  </label>
                  <select
                    multiple
                    id="relatedServices"
                    name="relatedServices"
                    value={blog.relatedServices || []}
                    onChange={handleServiceChange}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground h-40"
                  >
                    {services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                  <div className="text-xs text-muted-foreground mt-1">
                    Selected services will appear in the "Related Services" section of the blog post.
                  </div>
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

                  {/* Or use URL */}
                  <div className="text-center text-xs text-muted-foreground">OR</div>

                  {/* URL Input */}
                  <div>
                    <input
                      type="url"
                      name="featuredImage"
                      value={blog.featuredImage || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground text-sm"
                      placeholder="Or paste image URL here"
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
            disabled={saving || !blog.title || !blog.content}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </span>
            ) : (
              'Update Blog'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}