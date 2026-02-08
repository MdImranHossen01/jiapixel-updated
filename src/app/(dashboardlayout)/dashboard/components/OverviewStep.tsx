/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import type { ServiceData } from "./ServiceWizard";
import { extractTextFromProjectDescription } from "@/lib/utils";

interface Props {
  data: ServiceData;
  updateData: (field: keyof ServiceData, value: any) => void;
}

// Main service categories
const mainCategories = ["Web Development", "SEO Services", "Digital Marketing"];

// Subcategories for each main category
const subcategories = {
  "Web Development": [
    "Website Design & Development",
    "E-commerce Development",
    "WordPress Development",
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "Website Maintenance",
    "Website Redesign",
    "Responsive Web Design",
    "Custom Web Applications",
  ],
  "SEO Services": [
    "On-Page SEO",
    "Off-Page SEO",
    "Technical SEO",
    "Local SEO",
    "E-commerce SEO",
    "SEO Audit",
    "Keyword Research",
    "Content Optimization",
    "Link Building",
    "SEO Consulting",
  ],
  "Digital Marketing": [
    "Social Media Marketing",
    "Content Marketing",
    "Email Marketing",
    "PPC Advertising",
    "Google Ads Management",
    "Facebook Ads Management",
    "Marketing Strategy",
    "Brand Marketing",
    "Influencer Marketing",
    "Video Marketing",
  ],
};

export default function OverviewStep({ data, updateData }: Props) {
  const [newTag, setNewTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    data.category.split(" > ")[0] || ""
  );

  // Clean up meta description if it contains JSON code on mount
  useEffect(() => {
    if (data.metaDescription) {
      // Check if it looks like the specific JSON bug (starts with { or " and contains type:doc or similar)
      const trimmed = data.metaDescription.trim();
      if ((trimmed.startsWith('{') || trimmed.startsWith('"')) && (trimmed.includes('type') || trimmed.includes('content'))) {
        const cleanText = extractTextFromProjectDescription(data.metaDescription);
        if (cleanText !== data.metaDescription) {
          updateData("metaDescription", cleanText);
        }
      }
    }
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Reset subcategory when main category changes
    updateData("category", category);
  };

  const handleSubcategoryChange = (subcategory: string) => {
    updateData("category", `${selectedCategory} > ${subcategory}`);
  };

  const addTag = () => {
    if (newTag.trim() && data.searchTags.length < 5) {
      updateData("searchTags", [...data.searchTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    updateData(
      "searchTags",
      data.searchTags.filter((t) => t !== tag)
    );
  };

  const getCurrentSubcategory = () => {
    const parts = data.category.split(" > ");
    return parts.length > 1 ? parts[1] : "";
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground">Service overview</h2>

      {/* Featured Service Checkbox */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={data.isFeatured}
          onChange={(e) => updateData("isFeatured", e.target.checked)}
          className="text-primary focus:ring-primary"
        />
        <label className="text-foreground">
          Feature this service on the main page
        </label>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Service Title
        </label>
        <div className="relative">
          <input
            type="text"
            value={data.title}
            onChange={(e) => {
              const newTitle = e.target.value;
              updateData("title", newTitle);
              // Auto-generate slug if it hasn't been manually edited and is empty or matches slugified title
              if (!data.slug || data.slug === newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")) {
                const autoSlug = newTitle
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
                  .replace(/(^-|-$)+/g, ""); // Remove leading/trailing hyphens
                updateData("slug", autoSlug);
              }
            }}
            placeholder="Tell the client what you will deliver and how it benefits them."
            className="w-full pl-3 pr-3 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          />
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {data.title.length}/75 characters (min. 7 words)
        </div>
      </div>

      {/* Slug Field */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          URL Slug
        </label>
        <div className="relative">
          <input
            type="text"
            value={data.slug}
            onChange={(e) => {
              const newSlug = e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
              updateData("slug", newSlug);
            }}
            placeholder="url-slug-example"
            className="w-full pl-3 pr-3 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          />
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          The URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.
        </div>
      </div>

      {/* NEW: Meta Title Field */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Meta Title
        </label>
        <div className="relative">
          <input
            type="text"
            value={data.metaTitle}
            onChange={(e) => updateData("metaTitle", e.target.value)}
            placeholder="Optimized title for search engines (50-60 characters recommended)"
            className="w-full pl-3 pr-3 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          />
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {data.metaTitle.length}/60 characters -
          {data.metaTitle.length >= 50 && data.metaTitle.length <= 60 ? (
            <span className="text-green-600"> Perfect length!</span>
          ) : data.metaTitle.length > 60 ? (
            <span className="text-red-600"> Too long</span>
          ) : data.metaTitle.length > 0 ? (
            <span className="text-yellow-600"> Could be longer</span>
          ) : null}
        </div>
      </div>

      {/* NEW: Meta Description Field */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Meta Description
        </label>
        <div className="relative">
          <textarea
            value={data.metaDescription}
            onChange={(e) => updateData("metaDescription", e.target.value)}
            placeholder="Brief description for search engine results (150-160 characters recommended)"
            rows={3}
            className="w-full pl-3 pr-3 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background resize-none"
          />
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {data.metaDescription.length}/160 characters -
          {data.metaDescription.length >= 150 && data.metaDescription.length <= 160 ? (
            <span className="text-green-600"> Perfect length!</span>
          ) : data.metaDescription.length > 160 ? (
            <span className="text-red-600"> Too long</span>
          ) : data.metaDescription.length > 0 ? (
            <span className="text-yellow-600"> Could be longer</span>
          ) : null}
        </div>
      </div>

      {/* Category Selection */}
      <div className="space-y-6">
        {/* Main Category */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Main Category
          </label>
          <p className="text-muted-foreground mb-4">
            Select the main category for your service.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mainCategories.map((category) => (
              <label
                key={category}
                className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <input
                  type="radio"
                  name="mainCategory"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-foreground font-medium">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Subcategory */}
        {selectedCategory && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Subcategory
            </label>
            <p className="text-muted-foreground mb-4">
              Select a specific subcategory for your service.
            </p>
            <select
              value={getCurrentSubcategory()}
              onChange={(e) => handleSubcategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            >
              <option value="">Select a subcategory</option>
              {subcategories[
                selectedCategory as keyof typeof subcategories
              ]?.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Selected Category Display */}
        {data.category && (
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold text-foreground mb-2">
              Selected Service
            </h4>
            <p className="text-foreground">
              {data.category.split(" > ").map((part, index) => (
                <span key={index}>
                  {index > 0 && " › "}
                  <span className={index === 0 ? "font-semibold" : ""}>
                    {part}
                  </span>
                </span>
              ))}
            </p>
          </div>
        )}
      </div>

      {/* Search Tags */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Search tags (optional)
        </label>
        <p className="text-muted-foreground mb-4">
          Add relevant tags to help clients find your service.
        </p>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addTag())
            }
            placeholder="Add a relevant tag (e.g., website design, SEO optimization)"
            className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.searchTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-primary hover:text-primary/70"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-1">(max. 5 tags)</p>
      </div>
    </div>
  );
}