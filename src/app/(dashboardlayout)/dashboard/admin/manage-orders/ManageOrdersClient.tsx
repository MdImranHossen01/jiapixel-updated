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
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

// Define the Order type according to your model
interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  service: {
    title: string;
  };
  status: "pending" | "processing" | "completed" | "cancelled";
  total: number;
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
        toast.success("Order status updated");
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
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success('Order deleted successfully');
                fetchOrders();
            } else {
                toast.error('Failed to delete order');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the order');
        }
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order._id}>
            <TableCell>
              <div>{order.user.name}</div>
              <div className="text-sm text-gray-500">{order.user.email}</div>
            </TableCell>
            <TableCell>{order.service.title}</TableCell>
            <TableCell>${order.total}</TableCell>
            <TableCell>
              <Badge
                variant={
                  order.status === "completed"
                    ? "default"
                    : order.status === "pending"
                    ? "secondary"
                    : "destructive"
                }
              >
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
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
                    onClick={() => handleStatusChange(order._id, "processing")}
                  >
                    Mark as Processing
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
                  <DropdownMenuItem onClick={() => handleDelete(order._id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ManageOrdersClient;