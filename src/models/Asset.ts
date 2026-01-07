import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAsset extends Document {
    name: string;
    buyingPrice: number;
    buyingDate: Date;
    isZakatable: boolean;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const AssetSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Asset name is required'],
        trim: true,
    },
    buyingPrice: {
        type: Number,
        default: 0,
        min: 0,
    },
    buyingDate: {
        type: Date,
        default: Date.now,
    },
    isZakatable: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

const Asset: Model<IAsset> = mongoose.models?.Asset || mongoose.model<IAsset>('Asset', AssetSchema);

export default Asset;
