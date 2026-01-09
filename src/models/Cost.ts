import mongoose, { Schema, Document, Model } from 'mongoose';

export const COST_CATEGORIES = [
    'Bou DPS',
    'Gold Savings',
    'Tour Savings',
    '5% Freelancing Savings',
    'Eidul Fitr',
    'Shashuri',
    'Ammu',
    'Bou',
    'Kobutor Cost',
    'Freelancing Cost',
    'Market place Cost',
    'Rent',
    'Gas',
    'Electricity Bill',
    'Water Supply',
    'Mobile Bill',
    'Internet',
    'Education',
    'Treatment',
    'Transport',
    'Vegetable',
    'Rice',
    'Piaj',
    'Rosun',
    'Polau Rice',
    'Dal',
    'Salt',
    'Alu',
    'Fruits',
    'Snacks',
    'toiletries',
    'Egg',
    'Milk',
    'Spaces',
    'Sugar',
    'Tea',
    'Meat',
    'Fish',
    'Oil',
    'Ata',
    'Personal Care',
    'Home',
    'Others',
    'Home tour',
    'Charity/Mosque',
    'Roja',
    'Tour',
    'Others Festival',
    'Eidul Adha',
    'Zakat',
    'Maintenance/Charge',
    'Office Program',
    'Tasmim',
    'Ayman',
    'Sajid',
    'Costume',
    'Tailor Machine',
    'Backup UPS',
    'Book Shelf 2',
    'Passport',
    'Table',
    'Showcase',
    'Dressing Table',
    'Rack',
    'TV',
    'Motor Cycle',
    'Kitchen',
    'Mobile Me',
    'Mobile Bou',
    'Mobile Ammu',
    'Oven',
    'Loan Khala',
    'Loan Himel',
    'Loan M Ali',
    'Loan Ammu',
    'Loan Dolil',
    'Current Loan Payment',
    'Uncertinity'
];

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

const Cost: Model<ICost> = mongoose.models.Cost || mongoose.model<ICost>('Cost', CostSchema);

export default Cost;
