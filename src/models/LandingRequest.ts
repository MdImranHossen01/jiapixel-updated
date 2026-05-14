import mongoose, { Document, Schema } from "mongoose";

export interface ILandingRequest extends Document {
  name: string;
  email: string;
  phone: string;
  status: "requested" | "need contact" | "contacted" | "confirm" | "need to contact again" | "ordered" | "processing" | "delivered" | "paid" | "canceled" | "fake";
  source: string;
  price: number;
  details?: string;
  projectTitle?: string;
  proposalUrl?: string;
  freeOffered: boolean;
  contactedToday: boolean;
  quickNote?: string;
  credential?: string;
  lastContacted?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LandingRequestSchema = new Schema<ILandingRequest>(
  {
    name: {
      type: String,
      trim: true,
      default: "New Lead",
    },
    email: {
      type: String,
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
      enum: ["requested", "need contact", "contacted", "confirm", "need to contact again", "ordered", "processing", "delivered", "paid", "canceled", "fake"],
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
    freeOffered: {
      type: Boolean,
      default: false,
    },
    contactedToday: {
      type: Boolean,
      default: false,
    },
    quickNote: {
      type: String,
      trim: true,
    },
    credential: {
      type: String,
      trim: true,
    },
    lastContacted: {
      type: Date,
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
