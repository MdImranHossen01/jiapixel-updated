import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IIncomeTarget extends Document {
    source: string;
    year: number;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
}

const IncomeTargetSchema: Schema = new Schema({
    source: {
        type: String,
        required: [true, 'Source is required'],
        trim: true,
    },
    year: {
        type: Number,
        required: [true, 'Year is required'],
        default: () => new Date().getFullYear(),
    },
    amount: {
        type: Number,
        required: [true, 'Target amount is required'],
        default: 0,
        min: 0,
    },
}, {
    timestamps: true,
});

// Ensure a source has only one target per year
IncomeTargetSchema.index({ source: 1, year: 1 }, { unique: true });

const IncomeTarget: Model<IIncomeTarget> = mongoose.models?.IncomeTarget || mongoose.model<IIncomeTarget>('IncomeTarget', IncomeTargetSchema);

export default IncomeTarget;
