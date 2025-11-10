import mongoose, { Document, Schema } from 'mongoose';

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

export interface IProject extends Document {
  // Overview Step
  title: string;
  category: string;
  searchTags: string[];
  
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
  projectSteps: string[];
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

const ProjectSchema = new Schema<IProject>(
  {
    // Overview Step
    title: { type: String, required: true },
    category: { type: String, required: true },
    searchTags: [{ type: String }],
    
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
    projectSteps: [{ type: String }],
    faqs: [FAQSchema],
    
    // Review Step
    maxProjects: { type: Number, default: 20 },
    agreeToTerms: { type: Boolean, required: true },
    
  
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

// Index for better query performance
ProjectSchema.index({ createdBy: 1, status: 1 });
ProjectSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);