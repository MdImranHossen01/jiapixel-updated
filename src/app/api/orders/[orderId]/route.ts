import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { getToken } from "next-auth/jwt";

// Define the context type for clarity
type RouteContext = {
  params: {
    orderId: string;
  };
};

export async function GET(req: NextRequest, context: RouteContext) {
  const token = await getToken({ req });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  const { orderId } = await context.params;

  await dbConnect();

  try {
    const order = await Order.findById(orderId)
      .populate("service", "title");
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching order", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const token = await getToken({ req });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  const { orderId } = await context.params;

  await dbConnect();

  try {
    const body = await req.json();
    const { status } = body;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating order", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const token = await getToken({ req });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  const { orderId } = await context.params;

  await dbConnect();

  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting order", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}