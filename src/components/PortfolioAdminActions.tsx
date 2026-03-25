"use client";

import { useSession } from "next-auth/react";
import { MoreVertical, Edit, Trash2, Plus, LayoutGrid } from "lucide-react";
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
import Swal from "sweetalert2";

interface PortfolioAdminActionsProps {
    portfolioSlug: string;
    portfolioTitle: string;
}

export default function PortfolioAdminActions({
    portfolioSlug,
    portfolioTitle,
}: PortfolioAdminActionsProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const isAdmin = session?.user?.role === "admin";

    if (!isAdmin) return null;

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Delete Portfolio?',
            text: `Are you sure you want to delete "${portfolioTitle}"? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            setIsDeleting(true);
            try {
                const response = await fetch(`/api/portfolios/${portfolioSlug}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Portfolio has been removed.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    router.push("/portfolios");
                    router.refresh();
                } else {
                    const data = await response.json();
                    Swal.fire('Error!', data.error || 'Failed to delete portfolio', 'error');
                }
            } catch (error) {
                console.error("Error deleting portfolio:", error);
                Swal.fire('Error!', 'An unexpected error occurred.', 'error');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-white hover:bg-white/10 hover:text-white"
                >
                    <MoreVertical className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-1">
                <DropdownMenuItem
                    onClick={() => router.push("/dashboard/admin/manage-portfolios/create")}
                    className="cursor-pointer"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => router.push("/dashboard/admin/manage-portfolios")}
                    className="cursor-pointer"
                >
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Manage
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() =>
                        router.push(`/dashboard/admin/manage-portfolios/edit/${portfolioSlug}`)
                    }
                    className="cursor-pointer"
                >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-destructive focus:text-destructive cursor-pointer"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
