import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Bill from "@/models/Bill";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest, { params }: { params: Promise<{ invoiceNo: string }> }) {
  try {
    const { invoiceNo } = await params;
    await dbConnect();

    // Check if the current user is an admin
    const token = await getToken({ req });
    const isAdmin = token && token.role === "admin";

    // Find the bill. If user is admin, include adminNote. Otherwise, exclude it.
    const query = Bill.findOne({ invoiceNo });
    if (!isAdmin) {
      query.select("-adminNote");
    }

    const bill = await query;
    if (!bill) {
      return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(bill);
  } catch (error: any) {
    console.error("Error fetching public bill:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
