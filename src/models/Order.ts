import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  tier: {
    title: string;
    price: number;
    deliveryDays: number;
    revisions: number;
    features: Record<string, boolean>;
  };
  status: "pending" | "confirmed" | "processing" | "under reviews" | "cancelled" | "completed";
  total: number;
  orderNumber: string;
  requirements?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service", // This matches your Service model name
      required: true,
    },
    tier: {
      title: { type: String, required: true },
      price: { type: Number, required: true },
      deliveryDays: { type: Number, required: true },
      revisions: { type: Number, required: true },
      features: { type: Schema.Types.Mixed, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "under reviews", "cancelled", "completed"],
      default: "pending",
    },
    total: {
      type: Number,
      required: true,
    },
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    requirements: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better performance
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);