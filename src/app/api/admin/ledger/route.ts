import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/db";
import LedgerAccount from "@/models/LedgerAccount";
import LedgerTransaction from "@/models/LedgerTransaction";
import { ensureDefaultLedgerAccounts, recordLedgerEntry } from "@/lib/ledger-utils";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await dbConnect();
    await ensureDefaultLedgerAccounts();

    const { searchParams } = new URL(req.url);
    const accountCode = searchParams.get("accountCode");
    const accountId = searchParams.get("accountId");
    const txType = searchParams.get("type");
    const search = searchParams.get("search")?.trim() || "";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const accounts = await LedgerAccount.find().sort({ isSystem: -1, createdAt: 1 }).lean();

    let targetAccount: any = null;
    const query: any = {};

    if (accountId && accountId !== "all") {
      targetAccount = accounts.find((a: any) => a._id.toString() === accountId) || null;
      query.account = accountId;
    } else if (accountCode && accountCode !== "all") {
      targetAccount = accounts.find((a: any) => a.code === accountCode.toUpperCase()) || null;
      if (targetAccount) {
        query.account = targetAccount._id;
      }
    }

    if (txType && txType !== "all") {
      query.type = txType;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    if (search) {
      query.$or = [
        { description: { $regex: search, $options: "i" } },
        { reference: { $regex: search, $options: "i" } },
      ];
    }

    const transactions = await LedgerTransaction.find(query)
      .populate("account", "name code category type")
      .sort({ date: -1, _id: -1 })
      .limit(500)
      .lean();

    return NextResponse.json({
      accounts,
      account: targetAccount,
      transactions,
    });
  } catch (error: any) {
    console.error("Error fetching ledger transactions:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { accountId, accountCode, type, amount, description, reference, date } = await req.json();

    if (!type || !["debit", "credit"].includes(type)) {
      return NextResponse.json({ message: "Valid type (debit/credit) is required" }, { status: 400 });
    }
    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ message: "Amount must be greater than 0" }, { status: 400 });
    }
    if (!description || !String(description).trim()) {
      return NextResponse.json({ message: "Description is required" }, { status: 400 });
    }

    await dbConnect();

    const result = await recordLedgerEntry({
      accountId,
      accountCode,
      type,
      amount: Number(amount),
      description: String(description).trim(),
      reference,
      date,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error recording ledger entry:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

