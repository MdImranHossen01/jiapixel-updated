import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAssetRecord extends Document {
    asset: mongoose.Types.ObjectId;
    year: number;
    startPrice: number;
    endPrice: number;
    targetValue: number;
    createdAt: Date;
    updatedAt: Date;
}

const AssetRecordSchema: Schema = new Schema({
    asset: {
        type: Schema.Types.ObjectId,
        ref: 'Asset',
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    startPrice: {
        type: Number,
        default: 0,
        min: 0,
    },
    endPrice: {
        type: Number,
        default: 0,
        min: 0,
    },
    targetValue: {
        type: Number,
        default: 0,
        min: 0,
    },
}, {
    timestamps: true,
});

// Unique record per asset per year
AssetRecordSchema.index({ asset: 1, year: 1 }, { unique: true });

const AssetRecord: Model<IAssetRecord> = mongoose.models?.AssetRecord || mongoose.model<IAssetRecord>('AssetRecord', AssetRecordSchema);

export default AssetRecord;
