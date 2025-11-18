import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("service", "title");
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching orders", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
    const token = await getToken({ req });
    if (!token) {
        return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await dbConnect();

    try {
        const body = await req.json();
        const { user, service, total } = body;
        const newOrder = new Order({
            user,
            service,
            total,
        });
        await newOrder.save();
        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "Error creating order", error },
            { status: 500 }
        );
    }
}