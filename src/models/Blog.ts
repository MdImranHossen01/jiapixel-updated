import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author?: mongoose.Types.ObjectId;
  authorName?: string;
  tags: string[];
  category: string;
  status: "draft" | "published" | "archived";
  publishedAt?: Date;
  seoTitle?: string;
  seoDescription?: string;
  readTime: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  relatedServices?: mongoose.Types.ObjectId[];
  isIndexedInGoogle: boolean;
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
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
    },
    relatedServices: [{
      type: Schema.Types.ObjectId,
      ref: "Service"
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
BlogSchema.index({ status: 1, publishedAt: -1 }); // For published blogs sorted by date
BlogSchema.index({ status: 1, createdAt: -1 }); // For all blogs sorted by creation
BlogSchema.index({ category: 1, status: 1 }); // For category filtering
BlogSchema.index({ tags: 1 }); // For tag-based queries
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

// 🗓️ Auto-set publishedAt when published
BlogSchema.pre("save", function (this: IBlog, next) {
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
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
