import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    title: string;
    slug: string;
    banner: string;
    seoTitle: string;
    metaDescription: string;
    description: string;
    excerpt: string;
    faqs: {
        question: string;
        answer: string;
    }[];
    tags: string[];
    selectedServices: string[];
    createdAt: Date;
    updatedAt: Date;
    isIndexedInGoogle: boolean;
}

const CategorySchema: Schema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    banner: {
        type: String,
        required: false, // Optional banner
    },
    seoTitle: {
        type: String,
        trim: true,
    },
    metaDescription: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    excerpt: {
        type: String,
        trim: true,
    },
    faqs: [{
        question: { type: String, required: true },
        answer: { type: String, required: true },
    }],
    tags: [{
        type: String,
        trim: true,
    }],
    selectedServices: [{
        type: Schema.Types.ObjectId,
        ref: 'Service'
    }],
    isIndexedInGoogle: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

// Index for faster lookups
// CategorySchema.index({ slug: 1 }); // unique: true already creates an index

// Prevent OverwriteModelError in development and serverless
export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
