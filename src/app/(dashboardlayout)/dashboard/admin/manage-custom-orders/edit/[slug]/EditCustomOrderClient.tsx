"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import NovelEditor from "@/app/components/editor/NovelEditor";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface EditCustomOrderClientProps {
    slug: string;
}

export default function EditCustomOrderClient({ slug }: EditCustomOrderClientProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [dueDate, setDueDate] = useState("");
    const [renewDate, setRenewDate] = useState("");
    const [renewPrice, setRenewPrice] = useState("");
    const [adminNote, setAdminNote] = useState("");
    const [paymentLink, setPaymentLink] = useState("");
    const [requirementsLink, setRequirementsLink] = useState("");

    // Status Tracker
    const [currentStatus, setCurrentStatus] = useState<string>("proposed");

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const res = await fetch(`/api/custom-orders/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    const order = data.order;

                    setTitle(order.title || "");
                    setDescription(order.description || "");
                    setPrice(order.price ? String(order.price) : "");
                    setCurrency(order.currency || "USD");
                    setCurrentStatus(order.status);
                    setRenewPrice(order.renewPrice ? String(order.renewPrice) : "");
                    setAdminNote(order.adminNote || "");
                    setPaymentLink(order.paymentLink || "");
                    setRequirementsLink(order.requirementsLink || "");

                    if (order.dueDate) {
                        const date = new Date(order.dueDate);
                        setDueDate(date.toISOString().split('T')[0]);
                    }

                    if (order.renewDate) {
                        const date = new Date(order.renewDate);
                        setRenewDate(date.toISOString().split('T')[0]);
                    }
                } else {
                    toast.error("Order not found or access denied.");
                    router.push("/dashboard/admin/manage-custom-orders");
                }
            } catch (error) {
                toast.error("An error occurred while loading order details.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [slug, router]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Title is required.");
            return;
        }

        if (!description || description.trim() === "" || description === "[]" || description === '{"type":"doc","content":[]}') {
            toast.error("Description is required.");
            return;
        }

        setSubmitting(true);

        try {
            // Re-using the PATCH endpoint but adding a parallel PUT or extending PATCH logic
            // The existing PATCh is strict for ONLY accepting "status" updates.
            // We should use PUT to update the entire object, or build out PATCH.

            const payload = {
                title,
                description,
                status: currentStatus, // keep existing status unless changed
                price: price !== "" && price !== undefined ? Number(price) : null,
                currency,
                dueDate: dueDate ? new Date(dueDate).toISOString() : null,
                renewDate: renewDate ? new Date(renewDate).toISOString() : null,
                renewPrice: renewPrice !== "" && renewPrice !== undefined ? Number(renewPrice) : null,
                adminNote: adminNote || null,
                paymentLink: paymentLink || null,
                requirementsLink: requirementsLink || null,
            };

            const res = await fetch(`/api/custom-orders/${slug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success("Custom order proposal updated successfully!");
                router.push("/dashboard/admin/manage-custom-orders");
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update order");
            }
        } catch (error) {
            toast.error("An error occurred during submission.");
        } finally {
            setSubmitting(false);
        }
    };

    // Parse description for NovelEditor
    const getParsedDescription = () => {
        try {
            return description ? JSON.parse(description) : undefined;
        } catch (e) {
            // Fallback for plain text
            return {
                type: "doc",
                content: [
                    {
                        type: "paragraph",
                        content: [{ type: "text", text: description }]
                    }
                ]
            };
        }
    }

    // Parse adminNote for NovelEditor
    const getParsedAdminNote = () => {
        try {
            return adminNote ? JSON.parse(adminNote) : undefined;
        } catch (e) {
            // Fallback for plain text
            return {
                type: "doc",
                content: [
                    {
                        type: "paragraph",
                        content: [{ type: "text", text: adminNote }]
                    }
                ]
            };
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading proposal details...</p>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Edit Custom Proposal</h1>
                    <p className="text-muted-foreground mt-2">
                        Update the project scope and pricing for this proposal
                    </p>
                </div>
                <button
                    onClick={() => router.push('/dashboard/admin/manage-custom-orders')}
                    className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors"
                >
                    Back to Orders
                </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-6">

                        {/* Basic Details */}
                        <div className="bg-card rounded-lg shadow p-6 border border-border space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="block text-sm font-medium text-card-foreground mb-2">Project Title <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., E-commerce Redesign"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="currency" className="block text-sm font-medium text-card-foreground mb-2">Currency</Label>
                                    <Select value={currency} onValueChange={setCurrency}>
                                        <SelectTrigger id="currency" className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground h-[48px]">
                                            <SelectValue placeholder="Select Currency" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border border-border">
                                            <SelectItem value="USD">USD ($)</SelectItem>
                                            <SelectItem value="BDT">BDT (৳)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price" className="block text-sm font-medium text-card-foreground mb-2">Total Price / Estimate ({currency === "USD" ? "$" : "৳"})</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        min={0}
                                        placeholder={currency === "USD" ? "e.g., 2500" : "e.g., 25000"}
                                        value={price}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === "" || Number(val) >= 0) {
                                                setPrice(val);
                                            }
                                        }}
                                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                                    />
                                </div>
                            </div>

                            {/* Internal Admin Data */}
                            <div className="pt-2 border-t border-border mt-6">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Internal Admin Tracking (Hidden from Client)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-muted/30 rounded-lg border border-dashed">
                                    <div className="space-y-2">
                                        <Label htmlFor="dueDate" className="block text-sm font-medium">Expected Delivery Date</Label>
                                        <Input
                                            id="dueDate"
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="renewDate" className="block text-sm font-medium">Service Renew Date</Label>
                                        <Input
                                            id="renewDate"
                                            type="date"
                                            value={renewDate}
                                            onChange={(e) => setRenewDate(e.target.value)}
                                            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="renewPrice" className="block text-sm font-medium">Renewal Price ({currency === "USD" ? "$" : "৳"})</Label>
                                        <Input
                                            id="renewPrice"
                                            type="number"
                                            min={0}
                                            placeholder={currency === "USD" ? "e.g., 500" : "e.g., 5000"}
                                            value={renewPrice}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === "" || Number(val) >= 0) {
                                                    setRenewPrice(val);
                                                }
                                            }}
                                            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                                        />
                                    </div>
                                    <div className="md:col-span-3 space-y-2">
                                        <Label htmlFor="adminNote" className="block text-sm font-medium">Admin Notes</Label>
                                        <div className="bg-background rounded-lg">
                                            <NovelEditor
                                                initialValue={getParsedAdminNote()}
                                                onChange={(val) => {
                                                    if (typeof val === 'string') {
                                                        setAdminNote(val);
                                                    } else {
                                                        setAdminNote(JSON.stringify(val));
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-3 space-y-2">
                                        <Label htmlFor="paymentLink" className="block text-sm font-medium">Payment Link (Visible to client after acceptance)</Label>
                                        <Input
                                            id="paymentLink"
                                            placeholder="https://www.jiapixel.com/pay"
                                            value={paymentLink}
                                            onChange={(e) => setPaymentLink(e.target.value)}
                                            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                                        />
                                    </div>
                                    <div className="md:col-span-3 space-y-2">
                                        <Label htmlFor="requirementsLink" className="block text-sm font-medium">Requirements Google Form Link (Visible to client after acceptance)</Label>
                                        <Input
                                            id="requirementsLink"
                                            placeholder="https://forms.gle/..."
                                            value={requirementsLink}
                                            onChange={(e) => setRequirementsLink(e.target.value)}
                                            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-card rounded-lg shadow p-6 border border-border">
                            <Label className="block text-lg font-semibold text-card-foreground mb-3">
                                Proposal Description & Scope <span className="text-red-500">*</span>
                            </Label>
                            <p className="text-sm text-muted-foreground pb-4">
                                Use the rich text editor to draft a comprehensive proposal. The client will see this exact formatting.
                            </p>
                            <NovelEditor
                                initialValue={getParsedDescription()}
                                onChange={(val) => {
                                    if (typeof val === 'string') {
                                        setDescription(val);
                                    } else {
                                        setDescription(JSON.stringify(val));
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-border mt-8">
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/admin/manage-custom-orders')}
                        disabled={submitting}
                        className="px-6 py-3 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {submitting ? 'Updating Proposal...' : 'Save Proposal Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
