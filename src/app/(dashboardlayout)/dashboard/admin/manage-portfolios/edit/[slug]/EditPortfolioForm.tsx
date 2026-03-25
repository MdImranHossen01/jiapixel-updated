/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NovelEditor from "@/app/components/editor/NovelEditor";

interface Portfolio {
  _id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage: string;
  images: string[];
  technologies: string[];
  projectUrl?: string;
  githubUrl?: string;
  featured: boolean;
  isIndexedInGoogle: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

interface EditPortfolioFormProps {
  portfolio: Portfolio;
}

const EditPortfolioForm: React.FC<EditPortfolioFormProps> = ({ portfolio }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: portfolio.title,
    slug: portfolio.slug,
    content: portfolio.content,
    featuredImage: portfolio.featuredImage,
    featured: portfolio.featured,
    isIndexedInGoogle: portfolio.isIndexedInGoogle || false,
    metaTitle: portfolio.metaTitle || '',
    metaDescription: portfolio.metaDescription || '',
    projectUrl: portfolio.projectUrl || '',
    githubUrl: portfolio.githubUrl || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [isMetaTitleManuallyEdited, setIsMetaTitleManuallyEdited] = useState(false);

  // Auto-slug and Meta Title effect
  useEffect(() => {
    // Only auto-generate if title has changed from original or it's a new title
    if (formData.title !== portfolio.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      setFormData(prev => ({
        ...prev,
        slug: isSlugManuallyEdited ? prev.slug : slug,
        metaTitle: isMetaTitleManuallyEdited ? prev.metaTitle : formData.title
      }));
    }
  }, [formData.title, isSlugManuallyEdited, isMetaTitleManuallyEdited, portfolio.title]);

  // Helper to parse description safely for editor
  const getInitialValue = (content: string) => {
    if (!content) return undefined;
    try {
      let parsed = JSON.parse(content);
      if (typeof parsed === 'string') {
        try {
          parsed = JSON.parse(parsed);
        } catch (e) {
          // content is a string but not double stringified JSON
        }
      }
      return parsed;
    } catch (e) {
      return undefined;
    }
  };

  const handleDescriptionChange = (val: any) => {
    setFormData(prev => ({ ...prev, content: val }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'slug') {
      setIsSlugManuallyEdited(true);
    }
    if (name === 'metaTitle') {
      setIsMetaTitleManuallyEdited(true);
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    setFormData(prev => ({ ...prev, slug }));
    setIsSlugManuallyEdited(false);
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.error?.message || 'Image upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, featuredImage: imageUrl }));
    } catch (error: any) {
      alert(`Failed to upload image: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      const response = await fetch(`/api/portfolios/${portfolio.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        // Update the URL if slug changed
        if (formData.slug !== portfolio.slug) {
          router.push(`/dashboard/admin/manage-portfolios/edit/${formData.slug}`);
        }
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating portfolio:', error);
      alert('Failed to update portfolio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Edit Portfolio</h1>
            <p className="text-muted-foreground">
              Update your portfolio project: {portfolio.title}
            </p>
          </div>
          {saved && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
              Changes saved successfully!
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Slug *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/80 transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Project Live Link
                  </label>
                  <input
                    type="url"
                    name="projectUrl"
                    value={formData.projectUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    GitHub Repository Link
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Featured Image</h2>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Upload Featured Image *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFeaturedImageUpload}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
              {uploading && (
                <p className="text-sm text-muted-foreground mt-2">Uploading image...</p>
              )}
              {formData.featuredImage && (
                <div className="mt-4">
                  <p className="text-sm text-foreground mb-2">Current Image:</p>
                  <img
                    src={formData.featuredImage}
                    alt="Featured preview"
                    className="max-w-xs rounded-lg border border-border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Project Content */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Project Content</h2>
            <NovelEditor
              initialValue={getInitialValue(formData.content)}
              onChange={handleDescriptionChange}
            />
          </div>

          {/* SEO Settings */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">SEO Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  placeholder="Optional - defaults to project title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Meta Description
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  placeholder="Optional - defaults to project description"
                />
              </div>
            </div>
          </div>


          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-border">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating Portfolio...' : 'Update Portfolio'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard/admin/manage-portfolios')}
              className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => router.push(`/portfolios/${portfolio.slug}`)}
              className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              View Live
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPortfolioForm;