/* eslint-disable @typescript-eslint/no-explicit-any */
// src/models/Project.ts
import mongoose, { Document, Schema } from 'mongoose';
import { generateSlug } from '../lib/slug';

// New interface for service steps with title and description
export interface IServiceStep {
  title: string;
  description: string;
}

export interface ITierFeature {
  [key: string]: boolean; // Make features dynamic
}

export interface ITierData {
  title: string;
  description: string;
  deliveryDays: number;
  revisions: number;
  price: number;
  features: ITierFeature;
}

export interface IFAQ {
  question: string;
  answer: string;
}

export interface IService extends Document {
  // Overview Step
  title: string;
  slug: string;
  category: string;
  searchTags: string[];
  author: string; // Added author field
  authorQuote: string; // Added author quote/speech field
  
  // Pricing Step
  pricingTiers: '1' | '3';
  tiers: {
    starter: ITierData;
    standard?: ITierData; // Make optional
    advanced?: ITierData; // Make optional
  };
  
  // Gallery Step
  images: string[];
  documents: string[];
  
  // Requirements Step
  requirements: string[];
  
  // Description Step
  projectSummary: string;
  projectSteps: IServiceStep[]; // Changed from string[] to IServiceStep[]
  faqs: IFAQ[];
  
  // Review Step
  maxProjects: number;
  agreeToTerms: boolean;
  
  // Metadata
  status: 'draft' | 'published' | 'archived';
  createdBy: string; // Changed to string instead of ObjectId
  createdAt: Date;
  updatedAt: Date;
}

const TierFeatureSchema = new Schema<ITierFeature>({
  // Dynamic features - no predefined structure
}, { _id: false, strict: false });

const TierDataSchema = new Schema<ITierData>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  deliveryDays: { type: Number, required: true, default: 3 },
  revisions: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true, default: 0 },
  features: { type: TierFeatureSchema, required: true, default: {} },
});

const FAQSchema = new Schema<IFAQ>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

// New schema for service steps
const ServiceStepSchema = new Schema<IServiceStep>({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const ServiceSchema = new Schema<IService>(
  {
    // Overview Step
    title: { type: String, required: true },
    slug: { 
      type: String, 
      required: true, 
      unique: true,
      index: true, // Index defined here
      lowercase: true,
      trim: true
    },
    category: { type: String, required: true },
    searchTags: [{ type: String }],
    author: { type: String, required: true, default: 'Md. Imran Hossen' }, // Added author field
    authorQuote: { type: String, required: false }, // Added author quote/speech field
    
    // Pricing Step
    pricingTiers: { type: String, enum: ['1', '3'], required: true },
    tiers: {
      starter: { type: TierDataSchema, required: true },
      standard: { type: TierDataSchema }, // Not required
      advanced: { type: TierDataSchema }, // Not required
    },
    
    // Gallery Step
    images: [{ type: String }],
    documents: [{ type: String }],
    
    // Requirements Step
    requirements: [{ type: String }],
    
    // Description Step
    projectSummary: { type: String, required: true },
    projectSteps: [ServiceStepSchema], // Changed from [String] to [ServiceStepSchema]
    faqs: [FAQSchema],
    
    // Review Step
    maxProjects: { type: Number, default: 20 },
    agreeToTerms: { type: Boolean, required: true },
    
    // Metadata
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
    createdBy: { 
      type: String, 
      required: true,
      default: 'jiapixel-team'
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to generate slug from title
ServiceSchema.pre('save', async function(next) {
  // Only generate slug if it's not already set or if title has changed
  if (!this.slug || this.isModified('title')) {
    const baseSlug = generateSlug(this.title);
    let slug = baseSlug;
    let counter = 1;
    
    // Check if slug already exists (exclude current document if updating)
    const existingDoc = await (this.constructor as any).findOne({ 
      slug: slug, 
      _id: { $ne: this._id } 
    });
    
    // If slug exists, append counter
    while (existingDoc) {
      slug = `${baseSlug}-${counter}`;
      const checkAgain = await (this.constructor as any).findOne({ 
        slug: slug, 
        _id: { $ne: this._id } 
      });
      if (!checkAgain) break;
      counter++;
    }
    
    this.slug = slug;
  }
  next();
});


ServiceSchema.index({ createdBy: 1, status: 1 });
ServiceSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);