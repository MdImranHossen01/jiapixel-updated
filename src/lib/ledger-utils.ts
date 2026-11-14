import LedgerAccount from "@/models/LedgerAccount";
import LedgerTransaction from "@/models/LedgerTransaction";

const DEFAULT_ACCOUNTS = [
  {
    name: "Cash in Hand",
    code: "CASH",
    type: "asset" as const,
    category: "Cash" as const,
    description: "Default System Primary Cash Account",
    isSystem: true,
  },
  {
    name: "Accounts Payable",
    code: "AP",
    type: "liability" as const,
    category: "Other" as const,
    description: "Supplier & Vendor Payables",
    isSystem: true,
  },
  {
    name: "Accounts Receivable",
    code: "AR",
    type: "asset" as const,
    category: "Other" as const,
    description: "Client Bills & Order Receivables",
    isSystem: true,
  },
];

export async function ensureDefaultLedgerAccounts() {
  await LedgerAccount.deleteOne({
    code: "BANK",
    isSystem: true,
    openingBalance: 0,
    currentBalance: 0,
  });
  for (const acc of DEFAULT_ACCOUNTS) {
    await LedgerAccount.findOneAndUpdate(
      { code: acc.code },
      { $setOnInsert: { ...acc, openingBalance: 0, currentBalance: 0 } },
      { upsert: true, new: true }
    );
  }
}

export async function recordLedgerEntry(params: {
  accountId?: string;
  accountCode?: string;
  type: "debit" | "credit";
  amount: number;
  description: string;
  reference?: string;
  date?: Date | string;
}) {
  const { accountId, accountCode, type, amount, description, reference, date } = params;
  const numAmount = Number(amount || 0);
  if (numAmount <= 0) return null;

  await ensureDefaultLedgerAccounts();

  const account = accountId
    ? await LedgerAccount.findById(accountId)
    : await LedgerAccount.findOne({ code: (accountCode || "CASH").toUpperCase() });

  if (!account) {
    throw new Error(`Ledger account not found: ${accountId || accountCode}`);
  }

  // Standard accounting:
  // Asset accounts increase on debit, decrease on credit.
  // Liability accounts (e.g. AP) increase on credit, decrease on debit.
  const delta =
    account.type === "asset"
      ? type === "debit"
        ? numAmount
        : -numAmount
      : type === "credit"
        ? numAmount
        : -numAmount;

  const updated = await LedgerAccount.findByIdAndUpdate(
    account._id,
    { $inc: { currentBalance: delta } },
    { new: true }
  );

  const tx = await LedgerTransaction.create({
    account: account._id,
    date: date ? new Date(date) : new Date(),
    description,
    type,
    amount: numAmount,
    reference: reference || undefined,
    balanceAfter: updated ? updated.currentBalance : account.currentBalance + delta,
  });

  return { account: updated, transaction: tx };
}

export async function resolvePaymentAccountCode(method?: string): Promise<string> {
  const m = (method || "").toLowerCase();
  if (m.includes("bank") || m.includes("card")) {
    const bankAcc = await LedgerAccount.findOne({ category: "Bank" }).sort({ createdAt: 1 });
    if (bankAcc) return bankAcc.code;
  }
  if (m.includes("bkash") || m.includes("nagad") || m.includes("rocket") || m.includes("mfs")) {
    const mfsAcc = await LedgerAccount.findOne({ category: "MFS" }).sort({ createdAt: 1 });
    if (mfsAcc) return mfsAcc.code;
  }
  return "CASH";
}

