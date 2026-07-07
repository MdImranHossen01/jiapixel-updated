import mongoose, { Document, Schema } from "mongoose";

export interface ICustomOrder extends Document {
    title: string;
    description: string; // Novel.sh JSON content stringified
    admin: mongoose.Types.ObjectId;
    client?: mongoose.Types.ObjectId;
    status: "proposed" | "accepted" | "pending" | "paid" | "processing" | "delivered" | "under review" | "completed" | "canceled";
    shareableSlug: string;
    price?: number;
    currency?: "USD" | "BDT";

    // Admin tracking features
    dueDate?: Date;
    renewDate?: Date;
    renewPrice?: number;
    adminNote?: string;
    paymentLink?: string;
    requirementsLink?: string;

    createdAt: Date;
    updatedAt: Date;
}

const CustomOrderSchema = new Schema<ICustomOrder>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "", // Will hold the serialized JSON from Novel.sh
        },
        admin: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        status: {
            type: String,
            enum: ["proposed", "accepted", "pending", "paid", "processing", "delivered", "under review", "completed", "canceled"],
            default: "proposed",
        },
        shareableSlug: {
            type: String,
            unique: true,
            required: true,
        },
        price: {
            type: Number,
            required: false,
        },
        currency: {
            type: String,
            enum: ["USD", "BDT"],
            default: "USD",
        },
        dueDate: {
            type: Date,
            required: false,
        },
        renewDate: {
            type: Date,
            required: false,
        },
        renewPrice: {
            type: Number,
            required: false,
        },
        adminNote: {
            type: String,
            required: false,
            default: "",
        },
        paymentLink: {
            type: String,
            required: false,
            default: "",
        },
        requirementsLink: {
            type: String,
            required: false,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for performance
CustomOrderSchema.index({ admin: 1, createdAt: -1 });
CustomOrderSchema.index({ client: 1, createdAt: -1 });
CustomOrderSchema.index({ status: 1 });
CustomOrderSchema.index({ shareableSlug: 1 }, { unique: true });

// In Next.js dev mode, the model might already be compiled with an old schema.
// We force a delete and re-creation if we detect a change is needed or just to be safe during this refactor.
if (mongoose.models.CustomOrder) {
    delete mongoose.models.CustomOrder;
}

export default mongoose.model<ICustomOrder>("CustomOrder", CustomOrderSchema);
