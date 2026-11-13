import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Bill from "@/models/Bill";
import { getToken } from "next-auth/jwt";
import { recordLedgerEntry, resolvePaymentAccountCode } from "@/lib/ledger-utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const bill: any = await Bill.findById(id).lean();
    if (!bill) {
      return NextResponse.json({ message: "Bill not found" }, { status: 404 });
    }

    const rawPayments = Array.isArray(bill.payments) ? bill.payments : [];
    const grandTotal = Number(bill.gTotal || bill.total || 0);

    let runningPaid = 0;
    const installments = rawPayments.map((p: any, idx: number) => {
      const amt = Number(p.amount || 0);
      runningPaid += amt;
      const remainingDueAfter = Math.max(0, grandTotal - runningPaid);
      return {
        installmentNo: idx + 1,
        txId: p._id?.toString() || `${bill._id}-${idx}`,
        date: p.date || bill.date || bill.createdAt,
        amount: amt,
        method: p.method || "Cash",
        description: p.note || `Payment Received for Bill ${bill.invoiceNo}`,
        cumulativePaid: runningPaid,
        remainingDueAfter,
      };
    });

    // Legacy bill fallback when cashIn > 0 but payments array is empty
    if (installments.length === 0 && Number(bill.cashIn || 0) > 0) {
      const cash = Number(bill.cashIn || 0);
      installments.push({
        installmentNo: 1,
        txId: bill._id.toString(),
        date: bill.date || bill.createdAt,
        amount: cash,
        method: "Cash",
        description: `Payment Received for Bill ${bill.invoiceNo}`,
        cumulativePaid: cash,
        remainingDueAfter: Math.max(0, grandTotal - cash),
      });
    }

    // Latest first
    installments.reverse();

    return NextResponse.json({
      bill,
      installments,
    });
  } catch (error: any) {
    console.error("Error fetching bill transaction history:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const amount = Number(body.amount || 0);
    const method = body.method || "Cash";
    const note = body.note || "";
    const date = body.date ? new Date(body.date) : new Date();

    if (amount <= 0) {
      return NextResponse.json(
        { message: "Payment amount must be greater than 0" },
        { status: 400 }
      );
    }

    await dbConnect();
    const bill: any = await Bill.findById(id);
    if (!bill) {
      return NextResponse.json({ message: "Bill not found" }, { status: 404 });
    }

    if (!Array.isArray(bill.payments)) {
      bill.payments = [];
    }

    // Preserve legacy cashIn if payments array was empty
    if (bill.payments.length === 0 && Number(bill.cashIn || 0) > 0) {
      bill.payments.push({
        amount: Number(bill.cashIn),
        date: bill.date || bill.createdAt || new Date(),
        method: "Cash",
        note: "Initial Payment",
      });
    }

    bill.payments.push({
      amount,
      date,
      method,
      note: note || `Payment Received for Bill ${bill.invoiceNo}`,
    });

    const newCashIn = Number(bill.cashIn || 0) + amount;
    const grandTotal = Number(bill.gTotal || bill.total || 0);
    const newDue = Math.max(0, grandTotal - newCashIn);

    bill.cashIn = newCashIn;
    bill.currentBillDue = newDue;
    if (bill.status !== "Fraud") {
      bill.status = newDue <= 0 ? "Paid" : "Due";
    }

    await bill.save();

    try {
      const ref = `INV-${bill.invoiceNo}`;
      const payAccCode = await resolvePaymentAccountCode(method);
      await recordLedgerEntry({
        accountCode: payAccCode,
        type: "debit",
        amount,
        description: note || `Payment Received for Bill #${bill.invoiceNo}`,
        reference: ref,
        date,
      });
      await recordLedgerEntry({
        accountCode: "AR",
        type: "credit",
        amount,
        description: `Payment credit for Bill #${bill.invoiceNo}`,
        reference: ref,
        date,
      });
    } catch (ledgerErr) {
      console.error("Failed to record ledger payment entry:", ledgerErr);
    }

    return NextResponse.json({
      message: "Payment recorded successfully",
      bill,
    });
  } catch (error: any) {
    console.error("Error recording payment:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

