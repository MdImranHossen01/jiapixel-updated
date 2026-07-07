"use client";

import React, { useEffect, useState } from "react";
import { IClientProject } from "@/models/ClientProject";
import ProjectCard from "@/components/ProjectCard";
import { Loader2, CreditCard, Calendar, FileText, Eye, Printer } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function ClientDashboardPage() {
    const [projects, setProjects] = useState<IClientProject[]>([]);
    const [bills, setBills] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Viewing invoice modal state
    const [selectedBill, setSelectedBill] = useState<any>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsRes, billsRes] = await Promise.all([
                    fetch("/api/client/projects"),
                    fetch("/api/client/bills")
                ]);

                if (projectsRes.ok) {
                    const projectsData = await projectsRes.json();
                    if (projectsData.success) {
                        setProjects(projectsData.data);
                    }
                }

                if (billsRes.ok) {
                    const billsData = await billsRes.json();
                    if (billsData.success) {
                        setBills(billsData.data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calculate totals for client overview
    const totalDues = bills.reduce((sum, bill) => sum + (bill.currentBillDue || 0), 0);
    
    // Find nearest future renewal date
    const futureRenewDates = bills
        .map(b => b.renewDate ? new Date(b.renewDate) : null)
        .filter((d): d is Date => d !== null && d >= new Date())
        .sort((a, b) => a.getTime() - b.getTime());
    const nextRenewalDate = futureRenewDates.length > 0 ? futureRenewDates[0] : null;

    const printInvoice = () => {
        const printContent = document.getElementById("client-invoice-print-area")?.innerHTML;
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

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Client Portal</h1>
                    <p className="text-muted-foreground mt-1">Track your projects, transactions, dues, and renewal services.</p>
                </div>
                <Link href="/estimate">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md">Get New Quote</Button>
                </Link>
            </div>

            {/* Quick Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-rose-50/50 dark:bg-rose-950/10 border-rose-200/50 dark:border-rose-900/50 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-1">
                            <CardDescription className="text-rose-800 dark:text-rose-300 font-medium">Total Outstanding Dues</CardDescription>
                            <CardTitle className="text-3xl font-extrabold text-rose-950 dark:text-rose-100">
                                ৳{totalDues.toLocaleString()}
                            </CardTitle>
                        </div>
                        <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                            <CreditCard className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-rose-700 dark:text-rose-400/80">Please settle any pending bills to avoid service interruption.</p>
                    </CardContent>
                </Card>

                <Card className="bg-blue-50/50 dark:bg-blue-950/10 border-blue-200/50 dark:border-blue-900/50 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-1">
                            <CardDescription className="text-blue-800 dark:text-blue-300 font-medium">Next Renewal Date</CardDescription>
                            <CardTitle className="text-3xl font-extrabold text-blue-950 dark:text-blue-100">
                                {nextRenewalDate ? nextRenewalDate.toLocaleDateString() : "No Active Renewal"}
                            </CardTitle>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-blue-700 dark:text-blue-400/80">
                            {nextRenewalDate ? "Your service domain or hosting is scheduled for renewal." : "All your services are fully up to date."}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Invoices & Billing Section */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-600" /> Invoices & Billing
                </h2>

                <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
                    <CardContent className="p-0">
                        {bills.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                                <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">No Invoices</h3>
                                <p className="text-sm text-muted-foreground mt-1">There are no billing records associated with your account.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50 dark:bg-gray-950">
                                        <TableHead className="font-semibold">Invoice No</TableHead>
                                        <TableHead className="font-semibold">Services</TableHead>
                                        <TableHead className="font-semibold">Date</TableHead>
                                        <TableHead className="font-semibold text-right">Grand Total</TableHead>
                                        <TableHead className="font-semibold text-right">Paid</TableHead>
                                        <TableHead className="font-semibold text-right">Due</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="font-semibold text-right">Invoice</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bills.map((bill) => (
                                        <TableRow key={bill._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30">
                                            <TableCell className="font-medium text-blue-600 dark:text-blue-400">#{bill.invoiceNo}</TableCell>
                                            <TableCell className="max-w-[250px] truncate" title={bill.items.map((i: any) => i.name).join(", ")}>
                                                {bill.items.map((i: any) => i.name).join(", ")}
                                            </TableCell>
                                            <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right font-bold">৳{bill.gTotal?.toLocaleString()}</TableCell>
                                            <TableCell className="text-right text-emerald-600 dark:text-emerald-400">৳{bill.cashIn?.toLocaleString()}</TableCell>
                                            <TableCell className="text-right font-bold text-rose-600 dark:text-rose-400">৳{bill.currentBillDue?.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Badge variant={bill.status === "Paid" ? "default" : "destructive"}>
                                                    {bill.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex items-center gap-1 mx-auto text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-900"
                                                    onClick={() => {
                                                        setSelectedBill(bill);
                                                        setIsViewOpen(true);
                                                    }}
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Client Projects Section */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-blue-600" /> Active Projects
                </h2>

                {projects.length === 0 ? (
                    <div className="text-center py-12 bg-card border border-dashed border-border rounded-xl">
                        <h3 className="text-lg font-semibold mb-2">No Active Projects</h3>
                        <p className="text-muted-foreground mb-6">Looks like you don't have any projects with us yet.</p>
                        <div className="flex gap-4 justify-center">
                            <Link href="/services">
                                <Button variant="outline">Browse Services</Button>
                            </Link>
                            <Link href="/estimate">
                                <Button>Start a Project</Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {projects.map((project) => (
                            // @ts-ignore
                            <ProjectCard key={project._id} project={project} clientMode={true} />
                        ))}
                    </div>
                )}
            </div>

            {/* Printable Invoice Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-end gap-2 mb-4">
                        <Button onClick={printInvoice} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5">
                            <Printer className="w-4 h-4" /> Print Invoice
                        </Button>
                        <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
                    </div>

                    <div id="client-invoice-print-area" className="p-8 bg-white text-gray-900 border rounded-lg shadow-sm">
                        <div className="flex justify-between items-start border-b pb-6 mb-6">
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight text-blue-600">JIAPIXEL</h1>
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
                                <div>Email: {selectedBill?.clientEmail}</div>
                                <div>Phone: {selectedBill?.clientPhone}</div>
                                <div>Address: {selectedBill?.clientAddress}</div>
                            </div>
                            <div className="text-right">
                                <h3 className="font-bold text-gray-700 uppercase tracking-wider mb-2">Service Provider:</h3>
                                <div className="font-semibold text-gray-900">Jiapixel</div>
                                <div>Email: support@jiapixel.com</div>
                                <div>Website: www.jiapixel.com</div>
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
                                        <td className="py-3 px-3 text-right">৳{item.price?.toLocaleString()}</td>
                                        <td className="py-3 px-3 text-center">{item.quantity}</td>
                                        <td className="py-3 px-3 text-right font-semibold">৳{(item.price * item.quantity)?.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-end text-sm">
                            <div className="w-80 space-y-2 border-t pt-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal:</span>
                                    <span className="font-semibold">৳{selectedBill?.subtotal?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Service Charge:</span>
                                    <span className="font-semibold">+ ৳{selectedBill?.serviceCharge?.toLocaleString()}</span>
                                </div>
                                {selectedBill?.discount > 0 && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Discount:</span>
                                        <span>- ৳{selectedBill?.discount?.toLocaleString()}</span>
                                    </div>
                                )}
                                {selectedBill?.prevDue > 0 && (
                                    <div className="flex justify-between text-rose-600">
                                        <span>Previous Due:</span>
                                        <span>+ ৳{selectedBill?.prevDue?.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between border-t-2 border-double border-gray-300 pt-2 text-base font-bold text-gray-900">
                                    <span>Grand Total:</span>
                                    <span>৳{selectedBill?.gTotal?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-emerald-600 font-semibold">
                                    <span>Amount Paid:</span>
                                    <span>৳{selectedBill?.cashIn?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-rose-600 font-bold border-t border-dashed pt-1.5 text-lg">
                                    <span>Current Due:</span>
                                    <span>৳{selectedBill?.currentBillDue?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 border-t pt-6 text-center text-xs text-gray-500">
                            <p className="font-semibold">Thank you for your business!</p>
                            <p className="mt-1">This is a system generated invoice. For any inquiries, please contact support@jiapixel.com</p>
                            {selectedBill?.renewDate && (
                                <p className="mt-2 text-blue-600 font-semibold uppercase tracking-wider">
                                    Next Renewal Date: {new Date(selectedBill.renewDate).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
