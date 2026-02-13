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

export type Blog = {
    _id: string
    title: string
    slug: string
    createdAt: string
    isIndexedInGoogle: boolean
}

const GoogleIndexCell = ({ slug, isIndexed }: { slug: string; isIndexed: boolean }) => {
    const router = useRouter();

    const handleIndexToggle = async (checked: boolean) => {
        try {
            const res = await fetch(`/api/blogs/${slug}`, {
                method: 'PUT',
                body: JSON.stringify({ isIndexedInGoogle: checked }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                toast.success(`Google Index status updated to ${checked ? 'Indexed' : 'Not Indexed'}`);
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
                onCheckedChange={handleIndexToggle}
            />
            <span className="text-sm text-muted-foreground">{isIndexed ? "Yes" : "No"}</span>
        </div>
    )
}

const BlogActions = ({ blog }: { blog: Blog }) => {
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
                const res = await fetch(`/api/blogs/${blog.slug}`, { method: 'DELETE' });
                if (res.ok) {
                    toast.success("Blog deleted successfully");
                    router.refresh();
                } else {
                    const data = await res.json();
                    toast.error(data.message || "Failed to delete blog");
                }
            } catch (error) {
                console.error("Error deleting blog:", error);
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
                    onClick={() => navigator.clipboard.writeText(blog._id)}
                >
                    Copy ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={`/blogs/${blog.slug}`} target="_blank">View Public</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={`/dashboard/admin/manage-blogs/edit/${blog.slug}`}>Edit</Link>
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
}

export const columns: ColumnDef<Blog>[] = [
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
                            <Link href={`/blogs/${slug}`} className="font-medium hover:underline text-primary">
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
            return <GoogleIndexCell slug={row.original.slug} isIndexed={row.getValue("isIndexedInGoogle")} />
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

            // Normalize to midnight to compare calendar days
            const targetDate = new Date(date);
            targetDate.setHours(0, 0, 0, 0);
            const currentDate = new Date(now);
            currentDate.setHours(0, 0, 0, 0);

            const diffTime = currentDate.getTime() - targetDate.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 0) {
                if (diffDays === 1) return "1 day ago";
                return `${diffDays} days ago`;
            } else if (diffDays < 0) {
                const futureDays = Math.abs(diffDays);
                if (futureDays === 1) return "in 1 day";
                return `in ${futureDays} days`;
            } else {
                return "Today";
            }
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return <BlogActions blog={row.original} />
        },
    },
]
