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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  Plus,
  Trash2,
  Printer,
  DollarSign,
  Search,
  CreditCard,
  FileText,
  Briefcase,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Eye,
  ChevronDown,
  MoreVertical,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface BillItemInput {
  name: string;
  quantity: number;
  price: number;
}

export default function ManageBillsClient() {
  const [bills, setBills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selected Bill for viewing/printing
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form states
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [billItems, setBillItems] = useState<BillItemInput[]>([
    { name: "", quantity: 1, price: 0 }
  ]);
  const [serviceCharge, setServiceCharge] = useState<number>(0);
  const [discountType, setDiscountType] = useState<"fixed" | "percentage">("fixed");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [prevDue, setPrevDue] = useState<number>(0);
  const [cashIn, setCashIn] = useState<number>(0);
  const [renewDate, setRenewDate] = useState("");
  const [billStatus, setBillStatus] = useState<"Paid" | "Due">("Due");
  const [currency, setCurrency] = useState<"BDT" | "USD">("BDT");
  const [adminNote, setAdminNote] = useState("");
  const [selectedProjects, setSelectedProjects] = useState<Record<string, boolean>>({});
  const [projectPickerOpen, setProjectPickerOpen] = useState(false);
  const [projectSearchTerm, setProjectSearchTerm] = useState("");

  useEffect(() => {
    fetchBills();
    fetchProjects();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/bills?filter=all");
      if (!res.ok) throw new Error("Failed to fetch bills");
      const data = await res.json();
      setBills(data);
    } catch (error) {
      toast.error("Failed to load bills");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects?limit=100");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const handleUpdateStatus = async (billId: string, currentDue: number) => {
    const { value: paidAmount } = await Swal.fire({
      title: "Update Payment Cash-in",
      input: "number",
      inputLabel: "Amount Paid (৳)",
      inputValue: currentDue,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value || isNaN(Number(value)) || Number(value) < 0) {
          return "Please enter a valid positive amount";
        }
      }
    });

    if (paidAmount !== undefined) {
      try {
        const amount = Number(paidAmount);
        const bill = bills.find(b => b._id === billId);
        if (!bill) return;

        const newCashIn = (bill.cashIn || 0) + amount;
        const newDue = Math.max(0, bill.gTotal - newCashIn);
        const newStatus = newDue <= 0 ? "Paid" : "Due";

        const res = await fetch(`/api/admin/bills/${billId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cashIn: newCashIn,
            currentBillDue: newDue,
            status: newStatus
          })
        });

        if (!res.ok) throw new Error("Failed to update bill");
        toast.success("Payment updated successfully");
        fetchBills();
      } catch (error) {
        toast.error("Failed to update payment");
      }
    }
  };

  // Calculations for current form invoice
  const subtotal = billItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = discountType === "percentage"
    ? Math.round((subtotal * discountValue) / 100)
    : discountValue;
  const total = Math.max(0, subtotal + serviceCharge - discount);
  const gTotal = total + prevDue;
  const currentBillDue = Math.max(0, gTotal - cashIn);
  const calculatedStatus = currentBillDue <= 0 ? "Paid" : "Due";
  const currencySymbol = currency === "USD" ? "$" : "৳";

  const getCurrencySymbol = (curr?: string) => curr === "USD" ? "$" : "৳";
  const cleanWhatsApp = (num?: string) => num ? num.replace(/[^\d]/g, "") : "";

  // Cumulative Metrics calculated from all bills
  const bdtTotalBilled = bills.filter(b => b.currency !== "USD").reduce((sum, b) => sum + (b.gTotal || 0), 0);
  const bdtTotalCollected = bills.filter(b => b.currency !== "USD").reduce((sum, b) => sum + (b.cashIn || 0), 0);
  const bdtAccountsReceivable = bills.filter(b => b.currency !== "USD").reduce((sum, b) => sum + (b.currentBillDue || 0), 0);

  const usdTotalBilled = bills.filter(b => b.currency === "USD").reduce((sum, b) => sum + (b.gTotal || 0), 0);
  const usdTotalCollected = bills.filter(b => b.currency === "USD").reduce((sum, b) => sum + (b.cashIn || 0), 0);
  const usdAccountsReceivable = bills.filter(b => b.currency === "USD").reduce((sum, b) => sum + (b.currentBillDue || 0), 0);

  // Invoices renewing in next 30 days (inclusive of today)
  const upcomingRenewals = bills.filter((b) => {
    if (!b.renewDate) return false;
    const renew = new Date(b.renewDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(today.getDate() + 30);
    thirtyDaysLater.setHours(23, 59, 59, 999);

    return renew >= today && renew <= thirtyDaysLater;
  });

  const upcomingRenewalsCount = upcomingRenewals.length;
  const bdtUpcomingRenewalsAmount = upcomingRenewals.filter(b => b.currency !== "USD").reduce((sum, b) => sum + (b.currentBillDue || 0), 0);
  const usdUpcomingRenewalsAmount = upcomingRenewals.filter(b => b.currency === "USD").reduce((sum, b) => sum + (b.currentBillDue || 0), 0);

  // Client-side search and status filter
  const filteredBills = bills.filter((b) => {
    const matchesSearch =
      b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.clientEmail && b.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.clientPhone && b.clientPhone.includes(searchTerm)) ||
      (b.invoiceNo && b.invoiceNo.includes(searchTerm));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "paid" && b.status === "Paid") ||
      (statusFilter === "due" && b.status === "Due");

    return matchesSearch && matchesStatus;
  });

  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjects(prev => {
      const copy = { ...prev };
      if (copy[projectId]) {
        delete copy[projectId];
      } else {
        copy[projectId] = true;
      }
      return copy;
    });
  };

  const handleAddSelectedProjects = () => {
    const newItems: BillItemInput[] = [];

    Object.keys(selectedProjects).forEach((projectId) => {
      const project = projects.find(p => p._id === projectId);
      if (!project) return;

      newItems.push({ name: project.title, price: 0, quantity: 1 });
    });

    if (newItems.length === 0) return;

    if (billItems.length === 1 && billItems[0].name === "" && billItems[0].price === 0) {
      setBillItems(newItems);
    } else {
      const existingNames = billItems.map(item => item.name);
      const filteredNewItems = newItems.filter(item => !existingNames.includes(item.name));
      if (filteredNewItems.length > 0) {
        setBillItems(prev => [...prev, ...filteredNewItems]);
      }
    }

    setSelectedProjects({});
    setProjectPickerOpen(false);
    setProjectSearchTerm("");
  };

  const addBillItem = () => {
    setBillItems(prev => [...prev, { name: "", quantity: 1, price: 0 }]);
  };

  const removeBillItem = (index: number) => {
    if (billItems.length === 1) return;
    setBillItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof BillItemInput, value: any) => {
    setBillItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const openCreateModal = () => {
    setEditingBill(null);
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setClientAddress("");
    setBusinessName("");
    setBillItems([{ name: "", quantity: 1, price: 0 }]);
    setServiceCharge(0);
    setDiscountType("fixed");
    setDiscountValue(0);
    setPrevDue(0);
    setCashIn(0);
    setRenewDate("");
    setBillStatus("Due");
    setCurrency("BDT");
    setAdminNote("");
    setSelectedProjects({});
    setProjectPickerOpen(false);
    setProjectSearchTerm("");
    setIsCreateOpen(true);
  };

  const openEditModal = (bill: any) => {
    setEditingBill(bill);
    setClientName(bill.clientName);
    setClientEmail(bill.clientEmail || "");
    setClientPhone(bill.clientPhone);
    setClientAddress(bill.clientAddress);
    setBusinessName(bill.businessName || "");
    setBillItems(bill.items.map((it: any) => ({ name: it.name, quantity: it.quantity, price: it.price })));
    setServiceCharge(bill.serviceCharge || 0);
    setDiscountType(bill.discountType || "fixed");
    setDiscountValue(bill.discountValue || 0);
    setPrevDue(bill.prevDue || 0);
    setCashIn(bill.cashIn || 0);
    setRenewDate(bill.renewDate ? new Date(bill.renewDate).toISOString().split("T")[0] : "");
    setBillStatus(bill.status);
    setCurrency(bill.currency || "BDT");
    setAdminNote(bill.adminNote || "");
    setSelectedProjects({});
    setProjectPickerOpen(false);
    setProjectSearchTerm("");
    setIsCreateOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone || !clientAddress) {
      toast.error("Please fill in client details");
      return;
    }

    if (billItems.some(it => !it.name || it.price < 0 || it.quantity < 1)) {
      toast.error("Please complete all service items correctly");
      return;
    }

    setFormLoading(true);

    const payload = {
      clientName,
      clientEmail,
      clientPhone,
      clientAddress,
      businessName,
      items: billItems,
      subtotal,
      serviceCharge,
      discountType,
      discountValue,
      discount,
      total,
      prevDue,
      gTotal,
      cashIn,
      currentBillDue,
      status: calculatedStatus,
      renewDate: renewDate ? new Date(renewDate) : undefined,
      currency,
      adminNote,
    };

    try {
      const url = editingBill ? `/api/admin/bills/${editingBill._id}` : "/api/admin/bills";
      const method = editingBill ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save bill");

      toast.success(editingBill ? "Invoice updated successfully" : "Invoice created successfully");
      setIsCreateOpen(false);
      fetchBills();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteBill = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this invoice!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3b82f6",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/admin/bills/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete bill");
        toast.success("Invoice deleted successfully");
        fetchBills();
      } catch (error) {
        toast.error("Failed to delete invoice");
      }
    }
  };

  const printInvoice = () => {
    const printContent = document.getElementById("invoice-print-area")?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>Invoice - ${selectedBill?.invoiceNo}</title>
              <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
              <style>
                body { font-family: sans-serif; padding: 20px; }
                .text-primary { color: oklch(0.648 0.2 131.684); }
                @media print {
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body onload="window.print(); window.close();">
              ${printContent}
            </body>
          </html>
        `);
        win.document.close();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Billing System</h1>
          <p className="text-muted-foreground mt-1">Generate and manage invoices, renew dates, service charges, and customer dues.</p>
        </div>
        <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Invoice
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-lg font-bold text-gray-800 dark:text-gray-200">৳{bdtTotalBilled.toLocaleString()} BDT</div>
            <div className="text-lg font-bold text-blue-700 dark:text-blue-400">${usdTotalBilled.toLocaleString()} USD</div>
            <p className="text-xs text-muted-foreground pt-1">Cumulative client invoicing</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected (Cash-in)</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-lg font-bold text-gray-800 dark:text-gray-200">৳{bdtTotalCollected.toLocaleString()} BDT</div>
            <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400">${usdTotalCollected.toLocaleString()} USD</div>
            <p className="text-xs text-muted-foreground pt-1">Payments received</p>
          </CardContent>
        </Card>
        <Card className="bg-rose-500/5 border-rose-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accounts Receivable</CardTitle>
            <CreditCard className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-lg font-bold text-gray-800 dark:text-gray-200">৳{bdtAccountsReceivable.toLocaleString()} BDT</div>
            <div className="text-lg font-bold text-rose-700 dark:text-rose-400">${usdAccountsReceivable.toLocaleString()} USD</div>
            <p className="text-xs text-muted-foreground pt-1">Outstanding due balances</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Renewals (30 Days)</CardTitle>
            <Calendar className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-lg font-bold text-gray-800 dark:text-gray-200">৳{bdtUpcomingRenewalsAmount.toLocaleString()} BDT</div>
            <div className="text-lg font-bold text-amber-700 dark:text-amber-400">${usdUpcomingRenewalsAmount.toLocaleString()} USD</div>
            <p className="text-xs text-muted-foreground pt-1">{upcomingRenewalsCount} invoice(s) due</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search name, phone or bill no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {["all", "paid", "due"].map((filter) => (
            <Button
              key={filter}
              variant={statusFilter === filter ? "default" : "outline"}
              onClick={() => setStatusFilter(filter)}
              className="capitalize font-bold"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 font-medium text-gray-600 dark:text-gray-400">Loading invoices...</span>
            </div>
          ) : filteredBills.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Invoices Found</h3>
              <p className="text-muted-foreground">Get started by creating a new invoice.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-950">
                  <TableHead className="w-[100px] font-bold">Invoice No</TableHead>
                  <TableHead className="font-bold">Client</TableHead>
                  <TableHead className="font-bold">Services</TableHead>
                  <TableHead className="font-bold text-right">Grand Total</TableHead>
                  <TableHead className="font-bold text-right">Paid</TableHead>
                  <TableHead className="font-bold text-right">Due</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Renew Date</TableHead>
                  <TableHead className="font-bold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBills.map((bill) => (
                  <TableRow key={bill._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30">
                    <TableCell className="font-medium">
                      <button
                        onClick={() => {
                          setSelectedBill(bill);
                          setIsViewOpen(true);
                        }}
                        className="font-bold text-blue-600 dark:text-blue-400 hover:underline underline-offset-2 transition-colors"
                        title="View Invoice Details"
                      >
                        #{bill.invoiceNo}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-gray-900 dark:text-white">{bill.clientName}</div>
                      {bill.businessName && <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">{bill.businessName}</div>}
                      <div className="text-xs text-muted-foreground">{bill.clientEmail}</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                        <a href={`https://wa.me/${cleanWhatsApp(bill.clientPhone)}`} target="_blank" rel="noopener noreferrer">
                          WhatsApp: {bill.clientPhone}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate text-sm" title={bill.items.map((i: any) => i.name).join(", ")}>
                        {bill.items.map((i: any) => i.name).join(", ")}
                      </div>
                      <div className="text-xs text-muted-foreground">{bill.items.length} service(s)</div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-gray-900 dark:text-white">{getCurrencySymbol(bill.currency)}{bill.gTotal?.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-emerald-600 dark:text-emerald-400">{getCurrencySymbol(bill.currency)}{bill.cashIn?.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-semibold text-rose-600 dark:text-rose-400">{getCurrencySymbol(bill.currency)}{bill.currentBillDue?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={bill.status === "Paid" ? "default" : "destructive"}>
                        {bill.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {bill.renewDate ? (
                        <div className="flex items-center gap-1.5 text-sm">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{new Date(bill.renewDate).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                              <MoreVertical className="w-4 h-4 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedBill(bill);
                                setIsViewOpen(true);
                              }}
                              className="cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                              <span>View / Print</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openEditModal(bill)}
                              className="cursor-pointer"
                            >
                              <DollarSign className="w-4 h-4 mr-2 text-amber-600 dark:text-amber-400" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            {bill.status === "Due" && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(bill._id, bill.currentBillDue)}
                                className="cursor-pointer"
                              >
                                <CreditCard className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                                <span>Collect Payment</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDeleteBill(bill._id)}
                              className="cursor-pointer text-rose-600 focus:text-rose-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Invoice Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingBill ? `Edit Invoice #${editingBill.invoiceNo}` : "Create New Invoice"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {/* Client Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-100 dark:border-gray-900">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="clientName"
                    placeholder="Enter client's full name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name (Optional)</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="businessName"
                    placeholder="Enter business name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientEmail">Client Email (assigned login account)</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="Enter client's email for login association"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientPhone">WhatsApp Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="clientPhone"
                    placeholder="Enter WhatsApp number (e.g. 8801919011101)"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={(val: any) => setCurrency(val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BDT">BDT (৳)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientAddress">Client Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="clientAddress"
                    placeholder="Enter billing address"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="adminNote">Internal Admin Note (Hidden from Client / Invoice)</Label>
                <textarea
                  id="adminNote"
                  placeholder="Enter internal notes, references, or instructions about this client/invoice..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {/* Project Multi-Select Section */}
            <div className="bg-gray-50/70 dark:bg-gray-900/40 p-4 rounded-xl space-y-3 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-500" /> Select Projects to Add (Optional)
                </Label>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setProjectPickerOpen(v => !v)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-500 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <span>Click to browse projects...</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${projectPickerOpen ? "rotate-180" : ""}`} />
              </Button>

              {projectPickerOpen && (
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950 shadow-sm overflow-hidden p-3 space-y-3">
                  {/* Search Input & Add Button */}
                  <div className="flex gap-2 items-center">
                    <Input
                      type="text"
                      placeholder="Search projects..."
                      value={projectSearchTerm}
                      onChange={(e) => setProjectSearchTerm(e.target.value)}
                      className="flex-1 text-sm bg-white dark:bg-gray-950 h-9"
                    />
                    <Button
                      type="button"
                      onClick={handleAddSelectedProjects}
                      disabled={Object.keys(selectedProjects).length === 0}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 text-xs shrink-0 flex items-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add ({Object.keys(selectedProjects).length})
                    </Button>
                  </div>

                  {/* Project Checkboxes */}
                  <div className="border border-gray-200 dark:border-gray-850 rounded-lg p-3 max-h-56 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/30 space-y-1">
                    {projects.length > 0 ? (
                      projects
                        .filter(p => p.title.toLowerCase().includes(projectSearchTerm.toLowerCase()))
                        .map((project) => {
                          const isSelected = !!selectedProjects[project._id];
                          return (
                            <label
                              key={project._id}
                              className={`flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors ${
                                isSelected ? "bg-blue-500/10 dark:bg-blue-900/20" : ""
                              }`}
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleProjectSelection(project._id)}
                                className="h-4 w-4"
                              />
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{project.title}</span>
                            </label>
                          );
                        })
                    ) : (
                      <p className="text-muted-foreground text-sm text-center py-4">No projects found</p>
                    )}
                    {projects.length > 0 && projects.filter(p => p.title.toLowerCase().includes(projectSearchTerm.toLowerCase())).length === 0 && (
                      <p className="text-muted-foreground text-sm text-center py-4">No projects match search</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Service Items Section */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-500" /> Invoice Items
                </h3>
                <Button type="button" onClick={addBillItem} variant="outline" size="sm" className="flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add Custom Item
                </Button>
              </div>

              <div className="space-y-3">
                {billItems.map((item, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row items-end gap-3 bg-gray-50/50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="w-full md:flex-1 space-y-1">
                      <Label className="text-xs">Item Description / Custom Name</Label>
                      <Input
                        placeholder="Type item description..."
                        value={item.name}
                        onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                        required
                        className="h-9"
                      />
                    </div>

                    <div className="w-full md:w-20 space-y-1">
                      <Label className="text-xs">Qty</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, "quantity", parseInt(e.target.value) || 1)}
                        required
                        className="h-9"
                      />
                    </div>

                    <div className="w-full md:w-32 space-y-1">
                      <Label className="text-xs">Price ({currencySymbol})</Label>
                      <Input
                        type="number"
                        min="0"
                        value={item.price}
                        onChange={(e) => handleItemChange(idx, "price", parseFloat(e.target.value) || 0)}
                        required
                        className="h-9"
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBillItem(idx)}
                      disabled={billItems.length === 1}
                      className="text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations & Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceCharge">Maintenance ({currencySymbol})</Label>
                    <Input
                      id="serviceCharge"
                      type="number"
                      min="0"
                      value={serviceCharge}
                      onChange={(e) => setServiceCharge(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="renewDate">Renew Date (Optional)</Label>
                    <div className="relative">
                      <Input
                        id="renewDate"
                        type="date"
                        value={renewDate}
                        onChange={(e) => setRenewDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 items-end">
                  <div className="col-span-1 space-y-2">
                    <Label>Discount Type</Label>
                    <Select value={discountType} onValueChange={(val: any) => setDiscountType(val)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed ({currencySymbol})</SelectItem>
                        <SelectItem value="percentage">Percent (%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label>Discount Value</Label>
                    <Input
                      type="number"
                      min="0"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prevDue">Previous Due ({currencySymbol})</Label>
                    <Input
                      id="prevDue"
                      type="number"
                      min="0"
                      value={prevDue}
                      onChange={(e) => setPrevDue(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cashIn">Cash In / Paid ({currencySymbol})</Label>
                    <Input
                      id="cashIn"
                      type="number"
                      min="0"
                      value={cashIn}
                      onChange={(e) => setCashIn(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              {/* Summary Block */}
              <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-xl border border-gray-150 dark:border-gray-900 flex flex-col justify-between">
                <div className="space-y-3">
                  <h4 className="text-md font-bold text-gray-900 dark:text-white border-b pb-2 mb-2">Invoice Summary</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">{currencySymbol}{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Maintenance:</span>
                    <span className="font-medium">+ {currencySymbol}{serviceCharge.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                      <span>Discount ({discountType === "percentage" ? `${discountValue}%` : "Fixed"}):</span>
                      <span>- {currencySymbol}{discount.toLocaleString()}</span>
                    </div>
                  )}
                  {prevDue > 0 && (
                    <div className="flex justify-between text-sm text-rose-600 dark:text-rose-400">
                      <span>Previous Due:</span>
                      <span>+ {currencySymbol}{prevDue.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white border-t pt-2 mt-2">
                    <span>Grand Total:</span>
                    <span>{currencySymbol}{gTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    <span>Paid Amount:</span>
                    <span>{currencySymbol}{cashIn.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-extrabold text-rose-600 dark:text-rose-400 border-t border-dashed pt-2 mt-2">
                    <span>Current Due:</span>
                    <span>{currencySymbol}{currentBillDue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-sm">
                  <span>Calculated Status:</span>
                  <Badge variant={calculatedStatus === "Paid" ? "default" : "destructive"}>
                    {calculatedStatus}
                  </Badge>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={formLoading}>
                {formLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingBill ? "Save Changes" : "Create Invoice"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Invoice Detail / Print Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-end gap-2 mb-4 no-print">
            <Button onClick={printInvoice} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5">
              <Printer className="w-4 h-4" /> Print Invoice
            </Button>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
          </div>

          <div id="invoice-print-area" className="p-8 bg-white text-gray-900 border rounded-lg shadow-sm">
            <div className="flex justify-between items-start border-b pb-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <img src="/Jia-Pixel-Logo.svg" alt="Jia Pixel Logo" className="w-10 h-10 object-contain" />
                  <span className="text-3xl font-extrabold text-primary tracking-tight">JIA<span className="text-gray-800 text-lg font-bold ml-1">Pixel</span></span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Premium Web Solutions & Digital Services</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold uppercase text-gray-700">INVOICE</h2>
                <p className="text-lg font-bold text-gray-900 mt-1">#${selectedBill?.invoiceNo}</p>
                <p className="text-sm text-gray-500 mt-1">Date: {selectedBill?.date ? new Date(selectedBill.date).toLocaleDateString() : ""}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
              <div>
                <h3 className="font-bold text-gray-700 uppercase tracking-wider mb-2">Billing To:</h3>
                <div className="font-bold text-base text-gray-900">{selectedBill?.clientName}</div>
                {selectedBill?.businessName && <div className="font-semibold text-gray-700">{selectedBill.businessName}</div>}
                <div>Email: {selectedBill?.clientEmail}</div>
                <div>WhatsApp: <a href={`https://wa.me/${cleanWhatsApp(selectedBill?.clientPhone)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedBill?.clientPhone}</a></div>
                <div>Address: {selectedBill?.clientAddress}</div>
              </div>
              <div className="text-right">
                <h3 className="font-bold text-gray-700 uppercase tracking-wider mb-2">Service Provider:</h3>
                <div className="font-semibold text-gray-900">Jiapixel</div>
                <div>Email: <a href="mailto:mail.jiapixel@gmail.com" className="text-blue-600 hover:underline">mail.jiapixel@gmail.com</a></div>
                <div>WhatsApp: <a href="https://wa.me/8801919011101" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">8801919011101</a></div>
                <div>Website: <a href="https://www.jiapixel.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.jiapixel.com</a></div>
              </div>
            </div>

            <table className="w-full text-left border-collapse text-sm mb-8">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50 text-gray-700 font-bold">
                  <th className="py-2.5 px-3">Service Details</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedBill?.items?.map((item: any, idx: number) => (
                  <tr key={idx} className="border-b">
                    <td className="py-3 px-3 font-medium text-gray-900">{item.name}</td>
                    <td className="py-3 px-3 text-right">{getCurrencySymbol(selectedBill?.currency)}{item.price?.toLocaleString()}</td>
                    <td className="py-3 px-3 text-center">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-semibold">{getCurrencySymbol(selectedBill?.currency)}{(item.price * item.quantity)?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end text-sm">
              <div className="w-80 space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="font-semibold">{getCurrencySymbol(selectedBill?.currency)}{selectedBill?.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Maintenance:</span>
                  <span className="font-semibold">+ {getCurrencySymbol(selectedBill?.currency)}{selectedBill?.serviceCharge?.toLocaleString()}</span>
                </div>
                {selectedBill?.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span>- {getCurrencySymbol(selectedBill?.currency)}{selectedBill?.discount?.toLocaleString()}</span>
                  </div>
                )}
                {selectedBill?.prevDue > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Previous Due:</span>
                    <span>+ {getCurrencySymbol(selectedBill?.currency)}{selectedBill?.prevDue?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between border-t-2 border-double border-gray-300 pt-2 text-base font-bold text-gray-900">
                  <span>Grand Total:</span>
                  <span>{getCurrencySymbol(selectedBill?.currency)}{selectedBill?.gTotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Amount Paid:</span>
                  <span>{getCurrencySymbol(selectedBill?.currency)}{selectedBill?.cashIn?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-rose-600 font-bold border-t border-dashed pt-1.5 text-lg">
                  <span>Current Due:</span>
                  <span>{getCurrencySymbol(selectedBill?.currency)}{selectedBill?.currentBillDue?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {selectedBill?.renewDate && (
              <div className="mt-12 border-t pt-6 text-center text-xs text-gray-500">
                <p className="text-blue-600 font-semibold uppercase tracking-wider">
                  Next Renewal Date: {new Date(selectedBill.renewDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {selectedBill?.adminNote && (
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg no-print">
              <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-1">Internal Admin Note (Hidden from Client)</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 whitespace-pre-wrap">{selectedBill.adminNote}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
