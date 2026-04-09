import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Payment from "@/models/Payment";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

// PATCH /api/admin/payments/[id] - Update payment status
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
        return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    try {
        const { id } = await params;

        if (!mongoose.isValidObjectId(id)) {
            return NextResponse.json({ message: "Invalid payment id" }, { status: 400 });
        }

        await dbConnect();
        const body = await req.json();
        const { status } = body;

        if (!["confirmed", "rejected", "pending"].includes(status)) {
            return NextResponse.json({ message: "Invalid status" }, { status: 400 });
        }

        const updatedPayment = await Payment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate("user", "name email");

        if (!updatedPayment) {
            return NextResponse.json({ message: "Payment not found" }, { status: 404 });
        }

        return NextResponse.json(updatedPayment);
    } catch (error) {
        console.error("Error updating payment status:", error);
        return NextResponse.json(
            { message: "Error updating payment status" },
            { status: 500 }
        );
    }
}
