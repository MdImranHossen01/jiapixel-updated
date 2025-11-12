/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import OverviewStep from "./OverviewStep";
import PricingStep from "./PricingStep";
import GalleryStep from "./GalleryStep";
import RequirementsStep from "./RequirementsStep";
import DescriptionStep from "./DescriptionStep";
import ReviewStep from "./ReviewStep";

// Updated ServiceData interface with new fields
export interface ServiceData {
  // Overview Step
  title: string;
  category: string;
  searchTags: string[];
  author: string; // Added author field
  authorQuote: string; // Added author quote/speech field

  // Pricing Step
  pricingTiers: '1' | '3';
  tiers: {
    starter: TierData;
    standard?: TierData; // Make optional
    advanced?: TierData; // Make optional
  };

  // Gallery Step
  images: File[];
  documents: File[];

  // Requirements Step
  requirements: string[];

  // Description Step
  projectSummary: string;
  projectSteps: IServiceStep[]; // Changed from string[] to IServiceStep[]
  faqs: FAQ[];

  // Review Step
  maxProjects: number;
  agreeToTerms: boolean;
}

// New interface for service steps
export interface IServiceStep {
  title: string;
  description: string;
}

export interface TierData {
  title: string;
  description: string;
  deliveryDays: number;
  revisions: number;
  price: number;
  features: {
    [key: string]: boolean; // Dynamic features
  };
}

export interface FAQ {
  question: string;
  answer: string;
}

const steps = [
  { id: "overview", title: "Overview", completed: false, active: true },
  { id: "pricing", title: "Pricing", completed: false, active: false },
  { id: "gallery", title: "Gallery", completed: false, active: false },
  {
    id: "requirements",
    title: "Requirements",
    completed: false,
    active: false,
  },
  { id: "description", title: "Description", completed: false, active: false },
  { id: "review", title: "Review", completed: false, active: false },
];

export default function ServiceWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceData, setServiceData] = useState<ServiceData>({
    title: "",
    category: "",
    searchTags: [],
    author: "JiaPixel Team", // Added author field with default value
    authorQuote: "", // Added author quote/speech field
    pricingTiers: "3",
    tiers: {
      starter: {
        title: "",
        description: "",
        deliveryDays: 3,
        revisions: 1,
        price: 0,
        features: {},
      },
      standard: {
        title: "",
        description: "",
        deliveryDays: 5,
        revisions: 2,
        price: 0,
        features: {},
      },
      advanced: {
        title: "",
        description: "",
        deliveryDays: 7,
        revisions: 3,
        price: 0,
        features: {},
      },
    },
    images: [],
    documents: [],
    requirements: [],
    projectSummary: "",
    projectSteps: [], // Now an array of IServiceStep objects
    faqs: [],
    maxProjects: 20,
    agreeToTerms: false,
  });

  const updateServiceData = (field: keyof ServiceData, value: any) => {
    setServiceData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Append files
      serviceData.images.forEach((file) => {
        formData.append("images", file);
      });

      serviceData.documents.forEach((file) => {
        formData.append("documents", file);
      });

      // Append service data as JSON - REMOVED status field
      const { images, documents, ...serviceDataWithoutFiles } = serviceData;
      // No need to add status field - it will be set to "published" by default in the model
      formData.append("projectData", JSON.stringify(serviceDataWithoutFiles));

      const response = await fetch("/api/services", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        console.log("Service created successfully:", result.service);
        alert("Service created successfully!");
        // You can redirect here: router.push('/dashboard/services')
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      console.error("Service submission error:", error);
      alert(`Failed to create service: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <OverviewStep data={serviceData} updateData={updateServiceData} />
        );
      case 1:
        return (
          <PricingStep data={serviceData} updateData={updateServiceData} />
        );
      case 2:
        return (
          <GalleryStep data={serviceData} updateData={updateServiceData} />
        );
      case 3:
        return (
          <RequirementsStep data={serviceData} updateData={updateServiceData} />
        );
      case 4:
        return (
          <DescriptionStep data={serviceData} updateData={updateServiceData} />
        );
      case 5:
        return <ReviewStep data={serviceData} updateData={updateServiceData} />;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
      {/* Progress Steps */}
      <div className="bg-card rounded-lg border p-6 mb-6">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex flex-col items-center ${
                  index <= currentStep
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    index <= currentStep
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-sm mt-2 font-medium">{step.title}</span>
                <span
                  className={`text-xs mt-1 ${
                    index === currentStep
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {index === currentStep
                    ? "Active"
                    : index < currentStep
                    ? "Completed"
                    : "Upcoming"}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-4 ${
                    index < currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-card rounded-lg border p-6 mb-6">{renderStep()}</div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-6 py-2 border border-border rounded-md text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {currentStep < steps.length - 1 ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting || !serviceData.agreeToTerms}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create Service"}
          </button>
        )}
      </div>
    </form>
  );
}