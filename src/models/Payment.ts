import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPayment extends Document {
    user: mongoose.Types.ObjectId;
    amount: number;
    paymentMethod: "bKash" | "Nagad" | "Rocket" | "Bank App";
    transactionId?: string;
    senderNumber?: string;
    status: "pending" | "confirmed" | "rejected";
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema: Schema<IPayment> = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },
        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: [0.01, "Amount must be greater than zero"],
        },
        paymentMethod: {
            type: String,
            enum: ["bKash", "Nagad", "Rocket", "Bank App"],
            required: [true, "Payment method is required"],
        },
        transactionId: {
            type: String,
            trim: true,
        },
        senderNumber: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "rejected"],
            default: "pending",
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Logic for validating mobile banking details
const validateMobileDetails = (paymentMethod: string, transactionId?: string, senderNumber?: string) => {
    if (paymentMethod !== "Bank App" && !transactionId && !senderNumber) {
        throw new Error("Either Transaction ID or Sender Mobile Number must be provided for mobile banking.");
    }
};

// Document middleware for new records
PaymentSchema.pre("save", function (next) {
    try {
        validateMobileDetails(this.paymentMethod, this.transactionId, this.senderNumber);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Query middleware for update operations
PaymentSchema.pre(["findOneAndUpdate", "updateOne", "updateMany"], function (next) {
    const update = this.getUpdate() as any;
    
    // Check if paymentMethod is being updated
    const paymentMethod = update.paymentMethod || (update.$set && update.$set.paymentMethod);
    
    // If setting to mobile banking, require at least one verification field
    if (paymentMethod && paymentMethod !== "Bank App") {
        const transactionId = update.transactionId || (update.$set && update.$set.transactionId);
        const senderNumber = update.senderNumber || (update.$set && update.$set.senderNumber);
        
        try {
            validateMobileDetails(paymentMethod, transactionId, senderNumber);
        } catch (error: any) {
            return next(error);
        }
    }
    next();
});

const Payment: Model<IPayment> =
    mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
