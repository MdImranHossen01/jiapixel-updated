"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface WritingCardClientProps {
    writing: any;
}

export default function WritingCardClient({ writing }: WritingCardClientProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (
            !confirm(
                `Are you sure you want to delete "${writing.title}"? This action cannot be undone.`
            )
        ) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/writings/${writing.slug}`, {
                method: "DELETE",
            });

            if (response.ok) {
                router.refresh();
            } else {
                alert("Failed to delete writing");
            }
        } catch (error) {
            console.error("Error deleting writing:", error);
            alert("Error deleting writing");
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
                                    {writing.title}
                                </h3>
                                {writing.excerpt && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {writing.excerpt}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                        <div className="flex items-center gap-2 text-sm">
                            <Link
                                href={`/writings/${writing.slug}`}
                                target="_blank"
                                className="text-primary hover:text-primary/80 font-medium transition-colors"
                            >
                                View
                            </Link>
                            <span className="text-border">|</span>
                            <Link
                                href={`/dashboard/admin/manage-writings/edit/${writing.slug}`}
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
