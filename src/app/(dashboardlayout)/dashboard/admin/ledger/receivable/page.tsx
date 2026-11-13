import AccountLedgerDetailView from "@/components/admin/AccountLedgerDetailView";

export default function AccountReceivablePage() {
  return (
    <AccountLedgerDetailView
      accountCode="AR"
      title="Accounts Receivable"
      accentColorClass="text-emerald-600"
    />
  );
}

