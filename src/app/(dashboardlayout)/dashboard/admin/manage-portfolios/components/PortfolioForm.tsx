/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import NovelEditor from "@/app/components/editor/NovelEditor";

interface PortfolioData {
  title: string;
  slug: string;
  content: string;
  featuredImage: string;
  featured: boolean;
  isIndexedInGoogle: boolean;
  metaTitle: string;
  metaDescription: string;
  projectUrl: string;
  githubUrl: string;
}

interface PortfolioFormProps {
  initialData?: PortfolioData;
  isEdit?: boolean;
  originalSlug?: string;
}

export default function PortfolioForm({ initialData, isEdit, originalSlug }: PortfolioFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [isMetaTitleManuallyEdited, setIsMetaTitleManuallyEdited] = useState(false);

  const [formData, setFormData] = useState<PortfolioData>(
    initialData || {
      title: "",
      slug: "",
      content: "",
      featuredImage: "",
      featured: false,
      isIndexedInGoogle: false,
      metaTitle: "",
      metaDescription: "",
      projectUrl: "",
      githubUrl: "",
    }
  );

  // Auto-slug and Meta Title effect
  useEffect(() => {
    if (!isEdit || (initialData && formData.title !== initialData.title)) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      setFormData((prev) => ({
        ...prev,
        slug: isSlugManuallyEdited ? prev.slug : slug,
        metaTitle: isMetaTitleManuallyEdited ? prev.metaTitle : formData.title,
      }));
    }
  }, [formData.title, isSlugManuallyEdited, isMetaTitleManuallyEdited, isEdit, initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === "slug") setIsSlugManuallyEdited(true);
    if (name === "metaTitle") setIsMetaTitleManuallyEdited(true);

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleDescriptionChange = (val: any) => {
    setFormData((prev) => ({ ...prev, content: JSON.stringify(val) }));
  };

  const getInitialValue = (content: string) => {
    if (!content) return undefined;
    try {
      let parsed = JSON.parse(content);
      if (typeof parsed === "string") {
        try {
          parsed = JSON.parse(parsed);
        } catch (e) {}
      }
      return parsed;
    } catch (e) {
      return undefined;
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const data = new FormData();
      data.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();
      if (result.success) {
        return result.data.url;
      } else {
        throw new Error(result.error?.message || "Image upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      setFormData((prev) => ({ ...prev, featuredImage: url }));
    } catch (error: any) {
      toast.error(`Failed to upload image: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/api/portfolios/${originalSlug || formData.slug}` : "/api/portfolios";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Portfolio ${isEdit ? "updated" : "created"} successfully!`);
        router.push("/dashboard/admin/manage-portfolios");
        router.refresh();
      } else {
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(`Failed to ${isEdit ? "update" : "create"} portfolio`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isEdit ? "Edit Portfolio" : "Create New Portfolio"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit
              ? `Update your project: ${formData.title}`
              : "Add a new project to your portfolio website."}
          </p>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Project Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            required
            placeholder="e.g. Modern Web Design"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Slug *</label>
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
              onClick={() => {
                const slug = formData.title
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)+/g, "");
                setFormData((prev) => ({ ...prev, slug }));
                setIsSlugManuallyEdited(false);
              }}
              className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/80 transition-colors"
            >
              Generate
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="featured"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
            className="h-4 w-4 rounded border-border text-primary"
          />
          <label htmlFor="featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Featured Project
          </label>
        </div>
      </div>

      {/* Featured Image */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Featured Image</h2>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Upload Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
          />
          {uploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
          {formData.featuredImage && (
            <div className="mt-4">
              <img
                src={formData.featuredImage}
                alt="Preview"
                className="max-w-xs rounded-lg border border-border bg-muted"
              />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Project Details *</h2>
        <NovelEditor initialValue={getInitialValue(formData.content)} onChange={handleDescriptionChange} />
        {(!formData.content || formData.content === '{"type":"doc","content":[]}') && (
          <p className="text-destructive text-sm">Description content is required.</p>
        )}
      </div>

      {/* SEO & Links */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-6">
        <h2 className="text-xl font-semibold text-foreground">SEO & Links</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Meta Title</label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              placeholder="Defaults to title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Meta Description</label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              placeholder="Brief description for SEO"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Live URL</label>
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
              <label className="block text-sm font-medium text-foreground mb-2">GitHub URL</label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                placeholder="https://github.com/..."
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isIndexedInGoogle"
            id="isIndexed"
            checked={formData.isIndexedInGoogle}
            onChange={(e) => setFormData((prev) => ({ ...prev, isIndexedInGoogle: e.target.checked }))}
            className="h-4 w-4 rounded border-border text-primary"
          />
          <label htmlFor="isIndexed" className="text-sm font-medium leading-none">
            Indexed in Google
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-6 border-t border-border">
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 font-medium"
        >
          {loading ? "Saving..." : isEdit ? "Update Portfolio" : "Create Portfolio"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/admin/manage-portfolios")}
          className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
