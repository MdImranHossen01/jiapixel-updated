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
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen, History, Loader2, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

interface AccountLedgerDetailViewProps {
  accountCode: "AP" | "AR";
  title: string;
  accentColorClass?: string;
}

export default function AccountLedgerDetailView({
  accountCode,
  title,
  accentColorClass = "text-emerald-600",
}: AccountLedgerDetailViewProps) {
  const router = useRouter();
  const [account, setAccount] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/ledger?accountCode=${accountCode}`);
      if (res.ok) {
        const data = await res.json();
        setAccount(data.account || null);
        setTransactions(data.transactions || []);
      } else {
        toast.error(`Failed to load ${title}`);
      }
    } catch {
      toast.error(`Error loading ${title}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [accountCode]);

  const filtered = transactions.filter((tx) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (tx.description || "").toLowerCase().includes(q) ||
      (tx.reference || "").toLowerCase().includes(q) ||
      new Date(tx.date).toLocaleDateString().toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/admin/accounts")}
            className="mt-0.5"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              {title} — Transaction History
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Account Code: <strong>{account?.code || accountCode}</strong> • Type:{" "}
              <strong className="capitalize">{account?.type || (accountCode === "AP" ? "liability" : "asset")}</strong> • Category:{" "}
              <strong>{account?.category || "Other"}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-lg border bg-card text-right">
            <div className="text-[10px] font-bold uppercase text-muted-foreground">Live Balance</div>
            <div className={`text-xl font-extrabold ${accentColorClass}`}>
              ৳{Number(account?.currentBalance || 0).toLocaleString()}
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={fetchDetail} title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search this account's transactions / ref / date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          onClick={() =>
            router.push(
              account?._id
                ? `/dashboard/admin/ledger?accountId=${account._id}`
                : "/dashboard/admin/ledger"
            )
          }
          className="gap-1.5"
        >
          <BookOpen className="w-4 h-4" />
          Open in Full Ledger
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-16 flex justify-center">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-sm">
              No transactions found for {title}.
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
                {filtered.map((tx) => (
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
        </CardContent>
      </Card>
    </div>
  );
}

