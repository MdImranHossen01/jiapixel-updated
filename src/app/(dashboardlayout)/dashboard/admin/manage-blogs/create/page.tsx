'use client';

import { useState, useRef } from 'react';
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
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    tags: '',
    category: '',
    status: 'draft',
    seoTitle: '',
    seoDescription: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  
  // Ref to access editor content
  const editorRef = useRef<SimpleEditorRef>(null);

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

      const response = await fetch('https://api.imgbb.com/1/upload?key=d08120f6a6e1af75c0d2755245d6dee1', {
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
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      // Get the HTML content from the editor
      let editorContent = '';
      if (editorRef.current) {
        editorContent = editorRef.current.getContent();
      }
      
      // Validate required fields
      if (!formData.title.trim() || !editorContent.trim() || !formData.category.trim()) {
        alert('Title, content, and category are required');
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
          tags: tagsArray,
          category: formData.category,
          status: formData.status,
          seoTitle: formData.seoTitle,
          seoDescription: formData.seoDescription
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

          <div className="space-y-6">
            {/* Publishing Settings */}
            <div className="bg-card rounded-lg shadow p-6 border">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Publishing Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-card-foreground mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
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
                    value={formData.category}
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
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder="Separate tags with commas (nextjs, react, web)"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Separate multiple tags with commas
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
        </div>

        {/* Action Buttons */}
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
              formData.status === 'published' ? 'Publish Blog' : 'Save as Draft'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}