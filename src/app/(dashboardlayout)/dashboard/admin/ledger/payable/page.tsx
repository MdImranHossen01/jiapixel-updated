import AccountLedgerDetailView from "@/components/admin/AccountLedgerDetailView";

export default function AccountPayablePage() {
  return (
    <AccountLedgerDetailView
      accountCode="AP"
      title="Accounts Payable"
      accentColorClass="text-rose-600"
    />
  );
}

