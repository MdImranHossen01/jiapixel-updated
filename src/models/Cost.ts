import mongoose, { Schema, Document, Model } from 'mongoose';

import { COST_CATEGORIES } from '@/constants/financials';

// Re-export for backward compatibility if needed, though direct import is preferred
export { COST_CATEGORIES };

export interface ICost extends Document {
    date: Date;
    category: string;
    amount: number;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CostSchema: Schema = new Schema({
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: COST_CATEGORIES,
        trim: true,
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount cannot be negative'],
    },
    description: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

// Force model rebuild to pick up enum changes in development
if (mongoose.models && mongoose.models.Cost) {
    delete mongoose.models.Cost;
}

const Cost: Model<ICost> = mongoose.model<ICost>('Cost', CostSchema);

export default Cost;
