import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Bill from "@/models/Bill";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";

const formatBDPhoneForBill = (phone: string): string => {
  const clean = phone.replace(/[^\d]/g, "");
  if (clean.length === 11 && clean.startsWith("0")) {
    return `88${clean}`;
  }
  if (clean.length === 10 && clean.startsWith("1")) {
    return `880${clean}`;
  }
  return clean;
};

const formatBDPhoneForUser = (phone: string): string => {
  const clean = phone.replace(/[^\d]/g, "");
  if (clean.length === 13 && clean.startsWith("880")) {
    return clean.slice(2);
  }
  if (clean.length === 11 && clean.startsWith("0")) {
    return clean;
  }
  if (clean.length === 10 && clean.startsWith("1")) {
    return `0${clean}`;
  }
  return clean;
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const bill = await Bill.findById(id);
    if (!bill) {
      return NextResponse.json({ message: "Bill not found" }, { status: 404 });
    }

    return NextResponse.json(bill);
  } catch (error: any) {
    console.error("Error fetching bill:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    await dbConnect();

    const bill = await Bill.findById(id);
    if (!bill) {
      return NextResponse.json({ message: "Bill not found" }, { status: 404 });
    }

    const {
      clientName,
      clientEmail,
      clientPhone,
      clientAddress,
      businessName,
      items,
      subtotal,
      serviceCharge,
      discountType,
      discountValue,
      discount,
      total,
      prevDue,
      gTotal,
      cashIn,
      currentBillDue,
      status,
      renewDate,
      renewFee,
      currency,
      adminNote,
    } = body;

    if (clientName !== undefined) bill.clientName = clientName;
    if (clientEmail !== undefined) bill.clientEmail = clientEmail;
    if (clientPhone !== undefined) bill.clientPhone = formatBDPhoneForBill(clientPhone);
    if (clientAddress !== undefined) bill.clientAddress = clientAddress;
    if (businessName !== undefined) bill.businessName = businessName;
    if (items !== undefined) bill.items = items;
    if (subtotal !== undefined) bill.subtotal = subtotal;
    if (serviceCharge !== undefined) bill.serviceCharge = serviceCharge;
    if (discountType !== undefined) bill.discountType = discountType;
    if (discountValue !== undefined) bill.discountValue = discountValue;
    if (discount !== undefined) bill.discount = discount;
    if (total !== undefined) bill.total = total;
    if (prevDue !== undefined) bill.prevDue = prevDue;
    if (gTotal !== undefined) bill.gTotal = gTotal;
    if (cashIn !== undefined) bill.cashIn = cashIn;
    if (currentBillDue !== undefined) bill.currentBillDue = currentBillDue;
    if (status !== undefined) bill.status = status;
    if (currency !== undefined) bill.currency = currency;
    if (renewDate !== undefined) bill.renewDate = renewDate ? new Date(renewDate) : undefined;
    if (renewFee !== undefined) bill.renewFee = Number(renewFee);
    if (adminNote !== undefined) bill.adminNote = adminNote;

    if (status === "Paid") {
      bill.currentBillDue = 0;
      bill.cashIn = bill.gTotal;
    }

    if (bill.clientEmail) {
      const formattedUserPhone = bill.clientPhone ? formatBDPhoneForUser(bill.clientPhone) : undefined;
      const userExists = await User.findOne({ email: bill.clientEmail });
      if (!userExists) {
        await User.create({
          name: bill.clientName,
          email: bill.clientEmail,
          phone: formattedUserPhone,
          role: "user",
        });
      } else {
        if (formattedUserPhone && userExists.phone !== formattedUserPhone) {
          userExists.phone = formattedUserPhone;
          await userExists.save();
        }
      }
    }

    await bill.save();
    return NextResponse.json(bill);
  } catch (error: any) {
    console.error("Error updating bill:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const bill = await Bill.findByIdAndDelete(id);
    if (!bill) {
      return NextResponse.json({ message: "Bill not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Bill deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting bill:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
