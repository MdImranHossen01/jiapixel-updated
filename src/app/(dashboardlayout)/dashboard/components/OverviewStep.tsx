/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import type { ServiceData } from "./ServiceWizard";

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

      {/* // In OverviewStep or a new SettingsStep */}
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
            onChange={(e) => updateData("title", e.target.value)}
            placeholder="Tell the client what you will deliver and how it benefits them."
            className="w-full pl-3 pr-3 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          />
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {data.title.length}/75 characters (min. 7 words)
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
