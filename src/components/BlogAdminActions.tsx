"use client";

import { useSession } from "next-auth/react";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
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

interface BlogAdminActionsProps {
    blogSlug: string;
    blogTitle: string;
}

export default function BlogAdminActions({
    blogSlug,
    blogTitle,
}: BlogAdminActionsProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const isAdmin = session?.user?.role === "admin";

    if (!isAdmin) return null;

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${blogTitle}"?`)) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/blogs/${blogSlug}`, {
                method: "DELETE",
            });

            if (response.ok) {
                router.push("/blogs");
                router.refresh();
            } else {
                alert("Failed to delete blog");
            }
        } catch (error) {
            console.error("Error deleting blog:", error);
            alert("Error deleting blog");
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
                >
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-0 shadow-lg">
                <DropdownMenuItem
                    onClick={() =>
                        router.push(`/dashboard/admin/manage-blogs/edit/${blogSlug}`)
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
