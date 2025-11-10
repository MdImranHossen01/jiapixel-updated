'use client';

import { useState } from 'react';
import type { ServiceData } from './ServiceWizard';

interface Props {
  data: ServiceData;
  updateData: (field: keyof ServiceData, value: any) => void;
}

export default function PricingStep({ data, updateData }: Props) {
  const [newCustomFeature, setNewCustomFeature] = useState('');
  const [customFeatures, setCustomFeatures] = useState<{[key: string]: string[]}>({
    starter: [],
    standard: [],
    advanced: []
  });

  const updateTier = (tier: keyof typeof data.tiers, field: string, value: any) => {
    updateData('tiers', {
      ...data.tiers,
      [tier]: {
        ...data.tiers[tier],
        [field]: value
      }
    });
  };

  const updateFeature = (tier: keyof typeof data.tiers, feature: string, value: boolean) => {
    updateData('tiers', {
      ...data.tiers,
      [tier]: {
        ...data.tiers[tier],
        features: {
          ...data.tiers[tier].features,
          [feature]: value
        }
      }
    });
  };

  const updatePrice = (tier: keyof typeof data.tiers, value: string) => {
    const price = parseFloat(value) || 0;
    updateTier(tier, 'price', price);
  };

  const addCustomFeature = (tier: keyof typeof data.tiers) => {
    if (newCustomFeature.trim()) {
      setCustomFeatures(prev => ({
        ...prev,
        [tier]: [...prev[tier], newCustomFeature.trim()]
      }));
      setNewCustomFeature('');
    }
  };

  const removeCustomFeature = (tier: keyof typeof data.tiers, index: number) => {
    setCustomFeatures(prev => ({
      ...prev,
      [tier]: prev[tier].filter((_, i) => i !== index)
    }));
  };

  // Service-specific features organized by main category
  const serviceFeatures = {
    'Web Development': [
      'Website Design & Development',
      'Responsive Design',
      'E-commerce Functionality',
      'Content Management System',
      'Contact Forms & Integration',
      'Website Maintenance',
      'Website Redesign',
      'Custom Web Applications',
      'Performance Optimization',
      'Security Implementation',
      'Strategic Funnel Setup',
      'Quality Assurance Testing',
      'Free Load Speed Testing',
      'Web Support (30 days post-launch)'
    ],
    'SEO Services': [
      'Keyword Research & Analysis',
      'On-Page SEO Optimization',
      'Technical SEO Audit',
      'Content Optimization',
      'Link Building Strategy',
      'Local SEO Optimization',
      'SEO Performance Reporting',
      'Competitor Analysis',
      'Schema Markup Implementation',
      'SEO Consulting',
      'Complete SEO Optimization',
      'Conversion Audit & Roadmap',
      'Strategic Funnel Setup',
      'Lead Generation Optimization'
    ],
    'Digital Marketing': [
      'Social Media Marketing',
      'Content Marketing Strategy',
      'Email Marketing Campaigns',
      'PPC Advertising Management',
      'Google Ads Optimization',
      'Facebook Ads Management',
      'Marketing Analytics & Reporting',
      'Conversion Rate Optimization',
      'Brand Strategy Development',
      'Influencer Marketing',
      'Strategic Funnel Setup',
      'Lead Generation Optimization',
      'Conversion Audit & Roadmap',
      'Performance Analytics'
    ]
  };

  // Get the selected main category from the service data
  const getSelectedCategory = () => {
    const parts = data.category.split(' > ');
    return parts[0] || '';
  };

  const selectedCategory = getSelectedCategory();
  const relevantFeatures = serviceFeatures[selectedCategory as keyof typeof serviceFeatures] || [];

  // Common tier fields component to avoid repetition
  const renderTierFields = (tier: 'starter' | 'standard' | 'advanced', tierName: string) => (
    <div className="border border-border rounded-lg p-6">
      <h3 className="font-semibold text-foreground mb-4">{tierName}</h3>
      
      <div className="space-y-4">
        {/* Custom Title */}
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Package Title
          </label>
          <input
            type="text"
            value={data.tiers[tier]?.title || ''}
            onChange={(e) => updateTier(tier, 'title', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            placeholder={`Enter ${tierName.toLowerCase()} package title`}
          />
          <div className="text-xs text-muted-foreground mt-1">
            {(data.tiers[tier]?.title || '').length}/30 characters
          </div>
        </div>

        {/* Custom Description */}
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Package Description
          </label>
          <textarea
            value={data.tiers[tier]?.description || ''}
            onChange={(e) => updateTier(tier, 'description', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            placeholder={`Describe what clients get with ${tierName.toLowerCase()} package`}
          />
          <div className="text-xs text-muted-foreground mt-1">
            {(data.tiers[tier]?.description || '').length}/80 characters
          </div>
        </div>

        {/* Delivery Days and Revisions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Delivery Days
            </label>
            <input
              type="number"
              min="1"
              value={data.tiers[tier]?.deliveryDays || 3}
              onChange={(e) => updateTier(tier, 'deliveryDays', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Revisions
            </label>
            <input
              type="number"
              min="0"
              value={data.tiers[tier]?.revisions || 1}
              onChange={(e) => updateTier(tier, 'revisions', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            />
          </div>
        </div>

        {/* Price Input */}
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Package Price ($)
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-foreground font-medium">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={data.tiers[tier]?.price || 0}
              onChange={(e) => updatePrice(tier, e.target.value)}
              className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              placeholder="0.00"
            />
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Enter the price for this package
          </div>
        </div>

        {/* Price Display */}
        <div className="bg-muted p-3 rounded-lg">
          <label className="block text-sm text-muted-foreground mb-1">
            Price Display
          </label>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-foreground">
              ${(data.tiers[tier]?.price || 0).toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground">
              {tierName} Package
            </span>
          </div>
        </div>

        {/* Service Features */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Included Features for {selectedCategory}
          </label>
          
          {selectedCategory ? (
            <div className="space-y-2">
              {relevantFeatures.map((feature) => (
                <label key={feature} className="flex items-center space-x-2 p-2 hover:bg-accent/30 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={data.tiers[tier]?.features[feature] || false}
                    onChange={(e) => updateFeature(tier, feature, e.target.checked)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{feature}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Please select a category in the Overview step first
            </div>
          )}

          {/* Custom Features */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Additional Custom Features</h4>
            <div className="space-y-2 mb-3">
              {customFeatures[tier].length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No custom features added yet
                </p>
              ) : (
                customFeatures[tier].map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-accent/30 rounded">
                    <span className="text-sm text-foreground">{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeCustomFeature(tier, index)}
                      className="text-destructive hover:text-destructive/70 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCustomFeature}
                onChange={(e) => setNewCustomFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomFeature(tier))}
                placeholder="Add custom feature"
                className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-sm"
              />
              <button
                type="button"
                onClick={() => addCustomFeature(tier)}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground">Price & Packages</h2>

      {/* Category Info */}
      {selectedCategory && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-2">Selected Service: {selectedCategory}</h3>
          <p className="text-sm text-muted-foreground">
            Configure pricing packages for your {selectedCategory.toLowerCase()} services
          </p>
        </div>
      )}

      {/* Pricing Tiers */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-4">
          Create Service Packages
        </label>
        <p className="text-muted-foreground mb-4">
          Customize your service packages with 1 or 3 pricing tiers
        </p>
        <div className="flex gap-4 mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="pricingTiers"
              value="1"
              checked={data.pricingTiers === '1'}
              onChange={(e) => updateData('pricingTiers', e.target.value)}
              className="text-primary focus:ring-primary"
            />
            <span className="text-foreground">Single Package</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="pricingTiers"
              value="3"
              checked={data.pricingTiers === '3'}
              onChange={(e) => updateData('pricingTiers', e.target.value)}
              className="text-primary focus:ring-primary"
            />
            <span className="text-foreground">Three Packages</span>
          </label>
        </div>

        {!selectedCategory ? (
          <div className="text-center py-8 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">
              Please go back to the Overview step and select a service category first
            </p>
          </div>
        ) : data.pricingTiers === '3' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderTierFields('starter', 'Starter')}
            {renderTierFields('standard', 'Standard')}
            {renderTierFields('advanced', 'Advanced')}
          </div>
        ) : (
          <div className="max-w-2xl">
            {renderTierFields('starter', 'Complete Package')}
          </div>
        )}
      </div>
    </div>
  );
}