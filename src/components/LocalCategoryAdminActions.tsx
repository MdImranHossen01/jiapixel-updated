"use client";

import { useSession } from "next-auth/react";
import { MoreVertical, Edit, Plus, LayoutGrid, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface LocalCategoryAdminActionsProps {
    categorySlug: string;
    categoryTitle?: string;
}

export default function LocalCategoryAdminActions({
    categorySlug,
    categoryTitle,
}: LocalCategoryAdminActionsProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const isAdmin = session?.user?.role === "admin";

    if (!isAdmin) return null;

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${categoryTitle || 'this category'}"?`)) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/local-categories/${categorySlug}`, {
                method: "DELETE",
            });

            if (response.ok) {
                router.push("/");
                router.refresh();
            } else {
                alert("Failed to delete category");
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            alert("Error deleting category");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    aria-label="More options"
                >
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-0 shadow-lg">
                <DropdownMenuItem
                    onClick={() => router.push("/dashboard/admin/manage-local-categories/create")}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => router.push("/dashboard/admin/manage-local-categories")}
                >
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Manage
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() =>
                        router.push(`/dashboard/admin/manage-local-categories/edit/${categorySlug}`)
                    }
                >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-destructive focus:text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
