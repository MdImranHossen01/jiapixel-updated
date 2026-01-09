import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICashflow extends Document {
    date: Date;
    type: "IN" | "OUT";
    amount: number;
    description: string;
    category?: string; // Optional: e.g., 'Project Payment', 'Office Rent'
    createdAt: Date;
    updatedAt: Date;
}

const CashflowSchema: Schema<ICashflow> = new Schema(
    {
        date: {
            type: Date,
            required: [true, "Date is required"],
            default: Date.now,
        },
        type: {
            type: String,
            enum: ["IN", "OUT"],
            required: [true, "Transaction type is required"],
        },
        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: [0, "Amount must be positive"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        category: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent overwriting the model if it already exists (Next.js hot reload fix)
const Cashflow: Model<ICashflow> =
    mongoose.models.Cashflow ||
    mongoose.model<ICashflow>("Cashflow", CashflowSchema);

export default Cashflow;
