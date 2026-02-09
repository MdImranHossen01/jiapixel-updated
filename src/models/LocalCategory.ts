import mongoose, { Schema, Document } from 'mongoose';

export interface ILocalCategory extends Document {
    title: string;
    slug: string;
    banner: string;
    seoTitle: string;
    metaDescription: string;
    description: string;

    faqs: {
        question: string;
        answer: string;
    }[];
    tags: string[];
    selectedProjects: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    isIndexedInGoogle?: boolean;
}

const LocalCategorySchema: Schema = new Schema({
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

    faqs: [{
        question: { type: String, required: true },
        answer: { type: String, required: true },
    }],
    tags: [{
        type: String,
        trim: true,
    }],
    selectedProjects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }],
    isIndexedInGoogle: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

// Prevent OverwriteModelError in development and serverless
export default mongoose.models.LocalCategory || mongoose.model<ILocalCategory>('LocalCategory', LocalCategorySchema);
