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

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [isSubscription, setIsSubscription] = useState(false);
    const [billingCycle, setBillingCycle] = useState("monthly");
    const [subscriptionDurationMonths, setSubscriptionDurationMonths] = useState("");

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
                    setCurrentStatus(order.status);

                    setIsSubscription(order.isSubscription || false);
                    setBillingCycle(order.billingCycle || "monthly");
                    setSubscriptionDurationMonths(order.subscriptionDurationMonths ? String(order.subscriptionDurationMonths) : "");

                    if (order.dueDate) {
                        const date = new Date(order.dueDate);
                        setDueDate(date.toISOString().split('T')[0]);
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

        if (isSubscription && subscriptionDurationMonths && Number(subscriptionDurationMonths) <= 0) {
            toast.error("Subscription duration must be at least 1 month.");
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
                price: price ? Number(price) : null,
                dueDate: dueDate && !isSubscription ? new Date(dueDate).toISOString() : null,
                isSubscription,
                billingCycle: isSubscription ? billingCycle : null,
                subscriptionDurationMonths: isSubscription && subscriptionDurationMonths ? Number(subscriptionDurationMonths) : null,
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
            return undefined;
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
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/admin/manage-custom-orders">
                    <Button variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Edit Custom Proposal</h1>
            </div>

            <form onSubmit={handleUpdate} className="space-y-8 bg-card border rounded-lg p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Project Title <span className="text-red-500">*</span></Label>
                        <Input
                            id="title"
                            placeholder="e.g., E-commerce Redesign"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price">Total Price / Estimate ($)</Label>
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
                        />
                    </div>

                    <div className="space-y-2 flex flex-col justify-end pb-2">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="isSubscription"
                                checked={isSubscription}
                                onCheckedChange={setIsSubscription}
                            />
                            <Label htmlFor="isSubscription">This is a recurring subscription</Label>
                        </div>
                    </div>
                </div>

                {isSubscription ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/50 rounded-lg border">
                        <div className="space-y-2">
                            <Label>Billing Cycle</Label>
                            <Select value={billingCycle} onValueChange={setBillingCycle}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Contract Duration (Months)</Label>
                            <Input
                                id="duration"
                                type="number"
                                min={1}
                                placeholder="Optional limit. e.g., 12"
                                value={subscriptionDurationMonths}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "" || (Number(val) > 0 && Number.isInteger(Number(val)))) {
                                        setSubscriptionDurationMonths(val);
                                    }
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Label htmlFor="dueDate">Expected Delivery Date</Label>
                        <Input
                            id="dueDate"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label>Proposal Description & Scope <span className="text-red-500">*</span></Label>
                    <p className="text-sm text-muted-foreground pb-2">
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

                <div className="flex justify-end pt-4 border-t gap-3">
                    <Link href="/dashboard/admin/manage-custom-orders">
                        <Button variant="ghost" type="button" disabled={submitting}>
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" size="lg" disabled={submitting} className="w-full md:w-auto">
                        {submitting ? "Updating Proposal..." : "Save Proposal Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
