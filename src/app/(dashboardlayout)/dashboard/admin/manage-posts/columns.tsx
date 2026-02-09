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

export type Post = {
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
            const res = await fetch(`/api/posts/${slug}`, {
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

const ActionsCell = ({ post }: { post: Post }) => {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure?")) return;

        try {
            const res = await fetch(`/api/posts/${post.slug}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success("Post deleted successfully");
                router.refresh();
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("An error occurred while deleting");
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
                    onClick={handleDelete}
                >
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
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
            const msPerDay = 1000 * 60 * 60 * 24;
            const diffMs = now.getTime() - date.getTime();

            if (diffMs > 0) {
                const diffDays = Math.floor(diffMs / msPerDay);
                if (diffDays === 0) return "Today";
                if (diffDays === 1) return "1 day ago";
                return `${diffDays} days ago`;
            } else {
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
            return <ActionsCell post={row.original} />
        },
    },
]
