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
import { MoreHorizontal, FileText, CheckCircle, RefreshCcw, DollarSign, PackageCheck, Copy, Trash2, Edit, Search, Filter, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface CustomOrder {
    _id: string;
    shareableSlug: string;
    title: string;
    client: { name: string; email: string; } | string;
    admin: { name: string; email: string; } | string;
    status: "proposed" | "accepted" | "pending" | "paid" | "processing" | "delivered" | "under review" | "completed" | "canceled";
    price?: number;
    isSubscription: boolean;
    dueDate?: string;
    createdAt: string;
}

const ALL_STATUSES = [
    "proposed", "accepted", "pending", "paid",
    "processing", "delivered", "under review", "completed", "canceled"
];

const ManageCustomOrdersClient = () => {
    const [orders, setOrders] = useState<CustomOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (typeof order.client === 'object' && order.client?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (typeof order.client === 'object' && order.client?.email?.toLowerCase().includes(searchTerm.toLowerCase()));

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
        if (!confirm("Are you sure you want to delete this custom order? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/custom-orders/${slug}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Custom order deleted successfully");
                fetchOrders();
            } else {
                toast.error("Failed to delete custom order");
            }
        } catch (error) {
            toast.error("An error occurred while deleting the order");
        }
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
                            <TableHead>Type</TableHead>
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
                                const clientInfo = getUserDisplay(order.client);

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
                                            {order.price ? `$${order.price.toLocaleString()}` : 'TBD'}
                                        </TableCell>
                                        <TableCell>
                                            {order.isSubscription ? (
                                                <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">Recurring</Badge>
                                            ) : (
                                                <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">One-Time</Badge>
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
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
        </div>
    );
};

export default ManageCustomOrdersClient;
