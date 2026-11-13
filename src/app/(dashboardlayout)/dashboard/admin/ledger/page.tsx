"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { BookOpen, Loader2, Plus, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

function LedgerContent() {
  const searchParams = useSearchParams();
  const initialAccId = searchParams?.get("accountId") || "all";

  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [accountFilter, setAccountFilter] = useState(initialAccId);
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Manual entry modal
  const [entryOpen, setEntryOpen] = useState(false);
  const [entryAccountId, setEntryAccountId] = useState("");
  const [entryType, setEntryType] = useState<"debit" | "credit">("debit");
  const [entryAmount, setEntryAmount] = useState(0);
  const [entryDescription, setEntryDescription] = useState("");
  const [entryReference, setEntryReference] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchLedger = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (accountFilter && accountFilter !== "all") params.set("accountId", accountFilter);
      if (typeFilter && typeFilter !== "all") params.set("type", typeFilter);
      if (search.trim()) params.set("search", search.trim());
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);

      const res = await fetch(`/api/admin/ledger?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts || []);
        setTransactions(data.transactions || []);
        if (!entryAccountId && data.accounts?.length > 0) {
          setEntryAccountId(data.accounts[0]._id);
        }
      } else {
        toast.error("Failed to fetch ledger");
      }
    } catch {
      toast.error("Error loading ledger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, [accountFilter, typeFilter, startDate, endDate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLedger();
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryAccountId || entryAmount <= 0 || !entryDescription.trim()) {
      toast.error("Account, amount, and description are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: entryAccountId,
          type: entryType,
          amount: entryAmount,
          description: entryDescription,
          reference: entryReference,
        }),
      });
      if (res.ok) {
        toast.success("Ledger entry added!");
        setEntryOpen(false);
        setEntryAmount(0);
        setEntryDescription("");
        setEntryReference("");
        fetchLedger();
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to add entry");
      }
    } catch {
      toast.error("Error adding entry");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-primary" />
            Accounts Ledger
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and review transaction journal entries across all accounts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setEntryOpen(true)} className="gap-1.5">
            <Plus className="w-4 h-4" />
            Add Journal Entry
          </Button>
          <Button variant="outline" size="icon" onClick={fetchLedger} title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-base font-bold">Transaction Journal</CardTitle>
            <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-2">
              <Select value={accountFilter} onValueChange={setAccountFilter}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="All Accounts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  {accounts.map((a) => (
                    <SelectItem key={a._id} value={a._id}>
                      {a.name} ({a.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="debit">Debit</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search description / ref..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-9 w-[200px]"
                />
              </div>

              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-9 w-[140px]"
              />
              <span className="text-xs text-muted-foreground">to</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-9 w-[140px]"
              />
              <Button type="submit" size="sm" variant="secondary" className="h-9">
                Filter
              </Button>
            </form>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="py-16 flex justify-center">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-sm">
              No journal entries found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead className="text-right">Running Balance (৳)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx._id}>
                    <TableCell className="text-xs whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-semibold text-sm">
                      {tx.account?.name || "Unknown"}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{tx.description}</div>
                      {tx.reference && (
                        <Badge variant="outline" className="text-[10px] mt-0.5 font-mono">
                          REF: {tx.reference}
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
        </CardContent>
      </Card>

      {/* Manual Journal Entry Dialog */}
      <Dialog open={entryOpen} onOpenChange={setEntryOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Ledger Journal Entry</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEntry} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Account</Label>
              <Select value={entryAccountId} onValueChange={setEntryAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a._id} value={a._id}>
                      {a.name} ({a.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={entryType} onValueChange={(v: any) => setEntryType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debit">Debit</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
            </div>
            <div className="space-y-1.5">
              <Label>Description *</Label>
              <Input
                placeholder="Transaction description"
                value={entryDescription}
                onChange={(e) => setEntryDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Reference (Optional)</Label>
              <Input
                placeholder="e.g., INV-0000101"
                value={entryReference}
                onChange={(e) => setEntryReference(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEntryOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Entry
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function LedgerPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center">Loading ledger...</div>}>
      <LedgerContent />
    </Suspense>
  );
}

