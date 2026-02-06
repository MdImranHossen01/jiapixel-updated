"use client";

import { useSession } from "next-auth/react";
import { MoreVertical, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface CategoryAdminActionsProps {
    categorySlug: string;
}

export default function CategoryAdminActions({
    categorySlug,
}: CategoryAdminActionsProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const isAdmin = session?.user?.role === "admin";

    if (!isAdmin) return null;

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
                        router.push(`/dashboard/admin/manage-categories/edit/${categorySlug}`)
                    }
                >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
