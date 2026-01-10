import mongoose, { Schema, Document, Model } from 'mongoose';

import { INCOME_SOURCES } from '@/constants/financials';

export { INCOME_SOURCES };

export const INCOME_TYPES = ['Regular', 'Contract'];

export interface IIncome extends Document {
    date: Date;
    source: string;
    type: 'Regular' | 'Contract';
    amount: number;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const IncomeSchema: Schema = new Schema({
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now,
    },
    source: {
        type: String,
        required: [true, 'Source is required'],
        enum: INCOME_SOURCES,
        trim: true,
    },
    type: {
        type: String,
        enum: INCOME_TYPES,
        default: 'Regular',
        required: true,
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
    },
    description: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

const Income: Model<IIncome> = mongoose.models?.Income || mongoose.model<IIncome>('Income', IncomeSchema);

export default Income;
