"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import NovelEditor from "@/app/components/editor/NovelEditor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle2, Clock, DollarSign, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import AuthModal from "@/components/AuthModal";

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
                toast.success("Proposal accepted successfully!");
                setOrder((prev: any) => prev ? { ...prev, status: "accepted" } : null);
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

    const parseNovelContent = (jsonString: string) => {
        try {
            if (!jsonString) return undefined;
            return JSON.parse(jsonString);
        } catch (e) {
            return undefined;
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

    // We show the button if it's still proposed AND (it has no client assigned yet OR the logged user is the assigned client)
    const showActionButtons = isProposed && (!hasClient || isAssignedClient);

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
                                ${order.price?.toLocaleString() || "TBD"}
                            </p>
                            {order.isSubscription && order.billingCycle && (
                                <p className="text-sm text-muted-foreground mt-1 capitalize">
                                    Billed {order.billingCycle}
                                    {order.subscriptionDurationMonths && ` for ${order.subscriptionDurationMonths} months`}
                                </p>
                            )}
                        </div>

                        <div className="h-px w-full bg-border my-4" />

                        {!order.isSubscription && order.dueDate && (
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
