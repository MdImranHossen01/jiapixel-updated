import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClient extends Document {
    name: string;
    clientImage: string;
    country?: string;
    website?: string;
    socialLinks: {
        linkedin?: string;
        whatsapp?: string[]; // Array of strings
        facebook?: string;
        instagram?: string;
        youtube?: string;
    };
    service: string;
    price: number;
    renewDate: Date;
    email: string[]; // Array of strings
    createdAt: Date;
    updatedAt: Date;
}

const ClientSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true,
    },
    clientImage: {
        type: String,
        required: [true, 'Client image is required'],
    },
    country: {
        type: String,
        trim: true,
    },
    website: {
        type: String,
        trim: true,
    },
    socialLinks: {
        linkedin: { type: String, trim: true },
        whatsapp: [{ type: String, trim: true }], // Changed to array
        facebook: { type: String, trim: true },
        instagram: { type: String, trim: true },
        youtube: { type: String, trim: true },
    },
    service: {
        type: String,
        required: [true, 'Service name is required'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    renewDate: {
        type: Date,
        required: [true, 'Renew date is required'],
    },
    email: [{ // Changed to array
        type: String,
        required: [true, 'At least one email is required'],
        trim: true,
        lowercase: true,
    }],
}, {
    timestamps: true,
});

// Check if model already exists to prevent overwrite error during hot reload
const Client: Model<IClient> = mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);

export default Client;
