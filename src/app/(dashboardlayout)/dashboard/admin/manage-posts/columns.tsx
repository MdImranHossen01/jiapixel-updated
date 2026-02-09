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

export type Post = {
    _id: string
    title: string
    slug: string
    createdAt: string
    isIndexedInGoogle: boolean
}

const handleIndexToggle = async (id: string, slug: string, diff: boolean) => {
    try {
        const res = await fetch(`/api/posts/${slug}`, {
            method: 'PUT',
            body: JSON.stringify({ isIndexedInGoogle: diff }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            toast.success(`Google Index status updated to ${diff ? 'Indexed' : 'Not Indexed'}`);
            window.location.reload();
        } else {
            toast.error("Failed to update status");
        }
    } catch (e) {
        toast.error("Error updating status");
    }
}

export const columns: ColumnDef<Post>[] = [
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
                            <Link href={`/dashboard/admin/manage-posts/edit/${slug}`} className="font-medium hover:underline text-primary">
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
            const isIndexed = row.getValue("isIndexedInGoogle") as boolean;
            const slug = row.original.slug;
            const id = row.original._id;

            return (
                <div className="flex items-center space-x-2">
                    <Switch
                        checked={isIndexed}
                        onCheckedChange={(checked) => handleIndexToggle(id, slug, checked)}
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
            const diffTime = Math.abs(now.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return `${diffDays} days ago`
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const post = row.original

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
                            onClick={() => navigator.clipboard.writeText(post._id)}
                        >
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/posts/${post.slug}`} target="_blank">View Public</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/admin/manage-posts/edit/${post.slug}`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={async () => {
                                if (confirm("Are you sure?")) {
                                    await fetch(`/api/posts/${post.slug}`, { method: 'DELETE' });
                                    window.location.reload();
                                }
                            }}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
