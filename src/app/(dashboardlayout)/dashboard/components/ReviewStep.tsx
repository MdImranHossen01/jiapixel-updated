/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { ServiceData } from './ServiceWizard';

interface Props {
  data: ServiceData;
  updateData: (field: keyof ServiceData, value: any) => void;
}

export default function ReviewStep({ data, updateData }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Final validation and submission logic would go here
    console.log('Submitting service:', data);
  };

  // Safe accessor functions
  const getSelectedCategory = () => {
    return data?.category || 'Not set';
  };

  const getTierData = (tier: 'starter' | 'standard' | 'advanced') => {
    return data?.tiers?.[tier] || {
      title: '',
      description: '',
      deliveryDays: 0,
      revisions: 0,
      price: 0,
      features: {}
    };
  };

  const getFeaturesCount = (tier: 'starter' | 'standard' | 'advanced') => {
    const features = data?.tiers?.[tier]?.features;
    return features ? Object.keys(features).filter(key => features[key]).length : 0;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground">Review and publish</h2>

      {/* Service Overview Summary */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Service Overview</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Title:</span>
            <span className="text-foreground font-medium">{data?.title || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Category:</span>
            <span className="text-foreground font-medium">{getSelectedCategory()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Author:</span>
            <span className="text-foreground font-medium">{data?.author || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Search Tags:</span>
            <span className="text-foreground font-medium">
              {data?.searchTags?.length || 0} tags
            </span>
          </div>
          {/* ADD FEATURED STATUS DISPLAY HERE */}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Featured Service:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              data?.isFeatured 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {data?.isFeatured ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Pricing & Packages</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pricing Tiers:</span>
            <span className="text-foreground font-medium">{data?.pricingTiers || '3'} tier(s)</span>
          </div>
          
          {data?.pricingTiers === '3' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {(['starter', 'standard', 'advanced'] as const).map((tier) => {
                const tierData = getTierData(tier);
                return (
                  <div key={tier} className="border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground capitalize mb-2">{tier}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Title:</span>
                        <span className="text-foreground font-medium">
                          {tierData.title || 'Not set'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="text-foreground font-medium">${tierData.price || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery:</span>
                        <span className="text-foreground font-medium">
                          {tierData.deliveryDays || 0} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Revisions:</span>
                        <span className="text-foreground font-medium">
                          {tierData.revisions || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Features:</span>
                        <span className="text-foreground font-medium">
                          {getFeaturesCount(tier)} selected
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-border rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-foreground mb-2">Basic Package</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Title:</span>
                  <span className="text-foreground font-medium">
                    {getTierData('starter').title || 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="text-foreground font-medium">
                    ${getTierData('starter').price || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery:</span>
                  <span className="text-foreground font-medium">
                    {getTierData('starter').deliveryDays || 0} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revisions:</span>
                  <span className="text-foreground font-medium">
                    {getTierData('starter').revisions || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Features:</span>
                  <span className="text-foreground font-medium">
                    {getFeaturesCount('starter')} selected
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Summary */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Gallery</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Images:</span>
            <span className="text-foreground font-medium">
              {data?.images?.length || 0} uploaded
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Documents:</span>
            <span className="text-foreground font-medium">
              {data?.documents?.length || 0} uploaded
            </span>
          </div>
        </div>
      </div>

      {/* Requirements Summary */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Client Requirements</h3>
        <div className="space-y-2">
          {data?.requirements && data.requirements.length > 0 ? (
            data.requirements.map((requirement, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-muted-foreground">{index + 1}.</span>
                <span className="text-foreground">{requirement}</span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No requirements added</p>
          )}
        </div>
      </div>

      {/* Description Summary */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Service Description</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-2">Summary</h4>
            <p className="text-muted-foreground text-sm whitespace-pre-line">
              {data?.projectSummary || 'No summary provided'}
            </p>
          </div>
          
          {/* Author Quote Section */}
          {data?.authorQuote && (
            <div>
              <h4 className="font-medium text-foreground mb-2">Author Quote</h4>
              <div className="bg-primary/5 rounded-lg border border-primary/20 p-4">
                <blockquote className="text-foreground italic">
                  &quot;{data.authorQuote}&quot;
                </blockquote>
                <div className="mt-2 text-sm text-muted-foreground">
                  — {data.author || "Service Author"}
                </div>
              </div>
            </div>
          )}
          
          <div>
            <h4 className="font-medium text-foreground mb-2">
              Service Steps ({data?.projectSteps?.length || 0})
            </h4>
            {data?.projectSteps && data.projectSteps.length > 0 ? (
              <div className="space-y-3">
                {data.projectSteps.map((step, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4 py-1">
                    <h5 className="font-medium text-foreground">{step.title}</h5>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No service steps added</p>
            )}
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">
              FAQs ({data?.faqs?.length || 0})
            </h4>
            {data?.faqs && data.faqs.length > 0 ? (
              <div className="space-y-3 text-sm">
                {data.faqs.map((faq, index) => (
                  <div key={index}>
                    <p className="font-medium text-foreground">Q: {faq.question}</p>
                    <p className="text-muted-foreground ml-4">A: {faq.answer}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No FAQs added</p>
            )}
          </div>
        </div>
      </div>

      {/* Service Limits and Terms */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Service Settings</h3>
        
        {/* Maximum Active Services */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Maximum number of active services
          </label>
          <p className="text-muted-foreground mb-4">
            Set a limit on how many clients can purchase this service at the same time.
          </p>
          <select
            value={data?.maxProjects || 20}
            onChange={(e) => updateData('maxProjects', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          >
            {[5, 10, 15, 20, 25, 30, 40, 50].map(num => (
              <option key={num} value={num}>{num} services</option>
            ))}
          </select>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-3">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={data?.agreeToTerms || false}
              onChange={(e) => updateData('agreeToTerms', e.target.checked)}
              className="mt-1 text-primary focus:ring-primary"
            />
            <div className="text-foreground">
              <span>I agree to the </span>
              <a href="#" className="text-primary hover:underline">Terms of Service</a>
              <span>, </span>
              <a href="#" className="text-primary hover:underline">Service Agreement</a>
              <span>, and </span>
              <a href="#" className="text-primary hover:underline">Billing Terms</a>
              <span>. I understand that if I violate these terms, my service may be removed.</span>
            </div>
          </label>
        </div>
      </div>

      {/* Final Actions */}
      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-semibold text-foreground mb-2">Ready to publish?</h4>
        <p className="text-muted-foreground text-sm">
          Review all the information above carefully. Once published, your service will be visible to clients and they can start placing orders.
        </p>
        {/* ADD FEATURED SERVICE NOTE */}
        <p className="text-green-600 text-sm mt-2 font-medium">
          ✓ This service will be featured on the main services page.
        </p>
      </div>
    </div>
  );
}