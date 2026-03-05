/* eslint-disable @typescript-eslint/no-explicit-any */
// src/models/Project.ts
import mongoose, { Document, Schema } from "mongoose";
import { generateSlug } from "../lib/slug";
import { extractTextFromProjectDescription } from "../lib/utils";

export interface IProject extends Document {
    title: string;
    slug: string;

    // Meta fields
    metaTitle: string;
    metaDescription: string;

    // Media
    images: string[];

    // Content
    description: string;

    // Related items
    relatedProjects?: mongoose.Types.ObjectId[];

    // Metadata
    isIndexedInGoogle: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
    {
        title: {
            type: String,
            required: true,
            maxlength: 60
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        // Meta fields
        metaTitle: {
            type: String,
            required: false,
            default: ""
        },
        metaDescription: {
            type: String,
            required: false,
            maxlength: 160,
            default: ""
        },

        // Media
        images: {
            type: [String],
            validate: [
                (val: string[]) => val.length <= 5,
                'Validation Error: Exceeds the limit of 5 images'
            ],
            default: []
        },

        // Content
        description: {
            type: String,
            required: true,
        },

        // Related items
        relatedProjects: [{
            type: Schema.Types.ObjectId,
            ref: "Project"
        }],

        // Metadata
        isIndexedInGoogle: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Add index for searching and filtering
ProjectSchema.index({ title: "text", description: "text" });

// Pre-save middleware to generate slug from title
ProjectSchema.pre("save", async function (next) {
    // Only generate slug if it's not set. If it is set (manually or previously), respect it.
    if (!this.slug) {
        const baseSlug = generateSlug(this.title);
        let slug = baseSlug;
        let counter = 1;

        // Check if slug already exists (exclude current document if updating)
        const existingDoc = await (this.constructor as any).findOne({
            slug: slug,
            _id: { $ne: this._id },
        });

        // If slug exists, append counter
        while (existingDoc) {
            slug = `${baseSlug}-${counter}`;
            const checkAgain = await (this.constructor as any).findOne({
                slug: slug,
                _id: { $ne: this._id },
            });
            if (!checkAgain) break;
            counter++;
        }

        this.slug = slug;
    }
    next();
});

// Set default meta title and description if not provided
ProjectSchema.pre("save", function (next) {
    if (!this.metaTitle && this.title) {
        this.metaTitle = this.title;
    }

    if (!this.metaDescription && this.description) {
        // Create a plain text version of description for meta description
        const plainTextDescription = extractTextFromProjectDescription(this.description)
            .substring(0, 160);
        this.metaDescription = plainTextDescription;
    }

    next();
});

ProjectSchema.index({ createdAt: -1 });

if (process.env.NODE_ENV !== 'production' && mongoose.models.Project) {
    delete mongoose.models.Project;
}

export default mongoose.models.Project ||
    mongoose.model<IProject>("Project", ProjectSchema);
