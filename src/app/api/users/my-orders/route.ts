import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (!token || !token.sub) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    // Use string ID directly for querying
    const orders = await Order.find({ user: token.sub })
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { message: "Error fetching orders", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}