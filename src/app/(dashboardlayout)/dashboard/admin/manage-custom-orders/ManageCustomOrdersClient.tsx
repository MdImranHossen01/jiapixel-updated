"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, FileText, CheckCircle, RefreshCcw, DollarSign, Copy, Trash2, Edit, Search, Filter, Clock, XCircle, Printer, Receipt, Files, Truck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ClientAutoSuggestFields from "@/components/admin/ClientAutoSuggestFields";
import ProposalItemsSection, { OfferItemInput } from "@/components/admin/ProposalItemsSection";
import { generateBillPDF } from "@/lib/bill-invoice-generator";

interface CustomOrder {
    _id: string;
    shareableSlug: string;
    title: string;
    description?: string;
    client: { name: string; email: string; } | string;
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    clientAddress?: string;
    businessName?: string;
    items?: OfferItemInput[];
    serviceCharge?: number;
    discountType?: "fixed" | "percentage";
    discountValue?: number;
    discount?: number;
    convertedBillId?: string;
    admin: { name: string; email: string; } | string;
    status: "proposed" | "accepted" | "pending" | "paid" | "processing" | "delivered" | "under review" | "completed" | "canceled";
    price?: number;
    currency?: "USD" | "BDT";
    dueDate?: string;
    renewDate?: string;
    renewPrice?: number;
    adminNote?: string;
    paymentLink?: string;
    requirementsLink?: string;
    createdAt: string;
}

const ALL_STATUSES = [
    "proposed", "accepted", "pending", "paid",
    "processing", "delivered", "under review", "completed", "canceled"
];

const ManageCustomOrdersClient = () => {
    const router = useRouter();
    const [orders, setOrders] = useState<CustomOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);

    // Convert to Bill Modal State
    const [convertOrder, setConvertOrder] = useState<CustomOrder | null>(null);
    const [convertLoading, setConvertLoading] = useState(false);
    const [billClientName, setBillClientName] = useState("");
    const [billClientEmail, setBillClientEmail] = useState("");
    const [billClientPhone, setBillClientPhone] = useState("");
    const [billClientAddress, setBillClientAddress] = useState("");
    const [billBusinessName, setBillBusinessName] = useState("");
    const [billItems, setBillItems] = useState<OfferItemInput[]>([{ name: "", quantity: 1, price: 0 }]);
    const [billServiceCharge, setBillServiceCharge] = useState(0);
    const [billDiscountType, setBillDiscountType] = useState<"fixed" | "percentage">("fixed");
    const [billDiscountValue, setBillDiscountValue] = useState(0);
    const [billPrevDue, setBillPrevDue] = useState(0);
    const [billCashIn, setBillCashIn] = useState(0);
    const [billCurrency, setBillCurrency] = useState<"BDT" | "USD">("BDT");
    const [billRenewDate, setBillRenewDate] = useState("");
    const [billRenewFee, setBillRenewFee] = useState(0);
    const [billAdminNote, setBillAdminNote] = useState("");

    const filteredOrders = orders.filter(order => {
        const q = searchTerm.toLowerCase();
        const matchesSearch =
            order.title.toLowerCase().includes(q) ||
            (order.clientName || "").toLowerCase().includes(q) ||
            (order.clientEmail || "").toLowerCase().includes(q) ||
            (order.clientPhone || "").toLowerCase().includes(q) ||
            (order.businessName || "").toLowerCase().includes(q) ||
            (typeof order.client === 'object' && order.client?.name?.toLowerCase().includes(q)) ||
            (typeof order.client === 'object' && order.client?.email?.toLowerCase().includes(q));

        const matchesStatus = statusFilter === "all" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/custom-orders");
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            } else {
                toast.error("Failed to fetch custom orders");
            }
        } catch (error) {
            toast.error("An error occurred while fetching orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetch("/api/admin/suggest-clients")
            .then((r) => r.ok ? r.json() : null)
            .then((res) => { if (res?.success) setSuggestions(res.data || []); })
            .catch(() => {});
        fetch("/api/projects?limit=100")
            .then((r) => r.ok ? r.json() : null)
            .then((res) => { if (res?.projects) setProjects(res.projects); })
            .catch(() => {});
    }, []);

    const handleStatusChange = async (slug: string, status: string) => {
        try {
            const res = await fetch(`/api/custom-orders/${slug}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (res.ok) {
                toast.success(`Order status updated to ${status}`);
                fetchOrders();
            } else {
                toast.error("Failed to update order status");
            }
        } catch (error) {
            toast.error("An error occurred while updating the order");
        }
    };

    const handleDelete = async (slug: string) => {
        const confirmRes = await Swal.fire({
            title: "Delete Offer?",
            text: "Are you sure you want to delete this offer? This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            confirmButtonText: "Yes, delete it",
        });
        if (!confirmRes.isConfirmed) return;

        try {
            const res = await fetch(`/api/custom-orders/${slug}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Offer deleted successfully");
                fetchOrders();
            } else {
                toast.error("Failed to delete offer");
            }
        } catch (error) {
            toast.error("An error occurred while deleting the order");
        }
    };

    const getOrderItems = (order: CustomOrder): OfferItemInput[] => {
        if (Array.isArray(order.items) && order.items.length > 0) {
            return order.items.map((it) => ({
                name: it.name || "",
                description: it.description || "",
                quantity: Number(it.quantity || 1),
                price: Number(it.price || 0),
                link: it.link || "",
            }));
        }
        return [{ name: order.title || "Custom Service", quantity: 1, price: Number(order.price || 0), link: "" }];
    };

    const handleDownloadOfferPDF = (order: CustomOrder) => {
        const items = getOrderItems(order);
        const subtotal = items.reduce((s, it) => s + Number(it.price || 0) * Number(it.quantity || 1), 0);
        const sc = Number(order.serviceCharge || 0);
        const disc = Number(order.discount || 0);
        const total = Math.max(0, subtotal + sc - disc);
        const clientDisplay = getOrderClientDisplay(order);

        generateBillPDF(
            {
                ...order,
                documentType: "offer",
                clientName: clientDisplay.name === "Unassigned" ? "Valued Client" : clientDisplay.name,
                clientEmail: order.clientEmail || (typeof order.client === "object" ? order.client?.email : ""),
                clientPhone: order.clientPhone || "",
                clientAddress: order.clientAddress || "",
                businessName: order.businessName || "",
                items,
                subtotal,
                serviceCharge: sc,
                discountType: order.discountType || "fixed",
                discountValue: order.discountValue || 0,
                discount: disc,
                total,
            },
            {},
            "download"
        );
    };

    const handleReuseOffer = async (order: CustomOrder) => {
        try {
            const res = await fetch("/api/custom-orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: order.title,
                    description: order.description || "",
                    clientName: "",
                    clientEmail: "",
                    clientPhone: "",
                    clientAddress: "",
                    businessName: "",
                    items: Array.isArray(order.items) && order.items.length > 0 ? order.items : [],
                    serviceCharge: order.serviceCharge || 0,
                    discountType: order.discountType || "fixed",
                    discountValue: order.discountValue || 0,
                    discount: order.discount || 0,
                    price: order.price,
                    currency: order.currency || "BDT",
                    dueDate: order.dueDate,
                    renewDate: order.renewDate,
                    renewPrice: order.renewPrice,
                    adminNote: order.adminNote,
                    paymentLink: order.paymentLink,
                    requirementsLink: order.requirementsLink,
                }),
            });
            if (res.ok) {
                toast.success("New reusable offer created without client information!");
                fetchOrders();
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed to reuse offer");
            }
        } catch {
            toast.error("Failed to reuse offer");
        }
    };

    const openConvertToBillModal = (order: CustomOrder) => {
        setConvertOrder(order);
        const clientObj = typeof order.client === "object" && order.client !== null ? order.client : null;
        setBillClientName(order.clientName || clientObj?.name || "");
        setBillClientEmail(order.clientEmail || clientObj?.email || "");
        setBillClientPhone(order.clientPhone || "");
        setBillClientAddress(order.clientAddress || "");
        setBillBusinessName(order.businessName || "");
        setBillItems(getOrderItems(order));
        setBillServiceCharge(Number(order.serviceCharge || 0));
        setBillDiscountType(order.discountType || "fixed");
        setBillDiscountValue(Number(order.discountValue || 0));
        setBillPrevDue(0);
        setBillCashIn(0);
        setBillCurrency(order.currency || "BDT");
        setBillRenewDate(order.renewDate ? new Date(order.renewDate).toISOString().split("T")[0] : "");
        setBillRenewFee(Number(order.renewPrice || 0));
        setBillAdminNote(order.adminNote || "");
    };

    const billSubtotal = billItems.reduce((s, it) => s + Number(it.price || 0) * Number(it.quantity || 1), 0);
    const billDiscountAmount =
        billDiscountType === "percentage"
            ? Math.round(((billSubtotal + billServiceCharge) * billDiscountValue) / 100)
            : billDiscountValue;
    const billTotal = Math.max(0, billSubtotal + billServiceCharge - billDiscountAmount);
    const billGrandTotal = billTotal + billPrevDue;
    const billDue = Math.max(0, billGrandTotal - billCashIn);

    const handleConvertToBillSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!convertOrder) return;
        if (!billClientName.trim() || !billClientEmail.trim() || !billClientPhone.trim() || !billClientAddress.trim()) {
            toast.error("Please fill in all required client details");
            return;
        }
        if (billItems.some((it) => !it.name.trim() || it.quantity < 1 || it.price < 0)) {
            toast.error("Please complete all service items correctly");
            return;
        }
        setConvertLoading(true);
        try {
            const res = await fetch("/api/admin/bills", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientName: billClientName,
                    clientEmail: billClientEmail,
                    clientPhone: billClientPhone,
                    clientAddress: billClientAddress,
                    businessName: billBusinessName,
                    items: billItems,
                    subtotal: billSubtotal,
                    serviceCharge: billServiceCharge,
                    discountType: billDiscountType,
                    discountValue: billDiscountValue,
                    discount: billDiscountAmount,
                    total: billTotal,
                    prevDue: billPrevDue,
                    gTotal: billGrandTotal,
                    cashIn: billCashIn,
                    currentBillDue: billDue,
                    status: billDue <= 0 ? "Paid" : "Due",
                    currency: billCurrency,
                    renewDate: billRenewDate ? new Date(billRenewDate) : undefined,
                    renewFee: billRenewFee,
                    adminNote: billAdminNote,
                    documentType: "bill",
                    convertedFromCustomOrder: convertOrder._id,
                }),
            });
            if (res.ok) {
                const newBill = await res.json();
                setConvertOrder(null);
                fetchOrders();
                const go = await Swal.fire({
                    title: "Converted to Client Bill!",
                    text: `Invoice #${newBill.invoiceNo} has been created.`,
                    icon: "success",
                    showCancelButton: true,
                    confirmButtonText: "Go to Manage Bills",
                    cancelButtonText: "Stay Here",
                });
                if (go.isConfirmed) {
                    router.push("/dashboard/admin/manage-bills");
                }
            } else {
                const err = await res.json();
                toast.error(err.message || "Failed to convert to bill");
            }
        } catch {
            toast.error("Error creating client bill");
        } finally {
            setConvertLoading(false);
        }
    };

    const handleCreateChalanFromOffer = async (order: CustomOrder) => {
        const clientObj = typeof order.client === "object" && order.client !== null ? order.client : null;
        const cName = order.clientName || clientObj?.name || "";
        const cPhone = order.clientPhone || "";
        const cAddr = order.clientAddress || "";
        if (!cName || !cPhone || !cAddr) {
            toast.error("Client Name, Phone and Address are required to create a Chalan. Please edit the offer first.");
            return;
        }
        try {
            const items = getOrderItems(order);
            const res = await fetch("/api/admin/bills", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientName: cName,
                    clientEmail: order.clientEmail || clientObj?.email || "",
                    clientPhone: cPhone,
                    clientAddress: cAddr,
                    businessName: order.businessName || "",
                    items,
                    subtotal: 0,
                    total: 0,
                    gTotal: 0,
                    status: "Paid",
                    currency: order.currency || "BDT",
                    documentType: "chalan",
                    expectedDeliveryDate: order.dueDate || undefined,
                    convertedFromCustomOrder: order._id,
                }),
            });
            if (res.ok) {
                const chalan = await res.json();
                toast.success(`Delivery Chalan ${chalan.invoiceNo} created!`);
                generateBillPDF(chalan, {}, "download");
            } else {
                const err = await res.json();
                toast.error(err.message || "Failed to create Delivery Chalan");
            }
        } catch {
            toast.error("Error creating Delivery Chalan");
        }
    };

    const getOrderClientDisplay = (order: CustomOrder) => {
        if (order.clientName) {
            return {
                name: order.clientName,
                email: order.clientEmail || order.clientPhone || "",
            };
        }
        if (typeof order.client === 'object' && order.client !== null && 'name' in order.client) {
            return { name: order.client.name, email: order.client.email };
        }
        return { name: 'Unassigned', email: 'Waiting for client...' };
    };

    const getStatusVariant = (status: CustomOrder["status"]) => {
        switch (status) {
            case "proposed":
                return "outline";
            case "accepted":
            case "paid":
                return "default";
            case "pending":
            case "processing":
            case "under review":
                return "secondary";
            case "completed":
            case "delivered":
                return "default";
            case "canceled":
                return "destructive";
            default:
                return "outline";
        }
    };

    const getUserDisplay = (userRef: any) => {
        if (typeof userRef === 'object' && userRef !== null && 'name' in userRef) {
            return { name: userRef.name, email: userRef.email };
        }
        return { name: 'Unassigned', email: 'Waiting for client...' };
    };

    const copyLink = async (slug: string) => {
        const url = `${window.location.origin}/proposal/${slug}`;
        try {
            await navigator.clipboard.writeText(url);
            toast.success("Proposal link copied to clipboard!");
        } catch (err) {
            console.error("Clipboard copy failed:", err);
            // Fallback for older browsers or restricted environments
            try {
                const textArea = document.createElement("textarea");
                textArea.value = url;
                document.body.appendChild(textArea);
                textArea.select();
                const success = document.execCommand("copy");
                document.body.removeChild(textArea);
                if (success) {
                    toast.success("Proposal link copied to clipboard!");
                } else {
                    throw new Error("execCommand copy failed");
                }
            } catch (fallbackErr) {
                toast.error("Failed to copy link. Please manually copy the URL.");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Loading custom orders...</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
                <div className="relative w-full md:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search project or client..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[180px] capitalize">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {ALL_STATUSES.map(status => (
                                <SelectItem key={status} value={status} className="capitalize">
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Public ID</TableHead>
                            <TableHead>Project Title</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Renew Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Expected Delivery</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                                    {searchTerm || statusFilter !== "all"
                                        ? "No orders match your search criteria."
                                        : "No custom orders generated yet."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map((order) => {
                                const clientInfo = getOrderClientDisplay(order);

                                return (
                                    <TableRow key={order._id}>
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {order.shareableSlug.substring(0, 8)}...
                                        </TableCell>
                                        <TableCell className="font-medium max-w-[200px] truncate">
                                            {order.title}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-sm">{clientInfo.name}</div>
                                            <div className="text-xs text-muted-foreground">{clientInfo.email}</div>
                                        </TableCell>
                                        <TableCell className="font-bold">
                                            {order.price ? `${order.currency === "BDT" ? "৳" : "$"}${order.price.toLocaleString()}` : 'TBD'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {order.renewDate ? (
                                                <span className="flex items-center gap-2">
                                                    <RefreshCcw className="h-3.5 w-3.5 text-orange-500" />
                                                    {new Date(order.renewDate).toLocaleDateString()}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground italic text-xs">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(order.status)} className="capitalize">
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm font-medium">
                                            {order.dueDate ? (
                                                <span className="flex items-center gap-2">
                                                    <Clock className="h-3.5 w-3.5 text-blue-500" />
                                                    {new Date(order.dueDate).toLocaleDateString()}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground italic text-xs">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => openConvertToBillModal(order)} className="text-emerald-600 font-medium cursor-pointer">
                                                        <Receipt className="mr-2 h-4 w-4" /> Convert to Client Bill
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleReuseOffer(order)} className="text-blue-600 font-medium cursor-pointer">
                                                        <Files className="mr-2 h-4 w-4" /> Reuse
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDownloadOfferPDF(order)} className="cursor-pointer">
                                                        <Printer className="mr-2 h-4 w-4" /> Download Quotation PDF
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleCreateChalanFromOffer(order)} className="cursor-pointer">
                                                        <Truck className="mr-2 h-4 w-4" /> Create Delivery Chalan
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/admin/manage-custom-orders/edit/${order.shareableSlug}`}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit Order Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => copyLink(order.shareableSlug)}>
                                                        <Copy className="mr-2 h-4 w-4" /> Copy Share Link
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/proposal/${order.shareableSlug}`} target="_blank">
                                                            <FileText className="mr-2 h-4 w-4" /> View Live Proposal
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleDelete(order.shareableSlug)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete Order
                                                    </DropdownMenuItem>

                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuLabel>Update Status</DropdownMenuLabel>

                                                    {ALL_STATUSES.map(s => (
                                                        <DropdownMenuItem
                                                            key={s}
                                                            onClick={() => handleStatusChange(order.shareableSlug, s)}
                                                            disabled={order.status === s}
                                                            className="capitalize"
                                                        >
                                                            {s === "accepted" || s === "completed" || s === "delivered" ? <CheckCircle className="mr-2 h-4 w-4" /> :
                                                                s === "paid" ? <DollarSign className="mr-2 h-4 w-4" /> :
                                                                    s === "canceled" ? <XCircle className="mr-2 h-4 w-4" /> :
                                                                        <RefreshCcw className="mr-2 h-4 w-4" />
                                                            }
                                                            Mark as {s}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Convert to Client Bill Modal */}
            <Dialog open={!!convertOrder} onOpenChange={(o) => !o && setConvertOrder(null)}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Convert Offer to Client Bill</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleConvertToBillSubmit} className="space-y-5 py-2">
                        <ClientAutoSuggestFields
                            clientName={billClientName}
                            setClientName={setBillClientName}
                            clientEmail={billClientEmail}
                            setClientEmail={setBillClientEmail}
                            clientPhone={billClientPhone}
                            setClientPhone={setBillClientPhone}
                            clientAddress={billClientAddress}
                            setClientAddress={setBillClientAddress}
                            businessName={billBusinessName}
                            setBusinessName={setBillBusinessName}
                            suggestions={suggestions}
                        />

                        <ProposalItemsSection
                            items={billItems}
                            setItems={setBillItems}
                            serviceCharge={billServiceCharge}
                            setServiceCharge={setBillServiceCharge}
                            discountType={billDiscountType}
                            setDiscountType={setBillDiscountType}
                            discountValue={billDiscountValue}
                            setDiscountValue={setBillDiscountValue}
                            currency={billCurrency}
                            projects={projects}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-xl border">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Previous Due</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={billPrevDue}
                                    onChange={(e) => setBillPrevDue(Math.max(0, Number(e.target.value)))}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Paid Amount (Cash In)</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={billCashIn}
                                    onChange={(e) => setBillCashIn(Math.max(0, Number(e.target.value)))}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Renew Date</Label>
                                <Input
                                    type="date"
                                    value={billRenewDate}
                                    onChange={(e) => setBillRenewDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Renew Fee</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={billRenewFee}
                                    onChange={(e) => setBillRenewFee(Math.max(0, Number(e.target.value)))}
                                />
                            </div>
                            <div className="md:col-span-4 flex flex-wrap justify-between items-center pt-2 border-t text-sm">
                                <span>Grand Total: <strong>{billCurrency === "USD" ? "$" : "৳"}{billGrandTotal.toLocaleString()}</strong></span>
                                <span className={billDue > 0 ? "text-red-600 font-bold" : "text-emerald-600 font-bold"}>
                                    Remaining Due: {billCurrency === "USD" ? "$" : "৳"}{billDue.toLocaleString()} ({billDue <= 0 ? "Paid" : "Due"})
                                </span>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setConvertOrder(null)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={convertLoading}>
                                {convertLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Create Client Bill
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageCustomOrdersClient;
