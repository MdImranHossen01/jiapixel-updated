import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import CustomOrder from "@/models/CustomOrder";
import crypto from "crypto";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
        }

        const body = await request.json();
        const { title, description, client, price, currency, dueDate, renewDate, renewPrice, adminNote, paymentLink, requirementsLink } = body;

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        await connectDB();

        const shareableSlug = crypto.randomBytes(16).toString("hex");

        const orderData: any = {
            title,
            description,
            admin: session.user.id,
            status: "proposed",
            shareableSlug,
            currency: currency || "USD",
        };

        // Only add optional fields if they exist to avoid Mongoose casting errors and preserve zero values
        if (client !== undefined && client !== null && client !== "") orderData.client = client;
        if (price !== undefined && price !== null && price !== "") orderData.price = Number(price);
        if (dueDate !== undefined && dueDate !== null && dueDate !== "") orderData.dueDate = new Date(dueDate);
        if (renewDate !== undefined && renewDate !== null && renewDate !== "") orderData.renewDate = new Date(renewDate);
        if (renewPrice !== undefined && renewPrice !== null && renewPrice !== "") orderData.renewPrice = Number(renewPrice);
        if (adminNote !== undefined && adminNote !== null && adminNote !== "") orderData.adminNote = adminNote;
        if (paymentLink !== undefined && paymentLink !== null && paymentLink !== "") orderData.paymentLink = paymentLink;
        if (requirementsLink !== undefined && requirementsLink !== null && requirementsLink !== "") orderData.requirementsLink = requirementsLink;

        const newOrder = await CustomOrder.create(orderData);

        return NextResponse.json({
            message: "Custom order created successfully",
            order: newOrder
        }, { status: 201 });

    } catch (error: any) {
        console.error("Error creating custom order:", error);
        return NextResponse.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        let orders;

        if (session.user.role === "admin") {
            // Admins see all custom orders
            orders = await CustomOrder.find()
                .populate("client", "name email image")
                .populate("admin", "name email image")
                .sort({ createdAt: -1 })
                .lean();
        } else {
            // Clients only see custom orders assigned to them AND do NOT see admin-only fields
            orders = await CustomOrder.find({ client: session.user.id })
                .select('-renewDate -renewPrice -adminNote')
                .populate("admin", "name email image")
                .sort({ createdAt: -1 })
                .lean();
        }

        return NextResponse.json({ orders });
    } catch (error) {
        console.error("Error fetching custom orders:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
