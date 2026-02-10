
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface NewsletterCardClientProps {
    newsletter: any;
}

export default function NewsletterCardClient({ newsletter }: NewsletterCardClientProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);


    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You sure you want to delete "${newsletter.title}"? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (!result.isConfirmed) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/newsletters/${newsletter.slug}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Newsletter deleted successfully");
                router.refresh();
            } else {
                toast.error("Failed to delete newsletter");
            }
        } catch (error) {
            console.error("Error deleting newsletter:", error);
            toast.error("Error deleting newsletter");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-2">
                                    {newsletter.title}
                                </h3>

                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                        <div className="flex items-center gap-2 text-sm">
                            <Link
                                href={`/newsletters/${newsletter.slug}`}
                                target="_blank"
                                className="text-primary hover:text-primary/80 font-medium transition-colors"
                            >
                                View
                            </Link>
                            <span className="text-border">|</span>
                            <Link
                                href={`/dashboard/admin/manage-newsletters/edit/${newsletter.slug}`}
                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                                Edit
                            </Link>
                            <span className="text-border">|</span>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="text-destructive hover:text-destructive/80 font-medium transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
