import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import CustomOrder from "@/models/CustomOrder";
import Client from "@/models/Client";
import User from "@/models/User";
import Bill from "@/models/Bill";
import Payment from "@/models/Payment";
import { recordLedgerEntry, resolvePaymentAccountCode } from "@/lib/ledger-utils";

const formatBDPhoneForBill = (phone: string): string => {
    const clean = (phone || "").replace(/[^\d]/g, "");
    if (clean.length === 11 && clean.startsWith("0")) return `88${clean}`;
    if (clean.length === 10 && clean.startsWith("1")) return `880${clean}`;
    return clean;
};

const formatBDPhoneForUser = (phone: string): string => {
    const clean = (phone || "").replace(/[^\d]/g, "");
    if (clean.length === 13 && clean.startsWith("880")) return clean.slice(2);
    if (clean.length === 11 && clean.startsWith("0")) return clean;
    if (clean.length === 10 && clean.startsWith("1")) return `0${clean}`;
    return clean;
};

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
            "clientName",
            "clientEmail",
            "clientPhone",
            "clientAddress",
            "businessName",
            "items",
            "serviceCharge",
            "discountType",
            "discountValue",
            "discount",
            "price",
            "currency",
            "dueDate",
            "renewDate",
            "renewPrice",
            "adminNote",
            "paymentLink",
            "requirementsLink",
            "convertedBillId",
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

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await context.params;
        const body = await request.json();
        const {
            clientName,
            clientEmail,
            clientPhone,
            clientAddress,
            businessName,
            payNow,
            paidAmount,
            paymentMethod,
            transactionId,
            senderNumber,
            paymentNote,
        } = body;

        if (!clientName?.trim() || !clientEmail?.trim() || !clientPhone?.trim() || !clientAddress?.trim()) {
            return NextResponse.json(
                { error: "Name, Email, Phone, and Address are required." },
                { status: 400 }
            );
        }

        await connectDB();

        const existingOrder: any = await CustomOrder.findOne({ shareableSlug: slug });
        if (!existingOrder) {
            return NextResponse.json({ error: "Proposal not found." }, { status: 404 });
        }

        if (existingOrder.status !== "proposed") {
            return NextResponse.json(
                { error: "This proposal has already been ordered or is no longer active." },
                { status: 400 }
            );
        }

        const normalizedEmail = clientEmail.trim().toLowerCase();
        const formattedBillPhone = formatBDPhoneForBill(clientPhone);
        const formattedUserPhone = formatBDPhoneForUser(clientPhone);

        // 1. Auto-create User account in DB if not exists
        let user: any = await User.findOne({ email: normalizedEmail });
        if (!user) {
            user = await User.create({
                name: clientName.trim(),
                email: normalizedEmail,
                phone: formattedUserPhone,
                role: "user",
            });
        } else if (formattedUserPhone && user.phone !== formattedUserPhone) {
            user.phone = formattedUserPhone;
            await user.save();
        }

        // 2. Resolve items & totals (auto-fill service title if offer had no items)
        const hasExistingItems = Array.isArray(existingOrder.items) && existingOrder.items.length > 0;
        const resolvedItems = hasExistingItems
            ? existingOrder.items.map((it: any) => ({
                  name: it.name,
                  description: it.description || "",
                  quantity: Number(it.quantity || 1),
                  price: Number(it.price || 0),
                  link: it.link || "",
              }))
            : [
                  {
                      name: existingOrder.title,
                      description: "",
                      quantity: 1,
                      price: Number(existingOrder.price || 0),
                      link: "",
                  },
              ];

        const subtotal = resolvedItems.reduce(
            (sum: number, it: any) => sum + Number(it.price || 0) * Number(it.quantity || 1),
            0
        );
        const serviceCharge = Number(existingOrder.serviceCharge || 0);
        const discount = Number(existingOrder.discount || 0);
        const computedTotal = Math.max(0, subtotal + serviceCharge - discount);
        const total = hasExistingItems
            ? computedTotal
            : Number(existingOrder.price ?? computedTotal);

        const cashIn = payNow ? Math.max(0, Number(paidAmount || 0)) : 0;
        const currentBillDue = Math.max(0, total - cashIn);
        const billStatus = currentBillDue <= 0 ? "Paid" : "Due";

        // 3. Generate sequential invoiceNo starting from 0000101
        const lastBill: any = await Bill.findOne({
            $or: [{ documentType: "bill" }, { documentType: { $exists: false } }],
        }).sort({ createdAt: -1 });
        let nextNum = 101;
        if (lastBill?.invoiceNo) {
            const match = lastBill.invoiceNo.match(/\d+/);
            if (match) nextNum = parseInt(match[0], 10) + 1;
        }
        const invoiceNo = String(nextNum).padStart(7, "0");

        const initialPayments =
            cashIn > 0
                ? [
                      {
                          amount: cashIn,
                          date: new Date(),
                          method: paymentMethod || "bKash",
                          note: transactionId
                              ? `TxID: ${transactionId}`
                              : senderNumber
                                ? `Sender: ${senderNumber}`
                                : paymentNote || "Proposal Online Payment",
                      },
                  ]
                : [];

        // 4. Auto-create Client Bill
        const newBill = await Bill.create({
            clientName: clientName.trim(),
            clientEmail: normalizedEmail,
            clientPhone: formattedBillPhone,
            clientAddress: clientAddress.trim(),
            businessName: (businessName || "").trim(),
            invoiceNo,
            items: resolvedItems,
            subtotal,
            serviceCharge,
            discountType: existingOrder.discountType || "fixed",
            discountValue: existingOrder.discountValue || 0,
            discount,
            total,
            prevDue: 0,
            gTotal: total,
            cashIn,
            currentBillDue,
            status: billStatus,
            currency: existingOrder.currency || "BDT",
            renewDate: existingOrder.renewDate || undefined,
            renewFee: existingOrder.renewPrice !== undefined ? Number(existingOrder.renewPrice) : 0,
            documentType: "bill",
            convertedFromCustomOrder: existingOrder._id,
            expectedDeliveryDate: existingOrder.dueDate
                ? new Date(existingOrder.dueDate).toISOString().split("T")[0]
                : undefined,
            payments: initialPayments,
        });

        // 5. Record double-entry ledger entries
        try {
            const ref = `INV-${invoiceNo}`;
            if (total > 0) {
                await recordLedgerEntry({
                    accountCode: "AR",
                    type: "debit",
                    amount: total,
                    description: `Client Receivable for Bill #${invoiceNo} (${clientName.trim()})`,
                    reference: ref,
                });
            }
            if (cashIn > 0) {
                const payAccCode = await resolvePaymentAccountCode(paymentMethod || "bKash");
                await recordLedgerEntry({
                    accountCode: payAccCode,
                    type: "debit",
                    amount: cashIn,
                    description: `Payment Received for Bill #${invoiceNo}`,
                    reference: ref,
                });
                await recordLedgerEntry({
                    accountCode: "AR",
                    type: "credit",
                    amount: cashIn,
                    description: `Payment credit for Bill #${invoiceNo}`,
                    reference: ref,
                });
            }
        } catch (ledgerErr) {
            console.error("Failed to log proposal bill in ledger:", ledgerErr);
        }

        // 6. Save Payment record if paid online
        if (cashIn > 0) {
            try {
                await Payment.create({
                    user: user._id,
                    clientName: clientName.trim(),
                    clientMobile: formattedUserPhone || clientPhone.trim(),
                    clientEmail: normalizedEmail,
                    amount: cashIn,
                    paymentMethod: paymentMethod || "bKash",
                    transactionId: transactionId || undefined,
                    senderNumber: senderNumber || undefined,
                    notes: `Proposal Order (${existingOrder.title}) - Bill #${invoiceNo}${paymentNote ? ` | ${paymentNote}` : ""}`,
                });
            } catch (payErr) {
                console.error("Failed to create Payment record from proposal:", payErr);
            }
        }

        // 7. Update CustomOrder (Offer) with client info, auto-filled items, status & convertedBillId
        existingOrder.status = "accepted";
        existingOrder.client = user._id;
        existingOrder.clientName = clientName.trim();
        existingOrder.clientEmail = normalizedEmail;
        existingOrder.clientPhone = formattedBillPhone;
        existingOrder.clientAddress = clientAddress.trim();
        existingOrder.businessName = (businessName || "").trim();
        if (!hasExistingItems) {
            existingOrder.items = resolvedItems;
        }
        existingOrder.convertedBillId = newBill._id;
        await existingOrder.save();

        // 8. Link or create Client profile
        try {
            const existingClient: any = await Client.findOne({ email: normalizedEmail });
            if (existingClient) {
                if (!existingClient.customOrders.some((id: any) => id.toString() === existingOrder._id.toString())) {
                    existingClient.customOrders.push(existingOrder._id);
                    await existingClient.save();
                }
            } else {
                const defaultRenewDate = new Date();
                defaultRenewDate.setFullYear(defaultRenewDate.getFullYear() + 1);
                await Client.create({
                    name: clientName.trim(),
                    email: [normalizedEmail],
                    phone: formattedUserPhone,
                    address: clientAddress.trim(),
                    clientImage: user.image || "https://res.cloudinary.com/dhdqebns9/image/upload/v1727027581/default-image.jpg",
                    service: existingOrder.title,
                    price: total,
                    renewDate: existingOrder.renewDate || defaultRenewDate,
                    customOrders: [existingOrder._id],
                });
            }
        } catch (clientErr) {
            console.error("Error linking Client profile from proposal order:", clientErr);
        }

        const populatedOrder = await CustomOrder.findById(existingOrder._id)
            .populate("admin", "name email image")
            .populate("client", "name email image")
            .lean();

        return NextResponse.json(
            {
                message: "Order confirmed and client bill created successfully!",
                order: populatedOrder,
                bill: newBill,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error ordering from proposal:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
