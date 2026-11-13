import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Bill from "@/models/Bill";
import CustomOrder from "@/models/CustomOrder";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import { recordLedgerEntry, resolvePaymentAccountCode } from "@/lib/ledger-utils";

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
    const type = searchParams.get("type") || "bill"; // 'bill' | 'chalan'
    const search = searchParams.get("search") || "";

    let query: any = {};
    if (type === "chalan") {
      query.documentType = "chalan";
    } else {
      query.$or = [{ documentType: "bill" }, { documentType: { $exists: false } }];
    }

    if (filter === "paid") {
      query.status = "Paid";
    } else if (filter === "due") {
      query.status = "Due";
    } else if (filter === "fraud") {
      query.status = "Fraud";
    }

    if (search) {
      const searchOr = [
        { clientName: { $regex: search, $options: "i" } },
        { clientEmail: { $regex: search, $options: "i" } },
        { clientPhone: { $regex: search, $options: "i" } },
        { invoiceNo: { $regex: search, $options: "i" } },
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchOr }];
        delete query.$or;
      } else {
        query.$or = searchOr;
      }
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
      documentType,
      convertedFromCustomOrder,
      expectedDeliveryDate,
      expectedReceivableDate,
      termsAndConditions,
      vatTaxIncluded,
      paymentMethod,
    } = body;

    const docType = documentType === "chalan" ? "chalan" : "bill";

    if (!clientName || (!clientEmail && docType === "bill") || !clientPhone || !clientAddress || !items || items.length === 0) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const formattedBillPhone = formatBDPhoneForBill(clientPhone);
    const formattedUserPhone = formatBDPhoneForUser(clientPhone);

    // Ensure user exists in database when clientEmail is present
    if (clientEmail) {
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
    }

    // Generate unique sequential invoice/chalan number starting from 0000101
    let lastBill: any = null;
    if (docType === "chalan") {
      lastBill = await Bill.findOne({ documentType: "chalan" }).sort({ createdAt: -1 });
    } else {
      lastBill = await Bill.findOne({
        $or: [{ documentType: "bill" }, { documentType: { $exists: false } }],
      }).sort({ createdAt: -1 });
    }

    let nextNum = 101;
    if (lastBill && lastBill.invoiceNo) {
      const match = lastBill.invoiceNo.match(/\d+/);
      if (match) {
        nextNum = parseInt(match[0], 10) + 1;
      }
    }
    const invoiceNo = docType === "chalan" ? `CH-${String(nextNum).padStart(7, "0")}` : String(nextNum).padStart(7, "0");

    const initialCashIn = Number(cashIn || 0);
    const initialPayments =
      docType === "bill" && initialCashIn > 0
        ? [
            {
              amount: initialCashIn,
              date: new Date(),
              method: paymentMethod || "Cash",
              note: "Initial Payment",
            },
          ]
        : [];

    const newBill = new Bill({
      clientName,
      clientEmail: clientEmail || "",
      clientPhone: formattedBillPhone,
      clientAddress,
      businessName,
      invoiceNo,
      items,
      subtotal: subtotal ?? 0,
      serviceCharge: serviceCharge ?? 0,
      discountType: discountType || "fixed",
      discountValue: discountValue ?? 0,
      discount: discount ?? 0,
      total: total ?? 0,
      prevDue: prevDue ?? 0,
      gTotal: gTotal ?? 0,
      cashIn: initialCashIn,
      currentBillDue: currentBillDue ?? 0,
      status: status || (docType === "chalan" ? "Paid" : "Due"),
      currency: currency || "BDT",
      renewDate: renewDate ? new Date(renewDate) : undefined,
      renewFee: renewFee !== undefined ? Number(renewFee) : 0,
      adminNote: adminNote || "",
      documentType: docType,
      convertedFromCustomOrder: convertedFromCustomOrder || undefined,
      expectedDeliveryDate: expectedDeliveryDate || undefined,
      expectedReceivableDate: expectedReceivableDate ? new Date(expectedReceivableDate) : undefined,
      termsAndConditions: termsAndConditions || undefined,
      vatTaxIncluded: vatTaxIncluded !== undefined ? vatTaxIncluded : true,
      payments: initialPayments,
    });

    await newBill.save();

    if (docType === "bill") {
      try {
        const ref = `INV-${invoiceNo}`;
        const grand = Number(newBill.gTotal || 0);
        if (grand > 0) {
          await recordLedgerEntry({
            accountCode: "AR",
            type: "debit",
            amount: grand,
            description: `Client Receivable for Bill #${invoiceNo} (${clientName})`,
            reference: ref,
          });
        }
        if (initialCashIn > 0) {
          const payAccCode = await resolvePaymentAccountCode(paymentMethod);
          await recordLedgerEntry({
            accountCode: payAccCode,
            type: "debit",
            amount: initialCashIn,
            description: `Payment Received for Bill #${invoiceNo}`,
            reference: ref,
          });
          await recordLedgerEntry({
            accountCode: "AR",
            type: "credit",
            amount: initialCashIn,
            description: `Payment credit for Bill #${invoiceNo}`,
            reference: ref,
          });
        }
      } catch (ledgerErr) {
        console.error("Failed to log bill in ledger:", ledgerErr);
      }
    }

    if (convertedFromCustomOrder) {
      await CustomOrder.findByIdAndUpdate(convertedFromCustomOrder, {
        $set: { convertedBillId: newBill._id },
      }).catch(() => {});
    }

    return NextResponse.json(newBill, { status: 201 });
  } catch (error: any) {
    console.error("Error creating bill:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
