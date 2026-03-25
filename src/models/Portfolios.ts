import mongoose, { Schema, Document } from 'mongoose';

export interface IPortfolio extends Document {
  title: string;
  slug: string;
  content: string;
  featuredImage: string;
  featured: boolean;
  isIndexedInGoogle: boolean;
  metaTitle?: string;
  metaDescription?: string;
  projectUrl?: string;
  githubUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioSchema: Schema = new Schema({
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
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  featuredImage: {
    type: String,
    required: [true, 'Featured image is required']
  },
  featured: {
    type: Boolean,
    default: false
  },
  isIndexedInGoogle: {
    type: Boolean,
    default: false
  },
  metaTitle: {
    type: String,
    trim: true,
    maxlength: [200, 'Meta title cannot be more than 200 characters']
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'Meta description cannot be more than 500 characters']
  },
  projectUrl: {
    type: String,
    trim: true
  },
  githubUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create index for better query performance
PortfolioSchema.index({ slug: 1 });
PortfolioSchema.index({ featured: -1, createdAt: -1 });

// Clear model if it exists to avoid shared schema issues in dev
if (process.env.NODE_ENV !== "production" && mongoose.models.Portfolio) {
    delete mongoose.models.Portfolio;
}

const Portfolio =
    mongoose.models.Portfolio ||
    mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);

export default Portfolio;