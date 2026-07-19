"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import NovelEditor from "@/app/components/editor/NovelEditor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle2, Clock, DollarSign, Loader2, ArrowRight, User, ExternalLink, FileText, Printer } from "lucide-react";
import Link from "next/link";
import AuthModal from "@/components/AuthModal";
import Image from "next/image";

interface ProposalClientProps {
    slug: string;
}

export default function ProposalClient({ slug }: ProposalClientProps) {
    const { data: session, status: authStatus } = useSession();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [pendingAccept, setPendingAccept] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/custom-orders/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrder(data.order);
                } else {
                    toast.error("Proposal not found or you don't have access.");
                }
            } catch (error) {
                toast.error("Failed to load proposal details.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [slug]);

    const handleAccept = useCallback(async () => {
        if (authStatus !== "authenticated") {
            setPendingAccept(true);
            localStorage.setItem(`pending_accept_${slug}`, "true");
            setIsAuthModalOpen(true);
            return;
        }

        setAccepting(true);
        try {
            const res = await fetch(`/api/custom-orders/${slug}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "accepted" })
            });

            if (res.ok) {
                const data = await res.json();
                toast.success("Proposal accepted successfully!");
                // Update local state with the updated order. 
                // We also manually set the client data from session to ensure isAssignedClient becomes true instantly.
                if (data.order) {
                    setOrder({
                        ...data.order,
                        client: {
                            id: session?.user?.id,
                            name: session?.user?.name,
                            email: session?.user?.email,
                            image: session?.user?.image
                        }
                    });
                }
            } else {
                const errorData = await res.json();
                toast.error(errorData.error || "Failed to accept proposal.");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again later.");
        } finally {
            setAccepting(false);
        }
    }, [authStatus, slug]);

    // Check for pending accept on mount/auth change
    useEffect(() => {
        const wasPending = localStorage.getItem(`pending_accept_${slug}`);
        if (authStatus === "authenticated" && (pendingAccept || wasPending)) {
            localStorage.removeItem(`pending_accept_${slug}`);
            setPendingAccept(false);
            setIsAuthModalOpen(false);
            handleAccept();
        }
    }, [authStatus, pendingAccept, slug, handleAccept]);

    const printProposal = () => {
        const editorContent = document.querySelector(".prose")?.innerHTML || "";
        const currencySymbol = order.currency === "BDT" ? "৳" : "$";
        const priceText = order.price ? `${currencySymbol}${order.price.toLocaleString()}` : "TBD";
        const dateText = new Date(order.createdAt).toLocaleDateString();
        const dueDateText = order.dueDate ? new Date(order.dueDate).toLocaleDateString() : "TBD";
        
        const clientHtml = order.client ? `
          <div class="mb-8 text-sm bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 class="font-bold text-gray-700 uppercase tracking-wider mb-2">Prepared For:</h3>
            <div class="font-bold text-base text-gray-900">${order.client.name || ''}</div>
            <div class="text-gray-600">${order.client.email || ''}</div>
          </div>
        ` : '';

        const win = window.open("", "_blank");
        if (win) {
            win.document.write(`
                <html>
                  <head>
                    <title>Proposal - ${order.title}</title>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                    <style>
                      body { font-family: sans-serif; padding: 40px; color: #1f2937; }
                      .text-primary { color: oklch(0.648 0.2 131.684); }
                      .prose { max-width: 100%; }
                      .prose h1 { font-size: 2.25rem; font-weight: 800; margin-top: 1.5rem; margin-bottom: 1rem; }
                      .prose h2 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 1rem; border-b: 1px solid #e5e7eb; padding-bottom: 0.5rem; }
                      .prose h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.75rem; }
                      .prose p { margin-top: 0.5rem; margin-bottom: 0.5rem; line-height: 1.625; }
                      .prose ul { list-style-type: disc; padding-left: 1.625rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
                      .prose ol { list-style-type: decimal; padding-left: 1.625rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
                      .prose li { margin-top: 0.25rem; margin-bottom: 0.25rem; }
                      .prose strong { font-weight: 700; }
                      .prose blockquote { border-left: 4px solid #e5e7eb; padding-left: 1rem; font-style: italic; color: #4b5563; }
                      .prose img { max-width: 100%; height: auto; border-radius: 0.375rem; margin: 1rem 0; }
                      .prose table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
                      .prose th, .prose td { border: 1px solid #e5e7eb; padding: 0.5rem 0.75rem; text-align: left; }
                      .prose th { background-color: #f9fafb; font-weight: 600; }
                      @page {
                        size: A4;
                        margin: 20mm;
                      }
                      @media print {
                        .no-print { display: none; }
                        body { padding: 0; margin: 0; }
                      }
                    </style>
                  </head>
                  <body onload="window.print(); window.close();">
                    <div class="max-w-4xl mx-auto">
                      <!-- Header with Logo -->
                      <div class="flex justify-between items-start border-b pb-6 mb-8">
                        <div>
                          <div class="flex items-center gap-2 mb-2">
                            <img src="/Jia-Pixel-Logo.svg" alt="Jia Pixel Logo" class="w-10 h-10 object-contain" />
                            <span class="text-3xl font-extrabold text-primary tracking-tight">JIA<span class="text-gray-800 text-lg font-bold ml-1">Pixel</span></span>
                          </div>
                          <p class="text-sm text-gray-500 mt-1">Premium Web Solutions & Digital Services</p>
                        </div>
                        <div class="text-right">
                          <h2 class="text-xl font-bold uppercase text-gray-700 tracking-wider">PROJECT PROPOSAL</h2>
                          <p class="text-sm text-gray-500 mt-1.5"><strong>Investment:</strong> ${priceText}</p>
                          <p class="text-sm text-gray-500 mt-0.5"><strong>Expected Delivery:</strong> ${dueDateText}</p>
                        </div>
                      </div>

                      <!-- Client Details -->
                      ${clientHtml}

                      <!-- Proposal Content Title -->
                      <div class="mb-6">
                        <h1 class="text-3xl font-extrabold text-gray-900 mb-2">${order.title}</h1>
                        <div class="h-1 w-20 bg-blue-600 rounded"></div>
                      </div>

                      <!-- Proposal Content (from Editor) -->
                      <div class="prose">
                        ${editorContent}
                      </div>

                      <!-- Footer note -->
                      <div class="mt-16 border-t pt-6 text-center text-xs text-gray-500">
                        <p class="mb-1 font-semibold text-gray-400">This is a computer-generated document, no signature is required.</p>
                        <p>© ${new Date().getFullYear()} JiaPixel. All rights reserved.</p>
                        <p class="mt-1">www.jiapixel.com | mail.jiapixel@gmail.com</p>
                      </div>
                    </div>
                  </body>
                </html>
            `);
            win.document.close();
        }
    };

    const parseNovelContent = (jsonString: string) => {
        try {
            if (!jsonString) return undefined;
            return JSON.parse(jsonString);
        } catch (e) {
            // Fallback for plain text
            return {
                type: "doc",
                content: [
                    {
                        type: "paragraph",
                        content: [{ type: "text", text: jsonString }]
                    }
                ]
            };
        }
    };

    if (loading || authStatus === "loading") {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-card rounded-lg border shadow-sm">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="mt-4 text-muted-foreground font-medium text-lg">Loading your proposal details...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <Card className="text-center py-16 shadow-lg border-destructive/20 border-2">
                <CardContent>
                    <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold">404</span>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Proposal Not Found</h2>
                    <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                        The link may be invalid, expired, or you don't have permission to view it.
                    </p>
                    <Link href="/">
                        <Button variant="outline">Return Home</Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    const isProposed = order.status === "proposed";
    const hasClient = !!order.client;
    const isAssignedClient = hasClient &&
        session?.user?.email?.toLowerCase() === order.client?.email?.toLowerCase();

    // We show the button if it's still proposed. If guest, clicking triggers AuthModal.
    const showActionButtons = isProposed;

    // Check if the current user viewing is an admin
    const isAdmin = session?.user?.role === "admin";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="overflow-hidden shadow-md">
                    <CardHeader className="bg-muted/30 border-b">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl">{order.title}</CardTitle>
                                <CardDescription className="mt-2 text-sm">
                                    Created on {new Date(order.createdAt).toLocaleDateString()}
                                </CardDescription>
                            </div>
                            <Badge
                                variant={isProposed ? "outline" : "default"}
                                className="text-sm px-3 py-1 capitalize border-2 shadow-sm"
                            >
                                {order.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="bg-card w-full">
                            <NovelEditor
                                initialValue={parseNovelContent(order.description)}
                                readOnly={true}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
                <Card className="shadow-md">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-green-500" /> Investment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-4xl font-extrabold text-foreground">
                                {order.currency === "BDT" ? "৳" : "$"}{order.price?.toLocaleString() || "TBD"}
                            </p>
                        </div>

                        <div className="h-px w-full bg-border my-4" />

                        {order.dueDate && (
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                                <div>
                                    <p className="font-medium">Expected Delivery</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(order.dueDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="pt-2 no-print">
                            <Button onClick={printProposal} className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 h-11">
                                <Printer className="w-4 h-4" /> Print/Download PDF
                            </Button>
                        </div>
                    </CardContent>

                    {showActionButtons && (
                        <CardFooter className="pt-2 pb-6 px-6 bg-muted/10 border-t flex flex-col gap-3">
                            <p className="text-xs text-center text-muted-foreground w-full mb-2">
                                By accepting this proposal, you agree to officially commence work on this project based on the scope detailed above.
                            </p>
                            <Button
                                onClick={handleAccept}
                                disabled={accepting}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium shadow-md h-12 text-md"
                            >
                                <CheckCircle2 className="w-5 h-5 mr-2" />
                                {accepting ? "Accepting..." : "Accept Proposal & Begin"}
                            </Button>
                        </CardFooter>
                    )}

                    {!isProposed && isAssignedClient && (
                        <CardFooter className="pt-4 pb-6 px-6 bg-green-50/50 dark:bg-green-950/20 border-t flex flex-col items-center">
                            <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
                            <h4 className="font-semibold text-green-700 dark:text-green-400">Proposal Accepted</h4>
                            <p className="text-sm text-center text-green-600/80 dark:text-green-400/80 mt-1 mb-4">
                                Your order is now active.
                            </p>
                            <div className="flex flex-col gap-3 w-full mb-4">
                                {order.paymentLink && (
                                    <a href={order.paymentLink} target="_blank" rel="noopener noreferrer" className="w-full">
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12">
                                            <DollarSign className="w-5 h-5 mr-2" /> Make Payment <ExternalLink className="w-4 h-4 ml-2 opacity-70" />
                                        </Button>
                                    </a>
                                )}
                                {order.requirementsLink && (
                                    <a href={order.requirementsLink} target="_blank" rel="noopener noreferrer" className="w-full">
                                        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold h-12">
                                            <FileText className="w-5 h-5 mr-2" /> Submit Requirements <ExternalLink className="w-4 h-4 ml-2 opacity-70" />
                                        </Button>
                                    </a>
                                )}
                            </div>
                            <Link href="/dashboard" className="w-full">
                                <Button variant="outline" className="w-full">
                                    Go to Client Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </CardFooter>
                    )}

                    {!isAssignedClient && hasClient && authStatus === "authenticated" && (
                        <CardFooter className="pt-4 pb-4 px-6 bg-muted/30 border-t">
                            <p className="text-sm text-muted-foreground text-center italic w-full">
                                You are viewing this proposal as an administrator or third-party observer. Only the assigned client can formally accept it.
                            </p>
                        </CardFooter>
                    )}
                </Card>

                {isAdmin && hasClient && (
                    <Card className="shadow-md">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" /> Assigned Client
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4 border p-4 rounded-lg bg-muted/30">
                                {order.client.image ? (
                                    <Image
                                        src={order.client.image}
                                        alt={order.client.name || "Client Avatar"}
                                        width={48}
                                        height={48}
                                        className="rounded-full shadow-sm"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold shadow-sm">
                                        {order.client.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                )}
                                <div className="overflow-hidden">
                                    <p className="font-semibold text-foreground truncate">{order.client.name}</p>
                                    <p className="text-sm text-muted-foreground truncate">{order.client.email}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => {
                    setIsAuthModalOpen(false);
                    setPendingAccept(false);
                }}
            />
        </div>
    );
}
