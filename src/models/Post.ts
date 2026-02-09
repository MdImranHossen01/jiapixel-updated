
import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
    title: string;
    slug: string;
    content: string;
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
    relatedPosts?: mongoose.Types.ObjectId[];
    isIndexedInGoogle?: boolean;
    status: 'draft' | 'published' | 'archived';
}

const PostSchema: Schema = new Schema(
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
        relatedPosts: [{
            type: Schema.Types.ObjectId,
            ref: "Post"
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
        isIndexedInGoogle: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'published',
        },
    },
    {
        timestamps: true,
    }
);

PostSchema.pre("save", function (this: IPost, next) {
    if (this.isModified("content")) {
        const trimmed = this.content?.trim();
        if (!trimmed) {
            this.readTime = 0;
        } else {
            const wordsPerMinute = 200;
            const wordCount = trimmed.split(/\s+/).length;
            this.readTime = Math.ceil(wordCount / wordsPerMinute);
        }
    }
    next();
});

PostSchema.pre("save", function (this: IPost, next) {
    if (this.isModified("title") && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    }
    next();
});

if (process.env.NODE_ENV !== 'production' && mongoose.models.Post) {
    delete mongoose.models.Post;
}

const Post = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
export default Post;
