/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TipTapWrapper from '../../../components/TipTapWrapper';

interface Portfolio {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  featuredImage: string;
  images: string[];
  technologies: string[];
  category: string;
  client: string;
  projectDate: string;
  projectUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
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
    description: portfolio.description,
    content: portfolio.content,
    featuredImage: portfolio.featuredImage,
    images: portfolio.images || [],
    technologies: portfolio.technologies || [],
    category: portfolio.category,
    client: portfolio.client,
    projectDate: portfolio.projectDate.split('T')[0], // Format for date input
    projectUrl: portfolio.projectUrl || '',
    githubUrl: portfolio.githubUrl || '',
    featured: portfolio.featured,
    status: portfolio.status,
    metaTitle: portfolio.metaTitle || '',
    metaDescription: portfolio.metaDescription || ''
  });
  
  const [newTech, setNewTech] = useState('');
  const [newImage, setNewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleContentChange = useCallback((content: string) => {
    setFormData(prev => ({ ...prev, content }));
  }, []);

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    setFormData(prev => ({ ...prev, slug }));
  };

  const addTechnology = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage('');
    }
  };

  const removeImage = (image: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== image)
    }));
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
          router.push(`/dashboard/manage-portfolios/edit/${formData.slug}`);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology();
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Client *
                </label>
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Project Date *
                </label>
                <input
                  type="date"
                  name="projectDate"
                  value={formData.projectDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Short Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                required
              />
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
            
            <TipTapWrapper
              content={formData.content}
              onChange={handleContentChange}
            />
          </div>

          {/* Technologies */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Technologies Used</h2>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add technology..."
                className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
              <button
                type="button"
                onClick={addTechnology}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="text-xs hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Project Links */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Project Links</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Live Project URL
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
                  GitHub Repository
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

          {/* Additional Images */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Additional Images</h2>
            
            <div className="flex gap-2 mb-4">
              <input
                type="url"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Add image URL..."
                className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Add
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Project image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(image)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
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

          {/* Featured Toggle */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-foreground">Featured Project</h3>
                <p className="text-sm text-muted-foreground">
                  Show this project in featured sections
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
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
              onClick={() => router.push('/dashboard/manage-portfolios')}
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