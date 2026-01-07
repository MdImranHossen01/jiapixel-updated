import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBudget extends Document {
    category: string;
    year: number;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
}

const BudgetSchema: Schema = new Schema({
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
    },
    year: {
        type: Number,
        required: [true, 'Year is required'],
        default: () => new Date().getFullYear(),
    },
    amount: {
        type: Number,
        required: [true, 'Budget amount is required'],
        default: 0,
        min: 0,
    },
}, {
    timestamps: true,
});

// Ensure a category has only one budget per year
BudgetSchema.index({ category: 1, year: 1 }, { unique: true });

const Budget: Model<IBudget> = mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);

export default Budget;
