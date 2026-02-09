
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NewsletterCardClientProps {
    newsletter: any;
}

export default function NewsletterCardClient({ newsletter }: NewsletterCardClientProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            draft: {
                variant: "secondary" as const,
                label: "Draft",
            },
            published: {
                variant: "default" as const,
                label: "Published",
            },
            archived: {
                variant: "outline" as const,
                label: "Archived",
            },
        };

        const config =
            statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const handleDelete = async () => {
        if (
            !confirm(
                `Are you sure you want to delete "${newsletter.title}"? This action cannot be undone.`
            )
        ) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/newsletters/${newsletter.slug}`, {
                method: "DELETE",
            });

            if (response.ok) {
                router.refresh();
            } else {
                alert("Failed to delete newsletter");
            }
        } catch (error) {
            console.error("Error deleting newsletter:", error);
            alert("Error deleting newsletter");
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
                            <div className="flex-shrink-0">{getStatusBadge(newsletter.status)}</div>
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
