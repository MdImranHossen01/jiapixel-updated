import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const orders = await Order.find({})
      .select("user service tier status total orderNumber createdAt") // Explicitly select fields
      .sort({ createdAt: -1 });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Error fetching orders", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !token.sub) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.json();
    const { service, tier, requirements } = body;
    
    console.log("Creating order with data:", {
      user: token.sub,
      service,
      tier,
      requirements
    });

    // Generate order number manually
    const generateOrderNumber = () => {
      const date = new Date();
      const timestamp = date.getTime();
      const random = Math.floor(Math.random() * 1000);
      return `ORD-${timestamp}-${random}`;
    };

    // Use string ID directly for user, convert only service ID to ObjectId
    const newOrder = new Order({
      user: token.sub, // Use string ID directly
      service: new mongoose.Types.ObjectId(service), // Convert service ID to ObjectId
      tier,
      total: tier.price,
      orderNumber: generateOrderNumber(), // Generate order number manually
      requirements: requirements || `Service order for ${tier.title} package`,
    });
    
    await newOrder.save();
    
    console.log("Order created successfully:", newOrder);

    // Return the order without population for now (we'll fix population later)
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error creating order", error: errorMessage },
      { status: 500 }
    );
  }
}