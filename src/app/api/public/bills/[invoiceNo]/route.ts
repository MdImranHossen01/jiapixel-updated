import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Bill from "@/models/Bill";

export async function GET(req: NextRequest, { params }: { params: Promise<{ invoiceNo: string }> }) {
  try {
    const { invoiceNo } = await params;
    await dbConnect();

    // Find the bill by invoice number, exclude adminNote for client privacy
    const bill = await Bill.findOne({ invoiceNo }).select("-adminNote");
    if (!bill) {
      return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(bill);
  } catch (error: any) {
    console.error("Error fetching public bill:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
