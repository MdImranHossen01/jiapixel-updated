'use client';

import { useState, useRef, useEffect } from 'react';
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

export default function CreateBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]); // state for fetching blogs
  const [blogSearch, setBlogSearch] = useState("");
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',

    seoTitle: '',
    seoDescription: '',
    relatedServices: [] as string[],
    relatedBlogs: [] as string[] // new field for selected blogs
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Ref to access editor content
  const editorRef = useRef<SimpleEditorRef>(null);

  // Fetch services and blogs on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, blogsRes] = await Promise.all([
          fetch('/api/services?limit=100'),
          fetch('/api/blogs?limit=100') // Fetch all blogs for selection
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
    }
    fetchData();
  }, []);

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      relatedServices: selectedOptions
    }));
  };

  const toggleRelatedBlog = (blogId: string) => {
    setFormData(prev => {
      const current = prev.relatedBlogs;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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
        setFormData(prev => ({
          ...prev,
          featuredImage: imageUrl
        }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get the HTML content from the editor
      let editorContent = '';
      if (editorRef.current) {
        editorContent = editorRef.current.getContent();
      }

      // Validate required fields
      // Validate required fields
      if (!formData.title.trim() || !editorContent.trim()) {
        alert('Title and content are required');
        setLoading(false);
        return;
      }

      console.log('Submitting blog with content length:', editorContent.length);

      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: editorContent,
          excerpt: formData.excerpt,
          featuredImage: formData.featuredImage,

          // tags and category removed
          seoTitle: formData.seoTitle,
          seoDescription: formData.seoDescription,
          relatedServices: formData.relatedServices,
          relatedBlogs: formData.relatedBlogs // Added relatedBlogs
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Blog created successfully!');
        router.push('/dashboard/admin/manage-blogs');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create blog');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  const clearFeaturedImage = () => {
    setFormData(prev => ({ ...prev, featuredImage: '' }));
    setImagePreview(null);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Blog</h1>
          <p className="text-muted-foreground mt-2">
            Create and publish engaging blog content with our rich text editor
          </p>
        </div>
        <button
          onClick={() => router.back()}
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
            <div className="bg-card rounded-lg shadow p-6 border">
              <label htmlFor="title" className="block text-lg font-semibold text-card-foreground mb-3">
                Blog Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-lg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                placeholder="Enter a compelling blog title..."
                maxLength={200}
              />
              <div className="text-sm text-muted-foreground mt-2">
                {formData.title.length}/200 characters
              </div>
            </div>

            {/* Blog Content */}
            <div className="bg-card rounded-lg shadow p-6 border">
              <label className="block text-lg font-semibold text-card-foreground mb-3">
                Blog Content *
              </label>
              <SimpleEditor ref={editorRef} />
              <div className="text-sm text-muted-foreground mt-2">
                Write your blog content above. Images will be automatically uploaded to ImgBB.
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-card rounded-lg shadow p-6 border">
              <label htmlFor="excerpt" className="block text-lg font-semibold text-card-foreground mb-3">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                placeholder="Write a brief description of your blog post for search engines and social media..."
                maxLength={300}
              />
              <div className="text-sm text-muted-foreground mt-2">
                {formData.excerpt.length}/300 characters
              </div>
            </div>
          </div>

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
                {blogs.filter(b => b.title.toLowerCase().includes(blogSearch.toLowerCase())).map(blog => (
                  <div key={blog._id} className="flex items-center space-x-2 p-2 hover:bg-accent rounded">
                    <input
                      type="checkbox"
                      id={`blog-${blog._id}`}
                      checked={formData.relatedBlogs.includes(blog._id)}
                      onChange={() => toggleRelatedBlog(blog._id)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor={`blog-${blog._id}`} className="text-sm cursor-pointer flex-1">
                      {blog.title}
                    </label>
                  </div>
                ))}
                {blogs.length === 0 && <p className="text-muted-foreground text-sm p-2">No blogs found.</p>}
              </div>
              <div className="text-xs text-muted-foreground">
                Selected: {formData.relatedBlogs.length} / 4
              </div>
            </div>
          </div>

          {/* Related Services Selection */}
          <div className="bg-card rounded-lg shadow p-6 border">
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
                  value={formData.relatedServices}
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
          <div className="bg-card rounded-lg shadow p-6 border">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Featured Image</h3>

            {imagePreview && isValidUrl(formData.featuredImage) ? (
              <div className="space-y-3">
                <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                  {!imageError ? (
                    <Image
                      src={formData.featuredImage}
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
                    value={formData.featuredImage}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground text-sm"
                    placeholder="Or paste image URL here"
                  />
                  {formData.featuredImage && !isValidUrl(formData.featuredImage) && (
                    <div className="text-xs text-destructive mt-1">
                      Please enter a valid URL
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SEO Settings */}
          <div className="bg-card rounded-lg shadow p-6 border">
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
                  value={formData.seoTitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                  placeholder="SEO optimized title (max 60 characters)"
                  maxLength={60}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {formData.seoTitle.length}/60 characters
                </div>
              </div>

              <div>
                <label htmlFor="seoDescription" className="block text-sm font-medium text-card-foreground mb-2">
                  SEO Description
                </label>
                <textarea
                  id="seoDescription"
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                  placeholder="SEO optimized description (max 160 characters)"
                  maxLength={160}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {formData.seoDescription.length}/160 characters
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-4 pt-6 border-t border-border">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading || uploading}
            className="px-6 py-3 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                <span>Creating...</span>
              </span>
            ) : (
              'Publish Blog'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}