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
    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [isSubscription, setIsSubscription] = useState(false);
    const [billingCycle, setBillingCycle] = useState("monthly");
    const [subscriptionDurationMonths, setSubscriptionDurationMonths] = useState("");



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

        if (isSubscription && subscriptionDurationMonths && Number(subscriptionDurationMonths) <= 0) {
            toast.error("Subscription duration must be at least 1 month.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                title,
                description,
                price: price ? Number(price) : undefined,
                dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
                isSubscription,
                billingCycle: isSubscription ? billingCycle : undefined,
                subscriptionDurationMonths: isSubscription && subscriptionDurationMonths ? Number(subscriptionDurationMonths) : undefined,
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
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/admin/manage-custom-orders">
                    <Button variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Create Custom Proposal</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-card border rounded-lg p-6">
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
                        onChange={(val) => {
                            if (typeof val === 'string') {
                                setDescription(val);
                            } else {
                                setDescription(JSON.stringify(val));
                            }
                        }}
                    />
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <Button type="submit" size="lg" disabled={loading} className="w-full md:w-auto">
                        {loading ? "Generating Link..." : "Create & Generate Proposal Link"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
