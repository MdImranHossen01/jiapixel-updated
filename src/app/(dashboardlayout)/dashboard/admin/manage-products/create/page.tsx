'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { SimpleEditor, SimpleEditorRef } from '@/components/tiptap-templates/simple/simple-editor';

const isValidUrl = (url: string): boolean => {
  if (!url || !url.trim()) return false;
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    detailedDescription: '',
    featuredImage: '',
    images: [] as string[],
    category: '',
    tags: '',
    price: {
      monthly: 0,
      quarterly: 0,
      yearly: 0
    },
    features: [''],
    specifications: [{ name: '', value: '' }],
    status: 'draft',
    featured: false,
    seoTitle: '',
    seoDescription: '',
    demoUrl: '',
    documentationUrl: '',
    supportIncluded: true,
    updatesIncluded: true
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Ref to access editor content for detailed description
  const editorRef = useRef<SimpleEditorRef>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('price.')) {
      const priceField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        price: {
          ...prev.price,
          [priceField]: parseFloat(value) || 0
        }
      }));
    } else if (name === 'featured') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (name === 'featuredImage') {
      setImageError(false);
      if (isValidUrl(value)) {
        setImagePreview(value);
      } else {
        setImagePreview(null);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

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
      e.target.value = '';
    }
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { name: '', value: '' }]
    }));
  };

  const updateSpecification = (index: number, field: 'name' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      )
    }));
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const featuresArray = formData.features.filter(feature => feature.trim());
      const specificationsArray = formData.specifications.filter(spec => spec.name.trim() && spec.value.trim());

      // Get the HTML content from the editor for detailed description
      let editorContent = '';
      if (editorRef.current) {
        editorContent = editorRef.current.getContent();
      }

      if (!formData.title.trim() || !formData.slug.trim() || !formData.description.trim() ||
        !formData.shortDescription.trim() || !editorContent.trim() || !formData.category.trim() ||
        !formData.featuredImage) {
        alert('Please fill all required fields');
        setLoading(false);
        return;
      }

      console.log('Submitting product with detailed content length:', editorContent.length);

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          detailedDescription: editorContent, // Use editor content for detailed description
          tags: tagsArray,
          features: featuresArray,
          specifications: specificationsArray
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Product created successfully!');
        router.push('/dashboard/admin/manage-products');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product');
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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Product</h1>
          <p className="text-muted-foreground mt-2">
            Create a new digital product with subscription pricing
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors"
        >
          Back to Products
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-card rounded-lg shadow p-6 border">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Basic Information</h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-card-foreground mb-2">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder="Enter product title"
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-card-foreground mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder="product-slug"
                  />
                </div>

                <div>
                  <label htmlFor="shortDescription" className="block text-sm font-medium text-card-foreground mb-2">
                    Short Description *
                  </label>
                  <textarea
                    id="shortDescription"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder="Brief description for product cards"
                    maxLength={300}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {formData.shortDescription.length}/300 characters
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-card-foreground mb-2">
                    Full Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder="Detailed product description"
                  />
                </div>
              </div>
            </div>

            {/* Detailed Description - Using SimpleEditor like blog */}
            <div className="bg-card rounded-lg shadow p-6 border">
              <label className="block text-lg font-semibold text-card-foreground mb-3">
                Detailed Description *
              </label>
              <SimpleEditor ref={editorRef} />
              <div className="text-sm text-muted-foreground mt-2">
                Write your detailed product description above. Images will be uploaded to our server via /api/upload-image.
              </div>
            </div>

            {/* Features */}
            <div className="bg-card rounded-lg shadow p-6 border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">Features</h3>
                <button
                  type="button"
                  onClick={addFeature}
                  className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm hover:bg-primary/90 transition-colors"
                >
                  Add Feature
                </button>
              </div>

              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                      placeholder="Enter feature"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="px-3 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-card rounded-lg shadow p-6 border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">Specifications</h3>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm hover:bg-primary/90 transition-colors"
                >
                  Add Specification
                </button>
              </div>

              <div className="space-y-3">
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={spec.name}
                      onChange={(e) => updateSpecification(index, 'name', e.target.value)}
                      className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                      placeholder="Specification name"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                        className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                        placeholder="Specification value"
                      />
                      {formData.specifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSpecification(index)}
                          className="px-3 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="bg-card rounded-lg shadow p-6 border">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Pricing</h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="price.monthly" className="block text-sm font-medium text-card-foreground mb-2">
                    Monthly Price ($) *
                  </label>
                  <input
                    type="number"
                    id="price.monthly"
                    name="price.monthly"
                    value={formData.price.monthly}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                  />
                </div>

                <div>
                  <label htmlFor="price.quarterly" className="block text-sm font-medium text-card-foreground mb-2">
                    3-Month Price ($) *
                  </label>
                  <input
                    type="number"
                    id="price.quarterly"
                    name="price.quarterly"
                    value={formData.price.quarterly}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                  />
                </div>

                <div>
                  <label htmlFor="price.yearly" className="block text-sm font-medium text-card-foreground mb-2">
                    Yearly Price ($) *
                  </label>
                  <input
                    type="number"
                    id="price.yearly"
                    name="price.yearly"
                    value={formData.price.yearly}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-card rounded-lg shadow p-6 border">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Featured Image *</h3>

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

                  <div className="text-center text-xs text-muted-foreground">OR</div>

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

            {/* Settings */}
            <div className="bg-card rounded-lg shadow p-6 border">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Settings</h3>

              <div className="space-y-4">
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
                    placeholder="e.g., SaaS, Tool, Plugin"
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
                    placeholder="Separate tags with commas"
                  />
                </div>

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

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-card-foreground">
                    Featured Product
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="supportIncluded"
                    name="supportIncluded"
                    checked={formData.supportIncluded}
                    onChange={(e) => setFormData(prev => ({ ...prev, supportIncluded: e.target.checked }))}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <label htmlFor="supportIncluded" className="text-sm font-medium text-card-foreground">
                    Support Included
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="updatesIncluded"
                    name="updatesIncluded"
                    checked={formData.updatesIncluded}
                    onChange={(e) => setFormData(prev => ({ ...prev, updatesIncluded: e.target.checked }))}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <label htmlFor="updatesIncluded" className="text-sm font-medium text-card-foreground">
                    Updates Included
                  </label>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="bg-card rounded-lg shadow p-6 border">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Links</h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="demoUrl" className="block text-sm font-medium text-card-foreground mb-2">
                    Demo URL
                  </label>
                  <input
                    type="url"
                    id="demoUrl"
                    name="demoUrl"
                    value={formData.demoUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder="https://demo.example.com"
                  />
                </div>

                <div>
                  <label htmlFor="documentationUrl" className="block text-sm font-medium text-card-foreground mb-2">
                    Documentation URL
                  </label>
                  <input
                    type="url"
                    id="documentationUrl"
                    name="documentationUrl"
                    value={formData.documentationUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder="https://docs.example.com"
                  />
                </div>
              </div>
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
                    placeholder="SEO optimized title"
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
                    placeholder="SEO optimized description"
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
              formData.status === 'published' ? 'Publish Product' : 'Save as Draft'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}