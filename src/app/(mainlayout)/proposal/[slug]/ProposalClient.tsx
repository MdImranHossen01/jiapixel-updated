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
        const currencySymbol = order?.currency === "BDT" ? "৳" : "$";
        const priceText = order?.price ? `${currencySymbol}${order.price.toLocaleString()}` : "TBD";
        const dueDateText = order?.dueDate ? new Date(order.dueDate).toLocaleDateString() : "TBD";
        
        const clientHtml = order?.client ? `
          <div class="client-box">
            <h3 class="client-label">Prepared For:</h3>
            <div class="client-name">${order.client.name || ''}</div>
            <div class="client-email">${order.client.email || ''}</div>
          </div>
        ` : '';

        // Create invisible iframe for 100% reliable printing without popup blocking
        const printFrame = document.createElement("iframe");
        printFrame.style.position = "fixed";
        printFrame.style.left = "-9999px";
        printFrame.style.top = "-9999px";
        printFrame.style.width = "0";
        printFrame.style.height = "0";
        printFrame.style.border = "none";
        printFrame.style.opacity = "0";
        printFrame.style.pointerEvents = "none";
        document.body.appendChild(printFrame);

        const frameDoc = printFrame.contentWindow?.document;
        if (!frameDoc) {
            toast.error("Could not initialize printing");
            return;
        }

        frameDoc.open();
        frameDoc.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Proposal - ${order?.title || "Project"}</title>
                <style>
                  @page {
                    size: A4;
                    margin: 15mm 20mm;
                  }
                  * { box-sizing: border-box; }
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    padding: 20px;
                    color: #1f2937;
                    line-height: 1.6;
                    font-size: 14px;
                    background: #fff;
                  }
                  .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    border-bottom: 2px solid #e5e7eb;
                    padding-bottom: 20px;
                    margin-bottom: 24px;
                  }
                  .brand {
                    font-size: 26px;
                    font-weight: 800;
                    color: #5ea500;
                    letter-spacing: -0.5px;
                  }
                  .brand span {
                    color: #1f2937;
                    font-size: 16px;
                    font-weight: 700;
                    margin-left: 2px;
                  }
                  .subtitle {
                    font-size: 12px;
                    color: #6b7280;
                    margin-top: 4px;
                  }
                  .meta {
                    text-align: right;
                  }
                  .meta h2 {
                    font-size: 18px;
                    font-weight: 800;
                    text-transform: uppercase;
                    color: #374151;
                    margin: 0 0 6px 0;
                  }
                  .meta p {
                    margin: 2px 0;
                    font-size: 13px;
                    color: #4b5563;
                  }
                  .client-box {
                    margin-bottom: 24px;
                    padding: 16px 20px;
                    background: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                  }
                  .client-label {
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #6b7280;
                    margin: 0 0 6px 0;
                  }
                  .client-name {
                    font-weight: 700;
                    font-size: 15px;
                    color: #111827;
                  }
                  .client-email {
                    color: #4b5563;
                    font-size: 13px;
                  }
                  .title-section {
                    margin-bottom: 20px;
                  }
                  .title-section h1 {
                    font-size: 24px;
                    font-weight: 800;
                    color: #111827;
                    margin: 0 0 8px 0;
                  }
                  .divider {
                    width: 60px;
                    height: 4px;
                    background: #2563eb;
                    border-radius: 2px;
                  }
                  .prose {
                    color: #374151;
                    font-size: 14px;
                  }
                  .prose h1, .prose h2, .prose h3, .prose h4 {
                    color: #111827;
                    font-weight: 700;
                    margin-top: 24px;
                    margin-bottom: 12px;
                  }
                  .prose h1 { font-size: 22px; }
                  .prose h2 { font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
                  .prose h3 { font-size: 15px; }
                  .prose p { margin: 8px 0; }
                  .prose ul { list-style-type: disc; padding-left: 24px; margin: 8px 0; }
                  .prose ol { list-style-type: decimal; padding-left: 24px; margin: 8px 0; }
                  .prose li { margin: 4px 0; }
                  .prose strong { font-weight: 700; color: #111827; }
                  .prose table { width: 100%; border-collapse: collapse; margin: 16px 0; }
                  .prose th, .prose td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
                  .prose th { background-color: #f9fafb; font-weight: 600; }
                  .prose blockquote { border-left: 4px solid #e5e7eb; padding-left: 14px; font-style: italic; color: #4b5563; }
                  .footer {
                    margin-top: 40px;
                    border-top: 1px solid #e5e7eb;
                    padding-top: 16px;
                    text-align: center;
                    font-size: 11px;
                    color: #6b7280;
                  }
                </style>
              </head>
              <body>
                <div class="header">
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                      <img src="/Jia-Pixel-Logo.svg" alt="Jia Pixel Logo" style="width: 32px; height: 32px; object-fit: contain;" />
                      <div class="brand">JIA<span>Pixel</span></div>
                    </div>
                    <div class="subtitle">Premium Web Solutions & Digital Services</div>
                  </div>
                  <div class="meta">
                    <h2>PROJECT DETAILS</h2>
                    <p><strong>Investment:</strong> ${priceText}</p>
                    <p><strong>Expected Delivery:</strong> ${dueDateText}</p>
                  </div>
                </div>

                ${clientHtml}

                <div class="title-section">
                  <h1>${order?.title || "Project Proposal"}</h1>
                  <div class="divider"></div>
                </div>

                <div class="prose">
                  ${editorContent}
                </div>

                <div class="footer">
                  <p style="margin-bottom: 4px; font-weight: 600; color: #9ca3af;">This is a computer-generated document, no signature is required.</p>
                  <p>© ${new Date().getFullYear()} JiaPixel. All rights reserved. | www.jiapixel.com | mail.jiapixel@gmail.com</p>
                </div>
              </body>
            </html>
        `);
        frameDoc.close();

        setTimeout(() => {
            printFrame.contentWindow?.focus();
            printFrame.contentWindow?.print();
            setTimeout(() => {
                document.body.removeChild(printFrame);
            }, 1000);
        }, 300);
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
