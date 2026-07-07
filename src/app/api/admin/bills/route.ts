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

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // 'all', 'paid', 'due'
    const search = searchParams.get("search") || "";

    let query: any = {};
    if (filter === "paid") {
      query.status = "Paid";
    } else if (filter === "due") {
      query.status = "Due";
    }

    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: "i" } },
        { clientEmail: { $regex: search, $options: "i" } },
        { clientPhone: { $regex: search, $options: "i" } },
        { invoiceNo: { $regex: search, $options: "i" } },
      ];
    }

    const bills = await Bill.find(query).sort({ createdAt: -1 });
    return NextResponse.json(bills);
  } catch (error: any) {
    console.error("Error fetching bills:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const body = await req.json();
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

    if (!clientName || !clientEmail || !clientPhone || !clientAddress || !items || items.length === 0) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const formattedBillPhone = formatBDPhoneForBill(clientPhone);
    const formattedUserPhone = formatBDPhoneForUser(clientPhone);

    // Ensure user exists in database
    const userExists = await User.findOne({ email: clientEmail });
    if (!userExists) {
      await User.create({
        name: clientName,
        email: clientEmail,
        phone: formattedUserPhone,
        role: "user",
      });
    } else {
      if (userExists.phone !== formattedUserPhone) {
        userExists.phone = formattedUserPhone;
        await userExists.save();
      }
    }

    // Generate unique sequential invoice number starting from 0000101
    const lastBill = await Bill.findOne().sort({ createdAt: -1 });
    let nextNum = 101;
    if (lastBill && lastBill.invoiceNo) {
      const match = lastBill.invoiceNo.match(/\d+/);
      if (match) {
        nextNum = parseInt(match[0], 10) + 1;
      }
    }
    const invoiceNo = String(nextNum).padStart(7, "0");

    const newBill = new Bill({
      clientName,
      clientEmail,
      clientPhone: formattedBillPhone,
      clientAddress,
      businessName,
      invoiceNo,
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
      currency: currency || "BDT",
      renewDate: renewDate ? new Date(renewDate) : undefined,
      renewFee: renewFee !== undefined ? Number(renewFee) : 0,
      adminNote,
    });

    await newBill.save();
    return NextResponse.json(newBill, { status: 201 });
  } catch (error: any) {
    console.error("Error creating bill:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
