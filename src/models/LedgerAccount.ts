import mongoose, { Document, Model, Schema } from "mongoose";

export const ACCOUNT_CURRENCIES = ["BDT", "USD", "GBP", "CAD", "AUD", "EUR"] as const;
export type AccountCurrency = (typeof ACCOUNT_CURRENCIES)[number];

export interface ILedgerAccount extends Document {
  name: string;
  code: string;
  accountNumber?: string;
  bankName?: string;
  branchName?: string;
  bankAccountType?: "Savings" | "Current";
  mfsProvider?: string;
  mfsType?: "Merchant" | "Agent" | "Personal";
  openingBalance: number;
  currentBalance: number;
  type: "asset" | "liability";
  category: "Cash" | "Bank" | "MFS" | "Other";
  currency?: AccountCurrency;
  description?: string;
  isSystem?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LedgerAccountSchema: Schema<ILedgerAccount> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    accountNumber: { type: String, trim: true },
    bankName: { type: String, trim: true },
    branchName: { type: String, trim: true },
    bankAccountType: { type: String, enum: ["Savings", "Current"] },
    mfsProvider: { type: String, trim: true },
    mfsType: { type: String, enum: ["Merchant", "Agent", "Personal"] },
    openingBalance: { type: Number, default: 0 },
    currentBalance: { type: Number, default: 0 },
    type: { type: String, default: "asset", enum: ["asset", "liability"] },
    category: { type: String, default: "Bank", enum: ["Cash", "Bank", "MFS", "Other"] },
    currency: { type: String, default: "BDT", enum: ACCOUNT_CURRENCIES },
    description: { type: String, trim: true },
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const LedgerAccount: Model<ILedgerAccount> =
  mongoose.models.LedgerAccount ||
  mongoose.model<ILedgerAccount>("LedgerAccount", LedgerAccountSchema);

export default LedgerAccount;

