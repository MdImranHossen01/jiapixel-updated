import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Bill from "@/models/Bill";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token || !token.email) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await dbConnect();

    // Fetch bills associated with client's email address
    const bills = await Bill.find({ clientEmail: token.email }).select("-adminNote").sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: bills,
    });
  } catch (error: any) {
    console.error("Error fetching client bills:", error);
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
