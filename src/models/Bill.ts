import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBillItem {
  name: string;
  quantity: number;
  price: number;
  link?: string;
}

export interface IBill extends Document {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  businessName?: string;
  invoiceNo: string;
  date: Date;
  items: IBillItem[];
  subtotal: number;
  serviceCharge: number;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  discount: number;
  total: number;
  prevDue: number;
  gTotal: number;
  cashIn: number;
  currentBillDue: number;
  status: 'Paid' | 'Due' | 'Fraud';
  currency: 'BDT' | 'USD';
  renewDate?: Date;
  renewFee?: number;
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BillSchema: Schema<IBill> = new Schema(
  {
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientPhone: { type: String, required: true },
    clientAddress: { type: String, required: true },
    businessName: { type: String },
    invoiceNo: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        link: { type: String },
      },
    ],
    subtotal: { type: Number, required: true, min: 0 },
    serviceCharge: { type: Number, default: 0, min: 0 },
    discountType: { type: String, enum: ['fixed', 'percentage'], default: 'fixed' },
    discountValue: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    prevDue: { type: Number, default: 0, min: 0 },
    gTotal: { type: Number, required: true, min: 0 },
    cashIn: { type: Number, default: 0, min: 0 },
    currentBillDue: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['Paid', 'Due', 'Fraud'], default: 'Due' },
    currency: { type: String, enum: ['BDT', 'USD'], default: 'BDT' },
    renewDate: { type: Date },
    renewFee: { type: Number, default: 0 },
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

// Add text index for searching bills
BillSchema.index({ clientName: 'text', clientEmail: 'text', clientPhone: 'text', invoiceNo: 'text' });

if (mongoose.models.Bill) {
  delete (mongoose.models as any).Bill;
}

const Bill: Model<IBill> = mongoose.model<IBill>('Bill', BillSchema);

export default Bill;
