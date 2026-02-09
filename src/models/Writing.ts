
import mongoose, { Schema, Document } from "mongoose";

export interface IWriting extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    author?: mongoose.Types.ObjectId;
    authorName?: string;
    seoTitle?: string;
    seoDescription?: string;
    readTime: number;
    views: number;
    createdAt: Date;
    updatedAt: Date;
    relatedProjects?: mongoose.Types.ObjectId[];
    relatedWritings?: mongoose.Types.ObjectId[];
}

const WritingSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [200, "Title cannot be more than 200 characters"],
        },
        slug: {
            type: String,
            required: [true, "Slug is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        content: {
            type: String,
            required: [true, "Content is required"],
        },
        excerpt: {
            type: String,
            maxlength: [300, "Excerpt cannot be more than 300 characters"],
        },
        featuredImage: {
            type: String,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        authorName: {
            type: String,
            default: "Md. Imran Hossen",
        },
        relatedProjects: [{
            type: Schema.Types.ObjectId,
            ref: "Project"
        }],
        relatedWritings: [{
            type: Schema.Types.ObjectId,
            ref: "Writing"
        }],
        seoTitle: {
            type: String,
            maxlength: [60, "SEO Title cannot be more than 60 characters"],
        },
        seoDescription: {
            type: String,
            maxlength: [160, "SEO Description cannot be more than 160 characters"],
        },
        readTime: {
            type: Number,
            default: 0,
        },
        views: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

WritingSchema.pre("save", function (this: IWriting, next) {
    if (this.isModified("content")) {
        const wordsPerMinute = 200;
        const wordCount = this.content.split(/\s+/).length;
        this.readTime = Math.ceil(wordCount / wordsPerMinute);
    }
    next();
});

WritingSchema.pre("save", function (this: IWriting, next) {
    if (this.isModified("title") && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    }
    next();
});

if (process.env.NODE_ENV !== 'production' && mongoose.models.Writing) {
    delete mongoose.models.Writing;
}

const Writing = mongoose.models.Writing || mongoose.model<IWriting>("Writing", WritingSchema);
export default Writing;
