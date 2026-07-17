"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Printer, DollarSign, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";

interface BillItem {
  name: string;
  quantity: number;
  price: number;
  link?: string;
}

interface BillData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  businessName?: string;
  invoiceNo: string;
  date: string;
  items: BillItem[];
  subtotal: number;
  serviceCharge: number;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  discount: number;
  total: number;
  prevDue: number;
  gTotal: number;
  cashIn: number;
  currentBillDue: number;
  status: 'Paid' | 'Due';
  currency: 'BDT' | 'USD';
  renewDate?: string;
  renewFee?: number;
  adminNote?: string;
}

export default function BillViewClient({ invoiceNo }: { invoiceNo: string }) {
  const [bill, setBill] = useState<BillData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await fetch(`/api/public/bills/${invoiceNo}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Invoice not found");
          }
          throw new Error("Failed to load invoice details");
        }
        const data = await res.json();
        setBill(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchBill();
  }, [invoiceNo]);

  const cleanWhatsApp = (num?: string) => num ? num.replace(/[^\d]/g, "") : "";
  const getCurrencySymbol = (curr?: string) => curr === "USD" ? "$" : "৳";

  const printInvoice = () => {
    const printContent = document.getElementById("invoice-print-area")?.innerHTML;
    if (printContent) {
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>Invoice - ${bill?.invoiceNo}</title>
              <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
              <style>
                body { font-family: sans-serif; padding: 20px; }
                .text-primary { color: oklch(0.648 0.2 131.684); }
                .text-rose-600 { color: #dc2626 !important; }
                .text-emerald-600 { color: #059669 !important; }
                @media print {
                  .no-print { display: none; }
                  .text-rose-600 { color: #dc2626 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                  .text-emerald-600 { color: #059669 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="mt-4 text-muted-foreground font-medium text-lg">Loading invoice details...</p>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="max-w-md mx-auto my-12 px-4">
        <Card className="text-center py-12 shadow-lg border-destructive/20 border-2">
          <CardContent>
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">404</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Invoice Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error || "The bill or invoice you are looking for does not exist or has been deleted."}
            </p>
            <Link href="/">
              <span className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer">
                Return Home
              </span>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-6 px-4 pb-12">
      {/* Action panel (hidden in print) */}
      <div className="flex justify-end gap-2 mb-4 no-print">
        <Button onClick={printInvoice} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5">
          <Printer className="w-4 h-4" /> Print Invoice
        </Button>
        {bill.status === "Due" && (
          <Link href={`/pay?amount=${bill.currentBillDue}&name=${encodeURIComponent(bill.clientName)}&email=${encodeURIComponent(bill.clientEmail)}&mobile=${encodeURIComponent(bill.clientPhone)}&notes=${encodeURIComponent(`Invoice #${bill.invoiceNo}`)}`}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" /> Pay Now
            </Button>
          </Link>
        )}
      </div>

      {/* Main Invoice Card */}
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
            <p className="text-lg font-bold text-gray-900 mt-1">#{bill.invoiceNo}</p>
            <p className="text-sm text-gray-500 mt-1">Date: {bill.date ? new Date(bill.date).toLocaleDateString() : ""}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
          <div>
            <h3 className="font-bold text-gray-700 uppercase tracking-wider mb-2">Billing To:</h3>
            <div className="font-bold text-base text-gray-900">{bill.clientName}</div>
            {bill.businessName && <div className="font-semibold text-gray-700">{bill.businessName}</div>}
            <div>Email: {bill.clientEmail}</div>
            <div>WhatsApp: <a href={`https://wa.me/${cleanWhatsApp(bill.clientPhone)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{bill.clientPhone}</a></div>
            <div>Address: {bill.clientAddress}</div>
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
            {bill.items?.map((item: any, idx: number) => (
              <tr key={idx} className="">
                <td className="py-3 px-3 font-medium text-gray-900">
                  {item.link ? (
                    <a
                      href={item.link.startsWith("http") ? item.link : `https://${item.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      {item.name}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    item.name
                  )}
                </td>
                <td className="py-3 px-3 text-right">{getCurrencySymbol(bill.currency)}{item.price?.toLocaleString()}</td>
                <td className="py-3 px-3 text-center">{item.quantity}</td>
                <td className="py-3 px-3 text-right font-semibold">{getCurrencySymbol(bill.currency)}{(item.price * item.quantity)?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end text-sm">
          <div className="w-80 space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal:</span>
              <span className="font-semibold">{getCurrencySymbol(bill.currency)}{bill.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Maintenance:</span>
              <span className="font-semibold">+ {getCurrencySymbol(bill.currency)}{bill.serviceCharge?.toLocaleString()}</span>
            </div>
            {bill.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount:</span>
                <span>- {getCurrencySymbol(bill.currency)}{bill.discount?.toLocaleString()}</span>
              </div>
            )}
            {bill.prevDue > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Previous Due:</span>
                <span>+ {getCurrencySymbol(bill.currency)}{bill.prevDue?.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between border-t-2 border-double border-gray-300 pt-2 text-base font-bold text-gray-900">
              <span>Grand Total:</span>
              <span>{getCurrencySymbol(bill.currency)}{bill.gTotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Amount Paid:</span>
              <span>{getCurrencySymbol(bill.currency)}{bill.cashIn?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-rose-600 font-bold border-t border-dashed pt-1.5 text-lg">
              <span>Current Due:</span>
              <span>{getCurrencySymbol(bill.currency)}{bill.currentBillDue?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {bill.renewDate && (
          <div className="mt-12 border-t pt-6 text-center text-xs text-gray-500 flex flex-col gap-1">
            <p className="text-blue-600 font-bold uppercase tracking-wider">
              Next Renewal Date: {new Date(bill.renewDate).toLocaleDateString()}
            </p>
            {bill.renewFee && bill.renewFee > 0 ? (
              <p className="text-gray-600 font-semibold">
                Renewal Price: {getCurrencySymbol(bill.currency)}{bill.renewFee.toLocaleString()}
              </p>
            ) : null}
          </div>
        )}
      </div>

      {bill.adminNote && (
        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg no-print">
          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-1">Internal Admin Note (Hidden from Client)</h4>
          <p className="text-sm text-amber-700 dark:text-amber-300 whitespace-pre-wrap">{bill.adminNote}</p>
        </div>
      )}
    </div>
  );
}
