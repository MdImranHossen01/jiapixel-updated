import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  detailedDescription: string;
  shortDescription: string;
  featuredImage: string;
  images: string[];
  category: string;
  tags: string[];
  price: {
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  features: string[];
  specifications: {
    name: string;
    value: string;
  }[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  demoUrl?: string;
  documentationUrl?: string;
  supportIncluded: boolean;
  updatesIncluded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
    maxlength: [300, 'Short description cannot be more than 300 characters']
  },
  detailedDescription: {
    type: String,
    required: [true, 'Detailed description is required']
  },
  featuredImage: {
    type: String,
    required: [true, 'Featured image is required']
  },
  images: [{
    type: String
  }],
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  price: {
    monthly: {
      type: Number,
      required: [true, 'Monthly price is required'],
      min: [0, 'Price cannot be negative']
    },
    quarterly: {
      type: Number,
      required: [true, 'Quarterly price is required'],
      min: [0, 'Price cannot be negative']
    },
    yearly: {
      type: Number,
      required: [true, 'Yearly price is required'],
      min: [0, 'Price cannot be negative']
    }
  },
  features: [{
    type: String,
    trim: true
  }],
  specifications: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    value: {
      type: String,
      required: true,
      trim: true
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  seoTitle: {
    type: String,
    trim: true,
    maxlength: [200, 'SEO title cannot be more than 200 characters']
  },
  seoDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'SEO description cannot be more than 500 characters']
  },
  demoUrl: {
    type: String,
    trim: true
  },
  documentationUrl: {
    type: String,
    trim: true
  },
  supportIncluded: {
    type: Boolean,
    default: true
  },
  updatesIncluded: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
ProductSchema.index({ slug: 1 });
ProductSchema.index({ status: 1, featured: -1, createdAt: -1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ tags: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);