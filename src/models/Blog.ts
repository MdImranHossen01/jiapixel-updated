import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;

  featuredImage?: string;
  author?: mongoose.Types.ObjectId;
  authorName?: string;
  publishedAt?: Date;
  seoTitle?: string;
  seoDescription?: string;
  readTime: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  relatedServices?: mongoose.Types.ObjectId[];
  relatedBlogs?: mongoose.Types.ObjectId[];
  isIndexedInGoogle?: boolean;
}

const BlogSchema: Schema = new Schema(
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
      unique: true, // ✅ This already creates an index
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
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    relatedServices: [{
      type: Schema.Types.ObjectId,
      ref: "Service"
    }],
    relatedBlogs: [{
      type: Schema.Types.ObjectId,
      ref: "Blog"
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
  },
  {
    timestamps: true,
  }
);

// Performance indexes for common query patterns
BlogSchema.index({ publishedAt: -1 }); // For sorting by date
BlogSchema.index({ createdAt: -1 }); // For sorting by creation
BlogSchema.index({ slug: 1 }); // For slug lookups (already unique, but explicit)

//  Calculate read time before saving
BlogSchema.pre("save", function (this: IBlog, next) {
  if (this.isModified("content")) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }
  next();
});

// 🪄 Auto-generate slug if not provided
BlogSchema.pre("save", function (this: IBlog, next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  next();
});

// Prevent "OverwriteModelError" in dev but force schema update
if (process.env.NODE_ENV !== 'production' && mongoose.models.Blog) {
  delete mongoose.models.Blog;
}

const Blog = mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
export default Blog;

