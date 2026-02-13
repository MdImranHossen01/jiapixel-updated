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
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

export type Service = {
    _id: string
    title: string
    slug: string
    createdAt: string
    isIndexedInGoogle: boolean
}

export const columns: ColumnDef<Service>[] = [
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
                            <Link href={`/services/${slug}`} className="font-medium hover:underline text-primary">
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
        cell: ({ row }) => {
            const router = useRouter();
            const isIndexed = row.getValue("isIndexedInGoogle") as boolean;
            const slug = row.original.slug;

            const handleIndexToggle = async (slug: string, diff: boolean) => {
                try {
                    const res = await fetch(`/api/services/${slug}`, {
                        method: 'PUT',
                        body: JSON.stringify({ isIndexedInGoogle: diff }),
                        headers: { 'Content-Type': 'application/json' }
                    });

                    if (res.ok) {
                        toast.success(`Google Index status updated to ${diff ? 'Indexed' : 'Not Indexed'}`);
                        router.refresh();
                    } else {
                        const errorData = await res.json();
                        toast.error(errorData.message || "Failed to update status");
                    }
                } catch (e) {
                    console.error("Error updating status:", e);
                    toast.error("Error updating status");
                }
            }

            return (
                <div className="flex items-center space-x-2">
                    <Switch
                        checked={isIndexed}
                        onCheckedChange={(checked) => handleIndexToggle(slug, checked)}
                    />
                    <span className="text-sm text-muted-foreground">{isIndexed ? "Yes" : "No"}</span>
                </div>
            )
        },
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

            // Reset time part to ensure we count calendar days
            date.setHours(0, 0, 0, 0);
            now.setHours(0, 0, 0, 0);

            const msPerDay = 1000 * 60 * 60 * 24;
            const diffMs = now.getTime() - date.getTime();

            if (diffMs > 0) {
                const diffDays = Math.floor(diffMs / msPerDay);
                if (diffDays === 0) return "Today";
                if (diffDays === 1) return "1 day ago";
                return `${diffDays} days ago`;
            } else {
                // Future date catch
                const futureDays = Math.floor(Math.abs(diffMs) / msPerDay);
                if (futureDays === 0) return "Today";
                if (futureDays === 1) return "in 1 day";
                return `in ${futureDays} days`;
            }
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const router = useRouter();
            const service = row.original

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
                        const res = await fetch(`/api/services/${service.slug}`, { method: 'DELETE' });
                        if (res.ok) {
                            toast.success("Service deleted successfully");
                            router.refresh();
                        } else {
                            const data = await res.json();
                            toast.error(data.message || "Failed to delete service");
                        }
                    } catch (error) {
                        console.error("Error deleting service:", error);
                        toast.error("An error occurred while deleting");
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
                            onClick={() => navigator.clipboard.writeText(service._id)}
                        >
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/services/${service.slug}`} target="_blank">View Public</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/admin/manage-services/edit/${service.slug}`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={handleDelete}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
