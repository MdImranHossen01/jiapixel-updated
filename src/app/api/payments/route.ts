import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Payment from "@/models/Payment";
import { getToken } from "next-auth/jwt";

// GET /api/payments - Fetch user's own payment history
export async function GET(req: NextRequest) {
    const token = await getToken({ req });
    if (!token || !token.id) {
        return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const payments = await Payment.find({ user: token.id })
            .sort({ createdAt: -1 })
            .lean();
        return NextResponse.json(payments);
    } catch (error) {
        console.error("Error fetching payments:", error);
        return NextResponse.json(
            { message: "Error fetching payments" },
            { status: 500 }
        );
    }
}

// POST /api/payments - Submit a new payment
export async function POST(req: NextRequest) {
    const token = await getToken({ req });

    try {
        await dbConnect();
        const body = await req.json();
        const { clientName, clientMobile, clientEmail, amount, paymentMethod, transactionId, senderNumber, notes } = body;

        // Basic validation in addition to schema validation
        if (!amount || !paymentMethod) {
            return NextResponse.json(
                { message: "Amount and Payment Method are required" },
                { status: 400 }
            );
        }

        if (paymentMethod !== "Scan QR" && !transactionId && !senderNumber) {
            return NextResponse.json(
                { message: "Either Transaction ID or Sender Number must be provided." },
                { status: 400 }
            );
        }

        const newPayment = new Payment({
            user: token?.id || undefined,
            clientName,
            clientMobile,
            clientEmail,
            amount,
            paymentMethod,
            transactionId,
            senderNumber,
            notes,
        });

        await newPayment.save();

        return NextResponse.json(newPayment, { status: 201 });
    } catch (error: any) {
        console.error("Error submitting payment:", error);

        // Handle Mongoose validation errors
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            return NextResponse.json(
                { message: "Validation failed", errors: messages },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Error submitting payment" },
            { status: 500 }
        );
    }
}
