import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrder extends Document {
  user: mongoose.Schema.Types.ObjectId;
  service: mongoose.Schema.Types.ObjectId;
  status: "pending" | "processing" | "completed" | "cancelled";
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema: Schema<IOrder> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service", // Assuming you have a Service model
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;