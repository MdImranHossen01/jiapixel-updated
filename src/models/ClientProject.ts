import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDocument {
    title: string;
    url: string;
    type: 'contract' | 'brief' | 'deliverable' | 'other';
    uploadedAt: Date;
}

export interface IInvoice {
    invoiceId: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    dueDate: Date;
    url?: string;
}

export interface IClientProject extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    status: 'active' | 'pending' | 'completed' | 'cancelled';
    serviceType: string;
    startDate: Date;
    endDate?: Date;
    progress: number; // 0-100
    documents: IDocument[];
    invoices: IInvoice[];
    createdAt: Date;
    updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, enum: ['contract', 'brief', 'deliverable', 'other'], default: 'other' },
    uploadedAt: { type: Date, default: Date.now }
});

const InvoiceSchema = new Schema<IInvoice>({
    invoiceId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['paid', 'pending', 'overdue'], default: 'pending' },
    dueDate: { type: Date, required: true },
    url: { type: String }
});

const ClientProjectSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
        type: String,
        enum: ['active', 'pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    serviceType: { type: String, required: true },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    documents: [DocumentSchema],
    invoices: [InvoiceSchema]
}, {
    timestamps: true
});

// Check if model already exists to prevent overwrite error during hot reload
const ClientProject: Model<IClientProject> = mongoose.models.ClientProject || mongoose.model<IClientProject>('ClientProject', ClientProjectSchema);

export default ClientProject;
