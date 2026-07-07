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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface CustomOrder {
    _id: string;
    shareableSlug: string;
    title: string;
    admin: { name: string; email: string; } | string;
    status: "proposed" | "accepted" | "pending" | "paid" | "processing" | "delivered" | "under review" | "completed";
    price?: number;
    currency?: "USD" | "BDT";
    dueDate?: string;
    createdAt: string;
}

export default function ClientCustomOrdersTable() {
    const [orders, setOrders] = useState<CustomOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("/api/custom-orders");
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data.orders || []);
                } else {
                    toast.error("Failed to fetch your custom orders");
                }
            } catch (error) {
                toast.error("An error occurred while loading your orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

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
            default:
                return "outline";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8 bg-card rounded-lg border">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-muted-foreground">Loading your custom projects...</span>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-card rounded-lg shadow p-6 border text-center py-10">
                <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <h2 className="text-xl font-semibold mb-2 text-card-foreground">No Custom Projects Found</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    You don't have any active custom project proposals. Use the services estimator to request one or contact an admin!
                </p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-lg shadow border overflow-hidden">
            <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-card-foreground">Your Custom Projects</h2>
                <p className="text-sm text-muted-foreground mt-1">Track the progress of your bespoke service agreements.</p>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Project Title</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order._id}>
                            <TableCell className="font-medium">
                                {order.title}
                                <div className="text-xs text-muted-foreground mt-1">Date: {new Date(order.createdAt).toLocaleDateString()}</div>
                            </TableCell>
                            <TableCell className="font-bold">
                                {order.price ? `${order.currency === "BDT" ? "৳" : "$"}${order.price.toLocaleString()}` : 'TBD'}
                            </TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(order.status)} className="capitalize">
                                    {order.status}
                                </Badge>
                                {order.status === "proposed" && (
                                    <div className="text-[10px] text-orange-500 font-medium mt-1">Awaiting your approval</div>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <Link href={`/proposal/${order.shareableSlug}`}>
                                    <Button variant="secondary" size="sm" className="gap-2">
                                        {order.status === "proposed" ? "Review Proposal" : "View Details"}
                                        <ExternalLink className="w-3 h-3" />
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
