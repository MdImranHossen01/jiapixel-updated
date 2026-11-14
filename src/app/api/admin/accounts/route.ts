import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/db";
import LedgerAccount, { ACCOUNT_CURRENCIES } from "@/models/LedgerAccount";
import LedgerTransaction from "@/models/LedgerTransaction";
import { ensureDefaultLedgerAccounts } from "@/lib/ledger-utils";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await dbConnect();
    await ensureDefaultLedgerAccounts();

    const accounts = await LedgerAccount.find().sort({ isSystem: -1, createdAt: 1 }).lean();

    const bankBalance = accounts
      .filter((a: any) => a.category === "Bank")
      .reduce((s: number, a: any) => s + Number(a.currentBalance || 0), 0);
    const cashBalance = accounts
      .filter((a: any) => a.category === "Cash")
      .reduce((s: number, a: any) => s + Number(a.currentBalance || 0), 0);
    const mfsBalance = accounts
      .filter((a: any) => a.category === "MFS")
      .reduce((s: number, a: any) => s + Number(a.currentBalance || 0), 0);

    return NextResponse.json({
      accounts,
      summary: {
        liquidBalance: bankBalance + cashBalance + mfsBalance,
        bankBalance,
        cashBalance,
        mfsBalance,
      },
    });
  } catch (error: any) {
    console.error("Error fetching ledger accounts:", error);
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
      name,
      code,
      category = "Bank",
      currency = "BDT",
      type = "asset",
      openingBalance = 0,
      accountNumber,
      bankName,
      branchName,
      bankAccountType,
      mfsProvider,
      mfsType,
      description,
    } = body;

    if (!name || !String(name).trim()) {
      return NextResponse.json({ message: "Account name is required" }, { status: 400 });
    }

    if (category === "Cash") {
      return NextResponse.json(
        { message: "Only one default Cash account is allowed." },
        { status: 400 }
      );
    }

    const cleanCurrency = (ACCOUNT_CURRENCIES as readonly string[]).includes(currency)
      ? currency
      : "BDT";

    await dbConnect();
    await ensureDefaultLedgerAccounts();

    const cleanCode = (
      code?.trim() ||
      `${category.toUpperCase()}_${String(name)
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "_")
        .slice(0, 12)}_${Date.now().toString().slice(-4)}`
    ).toUpperCase();

    const existing = await LedgerAccount.findOne({ code: cleanCode });
    if (existing) {
      return NextResponse.json({ message: `Account code ${cleanCode} already exists` }, { status: 400 });
    }

    const opening = Number(openingBalance || 0);
    const account = await LedgerAccount.create({
      name: String(name).trim(),
      code: cleanCode,
      category,
      currency: cleanCurrency,
      type,
      openingBalance: opening,
      currentBalance: opening,
      accountNumber,
      bankName,
      branchName,
      bankAccountType: category === "Bank" ? bankAccountType : undefined,
      mfsProvider: category === "MFS" ? mfsProvider : undefined,
      mfsType: category === "MFS" ? mfsType : undefined,
      description,
      isSystem: false,
    });

    if (opening > 0) {
      await LedgerTransaction.create({
        account: account._id,
        date: new Date(),
        description: `Opening Balance for ${account.name}`,
        type: account.type === "asset" ? "debit" : "credit",
        amount: opening,
        reference: `OPEN-${cleanCode}`,
        balanceAfter: opening,
      });
    }

    return NextResponse.json({ account }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating ledger account:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

