/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import type { ServiceData } from './ServiceWizard';

interface Props {
  data: ServiceData;
  updateData: (field: keyof ServiceData, value: any) => void;
}

export default function PricingStep({ data, updateData }: Props) {
  // Separate state for each tier's input
  const [tierInputs, setTierInputs] = useState({
    starter: '',
    standard: '',
    advanced: ''
  });

  const updateTier = (tier: keyof typeof data.tiers, field: string, value: any) => {
    updateData('tiers', {
      ...data.tiers,
      [tier]: {
        ...(data.tiers[tier] ?? {}),
        [field]: value
      }
    });
  };

  const updateFeature = (
    tier: keyof typeof data.tiers,
    feature: string,
    value: boolean
  ) => {
    updateData('tiers', {
      ...data.tiers,
      [tier]: {
        ...(data.tiers[tier] ?? {}),
        features: {
          ...(data.tiers[tier]?.features ?? {}),
          [feature]: value
        }
      }
    });
  };

  const updatePrice = (tier: keyof typeof data.tiers, value: string) => {
    const price = value === '' ? 0 : parseFloat(value) || 0;
    updateTier(tier, 'price', price);
  };



  const updateBillingPeriod = (tier: keyof typeof data.tiers, value: "once" | "monthly" | "yearly") => {
    updateTier(tier, 'billingPeriod', value);
  };

  const addCustomFeature = (tier: keyof typeof data.tiers) => {
    const featureText = tierInputs[tier].trim();
    if (featureText) {
      // Add the custom feature directly to the service data
      updateFeature(tier, featureText, true);
      // Clear only this tier's input
      setTierInputs(prev => ({
        ...prev,
        [tier]: ''
      }));
    }
  };

  const removeCustomFeature = (tier: keyof typeof data.tiers, feature: string) => {
    // Create a new features object without the removed feature
    const currentFeatures = data.tiers[tier]?.features ?? {};
    const updatedFeatures = { ...currentFeatures };
    delete updatedFeatures[feature];

    updateData('tiers', {
      ...data.tiers,
      [tier]: {
        ...(data.tiers[tier] ?? {}),
        features: updatedFeatures
      }
    });
  };

  // Update tier input handler
  const handleTierInputChange = (tier: keyof typeof tierInputs, value: string) => {
    setTierInputs(prev => ({
      ...prev,
      [tier]: value
    }));
  };

  // Get all features for a tier
  const getAllFeaturesForTier = (tier: keyof typeof data.tiers) => {
    const features = data.tiers[tier]?.features ?? {};
    return Object.keys(features);
  };

  const getSelectedCategory = () => {
    const parts = data.category.split(' > ');
    return parts[0] || '';
  };

  const selectedCategory = getSelectedCategory();

  // Helper function to display value or empty string
  const displayValue = (value: number | undefined): string => {
    return value === 0 ? '' : value?.toString() || '';
  };

  // Common tier fields
  const renderTierFields = (tier: 'starter' | 'standard' | 'advanced', tierName: string) => {
    const allFeatures = getAllFeaturesForTier(tier);

    return (
      <div className="border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">{tierName}</h3>

        <div className="space-y-4">
          {/* Custom Title */}
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Package Title</label>
            <input
              type="text"
              value={data.tiers[tier]?.title ?? ''}
              onChange={(e) => updateTier(tier, 'title', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              placeholder={`Enter ${tierName.toLowerCase()} package title`}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {(data.tiers[tier]?.title ?? '').length}/30 characters
            </div>
          </div>





          {/* Price Input */}
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Package Price ($)</label>
            <div className="flex items-center space-x-2">
              <span className="text-foreground font-medium">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={displayValue(data.tiers[tier]?.price)}
                onChange={(e) => updatePrice(tier, e.target.value)}
                className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                placeholder="0.00"
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Enter the price for this package
            </div>
          </div>



          {/* Billing Period */}
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Billing Period</label>
            <div className="flex gap-4 p-2 border border-border rounded-md bg-background">
              {["once", "monthly", "yearly"].map((period) => (
                <label key={period} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`billingPeriod-${tier}`}
                    value={period}
                    checked={(data.tiers[tier]?.billingPeriod || "once") === period}
                    onChange={(e) => updateBillingPeriod(tier, e.target.value as any)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-foreground capitalize">{period}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Display */}
          <div className="bg-muted p-3 rounded-lg">
            <label className="block text-sm text-muted-foreground mb-1">Price Display</label>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-foreground">
                ${(data.tiers[tier]?.price ?? 0).toFixed(2)}
                {data.tiers[tier]?.billingPeriod === 'monthly' && <span className="text-lg font-normal">/monthly</span>}
                {data.tiers[tier]?.billingPeriod === 'yearly' && <span className="text-lg font-normal">/yearly</span>}
              </span>
              <span className="text-sm text-muted-foreground">{tierName} Package</span>
            </div>
          </div>

          {/* Features Section */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Package Features
            </label>

            {/* Current Features List */}
            <div className="space-y-2 mb-4">
              {allFeatures.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
                  No features added yet. Add features using the form below.
                </p>
              ) : (
                allFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center justify-between p-3 bg-accent/30 rounded-lg border"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={data.tiers[tier]?.features?.[feature] ?? false}
                        onChange={(e) => updateFeature(tier, feature, e.target.checked)}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-foreground font-medium">{feature}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCustomFeature(tier, feature)}
                      className="text-destructive hover:text-destructive/70 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add New Feature Form */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                Add New Feature
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tierInputs[tier]}
                  onChange={(e) => handleTierInputChange(tier, e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomFeature(tier))}
                  placeholder="Enter feature name (e.g., Responsive Design, SEO Optimization)"
                  className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-sm"
                />
                <button
                  type="button"
                  onClick={() => addCustomFeature(tier)}
                  disabled={!tierInputs[tier].trim()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Add Feature
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Add features that are included in this package. Features will be automatically checked when added.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground">Price & Packages</h2>

      {selectedCategory && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-2">
            Selected Service: {selectedCategory}
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure pricing packages for your {selectedCategory.toLowerCase()} services
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-4">
          Create Service Packages
        </label>
        <p className="text-muted-foreground mb-4">
          Customize your service packages with 1 or 3 pricing tiers. Add features specific to each package.
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
          <div className="max-w-2xl">{renderTierFields('starter', 'Complete Package')}</div>
        )}
      </div>
    </div>
  );
}