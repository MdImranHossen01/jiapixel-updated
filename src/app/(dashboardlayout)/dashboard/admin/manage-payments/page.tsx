"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { 
    Check, 
    X, 
    Search, 
    User, 
    Calendar, 
    CreditCard, 
    ExternalLink,
    AlertCircle,
    Loader2
} from "lucide-react";
import { toast } from "sonner";

interface Payment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  paymentMethod: string;
  transactionId?: string;
  senderNumber?: string;
  status: "pending" | "confirmed" | "rejected";
  notes?: string;
  createdAt: string;
}

const AdminManagePayments = () => {
    const { data: session, status } = useSession();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchPayments = async () => {
        try {
            const response = await fetch("/api/admin/payments");
            if (response.ok) {
                const data = await response.json();
                setPayments(data);
            } else {
                toast.error("Failed to fetch payments.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user?.role === "admin") {
            fetchPayments();
        }
    }, [session]);

    const handleUpdateStatus = async (id: string, status: "confirmed" | "rejected") => {
        setProcessingId(id);
        try {
            const response = await fetch(`/api/admin/payments/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                toast.success(`Payment ${status} successfully!`);
                setPayments(prev => prev.map(p => p._id === id ? { ...p, status } : p));
            } else {
                toast.error("Failed to update status.");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("An error occurred.");
        } finally {
            setProcessingId(null);
        }
    };

    const filteredPayments = payments.filter(p => {
        const matchesSearch = 
            p.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
            p.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
            p.senderNumber?.toLowerCase().includes(search.toLowerCase());
        
        const matchesFilter = filter === "all" || p.status === filter;
        
        return matchesSearch && matchesFilter;
    });

    if (status === "loading") {
        return (
            <div className="min-h-[400px] flex items-center justify-center bg-card border border-border rounded-2xl">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">Verifying session...</p>
                </div>
            </div>
        );
    }

    if (session?.user?.role !== "admin") {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <p className="text-destructive font-bold">Unauthorized. Admin access only.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Manage Payments</h1>
                    <p className="text-muted-foreground">Verify and process client payment submissions.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search user, TxID, or number..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none w-full md:w-64 transition-all"
                        />
                    </div>
                    
                    <select 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="min-h-[400px] flex items-center justify-center bg-card border border-border rounded-2xl">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <p className="text-sm text-muted-foreground">Loading submissions...</p>
                    </div>
                </div>
            ) : filteredPayments.length === 0 ? (
                <div className="min-h-[400px] flex flex-col items-center justify-center bg-card border border-border rounded-2xl text-center p-8">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold">No submissions found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filter.</p>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">User</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Details</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredPayments.map((payment) => (
                                    <tr key={payment._id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-primary" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold">{payment.user?.name || "Unknown"}</span>
                                                    <span className="text-xs text-muted-foreground">{payment.user?.email || "No email"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${
                                                        payment.paymentMethod === 'bKash' ? 'bg-[#e2136e]' :
                                                        payment.paymentMethod === 'Nagad' ? 'bg-[#f58220]' :
                                                        payment.paymentMethod === 'Rocket' ? 'bg-[#8c3494]' : 'bg-blue-600'
                                                    }`}>
                                                        {payment.paymentMethod}
                                                    </span>
                                                    {payment.transactionId && (
                                                        <span className="text-xs font-mono font-bold">{payment.transactionId}</span>
                                                    )}
                                                </div>
                                                {payment.senderNumber && (
                                                    <span className="text-xs text-muted-foreground">From: {payment.senderNumber}</span>
                                                )}
                                                {payment.notes && (
                                                    <span className="text-xs italic text-blue-600 dark:text-blue-400 mt-1">"{payment.notes}"</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold">৳{payment.amount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-muted-foreground">
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                                                payment.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-200' :
                                                payment.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                                'bg-yellow-100 text-yellow-700 border-yellow-200'
                                            }`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {payment.status === "pending" && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleUpdateStatus(payment._id, "confirmed")}
                                                        disabled={!!processingId}
                                                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                                        title="Confirm Payment"
                                                    >
                                                        {processingId === payment._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(payment._id, "rejected")}
                                                        disabled={!!processingId}
                                                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                                        title="Reject Payment"
                                                    >
                                                        {processingId === payment._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManagePayments;
