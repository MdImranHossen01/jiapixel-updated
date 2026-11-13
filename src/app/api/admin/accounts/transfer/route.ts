import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/db";
import LedgerAccount from "@/models/LedgerAccount";
import { recordLedgerEntry } from "@/lib/ledger-utils";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { fromAccountId, toAccountId, amount, description, date } = await req.json();
    const numAmount = Number(amount || 0);

    if (!fromAccountId || !toAccountId || fromAccountId === toAccountId) {
      return NextResponse.json({ message: "Select two different accounts" }, { status: 400 });
    }
    if (numAmount <= 0) {
      return NextResponse.json({ message: "Transfer amount must be greater than 0" }, { status: 400 });
    }

    await dbConnect();

    const fromAcc = await LedgerAccount.findById(fromAccountId);
    const toAcc = await LedgerAccount.findById(toAccountId);
    if (!fromAcc || !toAcc) {
      return NextResponse.json({ message: "One or both accounts not found" }, { status: 404 });
    }

    const ref = `TRF-${Date.now().toString().slice(-6)}`;
    const note = description?.trim() ? ` (${description.trim()})` : "";

    await recordLedgerEntry({
      accountId: String(fromAcc._id),
      type: "credit",
      amount: numAmount,
      description: `Fund transfer to ${toAcc.name}${note}`,
      reference: ref,
      date,
    });

    await recordLedgerEntry({
      accountId: String(toAcc._id),
      type: "debit",
      amount: numAmount,
      description: `Fund transfer from ${fromAcc.name}${note}`,
      reference: ref,
      date,
    });

    return NextResponse.json({ message: "Transfer completed successfully", reference: ref });
  } catch (error: any) {
    console.error("Error transferring funds:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

