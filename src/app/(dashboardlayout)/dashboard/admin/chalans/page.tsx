"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, Plus, Trash2, Printer, Search, MoreVertical, Truck, Edit } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import ClientAutoSuggestFields from "@/components/admin/ClientAutoSuggestFields";
import { generateBillPDF } from "@/lib/bill-invoice-generator";

interface ChalanItem {
  name: string;
  description?: string;
  quantity: number;
}

export default function ManageChalansPage() {
  const [chalans, setChalans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [items, setItems] = useState<ChalanItem[]>([{ name: "", description: "", quantity: 1 }]);

  const fetchChalans = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/bills?type=chalan");
      if (res.ok) {
        const data = await res.json();
        setChalans(Array.isArray(data) ? data : []);
      }
    } catch {
      toast.error("Failed to load delivery chalans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChalans();
    fetch("/api/admin/suggest-clients")
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (res?.success) setSuggestions(res.data || []);
      })
      .catch(() => {});
  }, []);

  const openCreate = () => {
    setEditing(null);
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setClientAddress("");
    setBusinessName("");
    setExpectedDeliveryDate("");
    setItems([{ name: "", description: "", quantity: 1 }]);
    setIsOpen(true);
  };

  const openEdit = (chalan: any) => {
    setEditing(chalan);
    setClientName(chalan.clientName || "");
    setClientEmail(chalan.clientEmail || "");
    setClientPhone(chalan.clientPhone || "");
    setClientAddress(chalan.clientAddress || "");
    setBusinessName(chalan.businessName || "");
    setExpectedDeliveryDate(
      chalan.expectedDeliveryDate
        ? new Date(chalan.expectedDeliveryDate).toISOString().split("T")[0]
        : ""
    );
    setItems(
      Array.isArray(chalan.items) && chalan.items.length > 0
        ? chalan.items.map((it: any) => ({
            name: it.name || "",
            description: it.description || "",
            quantity: Number(it.quantity || 1),
          }))
        : [{ name: "", description: "", quantity: 1 }]
    );
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !clientAddress.trim()) {
      toast.error("Please fill in Client Name, Phone and Address");
      return;
    }
    if (items.some((it) => !it.name.trim() || it.quantity < 1)) {
      toast.error("Please complete all delivery items");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        clientName,
        clientEmail,
        clientPhone,
        clientAddress,
        businessName,
        expectedDeliveryDate: expectedDeliveryDate || undefined,
        items: items.map((it) => ({ ...it, price: 0 })),
        subtotal: 0,
        total: 0,
        gTotal: 0,
        status: "Paid",
        documentType: "chalan",
      };

      const url = editing ? `/api/admin/bills/${editing._id}` : "/api/admin/bills";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editing ? "Delivery Chalan updated!" : "Delivery Chalan created!");
        setIsOpen(false);
        fetchChalans();
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to save Delivery Chalan");
      }
    } catch {
      toast.error("Error saving Delivery Chalan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Delete Delivery Chalan?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, delete",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/bills/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Delivery Chalan deleted");
        fetchChalans();
      } else {
        toast.error("Failed to delete Delivery Chalan");
      }
    } catch {
      toast.error("Error deleting Delivery Chalan");
    }
  };

  const filtered = chalans.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      (c.invoiceNo || "").toLowerCase().includes(q) ||
      (c.clientName || "").toLowerCase().includes(q) ||
      (c.clientPhone || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Truck className="w-7 h-7 text-primary" />
            Delivery Chalans
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create and print goods/service delivery chalans without pricing
          </p>
        </div>
        <Button onClick={openCreate} className="gap-1.5">
          <Plus className="w-4 h-4" />
          Create Delivery Chalan
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search chalan no, client, phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-16 flex justify-center">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              No delivery chalans found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chalan No</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((chalan) => (
                  <TableRow key={chalan._id}>
                    <TableCell className="font-bold text-primary">#{chalan.invoiceNo}</TableCell>
                    <TableCell>
                      <div className="font-semibold">{chalan.clientName}</div>
                      <div className="text-xs text-muted-foreground">
                        {chalan.clientPhone} • {chalan.clientAddress}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {(chalan.items || []).map((it: any, i: number) => (
                          <div key={i}>
                            {it.name} <span className="text-muted-foreground">× {it.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {chalan.expectedDeliveryDate
                        ? new Date(chalan.expectedDeliveryDate).toLocaleDateString()
                        : new Date(chalan.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => generateBillPDF({ ...chalan, documentType: "chalan" }, {}, "download")}
                            className="cursor-pointer"
                          >
                            <Printer className="w-4 h-4 mr-2 text-emerald-600" />
                            Print / Download Chalan PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(chalan)} className="cursor-pointer">
                            <Edit className="w-4 h-4 mr-2 text-blue-600" />
                            Edit Chalan
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(chalan._id)}
                            className="cursor-pointer text-rose-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Edit Delivery Chalan #${editing.invoiceNo}` : "Create Delivery Chalan"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
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
            />

            <div className="space-y-1.5">
              <Label>Delivery Date (Optional)</Label>
              <Input
                type="date"
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="font-semibold">Items / Deliverables *</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setItems((p) => [...p, { name: "", description: "", quantity: 1 }])}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Item
                </Button>
              </div>
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-end p-2.5 rounded-lg border bg-muted/20">
                  <div className="col-span-6 space-y-1">
                    <Label className="text-xs">Item Name *</Label>
                    <Input
                      placeholder="Item or deliverable name"
                      value={item.name}
                      onChange={(e) =>
                        setItems((p) => p.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)))
                      }
                      required
                    />
                  </div>
                  <div className="col-span-3 space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Input
                      placeholder="Note (optional)"
                      value={item.description || ""}
                      onChange={(e) =>
                        setItems((p) => p.map((x, i) => (i === idx ? { ...x, description: e.target.value } : x)))
                      }
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Qty</Label>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        setItems((p) =>
                          p.map((x, i) => (i === idx ? { ...x, quantity: Math.max(1, Number(e.target.value)) } : x))
                        )
                      }
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      disabled={items.length <= 1}
                      onClick={() => setItems((p) => p.filter((_, i) => i !== idx))}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editing ? "Update Chalan" : "Save Chalan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

