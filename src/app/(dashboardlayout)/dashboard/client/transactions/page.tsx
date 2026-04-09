"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { 
    Clock, 
    CheckCircle2, 
    XCircle, 
    Search, 
    Filter,
    Calendar,
    DollarSign,
    CreditCard
} from "lucide-react";
import { toast } from "sonner";

interface Payment {
  _id: string;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
  senderNumber?: string;
  status: "pending" | "confirmed" | "rejected";
  createdAt: string;
}

const ClientTransactions = () => {
    const { data: session } = useSession();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await fetch("/api/payments");
                if (response.ok) {
                    const data = await response.json();
                    setPayments(data);
                } else {
                    toast.error("Failed to fetch transaction history.");
                }
            } catch (error) {
                console.error("Fetch error:", error);
                toast.error("An error occurred while fetching data.");
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchPayments();
        } else {
            setLoading(false);
        }
    }, [session]);

    const filteredPayments = payments.filter(p => 
        p.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
        p.senderNumber?.toLowerCase().includes(search.toLowerCase()) ||
        p.paymentMethod.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "confirmed":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
            case "rejected":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
            default:
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
        }
    };

    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case "confirmed": return <CheckCircle2 className="w-4 h-4" />;
            case "rejected": return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">My Transactions</h1>
                    <p className="text-muted-foreground">View and track your payment history.</p>
                </div>
                
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by ID or Method..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none w-full md:w-64 transition-all"
                    />
                </div>
            </div>

            {loading ? (
                <div className="min-h-[400px] flex items-center justify-center bg-card border border-border rounded-2xl">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-sm text-muted-foreground">Loading transactions...</p>
                    </div>
                </div>
            ) : payments.length === 0 ? (
                <div className="min-h-[400px] flex flex-col items-center justify-center bg-card border border-border rounded-2xl text-center p-8">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <CreditCard className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold">No transactions found</h3>
                    <p className="text-muted-foreground mb-6">You haven't made any payments yet.</p>
                    <a href="/pay" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-all">
                        Make a Payment
                    </a>
                </div>
            ) : filteredPayments.length === 0 ? (
                <div className="min-h-[400px] flex flex-col items-center justify-center bg-card border border-border rounded-2xl text-center p-8">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold">No results found</h3>
                    <p className="text-muted-foreground mb-4">No transactions match your search "{search}".</p>
                    <button 
                        onClick={() => setSearch("")}
                        className="text-primary font-bold hover:underline"
                    >
                        Clear Search
                    </button>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Method</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Details</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredPayments.map((payment) => (
                                    <tr key={payment._id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{new Date(payment.createdAt).toLocaleDateString()}</span>
                                                <span className="text-xs text-muted-foreground">{new Date(payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${
                                                    payment.paymentMethod === 'bKash' ? 'bg-[#e2136e]' :
                                                    payment.paymentMethod === 'Nagad' ? 'bg-[#f58220]' :
                                                    payment.paymentMethod === 'Rocket' ? 'bg-[#8c3494]' : 'bg-blue-600'
                                                }`} />
                                                <span className="text-sm font-bold">{payment.paymentMethod}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                {payment.transactionId && (
                                                    <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded border border-border w-fit">
                                                        TxID: {payment.transactionId}
                                                    </span>
                                                )}
                                                {payment.senderNumber && (
                                                    <span className="text-xs text-muted-foreground">
                                                        From: {payment.senderNumber}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 font-bold">
                                                <span className="text-muted-foreground">৳</span>
                                                <span>{payment.amount.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(payment.status)}`}>
                                                <StatusIcon status={payment.status} />
                                                <span className="capitalize">{payment.status}</span>
                                            </div>
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

export default ClientTransactions;
