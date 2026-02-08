/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { toast } from "sonner";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OverviewStep from "./OverviewStep";
import PricingStep from "./PricingStep";
import GalleryStep from "./GalleryStep";
import DescriptionStep from "./DescriptionStep";

// Updated ServiceData interface with new meta fields
export interface ServiceData {
  // Overview Step
  title: string;
  slug: string;
  category: string;
  searchTags: string[];
  author: string;

  // NEW: Meta fields
  metaTitle: string;
  metaDescription: string;

  // Pricing Step
  pricingTiers: '1' | '3';
  tiers: {
    starter: TierData;
    standard?: TierData;
    advanced?: TierData;
  };

  // Gallery Step
  images: (File | string)[];
  documents: (File | string)[];

  // Requirements Step
  requirements: string[];

  // Description Step
  projectSummary: string;
  projectSteps?: { title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
  authorQuote?: string;

  // Review Step
  maxProjects?: number;
  agreeToTerms?: boolean;

  // Featured Service
  isFeatured: boolean;
}

export interface TierData {
  title: string;
  description: string;
  deliveryDays: number;
  revisions: number;
  price: number;
  billingPeriod: "once" | "monthly" | "yearly";
  features: {
    [key: string]: boolean; // Dynamic features
  };
}

const steps = [
  { id: "overview", title: "Overview", completed: false, active: true },
  { id: "pricing", title: "Pricing", completed: false, active: false },
  { id: "gallery", title: "Gallery", completed: false, active: false },
  { id: "description", title: "Description", completed: false, active: false },
];

interface ServiceWizardProps {
  initialData?: ServiceData;
  isEdit?: boolean;
  serviceSlug?: string;
}

export default function ServiceWizard({ initialData, isEdit, serviceSlug }: ServiceWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceData, setServiceData] = useState<ServiceData>(initialData || {
    title: "",
    slug: "",
    category: "",
    searchTags: [],
    author: "Md Imran Hossen",

    // NEW: Meta fields with initial values
    metaTitle: "",
    metaDescription: "",

    pricingTiers: "3",
    tiers: {
      starter: {
        title: "",
        description: "",
        deliveryDays: 0,
        revisions: 0,
        price: 0,
        billingPeriod: "once",
        features: {},
      },
      standard: {
        title: "",
        description: "",
        deliveryDays: 0,
        revisions: 0,
        price: 0,
        billingPeriod: "once",
        features: {},
      },
      advanced: {
        title: "",
        description: "",
        deliveryDays: 0,
        revisions: 0,
        price: 0,
        billingPeriod: "once",
        features: {},
      },
    },
    images: [],
    documents: [],
    requirements: [],
    projectSummary: "",
    projectSteps: [],
    faqs: [],
    authorQuote: "",
    maxProjects: 20,
    agreeToTerms: true,
    isFeatured: true,
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

      // Separate Files (new uploads) and strings (existing URLs)
      const imageFiles = serviceData.images.filter((img): img is File => img instanceof File);
      const existingImages = serviceData.images.filter((img): img is string => typeof img === 'string');

      const documentFiles = serviceData.documents.filter((doc): doc is File => doc instanceof File);
      const existingDocuments = serviceData.documents.filter((doc): doc is string => typeof doc === 'string');

      // Append new files
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      documentFiles.forEach((file) => {
        formData.append("documents", file);
      });

      // Prepare data JSON
      // Include existing URL arrays in the JSON so the server knows what to keep
      const { images, documents, ...rest } = serviceData;
      const projectDataToSubmit = {
        ...rest,
        images: existingImages, // Send existing URLs
        documents: existingDocuments, // Send existing URLs
      };

      formData.append("projectData", JSON.stringify(projectDataToSubmit));

      const url = isEdit && serviceSlug
        ? `/api/services/${serviceSlug}`
        : "/api/services";

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      const result = await response.json();

      if (response.ok) { // Check response.ok instead of relying on result.success for 404/500
        console.log(`Service ${isEdit ? 'updated' : 'created'} successfully:`, result.service);
        toast.success(`Service ${isEdit ? 'updated' : 'created'} successfully!`);
        router.push('/dashboard/admin/manage-services');
      } else {
        throw new Error(result.message || "Operation failed");
      }
    } catch (error: any) {
      console.error("Service submission error:", error);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} service: ${error.message}`);
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
          <DescriptionStep data={serviceData} updateData={updateServiceData} />
        );
      case 3:
        return (
          <DescriptionStep data={serviceData} updateData={updateServiceData} />
        );
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
                className={`flex flex-col items-center ${index <= currentStep
                  ? "text-primary"
                  : "text-muted-foreground"
                  }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${index <= currentStep
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-muted-foreground"
                    }`}
                >
                  {index + 1}
                </div>
                <span className="text-sm mt-2 font-medium">{step.title}</span>
                <span
                  className={`text-xs mt-1 ${index === currentStep
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
                  className={`w-16 h-0.5 mx-4 ${index < currentStep ? "bg-primary" : "bg-muted"
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
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Service" : "Create Service")}
          </button>
        )}
      </div>
    </form>
  );
}