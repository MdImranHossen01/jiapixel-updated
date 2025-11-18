"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Order {
  _id: string;
  service: string; // Service is now string ID (not populated)
  tier: {
    title: string;
    price: number;
    deliveryDays: number;
    revisions: number;
  };
  status: string;
  total: number;
  orderNumber: string;
  createdAt: string;
}

const MyOrdersClient = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/users/my-orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          toast.error("Failed to fetch your orders.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "processing": case "under reviews": return "secondary";
      case "pending": case "confirmed": return "outline";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/4 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
              <div className="flex justify-between items-center mt-4">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
        <Link href="/services">
          <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md">
            Browse Services
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <Card key={order._id} className="overflow-hidden">
          <CardHeader>
            <CardTitle className="truncate">Order #{order.orderNumber}</CardTitle>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Package: <span className="font-medium">{order.tier.title}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Ordered: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">${order.total}</span>
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status}
                </Badge>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Delivery: {order.tier.deliveryDays} days</span>
                <span>Revisions: {order.tier.revisions}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyOrdersClient;