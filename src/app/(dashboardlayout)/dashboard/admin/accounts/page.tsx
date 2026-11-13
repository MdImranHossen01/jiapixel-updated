"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Loader2,
  Plus,
  RefreshCw,
  Landmark,
  Wallet,
  Smartphone,
  CreditCard,
  MoreHorizontal,
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowLeftRight,
  Edit,
  History,
  BookOpen,
  Trash2,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function AccountsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    liquidBalance: 0,
    bankBalance: 0,
    cashBalance: 0,
    mfsBalance: 0,
  });
  const [loading, setLoading] = useState(true);

  // Add/Edit Account Modal
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [accName, setAccName] = useState("");
  const [accCategory, setAccCategory] = useState<"Bank" | "MFS" | "Cash" | "Other">("Bank");
  const [accOpeningBalance, setAccOpeningBalance] = useState(0);
  const [accNumber, setAccNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [bankAccountType, setBankAccountType] = useState<"Savings" | "Current">("Current");
  const [mfsProvider, setMfsProvider] = useState("bKash");
  const [mfsType, setMfsType] = useState<"Merchant" | "Agent" | "Personal">("Personal");
  const [accDescription, setAccDescription] = useState("");
  const [savingAccount, setSavingAccount] = useState(false);

  // Credit / Debit Modal
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [entryAccount, setEntryAccount] = useState<any>(null);
  const [entryType, setEntryType] = useState<"debit" | "credit">("debit");
  const [entryAmount, setEntryAmount] = useState<number>(0);
  const [entryDescription, setEntryDescription] = useState("");
  const [entryReference, setEntryReference] = useState("");
  const [savingEntry, setSavingEntry] = useState(false);

  // Transfer Modal
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [transferAmount, setTransferAmount] = useState<number>(0);
  const [transferNote, setTransferNote] = useState("");
  const [savingTransfer, setSavingTransfer] = useState(false);

  // Transaction History Modal
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyAccount, setHistoryAccount] = useState<any>(null);
  const [historyTxs, setHistoryTxs] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historySearch, setHistorySearch] = useState("");

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/accounts");
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts || []);
        if (data.summary) setSummary(data.summary);
      } else {
        toast.error("Failed to fetch accounts");
      }
    } catch {
      toast.error("Error loading accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const openAddModal = () => {
    setEditingAccount(null);
    setAccName("");
    setAccCategory("Bank");
    setAccOpeningBalance(0);
    setAccNumber("");
    setBankName("");
    setBranchName("");
    setBankAccountType("Current");
    setMfsProvider("bKash");
    setMfsType("Personal");
    setAccDescription("");
    setAccountModalOpen(true);
  };

  const openEditModal = (acc: any) => {
    setEditingAccount(acc);
    setAccName(acc.name || "");
    setAccCategory(acc.category || "Bank");
    setAccOpeningBalance(Number(acc.openingBalance || 0));
    setAccNumber(acc.accountNumber || "");
    setBankName(acc.bankName || "");
    setBranchName(acc.branchName || "");
    setBankAccountType(acc.bankAccountType || "Current");
    setMfsProvider(acc.mfsProvider || "bKash");
    setMfsType(acc.mfsType || "Personal");
    setAccDescription(acc.description || "");
    setAccountModalOpen(true);
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accName.trim()) {
      toast.error("Account name is required");
      return;
    }
    setSavingAccount(true);
    try {
      const payload = {
        name: accName,
        category: accCategory,
        type: "asset",
        openingBalance: accOpeningBalance,
        accountNumber: accNumber,
        bankName,
        branchName,
        bankAccountType,
        mfsProvider,
        mfsType,
        description: accDescription,
      };
      const url = editingAccount
        ? `/api/admin/accounts/${editingAccount._id}`
        : "/api/admin/accounts";
      const method = editingAccount ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success(editingAccount ? "Account updated!" : "Account added!");
        setAccountModalOpen(false);
        fetchAccounts();
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to save account");
      }
    } catch {
      toast.error("Error saving account");
    } finally {
      setSavingAccount(false);
    }
  };

  const openEntryModal = (acc: any, mode: "add_money" | "expense") => {
    setEntryAccount(acc);
    // For asset accounts: Add Money = debit, Expense = credit
    // For liability accounts (AP): Add = credit, Pay = debit
    const ledgerType =
      acc.type === "asset"
        ? mode === "add_money"
          ? "debit"
          : "credit"
        : mode === "add_money"
          ? "credit"
          : "debit";
    setEntryType(ledgerType);
    setEntryAmount(0);
    setEntryDescription("");
    setEntryReference("");
    setEntryModalOpen(true);
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryAccount || entryAmount <= 0 || !entryDescription.trim()) {
      toast.error("Amount and description are required");
      return;
    }
    setSavingEntry(true);
    try {
      const res = await fetch("/api/admin/ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: entryAccount._id,
          type: entryType,
          amount: entryAmount,
          description: entryDescription,
          reference: entryReference,
        }),
      });
      if (res.ok) {
        toast.success("Transaction recorded!");
        setEntryModalOpen(false);
        fetchAccounts();
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to record transaction");
      }
    } catch {
      toast.error("Error recording transaction");
    } finally {
      setSavingEntry(false);
    }
  };

  const openTransferModal = (fromAcc: any) => {
    setFromAccountId(fromAcc._id);
    const other = accounts.find((a) => a._id !== fromAcc._id && a.type === "asset");
    setToAccountId(other ? other._id : "");
    setTransferAmount(0);
    setTransferNote("");
    setTransferModalOpen(true);
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromAccountId || !toAccountId || fromAccountId === toAccountId) {
      toast.error("Select different source and destination accounts");
      return;
    }
    if (transferAmount <= 0) {
      toast.error("Enter a valid transfer amount");
      return;
    }
    setSavingTransfer(true);
    try {
      const res = await fetch("/api/admin/accounts/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAccountId,
          toAccountId,
          amount: transferAmount,
          description: transferNote,
        }),
      });
      if (res.ok) {
        toast.success("Funds transferred!");
        setTransferModalOpen(false);
        fetchAccounts();
      } else {
        const err = await res.json();
        toast.error(err.message || "Transfer failed");
      }
    } catch {
      toast.error("Error transferring funds");
    } finally {
      setSavingTransfer(false);
    }
  };

  const openHistoryModal = async (acc: any) => {
    setHistoryAccount(acc);
    setHistorySearch("");
    setHistoryTxs([]);
    setHistoryOpen(true);
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/admin/ledger?accountId=${acc._id}`);
      if (res.ok) {
        const data = await res.json();
        setHistoryTxs(data.transactions || []);
      }
    } catch {
      toast.error("Failed to load transaction history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleDeleteAccount = async (acc: any) => {
    const confirm = await Swal.fire({
      title: `Delete ${acc.name}?`,
      text: "This will remove the account from your list.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, delete",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/accounts/${acc._id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Account deleted");
        fetchAccounts();
      } else {
        const err = await res.json();
        toast.error(err.message || "Cannot delete account");
      }
    } catch {
      toast.error("Error deleting account");
    }
  };

  const getTypeBadge = (acc: any) => {
    if (acc.code === "AP") return <Badge variant="destructive">Payable</Badge>;
    if (acc.code === "AR") return <Badge className="bg-amber-600 text-white">Receivable</Badge>;
    if (acc.category === "Bank") return <Badge className="bg-slate-800 text-white">Bank</Badge>;
    if (acc.category === "Cash") return <Badge className="bg-emerald-700 text-white">Cash</Badge>;
    if (acc.category === "MFS") return <Badge className="bg-sky-600 text-white">MFS</Badge>;
    return <Badge variant="secondary">{acc.category}</Badge>;
  };

  const getAccountIcon = (acc: any) => {
    if (acc.category === "Bank") return <Landmark className="w-4 h-4 text-indigo-600" />;
    if (acc.category === "Cash") return <Wallet className="w-4 h-4 text-emerald-600" />;
    if (acc.category === "MFS") return <Smartphone className="w-4 h-4 text-sky-600" />;
    if (acc.code === "AP") return <ArrowUpCircle className="w-4 h-4 text-rose-600" />;
    return <ArrowDownCircle className="w-4 h-4 text-amber-600" />;
  };

  const filteredHistoryTxs = historyTxs.filter((tx) => {
    if (!historySearch.trim()) return true;
    const q = historySearch.toLowerCase();
    return (
      (tx.description || "").toLowerCase().includes(q) ||
      (tx.reference || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bank, Cash &amp; MFS Accounts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time multi-account cashflow, bank ledgers, mobile wallets and internal fund transfers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openAddModal} className="gap-1.5">
            <Plus className="w-4 h-4" />
            Add Account
          </Button>
          <Button variant="outline" size="icon" onClick={fetchAccounts} title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Liquid Balance
              </p>
              <p className="text-2xl font-extrabold mt-1">
                ৳{Number(summary.liquidBalance || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/15 text-amber-600">
              <Landmark className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Bank Balance
              </p>
              <p className="text-2xl font-extrabold mt-1">
                ৳{Number(summary.bankBalance || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-600">
              <Landmark className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Cash in Hand
              </p>
              <p className="text-2xl font-extrabold mt-1">
                ৳{Number(summary.cashBalance || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600">
              <Wallet className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Mobile Wallets
              </p>
              <p className="text-2xl font-extrabold mt-1">
                ৳{Number(summary.mfsBalance || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-600">
              <Smartphone className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connected Accounts Table */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            All Connected Accounts
          </CardTitle>
          <Badge variant="outline">{accounts.length} Accounts</Badge>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-14 flex justify-center">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Details / Bank Info</TableHead>
                  <TableHead className="text-right">Opening Balance</TableHead>
                  <TableHead className="text-right">Current Live Balance</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((acc) => (
                  <TableRow key={acc._id}>
                    <TableCell>
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">{getAccountIcon(acc)}</div>
                        <div>
                          <div className="font-semibold">{acc.name}</div>
                          {acc.description && (
                            <div className="text-xs text-muted-foreground">{acc.description}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(acc)}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {acc.code}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {acc.category === "Bank" && acc.bankName ? (
                        <div>
                          <span className="font-medium text-foreground">{acc.bankName}</span>
                          {acc.accountNumber ? ` • ${acc.accountNumber}` : ""}
                        </div>
                      ) : acc.category === "MFS" && acc.mfsProvider ? (
                        <div>
                          <span className="font-medium text-foreground">{acc.mfsProvider}</span>
                          {acc.mfsType ? ` (${acc.mfsType})` : ""}
                          {acc.accountNumber ? ` • ${acc.accountNumber}` : ""}
                        </div>
                      ) : (
                        <span className="italic">Direct account</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ৳{Number(acc.openingBalance || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      ৳{Number(acc.currentBalance || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => openEntryModal(acc, "add_money")}
                            className="cursor-pointer text-emerald-600 font-medium"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Credit + (Add Money)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openEntryModal(acc, "expense")}
                            className="cursor-pointer text-rose-600 font-medium"
                          >
                            <ArrowDownCircle className="w-4 h-4 mr-2" />
                            Debit - (Expense)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openTransferModal(acc)}
                            className="cursor-pointer text-amber-600 font-medium"
                          >
                            <ArrowLeftRight className="w-4 h-4 mr-2" />
                            Transfer Funds
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openEditModal(acc)}
                            className="cursor-pointer"
                          >
                            <Edit className="w-4 h-4 mr-2 text-amber-600" />
                            Edit Account
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openHistoryModal(acc)}
                            className="cursor-pointer"
                          >
                            <History className="w-4 h-4 mr-2 text-indigo-600" />
                            Transaction History
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/admin/ledger?accountId=${acc._id}`)}
                            className="cursor-pointer"
                          >
                            <BookOpen className="w-4 h-4 mr-2" />
                            View in Full Ledger
                          </DropdownMenuItem>
                          {!acc.isSystem && !["CASH", "BANK", "AP", "AR"].includes(acc.code) && (
                            <DropdownMenuItem
                              onClick={() => handleDeleteAccount(acc)}
                              className="cursor-pointer text-rose-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Account
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Account Modal */}
      <Dialog open={accountModalOpen} onOpenChange={setAccountModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingAccount ? "Edit Account" : "Add New Account"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveAccount} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Account Name *</Label>
                <Input
                  placeholder="e.g., DBBL Main / bKash Merchant"
                  value={accName}
                  onChange={(e) => setAccName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={accCategory}
                  onValueChange={(v: any) => setAccCategory(v)}
                  disabled={!!editingAccount}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bank">Bank Account</SelectItem>
                    <SelectItem value="MFS">MFS (bKash / Nagad / Rocket)</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {accCategory === "Bank" && (
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/30 border">
                <div className="space-y-1.5">
                  <Label className="text-xs">Bank Name</Label>
                  <Input
                    placeholder="e.g., Dutch-Bangla Bank"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Branch Name</Label>
                  <Input
                    placeholder="e.g., Mirpur"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Account Number</Label>
                  <Input
                    placeholder="Account number"
                    value={accNumber}
                    onChange={(e) => setAccNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Account Type</Label>
                  <Select value={bankAccountType} onValueChange={(v: any) => setBankAccountType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Current">Current</SelectItem>
                      <SelectItem value="Savings">Savings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {accCategory === "MFS" && (
              <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-muted/30 border">
                <div className="space-y-1.5">
                  <Label className="text-xs">Provider</Label>
                  <Select value={mfsProvider} onValueChange={setMfsProvider}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bKash">bKash</SelectItem>
                      <SelectItem value="Nagad">Nagad</SelectItem>
                      <SelectItem value="Rocket">Rocket</SelectItem>
                      <SelectItem value="Upay">Upay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Wallet Type</Label>
                  <Select value={mfsType} onValueChange={(v: any) => setMfsType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Personal">Personal</SelectItem>
                      <SelectItem value="Merchant">Merchant</SelectItem>
                      <SelectItem value="Agent">Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Mobile Number</Label>
                  <Input
                    placeholder="01XXXXXXXXX"
                    value={accNumber}
                    onChange={(e) => setAccNumber(e.target.value)}
                  />
                </div>
              </div>
            )}

            {!editingAccount && (
              <div className="space-y-1.5">
                <Label>Opening Balance (৳)</Label>
                <Input
                  type="number"
                  min={0}
                  value={accOpeningBalance}
                  onChange={(e) => setAccOpeningBalance(Math.max(0, Number(e.target.value)))}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Description (Optional)</Label>
              <Input
                placeholder="Short note about this account"
                value={accDescription}
                onChange={(e) => setAccDescription(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAccountModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={savingAccount}>
                {savingAccount && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingAccount ? "Update Account" : "Create Account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Credit / Debit Entry Modal */}
      <Dialog open={entryModalOpen} onOpenChange={setEntryModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {entryType === "debit" ? "Credit + (Add Money)" : "Debit - (Expense)"} —{" "}
              {entryAccount?.name}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEntry} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Amount (৳) *</Label>
              <Input
                type="number"
                min={1}
                value={entryAmount}
                onChange={(e) => setEntryAmount(Math.max(0, Number(e.target.value)))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description *</Label>
              <Input
                placeholder="e.g., Client deposit / Server renewal cost"
                value={entryDescription}
                onChange={(e) => setEntryDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Reference (Optional)</Label>
              <Input
                placeholder="e.g., INV-0000105"
                value={entryReference}
                onChange={(e) => setEntryReference(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEntryModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={savingEntry}>
                {savingEntry && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Entry
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Transfer Funds Modal */}
      <Dialog open={transferModalOpen} onOpenChange={setTransferModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Internal Fund Transfer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleTransferSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>From Account</Label>
              <Select value={fromAccountId} onValueChange={setFromAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a._id} value={a._id}>
                      {a.name} (৳{Number(a.currentBalance || 0).toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>To Account</Label>
              <Select value={toAccountId} onValueChange={setToAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts
                    .filter((a) => a._id !== fromAccountId)
                    .map((a) => (
                      <SelectItem key={a._id} value={a._id}>
                        {a.name} (৳{Number(a.currentBalance || 0).toLocaleString()})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Amount (৳) *</Label>
              <Input
                type="number"
                min={1}
                value={transferAmount}
                onChange={(e) => setTransferAmount(Math.max(0, Number(e.target.value)))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Note (Optional)</Label>
              <Input
                placeholder="e.g., Cash deposit to bank"
                value={transferNote}
                onChange={(e) => setTransferNote(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setTransferModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={savingTransfer}>
                {savingTransfer && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Transfer Funds
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Transaction History Modal */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[88vh] flex flex-col">
          <DialogHeader>
            <div className="flex flex-wrap items-center justify-between gap-2 pr-6">
              <div>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <History className="w-5 h-5 text-primary" />
                  {historyAccount?.name} — Transaction History
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Account Code: <strong>{historyAccount?.code}</strong> • Type:{" "}
                  <strong>{historyAccount?.category}</strong>
                </p>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase text-muted-foreground">Live Balance</div>
                <div className="text-xl font-extrabold text-primary">
                  ৳{Number(historyAccount?.currentBalance || 0).toLocaleString()}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-wrap items-center gap-2 py-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search this account's transactions / ref..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setHistoryOpen(false);
                router.push(`/dashboard/admin/ledger?accountId=${historyAccount?._id}`);
              }}
              className="gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              Open Full Ledger
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto border rounded-lg">
            {historyLoading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : filteredHistoryTxs.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No transactions recorded for this account.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead className="text-right">Running Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistoryTxs.map((tx) => (
                    <TableRow key={tx._id}>
                      <TableCell className="text-xs whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">{tx.description}</div>
                        {tx.reference && (
                          <Badge variant="outline" className="text-[10px] mt-0.5 font-mono">
                            Ref: {tx.reference}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-amber-600">
                        {tx.type === "debit" ? `৳${Number(tx.amount).toLocaleString()}` : "—"}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-emerald-600">
                        {tx.type === "credit" ? `৳${Number(tx.amount).toLocaleString()}` : "—"}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        ৳{Number(tx.balanceAfter || 0).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <DialogFooter className="flex justify-between sm:justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              Total {filteredHistoryTxs.length} transactions recorded
            </span>
            <Button type="button" variant="outline" onClick={() => setHistoryOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

