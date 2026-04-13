import mongoose, { Document, Schema } from "mongoose";

export interface ILandingRequest extends Document {
  name: string;
  email: string;
  phone: string;
  status: "requested" | "contacted" | "confirm" | "cancel" | "completed";
  source: string;
  price: number;
  details?: string;
  projectTitle?: string;
  proposalUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LandingRequestSchema = new Schema<ILandingRequest>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["requested", "contacted", "confirm", "cancel", "completed"],
      default: "requested",
    },
    source: {
      type: String,
      default: "ecommerce-landing-page",
    },
    price: {
      type: Number,
      default: 3500,
    },
    details: {
      type: String,
    },
    projectTitle: {
      type: String,
      trim: true,
    },
    proposalUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better performance
LandingRequestSchema.index({ email: 1 });
LandingRequestSchema.index({ phone: 1 });
LandingRequestSchema.index({ status: 1 });
LandingRequestSchema.index({ createdAt: -1 });

// Prevent model recompilation error in development
export default mongoose.models.LandingRequest || mongoose.model<ILandingRequest>("LandingRequest", LandingRequestSchema);
