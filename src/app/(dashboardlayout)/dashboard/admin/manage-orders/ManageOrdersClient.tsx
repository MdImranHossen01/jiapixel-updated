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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

interface Order {
  _id: string;
  user: string | {
    name: string;
    email: string;
  };
  service: string | {
    title: string;
  };
  tier?: { // Make tier optional
    title: string;
    price: number;
    deliveryDays: number;
  };
  status: "pending" | "confirmed" | "processing" | "under reviews" | "cancelled" | "completed";
  total: number;
  orderNumber: string;
  createdAt: string;
}

const ManageOrdersClient = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        toast.error("Failed to fetch orders");
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

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
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

  const handleDelete = async (orderId: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          toast.success("Order deleted successfully");
          fetchOrders();
        } else {
          toast.error("Failed to delete order");
        }
      } catch (error) {
        toast.error("An error occurred while deleting the order");
      }
    }
  };

  const getStatusVariant = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "default";
      case "processing":
      case "under reviews":
        return "secondary";
      case "pending":
      case "confirmed":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Helper function to get user display info
  const getUserDisplay = (order: Order) => {
    if (typeof order.user === 'object' && order.user !== null && 'name' in order.user) {
      return {
        name: order.user.name,
        email: order.user.email
      };
    } else {
      return {
        name: 'User',
        email: 'Loading...'
      };
    }
  };

  // Helper function to get service display info
  const getServiceDisplay = (order: Order) => {
    if (typeof order.service === 'object' && order.service !== null && 'title' in order.service) {
      return order.service.title;
    } else {
      return 'Service';
    }
  };

  // Helper function to get tier display info
  const getTierDisplay = (order: Order) => {
    if (order.tier && order.tier.title) {
      return {
        title: order.tier.title,
        deliveryDays: order.tier.deliveryDays || 0
      };
    } else {
      return {
        title: 'Package',
        deliveryDays: 0
      };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Package</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => {
              const userInfo = getUserDisplay(order);
              const serviceTitle = getServiceDisplay(order);
              const tierInfo = getTierDisplay(order);

              return (
                <TableRow key={order._id}>
                  <TableCell className="font-mono text-sm">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{userInfo.name}</div>
                    <div className="text-sm text-muted-foreground">{userInfo.email}</div>
                  </TableCell>
                  <TableCell className="font-medium">{serviceTitle}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{tierInfo.title}</div>
                      <div className="text-muted-foreground">{tierInfo.deliveryDays} days delivery</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">${order.total}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
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
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(order._id, "confirmed")}
                        >
                          Mark as Confirmed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(order._id, "processing")}
                        >
                          Mark as Processing
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(order._id, "under reviews")}
                        >
                          Mark as Under Review
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(order._id, "completed")}
                        >
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(order._id, "cancelled")}
                        >
                          Mark as Cancelled
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(order._id)}
                          className="text-red-600"
                        >
                          Delete Order
                        </DropdownMenuItem>
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
  );
};

export default ManageOrdersClient;