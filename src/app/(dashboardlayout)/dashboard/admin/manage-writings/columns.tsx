"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { toast } from "sonner"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation"

export type Writing = {
    _id: string
    title: string
    slug: string
    createdAt: string
    isIndexedInGoogle: boolean
}

const GoogleIndexCell = ({ writing }: { writing: Writing }) => {
    const router = useRouter();
    const isIndexed = writing.isIndexedInGoogle;

    const handleIndexToggle = async (checked: boolean) => {
        try {
            const res = await fetch(`/api/writings/${writing.slug}`, {
                method: 'PUT',
                body: JSON.stringify({ isIndexedInGoogle: checked }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                toast.success(`Google Index status updated to ${checked ? 'Indexed' : 'Not Indexed'}`);
                router.refresh();
            } else {
                toast.error("Failed to update status");
            }
        } catch (e) {
            toast.error("Error updating status");
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <Switch
                checked={isIndexed}
                onCheckedChange={handleIndexToggle}
            />
            <span className="text-sm text-muted-foreground">{isIndexed ? "Yes" : "No"}</span>
        </div>
    );
};

const ActionsCell = ({ writing }: { writing: Writing }) => {
    const router = useRouter();

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`/api/writings/${writing.slug}`, { method: 'DELETE' });
                if (res.ok) {
                    toast.success("Writing deleted successfully");
                    router.refresh();
                } else {
                    toast.error("Failed to delete writing");
                }
            } catch (e) {
                console.error("Error deleting writing:", e);
                toast.error("Error deleting writing");
            }
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(writing._id)}
                >
                    Copy ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={`/writings/${writing.slug}`} target="_blank">View Public</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={`/dashboard/admin/manage-writings/edit/${writing.slug}`}>Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={handleDelete}
                >
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const columns: ColumnDef<Writing>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const title: string = row.getValue("title");
            const truncated = title.length > 30 ? title.substring(0, 30) + "..." : title;
            const slug: string = row.original.slug;

            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href={`/writings/${slug}`} className="font-medium hover:underline text-primary">
                                {truncated}
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{title}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        },
    },
    {
        accessorKey: "isIndexedInGoogle",
        header: "Google Index",
        cell: ({ row }) => <GoogleIndexCell writing={row.original} />,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date Created
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return new Date(row.getValue("createdAt")).toLocaleDateString()
        },
    },
    {
        id: "daysAgo",
        header: "Days Ago",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"));
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return `${diffDays} days ago`
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell writing={row.original} />,
    },
]
