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
import ClientAutoSuggestFields from "@/components/admin/ClientAutoSuggestFields";
import ProposalItemsSection, { OfferItemInput } from "@/components/admin/ProposalItemsSection";

export default function CreateCustomOrderPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [currency, setCurrency] = useState("BDT");
    const [dueDate, setDueDate] = useState("");
    const [renewDate, setRenewDate] = useState("");
    const [renewPrice, setRenewPrice] = useState("");
    const [adminNote, setAdminNote] = useState("");
    const [paymentLink, setPaymentLink] = useState("https://www.jiapixel.com/pay");
    const [requirementsLink, setRequirementsLink] = useState("");

    // Client Info
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [clientAddress, setClientAddress] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);

    // Multiple Items
    const [items, setItems] = useState<OfferItemInput[]>([{ name: "", quantity: 1, price: 0, link: "" }]);
    const [manualPrice, setManualPrice] = useState<string>("");
    const [serviceCharge, setServiceCharge] = useState<number>(0);
    const [discountType, setDiscountType] = useState<"fixed" | "percentage">("fixed");
    const [discountValue, setDiscountValue] = useState<number>(0);

    useEffect(() => {
        fetch("/api/admin/suggest-clients")
            .then((r) => r.ok ? r.json() : null)
            .then((res) => { if (res?.success) setSuggestions(res.data || []); })
            .catch(() => { });
        fetch("/api/projects?limit=100")
            .then((r) => r.ok ? r.json() : null)
            .then((res) => { if (res?.projects) setProjects(res.projects); })
            .catch(() => { });
    }, []);

    const validItems = items.filter((it) => it.name.trim() !== "");
    const hasNamedItems = validItems.length > 0;
    const subtotal = validItems.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 1), 0);
    const baseAmount = hasNamedItems ? subtotal : Number(manualPrice || 0);
    const discountAmount =
        discountType === "percentage"
            ? Math.round(((baseAmount + serviceCharge) * discountValue) / 100)
            : discountValue;
    const calculatedTotal = Math.max(0, baseAmount + serviceCharge - discountAmount);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Project Title is required.");
            return;
        }
        if (validItems.some((it) => it.quantity < 1 || it.price < 0)) {
            toast.error("Please enter valid quantity and price for added service items.");
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
                clientName: clientName.trim() || undefined,
                clientEmail: clientEmail.trim() || undefined,
                clientPhone: clientPhone.trim() || undefined,
                clientAddress: clientAddress.trim() || undefined,
                businessName: businessName.trim() || undefined,
                items: validItems,
                serviceCharge,
                discountType,
                discountValue,
                discount: discountAmount,
                price: calculatedTotal,
                currency,
                dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
                renewDate: renewDate ? new Date(renewDate).toISOString() : undefined,
                renewPrice: renewPrice !== "" && renewPrice !== undefined ? Number(renewPrice) : undefined,
                adminNote: adminNote || undefined,
                paymentLink: paymentLink || undefined,
                requirementsLink: requirementsLink || undefined,
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
        <div className="space-y-6">
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

                        {/* Client Information */}
                        <div className="bg-card rounded-lg shadow p-6 border border-border space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-card-foreground">
                                    Client Information <span className="text-xs font-normal text-muted-foreground">(Optional — client can also fill when ordering from proposal link)</span>
                                </h3>
                                <p className="text-xs text-muted-foreground">Type name, email or phone to auto-fill from existing clients</p>
                            </div>
                            <ClientAutoSuggestFields
                                clientName={clientName}
                                setClientName={setClientName}
                                clientEmail={clientEmail}
                                setClientEmail={setClientEmail}
                                clientPhone={clientPhone}
                                setClientPhone={setClientPhone}
                                clientAddress={clientAddress}
                                setClientAddress={setClientAddress}
                                businessName={businessName}
                                setBusinessName={setBusinessName}
                                suggestions={suggestions}
                                emailRequired={false}
                                required={false}
                            />
                        </div>

                        {/* Multiple Services / Items */}
                        <ProposalItemsSection
                            items={items}
                            setItems={setItems}
                            serviceCharge={serviceCharge}
                            setServiceCharge={setServiceCharge}
                            discountType={discountType}
                            setDiscountType={setDiscountType}
                            discountValue={discountValue}
                            setDiscountValue={setDiscountValue}
                            currency={currency}
                            projects={projects}
                            required={false}
                        />

                        {/* Basic Details */}
                        <div className="bg-card rounded-lg shadow p-6 border border-border space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="title" className="block text-sm font-medium text-card-foreground mb-2">Offer / Project Title <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., E-commerce Redesign & Marketing Package"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="manualPrice" className="block text-sm font-medium text-card-foreground mb-2">
                                        {hasNamedItems ? "Calculated Price" : "Offer Price (Optional)"} ({currency === "USD" ? "$" : "৳"})
                                    </Label>
                                    <Input
                                        id="manualPrice"
                                        type="number"
                                        min={0}
                                        disabled={hasNamedItems}
                                        placeholder={hasNamedItems ? String(calculatedTotal) : "e.g., 15000"}
                                        value={hasNamedItems ? calculatedTotal : manualPrice}
                                        onChange={(e) => setManualPrice(e.target.value)}
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
                                            <SelectItem value="BDT">BDT (৳)</SelectItem>
                                            <SelectItem value="USD">USD ($)</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                            placeholder="https://..."
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
