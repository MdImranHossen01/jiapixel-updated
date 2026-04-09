import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Payment from "@/models/Payment";
import { getToken } from "next-auth/jwt";

// GET /api/admin/payments - List all payments for administration
export async function GET(req: NextRequest) {
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
        return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const payments = await Payment.find({})
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .lean();
        return NextResponse.json(payments);
    } catch (error) {
        console.error("Error fetching admin payments:", error);
        return NextResponse.json(
            { message: "Error fetching payments" },
            { status: 500 }
        );
    }
}
