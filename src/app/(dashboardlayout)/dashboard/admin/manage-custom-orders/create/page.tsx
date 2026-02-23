"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import NovelEditor from "@/app/components/editor/NovelEditor";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function CreateCustomOrderPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [renewDate, setRenewDate] = useState("");
    const [renewPrice, setRenewPrice] = useState("");
    const [adminNote, setAdminNote] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Title is required.");
            return;
        }

        if (!description || description.trim() === "" || description === "[]" || description === '{"type":"doc","content":[]}') {
            toast.error("Description is required.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                title,
                description,
                price: price !== "" && price !== undefined ? Number(price) : undefined,
                dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
                renewDate: renewDate ? new Date(renewDate).toISOString() : undefined,
                renewPrice: renewPrice !== "" && renewPrice !== undefined ? Number(renewPrice) : undefined,
                adminNote: adminNote || undefined,
            };

            const res = await fetch("/api/custom-orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success("Custom order created successfully!");
                router.push("/dashboard/admin/manage-custom-orders");
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to create order");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Create Custom Proposal</h1>
                    <p className="text-muted-foreground mt-2">
                        Draft a new custom project proposal for a client
                    </p>
                </div>
                <button
                    onClick={() => router.push('/dashboard/admin/manage-custom-orders')}
                    className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors"
                >
                    Back to Orders
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-6">

                        {/* Basic Details */}
                        <div className="bg-card rounded-lg shadow p-6 border border-border space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    <Label htmlFor="price" className="block text-sm font-medium text-card-foreground mb-2">Total Price / Estimate ($)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        min={0}
                                        placeholder="e.g., 2500"
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
                                        <Label htmlFor="renewPrice" className="block text-sm font-medium">Renewal Price ($)</Label>
                                        <Input
                                            id="renewPrice"
                                            type="number"
                                            min={0}
                                            placeholder="e.g., 500"
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
                                        <Input
                                            id="adminNote"
                                            placeholder="Private notes about this client or project..."
                                            value={adminNote}
                                            onChange={(e) => setAdminNote(e.target.value)}
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
                        disabled={loading}
                        className="px-6 py-3 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {loading ? 'Generating Link...' : 'Create Proposal'}
                    </button>
                </div>
            </form>
        </div>
    );
}
