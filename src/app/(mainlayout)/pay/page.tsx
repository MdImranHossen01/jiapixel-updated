"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
    Smartphone, 
    CreditCard, 
    CheckCircle2, 
    AlertCircle, 
    QrCode, 
    ArrowRight,
    Send,
    Loader2
} from "lucide-react";
import Image from "next/image";

type PaymentMethod = "bKash" | "Nagad" | "Rocket" | "Bank App";

const PayPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [method, setMethod] = useState<PaymentMethod>("bKash");
    const [amount, setAmount] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [senderNumber, setSenderNumber] = useState("");
    const [verifyBy, setVerifyBy] = useState<"number" | "txid">("number");
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCopyAccount = async () => {
        const accountNumber = "01919011101";

        const fallbackCopy = () => {
            const textArea = document.createElement("textarea");
            textArea.value = accountNumber;
            // Ensure the textarea is offscreen and invisible
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            textArea.style.opacity = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    toast.success("Account number copied!");
                } else {
                    toast.error("Failed to copy. Please copy manually.");
                }
            } catch (err) {
                toast.error("Failed to copy. Please copy manually.");
            } finally {
                document.body.removeChild(textArea);
            }
        };

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(accountNumber);
                toast.success("Account number copied!");
            } else {
                fallbackCopy();
            }
        } catch (error) {
            // Fallback if navigator.clipboard fails unexpectedy
            fallbackCopy();
        }
    };

    useEffect(() => {
        if (status === "unauthenticated") {
            toast.error("Please login to access the payment page.");
            router.push("/login?callbackUrl=/pay");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!session) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }

        if (method !== "Bank App") {
            if (verifyBy === "txid" && !transactionId.trim()) {
                toast.error("Please provide your Transaction ID.");
                return;
            }
            if (verifyBy === "number" && !senderNumber.trim()) {
                toast.error("Please provide your Sender Mobile Number.");
                return;
            }
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    paymentMethod: method,
                    transactionId: verifyBy === "txid" ? transactionId : undefined,
                    senderNumber: verifyBy === "number" ? senderNumber : undefined,
                    notes,
                }),
            });

            if (response.ok) {
                toast.success("Payment submitted successfully! Admin will verify it shortly.");
                router.push("/dashboard/client/transactions");
            } else {
                const data = await response.json();
                toast.error(data.message || "Failed to submit payment.");
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const methods: { id: PaymentMethod; label: string; color: string; icon: any }[] = [
        { id: "bKash", label: "bKash", color: "bg-[#e2136e]", icon: Smartphone },
        { id: "Nagad", label: "Nagad", color: "bg-[#f58220]", icon: Smartphone },
        { id: "Rocket", label: "Rocket", color: "bg-[#8c3494]", icon: Smartphone },
        { id: "Bank App", label: "Bank App", color: "bg-blue-600", icon: CreditCard },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-foreground mb-4">Make a Payment</h1>
                <p className="text-lg text-muted-foreground">Choose your preferred method and submit verification details.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Instructions Section */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <AlertCircle className="text-primary w-5 h-5" />
                            How to Pay
                        </h2>
                        
                        {method === "Bank App" ? (
                            <div className="space-y-4">
                                <p className="text-muted-foreground">Scan the QR code below using your Bank App to complete the payment.</p>
                                <div className="relative aspect-square w-full max-w-[250px] mx-auto bg-white p-2 rounded-xl shadow-inner border border-border">
                                    <Image 
                                        src="/PaymentQr.jpg" 
                                        alt="Payment QR Code" 
                                        fill 
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium text-center">
                                        Scan and Pay smoothly via your Bank App
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <span className="text-primary font-bold">1</span>
                                    </div>
                                    <p className="text-muted-foreground">
                                        Open your <span className="font-bold text-foreground">{method}</span> app or dial USSD.
                                    </p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <span className="text-primary font-bold">2</span>
                                    </div>
                                    <p className="text-muted-foreground">
                                        Choose <span className="font-bold text-foreground">"Send Money"</span> option.
                                    </p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <span className="text-primary font-bold">3</span>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-muted-foreground">Send total amount to this personal account:</p>
                                        <button 
                                            type="button"
                                            aria-label="Copy account number"
                                            className="w-full bg-muted p-3 rounded-lg flex items-center justify-between border border-border group cursor-pointer active:scale-[0.98] transition-all hover:bg-muted/80 focus:ring-2 focus:ring-primary focus:outline-none"
                                            onClick={handleCopyAccount}
                                        >
                                            <span className="text-xl font-mono font-bold tracking-wider">01919011101</span>
                                            <span className="text-xs text-primary uppercase font-bold transition-opacity">Copy</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <span className="text-primary font-bold">4</span>
                                    </div>
                                    <p className="text-muted-foreground">
                                        Submit the Transaction ID or your Mobile Number in the form to verify your payment.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Section */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-24">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <CheckCircle2 className="text-green-500 w-5 h-5" />
                        Enter Payment Details
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Method Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-muted-foreground">Select Payment Method</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {methods.map((m) => (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => setMethod(m.id)}
                                        className={`
                                            flex flex-col items-center justify-center py-3 px-2 rounded-xl border-2 transition-all duration-200
                                            ${method === m.id 
                                                ? `${m.color} border-transparent text-white shadow-lg scale-[1.05]` 
                                                : "bg-background border-border text-muted-foreground hover:border-primary/50"
                                            }
                                        `}
                                    >
                                        <m.icon className="w-6 h-6 mb-1" />
                                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-tighter">{m.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="space-y-2">
                            <label htmlFor="amount" className="text-sm font-medium text-muted-foreground">Amount (৳)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold opacity-50">৳</span>
                                <input
                                    id="amount"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-12 pr-4 py-4 bg-background border-2 border-border rounded-xl focus:border-primary focus:ring-0 transition-all text-2xl font-bold"
                                    required
                                />
                            </div>
                        </div>

                        {method !== "Bank App" && (
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-muted-foreground">Verify By</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="verifyBy"
                                                value="number"
                                                checked={verifyBy === "number"}
                                                onChange={() => setVerifyBy("number")}
                                                className="w-4 h-4 text-primary focus:ring-primary border-border"
                                            />
                                            <span className={`text-sm font-medium transition-colors ${verifyBy === "number" ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                                                Mobile Number
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="verifyBy"
                                                value="txid"
                                                checked={verifyBy === "txid"}
                                                onChange={() => setVerifyBy("txid")}
                                                className="w-4 h-4 text-primary focus:ring-primary border-border"
                                            />
                                            <span className={`text-sm font-medium transition-colors ${verifyBy === "txid" ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                                                Transaction ID
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {verifyBy === "number" ? (
                                    <div className="space-y-2">
                                        <label htmlFor="number" className="text-sm font-medium text-muted-foreground">Sender Mobile Number</label>
                                        <input
                                            id="number"
                                            type="text"
                                            value={senderNumber}
                                            onChange={(e) => setSenderNumber(e.target.value)}
                                            placeholder="01XXXXXXXXX"
                                            className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:border-primary focus:ring-0 transition-all"
                                            required
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label htmlFor="txid" className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                                        <input
                                            id="txid"
                                            type="text"
                                            value={transactionId}
                                            onChange={(e) => setTransactionId(e.target.value)}
                                            placeholder="e.g. 8G5H2J8"
                                            className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:border-primary focus:ring-0 transition-all"
                                            required
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="notes" className="text-sm font-medium text-muted-foreground">Additional Notes (Optional)</label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any specific details for the admin..."
                                className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:border-primary focus:ring-0 transition-all h-24 resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit Payment
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PayPage;
