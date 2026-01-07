import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IZakatYear extends Document {
    year: number;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ZakatYearSchema: Schema = new Schema({
    year: {
        type: Number,
        required: true,
        unique: true,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
}, {
    timestamps: true,
});

const ZakatYear: Model<IZakatYear> = mongoose.models?.ZakatYear || mongoose.model<IZakatYear>('ZakatYear', ZakatYearSchema);

export default ZakatYear;
