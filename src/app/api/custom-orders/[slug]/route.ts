import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import CustomOrder from "@/models/CustomOrder";
import Client from "@/models/Client";
import User from "@/models/User";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await context.params;

        // We don't necessarily require authentication to *view* the slug if it's meant to be a public sharing link,
        // but the system plan notes to check if logged in. We'll enforce a soft check:
        // If they aren't the admin or the assigned client, they can still view the rich text proposal but cannot accept it natively.

        // We fetch purely by the unique slug. 
        const order = await CustomOrder.findOne({ shareableSlug: slug })
            .populate("admin", "name email image")
            .populate("client", "name email image")
            .lean();

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        const session = await getServerSession(authOptions);
        const isAdmin = (session?.user as any)?.role === "admin";

        // Strip admin-only fields if not an admin
        if (!isAdmin) {
            delete (order as any).renewDate;
            delete (order as any).renewPrice;
            delete (order as any).adminNote;
        }

        return NextResponse.json({ order });
    } catch (error) {
        console.error("Error fetching custom order by slug:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await context.params;
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 });
        }

        await connectDB();

        const isAdmin = session.user.role === "admin";

        // Query filter for atomic update
        const filter: any = { shareableSlug: slug };

        // Authorization logic for non-admins
        if (!isAdmin) {
            // Must be in "proposed" state
            filter.status = "proposed";

            // If it already has a client, only that client can update it (presumably to 'accepted')
            // Otherwise, any user can 'claim' it if it's currently unassigned.
            filter.$or = [
                { client: { $exists: false } },
                { client: null },
                { client: session.user.id }
            ];

            if (status !== "accepted") {
                return NextResponse.json({ error: "Forbidden. You can only accept proposals." }, { status: 403 });
            }
        }


        const finalUpdate: any = { $set: { status: status } };
        if (!isAdmin) {
            // We use the filter to ensure we only update if it's unassigned or owned by us.
            // If it's unassigned, we want to SET the client.
            // But we don't want to OVERWRITE the client if it's already us.
            // Using a standard $set for client is fine here because the filter restricts it to null or us.
            finalUpdate.$set.client = session.user.id;
        }

        const updatedOrder: any = await CustomOrder.findOneAndUpdate(
            filter,
            finalUpdate,
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            // If nothing matched, it's either 404, 403 (unauthorized client), or 400 (already accepted)
            // We'll perform one quick read to give a specific error or just return 403/404.
            const checkOrder = await CustomOrder.findOne({ shareableSlug: slug });
            if (!checkOrder) return NextResponse.json({ error: "Order not found" }, { status: 404 });

            if (checkOrder.status !== "proposed" && !isAdmin) {
                return NextResponse.json({ error: "Order is no longer in a proposable state." }, { status: 400 });
            }

            return NextResponse.json({ error: "Forbidden. You are not authorized to modify this order." }, { status: 403 });
        }
        // --- Client Integration Logic ---
        // If the proposal is newly accepted, we link it to the Client dashboard.
        if (status === "accepted" && updatedOrder.status === "accepted") {
            try {
                // 1. Get the user's details for the Client profile.
                const user: any = await User.findById(session.user.id).lean();

                if (user) {
                    // 2. Find if they already have a Client profile by checking their email
                    const existingClient: any = await Client.findOne({ email: user.email });

                    if (existingClient) {
                        // 3a. They exist. Push the new order ID to their customOrders array if not already present.
                        if (!existingClient.customOrders.some((id: any) => id.toString() === updatedOrder._id.toString())) {
                            existingClient.customOrders.push(updatedOrder._id);
                            await existingClient.save();
                        }
                    } else {
                        // 3b. They don't exist. Let's create a new Client profile for them.
                        // Default renewDate to 1 year from now if not explicitly set on the proposal.
                        const defaultRenewDate = new Date();
                        defaultRenewDate.setFullYear(defaultRenewDate.getFullYear() + 1);

                        await Client.create({
                            name: user.name || "Unknown Client",
                            email: [user.email],
                            clientImage: user.image || "https://res.cloudinary.com/dhdqebns9/image/upload/v1727027581/default-image.jpg", // Default placeholder
                            service: updatedOrder.title,
                            price: updatedOrder.price || 0,
                            renewDate: updatedOrder.renewDate || defaultRenewDate,
                            customOrders: [updatedOrder._id]
                        });
                    }
                }
            } catch (err) {
                console.error("Error linking Client profile upon proposal acceptance:", err);
                // We don't fail the entire request, just log it, as the order itself was successfully accepted.
            }
        }

        return NextResponse.json({ message: "Status updated successfully", order: updatedOrder });

    } catch (error) {
        console.error("Error updating custom order status:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized. Login required." }, { status: 401 });
        }

        if (session.user.role !== "admin") {
            return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
        }

        const { slug } = await context.params;
        await connectDB();

        const deletedOrder = await CustomOrder.findOneAndDelete({ shareableSlug: slug });

        if (!deletedOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Custom order deleted successfully" });
    } catch (error) {
        console.error("Error deleting custom order:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized. Login required." }, { status: 401 });
        }

        if (session.user.role !== "admin") {
            return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
        }

        const { slug } = await context.params;
        const body = await request.json();

        // Whitelist allowed fields for update
        const allowedFields = [
            "title",
            "description",
            "status",
            "price",
            "dueDate",
            "renewDate",
            "renewPrice",
            "adminNote",
            "paymentLink",
            "requirementsLink",
        ];

        const sanitizedUpdate: any = {};
        let hasUpdates = false;

        allowedFields.forEach(field => {
            if (field in body) {
                sanitizedUpdate[field] = body[field];
                hasUpdates = true;
            }
        });

        if (!hasUpdates) {
            return NextResponse.json({ error: "No valid fields provided for update" }, { status: 400 });
        }

        await connectDB();

        // Admin-only full update using whitelisted fields
        const updatedOrder = await CustomOrder.findOneAndUpdate(
            { shareableSlug: slug },
            { $set: sanitizedUpdate },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Custom order updated successfully", order: updatedOrder });

    } catch (error) {
        console.error("Error performing full update on custom order:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
