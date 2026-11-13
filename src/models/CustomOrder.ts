import mongoose, { Document, Schema } from "mongoose";

export interface ICustomOrderItem {
    name: string;
    description?: string;
    quantity: number;
    price: number;
    link?: string;
}

export interface ICustomOrder extends Document {
    title: string;
    description: string; // Novel.sh JSON content stringified
    admin: mongoose.Types.ObjectId;
    client?: mongoose.Types.ObjectId;
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    clientAddress?: string;
    businessName?: string;
    items?: ICustomOrderItem[];
    serviceCharge?: number;
    discountType?: "fixed" | "percentage";
    discountValue?: number;
    discount?: number;
    status: "proposed" | "accepted" | "pending" | "paid" | "processing" | "delivered" | "under review" | "completed" | "canceled";
    shareableSlug: string;
    price?: number;
    currency?: "USD" | "BDT";
    convertedBillId?: mongoose.Types.ObjectId;

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
        clientName: { type: String, trim: true, default: "" },
        clientEmail: { type: String, trim: true, default: "" },
        clientPhone: { type: String, trim: true, default: "" },
        clientAddress: { type: String, trim: true, default: "" },
        businessName: { type: String, trim: true, default: "" },
        items: [
            {
                name: { type: String, required: true, trim: true },
                description: { type: String, default: "" },
                quantity: { type: Number, default: 1, min: 1 },
                price: { type: Number, default: 0, min: 0 },
                link: { type: String, default: "" },
            },
        ],
        serviceCharge: { type: Number, default: 0 },
        discountType: { type: String, enum: ["fixed", "percentage"], default: "fixed" },
        discountValue: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        convertedBillId: {
            type: Schema.Types.ObjectId,
            ref: "Bill",
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
