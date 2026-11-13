import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/db";
import LedgerAccount from "@/models/LedgerAccount";

export async function PUT(
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
    await dbConnect();

    const account = await LedgerAccount.findById(id);
    if (!account) {
      return NextResponse.json({ message: "Account not found" }, { status: 404 });
    }

    const editableFields = [
      "name",
      "accountNumber",
      "bankName",
      "branchName",
      "bankAccountType",
      "mfsProvider",
      "mfsType",
      "description",
    ];
    for (const f of editableFields) {
      if (body[f] !== undefined) {
        (account as any)[f] = body[f];
      }
    }

    await account.save();
    return NextResponse.json({ account });
  } catch (error: any) {
    console.error("Error updating ledger account:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
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

    const account = await LedgerAccount.findById(id);
    if (!account) {
      return NextResponse.json({ message: "Account not found" }, { status: 404 });
    }
    if (account.isSystem || ["CASH", "BANK", "AP", "AR"].includes(account.code)) {
      return NextResponse.json({ message: "Default system accounts cannot be deleted" }, { status: 400 });
    }

    await LedgerAccount.findByIdAndDelete(id);
    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting ledger account:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

