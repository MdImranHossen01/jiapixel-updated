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

interface ProjectAdminActionsProps {
    projectSlug: string;
    projectTitle: string;
}

export default function ProjectAdminActions({
    projectSlug,
    projectTitle,
}: ProjectAdminActionsProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const isAdmin = session?.user?.role === "admin";

    if (!isAdmin) return null;

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${projectTitle}"?`)) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/projects/${projectSlug}`, {
                method: "DELETE",
            });

            if (response.ok) {
                router.push("/dashboard/admin/manage-projects");
            } else {
                alert("Failed to delete project");
            }
        } catch (error) {
            console.error("Error deleting project:", error);
            alert("Error deleting project");
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
                    onClick={() => router.push("/dashboard/admin/manage-projects/create")}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => router.push("/dashboard/admin/manage-projects")}
                >
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Manage
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() =>
                        router.push(`/dashboard/admin/manage-projects/edit/${projectSlug}`)
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
